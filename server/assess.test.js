const test = require('node:test');
const assert = require('node:assert');
const { assessApp, parsePackageId, findMatch, pickSearchResult, searchWordFromLink, looksSameApp } = require('./assess');

const directory = [
  { appName: 'Navi', lender: 'Navi Finserv Limited', packageId: 'com.naviapp', grievance: { name: 'A B', email: 'g@navi.com' } },
  { appName: 'Blink Credit', lender: 'Aditsh Fintech Pvt Ltd' }, // no Play link in the directory
  { appName: 'RealLend', lender: 'Real Lenders Ltd', packageId: 'com.reallend.app' },
];
const play = (extra = {}) => async (id) => ({
  details: { title: 'Navi: UPI, Loans', developer: 'Navi', developerEmail: 'a@b.c', developerWebsite: 'w', developerAddress: 'x',
    privacyPolicy: 'https://p', description: 'Loan with APR, interest per annum, processing fee. Terms and conditions apply.', score: 4.4, ratings: 100000, released: '2019-01-01', ...extra },
  permissionItems: [{ permission: 'read your contacts' }], datasafety: { sharedData: [], collectedData: [{}, {}] }, policyStatus: 'ok', source: 'live', fetchedAt: '2026-10-20T00:00:00Z',
});

test('parses Play links and bare IDs', () => {
  assert.strictEqual(parsePackageId('https://play.google.com/store/apps/details?id=com.naviapp&hl=en'), 'com.naviapp');
  assert.strictEqual(parsePackageId('https://play.google.com/store/apps/details?hl=en&id=com.naviapp'), 'com.naviapp');
  assert.strictEqual(parsePackageId('com.naviapp'), 'com.naviapp');
  assert.strictEqual(parsePackageId('Navi'), null);
  assert.strictEqual(parsePackageId(''), null);
});

test('matches by Play ID, by name, as a lookalike, or not at all', () => {
  assert.strictEqual(findMatch('com.naviapp', 'Navi: UPI, Loans', directory).type, 'id');
  assert.strictEqual(findMatch('com.other', 'Blink Credit', directory).type, 'name');
  assert.strictEqual(findMatch('com.fake.navi', 'Navi', directory).type, 'lookalike');
  assert.strictEqual(findMatch('com.random', 'Totally Unknown Cash', directory).type, 'none');
});

test('assesses an RBI-listed app from its link and returns grievance contact', async () => {
  const r = await assessApp('https://play.google.com/store/apps/details?id=com.naviapp', directory, play());
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.directory.match, 'id');
  assert.strictEqual(r.body.directory.grievance.email, 'g@navi.com');
  assert.strictEqual(r.body.level, 'proceed');
  assert.ok(r.body.signals.length >= 6);
});

test('does not show the grievance contact for a lookalike', async () => {
  const r = await assessApp('com.fake.navi', directory, play({ title: 'Navi' }));
  assert.strictEqual(r.body.directory.match, 'lookalike');
  assert.strictEqual(r.body.directory.grievance, null);
});

test('an RBI-listed name with a Play ID works without a link', async () => {
  const r = await assessApp('RealLend', directory, async (id) => { assert.strictEqual(id, 'com.reallend.app'); return play({ title: 'RealLend' })(id); });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.resolvedFromName, 'RealLend');
});

test('a name with no known Play ID asks for a link', async () => {
  const r = await assessApp('Blink Credit', directory, play(), undefined, async () => []);
  assert.strictEqual(r.status, 404);
  assert.strictEqual(r.body.error, 'NEEDS_LINK');
});

test('empty input and unreadable apps give clear errors', async () => {
  assert.strictEqual((await assessApp('', directory, play())).status, 400);
  const r = await assessApp('com.gone.app', directory, async () => null);
  assert.strictEqual(r.status, 502);
  assert.strictEqual(r.body.error, 'PLAY_UNAVAILABLE');
});

test('a name with no Play ID in the directory is resolved by searching Google Play', async () => {
  const search = async () => [
    { appId: 'com.other.thing', title: 'Some Other App', developer: 'X' },
    { appId: 'com.blink.credit', title: 'Blink Credit: Personal Loan', developer: 'Aditsh Fintech' },
  ];
  const r = await assessApp('Blink Credit', directory, play({ title: 'Blink Credit: Personal Loan' }), undefined, search);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.app.packageId, 'com.blink.credit');
  assert.strictEqual(r.body.resolvedFromSearch.title, 'Blink Credit: Personal Loan');
  assert.strictEqual(r.body.directory.match, 'name'); // directory entry has no Play ID: matched by name only
});

