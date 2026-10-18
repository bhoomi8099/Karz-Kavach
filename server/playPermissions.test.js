const test = require('node:test');
const assert = require('node:assert');
const { buildPermissionReport, enrichWithPermissions } = require('./playPermissions');

// Made-up Play Store style permission lists. Not from any real app.
const heavy = [
  { permission: 'read your contacts', type: 'Contacts' },
  { permission: 'find accounts on the device', type: 'Contacts' },
  { permission: 'read your text messages (SMS or MMS)', type: 'SMS' },
  { permission: 'precise location (GPS and network-based)', type: 'Location' },
  { permission: 'view network connections', type: 'Wi-Fi connection information' },
];
const light = [
  { permission: 'take pictures and videos', type: 'Camera' },
  { permission: 'view network connections', type: 'Wi-Fi connection information' },
];

test('heavy permission list: contacts + SMS + location = 36, high exposure', () => {
  const r = buildPermissionReport(heavy);
  assert.strictEqual(r.score, 36);
  assert.strictEqual(r.level, 'high');
  assert.deepStrictEqual(r.permissions.map((p) => p.permission), ['READ_CONTACTS', 'READ_SMS', 'ACCESS_FINE_LOCATION']);
});

test('light permission list: camera only = 4, low exposure, and never says safe/risky', () => {
  const r = buildPermissionReport(light);
  assert.strictEqual(r.score, 4);
  assert.strictEqual(r.level, 'low');
  assert.ok(!/risky|safe|scam|fraud/i.test(JSON.stringify([r.levelLabel, r.note])));
});

test('enrich adds a report for LISTED results that have a package id', async () => {
  const result = {
    mode: 'directory_only',
    verdict: 'LISTED',
    matches: [{ appName: 'Fake App', lender: 'Fake Lender', packageId: 'com.fake.app' }],
  };
  await enrichWithPermissions(result, async (id) => {
    assert.strictEqual(id, 'com.fake.app');
    return heavy;
  });
  assert.strictEqual(result.permissionReport.score, 36);
});

test('enrich never breaks the result when the fetch fails or there is no package id', async () => {
  const failing = { mode: 'directory_only', verdict: 'LISTED', matches: [{ appName: 'A', lender: 'B', packageId: 'com.x.y' }] };
  await enrichWithPermissions(failing, async () => { throw new Error('offline'); });
  assert.deepStrictEqual(failing.permissionReport, { available: false });

  const noId = { mode: 'directory_only', verdict: 'LISTED', matches: [{ appName: 'A', lender: 'B' }] };
  await enrichWithPermissions(noId, async () => heavy);
  assert.strictEqual(noId.permissionReport, undefined);

  const unverified = { mode: 'directory_only', verdict: 'UNVERIFIED', matches: [] };
  await enrichWithPermissions(unverified, async () => heavy);
  assert.strictEqual(unverified.permissionReport, undefined);
});

test('after reading permissions, the "not checked" sentence is replaced', async () => {
  const { makeFlag } = require('./messages');
  const result = {
    mode: 'directory_only',
    verdict: 'LISTED',
    flags: [makeFlag('DIRECTORY_ONLY_LISTED', { lender: 'Fake Lender' })],
    matches: [{ appName: 'Fake App', lender: 'Fake Lender', packageId: 'com.fake.app' }],
  };
  await enrichWithPermissions(result, async () => heavy);
  assert.ok(!result.flags[0].en.includes('did not check'));
  assert.ok(result.flags[0].en.includes('Google Play listing'));
  assert.ok(!result.flags[0].hi.includes('जाँच नहीं की'));
});