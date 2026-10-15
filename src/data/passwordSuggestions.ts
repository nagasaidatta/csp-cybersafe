// Predefined 30 Password Security & Hygiene Suggestions
// 100% Client-side. Zero API calls. Predefined in English, Telugu, and Hindi.

import { Language } from '../types';

export interface PasswordSuggestion {
  id: number;
  category: 'length' | 'entropy' | 'patterns' | 'hygiene' | 'defense';
  en: string;
  te: string;
  hi: string;
}

export const PREDEFINED_30_PASSWORD_SUGGESTIONS: PasswordSuggestion[] = [
  // 1-5: Length & Structure
  {
    id: 1,
    category: 'length',
    en: 'Your password meets the 8-character minimum, but increasing length to 12–16 characters exponentially multiplies its brute-force cracking resistance from days to centuries.',
    te: 'మీ పాస్‌వర్డ్ 8 అక్షరాల పరిమితిని చేరుకుంది, కానీ దీనిని 12–16 అక్షరాలకు పెంచడం వల్ల బ్రూట్-ఫోర్స్ క్రాకింగ్ సమయం కొన్ని రోజుల నుండి శతాబ్దాలకు పెరుగుతుంది.',
    hi: 'आपका पासवर्ड 8 अक्षरों की न्यूनतम सीमा पूरी करता है, लेकिन इसे 12-16 अक्षरों तक बढ़ाने से इसकी सुरक्षा कई गुना बढ़ जाती है।'
  },
  {
    id: 2,
    category: 'length',
    en: 'Length is the primary mathematical defense against modern GPU cracking rigs. Every added character increases entropy exponentially.',
    te: 'ఆధునిక కంప్యూటర్ల దాడికి వ్యతిరేకంగా పొడవు ప్రధాన రక్షణ. అదనంగా చేర్చే ప్రతి అక్షరం రక్షణను రెట్టింపు చేస్తుంది.',
    hi: 'आधुनिक जीपीयू हमलों के खिलाफ पासवर्ड की लंबाई सबसे बड़ी रक्षा है। प्रत्येक अतिरिक्त अक्षर पासवर्ड को बहुत मजबूत बनाता है।'
  },
  {
    id: 3,
    category: 'length',
    en: 'Consider turning this into a 16+ character passphrase by combining 4 random, memorable words separated by hyphens (e.g. Blue-Falcon-River-7#).',
    te: 'హైఫన్‌లతో వేరు చేయబడిన 4 యాదృచ్ఛిక పదాలను కలిపి 16+ అక్షరాల పాస్‌ఫ్రేజ్‌గా మార్చడాన్ని పరిశీలించండి (ఉదా: Blue-Falcon-River-7#).',
    hi: 'हाइफ़न से अलग किए गए 4 यादृच्छिक शब्दों को मिलाकर इसे 16+ वर्णों के पासफ़्रेज़ में बदलने पर विचार करें (उदा. Blue-Falcon-River-7#)।'
  },
  {
    id: 4,
    category: 'length',
    en: 'For high-value accounts like banking and primary email, aim for 14 or more total characters.',
    te: 'బ్యాంకింగ్ మరియు ప్రాథమిక ఈమెయిల్ వంటి ముఖ్యమైన ఖాతాల కోసం, కనీసం 14 లేదా అంతకంటే ఎక్కువ అక్షరాలను లక్ష్యంగా పెట్టుకోండి.',
    hi: 'बैंकिंग और प्राथमिक ईमेल जैसे उच्च-मूल्य खातों के लिए, 14 या अधिक अक्षरों का लक्ष्य रखें।'
  },
  {
    id: 5,
    category: 'length',
    en: 'A 16-character password with mixed cases and symbols takes billions of years to crack with present supercomputers.',
    te: 'వివిధ రకాల అక్షరాలు మరియు చిహ్నాలతో కూడిన 16 అక్షరాల పాస్‌వర్డ్‌ను ప్రస్తుత సూపర్ కంప్యూటర్‌లతో క్రాక్ చేయడానికి బిలియన్ల సంవత్సరాలు పడుతుంది.',
    hi: 'विविध वर्णों और प्रतीकों वाला 16-अक्षर का पासवर्ड वर्तमान सुपरकंप्यूटरों से क्रैक करने में अरबों साल लेता है।'
  },

  // 6-10: Entropy & Placement
  {
    id: 6,
    category: 'entropy',
    en: 'Distribute uppercase letters and symbols throughout the middle rather than just capitalizing the first letter.',
    te: 'మొదటి అక్షరాన్ని మాత్రమే కాకుండా పాస్‌వర్డ్ మధ్యలో కూడా పెద్ద అక్షరాలు (క్యాపిటల్స్) మరియు చిహ్నాలను ఉపయోగించండి.',
    hi: 'केवल पहले अक्षर को बड़ा करने के बजाय पासवर्ड के बीच में बड़े अक्षर और प्रतीक लगाएं।'
  },
  {
    id: 7,
    category: 'entropy',
    en: 'Avoid placing numbers and symbols exclusively at the very end of the password (like "Password123!"), as attackers test this pattern first.',
    te: 'పాస్‌వర్డ్ చివరిలో మాత్రమే సంఖ్యలు మరియు చిహ్నాలను ఉంచడం నివారించండి (ఉదా: "Password123!"), ఎందుకంటే హ్యాకర్లు మొదట ఈ నమూనాను పరీక్షిస్తారు.',
    hi: 'पासवर्ड के अंत में ही संख्याएं और प्रतीक जोड़ने से बचें (जैसे "Password123!"), क्योंकि हमलावर सबसे पहले इसी पैटर्न का परीक्षण करते हैं।'
  },
  {
    id: 8,
    category: 'entropy',
    en: 'Avoid predictable leetspeak character substitutions like "@" for "a" or "0" for "o" — automated cracking tools anticipate these easily.',
    te: '"a" బదులు "@" లేదా "o" బదులు "0" వంటి ఊహించదగిన మార్పులను నివారించండి - ఆటోమేటెడ్ సాధనాలు వీటిని సులభంగా గుర్తిస్తాయి.',
    hi: '"a" के लिए "@" या "o" के लिए "0" जैसे आसान प्रतिस्थापन से बचें - स्वचालित उपकरण इन्हें आसानी से पहचान लेते हैं।'
  },
  {
    id: 9,
    category: 'entropy',
    en: 'Use uncommon symbols like #, $, %, ^, or _ alongside standard punctuation for higher cryptographic entropy.',
    te: 'ఉన్నతమైన ఎన్‌క్రిప్షన్ కోసం ప్రామాణిక విరామ చిహ్నాలతో పాటు #, $, %, ^ లేదా _ వంటి చిహ్నాలను కలపండి.',
    hi: 'उच्च सुरक्षा के लिए मानक विराम चिह्नों के साथ #, $, %, ^, या _ जैसे विशेष प्रतीकों का उपयोग करें।'
  },
  {
    id: 10,
    category: 'entropy',
    en: 'Mix different character classes irregularly so that no predictable sub-strings can be isolated by dictionary tools.',
    te: 'నిఘంటువు ఆధారిత హ్యాకింగ్ సాధనాలు గుర్తించకుండా ఉండేందుకు వివిధ రకాల అక్షరాలను క్రమరహితంగా కలపండి.',
    hi: 'वर्णों को अनियमित रूप से मिलाएं ताकि कोई भी पूर्वानुमानित शब्द क्रैकिंग टूल्स द्वारा पकड़ा न जा सके।'
  },

  // 11-16: Patterns & Personal Data Protections
  {
    id: 11,
    category: 'patterns',
    en: 'Ensure your password does not contain keyboard walks or consecutive keys such as "qwerty", "asdfgh", or "12345".',
    te: 'మీ పాస్‌వర్డ్‌లో "qwerty", "asdfgh" లేదా "12345" వంటి కీబోర్డ్ వరుస నమూనాలు లేకుండా చూసుకోండి.',
    hi: 'सुनिश्चित करें कि आपके पासवर्ड में "qwerty", "asdfgh" या "12345" जैसे कीबोर्ड अनुक्रम शामिल नहीं हैं।'
  },
  {
    id: 12,
    category: 'patterns',
    en: 'Do not use calendar years (such as 2024, 2025, or 2026) as suffixes, as automated wordlists prioritize recent year stamps.',
    te: '2024, 2025 లేదా 2026 వంటి సంవత్సరాలను చివరలో చేర్చవద్దు, హ్యాకింగ్ జాబితాలు వీటిని త్వరగా పరీక్షిస్తాయి.',
    hi: '2024, 2025 या 2026 जैसे वर्षों को पासवर्ड में न जोड़ें, क्योंकि हैकिंग टूल सबसे पहले हाल के वर्षों की जांच करते हैं।'
  },
  {
    id: 13,
    category: 'patterns',
    en: 'Avoid repeating identical characters consecutively (such as "aaa" or "888"), as repetition reduces effective complexity.',
    te: '"aaa" లేదా "888" వంటి ఒకే అక్షరాలను పదే పదే పునరావృతం చేయవద్దు, ఇది సంక్లిష్టతను తగ్గిస్తుంది.',
    hi: 'एक ही अक्षर को बार-बार दोहराने से बचें (जैसे "aaa" या "888"), क्योंकि दोहराव पासवर्ड को कमजोर बनाता है।'
  },
  {
    id: 14,
    category: 'patterns',
    en: 'Never include personal identifiers such as your birth year, wedding anniversary, vehicle registration, or postal pin code.',
    te: 'మీ పుట్టిన సంవత్సరం, వివాహ వార్షికోత్సవం, వాహనం నంబర్ లేదా పోస్టల్ పిన్ కోడ్ వంటి వ్యక్తిగత వివరాలను ఎప్పుడూ చేర్చవద్దు.',
    hi: 'अपना जन्म वर्ष, शादी की सालगिरह, वाहन नंबर या पिन कोड जैसे व्यक्तिगत विवरण कभी शामिल न करें।'
  },
  {
    id: 15,
    category: 'patterns',
    en: 'Never use family names, pet names, favorite sports teams, or local city names that social engineering scans could deduce.',
    te: 'సోషల్ ఇంజనీరింగ్ ద్వారా ఊహించగలిగే కుటుంబ సభ్యుల పేర్లు, పెంపుడు జంతువుల పేర్లు లేదా ఊరి పేర్లను ఉపయోగించవద్దు.',
    hi: 'परिवार के सदस्यों के नाम, पालतू जानवरों के नाम या पसंदीदा टीम के नाम का उपयोग न करें।'
  },
  {
    id: 16,
    category: 'patterns',
    en: 'Avoid using parts of your username, email prefix, or company name inside your password.',
    te: 'మీ వినియోగదారు పేరు (యూజర్‌నేమ్), ఈమెయిల్ లేదా కంపెనీ పేరులోని భాగాలను పాస్‌వర్డ్‌లో ఉపయోగించవద్దు.',
    hi: 'अपने यूज़रनेम, ईमेल या कंपनी के नाम के हिस्सों को पासवर्ड में उपयोग करने से बचें।'
  },

  // 17-23: Credential Hygiene & Storage
  {
    id: 17,
    category: 'hygiene',
    en: 'Never reuse this password across multiple services. If a minor website is breached, attackers use the credentials to unlock your email and bank.',
    te: 'ఈ పాస్‌వర్డ్‌ను బహుళ వెబ్‌సైట్లలో తిరిగి ఉపయోగించవద్దు. ఏదైనా ఒక సైట్ హ్యాక్ అయితే, మీ అన్ని ఖాతాలు ప్రమాదంలో పడతాయి.',
    hi: 'इस पासवर्ड का उपयोग कई वेबसाइटों पर न करें। यदि कोई एक साइट हैक होती है, तो आपके सभी खाते खतरे में पड़ जाते हैं।'
  },
  {
    id: 18,
    category: 'hygiene',
    en: 'Store this password in a reputable encrypted password manager (like Bitwarden, 1Password, or KeePass) instead of unencrypted text files.',
    te: 'ఈ పాస్‌వర్డ్‌ను సాదా టెక్స్ట్ ఫైల్‌లలో కాకుండా బిట్‌వార్డెన్ లేదా కీపాస్ వంటి ఎన్‌క్రిప్టెడ్ పాస్‌వర్డ్ మేనేజర్‌లో భద్రపరచండి.',
    hi: 'इस पासवर्ड को प्लेन टेक्स्ट में लिखने के बजाय एक सुरक्षित पासवर्ड मैनेजर में सहेजें।'
  },
  {
    id: 19,
    category: 'hygiene',
    en: 'Never write passwords on sticky notes, desk pads, phone notes, or unencrypted spreadsheets.',
    te: 'స్టిక్కీ నోట్స్, డైరీలు, మొబైల్ నోట్‌ప్యాడ్‌లు లేదా ఎక్సెల్ షీట్‌లలో పాస్‌వర్డ్‌లను ఎప్పుడూ రాసి ఉంచవద్దు.',
    hi: 'पासवर्ड को कभी भी स्टिकी नोट्स, डायरी या फोन नोट्स में लिखकर न रखें।'
  },
  {
    id: 20,
    category: 'hygiene',
    en: 'Disable browser password saving on public, library, or shared work computers.',
    te: 'పబ్లిక్, లైబ్రరీ లేదా ఇతరులతో పంచుకునే కంప్యూటర్లలో బ్రౌజర్ పాస్‌వర్డ్ సేవ్ ఫీచర్‌ను డిసేబుల్ చేయండి.',
    hi: 'सार्वजनिक या साझा कंप्यूटरों पर ब्राउज़र में पासवर्ड सेव न करें।'
  },
  {
    id: 21,
    category: 'hygiene',
    en: 'Never send your password over email, WhatsApp, SMS, or plain chat messages.',
    te: 'ఈమెయిల్, వాట్సాప్, SMS లేదా చాట్ సందేశాల ద్వారా మీ పాస్‌వర్డ్‌ను ఎవరికీ పంపవద్దు.',
    hi: 'ईमेल, व्हाट्सएप या एसएमएस के माध्यम से अपना पासवर्ड कभी किसी को न भेजें।'
  },
  {
    id: 22,
    category: 'hygiene',
    en: 'If you suspect a device is infected with spyware or a keylogger, change all critical passwords immediately from a separate clean device.',
    te: 'మీ పరికరంలో మాల్వేర్ లేదా కీలాగర్ ఉందని అనుమానం వస్తే, వేరొక సురక్షితమైన పరికరం నుండి వెంటనే పాస్‌వర్డ్‌లను మార్చండి.',
    hi: 'यदि मैलवेयर का संदेह हो, तो तुरंत किसी अन्य सुरक्षित डिवाइस से अपने सभी पासवर्ड बदलें।'
  },
  {
    id: 23,
    category: 'hygiene',
    en: 'Do not use incremental password changes (e.g., from "Winter2025#" to "Spring2026#"); automated attackers predict these shifts.',
    te: 'కాలాలు లేదా సంవత్సరాలను మాత్రమే మార్చే సాధారణ పద్ధతులను అనుసరించవద్దు (ఉదా: "Winter2025#" నుండి "Spring2026#").',
    hi: 'सरल वृद्धिशील बदलावों से बचें (जैसे "Winter2025#" से "Spring2026#") क्योंकि हैकर्स इनका आसानी से अनुमान लगा लेते हैं।'
  },

  // 24-30: Account Defense & Protection
  {
    id: 24,
    category: 'defense',
    en: 'Always enable Two-Factor Authentication (2FA) or Multi-Factor Authentication (MFA) alongside this strong password.',
    te: 'ఈ బలమైన పాస్‌వర్డ్‌తో పాటు ఎల్లప్పుడూ టూ-ఫ్యాక్టర్ ప్రామాణీకరణ (2FA) లేదా MFAని ప్రారంభించండి.',
    hi: 'इस मजबूत पासवर्ड के साथ हमेशा टू-फैक्टर ऑथेंटिकेशन (2FA) सक्रिय करें।'
  },
  {
    id: 25,
    category: 'defense',
    en: 'Prefer authenticator apps (like Google Authenticator or Microsoft Authenticator) over SMS OTPs for 2FA verification.',
    te: '2FA కోసం SMS OTPల కంటే గూగుల్ అథెంటికేటర్ వంటి అప్లికేషన్‌లను ఉపయోగించడానికి ప్రాధాన్యత ఇవ్వండి.',
    hi: '2FA के लिए एसएमएस ओटीपी की तुलना में प्रमाणक ऐप (जैसे Google Authenticator) को प्राथमिकता दें।'
  },
  {
    id: 26,
    category: 'defense',
    en: 'Remember: Real bank staff, police, and customer support representatives will NEVER ask you for your password or OTP.',
    te: 'గుర్తుంచుకోండి: నిజమైన బ్యాంక్ అధికారులు, పోలీసులు మరియు కస్టమర్ కేర్ ఎప్పటికీ మీ పాస్‌వర్డ్ లేదా OTPని అడగరు.',
    hi: 'याद रखें: वास्तविक बैंक कर्मचारी, पुलिस या ग्राहक सेवा कभी भी आपका पासवर्ड या ओटीपी नहीं मांगते।'
  },
  {
    id: 27,
    category: 'defense',
    en: 'Check periodically on trusted breach notification databases (like haveibeenpwned.com) to see if your account appears in data leaks.',
    te: 'మీ ఖాతా లేదా ఈమెయిల్ డేటా లీక్‌లలో ఉందో లేదో haveibeenpwned.com వంటి విశ్వసనీయ వెబ్‌సైట్లలో క్రమం తప్పకుండా తనిఖీ చేయండి.',
    hi: 'आपका ईमेल किसी डेटा लीक में आया है या नहीं, यह जांचने के लिए haveibeenpwned.com जैसी साइटों की जांच करें।'
  },
  {
    id: 28,
    category: 'defense',
    en: 'Avoid logging in with this password when connected to open or unencrypted public Wi-Fi networks without a trusted VPN.',
    te: 'నమ్మకమైన VPN లేకుండా పబ్లిక్ లేదా ఉచిత వై-ఫై నెట్‌వర్క్‌లకు కనెక్ట్ అయినప్పుడు ఈ పాస్‌వర్డ్‌తో లాగిన్ అవ్వకండి.',
    hi: 'बिना वीपीएन के सार्वजनिक वाई-फाई नेटवर्क पर इस पासवर्ड से लॉग इन करने से बचें।'
  },
  {
    id: 29,
    category: 'defense',
    en: 'Set random, fictional answers for account security recovery questions so answers cannot be scraped from your social media.',
    te: 'ఖాతా రికవరీ భద్రతా ప్రశ్నలకు నిజమైన సమాధానాలు కాకుండా యాదృచ్ఛిక సమాధానాలను సెట్ చేయండి.',
    hi: 'सुरक्षा प्रश्नों के लिए काल्पनिक उत्तर सेट करें ताकि सोशल मीडिया से उनका पता न लगाया जा सके।'
  },
  {
    id: 30,
    category: 'defense',
    en: 'For high-security operations, consider using a hardware FIDO2 security key (such as YubiKey) for unphishable authentication.',
    te: 'అత్యున్నత భద్రత కోసం, ఫిషింగ్ చేయలేని హార్డ్‌వేర్ FIDO2 సెక్యూరిటీ కీ (ఉదా: YubiKey)ని ఉపయోగించడాన్ని పరిశీలించండి.',
    hi: 'अत्यधिक सुरक्षा के लिए, हार्डवेयर FIDO2 सुरक्षा कुंजी (जैसे YubiKey) के उपयोग पर विचार करें।'
  }
];

