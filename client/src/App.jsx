import { useEffect, useState } from 'react';
import './App.css';
import LoanCostCalculator from './LoanCostCalculator';

const TRY_APPS = ['PhonePe', 'Paytm', 'Navi', 'Blink Credit'];

// ── All screen text in English and Hindi ──────────────────────────────────────
const UI = {
  en: {
    title: 'Karz Kavach',
    titleHi: 'कर्ज़ कवच',
    tagline: 'Check the app before it checks you.',
    taglineHi: 'ऐप डाउनलोड करने से पहले जांचें',
    demoBanner: "Directory data: 1734 apps imported from RBI's DLA directory. For real apps we show evidence (RBI listing, permissions, complaint contact), not safe/risky labels.",
    bannerText: "Directory data: 1734 apps imported from RBI's DLA directory. For real apps we show evidence (RBI listing, permissions, complaint contact), not safe/risky labels.",
    placeholder: 'App name or Google Play link',
    tryLabel: 'Try:',
    check: 'Check app • ऐप की जांच करें',
    checking: 'Checking…',
    score: 'Risk score',
    scoreLabel: 'Total Threat Assessment',
    breakdown: 'Score Breakdown',
    permission: 'Permissions',
    registration: 'RBI Registration',
    transparency: 'Transparency & Fees',
    findings: 'What we found',
    findingsHi: 'जांच में क्या मिला',
    canDo: 'What this app can do to you',
    canDoHi: 'यह ऐप आपके साथ क्या कर सकता है',
    noPerms: 'No sensitive permissions requested.',
    nextSteps: 'What to do next',
    nextStepsHi: 'अब क्या करें',
    listen: 'Listen / सुनें',
    notFound: 'We could not find this app. Try one of these:',
    serverError: 'Could not reach the server. Is it running on port 5000?',
    claims: 'Claims to work with',
    developer: 'Developer',
    footer: 'Karz Kavach | Team Moon3 | Hack@BVP 8.0',
    quickSuggest: 'Quick Suggestions / लोकप्रिय खोजें',
    searchLabel: 'Search Loan App or Paste Play Link',
    matchedEntry: 'Matched directory entry',
    matchedEntryHi: 'डायरेक्टरी में नाम',
    listedUnder: 'Listed under',
    listedUnderHi: 'लेंडर का नाम',
    didYouMean: 'Did you mean:',
    didYouMeanHi: 'क्या आपका मतलब यह था:',
    dirNote: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    dirNoteHi: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    permExposureTitle: 'Permission exposure (from the Google Play listing)',
    permExposureTitleHi: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    noPlayPerms: 'No sensitive permissions declared on the Play Store listing.',
    grievanceTitle: 'Who to complain to (Grievance Redressal Officer)',
    grievanceTitleHi: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceOfficer: 'Officer',
    grievanceEmail: 'Email',
    grievancePhone: 'Phone',
    grievanceMobile: 'Mobile',
    grievanceNote: 'Contact details are published by the lender in the RBI directory.',
    grievanceNoteHi: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    kachuSays: 'Kachu says:',
    asOfChecked: (date) => `Based on what we checked, as of ${date}`,
    sourceLabel: (src) => `Data source: ${src === 'live' ? 'Live Google Play' : 'Saved copy'}`,
    scoreBreakdownTitle: 'Score Breakdown',
    permissionsScore: 'Permissions',
    registrationScore: 'RBI registration',
    transparencyScore: 'Transparency & Fees',
    totalWarningScore: 'Total warning score',
    whyThisResult: 'Why this result',
    whyThisResultSub: 'Evidence from Google Play listing and RBI directory',
    confidenceTitle: 'Confidence',
    confidence_high: 'High',
    confidence_medium: 'Medium',
    confidence_low: 'Low',
    confidenceLowSub: 'Some data could not be read',
    lookalikeWarning: "A similar name is in the RBI directory under a different app. Check the lender's official link.",
    realAppAssessment: 'Real App Assessment',
    assessingPlay: 'Reading Google Play listing & RBI directory…',
    rbiRecordTitle: 'RBI directory record',
    rbiRecordTitleHi: 'RBI डायरेक्टरी रिकॉर्ड',
    playUnavailableNote: 'We could not read this app from Google Play right now.',
    matchedSearchTo: (title, dev) => `We matched your search to ${title} by ${dev} on Google Play. Not the right app? Paste its Google Play link above.`,
    assessErrors: {
      NEEDS_LINK: "We could not find that app on Google Play by name. Paste the app's Google Play link (play.google.com/store/apps/details?id=...) or its app ID.",
      PLAY_UNAVAILABLE: 'We could not read this app from Google Play right now. Check the link, or try again.',
    },
    notLendingBanner: "This doesn't look like a lending app, so RBI registration and loan-fee checks may not apply.",
    navChecker: 'Check App',
    navTrusted: 'Trusted Apps',
    exploreTrusted: 'Explore trusted lending apps',
    trustedHeading: 'Trusted apps — RBI-listed and well rated by users',
    trustedSubtext: 'Registered with RBI and rated well on Google Play. This is a trust signal, not a guarantee. Always read the terms.',
    trustedHeroTag: 'Verified Directory & Store Rating',
    trustedSearchPlaceholder: 'Search trusted apps or lenders…',
    filterAll: 'All',
    filterHigh: 'Highly rated',
    filterWell: 'Well rated',
    sortLabel: 'Sort by',
    sortBest: 'Best trust score',
    sortRating: 'Highest rating',
    sortReviews: 'Most reviews',
    showingApps: (shown, total) => `Showing ${shown} of ${total} apps`,
    ratingsFetchedOn: (date) => `Ratings fetched on ${date}`,
    trustedNotBuilt: 'Trusted list not built yet.',
    notFoundTrusted: 'No matching trusted apps found.',
    lenderLabel: 'Lender',
    trustLabel: 'Trust',
    trustScoreDesc: 'Composite score from rating and review volume',
    tierHigh: 'Highly rated',
    tierWell: 'Well rated',
    rbiSignal: 'RBI directory: listed',
    rbiListedPill: 'RBI listed',
    playSignalPrefix: 'Google Play',
    playSignalFrom: 'from',
    ratingsSuffix: 'ratings',
    viewOnPlay: 'View on Google Play',
    checkAppHint: 'Click to view permissions & grievance officer',
    verdictLabel: {
      safe: 'LOOKS SAFE',
      review: 'NEEDS A CLOSER LOOK',
      risky: 'RISKY — DO NOT INSTALL',
      listed: 'LISTED IN DIRECTORY',
      unverified: 'NOT FOUND IN DIRECTORY',
    },
    riskLabel: {
      safe: 'Very Low Risk',
      review: 'Moderate Risk',
      risky: 'Maximum Danger',
    },
    heroTag: 'Citizen Protection Engine',
    calcTitle: 'Loan cost calculator',
    calcSubtitle: 'See what you will really pay back, including fees and GST.',
    calcRealCostLink: 'Calculate the real cost of this loan',
    calcLoanAmount: 'Loan amount (₹)',
    calcInterestRate: 'Interest rate',
    calcTenure: 'Tenure',
    calcProcessingFee: 'Processing fee',
    calcGstOnFee: 'GST on processing fee (%)',
    calcOtherCharges: 'Other upfront charges (₹)',
    calcReset: 'Reset',
    calcRateUnitDay: '% per day',
    calcRateUnitMonth: '% per month',
    calcRateUnitYear: '% per year',
    calcTenureUnitDays: 'days',
    calcTenureUnitMonths: 'months',
    calcFeeTypeFlat: '₹',
    calcFeeTypePercent: '% of loan',
    calcPromptEmpty: 'Enter the details above to see the cost',
    calcChargesExceed: 'Charges are higher than the loan amount. Please check the numbers.',
    calcYouReceive: 'You actually receive',
    calcYouRepay: 'You repay in total',
    calcExtraPaid: 'Extra you pay',
    calcApproxYearlyCost: 'Approx. yearly cost',
    calcApproxTag: 'approximate',
    calcLegendReceive: 'You receive',
    calcLegendUpfront: 'Fee + GST + Charges',
    calcLegendInterest: 'Interest',
    calcEstimateNote: "This is an estimate based on the numbers you entered (simple interest, one payment at the end). Check the lender's Key Fact Statement for exact figures.",
  },
  hi: {
    title: 'कर्ज़ कवच',
    titleHi: 'Karz Kavach',
    tagline: 'ऐप आपको जाँचे, उससे पहले आप ऐप को जाँचें।',
    taglineHi: 'Check the app before it checks you',
    demoBanner: 'डायरेक्टरी डेटा: RBI की DLA डायरेक्टरी से 1734 ऐप आयात किए गए। वास्तविक ऐप के लिए हम साक्ष्य (RBI सूची, परमिशन, शिकायत संपर्क) दिखाते हैं, सुरक्षित/जोखिम भरे लेबल नहीं।',
    bannerText: 'डायरेक्टरी डेटा: RBI की DLA डायरेक्टरी से 1734 ऐप आयात किए गए। वास्तविक ऐप के लिए हम साक्ष्य (RBI सूची, परमिशन, शिकायत संपर्क) दिखाते हैं, सुरक्षित/जोखिम भरे लेबल नहीं।',
    placeholder: 'ऐप का नाम या Google Play लिंक',
    tryLabel: 'आज़माएं:',
    check: 'ऐप जाँचें • Check App',
    checking: 'जाँच हो रही है…',
    score: 'जोखिम स्कोर',
    scoreLabel: 'कुल खतरे का आकलन',
    breakdown: 'स्कोर कैसे बना',
    permission: 'परमिशन',
    registration: 'RBI रजिस्ट्रेशन',
    transparency: 'पारदर्शिता और शुल्क',
    findings: 'हमें क्या मिला',
    findingsHi: 'What we found',
    canDo: 'यह ऐप आपके साथ क्या कर सकता है',
    canDoHi: 'What this app can do to you',
    noPerms: 'कोई संवेदनशील परमिशन नहीं मांगी गई।',
    nextSteps: 'आगे क्या करें',
    nextStepsHi: 'What to do next',
    listen: 'सुनें (Listen)',
    notFound: 'यह ऐप नहीं मिला। इनमें से कोई आज़माएं:',
    serverError: 'सर्वर से संपर्क नहीं हो सका। क्या वह पोर्ट 5000 पर चल रहा है?',
    claims: 'दावा करता है कि इसके साथ काम करता है',
    developer: 'डेवलपर',
    footer: 'कर्ज़ कवच | Team Moon3 | Hack@BVP 8.0',
    quickSuggest: 'लोकप्रिय खोजें / Quick Suggestions',
    searchLabel: 'लोन ऐप खोजें या Google Play लिंक पेस्ट करें',
    matchedEntry: 'डायरेक्टरी में नाम',
    matchedEntryHi: 'Matched directory entry',
    listedUnder: 'लेंडर का नाम',
    listedUnderHi: 'Listed under',
    didYouMean: 'क्या आपका मतलब यह था:',
    didYouMeanHi: 'Did you mean:',
    dirNote: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    dirNoteHi: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    permExposureTitle: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    permExposureTitleHi: 'Permission exposure (from the Google Play listing)',
    noPlayPerms: 'Play Store लिस्टिंग पर कोई संवेदनशील परमिशन घोषित नहीं है।',
    grievanceTitle: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceTitleHi: 'Who to complain to (Grievance Redressal Officer)',
    grievanceOfficer: 'अधिकारी',
    grievanceEmail: 'ईमेल',
    grievancePhone: 'फ़ोन',
    grievanceMobile: 'मोबाइल',
    grievanceNote: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    grievanceNoteHi: 'Contact details are published by the lender in the RBI directory.',
    kachuSays: 'कछु कहता है:',
    asOfChecked: (date) => `हमारी जाँच के अनुसार, तारीख: ${date}`,
    sourceLabel: (src) => `डेटा स्रोत: ${src === 'live' ? 'लाइव Google Play' : 'सहेजी गई कॉपी'}`,
    scoreBreakdownTitle: 'स्कोर विवरण',
    permissionsScore: 'परमिशन',
    registrationScore: 'RBI रजिस्ट्रेशन',
    transparencyScore: 'पारदर्शिता और शुल्क',
    totalWarningScore: 'कुल चेतावनी अंक',
    whyThisResult: 'यह परिणाम क्यों आया',
    whyThisResultSub: 'Google Play लिस्टिंग और RBI डायरेक्टरी के साक्ष्य',
    confidenceTitle: 'विश्वसनीयता',
    confidence_high: 'उच्च',
    confidence_medium: 'मध्यम',
    confidence_low: 'कम',
    confidenceLowSub: 'कुछ डेटा नहीं पढ़ा जा सका',
    lookalikeWarning: 'RBI डायरेक्टरी में एक मिलता-जुलता नाम किसी अन्य ऐप के तहत है। लेंडर का आधिकारिक लिंक जाँचें।',
    realAppAssessment: 'वास्तविक ऐप मूल्यांकन',
    assessingPlay: 'Google Play लिस्टिंग और RBI डायरेक्टरी पढ़ी जा रही है…',
    rbiRecordTitle: 'RBI डायरेक्टरी रिकॉर्ड',
    rbiRecordTitleHi: 'RBI directory record',
    playUnavailableNote: 'अभी हम इस ऐप की जानकारी Google Play से नहीं पढ़ सके।',
    matchedSearchTo: (title, dev) => `हमने आपकी खोज का मिलान Google Play पर ${dev} के ${title} से किया है। क्या यह सही ऐप नहीं है? ऊपर इसका Google Play लिंक पेस्ट करें।`,
    assessErrors: {
      NEEDS_LINK: 'हम Google Play पर इस नाम से ऐप नहीं ढूंढ सके। ऐप का Google Play लिंक (play.google.com/store/apps/details?id=...) या ऐप ID पेस्ट करें।',
      PLAY_UNAVAILABLE: 'अभी हम इस ऐप की जानकारी Google Play से नहीं पढ़ सके। लिंक की जांच करें या पुनः प्रयास करें।',
    },
    notLendingBanner: 'यह लोन देने वाला ऐप नहीं लगता, इसलिए RBI पंजीकरण और लोन-फीस की जाँच लागू नहीं हो सकती।',
    navChecker: 'ऐप जांचें',
    navTrusted: 'भरोसेमंद ऐप',
    exploreTrusted: 'भरोसेमंद लोन ऐप देखें',
    trustedHeading: 'भरोसेमंद ऐप — RBI में सूचीबद्ध और उपयोगकर्ताओं द्वारा अच्छी रेटिंग',
    trustedSubtext: 'RBI में पंजीकृत और Google Play पर अच्छी रेटिंग प्राप्त। यह विश्वास का संकेत है, गारंटी नहीं। हमेशा नियम और शर्तें पढ़ें।',
    trustedHeroTag: 'सत्यापित डायरेक्टरी और स्टोर रेटिंग',
    trustedSearchPlaceholder: 'भरोसेमंद ऐप या लेंडर खोजें…',
    filterAll: 'सभी',
    filterHigh: 'बहुत अच्छी रेटिंग',
    filterWell: 'अच्छी रेटिंग',
    sortLabel: 'क्रमबद्ध करें',
    sortBest: 'सर्वश्रेष्ठ ट्रस्ट स्कोर',
    sortRating: 'उच्चतम रेटिंग',
    sortReviews: 'सर्वाधिक समीक्षाएं',
    showingApps: (shown, total) => `कुल ${total} में से ${shown} ऐप दिखाए जा रहे हैं`,
    ratingsFetchedOn: (date) => `रेटिंग प्राप्त करने की तिथि: ${date}`,
    trustedNotBuilt: 'भरोसेमंद सूची अभी तैयार नहीं है।',
    notFoundTrusted: 'कोई मेल खाने वाला भरोसेमंद ऐप नहीं मिला।',
    lenderLabel: 'लेंडर',
    trustLabel: 'ट्रस्ट',
    trustScoreDesc: 'रेटिंग और समीक्षा संख्या पर आधारित स्कोर',
    tierHigh: 'बहुत अच्छी रेटिंग',
    tierWell: 'अच्छी रेटिंग',
    rbiSignal: 'RBI डायरेक्टरी: सूचीबद्ध',
    rbiListedPill: 'RBI सूचीबद्ध',
    playSignalPrefix: 'Google Play',
    playSignalFrom: 'कुल',
    ratingsSuffix: 'रेटिंग से',
    viewOnPlay: 'Google Play पर देखें',
    checkAppHint: 'परमिशन और शिकायत अधिकारी देखने के लिए क्लिक करें',
    verdictLabel: {
      safe: 'सुरक्षित ऐप',
      review: 'सावधानी बरतें',
      risky: 'खतरनाक — इंस्टॉल न करें',
      listed: 'डायरेक्टरी में सूचीबद्ध',
      unverified: 'डायरेक्टरी में नहीं मिला',
    },
    riskLabel: {
      safe: 'अत्यधिक सुरक्षित',
      review: 'मध्यम जोखिम',
      risky: 'अत्यंत खतरनाक',
    },
    heroTag: 'नागरिक सुरक्षा इंजन',
    calcTitle: 'लोन की असली लागत कैलकुलेटर',
    calcSubtitle: 'फीस और जीएसटी सहित जानें कि आप वास्तव में कितना वापस चुकाएंगे।',
    calcRealCostLink: 'इस लोन की असली लागत की गणना करें',
    calcLoanAmount: 'लोन राशि (₹)',
    calcInterestRate: 'ब्याज दर',
    calcTenure: 'लोन की अवधि',
    calcProcessingFee: 'प्रोसेसिंग फीस',
    calcGstOnFee: 'प्रोसेसिंग फीस पर GST (%)',
    calcOtherCharges: 'अन्य अग्रिम शुल्क (₹)',
    calcReset: 'रीसेट करें',
    calcRateUnitDay: '% प्रति दिन',
    calcRateUnitMonth: '% प्रति माह',
    calcRateUnitYear: '% प्रति वर्ष',
    calcTenureUnitDays: 'दिन',
    calcTenureUnitMonths: 'महीने',
    calcFeeTypeFlat: '₹',
    calcFeeTypePercent: '% लोन का',
    calcPromptEmpty: 'लागत देखने के लिए ऊपर दिए गए विवरण भरें',
    calcChargesExceed: 'शुल्क लोन राशि से अधिक हैं। कृपया दर्ज संख्याएं जांचें।',
    calcYouReceive: 'आपको वास्तव में मिलेगा',
    calcYouRepay: 'आप कुल वापस चुकाएंगे',
    calcExtraPaid: 'अतिरिक्त भुगतान',
    calcApproxYearlyCost: 'अनुमानित वार्षिक लागत',
    calcApproxTag: 'अनुमानित',
    calcLegendReceive: 'आपको प्राप्त राशि',
    calcLegendUpfront: 'फीस + GST + अन्य शुल्क',
    calcLegendInterest: 'ब्याज',
    calcEstimateNote: "यह आपके द्वारा दर्ज की गई संख्याओं (साधारण ब्याज, अंत में एकमुश्त भुगतान) पर आधारित एक अनुमान है। सटीक आंकड़ों के लिए लेंडर का Key Fact Statement देखें।",
  },
};

