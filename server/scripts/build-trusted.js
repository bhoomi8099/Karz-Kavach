// Builds data/trusted.json: RBI-listed apps + their Google Play rating.
// Needs internet. Run inside the server folder:
//   node scripts/build-trusted.js            (all listed apps that have a Play link, takes a few minutes)
//   node scripts/build-trusted.js --limit 60 (quick test with the first 60)
// Then restart the server.

const fs = require('fs');
const path = require('path');
const { collectPlayInfo, buildTrustedList } = require('../trusted');

const dataDir = path.join(__dirname, '..', 'data');
const args = process.argv.slice(2);
const li = args.indexOf('--limit');
const limit = li >= 0 ? Number(args[li + 1]) : Infinity;

const directory = JSON.parse(fs.readFileSync(path.join(dataDir, 'directory.json'), 'utf8'));
const entries = directory.filter((e) => e.packageId).slice(0, limit);
if (entries.length === 0) {
  console.log('No apps with a Play Store link found. Import the real RBI directory first.');
  process.exit(1);
}
console.log(`Checking ${entries.length} RBI-listed apps on the Play Store...`);

(async () => {
  const gplay = (await import('google-play-scraper')).default;
  const fetcher = (appId) =>
    Promise.race([
      gplay.app({ appId, lang: 'en', country: 'in' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
    ]);
  const rows = await collectPlayInfo(entries, fetcher, {
    concurrency: 4,
    onProgress: (d, t) => d % 20 === 0 && console.log(`  ${d}/${t}`),
  });
  const items = buildTrustedList(rows);
  fs.writeFileSync(
    path.join(dataDir, 'trusted.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), checked: entries.length, withRatings: rows.length, items }, null, 2) + '\n'
  );
  console.log(`Done. ${items.length} trusted apps saved to data/trusted.json (from ${rows.length} with ratings).`);
})();
