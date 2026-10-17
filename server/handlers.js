// The logic behind each API route, kept separate from Express so it is easy to test.
const { scoreApp, findApp } = require('./scoring');

function listApps(apps) {
  return apps.map((a) => ({ id: a.id, name: a.name, developer: a.developer }));
}

// Returns { status, body } for GET /api/check?name=...
function checkApp(rawName, apps, directory) {
  const name = String(rawName || '').trim();
  if (!name) {
    return { status: 400, body: { error: 'Please enter an app name.' } };
  }
  const found = findApp(name, apps);
  if (!found) {
    return {
      status: 404,
      body: {
        error: 'We could not find this app in our demo data.',
        suggestions: apps.map((a) => a.name),
      },
    };
  }
  return { status: 200, body: scoreApp(found, directory) };
}

module.exports = { listApps, checkApp };