const FLAG_ICONS = { good: '✔', warn: '!', bad: '✖' };
const VERDICT_ICONS = { safe: '🛡️', review: '⚠️', risky: '⛔', listed: '📋', unverified: 'ℹ️' };

// Format rating counts: 1,20,000 -> 1.2L, 1,500,000 -> 15L, 5000 -> 5K
function formatRatings(num) {
  if (!num || num < 0) return '0';
  const n = Number(num);
  if (n >= 10000000) {
    const cr = n / 10000000;
    return (cr % 1 === 0 ? cr : cr.toFixed(1)) + 'Cr';
  }
  if (n >= 100000) {
    const l = n / 100000;
    return (l % 1 === 0 ? l : l.toFixed(1)) + 'L';
  }
  if (n >= 1000) {
    const k = n / 1000;
    return (k % 1 === 0 ? k : k.toFixed(1)) + 'K';
  }
  return String(n);
}

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
}

// Maps verdict string → severity key for styling
function verdictClass(verdict) {
  const v = (verdict || '').toLowerCase();
  if (v === 'safe')       return 'safe';
  if (v === 'review')     return 'review';
  if (v === 'risky')      return 'risky';
  if (v === 'listed')     return 'listed';
  if (v === 'unverified') return 'unverified';
  return 'unverified';
}

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  window.speechSynthesis.speak(u);
}

