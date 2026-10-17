# Karz Kavach

> **Anti-Predatory Loan App & Digital Lending Fraud Risk Detector**  


Karz Kavach is an explainable consumer-protection platform designed to safeguard borrowers against illegal digital lending apps, extortionate loan sharks, and aggressive data harvesting. By evaluating app permissions, regulatory registrations, and transparency disclosures, Karz Kavach delivers instant, easy-to-understand safety verdicts (**Safe**, **Needs Review**, or **Risky**) in both **English and Hindi** with audio accessibility.

---

## 🚨 Problem Statement

The rise of digital lending in India has brought a parallel surge of **predatory and unauthorized lending apps**. Rogue operators exploit urgent financial distress through deceptive tactics:

- **Data Weaponization:** Demanding access to contacts, call logs, SMS, and photo galleries to blackmail borrowers and intimidate family and friends.
- **Regulatory Impersonation (Claim vs. Reality):** Fraudulently claiming partnerships with legitimate Non-Banking Financial Companies (NBFCs) or banks registered with the Reserve Bank of India (RBI).
- **Hidden Terms & Lack of Redressal:** Operating without valid privacy policies, physical addresses, or appointed grievance redressal officers.
- **Accessibility Barrier:** Legal circulars and complex regulatory directories are difficult for everyday citizens and first-time smartphone borrowers to navigate.

---

## 🛡️ Core Solution & Key Highlights

Karz Kavach bridges this information gap by providing a proactive verification tool before a borrower installs or shares personal data with a lending app:

1. **Multi-Vector Risk Scoring Engine (0–100 Scale)**  
   A deterministic, explainable rule engine that breaks down risk across three core pillars: Permission Risk, Registration Risk, and Transparency Risk.
2. **Android Permission Auditing**  
   Audits declared Android permissions against RBI digital lending guidelines, flagging dangerous permissions like `READ_CONTACTS`, `READ_SMS` (OTP interception), and storage access.
3. **Claim vs. Reality Regulatory Cross-Referencing**  
   Fuzzy-matches app claims against a directory of recognized Regulated Entities (REs) to catch fake affiliations, ghost lenders, and brand spoofing.
4. **Bilingual & Audio Accessibility**  
   Full interface localization in **English** and **Hindi (हिंदी)**, equipped with browser text-to-speech (*"Listen / सुनें"*) for rural and non-English-speaking users.
5. **Actionable Remediation Guidance**  
   Provides tailored safety recommendations, immediate defense steps (e.g., revoking permissions, securing UPI/bank accounts), and direct links to official reporting channels (**Cyber Crime Helpline 1930**, **Chakshu**, and **RBI Sachet**).

---

## 🧮 Risk Scoring Methodology

Karz Kavach avoids opaque "black-box" predictions. Every point in the total risk score is tied to an explicit, auditable security rule:

$$\text{Total Risk Score} = \text{Permission Risk (Max 40)} + \text{Registration Risk (Max 40)} + \text{Transparency Risk (Max 20)}$$

### 1. Permission Risk (Max 40 Points)
Measures the intrusion level and potential for harassment:
- **`READ_CONTACTS` (+15 pts):** High extortion hazard (used to shame borrowers via their contact list).
- **`READ_SMS` (+15 pts):** Financial hazard (can intercept confidential banking and authentication OTPs).
- **`READ_CALL_LOG` / `READ_EXTERNAL_STORAGE` (+10 pts each):** Severe privacy breach (access to communication history and private photos).
- **`ACCESS_FINE_LOCATION` / `RECORD_AUDIO` (+6 pts each):** Unnecessary surveillance vectors.
- **`CAMERA` (+4 pts):** Monitored KYC vector.
- **`READ_PHONE_STATE` (+3 pts):** Device telemetry tracking.

### 2. Registration & Regulatory Risk (Max 40 Points)
Checks legitimacy against regulatory frameworks:
- **Unverified / Not in RBI Directory (+30 pts):** App lacks record of RBI registration or licensed NBFC backing.
- **Claim-vs-Reality Mismatch (+25 pts):** App claims affiliation with one lender while the directory attributes it to another or none.

