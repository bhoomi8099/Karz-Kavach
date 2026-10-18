# Karz Kavach (कर्ज़ कवच) 🛡️

> **Check loan apps before they check you.**  
> *ऐप डाउनलोड करने से पहले जांचें*

**Karz Kavach** is an easy-to-use, bilingual website built to protect citizens in India from fake, predatory, and illegal loan apps.

Instead of guessing whether an app is safe, Karz Kavach checks it directly against official **Reserve Bank of India (RBI)** records and real **Google Play Store permissions**, giving you clear facts and official complaint contacts in seconds.

---

## 🛑 Why Was This Built?

In India, many fraudulent and illegal loan apps trick borrowers every day:
1. **Harassment through phone permissions:** Rogue apps demand access to your Contacts, SMS messages, Photos, and Location, and later use them to blackmail borrowers and their families.
2. **Fake claims:** Unregulated apps often claim they are partnered with famous banks or NBFCs when they are not.
3. **Hard-to-read official data:** The RBI publishes lists of genuine Digital Lending Apps (DLAs), but they are buried inside large spreadsheets that are difficult for regular people to search on a mobile phone.

**Karz Kavach solves this by making official verification as easy as searching a name.**

---

## ✨ Key Features (What You Can Do)

### 1. 🔍 Instant Loan App Verification
- Type the name of any loan app (e.g. **PhonePe, Paytm, Navi, Blink Credit**).
- **Official RBI Directory Check:** Checks against **1,734+ real apps** officially registered in RBI's Digital Lending directory.
- **Shows Real Evidence:**
  - **Registered Lender:** Shows the exact bank or NBFC legally responsible for the app.
  - **Grievance Redressal Officer:** Shows the official officer's name, email (`mailto:`), and phone number (`tel:`) so you know exactly who to contact for disputes.
  - **Google Play Permission Exposure:** Reads what sensitive permissions the app actually asks for (Contacts, SMS, Camera, Location, Storage) and gives an easy-to-read Low, Medium, or High exposure bar.
  - **Next Steps & Helpline Links:** Direct links to report illegal apps to Cyber Crime (**1930**), Chakshu, or RBI Sachet.
- **Smart Typo Tolerance:** If you misspell an app name, the site suggests close matches ("Did you mean...").

### 2. ⭐ Trusted Apps Directory
- A dedicated tab showing **590+ RBI-registered apps** that are also well-rated by users on the Google Play Store.
- **Filter easily:** Browse "All", "Highly rated" (4.2★+), or "Well rated" apps.
- **Search & Sort:** Search by app name or lender, and sort by trust score, star ratings, or number of user reviews.
- **One-Click Check:** Click any trusted app card to immediately inspect its permissions and grievance officer.
- **Safe Install:** Direct links to open the official listing on the Google Play Store.

### 3. 🌐 100% Bilingual (English & Hindi)
- Switch instantly between **English** and **हिंदी** at any time.
- All headings, explanations, risk levels, and permissions are translated so everyone can understand.

### 4. 🔊 Voice Readout (Listen / सुनें)
- Tap the **Listen / सुनें** button to hear the verification findings read out loud.
- Perfect for users who prefer listening or have difficulty reading text on a small screen.

---

## 🧭 How It Works (Simple Flow)

```
                            User types an app name
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   RBI Directory Search    │
                        │   (1,734+ official apps)  │
                        └─────────────┬─────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
       App Found in RBI                                Not Found in RBI
              │                                               │
  • Shows official lender name                    • Cautions the user
  • Shows Grievance Officer details               • Suggests close names
  • Fetches live Play Store permissions           • Gives safety checklist
  • Shows permission exposure bar                 • Links to report fraud
```

---

## 🛠️ Technology Used

- **Frontend:** React 18, Vite, clean Vanilla CSS (fast, mobile-friendly, no heavy UI libraries).
- **Backend:** Node.js, Express.js.
- **Live Permission Fetching:** `google-play-scraper` with in-memory caching.
- **Data Ingestion:** Custom CSV parser for RBI spreadsheets that cleans merged cells, removes duplicates, and extracts Play Store IDs.
- **Accessibility:** Web Speech API for Hindi & English audio readouts.

---

## 📁 Project Folders

```text
karz-kavach/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx             # Main UI: Search, Trusted Apps tab, Audio, Language toggle
│   │   ├── App.css             # Styling & responsive design system
│   │   └── main.jsx            # React root
│   └── index.html              # HTML template
│
├── server/                     # Backend API (Node + Express)
│   ├── index.js                # API server entry point (port 5000)
│   ├── handlers.js             # API route handlers (/api/check, /api/trusted, /api/stats)
│   ├── scoring.js              # RBI directory search & demo scoring logic
│   ├── playPermissions.js      # Google Play permissions reader
│   ├── trusted.js              # Trusted apps builder & filter logic
│   ├── directoryImport.js      # CSV parser for RBI lending directories
│   ├── rbi-directory.csv       # Raw official RBI dataset
│   ├── data/
│   │   ├── directory.json      # 1,734+ imported RBI apps
│   │   ├── trusted-apps.json   # 590+ RBI apps vetted with Play Store ratings
│   │   └── directory-source.json # Import stats and timestamp
│   └── *.test.js               # 38 automated test cases
└── README.md
```

---

## 🚀 How to Run Karz Kavach Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher).

### Step 1: Start the Backend Server
Open a terminal:
```bash
cd server
npm install
npm start
```
*The backend will run on `http://localhost:5000`.*

### Step 2: Start the Frontend Client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your web browser.*

---

## 🧪 Testing the Project

### Try These Searches in the App:
- **PhonePe / Paytm / Navi / Blink Credit:** Click the quick **"Try:"** chips to see official RBI records, live permissions, and grievance contacts.
- **Typo Search (e.g. `PhonPe`):** See how fuzzy search suggests the correct app name.
- **Unknown App (e.g. `SuperFastMoneyLoan`):** See the warning explaining that the app is unlisted, along with safe next steps.
- **Trusted Apps Tab:** Click "Trusted Apps" to explore verified apps, filter by rating tier, or search by lender.

### Run Automated Tests:
In the `server` folder, run:
```bash
cd server
npm test
```
*Runs all **38 automated tests** covering directory parsing, Play Store permission scoring, search algorithms, and grievance officer data extraction.*

---

## ⚖️ Note & Disclaimer
- Directory records and grievance contacts are directly sourced from data published by regulated financial institutions in the **RBI Digital Lending Apps (DLA) Directory**.
- Karz Kavach provides objective factual evidence (registration status, declared permissions, official contacts) to help citizens make informed decisions. It is not an endorsement or credit advice. Always read loan terms carefully before signing.
