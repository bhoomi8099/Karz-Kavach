// Reads what Google Play shows for an app: details, permissions, data safety, and whether the
// privacy policy link opens. Needs internet and the google-play-scraper package (unofficial).
//
// Offline mode: set KK_OFFLINE=1 to use only the saved snapshot (data/play-snapshot.json).
// If a live lookup fails, the snapshot is used as a fallback automatically.

const fs = require('fs');
const path = require('path');

const SNAPSHOT_FILE = path.join(__dirname, 'data', 'play-snapshot.json');
const CACHE_MS = 6 * 60 * 60 * 1000;
const cache = new Map();
const lastErrors = new Map(); // packageId -> last error message (to explain failures)

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

// 'ok' (page opens), 'broken' (404/410), 'unknown' (blocked, error, offline), 'none' (no link)
async function checkUrl(url, timeoutMs = 6000, fetchImpl = globalThis.fetch) {
  if (!url) return 'none';
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeoutMs);
    const res = await fetchImpl(url, { method: 'GET', redirect: 'follow', signal: ctl.signal });
    clearTimeout(timer);
    if (res.status >= 200 && res.status < 400) return 'ok';
    if (res.status === 404 || res.status === 410) return 'broken';
    return 'unknown';
  } catch (err) {
    return 'unknown';
  }
}

// Keep only what scoring needs, so the snapshot file stays small.
function trimDetails(d) {
  if (!d) return null;
  return {
    title: d.title,
    developer: d.developer,
    developerEmail: d.developerEmail,
    developerWebsite: d.developerWebsite,
    developerAddress: d.developerAddress,
    privacyPolicy: d.privacyPolicy,
    description: String(d.description || d.summary || '').slice(0, 4000),
    score: d.score,
    ratings: d.ratings,
    installs: d.installs,
    released: d.released,
    updated: d.updated,
    icon: d.icon,
    appId: d.appId,
  };
}

let snapshotData = null;
function loadSnapshot() {
  if (snapshotData) return snapshotData;
  try {
    snapshotData = JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
  } catch (err) {
    snapshotData = { items: {} };
  }
  return snapshotData;
}

async function fetchLive(packageId, timeoutMs) {
  const gplay = (await import('google-play-scraper')).default;
  const opts = { appId: packageId, lang: 'en', country: 'in' };
  // Optional calls must never break the main lookup (even if the library lacks the function).
  const optional = (fn) => {
    try {
      return withTimeout(Promise.resolve(fn(opts)), timeoutMs).catch(() => null);
    } catch (err) {
      return Promise.resolve(null);
    }
  };
  const [details, permissionItems, datasafety] = await Promise.all([
    withTimeout(gplay.app(opts), timeoutMs),
    optional((o) => gplay.permissions(o)),
    optional((o) => gplay.datasafety(o)),
  ]);
  const trimmed = trimDetails(details);
  const policyStatus = await checkUrl(trimmed && trimmed.privacyPolicy);
  return { details: trimmed, permissionItems, datasafety, policyStatus };
}

// Returns { details, permissionItems, datasafety, policyStatus, source, fetchedAt } or null.
async function getPlayData(packageId, { offline = process.env.KK_OFFLINE === '1', timeoutMs = 9000, live = fetchLive } = {}) {
  const hit = cache.get(packageId);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;

  if (!offline) {
    try {
      const data = { ...(await live(packageId, timeoutMs)), source: 'live', fetchedAt: new Date().toISOString() };
      if (data.details) {
        cache.set(packageId, { at: Date.now(), data });
        return data;
      }
    } catch (err) {
      lastErrors.set(packageId, String((err && err.message) || err));
      console.error(`[play] live lookup failed for ${packageId}: ${(err && err.message) || err}`);
      // fall through to the snapshot
    }
  }
  const snap = loadSnapshot().items[packageId];
  if (snap) return { ...snap, source: 'snapshot' };
  if (offline) {
    lastErrors.set(packageId, 'Offline mode is ON (KK_OFFLINE=1) and this app is not in the saved snapshot.');
    console.error(`[play] ${packageId}: offline mode is ON and the app is not in data/play-snapshot.json`);
  }
  return null;
}

// Searches Google Play by name. Returns [{ appId, title, developer }] (empty if offline or failed).
async function searchPlay(term, { offline = process.env.KK_OFFLINE === '1', timeoutMs = 9000 } = {}) {
  if (offline) return [];
  try {
    const gplay = (await import('google-play-scraper')).default;
    const res = await withTimeout(gplay.search({ term, num: 8, lang: 'en', country: 'in' }), timeoutMs);
    return (res || []).map((r) => ({ appId: r.appId, title: r.title, developer: r.developer }));
  } catch (err) {
    console.error(`[play] search failed for "${term}": ${(err && err.message) || err}`);
    return [];
  }
}

function lastError(packageId) {
  return lastErrors.get(packageId) || null;
}

module.exports = { getPlayData, searchPlay, lastError, fetchLive, checkUrl, trimDetails, SNAPSHOT_FILE };
