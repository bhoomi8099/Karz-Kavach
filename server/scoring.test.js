// Run with:  npm test   (inside the server folder)
const test = require('node:test');
const assert = require('node:assert');
const { scoreApp, findApp, similarity } = require('./scoring');
const apps = require('./data/apps.json');
const directory = require('./data/directory.json');

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