### 3. Transparency & Governance Risk (Max 20 Points)
Audits accountability:
- **No Working Privacy Policy (+10 pts):** Failure to disclose data storage, retention, and third-party sharing practices.
- **No Appointed Grievance Officer (+10 pts):** Non-compliance with mandated dispute resolution mechanisms.

### Verdict Thresholds

| Score Range | Verdict | Status Meaning |
| :---: | :---: | :--- |
| **0 – 29** | 🟢 **Safe** (*सुरक्षित*) | Verified lender backing, minimal compliant permissions, transparent policies. |
| **30 – 59** | 🟡 **Needs Review** (*ध्यान से जांचें*) | Unverified status or elevated non-critical permissions; proceed with caution. |
| **60 – 100** | 🔴 **Risky** (*जोखिम भरा*) | Excessive intrusive permissions, predatory flags, or fraudulent claims. |

---

## 🏛️ System Architecture

```
karz-kavach/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── App.jsx             # UI with bilingual toggle, search, score gauge, and advice
│   │   ├── App.css             # Design-system CSS (Material-3 tokens, responsive layout)
│   │   └── main.jsx            # Application entrypoint
│   └── index.html              # Shell HTML with Noto Sans & Google Symbols
│
├── server/                     # Backend API & Engine (Node.js + Express)
│   ├── index.js                # Express server setup and route configuration
│   ├── handlers.js             # Route controllers (decoupled for testability)
│   ├── scoring.js              # Core heuristic engine & Levenshtein fuzzy matching
│   ├── messages.js             # Bilingual dictionaries, permission weights & flags
│   ├── test.js                 # Unit tests for scoring logic & edge cases
│   └── data/
│       ├── apps.json           # Catalog of analyzed applications & permission manifests
│       └── directory.json      # Regulatory directory of licensed Regulated Entities
│
└── design/                     # UX/UI mockups and reference specifications
```

---

## 🔌 API Endpoints

### 1. `GET /api/check?name=:appName`
Performs risk analysis and returns the safety verdict, score breakdown, triggered flags, and remediation steps.

**Sample Response (`200 OK`):**
```json
{
  "name": "QuickRupee Demo",
  "score": 75,
  "verdict": "RISKY",
  "breakdown": {
    "permission": 40,
    "registration": 25,
    "transparency": 10
  },
  "flags": [
    {
      "severity": "bad",
      "text": "App claims ABC Finance, but directory says Quick NBFC.",
      "text_hi": "ऐप दावा करता है ABC Finance, लेकिन डायरेक्टरी कहती है Quick NBFC।"
    }
  ],
  "permissions": [ ... ],
  "nextSteps": [ ... ]
}
```

### 2. `GET /api/apps`
Returns the list of indexed applications to power the client-side search suggestions and autocompletion.

### 3. `GET /api/health`
Health check endpoint returning `{ "ok": true }`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or later)
- npm (bundled with Node.js)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/karz-kavach.git
   cd karz-kavach
   ```

2. **Start the Backend Server:**
   ```bash
   cd server
   npm install
   npm start
   ```
   *The server runs at `http://localhost:5000`.*

3. **Start the Frontend Client:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

---

## 🧪 Testing

The scoring engine includes automated unit tests covering score caps, fuzzy string matching, claim-vs-reality detection, and bilingual flag generation:

```bash
cd server
npm test
```

---

## 🔮 Roadmap & Future Enhancements

- **Direct APK & Manifest Analysis:** Allow users to upload an `.apk` file or provide a Google Play Store link for automatic permission extraction.
- **Live RBI Registry Synchronization:** Automate continuous scraping/sync with RBI's public Digital Lending Apps (DLA) repository and the Sachet portal.
- **Community Threat Intelligence:** Allow victims to flag abusive recovery calls and unmask predatory apps in real time.
- **Persistent Data Store:** Migrate storage from static JSON catalogs to MongoDB with indexing and audit logs.

---

## ⚖️ Disclaimer

*The sample apps included in this repository are **fictional demonstration datasets** designed to illustrate the scoring engine's capabilities during hackathon evaluation. Karz Kavach is intended as an informational consumer-protection tool and does not constitute formal legal or financial advice.*
