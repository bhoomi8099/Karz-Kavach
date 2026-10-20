// Run with:  npm test   (inside the server folder)
// These tests always use the DEMO directory, so they keep passing after you import real data.
const test = require('node:test');
const assert = require('node:assert');
const { scoreApp, findApp, similarity, searchDirectory } = require('./scoring');
const apps = require('./data/apps.json');
const directory = require('./data/directory.demo.json');

const byName = (n) => scoreApp(apps.find((a) => a.name === n), directory);

test('listed app with few permissions is SAFE', () => {
  const r = byName('SureLoan Demo');
  assert.strictEqual(r.verdict, 'SAFE');
  assert.strictEqual(r.score.total, 13);
});

test('unlisted app with sensitive permissions and no transparency is RISKY', () => {
  const r = byName('QuickRupee Demo');
  assert.strictEqual(r.verdict, 'RISKY');
  assert.strictEqual(r.score.total, 100);
  assert.ok(r.flags.some((f) => f.code === 'CLAIM_UNVERIFIED'));
});

test('claim vs reality: wrong lender is caught', () => {
  const r = byName('EasyPay Credit Demo');
  assert.ok(r.flags.some((f) => f.code === 'CLAIM_MISMATCH'));
  assert.strictEqual(r.verdict, 'REVIEW');
});

test('unlisted app with minimal permissions is REVIEW, not RISKY', () => {
  const r = byName('InstaCash Demo');
  assert.strictEqual(r.verdict, 'REVIEW');
  assert.strictEqual(r.score.total, 34);
});

test('listed app that still asks for contacts and SMS goes to REVIEW', () => {
  const r = byName('LoanMitra Demo');
  assert.strictEqual(r.verdict, 'REVIEW');
});

test('every result has English and Hindi text', () => {
  for (const a of apps) {
    const r = scoreApp(a, directory);
    assert.ok(r.verdictLabel.en && r.verdictLabel.hi);
    for (const f of r.flags) assert.ok(f.en && f.hi);
    for (const p of r.permissions) assert.ok(p.en && p.hi);
  }
});

test('search tolerates small typos and partial names', () => {
  assert.strictEqual(findApp('quickrupee', apps).name, 'QuickRupee Demo');
  assert.strictEqual(findApp('Quick Rupe Demo', apps).name, 'QuickRupee Demo');
  assert.strictEqual(findApp('completely unknown app xyz', apps), null);
  assert.ok(similarity('abc', 'abc') === 1);
});

test('searchDirectory: exact, partial and short-word behaviour', () => {
  const dir = [
    { appName: 'Moneyview Loan App', lender: 'Fake Lender A' },
    { appName: 'Quick Loan', lender: 'Fake Lender B' },
  ];
  assert.strictEqual(searchDirectory('moneyview loan app', dir)[0].score, 1);
  assert.ok(searchDirectory('Moneyview', dir)[0].score >= 0.8); // partial name
  assert.ok(searchDirectory('loan', dir).every((r) => r.score < 0.8)); // short word must not match
});

test('searchDirectory: brand before a colon finds the full entry name', () => {
  const dir = [
    { appName: 'Test App 112: Personal Loan App', lender: 'Fake Lender C' },
    { appName: 'Quick Cash Plus', lender: 'Fake Lender D' },
    { appName: 'Quick Loan Finder', lender: 'Fake Lender E' },
  ];
  assert.ok(searchDirectory('Test App 112', dir)[0].score >= 0.8);
  assert.ok(searchDirectory('testapp', dir)[0].score >= 0.8); // 6+ letters, start of the name
  assert.ok(searchDirectory('quick', dir).every((r) => r.score < 0.8)); // too short and generic
  assert.ok(searchDirectory('loan', dir).every((r) => r.score < 0.8));
});

test('generic directory names do not match long descriptive queries', () => {
  const { searchDirectory: sd } = require('./scoring');
  const dir = [
    { appName: 'Personal Loan', lender: 'Some NBFC' },
    { appName: 'Moneyview Loan App', lender: 'Moneyview Ltd' },
  ];
  assert.deepStrictEqual(sd('personal loans and credit card', dir), []); // was a wrong match before
  assert.strictEqual(sd('Personal Loan', dir)[0].entry.appName, 'Personal Loan'); // exact still works
  assert.strictEqual(sd('moneyview', dir)[0].entry.appName, 'Moneyview Loan App'); // brands still match
});
