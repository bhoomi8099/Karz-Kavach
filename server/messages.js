// All the text shown to the user lives here, in English (en) and Hindi (hi).
// To change a weight or a sentence, edit this file only.

// What each Android permission can do, and how risky we think it is (weight).
// The permission part of the score is capped at 40 in scoring.js.
const PERMISSIONS = {
  READ_CONTACTS: {
    weight: 15,
    en: 'can copy your whole contact list (can be used to pressure you through family and friends)',
    hi: 'आपकी पूरी कॉन्टैक्ट लिस्ट कॉपी कर सकता है (परिवार और दोस्तों को परेशान करने में इस्तेमाल हो सकती है)',
  },
  READ_SMS: {
    weight: 15,
    en: 'can read all your SMS, including bank OTPs',
    hi: 'आपके सभी SMS पढ़ सकता है, बैंक OTP सहित',
  },
  READ_CALL_LOG: {
    weight: 10,
    en: 'can see who you called and when',
    hi: 'आपने किसे और कब कॉल किया, यह देख सकता है',
  },
  READ_MEDIA_IMAGES: {
    weight: 10,
    en: 'can access your photos and files',
    hi: 'आपकी फोटो और फाइलें देख सकता है',
  },
  READ_EXTERNAL_STORAGE: {
    weight: 10,
    en: 'can access your photos and files',
    hi: 'आपकी फोटो और फाइलें देख सकता है',
  },
  ACCESS_FINE_LOCATION: {
    weight: 6,
    en: 'can track your exact location',
    hi: 'आपकी सटीक लोकेशन ट्रैक कर सकता है',
  },
  RECORD_AUDIO: {
    weight: 6,
    en: 'can record sound through your microphone',
    hi: 'माइक्रोफोन से आवाज़ रिकॉर्ड कर सकता है',
  },
  CAMERA: {
    weight: 4,
    en: 'can use your camera (some lenders need this for KYC)',
    hi: 'आपका कैमरा इस्तेमाल कर सकता है (कुछ लेंडर KYC के लिए इसका इस्तेमाल करते हैं)',
  },
  READ_PHONE_STATE: {
    weight: 3,
    en: 'can read your phone number and device ID',
    hi: 'आपका फोन नंबर और डिवाइस ID पढ़ सकता है',
  },
};

const VERDICTS = {
  SAFE: { en: 'Looks safe', hi: 'सुरक्षित लग रहा है' },
  REVIEW: { en: 'Needs a closer look', hi: 'ध्यान से जांचें' },
  RISKY: { en: 'Risky', hi: 'जोखिम भरा' },
};

// Each flag explains one thing we found. severity: 'bad' | 'warn' | 'good'
const FLAGS = {
  IN_DIRECTORY: {
    severity: 'good',
    en: (v) => `Found in the RBI directory under ${v.lender}.`,
    hi: (v) => `RBI डायरेक्टरी में ${v.lender} के तहत मिला।`,
  },
  NOT_IN_DIRECTORY: {
    severity: 'bad',
    en: () =>
      'Not found in the RBI directory of lending apps, so we cannot verify a link to a regulated lender. Unverified does not always mean fraud.',
    hi: () =>
      'RBI की लेंडिंग ऐप डायरेक्टरी में नहीं मिला, इसलिए हम किसी रेगुलेटेड लेंडर से जुड़ाव की पुष्टि नहीं कर सकते। "अनवेरिफाइड" का मतलब हमेशा धोखाधड़ी नहीं होता।',
  },
  CLAIM_UNVERIFIED: {
    severity: 'bad',
    en: (v) =>
      `The app says it works with ${v.claimed}, but there is no directory entry to confirm this.`,
    hi: (v) =>
      `ऐप दावा करता है कि वह ${v.claimed} के साथ काम करता है, लेकिन इसकी पुष्टि के लिए डायरेक्टरी में कोई एंट्री नहीं मिली।`,
  },
  CLAIM_MISMATCH: {
    severity: 'bad',
    en: (v) =>
      `The app claims ${v.claimed}, but the directory lists it under ${v.lender}.`,
    hi: (v) =>
      `ऐप ${v.claimed} का दावा करता है, लेकिन डायरेक्टरी में यह ${v.lender} के तहत दर्ज है।`,
  },
  NO_PRIVACY_POLICY: {
    severity: 'warn',
    en: () => 'No privacy policy found.',
    hi: () => 'कोई प्राइवेसी पॉलिसी नहीं मिली।',
  },
  NO_GRIEVANCE: {
    severity: 'warn',
    en: () => 'No grievance or complaint contact is shown.',
    hi: () => 'शिकायत के लिए कोई संपर्क नहीं दिखाया गया है।',
  },
  NO_FEE_DETAILS: {
    severity: 'warn',
    en: () => 'Interest rate and fees are not clearly stated.',
    hi: () => 'ब्याज दर और शुल्क साफ़ तौर पर नहीं बताए गए हैं।',
  },
};

const NEXT_STEPS = {
  SAFE: {
    en: ['Still read the loan terms and interest rate carefully before accepting.'],
    hi: ['फिर भी लोन स्वीकार करने से पहले शर्तें और ब्याज दर ध्यान से पढ़ें।'],
  },
  UNSAFE: {
    en: [
      'Do not install the app or share your contacts, SMS or photos.',
      'If it is already installed, remove its permissions in Settings and uninstall it.',
      'Report it at cybercrime.gov.in or call the cyber crime helpline 1930.',
    ],
    hi: [
      'ऐप इंस्टॉल न करें और अपने कॉन्टैक्ट, SMS या फोटो साझा न करें।',
      'अगर पहले से इंस्टॉल है, तो सेटिंग्स में उसकी परमिशन हटाएं और ऐप अनइंस्टॉल करें।',
      'cybercrime.gov.in पर शिकायत करें या साइबर क्राइम हेल्पलाइन 1930 पर कॉल करें।',
    ],
  },
};

function makeFlag(code, vars = {}) {
  const f = FLAGS[code];
  return { code, severity: f.severity, en: f.en(vars), hi: f.hi(vars) };
}

module.exports = { PERMISSIONS, VERDICTS, FLAGS, NEXT_STEPS, makeFlag };