// ── SVG Gauge Ring ─────────────────────────────────────────────────────────────
function GaugeRing({ score, max = 100 }) {
  const R = 50;
  const circ = 2 * Math.PI * R;
  const pct = Math.min(score / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div className="gauge-ring">
      <svg viewBox="0 0 120 120">
        <circle className="gauge-ring-track" cx="60" cy="60" r={R} fill="transparent" strokeWidth="10" />
        <circle
          className="gauge-ring-fill"
          cx="60" cy="60" r={R}
          fill="transparent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-inner">
        <span className="gauge-score">{String(score).padStart(2, '0')}</span>
        <span className="gauge-max">/ {max}</span>
        <span className="gauge-risk-label" style={{ marginTop: 2 }} />
      </div>
    </div>
  );
}

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, max, level }) {
  const maxVal = max || 40;
  const pct = Math.min(100, Math.round(((value || 0) / maxVal) * 100));
  const lvlClass = level ? `bar-${String(level).toLowerCase()}` : '';
  return (
    <div className={`bar-row ${lvlClass}`.trim()}>
      <div className="bar-header">
        <span className="bar-label">{label}</span>
        <span className="bar-score">{value} / {maxVal}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Full result (SAFE / REVIEW / RISKY) for Demo Apps ──────────────────────────
function FullResult({ r, lang, t }) {
  const vClass = verdictClass(r.verdict);

  // Verdict hero label from our own UI dict
  const heroLabel = t.verdictLabel[vClass] || (r.verdictLabel && r.verdictLabel[lang]) || r.verdict;
  const riskText  = t.riskLabel[vClass] || '';

  const speechText = [
    r.verdictLabel?.[lang] || heroLabel,
    ...(r.flags || []).filter(f => f.severity !== 'good').map(f => f[lang]),
  ].join('. ');

  return (
    <div className="result-card">
      {/* App identity */}
      <div className="app-summary-card">
        <div className="app-info">
          <div className="app-name">{r.app?.name || r.name}</div>
          {r.app?.developer && <div className="app-meta">{t.developer}: {r.app.developer}</div>}
          {r.app?.claimedLender && (
            <div className="app-meta">{t.claims}: {r.app.claimedLender}</div>
          )}
        </div>
        <span className={`verdict-badge ${vClass}`}>
          {VERDICT_ICONS[vClass]} {heroLabel}
        </span>
      </div>

      {/* Verdict hero banner */}
      <div className={`verdict-hero ${vClass}`}>
        <div className="vh-icon-wrap">{VERDICT_ICONS[vClass]}</div>
        <div className="vh-content">
          <div className="vh-title">{heroLabel}</div>
          <div className="vh-subtitle">{riskText}</div>
        </div>
      </div>

      {/* Gauge + breakdown */}
      {r.score && (
        <div className={`gauge-card ${vClass}`}>
          <div className="gauge-header">
            <div className="gauge-header-group">
              <span className="gauge-header-label">{t.scoreLabel}</span>
              <span className="gauge-header-title">{r.score.total} / 100 {t.score}</span>
            </div>
            <span className="severity-pill">{riskText}</span>
          </div>

          <div className="gauge-body">
            <GaugeRing score={r.score.total} max={100} />
            <div className="gauge-text">
              <div className="gauge-text-title">{heroLabel}</div>
              <div className="gauge-text-sub">{riskText}</div>
              <button className="listen-btn" onClick={() => speak(speechText, lang)} type="button">
                🔊 {t.listen}
              </button>
            </div>
          </div>

          {/* Score bars */}
          <div className="bars-section">
            <ScoreBar label={t.permission}     value={r.score.permission}     max={r.score.max?.permission || 40} />
            <ScoreBar label={t.registration}   value={r.score.registration}   max={r.score.max?.registration || 40} />
            <ScoreBar label={t.transparency}   value={r.score.transparency}   max={r.score.max?.transparency || 20} />
          </div>
        </div>
      )}

      {/* What we found */}
      {r.flags && r.flags.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            🔍 {t.findings}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.findingsHi})
            </span>
          </div>
          <ul className="flags">
            {r.flags.map((f, i) => (
              <li key={f.code || i} className={`flag-item ${f.severity}`}>
                <span className="flag-icon-wrap">{FLAG_ICONS[f.severity] || '•'}</span>
                <span className="flag-text">{f[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Permissions */}
      {r.permissions && (
        <div className="section-card">
          <div className="section-title">
            🔒 {t.canDo}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.canDoHi})
            </span>
          </div>
          {r.permissions.length === 0 ? (
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t.noPerms}</p>
          ) : (
            <ul className="perms">
              {r.permissions.map(p => (
                <li key={p.permission} className="perm-item">
                  <span className="perm-code">{p.permission}</span>
                  <span>{p[lang]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Next steps */}
      {r.nextSteps?.[lang] && (
        <div className="section-card">
          <div className="section-title">
            ⚡ {t.nextSteps}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.nextStepsHi})
            </span>
          </div>
          <ol className="steps">
            {r.nextSteps[lang].map((s, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ── Grievance Redressal Box (Shared Component) ────────────────────────────────
function GrievanceBox({ grievance, t, showNote = true }) {
  if (!grievance || (!grievance.name && !grievance.email && !grievance.phone && !grievance.mobile)) {
    return null;
  }
  return (
    <div className="dir-grievance-box">
      <div className="dir-grievance-title">
        🛡️ {t.grievanceTitle}
        <span className="dir-grievance-title-sub">({t.grievanceTitleHi})</span>
      </div>
      <div className="dir-grievance-content">
        {grievance.name && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceOfficer}:</span>
            <span className="dir-grievance-val">{grievance.name}</span>
          </div>
        )}
        {grievance.email && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceEmail}:</span>
            {grievance.email.includes('@') ? (
              grievance.email.includes(' ') ? (
                <span className="dir-grievance-val">
                  {grievance.email.split(/\s+/).map((em, eIdx) => {
                    const clean = em.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
                    return em.includes('@') ? (
                      <a key={eIdx} className="dir-grievance-link" href={`mailto:${clean}`}>
                        {em}{' '}
                      </a>
                    ) : (
                      <span key={eIdx}>{em} </span>
                    );
                  })}
                </span>
              ) : (
                <a className="dir-grievance-link" href={`mailto:${grievance.email.trim()}`}>
                  {grievance.email}
                </a>
              )
            ) : (
              <span className="dir-grievance-val">{grievance.email}</span>
            )}
          </div>
        )}
        {grievance.phone && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievancePhone}:</span>
            <a className="dir-grievance-link" href={`tel:${String(grievance.phone).replace(/\s+/g, '')}`}>
              {grievance.phone}
            </a>
          </div>
        )}
        {grievance.mobile && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceMobile}:</span>
            <a className="dir-grievance-link" href={`tel:${String(grievance.mobile).replace(/\s+/g, '')}`}>
              {grievance.mobile}
            </a>
          </div>
        )}
      </div>
      {showNote && (
        <div className="dir-grievance-note">
          ℹ️ {t.grievanceNote}
        </div>
      )}
    </div>
  );
}

// ── Directory-only result (LISTED / UNVERIFIED) ────────────────────────────────
function cleanSpeech(text) {
  if (!text) return '';
  return text
    .replace(/We did not check this app's permissions\.?/gi, '')
    .replace(/Permissions were not checked for this app \(directory lookup only\)\.?/gi, '')
    .replace(/permissions were not checked\.?/gi, '')
    .replace(/हमने इस ऐप की परमिशन की जाँच नहीं की।?/g, '')
    .replace(/इस ऐप की परमिशन की जाँच नहीं की गई है \(केवल डायरेक्टरी लुकअप\)।?/g, '')
    .trim();
}

function DirResult({ r, playUnavailable = false, lang, t, onSearch }) {
  const isListed = r.verdict === 'LISTED';
  const vClass = isListed ? 'listed' : 'unverified';
  const verdictText = r.verdictLabel?.[lang] || (isListed ? t.verdictLabel.listed : t.verdictLabel.unverified);

  const speechText = [
    verdictText,
    ...(r.matches || []).map(m => `${m.appName}. ${m.lender}`),
    ...(r.flags || []).map(f => cleanSpeech(f[lang])),
    ...(r.permissionReport?.available
      ? [
          r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en,
          ...(r.permissionReport.permissions || []).map(p => p[lang] || p.en),
          r.permissionReport.note?.[lang] || r.permissionReport.note?.en,
        ]
      : []),
    ...(r.nextSteps?.[lang] || []),
  ].map(cleanSpeech).filter(Boolean).join('. ');

  return (
    <div className={`dir-result-card ${vClass}`}>
      {/* App identity header */}
      <div className="app-summary-card">
        <div className="app-info">
          <div className="app-name">{r.query}</div>
          <div className="dir-lookup-tag">📋 {lang === 'hi' ? 'डायरेक्टरी लुकअप' : 'Directory Lookup'}</div>
        </div>
        <span className={`verdict-badge ${vClass}`}>
          {isListed ? '📋' : 'ℹ️'} {verdictText}
        </span>
      </div>

      {/* Verdict hero banner */}
      <div className={`verdict-hero ${vClass}`}>
        <div className="vh-icon-wrap">{isListed ? '📋' : 'ℹ️'}</div>
        <div className="vh-content" style={{ flex: 1 }}>
          <div className="vh-title">{verdictText}</div>
        </div>
        <button
          className="listen-btn dir-listen-btn"
          onClick={() => speak(speechText, lang)}
          title={t.listen}
          type="button"
        >
          🔊 {t.listen}
        </button>
      </div>

      {/* Small grey note when Play store reading failed or app has no Play ID */}
      {playUnavailable && (
        <div className="dir-play-unavailable-note">
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <span>
            {typeof playUnavailable === 'object'
              ? ((lang === 'hi' && t.assessErrors?.[playUnavailable.error]) || playUnavailable.message || t.playUnavailableNote)
              : (typeof playUnavailable === 'string' ? playUnavailable : t.playUnavailableNote)
            }
          </span>
        </div>
      )}

      {/* Matches (when app is listed) */}
      {r.matches && r.matches.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            📋 {lang === 'hi' ? 'डायरेक्टरी मिलान' : 'Matched RBI Directory Records'}
          </div>
          <div className="dir-matches">
            {r.matches.map((m, i) => (
              <div key={i} className="dir-match-item">
                <div className="dir-match-field">
                  <span className="dir-match-label">{lang === 'hi' ? t.matchedEntryHi : t.matchedEntry}:</span>
                  <span className="dir-match-val">{m.appName}</span>
                </div>
                <div className="dir-match-field">
                  <span className="dir-match-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>
                  <span className="dir-match-lender">{m.lender}</span>
                </div>
                {m.grievance && (
                  <GrievanceBox grievance={m.grievance} t={t} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flags */}
      {r.flags && r.flags.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            🔍 {t.findings}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.findingsHi})
            </span>
          </div>
          <ul className="flags">
            {r.flags.map((f, i) => (
              <li key={f.code || i} className={`flag-item ${f.severity || 'warn'}`}>
                <span className="flag-icon-wrap">
                  {f.severity === 'good' ? '✔' : '!'}
                </span>
                <span className="flag-text">{f[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Permission exposure (from the Google Play listing) */}
      {r.permissionReport && r.permissionReport.available && (
        <div className="section-card">
          <div className="section-title">
            🔒 {t.permExposureTitle}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.permExposureTitleHi})
            </span>
          </div>

          <ScoreBar
            label={r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en || r.permissionReport.level}
            value={r.permissionReport.score ?? 0}
            max={r.permissionReport.max || 40}
            level={r.permissionReport.level}
          />

          {(!r.permissionReport.permissions || r.permissionReport.permissions.length === 0) ? (
            <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>{t.noPlayPerms}</p>
          ) : (
            <ul className="perms">
              {r.permissionReport.permissions.map(p => (
                <li key={p.permission} className="perm-item">
                  <span className="perm-code">{p.permission}</span>
                  <span>{p[lang] || p.en || p.permission}</span>
                </li>
              ))}
            </ul>
          )}

          {r.permissionReport.note && (
            <p className="perm-report-note">
              {r.permissionReport.note[lang] || r.permissionReport.note.en || (typeof r.permissionReport.note === 'string' ? r.permissionReport.note : '')}
            </p>
          )}
        </div>
      )}

      {/* "Did you mean" suggestion chips (hiding demo apps) */}
      {r.similar && r.similar.filter(s => !s.toLowerCase().includes('demo')).length > 0 && (
        <div className="section-card">
          <div className="section-title" style={{ fontSize: 16 }}>
            💡 {lang === 'hi' ? t.didYouMeanHi : t.didYouMean}
          </div>
          <div className="chips">
            {r.similar
              .filter(s => !s.toLowerCase().includes('demo'))
              .map((simName) => (
                <button
                  key={simName}
                  type="button"
                  className="chip dir-chip"
                  onClick={() => onSearch(simName)}
                >
                  {simName}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Next steps */}
      {r.nextSteps && r.nextSteps[lang] && (
        <div className="section-card">
          <div className="section-title">
            ⚡ {t.nextSteps}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 4 }}>
              ({t.nextStepsHi})
            </span>
          </div>
          <ol className="steps">
            {r.nextSteps[lang].map((s, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Informational small note (shown ONLY when permission report is missing or not available) */}
      {(!r.permissionReport || !r.permissionReport.available) && (
        <div className="dir-note-box">
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <span>{t.dirNote}</span>
        </div>
      )}

      {/* Link to Loan Cost Calculator */}
      <div className="assess-calc-link-card">
        <a
          href="#loan-calculator"
          className="assess-calc-link"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('loan-calculator')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>🧮 {t.calcRealCostLink}</span>
          <span className="assess-calc-arrow">↓</span>
        </a>
      </div>
    </div>
  );
}

// ── Real-App Assessment Result Card (Google Play & RBI Directory) ────────────
function RealAppCard({ data, lang, t }) {
  if (!data) return null;
  const app = data.app || {};
  const level = data.level || 'proceed'; // 'proceed' | 'pause' | 'stop'
  const labelText = data.label?.[lang] || data.label?.en || '';
  const subtitleText = data.subtitle?.[lang] || data.subtitle?.en || '';
  const asOfFormatted = formatDate(data.asOf, lang);

  // Speech narration
  const speechText = [
    labelText,
    subtitleText,
    ...(data.signals || []).filter(s => s.status === 'warn').map(s => s[lang] || s.en),
  ].filter(Boolean).join('. ');

  // Sort signals: warn signals first, then info, unknown, ok
  const sortedSignals = [...(data.signals || [])].sort((a, b) => {
    const rank = { warn: 0, info: 1, unknown: 2, ok: 3 };
    return (rank[a.status] ?? 4) - (rank[b.status] ?? 4);
  });

  return (
    <div className={`result-card real-app-card level-${level}`}>
      {/* 1. App identity header: icon, title, developer, star rating, ratings */}
      <div className="assess-app-header">
        <div className="assess-app-identity">
          {app.icon ? (
            <img src={app.icon} alt={app.title || 'App icon'} className="assess-app-icon" />
          ) : (
            <div className="assess-app-icon-fallback">📱</div>
          )}
          <div className="assess-app-info">
            <h2 className="assess-app-title">{app.title || app.packageId}</h2>
            {data.resolvedFromSearch && (
              <div className="assess-resolved-search-line">
                {t.matchedSearchTo(data.resolvedFromSearch.title, data.resolvedFromSearch.developer)}
              </div>
            )}
            {app.developer && (
              <div className="assess-app-dev">{t.developer}: {app.developer}</div>
            )}
            <div className="assess-app-stats">
              {app.rating != null && (
                <span className="assess-star-rating">
                  ★ {Number(app.rating).toFixed(1)}
                </span>
              )}
              {app.ratings != null && (
                <span className="assess-ratings-count">
                  ({formatRatings(app.ratings)} {t.ratingsSuffix})
                </span>
              )}
              {app.installs && (
                <span className="assess-installs">
                  • 📥 {app.installs}
                </span>
              )}
            </div>
          </div>
        </div>

        {app.playUrl && (
          <a
            href={app.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="assess-play-btn"
            title="Google Play Store"
          >
            <span>{t.viewOnPlay}</span> ↗
          </a>
        )}
      </div>

      {/* Calm blue info banner when not a lending app */}
      {data.lending === false && (
        <div className="assess-non-lending-banner">
          <span className="non-lending-icon">ℹ️</span>
          <span className="non-lending-text">{t.notLendingBanner}</span>
        </div>
      )}

      {/* 2. Banner: appropriate icon + phrase line */}
      <div className={`assess-banner banner-${level}`}>
        <div className="assess-banner-main">
          <div className="assess-banner-icon-wrap" aria-hidden="true">
            {level === 'proceed' ? '✅' : level === 'pause' ? '⚠️' : '🛑'}
          </div>
          <div className="assess-banner-content">
            <div className="assess-banner-label">
              {labelText}
            </div>
            <div className="assess-banner-subtitle">
              {subtitleText}
            </div>
          </div>
          <button
            className="listen-btn assess-listen-btn"
            onClick={() => speak(speechText, lang)}
            type="button"
            title={t.listen}
          >
            🔊 {t.listen}
          </button>
        </div>

        <div className="assess-banner-meta">
          <span className="assess-meta-item">
            📅 {t.asOfChecked(asOfFormatted)}
          </span>
          <span className="assess-meta-divider">•</span>
          <span className="assess-meta-item">
            💾 {t.sourceLabel(data.source)}
          </span>
        </div>
      </div>

      {/* 3. Score breakdown: Permissions /40, RBI registration /40, Transparency /20, Total /100 */}
      {data.score && (
        <div className="section-card assess-score-card">
          <div className="assess-score-header">
            <div className="assess-score-title-group">
              <span className="assess-score-subtitle">{t.scoreBreakdownTitle}</span>
              <h3 className="assess-score-total">
                {t.totalWarningScore}: <strong>{data.score.total}</strong> / 100
              </h3>
            </div>
          </div>

          <div className="bars-section">
            <ScoreBar
              label={t.permissionsScore}
              value={data.score.permission ?? 0}
              max={data.score.max?.permission || 40}
              level={data.score.permission >= 20 ? 'high' : data.score.permission > 0 ? 'medium' : 'low'}
            />
            <ScoreBar
              label={t.registrationScore}
              value={data.score.registration ?? 0}
              max={data.score.max?.registration || 40}
              level={data.score.registration >= 25 ? 'high' : data.score.registration > 0 ? 'medium' : 'low'}
            />
            <ScoreBar
              label={t.transparencyScore}
              value={data.score.transparency ?? 0}
              max={data.score.max?.transparency || 20}
              level={data.score.transparency >= 10 ? 'high' : data.score.transparency > 0 ? 'medium' : 'low'}
            />
          </div>
        </div>
      )}

      {/* 4. "Why this result" list: warn signals first */}
      {sortedSignals.length > 0 && (
        <div className="section-card">
          <div className="section-title">
            🔍 {t.whyThisResult}
            <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 6 }}>
              ({t.whyThisResultSub})
            </span>
          </div>
          <ul className="assess-signals-list">
            {sortedSignals.map((sig, idx) => {
              const status = sig.status || 'info';
              return (
                <li key={sig.id || idx} className={`assess-signal-item status-${status}`}>
                  <span className={`assess-signal-badge status-${status}`}>
                    {status === 'ok' && '✔'}
                    {status === 'warn' && '⚠️'}
                    {status === 'info' && 'ℹ️'}
                    {status === 'unknown' && '❓'}
                  </span>
                  <div className="assess-signal-content">
                    <span className="assess-signal-text">{sig[lang] || sig.en}</span>
                    {sig.source && (
                      <span className="assess-signal-source">{sig.source}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 5. Note */}
      {data.note && (
        <div className="assess-bottom-note">
          <span className="note-icon">ℹ️</span>
          <p className="note-text">{data.note[lang] || data.note.en}</p>
        </div>
      )}

      {/* Link to Loan Cost Calculator */}
      <div className="assess-calc-link-card">
        <a
          href="#loan-calculator"
          className="assess-calc-link"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('loan-calculator')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>🧮 {t.calcRealCostLink}</span>
          <span className="assess-calc-arrow">↓</span>
        </a>
      </div>
    </div>
  );
}

// ── Compact RBI directory record section (Shown below RealAppCard) ────────────
function RbiDirectoryRecord({ data, directoryResult, lang, t }) {
  if (!data) return null;
  const app = data.app || {};
  const dir = data.directory || {};
  const isLookalike = dir.match === 'lookalike';

  // 1. All directory records for this app from assess data
  let records = Array.isArray(dir.records) ? dir.records : [];

  // 2. If records is empty, fall back to directoryResult matches with grievance info
  if (records.length === 0 && !isLookalike && directoryResult?.matches?.length) {
    const fallbackMatches = directoryResult.matches.filter(
      (m) => m.grievance && (m.grievance.name || m.grievance.email || m.grievance.phone || m.grievance.mobile)
    );
    if (fallbackMatches.length > 0) {
      records = fallbackMatches.map((m) => ({
        appName: m.appName,
        lender: m.lender,
        grievance: m.grievance,
      }));
    }
  }

  // 3. If records is empty, show nothing for this section (unless lookalike warning)
  if (records.length === 0 && !isLookalike) {
    return null;
  }

  return (
    <div className="card assess-dir-record-card">
      <div className="section-title">
        📋 {t.rbiRecordTitle}
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--on-surface-variant)', marginLeft: 6 }}>
          ({t.rbiRecordTitleHi})
        </span>
      </div>

      <div className="assess-dir-record-content">
        {isLookalike && (
          <div className="lookalike-box">
            <span className="lookalike-icon">⚠️</span>
            <div className="lookalike-text">
              {t.lookalikeWarning}
            </div>
          </div>
        )}

        {records.length > 0 && (
          <div className="assess-dir-record-list">
            {records.map((rec, idx) => (
              <div key={idx} className="assess-record-block">
                {rec.lender && (
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>
                    <span className="assess-dir-lender">{rec.lender}</span>
                  </div>
                )}

                {rec.appName && rec.appName.toLowerCase() !== (app.title || '').toLowerCase() && (
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.matchedEntryHi : t.matchedEntry}:</span>
                    <span className="assess-dir-val">{rec.appName}</span>
                  </div>
                )}

                {rec.grievance && (
                  <GrievanceBox grievance={rec.grievance} t={t} showNote={false} />
                )}
              </div>
            ))}
          </div>
        )}

        {records.some((r) => r.grievance && (r.grievance.name || r.grievance.email || r.grievance.phone || r.grievance.mobile)) && (
          <div className="dir-grievance-note">
            ℹ️ {t.grievanceNote}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to detect Google Play links or package IDs
function isPlayInput(input) {
  const s = String(input || '').trim();
  if (!s) return false;
  if (/play\.google\.com/i.test(s)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+$/.test(s)) return true;
  return false;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]               = useState('en');
  const [activeTab, setActiveTab]     = useState('checker'); // 'checker' | 'trusted'
  const [name, setName]               = useState('');
  const [apps, setApps]               = useState([]);
  const [stats, setStats]             = useState(null);
  const [result, setResult]           = useState(null);
  const [assessResult, setAssessResult] = useState(null);
  const [playUnavailable, setPlayUnavailable] = useState(null);
  const [notFound, setNotFound]       = useState(null);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [showBanner, setShowBanner]   = useState(true);

  // Trusted apps state
  const [trustedData, setTrustedData] = useState(null);
  const [trustedLoading, setTrustedLoading] = useState(false);
  const [trustedError, setTrustedError] = useState('');
  const [trustedSearch, setTrustedSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState(''); // '' | 'high' | 'well'
  const [sortBy, setSortBy] = useState('best'); // 'best' | 'rating' | 'reviews'

  const t = UI[lang];

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(list => {
        // Hide demo apps from suggestions
        setApps(list.filter(a => !a.demo && !a.name?.toLowerCase().includes('demo')));
      })
      .catch(() => {});

    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // Debounce search in trusted apps
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(trustedSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [trustedSearch]);

  // Fetch trusted apps when tab is open or filters change
  useEffect(() => {
    if (activeTab !== 'trusted') return;
    let cancelled = false;
    setTrustedLoading(true);
    setTrustedError('');

    const params = new URLSearchParams();
    if (selectedTier) params.set('tier', selectedTier);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    params.set('limit', '100');

    fetch(`/api/trusted?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setTrustedData(data);
          setTrustedLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrustedError(t.serverError);
          setTrustedLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [activeTab, selectedTier, debouncedSearch]);

  async function runCheck(appName) {
    const query = String(appName || '').trim();
    if (!query) return;

    setLoading(true);
    setError('');
    setResult(null);
    setAssessResult(null);
    setPlayUnavailable(null);
    setNotFound(null);

    // 1. If it looks like a Google Play link or package ID, call /api/assess directly
    if (isPlayInput(query)) {
      try {
        const res = await fetch(`/api/assess?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setAssessResult(data);
        } else {
          setError(data.message || data.error || t.serverError);
        }
      } catch {
        setError(t.serverError);
      }
      setLoading(false);
      return;
    }

    // 2. Plain name search: call /api/assess and /api/check in parallel
    try {
      const [checkRes, assessRes] = await Promise.all([
        fetch(`/api/check?name=${encodeURIComponent(query)}`).catch(() => null),
        fetch(`/api/assess?input=${encodeURIComponent(query)}`).catch(() => null),
      ]);

      const checkData = checkRes ? await checkRes.json().catch(() => null) : null;
      const assessData = assessRes ? await assessRes.json().catch(() => null) : null;

      if (assessRes && assessRes.ok && assessData && !assessData.error) {
        // Assessment succeeded: show assessment card as main result
        setAssessResult(assessData);
        if (checkRes && checkRes.status === 200 && checkData) {
          setResult(checkData);
        } else {
          setResult(null);
        }
        setPlayUnavailable(null);
      } else {
        // Assessment failed (e.g. NEEDS_LINK, PLAY_UNAVAILABLE):
        // Fall back to existing directory result, and show server's message in small grey info note
        setAssessResult(null);
        const serverError = assessData || { message: t.playUnavailableNote };
        setPlayUnavailable(serverError);

        if (checkRes && checkRes.status === 200 && checkData) {
          setResult(checkData);
        } else if (checkRes && checkRes.status === 404 && checkData) {
          const suggestions = (checkData.suggestions || []).filter(s => !s.toLowerCase().includes('demo'));
          setNotFound(suggestions);
        } else {
          setError(assessData?.message || checkData?.error || t.serverError);
        }
      }
    } catch {
      setError(t.serverError);
    }
    setLoading(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (name.trim()) runCheck(name);
  }

  function onSelectTrustedApp(appName) {
    setActiveTab('checker');
    setName(appName);
    runCheck(appName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Client-side sorting of loaded trusted items
  const sortedTrustedItems = [...(trustedData?.items || [])].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating - a.rating) || (b.ratings - a.ratings);
    }
    if (sortBy === 'reviews') {
      return (b.ratings - a.ratings) || (b.rating - a.rating);
    }
    // default: 'best' (trustScore)
    return (b.trustScore - a.trustScore) || (b.ratings - a.ratings);
  });

  // Decide which result component to show
  // Shape A has result.score; Shape B has result.mode === 'directory_only'
  const isDirectory = result && (result.mode === 'directory_only' || !result.score);

  return (
    <div className="page">
      {/* ── Sticky header ── */}
      <header className="site-header">
        <div className="header-inner">
          <div
            className="logo-group"
            onClick={() => setActiveTab('checker')}
            style={{ cursor: 'pointer' }}
            title={t.title}
          >
            <img src="/karz-kavach-shield.png" alt="Karz Kavach" className="logo-shield-img" />
            <div className="logo-text">
              <span className="logo-en">{t.title}</span>
              <span className="logo-hi">{t.titleHi}</span>
            </div>
          </div>

          <div className="header-right">
            <nav className="header-nav" aria-label="Main Navigation">
              <button
                className={`nav-tab ${activeTab === 'checker' ? 'active' : ''}`}
                onClick={() => setActiveTab('checker')}
                type="button"
              >
                🔍 {t.navChecker}
              </button>
              <button
                className={`nav-tab ${activeTab === 'trusted' ? 'active' : ''}`}
                onClick={() => setActiveTab('trusted')}
                type="button"
              >
                ⭐ {t.navTrusted}
              </button>
            </nav>

            <div className="lang-toggle">
              <button
                className={lang === 'en' ? 'on' : ''}
                onClick={() => setLang('en')}
                type="button"
              >EN</button>
              <button
                className={lang === 'hi' ? 'on' : ''}
                onClick={() => setLang('hi')}
                type="button"
              >हिंदी</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main-content">
        <div className="inner">

          {/* Yellow Banner */}
          {showBanner && (
            <aside className="demo-banner">
              <span className="demo-banner-icon">⚠️</span>
              <span className="demo-banner-text">
                {t.bannerText}
              </span>
              <button
                onClick={() => setShowBanner(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#854d0e', fontSize: 14, padding: 0 }}
                aria-label="Dismiss"
                type="button"
              >✕</button>
            </aside>
          )}

          {activeTab === 'checker' ? (
            <>
              {/* Hero — only show when no result or assessment result */}
              {!result && !assessResult && !notFound && !error && (
            <div className="hero">
              <div className="hero-shield">
                <img src="/karz-kavach-shield.png" alt="Karz Kavach" className="hero-shield-img" />
              </div>
              <span className="hero-tag">🔒 {t.heroTag}</span>
              <h1 className="hero-title">
                {t.title}{' '}
                <span className="hero-title-hi">{t.titleHi}</span>
              </h1>
              <p className="hero-tagline">
                "{t.tagline}"
                <span className="hero-tagline-hi">{t.taglineHi}</span>
              </p>
            </div>
          )}

          {/* Search card */}
          <section className="search-card">
            <label className="search-label" htmlFor="app-search-input">
              🔍 {t.searchLabel}
            </label>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="search-input-wrap">
                <input
                  id="app-search-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                />
              </div>

              <button
                type="submit"
                className="search-btn"
                disabled={loading || !name.trim()}
              >
                {loading ? t.checking : t.check}
                <span style={{ fontSize: 20 }}>→</span>
              </button>
            </form>

            {/* Try chips for real apps */}
            <div className="try-chips-row">
              <span className="try-label">{t.tryLabel}</span>
              <div className="try-chips">
                {TRY_APPS.map(appName => (
                  <button
                    key={appName}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => { setName(appName); runCheck(appName); }}
                  >
                    {appName}
                  </button>
                ))}
              </div>
            </div>

            {/* Prominent explore trusted apps button */}
            <button
              type="button"
              className="explore-trusted-btn"
              onClick={() => setActiveTab('trusted')}
            >
              <span>🛡️ {t.exploreTrusted}</span>
              <span style={{ fontSize: 18 }}>→</span>
            </button>
          </section>

          {/* Error card */}
          {error && (
            <div className="card error-card">{error}</div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="card">
              <p className="not-found-text">{t.notFound}</p>
              <div className="chips">
                {notFound.map(n => (
                  <button
                    key={n}
                    type="button"
                    className="chip"
                    onClick={() => { setName(n); runCheck(n); }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading spinner for assessment while it loads, so old card does not appear first and jump */}
          {loading && (
            <div className="card assess-loading-card">
              <span className="assess-spinner">⏳</span>
              <span>{t.assessingPlay}</span>
            </div>
          )}

          {/* 1. When /api/assess succeeds, show ONLY the assessment card as the main result */}
          {/* 2. Below it, show one compact section "RBI directory record" with lender and grievance */}
          {/* 3. Old "Permission exposure" section and old "Listed in directory" banner are hidden */}
          {!loading && assessResult && (
            <>
              <RealAppCard data={assessResult} lang={lang} t={t} />
              <RbiDirectoryRecord data={assessResult} directoryResult={result} lang={lang} t={t} />
            </>
          )}

          {/* 4. If /api/assess fails or the app has no Play ID, show old directory result as before, plus small grey note */}
          {!loading && !assessResult && result && (
            isDirectory
              ? <DirResult r={result} playUnavailable={playUnavailable} lang={lang} t={t} onSearch={(simName) => { setName(simName); runCheck(simName); }} />
              : <FullResult r={result} lang={lang} t={t} />
          )}

          {/* Loan Cost Calculator Section */}
          <LoanCostCalculator lang={lang} t={t} />
          </>
          ) : (
            /* ── Trusted Apps Section ── */
            <div className="trusted-view">
              <div className="trusted-hero">
                <span className="trusted-hero-badge">⭐ {t.trustedHeroTag}</span>
                <h1 className="trusted-title">{t.trustedHeading}</h1>
                <p className="trusted-subtext">{t.trustedSubtext}</p>
              </div>

              {/* Controls: Search, Filter Chips, Sort Dropdown */}
              <section className="search-card trusted-controls-card">
                <div className="search-input-wrap">
                  <input
                    type="search"
                    value={trustedSearch}
                    onChange={e => setTrustedSearch(e.target.value)}
                    placeholder={t.trustedSearchPlaceholder}
                    aria-label={t.trustedSearchPlaceholder}
                  />
                  {trustedSearch && (
                    <button
                      type="button"
                      onClick={() => setTrustedSearch('')}
                      className="search-clear-btn"
                      aria-label="Clear search"
                    >✕</button>
                  )}
                </div>

                <div className="trusted-filter-row">
                  <div className="trusted-chips">
                    <button
                      type="button"
                      className={`chip ${selectedTier === '' ? 'chip-active' : ''}`}
                      onClick={() => setSelectedTier('')}
                    >
                      {t.filterAll}
                    </button>
                    <button
                      type="button"
                      className={`chip ${selectedTier === 'high' ? 'chip-active' : ''}`}
                      onClick={() => setSelectedTier('high')}
                    >
                      ⭐ {t.filterHigh}
                    </button>
                    <button
                      type="button"
                      className={`chip ${selectedTier === 'well' ? 'chip-active' : ''}`}
                      onClick={() => setSelectedTier('well')}
                    >
                      ✨ {t.filterWell}
                    </button>
                  </div>

                  <div className="trusted-sort-box">
                    <label htmlFor="trusted-sort-select" className="trusted-sort-label">
                      {t.sortLabel}:
                    </label>
                    <select
                      id="trusted-sort-select"
                      className="trusted-sort-select"
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                    >
                      <option value="best">{t.sortBest}</option>
                      <option value="rating">{t.sortRating}</option>
                      <option value="reviews">{t.sortReviews}</option>
                    </select>
                  </div>
                </div>

                {trustedData && trustedData.available && (
                  <div className="trusted-meta-bar">
                    <span>{t.showingApps(sortedTrustedItems.length, trustedData.count || trustedData.total)}</span>
                    {trustedData.generatedAt && (
                      <span className="trusted-date-text">
                        {t.ratingsFetchedOn(formatDate(trustedData.generatedAt, lang))}
                      </span>
                    )}
                  </div>
                )}
              </section>

              {/* Loading indicator */}
              {trustedLoading && (
                <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                  <p style={{ color: 'var(--on-surface-variant)', fontWeight: 600 }}>{t.checking}</p>
                </div>
              )}

              {/* Error state */}
              {trustedError && (
                <div className="card error-card">{trustedError}</div>
              )}

              {/* Unavailable state */}
              {trustedData && !trustedData.available && (
                <div className="card">
                  <p className="not-found-text">ℹ️ {t.trustedNotBuilt}</p>
                </div>
              )}

              {/* Empty state */}
              {!trustedLoading && trustedData?.available && sortedTrustedItems.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                  <p className="not-found-text">🔍 {t.notFoundTrusted}</p>
                </div>
              )}

              {/* Trusted Cards Grid */}
              {!trustedLoading && trustedData?.available && sortedTrustedItems.length > 0 && (
                <div className="trusted-grid">
                  {sortedTrustedItems.map(item => (
                    <div
                      key={item.packageId || item.appName}
                      className="trusted-card"
                      onClick={() => onSelectTrustedApp(item.appName)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTrustedApp(item.appName); }}
                    >
                      {/* Top: Name, Lender & Trust Score */}
                      <div className="trusted-card-header">
                        <div className="trusted-app-info">
                          <h3 className="trusted-app-name">{item.appName}</h3>
                          <div className="trusted-lender-name">
                            <span className="trusted-lender-label">{t.lenderLabel}:</span> {item.lender}
                          </div>
                        </div>
                        <div className="trusted-score-badge" title={t.trustScoreDesc}>
                          <span className="trusted-score-label">{t.trustLabel}</span>
                          <div className="trusted-score-num-wrap">
                            <span className="trusted-score-num">{item.trustScore}</span>
                            <span className="trusted-score-denom">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges row: Tier badge + Installs (if present) */}
                      <div className="trusted-badges-row">
                        <span className={`trusted-tier-badge ${item.tier === 'high' ? 'tier-high' : 'tier-well'}`}>
                          {item.tier === 'high' ? '⭐ ' + t.tierHigh : '✨ ' + t.tierWell}
                        </span>
                        {item.installs && (
                          <span className="trusted-installs-badge">
                            📥 {item.installs}
                          </span>
                        )}
                      </div>

                      {/* Two signals shown SEPARATELY */}
                      <div className="trusted-signals-box">
                        <div className="trusted-signal-item rbi-signal">
                          <span className="signal-icon">📋</span>
                          <span className="signal-text">{t.rbiSignal}</span>
                          <span className="rbi-pill">{t.rbiListedPill}</span>
                        </div>
                        <div className="trusted-signal-item play-signal">
                          <span className="signal-icon">⭐</span>
                          <span className="signal-text">
                            {t.playSignalPrefix}: <strong>{item.rating} ★</strong> ({formatRatings(item.ratings)} {t.ratingsSuffix})
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom: Click to check hint + View on Google Play link */}
                      <div className="trusted-card-footer">
                        <span className="trusted-check-cta">
                          🔍 {t.checkAppHint}
                        </span>
                        {item.packageId && (
                          <a
                            href={`https://play.google.com/store/apps/details?id=${encodeURIComponent(item.packageId)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="trusted-play-link"
                            onClick={(e) => e.stopPropagation()}
                            title="Google Play Store"
                          >
                            <span>{t.viewOnPlay}</span> ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer>{t.footer}</footer>
    </div>
  );
}
