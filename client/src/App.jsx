import { useEffect, useState } from 'react';
import './App.css';
import LoanCostCalculator from './LoanCostCalculator';
import CompareApps from './CompareApps';
import {
  Search,
  Star,
  Scale,
  Calculator,
  Share2,
  LifeBuoy,
  IndianRupee,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Shield,
  Languages,
  Volume2,
  ExternalLink,
  Info,
  Check,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Lock,
  Zap,
  Calendar,
  Database,
  X,
  Lightbulb,
} from 'lucide-react';

const TRY_APPS = ['PhonePe', 'Paytm', 'Navi', 'Blink Credit'];

// ── All screen text in English and Hindi ──────────────────────────────────────
const UI = {
  en: {
    title: 'Karz Kavach',
    titleHi: 'कर्ज़ कवच',
    tagline: 'Check the app before it checks you.',
    taglineHi: 'ऐप डाउनलोड करने से पहले जांचें',
    demoBanner: "Directory data: 1734 apps imported from RBI's DLA directory. For real apps we show evidence (RBI listing, permissions, complaint contact), not safe/risky labels.",
    bannerText: "Directory data: 1734 apps imported from RBI's DLA directory. For real apps we show evidence (RBI listing, permissions, complaint contact), not safe/risky labels.",
    placeholder: 'App name or Google Play link',
    tryLabel: 'Try:',
    check: 'Check app • ऐप की जांच करें',
    checking: 'Checking…',
    score: 'Risk score',
    scoreLabel: 'Total Threat Assessment',
    breakdown: 'Score Breakdown',
    permission: 'Permissions',
    registration: 'RBI Registration',
    transparency: 'Transparency & Fees',
    findings: 'What we found',
    findingsHi: 'जांच में क्या मिला',
    canDo: 'What this app can do to you',
    canDoHi: 'यह ऐप आपके साथ क्या कर सकता है',
    noPerms: 'No sensitive permissions requested.',
    nextSteps: 'What to do next',
    nextStepsHi: 'अब क्या करें',
    listen: 'Listen / सुनें',
    notFound: 'We could not find this app. Try one of these:',
    serverError: 'Could not reach the server. Is it running on port 5000?',
    claims: 'Claims to work with',
    developer: 'Developer',
    quickSuggest: 'Quick Suggestions / लोकप्रिय खोजें',
    searchLabel: 'Search Loan App or Paste Play Link',
    matchedEntry: 'Matched directory entry',
    matchedEntryHi: 'डायरेक्टरी में नाम',
    listedUnder: 'Listed under',
    listedUnderHi: 'लेंडर का नाम',
    didYouMean: 'Did you mean:',
    didYouMeanHi: 'क्या आपका मतलब यह था:',
    dirNote: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    dirNoteHi: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    permExposureTitle: 'Permission exposure (from the Google Play listing)',
    permExposureTitleHi: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    noPlayPerms: 'No sensitive permissions declared on the Play Store listing.',
    grievanceTitle: 'Who to complain to (Grievance Redressal Officer)',
    grievanceTitleHi: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceOfficer: 'Officer',
    grievanceEmail: 'Email',
    grievancePhone: 'Phone',
    grievanceMobile: 'Mobile',
    grievanceNote: 'Contact details are published by the lender in the RBI directory.',
    grievanceNoteHi: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    kachuSays: 'Kachu says:',
    asOfChecked: (date) => `Based on what we checked, as of ${date}`,
    sourceLabel: (src) => `Data source: ${src === 'live' ? 'Live Google Play' : 'Saved copy'}`,
    scoreBreakdownTitle: 'Score Breakdown',
    permissionsScore: 'Permissions',
    registrationScore: 'RBI registration',
    transparencyScore: 'Transparency & Fees',
    totalWarningScore: 'Total warning score',
    whyThisResult: 'Why this result',
    whyThisResultSub: 'Evidence from Google Play listing and RBI directory',
    confidenceTitle: 'Confidence',
    confidence_high: 'High',
    confidence_medium: 'Medium',
    confidence_low: 'Low',
    confidenceLowSub: 'Some data could not be read',
    lookalikeWarning: "A similar name is in the RBI directory under a different app. Check the lender's official link.",
    realAppAssessment: 'Real App Assessment',
    assessingPlay: 'Reading Google Play listing & RBI directory…',
    rbiRecordTitle: 'RBI directory record',
    rbiRecordTitleHi: 'RBI डायरेक्टरी रिकॉर्ड',
    playUnavailableNote: 'We could not read this app from Google Play right now.',
    matchedSearchTo: (title, dev) => `We matched your search to ${title} by ${dev} on Google Play. Not the right app? Paste its Google Play link above.`,
    assessErrors: {
      NEEDS_LINK: "We could not find that app on Google Play by name. Paste the app's Google Play link (play.google.com/store/apps/details?id=...) or its app ID.",
      PLAY_UNAVAILABLE: 'We could not read this app from Google Play right now. Check the link, or try again.',
    },
    notLendingBanner: "This doesn't look like a lending app, so RBI registration and loan-fee checks may not apply.",
    navChecker: 'Check App',
    navTrusted: 'Trusted Apps',
    navCompare: 'Compare',
    navCalc: 'Loan Calculator',
    compareHeroTag: 'Side-by-side Screening',
    compareTitle: 'Compare Two Apps',
    compareSubtitle: 'Compare RBI registration, permissions declared, risk scores and grievance contacts side-by-side.',
    compareApp1Label: 'App 1',
    compareApp2Label: 'App 2',
    comparePlaceholder: 'App name, Play link or app ID',
    compareBtn: 'Compare',
    comparing: 'Comparing apps…',
    compareWithAnother: 'Compare with another app',
    viewFullResult: 'View full result',
    fewerRiskPoints: 'fewer risk points',
    compareNote: 'This compares public information and is a screening, not a verdict. Verify with the RBI list and the lender.',
    rbiStatusMap: {
      id: 'Listed by Play ID',
      name: 'Listed by name only',
      lookalike: 'Lookalike (different app in RBI directory)',
      none: 'Not found in RBI directory',
    },
    rowAppIdentity: 'App details',
    rowAssessment: 'Assessment & risk points',
    rowScoreBreakdown: 'Score breakdown',
    rowRbiStatus: 'RBI directory status',
    rowPermissions: 'Permissions declared',
    rowRatings: 'User rating & reviews',
    rowSignals: 'Top signals',
    rowGrievance: 'Grievance contact',
    noDeclaredPermissions: 'No sensitive permissions declared on Google Play listing.',
    noGrievanceContact: 'No grievance contact published in RBI directory.',
    andMoreContacts: (n) => `and ${n} more`,
    enterBothAppsPrompt: 'Please enter both app names or links to compare.',
    checkAnother: '← Check another app',
    checkingApp: (q) => `Checking ${q}…`,
    exploreTrusted: 'Explore trusted lending apps',
    trustedHeading: 'Trusted apps — RBI-listed and well rated by users',
    trustedSubtext: 'Registered with RBI and rated well on Google Play. This is a trust signal, not a guarantee. Always read the terms.',
    trustedHeroTag: 'Verified Directory & Store Rating',
    trustedSearchPlaceholder: 'Search trusted apps or lenders…',
    filterAll: 'All',
    filterHigh: 'Highly rated',
    filterWell: 'Well rated',
    sortLabel: 'Sort by',
    sortBest: 'Best trust score',
    sortRating: 'Highest rating',
    sortReviews: 'Most reviews',
    showingApps: (shown, total) => `Showing ${shown} of ${total} apps`,
    ratingsFetchedOn: (date) => `Ratings fetched on ${date}`,
    trustedNotBuilt: 'Trusted list not built yet.',
    notFoundTrusted: 'No matching trusted apps found.',
    lenderLabel: 'Lender',
    trustLabel: 'Trust',
    trustScoreDesc: 'Composite score from rating and review volume',
    tierHigh: 'Highly rated',
    tierWell: 'Well rated',
    rbiSignal: 'RBI directory: listed',
    rbiListedPill: 'RBI listed',
    playSignalPrefix: 'Google Play',
    playSignalFrom: 'from',
    ratingsSuffix: 'ratings',
    viewOnPlay: 'View on Google Play',
    checkAppHint: 'Click to view permissions & grievance officer',
    verdictLabel: {
      safe: 'LOOKS SAFE',
      review: 'NEEDS A CLOSER LOOK',
      risky: 'RISKY — DO NOT INSTALL',
      listed: 'LISTED IN DIRECTORY',
      unverified: 'NOT FOUND IN DIRECTORY',
    },
    riskLabel: {
      safe: 'Very Low Risk',
      review: 'Moderate Risk',
      risky: 'Maximum Danger',
    },
    heroTag: 'Citizen Protection Engine',
    calcTitle: 'Loan cost calculator',
    calcSubtitle: 'See what you will really pay back, including fees and GST.',
    calcRealCostLink: 'Calculate the real cost of this loan',
    calcLoanAmount: 'Loan amount (₹)',
    calcInterestRate: 'Interest rate',
    calcTenure: 'Tenure',
    calcProcessingFee: 'Processing fee',
    calcGstOnFee: 'GST on processing fee (%)',
    calcOtherCharges: 'Other upfront charges (₹)',
    calcReset: 'Reset',
    calcRateUnitDay: '% per day',
    calcRateUnitMonth: '% per month',
    calcRateUnitYear: '% per year',
    calcTenureUnitDays: 'days',
    calcTenureUnitMonths: 'months',
    calcFeeTypeFlat: '₹',
    calcFeeTypePercent: '% of loan',
    calcPromptEmpty: 'Enter the details above to see the cost',
    calcChargesExceed: 'Charges are higher than the loan amount. Please check the numbers.',
    calcYouReceive: 'You actually receive',
    calcYouRepay: 'You repay in total',
    calcExtraPaid: 'Extra you pay',
    calcApproxYearlyCost: 'Approx. yearly cost',
    calcApproxTag: 'approximate',
    calcLegendReceive: 'You receive',
    calcLegendUpfront: 'Fee + GST + Charges',
    calcLegendInterest: 'Interest',
    calcEstimateNote: "This is an estimate based on the numbers you entered (simple interest, one payment at the end). Check the lender's Key Fact Statement for exact figures.",
  },
  hi: {
    title: 'कर्ज़ कवच',
    titleHi: 'Karz Kavach',
    tagline: 'ऐप आपको जाँचे, उससे पहले आप ऐप को जाँचें।',
    taglineHi: 'Check the app before it checks you',
    demoBanner: 'डायरेक्टरी डेटा: RBI की DLA डायरेक्टरी से 1734 ऐप आयात किए गए। वास्तविक ऐप के लिए हम साक्ष्य (RBI सूची, परमिशन, शिकायत संपर्क) दिखाते हैं, सुरक्षित/जोखिम भरे लेबल नहीं।',
    bannerText: 'डायरेक्टरी डेटा: RBI की DLA डायरेक्टरी से 1734 ऐप आयात किए गए। वास्तविक ऐप के लिए हम साक्ष्य (RBI सूची, परमिशन, शिकायत संपर्क) दिखाते हैं, सुरक्षित/जोखिम भरे लेबल नहीं।',
    placeholder: 'ऐप का नाम या Google Play लिंक',
    tryLabel: 'आज़माएं:',
    check: 'ऐप जाँचें • Check App',
    checking: 'जाँच हो रही है…',
    score: 'जोखिम स्कोर',
    scoreLabel: 'कुल खतरे का आकलन',
    breakdown: 'स्कोर कैसे बना',
    permission: 'परमिशन',
    registration: 'RBI रजिस्ट्रेशन',
    transparency: 'पारदर्शिता और शुल्क',
    findings: 'हमें क्या मिला',
    findingsHi: 'What we found',
    canDo: 'यह ऐप आपके साथ क्या कर सकता है',
    canDoHi: 'What this app can do to you',
    noPerms: 'कोई संवेदनशील परमिशन नहीं मांगी गई।',
    nextSteps: 'आगे क्या करें',
    nextStepsHi: 'What to do next',
    listen: 'सुनें (Listen)',
    notFound: 'यह ऐप नहीं मिला। इनमें से कोई आज़माएं:',
    serverError: 'सर्वर से संपर्क नहीं हो सका। क्या वह पोर्ट 5000 पर चल रहा है?',
    claims: 'दावा करता है कि इसके साथ काम करता है',
    developer: 'डेवलपर',
    quickSuggest: 'लोकप्रिय खोजें / Quick Suggestions',
    searchLabel: 'लोन ऐप खोजें या Google Play लिंक पेस्ट करें',
    matchedEntry: 'डायरेक्टरी में नाम',
    matchedEntryHi: 'Matched directory entry',
    listedUnder: 'लेंडर का नाम',
    listedUnderHi: 'Listed under',
    didYouMean: 'क्या आपका मतलब यह था:',
    didYouMeanHi: 'Did you mean:',
    dirNote: 'इस ऐप की परमिशन की जानकारी उपलब्ध नहीं है (डायरेक्टरी में इसका Play Store लिंक नहीं है, या Play Store से जानकारी नहीं मिली)।',
    dirNoteHi: 'Permission details are not available for this app (the directory has no Play Store link for it, or the Play Store could not be reached).',
    permExposureTitle: 'परमिशन एक्सपोज़र (Google Play लिस्टिंग से)',
    permExposureTitleHi: 'Permission exposure (from the Google Play listing)',
    noPlayPerms: 'Play Store लिस्टिंग पर कोई संवेदनशील परमिशन घोषित नहीं है।',
    grievanceTitle: 'शिकायत किससे करें (शिकायत निवारण अधिकारी)',
    grievanceTitleHi: 'Who to complain to (Grievance Redressal Officer)',
    grievanceOfficer: 'अधिकारी',
    grievanceEmail: 'ईमेल',
    grievancePhone: 'फ़ोन',
    grievanceMobile: 'मोबाइल',
    grievanceNote: 'संपर्क विवरण लेंडर द्वारा RBI डायरेक्टरी में प्रकाशित किए गए हैं।',
    grievanceNoteHi: 'Contact details are published by the lender in the RBI directory.',
    kachuSays: 'कछु कहता है:',
    asOfChecked: (date) => `हमारी जाँच के अनुसार, तारीख: ${date}`,
    sourceLabel: (src) => `डेटा स्रोत: ${src === 'live' ? 'लाइव Google Play' : 'सहेजी गई कॉपी'}`,
    scoreBreakdownTitle: 'स्कोर विवरण',
    permissionsScore: 'परमिशन',
    registrationScore: 'RBI रजिस्ट्रेशन',
    transparencyScore: 'पारदर्शिता और शुल्क',
    totalWarningScore: 'कुल चेतावनी अंक',
    whyThisResult: 'यह परिणाम क्यों आया',
    whyThisResultSub: 'Google Play लिस्टिंग और RBI डायरेक्टरी के साक्ष्य',
    confidenceTitle: 'विश्वसनीयता',
    confidence_high: 'उच्च',
    confidence_medium: 'मध्यम',
    confidence_low: 'कम',
    confidenceLowSub: 'कुछ डेटा नहीं पढ़ा जा सका',
    lookalikeWarning: 'RBI डायरेक्टरी में एक मिलता-जुलता नाम किसी अन्य ऐप के तहत है। लेंडर का आधिकारिक लिंक जाँचें।',
    realAppAssessment: 'वास्तविक ऐप मूल्यांकन',
    assessingPlay: 'Google Play लिस्टिंग और RBI डायरेक्टरी पढ़ी जा रही है…',
    rbiRecordTitle: 'RBI डायरेक्टरी रिकॉर्ड',
    rbiRecordTitleHi: 'RBI directory record',
    playUnavailableNote: 'अभी हम इस ऐप की जानकारी Google Play से नहीं पढ़ सके।',
    matchedSearchTo: (title, dev) => `हमने आपकी खोज का मिलान Google Play पर ${dev} के ${title} से किया है। क्या यह सही ऐप नहीं है? ऊपर इसका Google Play लिंक पेस्ट करें।`,
    assessErrors: {
      NEEDS_LINK: 'हम Google Play पर इस नाम से ऐप नहीं ढूंढ सके। ऐप का Google Play लिंक (play.google.com/store/apps/details?id=...) या ऐप ID पेस्ट करें।',
      PLAY_UNAVAILABLE: 'अभी हम इस ऐप की जानकारी Google Play से नहीं पढ़ सके। लिंक की जांच करें या पुनः प्रयास करें।',
    },
    notLendingBanner: 'यह लोन देने वाला ऐप नहीं लगता, इसलिए RBI पंजीकरण और लोन-फीस की जाँच लागू नहीं हो सकती।',
    navChecker: 'ऐप जांचें',
    navTrusted: 'भरोसेमंद ऐप',
    navCompare: 'तुलना करें',
    navCalc: 'लोन कैलकुलेटर',
    compareHeroTag: 'आमने-सामने तुलना',
    compareTitle: 'दो ऐप्स की तुलना करें',
    compareSubtitle: 'RBI पंजीकरण, मांगी गई परमिशन, जोखिम अंक और शिकायत अधिकारियों की आमने-सामने तुलना करें।',
    compareApp1Label: 'ऐप 1',
    compareApp2Label: 'ऐप 2',
    comparePlaceholder: 'ऐप का नाम, Play लिंक या ऐप ID',
    compareBtn: 'तुलना करें',
    comparing: 'तुलना हो रही है…',
    compareWithAnother: 'अन्य ऐप से तुलना करें',
    viewFullResult: 'पूरा परिणाम देखें',
    fewerRiskPoints: 'कम जोखिम अंक',
    compareNote: 'यह सार्वजनिक जानकारी की तुलना करता है और केवल एक प्राथमिक जांच है, कोई अंतिम निर्णय नहीं। RBI सूची और लेंडर से पुष्टि अवश्य करें।',
    rbiStatusMap: {
      id: 'Play ID द्वारा सूचीबद्ध',
      name: 'केवल नाम से सूचीबद्ध',
      lookalike: 'मिलता-जुलता नाम (RBI डायरेक्टरी में अलग ऐप)',
      none: 'RBI डायरेक्टरी में नहीं मिला',
    },
    rowAppIdentity: 'ऐप विवरण',
    rowAssessment: 'मूल्यांकन और जोखिम अंक',
    rowScoreBreakdown: 'स्कोर विवरण',
    rowRbiStatus: 'RBI डायरेक्टरी स्थिति',
    rowPermissions: 'घोषित परमिशन',
    rowRatings: 'रेटिंग और समीक्षाएं',
    rowSignals: 'प्रमुख संकेत',
    rowGrievance: 'शिकायत निवारण अधिकारी',
    noDeclaredPermissions: 'Google Play लिस्टिंग पर कोई संवेदनशील परमिशन घोषित नहीं है।',
    noGrievanceContact: 'RBI डायरेक्टरी में कोई शिकायत संपर्क प्रकाशित नहीं है।',
    andMoreContacts: (n) => `तथा ${n} अन्य`,
    enterBothAppsPrompt: 'तुलना करने के लिए कृपया दोनों ऐप के नाम या लिंक दर्ज करें।',
    checkAnother: '← दूसरा ऐप जांचें',
    checkingApp: (q) => `${q} की जाँच हो रही है…`,
    exploreTrusted: 'भरोसेमंद लोन ऐप देखें',
    trustedHeading: 'भरोसेमंद ऐप — RBI में सूचीबद्ध और उपयोगकर्ताओं द्वारा अच्छी रेटिंग',
    trustedSubtext: 'RBI में पंजीकृत और Google Play पर अच्छी रेटिंग प्राप्त। यह विश्वास का संकेत है, गारंटी नहीं। हमेशा नियम और शर्तें पढ़ें।',
    trustedHeroTag: 'सत्यापित डायरेक्टरी और स्टोर रेटिंग',
    trustedSearchPlaceholder: 'भरोसेमंद ऐप या लेंडर खोजें…',
    filterAll: 'सभी',
    filterHigh: 'बहुत अच्छी रेटिंग',
    filterWell: 'अच्छी रेटिंग',
    sortLabel: 'क्रमबद्ध करें',
    sortBest: 'सर्वश्रेष्ठ ट्रस्ट स्कोर',
    sortRating: 'उच्चतम रेटिंग',
    sortReviews: 'सर्वाधिक समीक्षाएं',
    showingApps: (shown, total) => `कुल ${total} में से ${shown} ऐप दिखाए जा रहे हैं`,
    ratingsFetchedOn: (date) => `रेटिंग प्राप्त करने की तिथि: ${date}`,
    trustedNotBuilt: 'भरोसेमंद सूची अभी तैयार नहीं है।',
    notFoundTrusted: 'कोई मेल खाने वाला भरोसेमंद ऐप नहीं मिला।',
    lenderLabel: 'लेंडर',
    trustLabel: 'ट्रस्ट',
    trustScoreDesc: 'रेटिंग और समीक्षा संख्या पर आधारित स्कोर',
    tierHigh: 'बहुत अच्छी रेटिंग',
    tierWell: 'अच्छी रेटिंग',
    rbiSignal: 'RBI डायरेक्टरी: सूचीबद्ध',
    rbiListedPill: 'RBI सूचीबद्ध',
    playSignalPrefix: 'Google Play',
    playSignalFrom: 'कुल',
    ratingsSuffix: 'रेटिंग से',
    viewOnPlay: 'Google Play पर देखें',
    checkAppHint: 'परमिशन और शिकायत अधिकारी देखने के लिए क्लिक करें',
    verdictLabel: {
      safe: 'सुरक्षित ऐप',
      review: 'सावधानी बरतें',
      risky: 'खतरनाक — इंस्टॉल न करें',
      listed: 'डायरेक्टरी में सूचीबद्ध',
      unverified: 'डायरेक्टरी में नहीं मिला',
    },
    riskLabel: {
      safe: 'अत्यधिक सुरक्षित',
      review: 'मध्यम जोखिम',
      risky: 'अत्यंत खतरनाक',
    },
    heroTag: 'नागरिक सुरक्षा इंजन',
    calcTitle: 'लोन की असली लागत कैलकुलेटर',
    calcSubtitle: 'फीस और जीएसटी सहित जानें कि आप वास्तव में कितना वापस चुकाएंगे।',
    calcRealCostLink: 'इस लोन की असली लागत की गणना करें',
    calcLoanAmount: 'लोन राशि (₹)',
    calcInterestRate: 'ब्याज दर',
    calcTenure: 'लोन की अवधि',
    calcProcessingFee: 'प्रोसेसिंग फीस',
    calcGstOnFee: 'प्रोसेसिंग फीस पर GST (%)',
    calcOtherCharges: 'अन्य अग्रिम शुल्क (₹)',
    calcReset: 'रीसेट करें',
    calcRateUnitDay: '% प्रति दिन',
    calcRateUnitMonth: '% प्रति माह',
    calcRateUnitYear: '% प्रति वर्ष',
    calcTenureUnitDays: 'दिन',
    calcTenureUnitMonths: 'महीने',
    calcFeeTypeFlat: '₹',
    calcFeeTypePercent: '% लोन का',
    calcPromptEmpty: 'लागत देखने के लिए ऊपर दिए गए विवरण भरें',
    calcChargesExceed: 'शुल्क लोन राशि से अधिक हैं। कृपया दर्ज संख्याएं जांचें।',
    calcYouReceive: 'आपको वास्तव में मिलेगा',
    calcYouRepay: 'आप कुल वापस चुकाएंगे',
    calcExtraPaid: 'अतिरिक्त भुगतान',
    calcApproxYearlyCost: 'अनुमानित वार्षिक लागत',
    calcApproxTag: 'अनुमानित',
    calcLegendReceive: 'आपको प्राप्त राशि',
    calcLegendUpfront: 'फीस + GST + अन्य शुल्क',
    calcLegendInterest: 'ब्याज',
    calcEstimateNote: "यह आपके द्वारा दर्ज की गई संख्याओं (साधारण ब्याज, अंत में एकमुश्त भुगतान) पर आधारित एक अनुमान है। सटीक आंकड़ों के लिए लेंडर का Key Fact Statement देखें।",
  },
};

