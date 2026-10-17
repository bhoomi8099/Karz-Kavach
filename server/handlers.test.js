const test = require('node:test');
const assert = require('node:assert');
const { listApps, checkApp } = require('./handlers');
const apps = require('./data/apps.json');
const directory = require('./data/directory.json');

test('listApps returns id, name and developer only', () => {
  const list = listApps(apps);
  assert.strictEqual(list.length, apps.length);
  assert.deepStrictEqual(Object.keys(list[0]), ['id', 'name', 'developer']);
});

test('checkApp: empty name gives 400', () => {
  assert.strictEqual(checkApp('   ', apps, directory).status, 400);
});

test('checkApp: unknown app gives 404 with suggestions', () => {
  const r = checkApp('zzzz unknown', apps, directory);
  assert.strictEqual(r.status, 404);
  assert.ok(r.body.suggestions.length > 0);
});

test('checkApp: known app gives 200 and a verdict', () => {
  const r = checkApp('quickrupee', apps, directory);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.verdict, 'RISKY');
  assert.ok(r.body.nextSteps.en.length > 0 && r.body.nextSteps.hi.length > 0);
});
