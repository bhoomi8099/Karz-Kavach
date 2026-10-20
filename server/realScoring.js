// Scores a REAL app from signals we can read (Google Play listing + RBI directory).
// No AI: simple rules, every point comes with evidence and a source.
//
// Score = permission (max 40) + registration (max 40) + transparency (max 20)
// Levels: 0-29 proceed, 30-59 pause, 60+ stop.
//
// Wording rule: these are WARNING SIGNS in what we checked. Never "safe", "scam" or "fraud".
// Missing data is NOT risk: if we could not read something it is shown as "unknown"
// and it only lowers the confidence, it never adds points.

const { buildPermissionReport } = require('./playPermissions');

const MAX = { permission: 40, registration: 40, transparency: 20 };
const THRESHOLDS = { stop: 60, pause: 30 };
const LISTED_PERMISSION_FACTOR = 0.6; // a registered lender is accountable, so permissions weigh less

const LEVELS = {
  proceed: {
    en: 'Proceed with care',
    hi: 'सोच-समझकर आगे बढ़ें',
    subtitle: {
      en: 'Few warning signs found in what we checked.',
      hi: 'हमारी जाँच में कम चेतावनी संकेत मिले।',
    },
  },
  pause: {
    en: 'Pause and verify',
    hi: 'रुकें और जाँचें',
    subtitle: {
      en: 'Some warning signs. Check these before sharing any data.',
      hi: 'कुछ चेतावनी संकेत हैं। कोई भी डेटा देने से पहले इन्हें जाँचें।',
    },
  },
  stop: {
    en: 'Stop and think',
    hi: 'रुकिए, दोबारा सोचिए',
    subtitle: {
      en: 'Several warning signs. Think twice before installing.',
      hi: 'कई चेतावनी संकेत हैं। इंस्टॉल करने से पहले दोबारा सोचिए।',
    },
  },
};

const NOTE = {
  en: 'Based only on what we could read from the Google Play listing and the RBI directory on the date shown. These are warning signs, not proof of wrongdoing, and a good result is not a guarantee.',
  hi: 'यह केवल उस तारीख को Google Play लिस्टिंग और RBI डायरेक्टरी से पढ़ी गई जानकारी पर आधारित है। ये चेतावनी संकेत हैं, गलत काम का सबूत नहीं, और अच्छा नतीजा गारंटी नहीं है।',
};

// ---------- reading the listing text ----------

const RE_INTEREST = /(\bapr\b|annual percentage|interest|per annum|\bp\.a\b|% ?p\.a)/i;
const RE_FEES = /(processing fee|service fee|platform fee|convenience fee|late (payment )?(fee|charge)|prepayment|foreclosure|charges)/i;
const RE_TERMS = /(terms (and|&|&amp;) conditions|\bt ?& ?cs?\b|key fact statement|\bkfs\b|loan agreement|sanction letter|repayment (schedule|tenure)|tenure)/i;

