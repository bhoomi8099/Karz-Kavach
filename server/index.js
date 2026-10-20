const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { listApps, checkApp, getStats } = require('./handlers');
const { enrichWithPermissions } = require('./playPermissions');
const { assessApp } = require('./assess');

// Data lives in simple JSON files for now (see the data folder).
// Replace with MongoDB later if you want; only this file and handlers.js would change.
const apps = require('./data/apps.json');
const directory = require('./data/directory.json'); // demo list, or the real one after an import
const demoDirectory = require('./data/directory.demo.json'); // always the fictional demo list
const directorySource = require('./data/directory-source.json');

const app = express();
app.use(cors());
app.use(express.json());

// Quick check that the server is running
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Which directory is loaded (demo or imported) and how many apps it has
app.get('/api/stats', (req, res) => {
  res.json(getStats(directory, directorySource));
});

// List of demo apps (used for search suggestions)
app.get('/api/apps', (req, res) => {
  res.json(listApps(apps));
});

// Check one app:  /api/check?name=QuickRupee
app.get('/api/check', async (req, res) => {
  const { status, body } = checkApp(req.query.name, apps, directory, demoDirectory);
  if (status === 200) await enrichWithPermissions(body); // adds Play Store permissions for listed apps
  res.status(status).json(body);
});

// Score any app from a Google Play link, an app ID, or an RBI-listed app name:
//   /api/assess?input=https://play.google.com/store/apps/details?id=com.example.app
app.get('/api/assess', async (req, res) => {
  const { status, body } = await assessApp(req.query.input || req.query.name, directory);
  res.status(status).json(body);
});

// Trusted apps: RBI-listed + well rated on Google Play. Built by scripts/build-trusted.js
app.get('/api/trusted', (req, res) => {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'trusted.json'), 'utf8'));
  } catch (err) {
    return res.json({ available: false, count: 0, items: [] });
  }
  const q = String(req.query.q || '').toLowerCase().trim();
  const tier = String(req.query.tier || '');
  const limit = Math.min(200, Number(req.query.limit) || 50);
  let items = data.items;
  if (tier === 'high' || tier === 'well') items = items.filter((i) => i.tier === tier);
  if (q) items = items.filter((i) => (i.appName + ' ' + i.lender).toLowerCase().includes(q));
  res.json({
    available: true,
    generatedAt: data.generatedAt,
    total: data.items.length,
    count: items.length,
    items: items.slice(0, limit),
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Karz Kavach server running on http://localhost:${PORT}`);
    if (process.env.KK_OFFLINE === '1') {
      console.log('*** OFFLINE MODE IS ON: only apps saved in data/play-snapshot.json will work. ***');
      console.log('*** To go back to live Google Play lookups run: Remove-Item Env:KK_OFFLINE  and restart. ***');
    }
  });
}

module.exports = app;
