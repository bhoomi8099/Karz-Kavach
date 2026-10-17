# Karz Kavach: Anti-Predatory Loan App Detector

Team Moon3 | Hack@BVP 8.0 | FinTech PS2

Type a loan app name, get a **Safe / Needs a closer look / Risky** verdict with reasons in English and Hindi.

All apps in the project are **fictional demo apps**. The screen says so on purpose. Do not present them as real apps.

---

## 1. Run it (first time)

You need Node.js (version 18 or newer). Check with `node -v` in a terminal.

1. Unzip the folder and open it in VS Code (File > Open Folder).
2. Open a terminal (Terminal > New Terminal). Start the **server**:

```
cd server
npm install
npm start
```

You should see: `Karz Kavach server running on http://localhost:5000`

3. Open a **second** terminal (click the + or split icon). Start the **website**:

```
cd client
npm install
npm run dev
```

4. Open the link it prints (usually http://localhost:5173).
5. Type `QuickRupee Demo` and press **Check app**. Try the other five apps too (the box suggests them).

Both terminals must stay open while you demo.

If the page says it could not reach the server, the first terminal is not running.

To run the checks on the scoring engine: `cd server` then `npm test`. All tests should pass.

---

## 2. How the project is organised

```
server/
  index.js            starts the Express server and defines the 3 routes
  handlers.js         the logic behind each route
  scoring.js          THE CORE: the scoring rules and name matching
  messages.js         all English and Hindi sentences, and permission weights
  data/apps.json      the demo apps (name, permissions, privacy policy, etc.)
  data/directory.json demo copy of the "RBI directory" (app name and lender)
client/
  src/App.jsx         the screens (search, verdict card, language toggle)
  src/App.css         colours and layout
```

How a check works:
1. The website sends the app name to `/api/check?name=...`.
2. `scoring.js` finds the app, looks it up in the directory, and adds up risk points.
3. The server sends back the verdict, score, reasons and advice. The website shows it.

Score = permissions (max 40) + registration (max 40) + transparency (max 20).
0 to 29 = Safe, 30 to 59 = Needs a closer look, 60 and above = Risky.

---

## 3. Things you can change (good for learning)

**Add a new demo app:** open `server/data/apps.json`, copy one block, change the name, permissions and yes/no fields (`true` or `false`), and give it a new `id`. Save, restart the server, search for it.

To make it count as "listed", also add a line in `server/data/directory.json` with the same app name and a lender.

**Change how risky a permission is:** edit the `weight` numbers in `server/messages.js`.

**Change verdict cut-offs:** edit `THRESHOLDS` at the top of `server/scoring.js`.

**Change wording or Hindi text:** edit `messages.js` (reasons) and the `UI` block at the top of `client/src/App.jsx` (screen text).

If you change scores, run `npm test` in `server`. Some tests check exact numbers and will tell you what changed.

---

## 4. What is NOT built yet (be honest about this in the pitch)

- No real RBI directory data. `directory.json` is a small demo list. Real data would come from RBI's public Digital Lending Apps directory on rbi.org.in, and you must check how you are allowed to collect it.
- No APK upload and no Play Store lookup. Permissions come from the demo data.
- No MongoDB yet. Data is read from the JSON files. The abstract says MongoDB, so be ready to say it is the planned database and that the data layer is isolated, so the switch is small.
- Claim-vs-reality check exists but works on the demo data only.
- The "Listen" button uses the browser's built-in voice. Hindi voice quality depends on the device.

---

## 5. GitHub, step by step

**One person (you) does this once:**

1. On github.com click **New repository**. Name it `karz-kavach`. Leave "Add a README" **unchecked**. Click Create.
2. In the project folder, in a terminal:

```
git init
git add .
git commit -m "Initial Karz Kavach starter"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/karz-kavach.git
git push -u origin main
```

(Replace the link with the one GitHub shows you.)

3. On GitHub: Settings > Collaborators > add your two teammates.

**Every time you finish a bit of work:**

```
git add .
git commit -m "short note of what you did"
git push
```

**Teammates, first time:** `git clone https://github.com/YOUR-USERNAME/karz-kavach.git`

**Before you start work each time:** `git pull` (this brings in other people's changes).

Simple rules to avoid trouble: pull before you start, push often, and try not to edit the same file at the same time. The `.gitignore` already keeps `node_modules` out of GitHub.

---

## 6. Demo script (about 1 minute)

1. Search `QuickRupee Demo`: Risky. Show the three score bars and the red flags.
2. Scroll to "What this app can do to you" (contacts, SMS, OTPs).
3. Switch to हिंदी and press Listen.
4. Search `EasyPay Credit Demo`: the app claims one lender, the directory says another (claim vs reality).
5. Search `InstaCash Demo`: unlisted but minimal permissions, so only "needs a closer look", not "fraud". This shows you thought about false positives.
6. Search `SureLoan Demo`: Safe.