const FLAG_ICONS = { good: '✔', warn: '!', bad: '✖' };
const VERDICT_ICONS = { safe: '🛡️', review: '⚠️', risky: '⛔', listed: '📋', unverified: 'ℹ️' };

// Format rating counts: 1,20,000 -> 1.2L, 1,500,000 -> 15L, 5000 -> 5K
function formatRatings(num) {
  if (!num || num < 0) return '0';
  const n = Number(num);
  if (n >= 10000000) {
    const cr = n / 10000000;
    return (cr % 1 === 0 ? cr : cr.toFixed(1)) + 'Cr';
  }
  if (n >= 100000) {
    const l = n / 100000;
    return (l % 1 === 0 ? l : l.toFixed(1)) + 'L';
  }
  if (n >= 1000) {
    const k = n / 1000;
    return (k % 1 === 0 ? k : k.toFixed(1)) + 'K';
  }
  return String(n);
}

function formatDate(dateStr, lang) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
}

// Maps verdict string → severity key for styling
function verdictClass(verdict) {
  const v = (verdict || '').toLowerCase();
  if (v === 'safe')       return 'safe';
  if (v === 'review')     return 'review';
  if (v === 'risky')      return 'risky';
  if (v === 'listed')     return 'listed';
  if (v === 'unverified') return 'unverified';
  return 'unverified';
}

