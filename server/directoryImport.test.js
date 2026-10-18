const test = require('node:test');
const assert = require('node:assert');
const { parseTable, parseDirectory } = require('./directoryImport');

// All names below are made up for testing. They are not real RBI data.

test('reads a simple CSV with guessed columns', () => {
  const csv =
    'Sr No,Name of Regulated Entity,Name of DLA\n1,Test Lender One,Alpha Cash\n2,Test Lender Two,Beta Credit\n';
  const r = parseDirectory(csv);
  assert.deepStrictEqual(r.entries, [
    { appName: 'Alpha Cash', lender: 'Test Lender One' },
    { appName: 'Beta Credit', lender: 'Test Lender Two' },
  ]);
  assert.strictEqual(r.lenderCol, 2);
  assert.strictEqual(r.appCol, 3);
});

test('reads tab-separated text (what you get by pasting a web table)', () => {
  const tsv = 'Regulated Entity\tDigital Lending App\nTest Lender One\tAlpha Cash\n';
  const r = parseDirectory(tsv);
  assert.strictEqual(r.entries.length, 1);
  assert.strictEqual(r.entries[0].appName, 'Alpha Cash');
});

test('splits several apps in one cell and handles quoted commas', () => {
  const csv = 'Lender,Apps\n"Test Lender, One","Alpha Cash; Beta Credit\nGamma Pay"\n';
  const r = parseDirectory(csv);
  assert.strictEqual(r.entries.length, 3);
  assert.ok(r.entries.every((e) => e.lender === 'Test Lender, One'));
});

test('reuses the lender from the row above when the cell is empty, and reports it', () => {
  const csv = 'Lender,App\nTest Lender One,Alpha Cash\n,Beta Credit\n';
  const r = parseDirectory(csv);
  assert.strictEqual(r.entries[1].lender, 'Test Lender One');
  assert.strictEqual(r.filledDown, 1);
});

test('removes duplicates and counts skipped rows', () => {
  const csv = 'Lender,App\nTest Lender One,Alpha Cash\nTest Lender One,alpha cash\nTest Lender Two,\n';
  const r = parseDirectory(csv);
  assert.strictEqual(r.entries.length, 1);
  assert.strictEqual(r.skipped, 1);
});

test('explains what to do when columns cannot be guessed, and accepts manual columns', () => {
  const csv = 'Col A,Col B\nTest Lender One,Alpha Cash\n';
  assert.throws(() => parseDirectory(csv), /--app-col N --lender-col N/);
  const r = parseDirectory(csv, { lenderCol: 1, appCol: 2 });
  assert.strictEqual(r.entries[0].appName, 'Alpha Cash');
});

test('parseTable handles a byte-order mark and Windows line endings', () => {
  const rows = parseTable('﻿a,b\r\n1,2\r\n');
  assert.deepStrictEqual(rows, [['a', 'b'], ['1', '2']]);
});

test('real RBI sheet layout: title rows above the header, blank first column, merged lender cells, repeated apps', () => {
  const csv = [
    ',,,,,,,',
    ',Digital Lending App,,,,,,',
    ',,,,,,,',
    ',Sr. No,Entity Name,Website of RE,Entity Type,Name of the DLA,"Name of the owner of DLA (Self-owned/ name of LSP in case DLA is of LSP)",Available on (Website/ Name of app store)',
    ',1,TEST LENDER ONE PRIVATE LIMITED,https://one.example,NBFC,Fake App A,Self Owned,Google Android',
    ',2,,https://one.example,NBFC,Fake App A,Self Owned,iOS App Store',
    ',3,,https://one.example,NBFC,Fake App A,Self Owned,Website',
    ',4,TEST LENDER TWO LIMITED,https://two.example,NBFC,Fake App B,Self Owned,Google Play Store',
    ',5,,https://two.example,NBFC,Fake App C,Self Owned,Google Play Store',
  ].join('\n');
  const r = parseDirectory(csv);
  assert.deepStrictEqual(r.entries, [
    { appName: 'Fake App A', lender: 'TEST LENDER ONE PRIVATE LIMITED' },
    { appName: 'Fake App B', lender: 'TEST LENDER TWO LIMITED' },
    { appName: 'Fake App C', lender: 'TEST LENDER TWO LIMITED' },
  ]);
  assert.strictEqual(r.appCol, 6);
  assert.strictEqual(r.lenderCol, 3);
});

test('keeps the Play Store package id even when the Play row is not the first row of the app', () => {
  const csv = [
    'Sr. No,Entity Name,Website of RE,Entity Type,Name of the DLA,Available on,Link to DLA',
    '1,TEST LENDER ONE LIMITED,https://one.example,NBFC,Fake App A,iOS App Store,https://apps.apple.com/in/app/fake/id1',
    '2,,https://one.example,NBFC,Fake App A,Google Play Store,https://play.google.com/store/apps/details?id=com.fake.appa&hl=en',
    '3,TEST LENDER TWO LIMITED,https://two.example,NBFC,Fake App B,Website,https://two.example/app',
  ].join('\n');
  const r = parseDirectory(csv);
  assert.strictEqual(r.entries[0].packageId, 'com.fake.appa');
  assert.strictEqual(r.entries[1].packageId, undefined);
});

test('keeps grievance officer details (name, email, phone, mobile) when the columns exist', () => {
  const csv = [
    'Sr. No,Entity Name,Name of the DLA,Name of Grievance Redressal Officer,Email id of Grievance Redressal Officer,Telephone number of Grievance Redressal Officer,Mobile number of Grievance Redressal Officer',
    '1,TEST LENDER ONE LIMITED,Fake App A,Test Person,help@one.example,1100000000,9900000000',
    '2,TEST LENDER TWO LIMITED,Fake App B,,,,',
  ].join('\n');
  const r = parseDirectory(csv);
  assert.deepStrictEqual(r.entries[0].grievance, {
    name: 'Test Person',
    email: 'help@one.example',
    phone: '1100000000',
    mobile: '9900000000',
  });
  assert.strictEqual(r.entries[1].grievance, undefined);
});