test('Play search results that are not the typed brand are rejected', () => {
  const results = [{ appId: 'a.b', title: 'Totally Different Loans', developer: 'Z' }];
  assert.strictEqual(pickSearchResult('Blink Credit', results), null);
  assert.strictEqual(pickSearchResult('lo', results), null); // too short
  assert.strictEqual(pickSearchResult('Navi', [{ appId: 'c.d', title: 'Navi: UPI, Loans', developer: 'Navi' }]).appId, 'c.d');
});

test('a Google Play search link is treated as a name search', async () => {
  assert.strictEqual(searchWordFromLink('https://play.google.com/store/search?q=navi&c=apps'), 'navi');
  assert.strictEqual(searchWordFromLink('https://play.google.com/store/search?c=apps&q=blink%20credit'), 'blink credit');
  assert.strictEqual(searchWordFromLink('https://play.google.com/store/apps/details?id=com.naviapp'), null);
  const search = async () => [{ appId: 'com.naviapp', title: 'Navi: UPI, Loans', developer: 'Navi' }];
  const r = await assessApp('https://play.google.com/store/search?q=navi&c=apps', directory, play(), undefined, search);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.app.packageId, 'com.naviapp');
});

test('an app listed under several lenders returns every record with its own grievance contact', async () => {
  const multi = [
    { appName: 'PayApp', lender: 'Lender One Ltd', packageId: 'com.payapp', grievance: { name: 'One', email: 'one@l1.com' } },
    { appName: 'PayApp', lender: 'Lender Two Ltd', packageId: 'com.payapp', grievance: { name: 'Two', email: 'two@l2.com' } },
    { appName: 'PayApp', lender: 'Lender Three Ltd', grievance: { name: 'Three', email: 'three@l3.com' } },
  ];
  const r = await assessApp('com.payapp', multi, play({ title: 'PayApp' }));
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.directory.records.length, 3);
  assert.deepStrictEqual(r.body.directory.records.map((x) => x.grievance.name).sort(), ['One', 'Three', 'Two']);
  const listed = r.body.signals.find((s) => s.id === 'rbi_listed');
  assert.ok(listed.en.includes('Lender One Ltd') && listed.en.includes('Lender Two Ltd'));
  // a lookalike never exposes contacts
  const look = await assessApp('com.fake.payapp', multi, play({ title: 'PayApp' }));
  assert.strictEqual(look.body.directory.match, 'lookalike');
  assert.deepStrictEqual(look.body.directory.records, []);
});

test('a wrong Play link in the directory data is detected and ignored', async () => {
  const bad = [
    { appName: 'Blink Credit', lender: 'ADITSH FINTECH PRIVATE LIMITED', packageId: 'com.loannivo.app', grievance: { name: 'Aditsh Officer' } },
    { appName: 'Loan Nivo', lender: 'FINOVATEX TECHNOLOGIES PRIVATE LIMITED', packageId: 'com.loannivo.app', grievance: { name: 'Finovatex Officer' } },
  ];
  const getData = async (id) => ({
    details: id === 'com.loannivo.app'
      ? { title: 'Loan Nivo', developer: 'FINOVATEX TECHNOLOGIES PRIVATE LIMITED', description: 'Personal loan with interest and fees. Terms and conditions apply to every loan.', score: 2.8, ratings: 21, released: '2024-01-01' }
      : { title: 'Blink Credit: Personal Loan', developer: 'Aditsh Fintech', description: 'Personal loan with interest and fees. Terms and conditions apply to every loan.', score: 4.2, ratings: 5000, released: '2022-01-01' },
    permissionItems: [], policyStatus: 'ok', source: 'live', fetchedAt: 'now',
  });
  const search = async () => [{ appId: 'com.blink.real', title: 'Blink Credit: Personal Loan', developer: 'Aditsh Fintech' }];
  const r = await assessApp('Blink Credit', bad, getData, undefined, search);
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.body.app.packageId, 'com.blink.real'); // not Loan Nivo
  assert.strictEqual(r.body.resolvedFromSearch.title, 'Blink Credit: Personal Loan');
  assert.strictEqual(r.body.directory.match, 'name'); // not a "lookalike" because the bad id was ignored
  assert.ok(r.body.directory.records.some((x) => x.grievance.name === 'Aditsh Officer'));
});

test('looksSameApp accepts the same brand and rejects a different company', () => {
  assert.strictEqual(looksSameApp({ appName: 'Navi', lender: 'Navi Finserv Limited' }, { title: 'Navi: UPI, Loans', developer: 'Navi' }), true);
  assert.strictEqual(looksSameApp({ appName: 'Blink Credit', lender: 'ADITSH FINTECH PRIVATE LIMITED' }, { title: 'Loan Nivo', developer: 'FINOVATEX TECHNOLOGIES PRIVATE LIMITED' }), false);
});
