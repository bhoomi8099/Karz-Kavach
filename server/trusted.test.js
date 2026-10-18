const test = require('node:test');
const assert = require('node:assert');
const { trustFor, buildTrustedList, collectPlayInfo } = require('./trusted');

test('high tier needs 4.2+ stars and 10,000+ ratings', () => {
  assert.strictEqual(trustFor({ score: 4.4, ratings: 500000 }).tier, 'high');
  assert.strictEqual(trustFor({ score: 4.4, ratings: 900 }).tier, null); // too few ratings
  assert.strictEqual(trustFor({ score: 3.9, ratings: 5000 }).tier, 'well');
  assert.strictEqual(trustFor({ score: 2.5, ratings: 900000 }).tier, null);
});

test('no rating data means no trust info', () => {
  assert.strictEqual(trustFor({}), null);
  assert.strictEqual(trustFor(null), null);
});

test('more ratings and higher stars give a higher trust score', () => {
  assert.ok(trustFor({ score: 4.5, ratings: 1000000 }).trustScore > trustFor({ score: 4.5, ratings: 20000 }).trustScore);
  assert.ok(trustFor({ score: 4.6, ratings: 50000 }).trustScore > trustFor({ score: 4.0, ratings: 50000 }).trustScore);
});

test('buildTrustedList drops untiered rows and sorts best first', () => {
  const list = buildTrustedList([
    { appName: 'A', tier: 'well', trustScore: 70, ratings: 5000 },
    { appName: 'B', tier: null, trustScore: 90, ratings: 1 },
    { appName: 'C', tier: 'high', trustScore: 88, ratings: 900000 },
  ]);
  assert.deepStrictEqual(list.map((r) => r.appName), ['C', 'A']);
});

test('collectPlayInfo skips failed lookups and keeps grievance', async () => {
  const entries = [
    { appName: 'Good', lender: 'L1', packageId: 'a.b', grievance: { name: 'X' } },
    { appName: 'Gone', lender: 'L2', packageId: 'c.d' },
  ];
  const fetcher = async (id) => {
    if (id === 'c.d') throw new Error('404');
    return { score: 4.5, ratings: 100000, installs: '10,000,000+' };
  };
  const rows = await collectPlayInfo(entries, fetcher, { concurrency: 2 });
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].appName, 'Good');
  assert.strictEqual(rows[0].grievance.name, 'X');
  assert.strictEqual(rows[0].tier, 'high');
});
