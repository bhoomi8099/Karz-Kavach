// The logic behind each API route, kept separate from Express so it is easy to test.
const { scoreApp, findApp, searchDirectory } = require('./scoring');
const { makeFlag, NEXT_STEPS, STATUS_LABELS } = require('./messages');

const LISTED_MIN_SCORE = 0.8;

function listApps(apps) {
  return apps.map((a) => ({ id: a.id, name: a.name, developer: a.developer }));
}

function getStats(directory, source) {
  return {
    directorySource: source.source || 'demo',
    directoryCount: directory.length,
    importedAt: source.importedAt || null,
  };
}

// For any app we have no permission data for: only check the directory.
function lookupInDirectory(name, directory) {
  const scored = searchDirectory(name, directory);
  const top = scored[0];
  const listed = Boolean(top && top.score >= LISTED_MIN_SCORE);

  const matches = listed
    ? scored
        .filter((s) => s.score >= LISTED_MIN_SCORE && s.score >= top.score - 1e-9)
        .slice(0, 5)
        .map((s) => ({ appName: s.entry.appName, lender: s.entry.lender, ...(s.entry.packageId && { packageId: s.entry.packageId }) }))
    : [];
  const similar = listed ? [] : [...new Set(scored.slice(0, 3).map((s) => s.entry.appName))];
  const lenders = [...new Set(matches.map((m) => m.lender))].join(', ');
  const verdict = listed ? 'LISTED' : 'UNVERIFIED';

  return {
    mode: 'directory_only',
    query: name,
    verdict,
    verdictLabel: STATUS_LABELS[verdict],
    matches,
    similar,
    flags: [makeFlag(listed ? 'DIRECTORY_ONLY_LISTED' : 'DIRECTORY_ONLY_NOT_LISTED', { lender: lenders })],
    nextSteps: listed ? NEXT_STEPS.DIRECTORY_LISTED : NEXT_STEPS.UNVERIFIED,
  };
}

// Returns { status, body } for GET /api/check?name=...
// - A demo app (we have permissions for it): full score, checked against the demo directory.
// - Anything else: look it up in the real (imported) directory only.
function checkApp(rawName, apps, directory, demoDirectory = directory) {
  const name = String(rawName || '').trim();
  if (!name) {
    return { status: 400, body: { error: 'Please enter an app name.' } };
  }
  const found = findApp(name, apps);
  if (found) {
    return { status: 200, body: scoreApp(found, found.demo ? demoDirectory : directory) };
  }
  return { status: 200, body: lookupInDirectory(name, directory) };
}

module.exports = { listApps, checkApp, getStats, lookupInDirectory };
