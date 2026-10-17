// The scoring engine. No AI here: simple rules, so every flag can be explained.
//
// Score = permission risk (max 40) + registration risk (max 40) + transparency risk (max 20)
// 0-29 = SAFE, 30-59 = REVIEW, 60+ = RISKY

const { PERMISSIONS, VERDICTS, NEXT_STEPS, makeFlag } = require('./messages');

const MAX = { permission: 40, registration: 40, transparency: 20 };
const THRESHOLDS = { risky: 60, review: 30 };

// ---------- name matching ----------

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Edit distance: how many single-letter changes turn a into b.
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

// 1 = identical, 0 = nothing in common
function similarity(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x.length && !y.length) return 1;
  if (!x.length || !y.length) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

// Find the closest entry in the RBI directory (fuzzy, so small spelling changes still match).
function findDirectoryMatch(appName, directory, minSimilarity = 0.8) {
  let best = null;
  let bestScore = 0;
  for (const entry of directory) {
    const s = similarity(appName, entry.appName);
    if (s > bestScore) {
      best = entry;
      bestScore = s;
    }
  }
  return bestScore >= minSimilarity ? best : null;
}

// Find the app the user typed in our app list.
function findApp(query, apps) {
  const q = normalize(query);
  if (!q) return null;
  const exact = apps.find((a) => normalize(a.name) === q);
  if (exact) return exact;
  const partial = apps.find((a) => normalize(a.name).includes(q) || q.includes(normalize(a.name)));
  if (partial) return partial;
  let best = null;
  let bestScore = 0;
  for (const a of apps) {
    const s = similarity(query, a.name);
    if (s > bestScore) {
      best = a;
      bestScore = s;
    }
  }
  return bestScore >= 0.7 ? best : null;
}

// ---------- scoring ----------

function scoreApp(app, directory) {
  const flags = [];

  // 1) Permission risk
  const permissions = [];
  let permissionRaw = 0;
  for (const p of app.permissions || []) {
    const info = PERMISSIONS[p];
    if (!info) continue;
    permissionRaw += info.weight;
    permissions.push({ permission: p, weight: info.weight, en: info.en, hi: info.hi });
  }
  permissions.sort((a, b) => b.weight - a.weight);
  const permission = Math.min(MAX.permission, permissionRaw);

  // 2) Registration risk (RBI directory + claim vs reality)
  let registration = 0;
  const match = findDirectoryMatch(app.name, directory);
  if (!match) {
    registration = 30;
    flags.push(makeFlag('NOT_IN_DIRECTORY'));
    if (app.claimedLender) {
      registration += 10;
      flags.push(makeFlag('CLAIM_UNVERIFIED', { claimed: app.claimedLender }));
    }
  } else if (app.claimedLender && normalize(app.claimedLender) !== normalize(match.lender)) {
    registration = 25;
    flags.push(makeFlag('CLAIM_MISMATCH', { claimed: app.claimedLender, lender: match.lender }));
  } else {
    flags.push(makeFlag('IN_DIRECTORY', { lender: match.lender }));
  }
  registration = Math.min(MAX.registration, registration);

  // 3) Transparency risk
  let transparency = 0;
  if (!app.privacyPolicy) {
    transparency += 8;
    flags.push(makeFlag('NO_PRIVACY_POLICY'));
  }
  if (!app.grievanceContact) {
    transparency += 6;
    flags.push(makeFlag('NO_GRIEVANCE'));
  }
  if (!app.feeDetails) {
    transparency += 6;
    flags.push(makeFlag('NO_FEE_DETAILS'));
  }
  transparency = Math.min(MAX.transparency, transparency);

  const total = permission + registration + transparency;
  const verdict =
    total >= THRESHOLDS.risky ? 'RISKY' : total >= THRESHOLDS.review ? 'REVIEW' : 'SAFE';

  return {
    app: {
      id: app.id,
      name: app.name,
      developer: app.developer,
      claimedLender: app.claimedLender || null,
      demo: Boolean(app.demo),
    },
    verdict,
    verdictLabel: VERDICTS[verdict],
    score: { total, permission, registration, transparency, max: MAX },
    flags,
    permissions,
    directoryMatch: match ? { appName: match.appName, lender: match.lender } : null,
    nextSteps: verdict === 'SAFE' ? NEXT_STEPS.SAFE : NEXT_STEPS.UNSAFE,
  };
}

module.exports = { scoreApp, findApp, findDirectoryMatch, similarity, normalize, MAX, THRESHOLDS };
