// Reads the permissions the Google Play Store lists for an app, and turns them into a
// "permission exposure" report using the same weights as the demo scoring.
//
// IMPORTANT wording rule: this is about what the app CAN access. It is not a finding that
// the app misuses anything, and it is never called Safe or Risky for a real app.

const { PERMISSIONS } = require('./messages');

const MAX_PERMISSION = 40;

// Play Store permission sentences (lower case) -> our permission names.
const RULES = [
  ['READ_CONTACTS', /read your contacts/],
  ['READ_SMS', /(read|receive|view).*(text messages|sms|mms)/],
  ['READ_CALL_LOG', /read call log/],
  ['READ_PHONE_STATE', /phone status and identity|read phone status/],
  ['READ_EXTERNAL_STORAGE', /contents of your (usb|shared) storage|read.*(photos|media|files)|sd card/],
  ['ACCESS_FINE_LOCATION', /precise location/],
  ['RECORD_AUDIO', /record audio/],
  ['CAMERA', /take pictures and videos/],
];

const LEVELS = {
  low: {
    en: 'Low permission exposure',
    hi: 'परमिशन एक्सपोज़र कम',
  },
  medium: {
    en: 'Medium permission exposure',
    hi: 'परमिशन एक्सपोज़र मध्यम',
  },
  high: {
    en: 'High permission exposure',
    hi: 'परमिशन एक्सपोज़र ज़्यादा',
  },
};

const NOTE = {
  en: "Based on the permissions this app's Google Play listing declares. It shows what the app can access, not that it misuses it. Check permissions in your phone settings too.",
  hi: 'यह इस ऐप की Google Play लिस्टिंग में बताई गई परमिशन पर आधारित है। इससे पता चलता है कि ऐप क्या एक्सेस कर सकता है, यह नहीं कि वह उसका गलत इस्तेमाल करता है। अपने फोन की सेटिंग में भी परमिशन जांचें।',
};

function levelFor(score) {
  if (score >= 25) return 'high';
  if (score >= 10) return 'medium';
  return 'low';
}

// items: [{ permission: 'read your contacts', type: 'Contacts' }, ...] from the Play Store
function buildPermissionReport(items) {
  const found = new Set();
  for (const item of items || []) {
    const text = String((item && item.permission) || '').toLowerCase();
    for (const [name, re] of RULES) {
      if (re.test(text)) found.add(name);
    }
  }
  // READ_MEDIA_IMAGES has the same effect as storage, so we only count storage once.
  const list = [...found]
    .map((name) => ({ permission: name, weight: PERMISSIONS[name].weight, en: PERMISSIONS[name].en, hi: PERMISSIONS[name].hi }))
    .sort((a, b) => b.weight - a.weight);
  const score = Math.min(MAX_PERMISSION, list.reduce((sum, p) => sum + p.weight, 0));
  const level = levelFor(score);
  return {
    available: true,
    source: 'google_play',
    permissions: list,
    score,
    max: MAX_PERMISSION,
    level,
    levelLabel: LEVELS[level],
    note: NOTE,
  };
}

// ----- fetching (needs the google-play-scraper package and internet) -----

const cache = new Map(); // packageId -> { at, items }
const CACHE_MS = 6 * 60 * 60 * 1000;

async function fetchPlayPermissions(packageId, timeoutMs = 8000) {
  const hit = cache.get(packageId);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.items;

  const gplay = (await import('google-play-scraper')).default;
  const items = await Promise.race([
    gplay.permissions({ appId: packageId, lang: 'en', country: 'in' }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
  ]);
  cache.set(packageId, { at: Date.now(), items });
  return items;
}

// Adds r.permissionReport to a "Listed in directory" result when we know the Play Store id.
// If anything goes wrong the result is returned unchanged except for { available: false }.
async function enrichWithPermissions(result, fetcher = fetchPlayPermissions) {
  if (!result || result.mode !== 'directory_only' || result.verdict !== 'LISTED') return result;
  const withId = (result.matches || []).find((m) => m.packageId);
  if (!withId) return result;
  try {
    const items = await fetcher(withId.packageId);
    result.permissionReport = buildPermissionReport(items);
    result.permissionReport.packageId = withId.packageId;
  } catch (err) {
    result.permissionReport = { available: false };
  }
  return result;
}

module.exports = { buildPermissionReport, enrichWithPermissions, fetchPlayPermissions, MAX_PERMISSION };
