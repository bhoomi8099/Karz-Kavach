// Saves Google Play data for many apps into data/play-snapshot.json, so the app also works with
// no internet (start the server with KK_OFFLINE=1 to use only the snapshot).
// Needs internet to build. Run inside the server folder:
//   node scripts/build-snapshot.js --limit 150     (first 150 apps, trusted ones first)
//   node scripts/build-snapshot.js                 (everything that has a Play link, slow)
// Safe to run again: it adds to the existing snapshot.

const fs = require('fs');
const path = require('path');
const { fetchLive } = require('../playData');

const dataDir = path.join(__dirname, '..', 'data');
const args = process.argv.slice(2);
const li = args.indexOf('--limit');
const limit = li >= 0 ? Number(args[li + 1]) : Infinity;

const read = (f, fallback) => {
  try { return JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')); } catch (e) { return fallback; }
};
const directory = read('directory.json', []);
const trusted = read('trusted.json', { items: [] }).items;
const existing = read('play-snapshot.json', { items: {} });

// trusted apps first (the ones you will demo), then the rest of the directory
const order = [];
const seen = new Set();
for (const e of [...trusted, ...directory]) {
  if (e.packageId && !seen.has(e.packageId)) { seen.add(e.packageId); order.push(e.packageId); }
}
const todo = order.filter((id) => !existing.items[id]).slice(0, limit);
console.log(`Saving Play data for ${todo.length} apps (already saved: ${Object.keys(existing.items).length})...`);

(async () => {
  let done = 0;
  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const id = todo[next++];
      try {
        const data = await fetchLive(id, 15000);
        if (data.details) existing.items[id] = { ...data, fetchedAt: new Date().toISOString() };
      } catch (err) { /* app removed or lookup failed: skip */ }
      done++;
      if (done % 10 === 0) {
        console.log(`  ${done}/${todo.length}`);
        fs.writeFileSync(path.join(dataDir, 'play-snapshot.json'), JSON.stringify(existing));
      }
    }
  }
  await Promise.all([worker(), worker(), worker()]);
  existing.generatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(dataDir, 'play-snapshot.json'), JSON.stringify(existing));
  console.log(`Done. ${Object.keys(existing.items).length} apps saved to data/play-snapshot.json`);
})();
