// Usage (run inside the server folder):
//   node scripts/import-directory.js my-directory.csv
//   node scripts/import-directory.js my-directory.csv --app-col 3 --lender-col 2
//   node scripts/import-directory.js --demo        (go back to the fictional demo directory)
//
// Then restart the server (Ctrl + C, then node index.js).

const fs = require('fs');
const path = require('path');
const { parseDirectory } = require('../directoryImport');

const dataDir = path.join(__dirname, '..', 'data');
const args = process.argv.slice(2);

function numberOption(name) {
  const i = args.indexOf(name);
  return i >= 0 ? Number(args[i + 1]) : undefined;
}

if (args.includes('--demo')) {
  fs.copyFileSync(path.join(dataDir, 'directory.demo.json'), path.join(dataDir, 'directory.json'));
  fs.writeFileSync(
    path.join(dataDir, 'directory-source.json'),
    JSON.stringify({ source: 'demo' }, null, 2) + '\n'
  );
  console.log('Restored the fictional demo directory.');
  process.exit(0);
}

const file = args.find((a, i) => !a.startsWith('--') && !String(args[i - 1] || '').startsWith('--'));
if (!file) {
  console.log('Usage: node scripts/import-directory.js <file.csv or file.txt> [--app-col N] [--lender-col N]');
  process.exit(1);
}

let result;
try {
  result = parseDirectory(fs.readFileSync(file, 'utf8'), {
    appCol: numberOption('--app-col'),
    lenderCol: numberOption('--lender-col'),
  });
} catch (err) {
  console.error('Import failed: ' + err.message);
  process.exit(1);
}

fs.writeFileSync(
  path.join(dataDir, 'directory.json'),
  JSON.stringify(result.entries, null, 2) + '\n'
);
fs.writeFileSync(
  path.join(dataDir, 'directory-source.json'),
  JSON.stringify(
    {
      source: 'rbi',
      importedAt: new Date().toISOString().slice(0, 10),
      file: path.basename(file),
      count: result.entries.length,
    },
    null,
    2
  ) + '\n'
);

console.log(`Imported ${result.entries.length} apps.`);
console.log(`Used column ${result.appCol} for the app name and column ${result.lenderCol} for the lender.`);
if (result.skipped) console.log(`Skipped ${result.skipped} rows with a missing app or lender.`);
if (result.filledDown) {
  console.log(`Reused the lender from the row above for ${result.filledDown} rows. Check a few by hand.`);
}
console.log('First entries:');
for (const e of result.entries.slice(0, 5)) console.log(`  ${e.appName}  <-  ${e.lender}`);
console.log('Now restart the server.');
