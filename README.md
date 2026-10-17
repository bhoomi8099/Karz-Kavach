# Karz Kavach

> **Anti-Predatory Loan App Detector**  
> *"Know before you borrow"*  

Karz Kavach is a friendly, easy-to-use tool that checks whether a loan app is safe or risky **before** you install it or borrow money. It looks at the permissions the app asks for, checks if the lender is legally registered with the RBI, and explains the risks in simple **English and Hindi** with audio readout.

---

## 📌 The Problem

Many instant loan apps trick people who urgently need money:
- They promise fast loans with "no paperwork".
- Once installed, they ask for sensitive permissions like **Contacts, Photos, and SMS**.
- They use this private data to blackmail and harass borrowers and their families.
- Many claim they are partnered with RBI-registered banks or NBFCs when they are not.
- Even though the Reserve Bank of India (RBI) has an official public directory of approved lending apps, most borrowers do not know how to find or check it.

---

## 💡 Our Solution

**Karz Kavach** gives borrowers a clear verdict in seconds:
- **🟢 Safe** (*सुरक्षित*): The app is registered, asks only for basic needed permissions, and has clear policies.
- **🟡 Requires Review** (*ध्यान से जांचें*): The app is unverified or asks for extra permissions; proceed with caution.
- **🔴 Risky** (*जोखिम भरा*): The app asks for dangerous permissions (like reading your contacts or OTPs) or lies about its registration.

Every result comes with clear, plain-language explanations in **both English and Hindi**, plus a **"Listen / सुनें"** button so anyone can hear the verdict out loud.

---

## 🔄 Core Flow: How It Works

Our system follows a simple 5-step process:

$$\text{Scan} \longrightarrow \text{Verify} \longrightarrow \text{Assess Risk} \longrightarrow \text{Explain} \longrightarrow \text{Warn}$$

1. **Scan:** Reads the permissions the app requests (such as contacts, SMS, storage, or camera).
2. **Verify:** Checks if the app and its developer are listed in the official RBI lending directory.
3. **Assess Risk:** Calculates a transparent risk score (0 to 100) based on three factors:
   - **Permissions (Max 40 points):** Dangerous access like contacts or SMS.
   - **Registration (Max 40 points):** Whether the app is registered and tells the truth about its lender.
   - **Transparency (Max 20 points):** Whether the app has a privacy policy and a grievance officer.
4. **Explain:** Shows clear reasons for every flag raised (no mysterious "black box" decisions). Unlisted apps are marked as *unverified* (not automatically fraudulent) to prevent false alarms.
5. **Warn & Guide:** Gives safe next steps, such as reporting fake apps to the Cyber Crime Helpline (**1930**), **Chakshu**, or **RBI Sachet**.

---

## ✨ Key Innovations

- **All-in-One Check:** Combines Android permission auditing with official regulatory verification in a single search.
- **Claim vs. Reality Check:** Catches apps that pretend to be linked with trusted NBFCs by cross-checking names.
- **Explainable Scoring:** Every warning flag clearly explains *what* was found and *why* it matters.
- **Bilingual & Audio Friendly:** Full support for Hindi and English, designed for first-time digital borrowers.

---

## 🎯 United Nations Sustainable Development Goals (SDGs)

This project directly contributes to:
- **SDG 10: Reduced Inequalities** — Protects vulnerable and low-income borrowers from financial exploitation.
- **SDG 16: Peace, Justice, and Strong Institutions** — Combats illegal lending rackets and encourages lawful financial practices.
- **SDG 9: Industry, Innovation, and Infrastructure** — Promotes safe, ethical digital financial services.

---

## 💻 Tech Stack

- **Frontend:** React, HTML5, CSS3 (Material-3 inspired design, mobile-first responsive layout, Web Speech API for voice).
- **Backend:** Node.js, Express.js.
- **Scoring Engine:** Deterministic rule-based engine with fuzzy name matching (Levenshtein distance).
- **Database / Data Storage:** Modular JSON data layer (designed to easily plug into MongoDB).

---

## 📁 Project Structure

```text
karz-kavach/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx         # Search box, verdict cards, language toggle & audio
│   │   ├── App.css         # Clean, responsive styling & design tokens
│   │   └── main.jsx        # App entry point
│   └── index.html          # HTML shell with Google Fonts
│
├── server/                 # Backend API (Node.js + Express)
│   ├── index.js            # Express server & API routes
│   ├── handlers.js         # Request handlers
│   ├── scoring.js          # Scoring engine & fuzzy matching logic
│   ├── messages.js         # Explanations in English & Hindi, permission weights
│   ├── test.js             # Automated unit tests
│   └── data/
│       ├── apps.json       # Demo loan apps data
│       └── directory.json  # Reference directory of registered lenders
│
└── design/                 # UI/UX reference screens and mockups
```

---

## ⚡ Quickstart: Running the Project

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

### 1. Start the Server
Open a terminal in the project folder:
```bash
cd server
npm install
npm start
```
*The server will start on `http://localhost:5000`.*

### 2. Start the Website
Open a **second** terminal window:
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

### 3. Run Automated Tests
To test the scoring engine and matching rules:
```bash
cd server
node --test
```

---

## 🔮 Future Scope & Next Steps

- **Direct APK & Store Link Analysis:** Let users paste a Google Play Store link or upload an `.apk` file for instant scanning.
- **WhatsApp Bot:** Make the service available over WhatsApp so users can send an app name or screenshot to get an instant verdict.
- **Browser Extension:** Alert users when they visit unofficial APK download websites.
- **Live RBI Sync:** Automatically sync with live RBI directories and consumer complaints portals.

---

## ⚖️ Note
*The sample apps included in this project are fictional demo datasets created for hackathon demonstration and testing purposes.*