function speak(text, lang) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  window.speechSynthesis.speak(u);
}

// Helper to format uppercase lender names to Title Case
function toNormalCase(str) {
  if (!str) return '';
  const s = String(str).trim();
  if (s === s.toUpperCase()) {
    return s
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
      .replace(/\b(rbi|nbfc|dla|pvt|ltd|upi|gst)\b/gi, m => m.toUpperCase())
      .replace(/\((india)\)/gi, '(India)');
  }
  return s;
}

// ── Result Shield Icon with subtle glow and Lucide shield ────────────────────
function ResultShieldIcon({ level = 'proceed', className = '' }) {
  if (level === 'proceed' || level === 'ok' || level === 'safe') {
    return <ShieldCheck className={`hero-shield-lucide status-${level} ${className}`} size={36} strokeWidth={2.2} />;
  }
  if (level === 'pause' || level === 'warn' || level === 'review' || level === 'unverified') {
    return <ShieldAlert className={`hero-shield-lucide status-${level} ${className}`} size={36} strokeWidth={2.2} />;
  }
  if (level === 'stop' || level === 'risky' || level === 'danger') {
    return <ShieldX className={`hero-shield-lucide status-${level} ${className}`} size={36} strokeWidth={2.2} />;
  }
  return <Shield className={`hero-shield-lucide status-${level} ${className}`} size={36} strokeWidth={2.2} />;
}

// ── Quick-Action Buttons Row (Share, Help and Report, Calculate Real Cost, Compare) ──
function QuickActionsRow({ lang, t, appName, onOpenCalculator, onOpenCompare }) {
  const [copied, setCopied] = useState(false);

  function handleShare(e) {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: appName ? `${appName} - Karz Kavach` : 'Karz Kavach',
        text: `${appName || 'App'} safety report on Karz Kavach`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

  function handleHelpAndReport(e) {
    e.preventDefault();
    const el = document.getElementById('grievance-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="quick-actions-row">
      <button
        type="button"
        className="quick-action-btn qa-share"
        onClick={handleShare}
        title={lang === 'hi' ? 'शेयर करें' : 'Share'}
      >
        <Share2 size={18} strokeWidth={2} className="qa-icon" />
        <span className="qa-label">{copied ? (lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (lang === 'hi' ? 'शेयर' : 'Share')}</span>
      </button>

      <button
        type="button"
        className="quick-action-btn qa-report"
        onClick={handleHelpAndReport}
        title={lang === 'hi' ? 'मदद और शिकायत' : 'Help & Report'}
      >
        <LifeBuoy size={18} strokeWidth={2} className="qa-icon" />
        <span className="qa-label">{lang === 'hi' ? 'मदद व शिकायत' : 'Help & Report'}</span>
      </button>

      <button
        type="button"
        className="quick-action-btn qa-calc"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenCalculator) onOpenCalculator();
        }}
        title={t.calcRealCostLink}
      >
        <Calculator size={18} strokeWidth={2} className="qa-icon" />
        <span className="qa-label">{lang === 'hi' ? 'असली लागत' : 'Real Cost'}</span>
      </button>

      <button
        type="button"
        className="quick-action-btn qa-compare"
        onClick={(e) => {
          e.preventDefault();
          if (onOpenCompare) onOpenCompare(appName || '');
        }}
        title={t.compareWithAnother}
      >
        <Scale size={18} strokeWidth={2} className="qa-icon" />
        <span className="qa-label">{lang === 'hi' ? 'तुलना करें' : 'Compare'}</span>
      </button>
    </div>
  );
}

// ── Circular Animated Score Ring ──────────────────────────────────────────────
function AnimatedScoreRing({ score = 0, max = 100, label = 'Total Threat Assessment' }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = Math.min(Math.max(Number(score) || 0, 0), max);
    let startTimestamp = null;
    const duration = 800;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const rawProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setDisplayScore(Math.round(eased * target));
      setProgress(eased * (target / max));

      if (rawProgress < 1) {
        requestAnimationFrame(step);
      }
    }

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [score, max]);

  const R = 38;
  const strokeWidth = 7;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - progress);

  return (
    <div className="hero-score-ring-wrap" title={`${score}/${max} ${label}`}>
      <div className="hero-score-ring-svg-box">
        <svg viewBox="0 0 92 92" className="hero-score-ring-svg">
          <circle
            cx="46"
            cy="46"
            r={R}
            fill="none"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="46"
            cy="46"
            r={R}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 46 46)"
            style={{ transition: 'stroke-dashoffset 0.08s linear' }}
          />
        </svg>
        <div className="hero-score-ring-center">
          <span className="hero-ring-num">{displayScore}</span>
          <span className="hero-ring-slash">/{max}</span>
        </div>
      </div>
      {label && <div className="hero-score-ring-label">{label}</div>}
    </div>
  );
}