function plainText(details) {
  const raw = (details && (details.description || details.descriptionHTML || details.summary)) || '';
  return String(raw).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// What the listing text mentions. This is "mentioned in the listing", not "clearly shown in the app".
function detectDisclosure(text) {
  return {
    interest: RE_INTEREST.test(text),
    fees: RE_FEES.test(text),
    terms: RE_TERMS.test(text),
  };
}

// Does the listing look like a lending app? Unknown (very short text) counts as yes, so we never hide checks by mistake.
const RE_LENDING = /(\bloans?\b|\blend(er|ers|ing)?\b|\bborrow\w*|\bemi\b|instal?lments?|\bnbfc\b|salary advance|payday|credit line|instant cash|quick cash|fast cash|easy money)/i;
function looksLikeLending(details) {
  const text = `${(details && details.title) || ''} ${plainText(details)}`;
  if (text.trim().length < 40) return true;
  return RE_LENDING.test(text);
}

function monthsSince(dateLike, now) {
  const t = typeof dateLike === 'number' ? dateLike : Date.parse(dateLike);
  if (!Number.isFinite(t)) return null;
  return (now - t) / (1000 * 60 * 60 * 24 * 30.4);
}

// ---------- the scoring ----------

// input: { details, permissionItems, datasafety, policyStatus, match, now }
//   match: { type: 'id' | 'name' | 'lookalike' | 'none', entry? }
//   policyStatus: 'ok' | 'broken' | 'unknown' | 'none'
function assess({ details, permissionItems, datasafety, policyStatus, match, now = Date.now() }) {
  const signals = [];
  const add = (s) => signals.push(s);
  // An app found in the RBI directory is a lending app by definition.
  const inDirectory = match && (match.type === 'id' || match.type === 'name' || match.type === 'lookalike');
  const lending = inDirectory ? true : looksLikeLending(details);

  // ----- registration (RBI directory) -----
  let registration = 0;
  const m = match || { type: 'none' };
  const records = m.entries && m.entries.length ? m.entries : m.entry ? [m.entry] : [];
  const lenders = [...new Set(records.map((e) => e.lender).filter(Boolean))];
  const lenderName = lenders.length > 3 ? `${lenders.slice(0, 3).join(', ')} and ${lenders.length - 3} more` : lenders.join(', ');
  if (m.type === 'id') {
    add({
      id: 'rbi_listed', group: 'registration', status: 'ok', points: 0, source: 'RBI directory',
      en: `Listed in the RBI directory (matched by its Play Store app ID). Lender(s): ${lenderName}.`,
      hi: `RBI डायरेक्टरी में सूचीबद्ध (Play Store ऐप ID से मिलान)। लेंडर: ${lenderName}।`,
    });
  } else if (m.type === 'name') {
    registration = 5;
    add({
      id: 'rbi_name_only', group: 'registration', status: 'info', points: 5, source: 'RBI directory',
      en: `The name matches an RBI directory entry (lender: ${lenderName}), but the directory has no Play link for it, so we could not confirm it is the same app.`,
      hi: `नाम RBI डायरेक्टरी की एक एंट्री से मिलता है (लेंडर: ${lenderName}), पर डायरेक्टरी में इसका Play लिंक नहीं है, इसलिए पक्का नहीं कह सकते कि यह वही ऐप है।`,
    });
  } else if (m.type === 'lookalike') {
    registration = 25;
    add({
      id: 'rbi_lookalike', group: 'registration', status: 'warn', points: 25, source: 'RBI directory',
      en: `An RBI directory entry has a similar name (lender: ${lenderName}) but a DIFFERENT Play Store app ID. This listing may be a different app, so check the lender's official link.`,
      hi: `RBI डायरेक्टरी की एक एंट्री का नाम मिलता-जुलता है (लेंडर: ${lenderName}) पर Play Store ऐप ID अलग है। यह कोई दूसरा ऐप हो सकता है, इसलिए लेंडर का आधिकारिक लिंक जाँचें।`,
    });
  } else if (!lending) {
    add({
      id: 'not_lending', group: 'registration', status: 'info', points: 0, source: 'Google Play',
      en: 'This does not look like a lending app (its Play listing does not mention loans or lending), so RBI registration and loan-fee checks may not apply.',
      hi: 'यह लोन देने वाला ऐप नहीं लगता (इसकी Play लिस्टिंग में लोन या लेंडिंग का ज़िक्र नहीं है), इसलिए RBI पंजीकरण और लोन-फीस की जाँच लागू नहीं हो सकती।',
    });
  } else {
    registration = 30;
    add({
      id: 'rbi_not_found', group: 'registration', status: 'warn', points: 30, source: 'RBI directory',
      en: 'Not found in the RBI directory we imported. It may be listed under another name, or not registered.',
      hi: 'हमारी इम्पोर्ट की गई RBI डायरेक्टरी में नहीं मिला। यह किसी और नाम से सूचीबद्ध हो सकता है, या पंजीकृत नहीं हो सकता।',
    });
  }
  const isListed = m.type === 'id';

  // ----- permissions (Google Play) -----
  let permission = 0;
  let permissionReport = { available: false };
  if (Array.isArray(permissionItems)) {
    permissionReport = buildPermissionReport(permissionItems);
    permission = Math.round(permissionReport.score * (isListed ? LISTED_PERMISSION_FACTOR : 1));
    const names = permissionReport.permissions.slice(0, 4).map((p) => p.en);
    const namesHi = permissionReport.permissions.slice(0, 4).map((p) => p.hi);
    add({
      id: 'permissions', group: 'permission', status: permission >= 20 ? 'warn' : permission > 0 ? 'info' : 'ok',
      points: permission, source: 'Google Play',
      en: names.length
        ? `Its Play listing declares permissions that ${names.join('; ')}.${isListed ? ' (Counted at a reduced weight because the lender is RBI-listed.)' : ''}`
        : 'Its Play listing declares none of the sensitive permissions we track.',
      hi: namesHi.length
        ? `इसकी Play लिस्टिंग ऐसी परमिशन बताती है जिनसे ऐप ${namesHi.join('; ')}।`
        : 'इसकी Play लिस्टिंग में हमारी ट्रैक की गई संवेदनशील परमिशन नहीं हैं।',
    });
  } else {
    add({
      id: 'permissions', group: 'permission', status: 'unknown', points: 0, source: 'Google Play',
      en: 'We could not read its permissions right now.', hi: 'अभी हम इसकी परमिशन नहीं पढ़ सके।',
    });
  }

  // ----- transparency (Google Play listing) -----
  let transparency = 0;
  const d = details || {};
  const text = plainText(d);

  // privacy policy
  if (!d.privacyPolicy) {
    transparency += 6;
    add({ id: 'privacy_policy', group: 'transparency', status: 'warn', points: 6, source: 'Google Play',
      en: 'No privacy policy link in the Play listing.', hi: 'Play लिस्टिंग में प्राइवेसी पॉलिसी का लिंक नहीं है।' });
  } else if (policyStatus === 'broken') {
    transparency += 3;
    add({ id: 'privacy_policy', group: 'transparency', status: 'warn', points: 3, source: 'Google Play',
      en: 'A privacy policy link is listed, but the page did not open (not found).', hi: 'प्राइवेसी पॉलिसी का लिंक दिया है, पर पेज नहीं खुला।' });
  } else if (policyStatus === 'ok') {
    add({ id: 'privacy_policy', group: 'transparency', status: 'ok', points: 0, source: 'Google Play',
      en: 'A privacy policy link is listed and the page opens.', hi: 'प्राइवेसी पॉलिसी का लिंक है और पेज खुलता है।' });
  } else {
    add({ id: 'privacy_policy', group: 'transparency', status: 'unknown', points: 0, source: 'Google Play',
      en: 'A privacy policy link is listed, but we could not open it to check.', hi: 'प्राइवेसी पॉलिसी का लिंक है, पर हम उसे खोलकर जाँच नहीं सके।' });
  }

  // fees and interest, terms (from the listing text)
  if (text.length >= 40 && !lending) {
    // fee, interest and loan-terms checks only make sense for lending apps
  } else if (text.length >= 40) {
    const dis = detectDisclosure(text);
    if (!dis.interest && !dis.fees) {
      transparency += 5;
      add({ id: 'fees_interest', group: 'transparency', status: 'warn', points: 5, source: 'Google Play',
        en: 'The Play listing does not mention interest rates, APR or fees.', hi: 'Play लिस्टिंग में ब्याज दर, APR या फीस का ज़िक्र नहीं है।' });
    } else {
      add({ id: 'fees_interest', group: 'transparency', status: 'ok', points: 0, source: 'Google Play',
        en: 'The Play listing mentions interest and/or fees.', hi: 'Play लिस्टिंग में ब्याज और/या फीस का ज़िक्र है।' });
    }
    if (!dis.terms) {
      transparency += 2;
      add({ id: 'terms', group: 'transparency', status: 'info', points: 2, source: 'Google Play',
        en: 'The Play listing does not mention loan terms, tenure or a key fact statement.', hi: 'Play लिस्टिंग में लोन की शर्तों, अवधि या की-फैक्ट स्टेटमेंट का ज़िक्र नहीं है।' });
    } else {
      add({ id: 'terms', group: 'transparency', status: 'ok', points: 0, source: 'Google Play',
        en: 'The Play listing mentions loan terms, tenure or a key fact statement.', hi: 'Play लिस्टिंग में लोन की शर्तों, अवधि या की-फैक्ट स्टेटमेंट का ज़िक्र है।' });
    }
  } else {
    add({ id: 'fees_interest', group: 'transparency', status: 'unknown', points: 0, source: 'Google Play',
      en: 'We could not read the listing description.', hi: 'हम लिस्टिंग का विवरण नहीं पढ़ सके।' });
  }

  // contact details
  if (details) {
    let contact = 0;
    const missing = [];
    if (!d.developerEmail) { contact += 2; missing.push('email'); }
    if (!d.developerWebsite) { contact += 1; missing.push('website'); }
    if (!d.developerAddress) { contact += 1; missing.push('address'); }
    transparency += contact;
    add({ id: 'contact', group: 'transparency', status: contact >= 3 ? 'warn' : contact > 0 ? 'info' : 'ok', points: contact, source: 'Google Play',
      en: missing.length ? `The developer has not listed: ${missing.join(', ')}.` : 'The developer lists an email, website and address.',
      hi: missing.length ? `डेवलपर ने ये नहीं दिए: ${missing.join(', ')}।` : 'डेवलपर ने ईमेल, वेबसाइट और पता दिया है।' });
  }

  // reputation: low rating, very new app
  if (details && Number(d.ratings) > 0) {
    if (Number(d.score) < 3.0 && Number(d.ratings) >= 1000) {
      transparency += 3;
      add({ id: 'rating', group: 'transparency', status: 'warn', points: 3, source: 'Google Play',
        en: `Low user rating: ${Number(d.score).toFixed(1)} stars from ${Number(d.ratings).toLocaleString('en-IN')} ratings.`,
        hi: `यूज़र रेटिंग कम है: ${Number(d.ratings).toLocaleString('en-IN')} रेटिंग से ${Number(d.score).toFixed(1)} स्टार।` });
    } else {
      add({ id: 'rating', group: 'transparency', status: 'ok', points: 0, source: 'Google Play',
        en: `User rating: ${Number(d.score).toFixed(1)} stars from ${Number(d.ratings).toLocaleString('en-IN')} ratings.`,
        hi: `यूज़र रेटिंग: ${Number(d.ratings).toLocaleString('en-IN')} रेटिंग से ${Number(d.score).toFixed(1)} स्टार।` });
    }
  }
  const age = d.released ? monthsSince(d.released, now) : null;
  if (age !== null && age < 6) {
    transparency += 2;
    add({ id: 'new_app', group: 'transparency', status: 'info', points: 2, source: 'Google Play',
      en: 'This app is less than 6 months old on Google Play.', hi: 'यह ऐप Google Play पर 6 महीने से कम पुराना है।' });
  }

  // data safety (information only, no points)
  if (datasafety && (Array.isArray(datasafety.sharedData) || Array.isArray(datasafety.collectedData))) {
    const shared = (datasafety.sharedData || []).length;
    const collected = (datasafety.collectedData || []).length;
    add({ id: 'data_safety', group: 'info', status: 'info', points: 0, source: 'Google Play',
      en: `Data safety section: declares collecting ${collected} type(s) of data and sharing ${shared} type(s) with others.`,
      hi: `डेटा सेफ्टी सेक्शन: ${collected} तरह का डेटा इकट्ठा करना और ${shared} तरह का डेटा दूसरों से साझा करना बताया है।` });
  }

  transparency = Math.min(MAX.transparency, transparency);
  permission = Math.min(MAX.permission, permission);
  registration = Math.min(MAX.registration, registration);
  const total = permission + registration + transparency;
  const level = total >= THRESHOLDS.stop ? 'stop' : total >= THRESHOLDS.pause ? 'pause' : 'proceed';

  const checkable = signals.filter((s) => s.group !== 'info');
  const known = checkable.filter((s) => s.status !== 'unknown').length;
  const ratio = checkable.length ? known / checkable.length : 0;
  const confidence = ratio >= 0.8 ? 'high' : ratio >= 0.5 ? 'medium' : 'low';

  return {
    level,
    lending,
    label: { en: LEVELS[level].en, hi: LEVELS[level].hi },
    subtitle: LEVELS[level].subtitle,
    score: { total, permission, registration, transparency, max: MAX },
    signals,
    confidence,
    permissionReport,
    note: NOTE,
  };
}

module.exports = { assess, looksLikeLending, detectDisclosure, plainText, MAX, THRESHOLDS, LEVELS };