export interface PasswordEvaluation {
  criteria: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    symbol: boolean;
  };
  fulfilledCount: number;
  isStrong: boolean;
  strengthLabel: 'empty' | 'weak' | 'medium' | 'strong' | 'very-strong';
  scorePercent: number; // 0 - 100
  contextualSuggestions: PasswordSuggestion[];
}

/**
 * Real-time password evaluation function.
 * Completely deterministic and client-side (no network, zero API calls).
 */
export function evaluatePasswordStrength(password: string): PasswordEvaluation {
  if (!password) {
    return {
      criteria: {
        minLength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false
      },
      fulfilledCount: 0,
      isStrong: false,
      strengthLabel: 'empty',
      scorePercent: 0,
      contextualSuggestions: []
    };
  }

  const minLength = password.length >= 8;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);

  const criteria = { minLength, uppercase, lowercase, number, symbol };
  const fulfilledCount = Object.values(criteria).filter(Boolean).length;
  const isStrong = fulfilledCount === 5;

  let strengthLabel: 'empty' | 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  let scorePercent = 20;

  if (fulfilledCount < 3) {
    strengthLabel = 'weak';
    scorePercent = Math.max(15, fulfilledCount * 20);
  } else if (fulfilledCount < 5 || password.length < 8) {
    strengthLabel = 'medium';
    scorePercent = 60;
  } else {
    // Meets all 5 criteria
    if (password.length >= 14) {
      strengthLabel = 'very-strong';
      scorePercent = 100;
    } else {
      strengthLabel = 'strong';
      scorePercent = 85;
    }
  }

  // Generate contextual suggestions when password becomes strong
  const contextualSuggestions: PasswordSuggestion[] = [];

  if (isStrong) {
    // 1. If length is only 8 to 11 characters, suggest increasing length
    if (password.length >= 8 && password.length <= 11) {
      const s1 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 1);
      if (s1) contextualSuggestions.push(s1);
    }

    // 2. If uppercase letter is only at the beginning
    if (/^[A-Z][^A-Z]*$/.test(password)) {
      const s6 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 6);
      if (s6) contextualSuggestions.push(s6);
    }

    // 3. If numbers or symbols are clustered only at the end
    if (/^[A-Za-z]+[0-9!@#$%^&*]+$/.test(password)) {
      const s7 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 7);
      if (s7) contextualSuggestions.push(s7);
    }

    // 4. More than 3 consecutive repeating identical characters (e.g. 'aaaa' or '8888')
    if (/(.)\1{3,}/.test(password)) {
      const s13 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 13);
      if (s13) contextualSuggestions.push(s13);
    }

    // 5. Common keyboard or sequence patterns (e.g. '123', 'abc', 'qwerty')
    if (/(123|234|345|456|567|678|789|abc|bcd|cde|qwe|asd|zxc)/i.test(password)) {
      const s11 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 11);
      if (s11) contextualSuggestions.push(s11);
    }

    // 6. Year patterns like 2024, 2025, 2026, 1999
    if (/(19|20)\d{2}/.test(password)) {
      const s12 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 12);
      if (s12) contextualSuggestions.push(s12);
    }

    // 7. If only 1 special character was used, suggest mixing uncommon symbols
    const specialCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
    if (specialCount === 1) {
      const s9 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 9);
      if (s9) contextualSuggestions.push(s9);
    }

    // 8. If length is 12 to 15 characters and no other major pattern was flagged
    if (password.length >= 12 && password.length < 16 && contextualSuggestions.length === 0) {
      const s3 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 3);
      if (s3) contextualSuggestions.push(s3);
    }

    // 9. If password is exceptionally strong (16+ chars) and has no detected flaws
    if (contextualSuggestions.length === 0) {
      const s17 = PREDEFINED_30_PASSWORD_SUGGESTIONS.find((s) => s.id === 17);
      if (s17) contextualSuggestions.push(s17);
    }
  }

  return {
    criteria,
    fulfilledCount,
    isStrong,
    strengthLabel,
    scorePercent,
    contextualSuggestions
  };
}

export function getSuggestionText(suggestion: PasswordSuggestion, lang: Language): string {
  if (lang === 'te') return suggestion.te;
  if (lang === 'hi') return suggestion.hi;
  return suggestion.en;
}