// ── Score bar (thinner 8px with bucket status color) ─────────────────────────
function ScoreBar({ label, value, max, level }) {
  const maxVal = max || 40;
  const pct = Math.min(100, Math.round(((value || 0) / maxVal) * 100));
  let bucket = 'low';
  if (level) {
    const l = String(level).toLowerCase();
    if (l === 'high' || l === 'danger' || l === 'bad' || l === 'stop') bucket = 'high';
    else if (l === 'medium' || l === 'warn' || l === 'pause') bucket = 'medium';
    else bucket = 'low';
  } else {
    const ratio = (value || 0) / maxVal;
    if (ratio >= 0.5) bucket = 'high';
    else if (ratio > 0) bucket = 'medium';
    else bucket = 'low';
  }
  return (
    <div className={`bar-row bar-${bucket}`}>
      <div className="bar-header">
        <span className="bar-label">{label}</span>
        <span className="bar-score">{value ?? 0} / {maxVal}</span>
      </div>
      <div className="bar-track">
        <div className={`bar-fill bar-fill-${bucket}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Full result (SAFE / REVIEW / RISKY) for Demo Apps ──────────────────────────
function FullResult({ r, lang, t, onOpenCalculator, onOpenCompare }) {
  const vClass = verdictClass(r.verdict);
  const [iconError, setIconError] = useState(false);

  // Verdict hero label from our own UI dict
  const heroLabel = t.verdictLabel[vClass] || (r.verdictLabel && r.verdictLabel[lang]) || r.verdict;
  const riskText  = t.riskLabel[vClass] || '';

  const speechText = [
    r.verdictLabel?.[lang] || heroLabel,
    ...(r.flags || []).filter(f => f.severity !== 'good').map(f => f[lang]),
  ].join('. ');

  const appTitle = r.app?.name || r.name;
  const lender = toNormalCase(r.app?.claimedLender);

  return (
    <div className={`result-grid-layout full-result-flow level-${vClass}`}>
      {/* ── Left Column: Hero card, quick actions, score breakdown ── */}
      <div className="result-col-left">
        {/* 1. Hero card */}
        <div className={`result-card result-hero-card hero-gradient status-${vClass}`}>
          <div className="hero-top-row">
            <div className="hero-app-identity">
              <div className="hero-app-icon-box">
                {!iconError && r.app?.icon ? (
                  <img
                    src={r.app.icon}
                    alt={appTitle || 'App icon'}
                    className="hero-app-icon"
                    onError={() => setIconError(true)}
                  />
                ) : (
                  <div className="hero-app-icon-fallback" aria-label="App icon fallback">
                    <Smartphone size={28} strokeWidth={2} />
                  </div>
                )}
              </div>
              <div className="hero-app-titles">
                <h1 className="hero-app-title">{appTitle}</h1>
                {lender && (
                  <div className="hero-app-lender">
                    <span className="hero-lender-label">{lang === 'hi' ? t.claims : t.claims}:</span>{' '}
                    <span className="hero-lender-val">{lender}</span>
                  </div>
                )}
                {r.app?.developer && (
                  <div className="hero-app-developer">
                    <span className="hero-dev-label">{t.developer}:</span> {r.app.developer}
                  </div>
                )}
              </div>
            </div>
            <div className="hero-kachu-mascot-wrap" title="Kachu (Karz Kavach Mascot)">
              <img src="/karz-kavach-shield.png" alt="Kachu" className="hero-kachu-mascot" />
            </div>
          </div>

          {/* Verdict hero: Shield icon + Result label pill + Risk score ring */}
          <div className="hero-verdict-section">
            <div className="hero-verdict-main">
              <div className={`hero-shield-wrap status-${vClass}`}>
                <ResultShieldIcon level={vClass === 'safe' ? 'proceed' : vClass === 'review' ? 'pause' : 'stop'} />
              </div>
              <div className="hero-verdict-labels">
                <div className={`hero-verdict-pill status-${vClass}`}>
                  <span className="verdict-pill-text">{heroLabel}</span>
                </div>
                {riskText && <div className="hero-verdict-sub">{riskText}</div>}
              </div>
            </div>

            {r.score && (
              <AnimatedScoreRing
                score={r.score.total ?? 0}
                max={100}
                label={t.totalWarningScore}
              />
            )}
          </div>

          {/* Meta footer with Listen button */}
          <div className="hero-translucent-strip">
            <div className="hero-translucent-left">
              <span style={{ fontSize: 13, opacity: 0.9 }}>{t.scoreLabel || t.score}</span>
            </div>
            <div className="hero-translucent-right">
              <button
                className="hero-translucent-listen-btn"
                onClick={() => speak(speechText, lang)}
                type="button"
                title={t.listen}
              >
                <Volume2 size={15} strokeWidth={2} />
                <span>{t.listen}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Quick-action buttons */}
        <QuickActionsRow
          lang={lang}
          t={t}
          appName={appTitle}
          onOpenCalculator={onOpenCalculator}
          onOpenCompare={onOpenCompare}
        />

        {/* 2. Score breakdown */}
        {r.score && (
          <div className="result-card score-bars-card">
            <div className="section-title">
              <BarChart3 size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.scoreBreakdownTitle}</span>
            </div>
            <div className="bars-section">
              <ScoreBar
                label={t.permissionsScore || t.permission}
                value={r.score.permission}
                max={r.score.max?.permission || 40}
                level={r.score.permission >= 20 ? 'high' : r.score.permission > 0 ? 'medium' : 'low'}
              />
              <ScoreBar
                label={t.registrationScore || t.registration}
                value={r.score.registration}
                max={r.score.max?.registration || 40}
                level={r.score.registration >= 25 ? 'high' : r.score.registration > 0 ? 'medium' : 'low'}
              />
              <ScoreBar
                label={t.transparencyScore || t.transparency}
                value={r.score.transparency}
                max={r.score.max?.transparency || 20}
                level={r.score.transparency >= 10 ? 'high' : r.score.transparency > 0 ? 'medium' : 'low'}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Right Column: Timeline, permissions, next steps ── */}
      <div className="result-col-right">
        {/* 3. "Why this result" as a vertical timeline */}
        {r.flags && r.flags.length > 0 && (
          <div className="result-card timeline-card">
            <div className="section-title">
              <Search size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.whyThisResult || t.findings}</span>
              <span className="section-title-sub">({t.findingsHi})</span>
            </div>
            <div className="timeline-container">
              <div className="timeline-line" aria-hidden="true" />
              <div className="timeline-list">
                {r.flags.map((f, i) => {
                  const isGood = f.severity === 'good';
                  const status = isGood ? 'ok' : f.severity === 'danger' || f.severity === 'warn' ? 'warn' : 'info';
                  return (
                    <div key={f.code || i} className={`timeline-entry status-${status}`}>
                      <div className={`timeline-dot status-${status}`} aria-hidden="true">
                        {isGood ? <Check size={13} strokeWidth={2.5} /> : <AlertTriangle size={13} strokeWidth={2.5} />}
                      </div>
                      <div className="timeline-card-content">
                        <div className="timeline-card-top">
                          <span className="timeline-source-chip">RBI DIRECTORY</span>
                        </div>
                        <p className="timeline-text">{f[lang]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Permissions */}
        {r.permissions && (
          <div className="result-card">
            <div className="section-title">
              <Lock size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.canDo}</span>
              <span className="section-title-sub">({t.canDoHi})</span>
            </div>
            {r.permissions.length === 0 ? (
              <p className="no-perms-text">{t.noPerms}</p>
            ) : (
              <ul className="perms">
                {r.permissions.map(p => (
                  <li key={p.permission} className="perm-item">
                    <span className="perm-code">{p.permission}</span>
                    <span>{p[lang]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Next steps */}
        {r.nextSteps?.[lang] && (
          <div className="result-card">
            <div className="section-title">
              <Zap size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.nextSteps}</span>
              <span className="section-title-sub">({t.nextStepsHi})</span>
            </div>
            <ol className="steps">
              {r.nextSteps[lang].map((s, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Grievance Redressal Box (Shared Component) ────────────────────────────────
function GrievanceBox({ grievance, t, showNote = true }) {
  if (!grievance || (!grievance.name && !grievance.email && !grievance.phone && !grievance.mobile)) {
    return null;
  }
  return (
    <div className="dir-grievance-box">
      <div className="dir-grievance-title">
        <ShieldCheck size={18} strokeWidth={2} className="section-title-icon" />
        <span>{t.grievanceTitle}</span>
        <span className="dir-grievance-title-sub">({t.grievanceTitleHi})</span>
      </div>
      <div className="dir-grievance-content">
        {grievance.name && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceOfficer}:</span>
            <span className="dir-grievance-val">{grievance.name}</span>
          </div>
        )}
        {grievance.email && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceEmail}:</span>
            {grievance.email.includes('@') ? (
              grievance.email.includes(' ') ? (
                <span className="dir-grievance-val">
                  {grievance.email.split(/\s+/).map((em, eIdx) => {
                    const clean = em.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
                    return em.includes('@') ? (
                      <a key={eIdx} className="dir-grievance-link" href={`mailto:${clean}`}>
                        {em}{' '}
                      </a>
                    ) : (
                      <span key={eIdx}>{em} </span>
                    );
                  })}
                </span>
              ) : (
                <a className="dir-grievance-link" href={`mailto:${grievance.email.trim()}`}>
                  {grievance.email}
                </a>
              )
            ) : (
              <span className="dir-grievance-val">{grievance.email}</span>
            )}
          </div>
        )}
        {grievance.phone && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievancePhone}:</span>
            <a className="dir-grievance-link" href={`tel:${String(grievance.phone).replace(/\s+/g, '')}`}>
              {grievance.phone}
            </a>
          </div>
        )}
        {grievance.mobile && (
          <div className="dir-grievance-row">
            <span className="dir-grievance-label">{t.grievanceMobile}:</span>
            <a className="dir-grievance-link" href={`tel:${String(grievance.mobile).replace(/\s+/g, '')}`}>
              {grievance.mobile}
            </a>
          </div>
        )}
      </div>
      {showNote && (
        <div className="dir-grievance-note">
          <Info size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
          <span>{t.grievanceNote}</span>
        </div>
      )}
    </div>
  );
}

// ── Directory-only result (LISTED / UNVERIFIED) ────────────────────────────────
function cleanSpeech(text) {
  if (!text) return '';
  return text
    .replace(/We did not check this app's permissions\.?/gi, '')
    .replace(/Permissions were not checked for this app \(directory lookup only\)\.?/gi, '')
    .replace(/permissions were not checked\.?/gi, '')
    .replace(/हमने इस ऐप की परमिशन की जाँच नहीं की।?/g, '')
    .replace(/इस ऐप की परमिशन की जाँच नहीं की गई है \(केवल डायरेक्टरी लुकअप\)।?/g, '')
    .trim();
}

function DirResult({ r, playUnavailable = false, lang, t, onSearch, onOpenCalculator, onOpenCompare }) {
  const isListed = r.verdict === 'LISTED';
  const vClass = isListed ? 'listed' : 'unverified';
  const verdictText = r.verdictLabel?.[lang] || (isListed ? t.verdictLabel.listed : t.verdictLabel.unverified);
  const appTitle = r.matches?.[0]?.appName || r.query;
  const rawLender = r.matches?.[0]?.lender;
  const lender = toNormalCase(rawLender);

  const speechText = [
    verdictText,
    ...(r.matches || []).map(m => `${m.appName}. ${m.lender}`),
    ...(r.flags || []).map(f => cleanSpeech(f[lang])),
    ...(r.permissionReport?.available
      ? [
          r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en,
          ...(r.permissionReport.permissions || []).map(p => p[lang] || p.en),
          r.permissionReport.note?.[lang] || r.permissionReport.note?.en,
        ]
      : []),
    ...(r.nextSteps?.[lang] || []),
  ].map(cleanSpeech).filter(Boolean).join('. ');

  return (
    <div className={`result-grid-layout dir-result-flow level-${vClass}`}>
      {/* ── Left Column: Hero card, quick actions, permission exposure ── */}
      <div className="result-col-left">
        {/* 1. Hero card at top */}
        <div className={`result-card result-hero-card hero-gradient status-${vClass}`}>
          <div className="hero-top-row">
            <div className="hero-app-identity">
              <div className="hero-app-icon-box">
                <div className="hero-app-icon-fallback" aria-label="Directory record">
                  <ShieldCheck size={28} strokeWidth={2} />
                </div>
              </div>
              <div className="hero-app-titles">
                <h1 className="hero-app-title">{appTitle}</h1>
                {lender && (
                  <div className="hero-app-lender">
                    <span className="hero-lender-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>{' '}
                    <span className="hero-lender-val">{lender}</span>
                  </div>
                )}
                <div className="hero-dir-lookup-tag">
                  {lang === 'hi' ? 'डायरेक्टरी लुकअप' : 'Directory Lookup'}
                </div>
              </div>
            </div>
            <div className="hero-kachu-mascot-wrap" title="Kachu (Karz Kavach Mascot)">
              <img src="/karz-kavach-shield.png" alt="Kachu" className="hero-kachu-mascot" />
            </div>
          </div>

          {/* Verdict Section: Shield Icon + Large Result Pill */}
          <div className="hero-verdict-section">
            <div className="hero-verdict-main">
              <div className={`hero-shield-wrap status-${vClass}`}>
                <ResultShieldIcon level={isListed ? 'info' : 'warn'} />
              </div>
              <div className="hero-verdict-labels">
                <div className={`hero-verdict-pill ${isListed ? 'status-info' : 'status-warn'}`}>
                  <span className="verdict-pill-text">{verdictText}</span>
                </div>
              </div>
            </div>

            {r.permissionReport?.available && r.permissionReport?.score != null && (
              <AnimatedScoreRing
                score={r.permissionReport.score}
                max={r.permissionReport.max || 40}
                label={t.permission || 'Permissions'}
              />
            )}
          </div>

          {/* Listen Audio button in translucent strip */}
          <div className="hero-translucent-strip">
            <div className="hero-translucent-left">
              <span style={{ fontSize: 13, opacity: 0.9 }}>
                {isListed ? (lang === 'hi' ? 'RBI सूची में शामिल' : 'Verified in RBI list') : (lang === 'hi' ? 'सूची में नहीं मिला' : 'Not found in RBI list')}
              </span>
            </div>
            <div className="hero-translucent-right">
              <button
                className="hero-translucent-listen-btn"
                onClick={() => speak(speechText, lang)}
                title={t.listen}
                type="button"
              >
                <Volume2 size={15} strokeWidth={2} />
                <span>{t.listen}</span>
              </button>
            </div>
          </div>

          {/* Small note when Play store reading failed or app has no Play ID */}
          {playUnavailable && (
            <div className="dir-play-unavailable-note">
              <Info size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                {typeof playUnavailable === 'object'
                  ? ((lang === 'hi' && t.assessErrors?.[playUnavailable.error]) || playUnavailable.message || t.playUnavailableNote)
                  : (typeof playUnavailable === 'string' ? playUnavailable : t.playUnavailableNote)
                }
              </span>
            </div>
          )}
        </div>

        {/* 4. Quick actions row */}
        <QuickActionsRow
          lang={lang}
          t={t}
          appName={appTitle}
          onOpenCalculator={onOpenCalculator}
          onOpenCompare={onOpenCompare}
        />

        {/* 2. Score bars / Permission exposure card */}
        {r.permissionReport && r.permissionReport.available ? (
          <div className="result-card score-bars-card">
            <div className="section-title">
              <Lock size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.permExposureTitle}</span>
              <span className="section-title-sub">({t.permExposureTitleHi})</span>
            </div>

            <ScoreBar
              label={r.permissionReport.levelLabel?.[lang] || r.permissionReport.levelLabel?.en || r.permissionReport.level}
              value={r.permissionReport.score ?? 0}
              max={r.permissionReport.max || 40}
              level={r.permissionReport.level}
            />

            {(!r.permissionReport.permissions || r.permissionReport.permissions.length === 0) ? (
              <p className="no-perms-text">{t.noPlayPerms}</p>
            ) : (
              <ul className="perms">
                {r.permissionReport.permissions.map(p => (
                  <li key={p.permission} className="perm-item">
                    <span className="perm-code">{p.permission}</span>
                    <span>{p[lang] || p.en || p.permission}</span>
                  </li>
                ))}
              </ul>
            )}

            {r.permissionReport.note && (
              <p className="perm-report-note">
                {r.permissionReport.note[lang] || r.permissionReport.note.en || (typeof r.permissionReport.note === 'string' ? r.permissionReport.note : '')}
              </p>
            )}
          </div>
        ) : (
          <div className="dir-note-box">
            <Info size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{t.dirNote}</span>
          </div>
        )}
      </div>

      {/* ── Right Column: Timeline, Grievance contacts, Suggestions ── */}
      <div className="result-col-right">
        {/* 3. "Why this result" as a vertical timeline */}
        {r.flags && r.flags.length > 0 && (
          <div className="result-card timeline-card">
            <div className="section-title">
              <Search size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.whyThisResult || t.findings}</span>
              <span className="section-title-sub">({t.findingsHi})</span>
            </div>
            <div className="timeline-container">
              <div className="timeline-line" aria-hidden="true" />
              <div className="timeline-list">
                {r.flags.map((f, i) => {
                  const isGood = f.severity === 'good';
                  const status = isGood ? 'ok' : 'warn';
                  return (
                    <div key={f.code || i} className={`timeline-entry status-${status}`}>
                      <div className={`timeline-dot status-${status}`} aria-hidden="true">
                        {isGood ? <Check size={13} strokeWidth={2.5} /> : <AlertTriangle size={13} strokeWidth={2.5} />}
                      </div>
                      <div className="timeline-card-content">
                        <div className="timeline-card-top">
                          <span className="timeline-source-chip">RBI DIRECTORY</span>
                        </div>
                        <p className="timeline-text">{f[lang]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. Grievance contacts in their own card */}
        {r.matches && r.matches.length > 0 && (
          <div className="result-card assess-dir-record-card" id="grievance-section">
            <div className="section-title">
              <ShieldCheck size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.grievanceTitle}</span>
              <span className="section-title-sub">({t.grievanceTitleHi})</span>
            </div>
            <div className="assess-dir-record-list">
              {r.matches.map((m, i) => (
                <div key={i} className="assess-record-block">
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.matchedEntryHi : t.matchedEntry}:</span>
                    <span className="assess-dir-val">{m.appName}</span>
                  </div>
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>
                    <span className="assess-dir-lender">{toNormalCase(m.lender)}</span>
                  </div>
                  {m.grievance && (
                    <GrievanceBox grievance={m.grievance} t={t} showNote={false} />
                  )}
                </div>
              ))}
            </div>
            <div className="dir-grievance-note">
              <Info size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              <span>{t.grievanceNote}</span>
            </div>
          </div>
        )}

        {/* "Did you mean" suggestion chips */}
        {r.similar && r.similar.filter(s => !s.toLowerCase().includes('demo')).length > 0 && (
          <div className="result-card">
            <div className="section-title" style={{ fontSize: 16 }}>
              <Lightbulb size={18} strokeWidth={2} className="section-title-icon" />
              <span>{lang === 'hi' ? t.didYouMeanHi : t.didYouMean}</span>
            </div>
            <div className="chips">
              {r.similar
                .filter(s => !s.toLowerCase().includes('demo'))
                .map((simName) => (
                  <button
                    key={simName}
                    type="button"
                    className="chip dir-chip"
                    onClick={() => onSearch(simName)}
                  >
                    {simName}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Next steps */}
        {r.nextSteps && r.nextSteps[lang] && (
          <div className="result-card">
            <div className="section-title">
              <Zap size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.nextSteps}</span>
              <span className="section-title-sub">({t.nextStepsHi})</span>
            </div>
            <ol className="steps">
              {r.nextSteps[lang].map((s, i) => (
                <li key={i} className="step-item">
                  <span className="step-num">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Real-App Assessment Result Card (Google Play & RBI Directory) ────────────
function RealAppCard({ data, lang, t, onOpenCalculator, onOpenCompare, directoryResult }) {
  if (!data) return null;
  const app = data.app || {};
  const level = data.level || 'proceed'; // 'proceed' | 'pause' | 'stop'
  const labelText = data.label?.[lang] || data.label?.en || '';
  const subtitleText = data.subtitle?.[lang] || data.subtitle?.en || '';
  const asOfFormatted = formatDate(data.asOf, lang);
  const [iconError, setIconError] = useState(false);

  const rawLender = data.directory?.lender || (data.directory?.records && data.directory.records[0]?.lender);
  const lender = toNormalCase(rawLender);

  // Speech narration
  const speechText = [
    labelText,
    subtitleText,
    ...(data.signals || []).filter(s => s.status === 'warn').map(s => s[lang] || s.en),
  ].filter(Boolean).join('. ');

  // Sort signals: warn signals first, then info, unknown, ok
  const sortedSignals = [...(data.signals || [])].sort((a, b) => {
    const rank = { warn: 0, info: 1, unknown: 2, ok: 3 };
    return (rank[a.status] ?? 4) - (rank[b.status] ?? 4);
  });

  return (
    <div className={`result-grid-layout real-app-flow level-${level}`}>
      {/* ── Left Column: Hero card, quick-action buttons, score breakdown ── */}
      <div className="result-col-left">
        {/* 1. Hero card at the top */}
        <div className={`result-card result-hero-card hero-gradient status-${level}`}>
          <div className="hero-top-row">
            <div className="hero-app-identity">
              <div className="hero-app-icon-box">
                {!iconError && app.icon ? (
                  <img
                    src={app.icon}
                    alt={app.title || 'App icon'}
                    className="hero-app-icon"
                    onError={() => setIconError(true)}
                  />
                ) : (
                  <div className="hero-app-icon-fallback" aria-label="App icon fallback">
                    <Smartphone size={28} strokeWidth={2} />
                  </div>
                )}
              </div>
              <div className="hero-app-titles">
                <h1 className="hero-app-title">{app.title || app.packageId}</h1>
                {lender && (
                  <div className="hero-app-lender">
                    <span className="hero-lender-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>{' '}
                    <span className="hero-lender-val">{lender}</span>
                  </div>
                )}
                {app.developer && (
                  <div className="hero-app-developer">
                    <span className="hero-dev-label">{t.developer}:</span> {app.developer}
                  </div>
                )}
              </div>
            </div>
            <div className="hero-kachu-mascot-wrap" title="Kachu (Karz Kavach Mascot)">
              <img src="/karz-kavach-shield.png" alt="Kachu" className="hero-kachu-mascot" />
            </div>
          </div>

          {data.resolvedFromSearch && (
            <div className="hero-resolved-search-line">
              {t.matchedSearchTo(data.resolvedFromSearch.title, data.resolvedFromSearch.developer)}
            </div>
          )}

          {/* Verdict section: Shield icon + Result label pill + Circular score ring */}
          <div className="hero-verdict-section">
            <div className="hero-verdict-main">
              <div className={`hero-shield-wrap status-${level}`}>
                <ResultShieldIcon level={level} />
              </div>
              <div className="hero-verdict-labels">
                <div className={`hero-verdict-pill status-${level}`}>
                  <span className="verdict-pill-text">{labelText}</span>
                </div>
                {subtitleText && (
                  <div className="hero-verdict-sub">{subtitleText}</div>
                )}
              </div>
            </div>

            {data.score && (
              <AnimatedScoreRing
                score={data.score.total ?? 0}
                max={100}
                label={t.totalWarningScore}
              />
            )}
          </div>

          {/* Bottom translucent strip: rating, installs, view on play, listen */}
          <div className="hero-translucent-strip">
            <div className="hero-translucent-left">
              {app.rating != null && (
                <span className="hero-translucent-star">
                  <Star size={13} strokeWidth={2} fill="currentColor" /> {Number(app.rating).toFixed(1)}
                </span>
              )}
              {app.ratings != null && (
                <span className="hero-translucent-ratings">
                  ({formatRatings(app.ratings)} {t.ratingsSuffix})
                </span>
              )}
              {app.installs && (
                <span className="hero-translucent-installs">
                  • <Download size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px' }} /> {app.installs}
                </span>
              )}
              {app.playUrl && (
                <a
                  href={app.playUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-translucent-play-link"
                  title="Google Play Store"
                >
                  <span>{t.viewOnPlay}</span>
                  <ExternalLink size={12} strokeWidth={2} />
                </a>
              )}
            </div>
            <div className="hero-translucent-right">
              <button
                className="hero-translucent-listen-btn"
                onClick={() => speak(speechText, lang)}
                type="button"
                title={t.listen}
              >
                <Volume2 size={15} strokeWidth={2} />
                <span>{t.listen}</span>
              </button>
            </div>
          </div>

          {/* Timestamp row */}
          <div className="hero-timestamp-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} strokeWidth={2} /> {t.asOfChecked(asOfFormatted)}
            </span>
            <span className="hero-dot-sep">•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Database size={12} strokeWidth={2} /> {t.sourceLabel(data.source)}
            </span>
          </div>

          {/* Non-lending banner when not a lending app */}
          {data.lending === false && (
            <div className="assess-non-lending-banner">
              <Info size={16} strokeWidth={2} className="non-lending-icon" />
              <span className="non-lending-text">{t.notLendingBanner}</span>
            </div>
          )}
        </div>

        {/* 4. Row of quick-action buttons under the hero card */}
        <QuickActionsRow
          lang={lang}
          t={t}
          appName={app.title || app.packageId || data.directory?.directoryName}
          onOpenCalculator={onOpenCalculator}
          onOpenCompare={onOpenCompare}
        />

        {/* 2. Directly below: The three score bars inside one card */}
        {data.score && (
          <div className="result-card score-bars-card">
            <div className="section-title">
              <BarChart3 size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.scoreBreakdownTitle}</span>
            </div>

            <div className="bars-section">
              <ScoreBar
                label={t.permissionsScore}
                value={data.score.permission ?? 0}
                max={data.score.max?.permission || 40}
                level={data.score.permission >= 20 ? 'high' : data.score.permission > 0 ? 'medium' : 'low'}
              />
              <ScoreBar
                label={t.registrationScore}
                value={data.score.registration ?? 0}
                max={data.score.max?.registration || 40}
                level={data.score.registration >= 25 ? 'high' : data.score.registration > 0 ? 'medium' : 'low'}
              />
              <ScoreBar
                label={t.transparencyScore}
                value={data.score.transparency ?? 0}
                max={data.score.max?.transparency || 20}
                level={data.score.transparency >= 10 ? 'high' : data.score.transparency > 0 ? 'medium' : 'low'}
              />
            </div>

            {/* Declared permissions details if available */}
            {data.permissionReport?.permissions && (
              <div className="assess-perms-detail">
                <div className="perms-detail-header">
                  <Lock size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                  {lang === 'hi' ? t.permExposureTitleHi : t.permExposureTitle}
                </div>
                <ul className="perms">
                  {data.permissionReport.permissions.map((p) => (
                    <li key={p.permission} className="perm-item">
                      <span className="perm-code">{p.permission}</span>
                      <span>{p[lang] || p.en || p.permission}</span>
                    </li>
                  ))}
                </ul>
                {data.permissionReport.note && (
                  <p className="perm-report-note">
                    {data.permissionReport.note[lang] || data.permissionReport.note.en || (typeof data.permissionReport.note === 'string' ? data.permissionReport.note : '')}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right Column: "Why this result" timeline and grievance contacts ── */}
      <div className="result-col-right">
        {/* 3. "Why this result" as a vertical timeline */}
        {sortedSignals.length > 0 && (
          <div className="result-card timeline-card">
            <div className="section-title">
              <Search size={20} strokeWidth={2} className="section-title-icon" />
              <span>{t.whyThisResult}</span>
              <span className="section-title-sub">({t.whyThisResultSub})</span>
            </div>

            <div className="timeline-container">
              <div className="timeline-line" aria-hidden="true" />
              <div className="timeline-list">
                {sortedSignals.map((sig, idx) => {
                  const status = sig.status || 'info';
                  const sourceText = (sig.source || 'Google Play').toUpperCase();
                  return (
                    <div key={sig.id || idx} className={`timeline-entry status-${status}`}>
                      <div className={`timeline-dot status-${status}`} aria-hidden="true">
                        {status === 'ok' && <Check size={13} strokeWidth={2.5} />}
                        {status === 'warn' && <AlertTriangle size={13} strokeWidth={2.5} />}
                        {status === 'info' && <Info size={13} strokeWidth={2.5} />}
                        {status === 'unknown' && <HelpCircle size={13} strokeWidth={2.5} />}
                      </div>
                      <div className="timeline-card-content">
                        <div className="timeline-card-top">
                          <span className="timeline-source-chip">{sourceText}</span>
                          {sig.points > 0 && (
                            <span className="timeline-points-tag">+{sig.points} {lang === 'hi' ? 'अंक' : 'pts'}</span>
                          )}
                        </div>
                        <p className="timeline-text">{sig[lang] || sig.en}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        {data.note && (
          <div className="result-card assess-note-card">
            <Info size={16} strokeWidth={2} className="note-icon" />
            <p className="note-text">{data.note[lang] || data.note.en}</p>
          </div>
        )}

        {/* Grievance contacts */}
        <RbiDirectoryRecord data={data} directoryResult={directoryResult} lang={lang} t={t} />
      </div>
    </div>
  );
}

// ── Compact RBI directory record section (Shown in right column) ─────────────
function RbiDirectoryRecord({ data, directoryResult, lang, t }) {
  if (!data) return null;
  const app = data.app || {};
  const dir = data.directory || {};
  const isLookalike = dir.match === 'lookalike';

  // 1. All directory records for this app from assess data
  let records = Array.isArray(dir.records) ? dir.records : [];

  // 2. If records is empty, fall back to directoryResult matches with grievance info
  if (records.length === 0 && !isLookalike && directoryResult?.matches?.length) {
    const fallbackMatches = directoryResult.matches.filter(
      (m) => m.grievance && (m.grievance.name || m.grievance.email || m.grievance.phone || m.grievance.mobile)
    );
    if (fallbackMatches.length > 0) {
      records = fallbackMatches.map((m) => ({
        appName: m.appName,
        lender: m.lender,
        grievance: m.grievance,
      }));
    }
  }

  // 3. If records is empty, check if dir itself has grievance
  if (records.length === 0 && dir.grievance) {
    records = [{
      appName: dir.directoryName || app.title,
      lender: dir.lender,
      grievance: dir.grievance,
    }];
  }

  // If records is empty, show nothing for this section (unless lookalike warning)
  if (records.length === 0 && !isLookalike) {
    return null;
  }

  return (
    <div className="result-card assess-dir-record-card" id="grievance-section">
      <div className="section-title">
        <ShieldCheck size={20} strokeWidth={2} className="section-title-icon" />
        <span>{t.grievanceTitle}</span>
        <span className="section-title-sub">({t.grievanceTitleHi})</span>
      </div>

      <div className="assess-dir-record-content">
        {isLookalike && (
          <div className="lookalike-box">
            <AlertTriangle size={18} strokeWidth={2} className="lookalike-icon" />
            <div className="lookalike-text">
              {t.lookalikeWarning}
            </div>
          </div>
        )}

        {records.length > 0 && (
          <div className="assess-dir-record-list">
            {records.map((rec, idx) => (
              <div key={idx} className="assess-record-block">
                {rec.lender && (
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.listedUnderHi : t.listedUnder}:</span>
                    <span className="assess-dir-lender">{toNormalCase(rec.lender)}</span>
                  </div>
                )}

                {rec.appName && rec.appName.toLowerCase() !== (app.title || '').toLowerCase() && (
                  <div className="assess-dir-field">
                    <span className="assess-dir-label">{lang === 'hi' ? t.matchedEntryHi : t.matchedEntry}:</span>
                    <span className="assess-dir-val">{rec.appName}</span>
                  </div>
                )}

                {rec.grievance && (
                  <GrievanceBox grievance={rec.grievance} t={t} showNote={false} />
                )}
              </div>
            ))}
          </div>
        )}

        {records.some((r) => r.grievance && (r.grievance.name || r.grievance.email || r.grievance.phone || r.grievance.mobile)) && (
          <div className="dir-grievance-note">
            <Info size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
            <span>{t.grievanceNote}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to detect Google Play links or package IDs
function isPlayInput(input) {
  const s = String(input || '').trim();
  if (!s) return false;
  if (/play\.google\.com/i.test(s)) return true;
  if (/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)+$/.test(s)) return true;
  return false;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]               = useState('en');
  const [view, setView]               = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.view) {
      return window.history.state.view;
    }
    return 'home';
  });
  const [name, setName]               = useState('');
  const [miniQuery, setMiniQuery]     = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [apps, setApps]               = useState([]);
  const [stats, setStats]             = useState(null);
  const [result, setResult]           = useState(null);
  const [assessResult, setAssessResult] = useState(null);
  const [playUnavailable, setPlayUnavailable] = useState(null);
  const [notFound, setNotFound]       = useState(null);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [showBanner, setShowBanner]   = useState(true);

  // Trusted apps state
  const [trustedData, setTrustedData] = useState(null);
  const [trustedLoading, setTrustedLoading] = useState(false);
  const [trustedError, setTrustedError] = useState('');
  const [trustedSearch, setTrustedSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState(''); // '' | 'high' | 'well'
  const [sortBy, setSortBy] = useState('best'); // 'best' | 'rating' | 'reviews'

  // Compare state
  const [compareApp1, setCompareApp1] = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.app1) {
      return window.history.state.app1;
    }
    return '';
  });
  const [compareApp2, setCompareApp2] = useState(() => {
    if (typeof window !== 'undefined' && window.history.state?.app2) {
      return window.history.state.app2;
    }
    return '';
  });

  const t = UI[lang];

  useEffect(() => {
    fetch('/api/apps')
      .then(res => res.json())
      .then(list => {
        // Hide demo apps from suggestions
        setApps(list.filter(a => !a.demo && !a.name?.toLowerCase().includes('demo')));
      })
      .catch(() => {});

    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  // History popstate listener for browser/phone Back and Forward buttons
  useEffect(() => {
    if (!window.history.state?.view) {
      window.history.replaceState({ view: 'home' }, '', window.location.pathname);
    }

    function handlePopState(e) {
      const nextView = e.state?.view || 'home';
      setView(nextView);
      if (nextView === 'result' && e.state?.query && e.state.query !== currentQuery) {
        runCheck(e.state.query, false);
      }
      if (nextView === 'compare') {
        if (e.state?.app1 != null) setCompareApp1(e.state.app1);
        if (e.state?.app2 != null) setCompareApp2(e.state.app2);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentQuery]);

  function openCompare(app1 = '', app2 = '') {
    setCompareApp1(app1);
    setCompareApp2(app2);
    navigateTo('compare', { app1, app2 });
  }

  // Debounce search in trusted apps
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(trustedSearch);
    }, 250);
    return () => clearTimeout(timer);
  }, [trustedSearch]);

  // Fetch trusted apps when view is 'trusted' or filters change
  useEffect(() => {
    if (view !== 'trusted') return;
    let cancelled = false;
    setTrustedLoading(true);
    setTrustedError('');

    const params = new URLSearchParams();
    if (selectedTier) params.set('tier', selectedTier);
    if (debouncedSearch.trim()) params.set('q', debouncedSearch.trim());
    params.set('limit', '100');

    fetch(`/api/trusted?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setTrustedData(data);
          setTrustedLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTrustedError(t.serverError);
          setTrustedLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [view, selectedTier, debouncedSearch]);

  function navigateTo(targetView, extraState = {}, forcePush = false) {
    if (targetView === view && !forcePush) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({ view: targetView, ...extraState }, '', window.location.pathname);
    setView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function returnToHomeAndFocus() {
    setName('');
    setMiniQuery('');
    setResult(null);
    setAssessResult(null);
    setPlayUnavailable(null);
    setNotFound(null);
    setError('');
    navigateTo('home');
    setTimeout(() => {
      document.getElementById('app-search-input')?.focus();
    }, 60);
  }

  async function runCheck(appName, pushHistory = true) {
    const query = String(appName || '').trim();
    if (!query) return;

    setCurrentQuery(query);
    setMiniQuery(query);
    setLoading(true);
    setError('');
    setResult(null);
    setAssessResult(null);
    setPlayUnavailable(null);
    setNotFound(null);

    if (pushHistory) {
      navigateTo('result', { query }, true);
    } else {
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 1. If it looks like a Google Play link or package ID, call /api/assess directly
    if (isPlayInput(query)) {
      try {
        const res = await fetch(`/api/assess?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setAssessResult(data);
        } else {
          setError(data.message || data.error || t.serverError);
        }
      } catch {
        setError(t.serverError);
      }
      setLoading(false);
      return;
    }

    // 2. Plain name search: call /api/assess and /api/check in parallel
    try {
      const [checkRes, assessRes] = await Promise.all([
        fetch(`/api/check?name=${encodeURIComponent(query)}`).catch(() => null),
        fetch(`/api/assess?input=${encodeURIComponent(query)}`).catch(() => null),
      ]);

      const checkData = checkRes ? await checkRes.json().catch(() => null) : null;
      const assessData = assessRes ? await assessRes.json().catch(() => null) : null;

      if (assessRes && assessRes.ok && assessData && !assessData.error) {
        // Assessment succeeded: show assessment card as main result
        setAssessResult(assessData);
        if (checkRes && checkRes.status === 200 && checkData) {
          setResult(checkData);
        } else {
          setResult(null);
        }
        setPlayUnavailable(null);
      } else {
        // Assessment failed (e.g. NEEDS_LINK, PLAY_UNAVAILABLE):
        // Fall back to existing directory result, and show server's message in small grey info note
        setAssessResult(null);
        const serverError = assessData || { message: t.playUnavailableNote };
        setPlayUnavailable(serverError);

        if (checkRes && checkRes.status === 200 && checkData) {
          setResult(checkData);
        } else if (checkRes && checkRes.status === 404 && checkData) {
          const suggestions = (checkData.suggestions || []).filter(s => !s.toLowerCase().includes('demo'));
          setNotFound(suggestions);
        } else {
          setError(assessData?.message || checkData?.error || t.serverError);
        }
      }
    } catch {
      setError(t.serverError);
    }
    setLoading(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (name.trim()) runCheck(name, true);
  }

  function onSelectTrustedApp(appName) {
    setName(appName);
    setMiniQuery(appName);
    runCheck(appName, true);
  }

  // Client-side sorting of loaded trusted items
  const sortedTrustedItems = [...(trustedData?.items || [])].sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating - a.rating) || (b.ratings - a.ratings);
    }
    if (sortBy === 'reviews') {
      return (b.ratings - a.ratings) || (b.rating - a.rating);
    }
    // default: 'best' (trustScore)
    return (b.trustScore - a.trustScore) || (b.ratings - a.ratings);
  });

  // Decide which result component to show
  // Shape A has result.score; Shape B has result.mode === 'directory_only'
  const isDirectory = result && (result.mode === 'directory_only' || !result.score);

  return (
    <div className="page" data-view={view}>
      {/* ── Sticky header ── */}
      <header className="site-header">
        <div className="header-inner">
          <div
            className="logo-group"
            onClick={() => {
              if (view === 'result') {
                returnToHomeAndFocus();
              } else {
                navigateTo('home');
              }
            }}
            style={{ cursor: 'pointer' }}
            title={t.title}
          >
            <img src="/karz-kavach-shield.png" alt="Karz Kavach" className="logo-shield-img" />
            <div className="logo-text">
              <span className="logo-en">{t.title}</span>
              <span className="logo-hi">{t.titleHi}</span>
            </div>
          </div>

          <div className="header-right">
            <nav className="header-nav" aria-label="Main Navigation">
              <button
                className={`nav-tab ${view === 'home' || view === 'result' ? 'active' : ''}`}
                onClick={() => {
                  if (view === 'result') {
                    returnToHomeAndFocus();
                  } else {
                    navigateTo('home');
                  }
                }}
                type="button"
              >
                <Search size={16} strokeWidth={2} />
                <span>{t.navChecker}</span>
              </button>
              <button
                className={`nav-tab ${view === 'trusted' ? 'active' : ''}`}
                onClick={() => navigateTo('trusted')}
                type="button"
              >
                <Star size={16} strokeWidth={2} />
                <span>{t.navTrusted}</span>
              </button>
              <button
                className={`nav-tab ${view === 'compare' ? 'active' : ''}`}
                onClick={() => navigateTo('compare')}
                type="button"
              >
                <Scale size={16} strokeWidth={2} />
                <span>{t.navCompare}</span>
              </button>
              <button
                className={`nav-tab ${view === 'calculator' ? 'active' : ''}`}
                onClick={() => navigateTo('calculator')}
                type="button"
              >
                <Calculator size={16} strokeWidth={2} />
                <span>{t.navCalc}</span>
              </button>
            </nav>

            <div className="lang-toggle">
              <button
                className={lang === 'en' ? 'on' : ''}
                onClick={() => setLang('en')}
                type="button"
              >EN</button>
              <button
                className={lang === 'hi' ? 'on' : ''}
                onClick={() => setLang('hi')}
                type="button"
              >हिंदी</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main-content">
        <div className="inner">

          {/* Slim low-contrast Info Banner */}
          {showBanner && (
            <aside className="slim-info-banner">
              <div className="slim-banner-content">
                <Info size={16} strokeWidth={2} className="slim-banner-icon" />
                <span className="slim-banner-text">
                  {t.bannerText}
                </span>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="slim-banner-dismiss"
                aria-label="Dismiss banner"
                type="button"
              >
                <X size={15} strokeWidth={2} />
              </button>
            </aside>
          )}

          {/* ── VIEW 1: HOME (Search page: hero, search box, try chips, explore trusted apps. NO calculator, NO trusted list) ── */}
          {view === 'home' && (
            <div className="view-container view-home" key="home">
              <div className="hero">
                <div className="hero-shield">
                  <img src="/karz-kavach-shield.png" alt="Karz Kavach" className="hero-shield-img" />
                </div>
                <span className="hero-tag">
                  <Lock size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                  {t.heroTag}
                </span>
                <h1 className="hero-title">
                  {t.title}{' '}
                  <span className="hero-title-hi">{t.titleHi}</span>
                </h1>
                <p className="hero-tagline">
                  "{t.tagline}"
                  <span className="hero-tagline-hi">{t.taglineHi}</span>
                </p>
              </div>

              {/* Search card */}
              <section className="search-card">
                <label className="search-label" htmlFor="app-search-input">
                  <Search size={18} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />
                  {t.searchLabel}
                </label>

                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="search-input-wrap">
                    <input
                      id="app-search-input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t.placeholder}
                      aria-label={t.placeholder}
                    />
                  </div>

                  <button
                    type="submit"
                    className="search-btn"
                    disabled={loading || !name.trim()}
                  >
                    <span>{loading ? t.checking : t.check}</span>
                    <ArrowRight size={18} strokeWidth={2} />
                  </button>
                </form>

                {/* Try chips for real apps */}
                <div className="try-chips-row">
                  <span className="try-label">{t.tryLabel}</span>
                  <div className="try-chips">
                    {TRY_APPS.map(appName => (
                      <button
                        key={appName}
                        type="button"
                        className="suggestion-chip"
                        onClick={() => { setName(appName); runCheck(appName, true); }}
                      >
                        {appName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prominent explore trusted apps button */}
                <button
                  type="button"
                  className="explore-trusted-btn"
                  onClick={() => navigateTo('trusted')}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={18} strokeWidth={2} />
                    {t.exploreTrusted}
                  </span>
                  <ArrowRight size={18} strokeWidth={2} />
                </button>
              </section>
            </div>
          )}

          {/* ── VIEW 2: RESULT (Assessment page: top bar with "← Check another app" & small search box, loading, results) ── */}
          {view === 'result' && (
            <div className="view-container view-result" key="result">
              {/* Top Bar on Result View */}
              <div className="result-top-bar">
                <button
                  type="button"
                  className="result-back-btn"
                  onClick={returnToHomeAndFocus}
                  title={t.checkAnother}
                >
                  <ArrowLeft size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                  {t.checkAnother}
                </button>

                <button
                  type="button"
                  className="result-top-compare-btn"
                  onClick={() => openCompare(assessResult?.app?.title || assessResult?.app?.packageId || currentQuery)}
                >
                  <Scale size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                  {t.compareWithAnother}
                </button>

                <form
                  className="result-mini-search"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (miniQuery.trim()) {
                      setName(miniQuery.trim());
                      runCheck(miniQuery.trim(), true);
                    }
                  }}
                >
                  <input
                    type="text"
                    className="result-mini-input"
                    value={miniQuery}
                    onChange={e => setMiniQuery(e.target.value)}
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                  />
                  <button
                    type="submit"
                    className="result-mini-btn"
                    disabled={loading || !miniQuery.trim()}
                  >
                    {loading ? '…' : (lang === 'hi' ? 'जांचें' : 'Check')}
                  </button>
                </form>
              </div>

              {/* Loading indicator for assessment */}
              {loading && (
                <div className="card assess-loading-card">
                  <div className="assess-spinner" />
                  <span>{t.checkingApp ? t.checkingApp(currentQuery) : (lang === 'hi' ? `${currentQuery} की जाँच हो रही है…` : `Checking ${currentQuery}…`)}</span>
                </div>
              )}

              {/* Error card */}
              {!loading && error && (
                <div className="card error-card">{error}</div>
              )}

              {/* Not found */}
              {!loading && notFound && (
                <div className="card">
                  <p className="not-found-text">{t.notFound}</p>
                  <div className="chips">
                    {notFound.map(n => (
                      <button
                        key={n}
                        type="button"
                        className="chip"
                        onClick={() => { setName(n); runCheck(n, true); }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 1. When /api/assess succeeds: RealAppCard (handles left and right columns including grievance record) */}
              {!loading && assessResult && (
                <RealAppCard
                  data={assessResult}
                  lang={lang}
                  t={t}
                  directoryResult={result}
                  onOpenCalculator={() => navigateTo('calculator')}
                  onOpenCompare={(targetApp) => openCompare(targetApp)}
                />
              )}

              {/* 2. If /api/assess fails or app has no Play ID: DirResult / FullResult */}
              {!loading && !assessResult && result && (
                isDirectory
                  ? <DirResult
                      r={result}
                      playUnavailable={playUnavailable}
                      lang={lang}
                      t={t}
                      onSearch={(simName) => { setName(simName); runCheck(simName, true); }}
                      onOpenCalculator={() => navigateTo('calculator')}
                      onOpenCompare={(targetApp) => openCompare(targetApp)}
                    />
                  : <FullResult
                      r={result}
                      lang={lang}
                      t={t}
                      onOpenCalculator={() => navigateTo('calculator')}
                      onOpenCompare={(targetApp) => openCompare(targetApp)}
                    />
              )}
            </div>
          )}

          {/* ── VIEW 3: TRUSTED APPS ── */}
          {view === 'trusted' && (
            <div className="view-container view-trusted" key="trusted">
              <div className="trusted-view">
                <div className="trusted-hero">
                  <span className="trusted-hero-badge">
                    <Star size={15} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                    {t.trustedHeroTag}
                  </span>
                  <h1 className="trusted-title">{t.trustedHeading}</h1>
                  <p className="trusted-subtext">{t.trustedSubtext}</p>
                </div>

                {/* Controls: Search, Filter Chips, Sort Dropdown */}
                <section className="search-card trusted-controls-card">
                  <div className="search-input-wrap">
                    <input
                      type="search"
                      value={trustedSearch}
                      onChange={e => setTrustedSearch(e.target.value)}
                      placeholder={t.trustedSearchPlaceholder}
                      aria-label={t.trustedSearchPlaceholder}
                    />
                    {trustedSearch && (
                      <button
                        type="button"
                        onClick={() => setTrustedSearch('')}
                        className="search-clear-btn"
                        aria-label="Clear search"
                      >
                        <X size={14} strokeWidth={2} />
                      </button>
                    )}
                  </div>

                  <div className="trusted-filter-row">
                    <div className="trusted-chips">
                      <button
                        type="button"
                        className={`chip ${selectedTier === '' ? 'chip-active' : ''}`}
                        onClick={() => setSelectedTier('')}
                      >
                        {t.filterAll}
                      </button>
                      <button
                        type="button"
                        className={`chip ${selectedTier === 'high' ? 'chip-active' : ''}`}
                        onClick={() => setSelectedTier('high')}
                      >
                        <Star size={13} strokeWidth={2} fill="currentColor" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                        {t.filterHigh}
                      </button>
                      <button
                        type="button"
                        className={`chip ${selectedTier === 'well' ? 'chip-active' : ''}`}
                        onClick={() => setSelectedTier('well')}
                      >
                        <Star size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                        {t.filterWell}
                      </button>
                    </div>

                    <div className="trusted-sort-box">
                      <label htmlFor="trusted-sort-select" className="trusted-sort-label">
                        {t.sortLabel}:
                      </label>
                      <select
                        id="trusted-sort-select"
                        className="trusted-sort-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                      >
                        <option value="best">{t.sortBest}</option>
                        <option value="rating">{t.sortRating}</option>
                        <option value="reviews">{t.sortReviews}</option>
                      </select>
                    </div>
                  </div>

                  {trustedData && trustedData.available && (
                    <div className="trusted-meta-bar">
                      <span>{t.showingApps(sortedTrustedItems.length, trustedData.count || trustedData.total)}</span>
                      {trustedData.generatedAt && (
                        <span className="trusted-date-text">
                          {t.ratingsFetchedOn(formatDate(trustedData.generatedAt, lang))}
                        </span>
                      )}
                    </div>
                  )}
                </section>

                {/* Loading indicator */}
                {trustedLoading && (
                  <div className="card" style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <div className="assess-spinner" style={{ margin: '0 auto 8px' }} />
                    <p style={{ color: 'var(--on-surface-variant)', fontWeight: 600 }}>{t.checking}</p>
                  </div>
                )}

                {/* Error state */}
                {trustedError && (
                  <div className="card error-card">{trustedError}</div>
                )}

                {/* Unavailable state */}
                {trustedData && !trustedData.available && (
                  <div className="card">
                    <p className="not-found-text">
                      <Info size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                      {t.trustedNotBuilt}
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {!trustedLoading && trustedData?.available && sortedTrustedItems.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                    <p className="not-found-text">
                      <Search size={16} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                      {t.notFoundTrusted}
                    </p>
                  </div>
                )}

                {/* Trusted Cards Grid */}
                {!trustedLoading && trustedData?.available && sortedTrustedItems.length > 0 && (
                  <div className="trusted-grid">
                    {sortedTrustedItems.map(item => (
                      <div
                        key={item.packageId || item.appName}
                        className="trusted-card"
                        onClick={() => onSelectTrustedApp(item.appName)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTrustedApp(item.appName); }}
                      >
                        {/* Top: Name, Lender & Trust Score */}
                        <div className="trusted-card-header">
                          <div className="trusted-app-info">
                            <h3 className="trusted-app-name">{item.appName}</h3>
                            <div className="trusted-lender-name">
                              <span className="trusted-lender-label">{t.lenderLabel}:</span> {toNormalCase(item.lender)}
                            </div>
                          </div>
                          <div className="trusted-score-badge" title={t.trustScoreDesc}>
                            <span className="trusted-score-label">{t.trustLabel}</span>
                            <div className="trusted-score-num-wrap">
                              <span className="trusted-score-num">{item.trustScore}</span>
                              <span className="trusted-score-denom">/100</span>
                            </div>
                          </div>
                        </div>

                        {/* Badges row: Tier badge + Installs (if present) */}
                        <div className="trusted-badges-row">
                          <span className={`trusted-tier-badge ${item.tier === 'high' ? 'tier-high' : 'tier-well'}`}>
                            {item.tier === 'high' ? (
                              <>
                                <Star size={12} strokeWidth={2} fill="currentColor" style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                                {t.tierHigh}
                              </>
                            ) : (
                              <>
                                <Star size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                                {t.tierWell}
                              </>
                            )}
                          </span>
                          {item.installs && (
                            <span className="trusted-installs-badge">
                              <Download size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
                              {item.installs}
                            </span>
                          )}
                        </div>

                        {/* Two signals shown SEPARATELY */}
                        <div className="trusted-signals-box">
                          <div className="trusted-signal-item rbi-signal">
                            <ShieldCheck size={14} strokeWidth={2} className="signal-icon" />
                            <span className="signal-text">{t.rbiSignal}</span>
                            <span className="rbi-pill">{t.rbiListedPill}</span>
                          </div>
                          <div className="trusted-signal-item play-signal">
                            <Star size={14} strokeWidth={2} fill="currentColor" className="signal-icon" />
                            <span className="signal-text">
                              {t.playSignalPrefix}: <strong>{item.rating} ★</strong> ({formatRatings(item.ratings)} {t.ratingsSuffix})
                            </span>
                          </div>
                        </div>

                        {/* Card Bottom: Click to check hint + View on Google Play link */}
                        <div className="trusted-card-footer">
                          <span className="trusted-check-cta">
                            <Search size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                            {t.checkAppHint}
                          </span>
                          {item.packageId && (
                            <a
                              href={`https://play.google.com/store/apps/details?id=${encodeURIComponent(item.packageId)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="trusted-play-link"
                              onClick={(e) => e.stopPropagation()}
                              title="Google Play Store"
                            >
                              <span>{t.viewOnPlay}</span>
                              <ExternalLink size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px', marginLeft: 4 }} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ── VIEW 4: COMPARE APPS (On its own page) ── */}
          {view === 'compare' && (
            <CompareApps
              lang={lang}
              t={t}
              initialApp1={compareApp1}
              initialApp2={compareApp2}
              onViewFullResult={(targetApp) => {
                setName(targetApp);
                setMiniQuery(targetApp);
                runCheck(targetApp, true);
              }}
            />
          )}

          {/* ── VIEW 5: LOAN COST CALCULATOR (On its own page) ── */}
          {view === 'calculator' && (
            <div className="view-container view-calculator" key="calculator">
              <LoanCostCalculator lang={lang} t={t} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
