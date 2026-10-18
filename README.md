# Karz Kavach (कर्ज़ कवच)

> **Citizen Protection Engine against Predatory Loan Apps**  
> *"Check the app before it checks you • ऐप डाउनलोड करने से पहले जांचें"*

Karz Kavach is a bilingual, accessibility-first web application designed to protect citizens from predatory digital lending apps. It bridges the gap between official regulatory data and the app store ecosystem by cross-referencing apps against the **Reserve Bank of India (RBI) Digital Lending Directory**, analyzing **Google Play Store permissions exposure**, and providing direct access to **Grievance Redressal Officers**.

---

## 📌 The Problem

Digital lending in India has expanded rapidly, but rogue and predatory loan apps have exploited first-time digital borrowers:
- **Permission Harvesting:** Apps demand access to sensitive permissions—such as **Contacts, SMS (including bank OTPs), Photos, Storage, and Precise Location**—to blackmail borrowers and harass their families.
- **False Regulatory Claims:** Unregistered operators claim partnerships with reputable banks or Non-Banking Financial Companies (NBFCs) to project legitimacy.
- **Information Asymmetry:** While the RBI publishes an official directory of approved Digital Lending Apps (DLAs) and regulated entities, ordinary citizens find it difficult to search through complex spreadsheets, especially in regional languages.

---

## 💡 How Karz Kavach Solves It

Karz Kavach provides instantaneous, transparent assessments using a dual-mode engine:

```
                  ┌────────────────────────────────────────┐
                  │          Search Loan App Name          │
                  └───────────────────┬────────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
        [ Prototype Demo Apps ]              [ Real RBI Directory Apps ]
     Full 3-Pillar Threat Assessment     Live Directory Match & Play Exposure
     • Risk Score Gauge (0–100)          • Official Registered Lender Entity
     • Permissions Audit (Max 40)        • Grievance Redressal Officer Contact
     • Regulatory Linkage (Max 40)       • Live Play Store Permission Exposure
     • Transparency & Fees (Max 20)      • Direct mailto: and tel: Click-to-Call
     • What this app can do to you       • "Did you mean" Fuzzy Suggestions
```

### 1. Prototype Threat Assessment (Demo Apps)
For analyzed demo apps, Karz Kavach generates an explainable 0–100 threat assessment across three pillars:
- **Permissions (Max 40 pts):** Penalizes invasive access (e.g., Contacts: 15, SMS: 15, Storage: 10).
- **Registration (Max 40 pts):** Validates genuine ties to RBI-regulated lenders. Catches "claim vs. reality" mismatches where an app claims one lender but operates under another.
- **Transparency & Fees (Max 20 pts):** Checks for upfront APR disclosures, valid privacy policies, and grievance contact mechanisms.

### 2. Live RBI Directory Verification & Google Play Permission Exposure
When searching real-world lending apps:
- **RBI Directory Matching:** Searches across 1,700+ official RBI-registered lending apps using Levenshtein distance and token-based fuzzy matching.
- **Grievance Redressal Officer Integration:** Automatically displays the lender's designated grievance officer with direct, tap-to-call `tel:` and `mailto:` links for prompt dispute resolution.
- **Live Google Play Store Permissions Exposure:** Reads permissions declared on the app's Google Play listing via package ID extraction and provides an objective exposure assessment (Low: Teal, Medium: Amber, High: Orange).
- **Responsible & Factual:** Refrains from using speculative or defamatory labels (such as "fraud" or "scam") for real directory entries, focusing objectively on declared permission exposures and official directory listings.

