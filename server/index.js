const express = require('express');
const cors = require('cors');
const { listApps, checkApp, getStats } = require('./handlers');
const { enrichWithPermissions } = require('./playPermissions');

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

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Karz Kavach server running on http://localhost:${PORT}`));
}

module.exports = app;
