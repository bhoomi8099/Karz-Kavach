const test = require('node:test');
const assert = require('node:assert');
const { listApps, checkApp, getStats } = require('./handlers');
const apps = require('./data/apps.json');
const directory = require('./data/directory.demo.json');

// A made-up directory used only to test the lookup. These are NOT real RBI entries.
const fakeDirectory = [
  { appName: 'Alpha Cash', lender: 'Test Lender One' },
  { appName: 'Beta Credit Plus', lender: 'Test Lender Two' },
  { appName: 'Beta Credit Plus', lender: 'Test Lender Three' },
];

test('listApps returns id, name and developer only', () => {
  const list = listApps(apps);
  assert.strictEqual(list.length, apps.length);
  assert.deepStrictEqual(Object.keys(list[0]), ['id', 'name', 'developer']);
});

test('checkApp: empty name gives 400', () => {
  assert.strictEqual(checkApp('   ', apps, directory).status, 400);
});

test('checkApp: demo app gets the full score', () => {
  const r = checkApp('quickrupee', apps, directory);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.verdict, 'RISKY');
  assert.ok(r.body.nextSteps.en.length > 0 && r.body.nextSteps.hi.length > 0);
});

test('checkApp: demo apps are scored against the demo directory even if a real one is loaded', () => {
  const r = checkApp('SureLoan Demo', apps, fakeDirectory, directory);
  assert.strictEqual(r.body.verdict, 'SAFE');
});

test('checkApp: unknown name found in directory gives LISTED with all lenders', () => {
  const r = checkApp('beta credit plus', apps, fakeDirectory, directory);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.mode, 'directory_only');
  assert.strictEqual(r.body.verdict, 'LISTED');
  assert.strictEqual(r.body.matches.length, 2);
  assert.ok(r.body.flags[0].en.includes('not an RBI approval'));
  assert.ok(r.body.flags[0].hi.length > 0);
});

test('checkApp: name not in directory gives UNVERIFIED with a careful message', () => {
  const r = checkApp('zzzz unknown app', apps, fakeDirectory, directory);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.verdict, 'UNVERIFIED');
  assert.ok(r.body.flags[0].en.includes('does not prove fraud'));
  assert.strictEqual(r.body.matches.length, 0);
});

test('checkApp: a near miss suggests similar names', () => {
  const r = checkApp('Alpha Cashh Loan', apps, fakeDirectory, directory);
  assert.ok(['LISTED', 'UNVERIFIED'].includes(r.body.verdict));
  const r2 = checkApp('Alfa Cash', apps, fakeDirectory, directory);
  assert.ok(r2.body.verdict === 'LISTED' || r2.body.similar.includes('Alpha Cash'));
});

test('getStats reports the source and count', () => {
  assert.deepStrictEqual(getStats(fakeDirectory, { source: 'rbi', importedAt: '2026-10-17' }), {
    directorySource: 'rbi',
    directoryCount: 3,
    importedAt: '2026-10-17',
  });
  assert.strictEqual(getStats(directory, {}).directorySource, 'demo');
});