### 3. Accessibility & Inclusion First
- **100% Bilingual (English & Hindi):** Seamless, one-click toggle between English and Hindi across all screens, scores, tags, and guidance.
- **Text-to-Speech (Listen / सुनें):** Built-in Web Speech API voice readout (`en-IN` and `hi-IN`) allows non-literate and visually impaired users to hear verdicts out loud.
- **Responsive Material-3 Aesthetic:** Mobile-optimized UI with fluid design tokens, clean color coding, and high-contrast accessibility.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Vanilla CSS3 (Custom Design Tokens, Material-3 Card Architecture, Web Speech API).
- **Backend:** Node.js, Express.js.
- **Scoring & Matching Engine:** Deterministic rule-based scoring engine with Levenshtein string distance matching.
- **Live Permission Fetching:** `google-play-scraper` with in-memory 6-hour caching and timeout handling.
- **Data Ingestion:** Custom CSV/TSV streaming parser with auto-header detection, BOM stripping, merged row fill-down, and query parameter extraction.

---

## 📁 Project Architecture

```text
karz-kavach/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                  # Main interface: search, verdict cards, audio, localization
│   │   ├── App.css                  # Design system: tokens, gauges, exposure bars, grievance cards
│   │   ├── main.jsx                 # React root bootstrap
│   │   └── index.css                # Global resets
│   ├── index.html                   # HTML shell with Google Fonts (Noto Sans)
│   └── vite.config.js               # Vite bundler configuration
│
├── server/                          # Express.js Backend
│   ├── index.js                     # API routes & server initialization
│   ├── handlers.js                  # Request handlers for /api/apps, /api/check, /api/stats
│   ├── scoring.js                   # 3-pillar scoring engine & fuzzy directory search
│   ├── messages.js                  # Bilingual message catalogs, permission weights, guidance
│   ├── playPermissions.js           # Live Google Play Store permission analyzer & enricher
│   ├── directoryImport.js           # Robust CSV/TSV table parser for RBI directories
│   ├── rbi-directory.csv            # Official RBI digital lending dataset
│   ├── scripts/
│   │   └── import-directory.js      # CLI directory ingestion script
│   ├── data/
│   │   ├── apps.json                # Curated prototype demo apps
│   │   ├── directory.json           # Imported RBI lending directory (1,700+ entries)
│   │   ├── directory.demo.json      # Fallback reference directory
│   │   └── directory-source.json    # Ingestion metadata (record count, timestamp)
│   └── *.test.js                    # Comprehensive unit tests (scoring, imports, permissions)
│
└── design/                          # UX reference screens and design specifications
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (version 8 or higher)

### 1. Setup the Server
```bash
cd server
npm install
npm start
```
*The backend server runs on `http://localhost:5000`.*

### 2. Setup the Client
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 📊 Ingesting Updated RBI Directories

You can import any updated RBI Digital Lending spreadsheet (CSV or TSV):
```bash
cd server
node scripts/import-directory.js rbi-directory.csv
```
The importer automatically:
- Identifies the app name and lender columns.
- Re-uses merged lender cells across multiple apps.
- Extracts Play Store package IDs even when extra query parameters (`hl=`, `gl=`) exist.
- Extracts Grievance Redressal Officer names, emails, and phone/mobile numbers.
- Updates `server/data/directory.json` and records stats in `server/data/directory-source.json`.

---

## 🧪 Running Automated Tests

Karz Kavach includes an extensive unit test suite covering the scoring engine, fuzzy matching, CSV ingestion edge cases, live Play Store enrichment, and text-to-speech sanitization:

```bash
cd server
npm test
```
*(Runs 33 automated tests via Node's native test runner).*

---

## 🎯 Sustainable Development Goals (SDGs)

- **SDG 10: Reduced Inequalities:** Protects unbanked and economically vulnerable citizens from debt traps and predatory practices.
- **SDG 16: Peace, Justice, and Strong Institutions:** Promotes legal, regulated financial institutions and provides actionable dispute escalation channels (Cyber Crime **1930**, **Chakshu**, **RBI Sachet**).
- **SDG 9: Industry, Innovation, and Infrastructure:** Supports the safe, ethical adoption of digital public infrastructure and financial technology.

---

## ⚖️ Disclaimer
*The prototype loan apps (`QuickRupee Demo`, `SureLoan Demo`, `Kavach Loan Demo`) are fictional examples created for testing and demonstration. Real directory lookups reflect records publicly published by regulated entities in the RBI Digital Lending Directory.*
