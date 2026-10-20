const test = require('node:test');
const assert = require('node:assert');
const { assess, detectDisclosure, looksLikeLending } = require('./realScoring');

const NOW = Date.parse('2026-10-20');
const goodDetails = {
  title: 'GoodLend', developer: 'Good Finance Ltd', developerEmail: 'help@good.in',
  developerWebsite: 'https://good.in', developerAddress: 'Mumbai', privacyPolicy: 'https://good.in/privacy',
  description: 'Personal loans with APR from 12% per annum. Processing fee 2%. Read the key fact statement and terms and conditions before you accept. Repayment tenure 3 to 24 months.',
  score: 4.5, ratings: 120000, released: '2019-01-01',
};
const heavy = [
  { permission: 'read your contacts' }, { permission: 'read your text messages (SMS)' },
  { permission: 'read call log' },
];

test('detects fee, interest and terms words in a listing', () => {
  assert.deepStrictEqual(detectDisclosure('APR 12% p.a. processing fee, see terms and conditions'), { interest: true, fees: true, terms: true });
  assert.deepStrictEqual(detectDisclosure('Get cash fast in minutes, no paperwork whatsoever.'), { interest: false, fees: false, terms: false });
});

test('RBI-listed app with a clear listing gets "proceed"', () => {
  const r = assess({ details: goodDetails, permissionItems: [], policyStatus: 'ok', match: { type: 'id', entry: { lender: 'Good Finance Ltd' } }, now: NOW });
  assert.strictEqual(r.level, 'proceed');
  assert.strictEqual(r.score.registration, 0);
  assert.strictEqual(r.score.transparency, 0);
});

test('unlisted app with heavy permissions and a bare listing gets "stop"', () => {
  const bad = { title: 'QuickCash', developer: 'xyz', description: 'Instant cash in 2 minutes. Download now.', score: 2.4, ratings: 5000, released: '2026-08-01' };
  const r = assess({ details: bad, permissionItems: heavy, policyStatus: 'none', match: { type: 'none' }, now: NOW });
  assert.strictEqual(r.level, 'stop');
  assert.ok(r.score.total >= 60);
  const ids = r.signals.map((s) => s.id);
  for (const id of ['rbi_not_found', 'privacy_policy', 'fees_interest', 'contact', 'rating', 'new_app']) assert.ok(ids.includes(id), id);
});

test('permissions count less when the lender is RBI-listed', () => {
  const a = assess({ details: goodDetails, permissionItems: heavy, policyStatus: 'ok', match: { type: 'id', entry: { lender: 'L' } }, now: NOW });
  const b = assess({ details: goodDetails, permissionItems: heavy, policyStatus: 'ok', match: { type: 'none' }, now: NOW });
  assert.ok(a.score.permission < b.score.permission);
  assert.strictEqual(b.score.permission, 40);
});

test('lookalike (same name, different Play ID) adds 25 registration points', () => {
  const r = assess({ details: goodDetails, permissionItems: [], policyStatus: 'ok', match: { type: 'lookalike', entry: { lender: 'Real Lender' } }, now: NOW });
  assert.strictEqual(r.score.registration, 25);
  assert.ok(r.signals.find((s) => s.id === 'rbi_lookalike'));
});

test('missing data is unknown, adds no points and lowers confidence', () => {
  const r = assess({ details: { title: 'X', privacyPolicy: 'https://x.in/p', description: '', developerEmail: 'a@b.c', developerWebsite: 'w', developerAddress: 'a' }, permissionItems: null, policyStatus: 'unknown', match: { type: 'id', entry: { lender: 'L' } }, now: NOW });
  assert.strictEqual(r.score.permission, 0);
  assert.strictEqual(r.score.transparency, 0);
  assert.notStrictEqual(r.confidence, 'high');
  assert.ok(r.signals.some((s) => s.status === 'unknown'));
});

test('wording never uses safe, scam or fraud', () => {
  const r = assess({ details: goodDetails, permissionItems: heavy, policyStatus: 'broken', match: { type: 'none' }, now: NOW });
  const all = JSON.stringify([r.label, r.subtitle, r.signals, r.note]).toLowerCase();
  for (const w of ['scam', 'fraud', 'fake']) assert.ok(!all.includes(w), w);
  assert.ok(!/\bsafe\b/.test(r.label.en.toLowerCase()));
});

test('transparency is capped at 20', () => {
  const r = assess({ details: { title: 'Z', description: 'x'.repeat(60), score: 1.5, ratings: 9000, released: '2026-09-01' }, permissionItems: [], policyStatus: 'none', match: { type: 'none' }, now: NOW });
  assert.ok(r.score.transparency <= 20);
});

test('a non-lending app is not penalised for missing RBI registration or loan fees', () => {
  const investing = { title: 'Pearler', developer: 'Pearler Pty', developerEmail: 'a@b.c', developerWebsite: 'w', developerAddress: 'x', privacyPolicy: 'https://p',
    description: 'Invest in shares and ETFs with low brokerage. Build long term wealth with automatic investing plans and portfolio tracking.', score: 4.6, ratings: 3000, released: '2020-01-01' };
  assert.strictEqual(looksLikeLending(investing), false);
  const r = assess({ details: investing, permissionItems: [], policyStatus: 'ok', match: { type: 'none' }, now: NOW });
  assert.strictEqual(r.lending, false);
  assert.strictEqual(r.score.registration, 0);
  assert.strictEqual(r.score.transparency, 0);
  assert.strictEqual(r.level, 'proceed');
  const ids = r.signals.map((s) => s.id);
  assert.ok(ids.includes('not_lending'));
  assert.ok(!ids.includes('rbi_not_found') && !ids.includes('fees_interest'));
});

test('lending detection catches loan words and defaults to lending when the text is too short', () => {
  assert.strictEqual(looksLikeLending({ title: 'QuickCash', description: 'Get instant cash in minutes, no paperwork needed from anyone.' }), true);
  assert.strictEqual(looksLikeLending({ title: 'X', description: 'Personal loan up to 5 lakh with easy EMI options available now.' }), true);
  assert.strictEqual(looksLikeLending({ title: 'X', description: 'short' }), true);
});

test('an unlisted app that does look like lending still gets the registration warning', () => {
  const r = assess({ details: { title: 'LoanNow', description: 'Personal loan in minutes. Apply now and get money instantly in your account today.' }, permissionItems: [], policyStatus: 'none', match: { type: 'none' }, now: NOW });
  assert.strictEqual(r.lending, true);
  assert.strictEqual(r.score.registration, 30);
});
