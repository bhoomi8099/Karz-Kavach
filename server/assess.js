// Ties it together: find the app (Play link, app ID, or a name from the RBI directory),
// read its Play data, match it against the RBI directory, and score it.

const { searchDirectory, normalize, similarity } = require('./scoring');
const { assess } = require('./realScoring');
const { getPlayData, searchPlay, lastError } = require('./playData');

const PACKAGE_RE = /^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+$/;
const PLAY_ID_RE = /[?&]id=([A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+)/;

// Accepts a Play Store link or a bare package ID. Returns the package ID, or null.
function parsePackageId(input) {
  const s = String(input || '').trim();
  if (!s) return null;
  const link = s.match(PLAY_ID_RE);
  if (link) return link[1];
  if (PACKAGE_RE.test(s)) return s;
  return null;
}

// "Navi: UPI, Loans" -> "Navi"
function brandOf(title) {
  return String(title || '').split(/:| - | – |\|/)[0].trim();
}

const STOP_TOKENS = new Set(['private', 'limited', 'technologies', 'technology', 'services', 'finance', 'financial', 'fintech', 'india',
  'loan', 'loans', 'personal', 'credit', 'cash', 'instant', 'capital', 'solutions', 'company', 'industries', 'bank', 'apps', 'digital',
  'money', 'lending', 'online', 'holdings', 'investments', 'enterprises', 'global', 'pvt', 'ltd']);
function sigTokens(text) {
  return String(text || '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !STOP_TOKENS.has(w));
}

// Does a directory record's Play link really point to the app the record names?
// (Guards against a wrong link on a directory row: same words in the names, or in lender vs developer.)
function looksSameApp(entry, details) {
  const a = normalize(brandOf(entry.appName));
  const b = normalize(brandOf(details.title));
  if (a && b && (a === b || (Math.min(a.length, b.length) >= 4 && (a.includes(b) || b.includes(a))) || similarity(brandOf(entry.appName), brandOf(details.title)) >= 0.6)) return true;
  const nameTokens = new Set(sigTokens(entry.appName));
  if (sigTokens(details.title).some((t) => nameTokens.has(t))) return true;
  const lenderTokens = new Set(sigTokens(entry.lender));
  return sigTokens(details.developer).some((t) => lenderTokens.has(t));
}

// Picks the Play search result that is really the app the user typed (brand match), or null.
function pickSearchResult(query, results) {
  const q = normalize(query);
  if (q.length < 3) return null;
  for (const r of results) {
    const n = normalize(brandOf(r.title));
    if (!n) continue;
    if (n === q || similarity(query, brandOf(r.title)) >= 0.8 || (q.length >= 4 && n.startsWith(q))) return r;
  }
  return null;
}

// All directory records for the same app (same Play ID, or the same app name under other lenders).
function relatedRecords(directory, entry, ignoreIds = new Set()) {
  const name = normalize(entry.appName);
  return directory.filter(
    (e) => e === entry || (entry.packageId && !ignoreIds.has(entry.packageId) && e.packageId === entry.packageId) || normalize(e.appName) === name
  );
}

// How does this Play app relate to the RBI directory?
function findMatch(packageId, title, directory, ignoreIds = new Set()) {
  const byId = directory.find((e) => e.packageId === packageId && !ignoreIds.has(e.packageId));
  if (byId) return { type: 'id', entry: byId, entries: relatedRecords(directory, byId, ignoreIds) };

  // Try the full title and the brand before ":" or " - " ("Navi: UPI, Loans" -> "Navi").
  const brand = brandOf(title);
  const queries = [title, brand].filter(Boolean);
  let best = null;
  for (const q of queries) {
    const hits = searchDirectory(q, directory, 0.9);
    if (hits.length && (!best || hits[0].score > best.score)) best = hits[0];
  }
  if (!best) return { type: 'none' };
  const knownId = best.entry.packageId && !ignoreIds.has(best.entry.packageId) ? best.entry.packageId : null;
  if (knownId && knownId !== packageId) return { type: 'lookalike', entry: best.entry, entries: [best.entry] };
  return { type: 'name', entry: best.entry, entries: relatedRecords(directory, best.entry, ignoreIds) };
}

// Returns { status, body }.
// A Play Store SEARCH link (play.google.com/store/search?q=navi) has no app ID. Use its search word as the name.
function searchWordFromLink(input) {
  const m = String(input || '').match(/play\.google\.com\/store\/search\?(?:[^\s#]*&)?q=([^&\s#]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1].replace(/\+/g, ' ')).trim() || null;
  } catch (err) {
    return null;
  }
}

async function assessApp(input, directory, getData = getPlayData, now = Date.now(), searchApp = searchPlay) {
  input = searchWordFromLink(input) || input;
  let packageId = parsePackageId(input);
  let fromDirectory = null;
  let fromSearch = null;
  let typedName = '';
  const ignoreIds = new Set();

  if (!packageId) {
    // Not a link or ID: maybe a name from the RBI directory that has a known Play ID.
    const q = String(input || '').trim();
    typedName = q;
    if (!q) {
      return { status: 400, body: { error: 'EMPTY', message: 'Paste a Google Play link or an app ID.' } };
    }
    const hit = searchDirectory(q, directory, 0.8).find((h) => h.entry.packageId);
    if (hit) {
      packageId = hit.entry.packageId;
      fromDirectory = hit.entry;
    } else {
      // The directory has no Play link for this name: look for the app on Google Play itself.
      let picked = pickSearchResult(q, await searchApp(q));
      if (!picked) picked = pickSearchResult(q, await searchApp(q + ' loan app'));
      if (!picked) {
        return {
          status: 404,
          body: {
            error: 'NEEDS_LINK',
            message: "We could not find that app on Google Play by name. Paste the app's Google Play link (play.google.com/store/apps/details?id=...) or its app ID.",
          },
        };
      }
      packageId = picked.appId;
      fromSearch = { title: picked.title, developer: picked.developer };
    }
  }

  let play = await getData(packageId);

  // The directory's Play link must really belong to the app it names. If not, ignore that link and search Google Play instead.
  if (fromDirectory && play && play.details && !looksSameApp(fromDirectory, play.details)) {
    ignoreIds.add(fromDirectory.packageId);
    let picked = pickSearchResult(typedName, await searchApp(typedName));
    if (!picked) picked = pickSearchResult(typedName, await searchApp(typedName + ' loan app'));
    if (!picked) {
      return {
        status: 404,
        body: {
          error: 'NEEDS_LINK',
          message: "The Play link saved for this name in our directory data seems to point to a different app, so we did not use it. Paste the app's Google Play link instead.",
        },
      };
    }
    fromDirectory = null;
    packageId = picked.appId;
    fromSearch = { title: picked.title, developer: picked.developer };
    play = await getData(packageId);
  }
  if (!play || !play.details) {
    return {
      status: 502,
      body: {
        error: 'PLAY_UNAVAILABLE',
        message: 'We could not read this app from Google Play right now. Check the link, or try again.',
        packageId,
        detail: lastError(packageId),
      },
    };
  }

  const match = findMatch(packageId, play.details.title, directory, ignoreIds);
  const result = assess({
    details: play.details,
    permissionItems: play.permissionItems,
    datasafety: play.datasafety,
    policyStatus: play.policyStatus,
    match,
    now,
  });

  const d = play.details;
  return {
    status: 200,
    body: {
      app: {
        packageId,
        title: d.title,
        developer: d.developer,
        icon: d.icon,
        rating: d.score,
        ratings: d.ratings,
        installs: d.installs,
        playUrl: `https://play.google.com/store/apps/details?id=${packageId}`,
      },
      directory: {
        match: match.type,
        lender: match.entry ? match.entry.lender : null,
        directoryName: match.entry ? match.entry.appName : null,
        grievance: match.entry && match.type !== 'lookalike' ? match.entry.grievance || null : null,
        // every directory record for this app (an app can be listed under several lenders), each with its own contact
        records:
          match.type === 'id' || match.type === 'name'
            ? (match.entries || []).map((e) => ({ appName: e.appName, lender: e.lender, grievance: e.grievance || null }))
            : [],
      },
      ...result,
      source: play.source,
      asOf: play.fetchedAt || new Date(now).toISOString(),
      resolvedFromName: fromDirectory ? fromDirectory.appName : null,
      resolvedFromSearch: fromSearch, // set when we matched a typed name to a Play app by searching Google Play
    },
  };
}

module.exports = { assessApp, parsePackageId, findMatch, pickSearchResult, searchWordFromLink, looksSameApp };
