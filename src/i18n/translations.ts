import { Language } from '../types';

export interface Translations {
  // Navigation
  siteTitle: string;
  login: string;
  logout: string;
  greeting: string;

  // Home Page
  homeHeading: string;
  homeSubheading: string;
  homeDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  startLearning: string;

  // Auth Page / Tabs
  tabLogin: string;
  tabRegister: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  otpLabel: string;
  otpPlaceholder: string;
  btnLogin: string;
  btnGetOtp: string;
  btnResendOtp: string;
  btnVerifyOtp: string;
  btnSetPassword: string;
  btnCancel: string;
  cooldownText: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step1Desc: string;
  step2Desc: string;
  step3Desc: string;
  passwordRequirement: string;
  pwdStrengthLabel: string;
  pwdStrengthWeak: string;
  pwdStrengthMedium: string;
  pwdStrengthStrong: string;
  pwdRuleMinLength: string;
  pwdRuleUppercase: string;
  pwdRuleLowercase: string;
  pwdRuleNumber: string;
  pwdRuleSymbol: string;
  errPasswordNotStrong: string;
  backToHome: string;
  stepAccount: string;
  stepVerify: string;
  stepPassword: string;
  processing: string;
  sending: string;
  verifying: string;
  settingPassword: string;
  passwordsMatch: string;
  secureAuthNotice: string;

  // Auth Feedback / Errors
  errInvalidEmail: string;
  errExistingEmail: string;
  errInvalidOtp: string;
  errExpiredOtp: string;
  errOtpRateLimit: string;
  errPasswordLength: string;
  errPasswordMismatch: string;
  errNetwork: string;
  errAuthFailed: string;
  errDatabase: string;
  errSessionExpired: string;
  otpSentSuccess: string;
  otpVerifiedSuccess: string;
  regCompleteSuccess: string;
  loginSuccess: string;

  // Modules Page
  modulesTitle: string;
  progressTitle: string;
  progressCompleted: string;
  moduleLabel: string;
  keyTakeaways: string;
  transcriptLabel: string;
  btnCompleted: string;
  btnComplete: string;
  btnMarkIncomplete: string;
  btnCompletedTooltip: string;
  btnTakeQuiz: string;
  btnTakeQuizDisabledNotice: string;
  allModulesCompletedNotice: string;
  clickToPlayVideo: string;
  saving: string;
  quizReadyPrompt: string;
  quizRemainingPrompt: string;
  badgeCompleted: string;

  // Module 1
  m1Title: string;
  m1Transcript: string;
  m1Takeaways: string[];
  m1Btn: string;

  // Module 2
  m2Title: string;
  m2Transcript: string;
  m2Takeaways: string[];
  m2Btn: string;

  // Module 3
  m3Title: string;
  m3Transcript: string;
  m3Takeaways: string[];
  m3Btn: string;

  // Module 4
  m4Title: string;
  m4Transcript: string;
  m4Takeaways: string[];
  m4Btn: string;

  // Quiz Page
  quizTitle: string;
  quizSubtitle: string;
  quizNotice: string;
  btnSubmitQuiz: string;
  btnRetakeQuiz: string;
  btnBackToModules: string;
  yourScore: string;
  correctAnswers: string;
  totalQuestions: string;
  quizIncompleteAlert: string;
  perfectScoreMessage: string;
  goodScoreMessage: string;
  reviewAnswers: string;
  quizResultHeading: string;
  correctBadge: string;
  incorrectBadge: string;

  // Quiz Questions & Options
  q1Question: string;
  q1Opt1: string;
  q1Opt2: string;

  q2Question: string;
  q2Opt1: string;
  q2Opt2: string;

  q3Question: string;
  q3Opt1: string;
  q3Opt2: string;

  q4Question: string;
  q4Opt1: string;
  q4Opt2: string;

  q5Question: string;
  q5Opt1: string;
  q5Opt2: string;

  q6Question: string;
  q6Opt1: string;
  q6Opt2: string;

  q7Question: string;
  q7Opt1: string;
  q7Opt2: string;

  q8Question: string;
  q8Opt1: string;
  q8Opt2: string;

  q9Question: string;
  q9Opt1: string;
  q9Opt2: string;

  q10Question: string;
  q10Opt1: string;
  q10Opt2: string;

  // Footer / Common
  footerNotice: string;
  helplineNotice: string;
  nationalPortal: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    siteTitle: 'Cyber Safe',
    login: 'Login',
    logout: 'Logout',
    greeting: 'Welcome',

    homeHeading: 'Cyber Safe - Online Scam Awareness Portal',
    homeSubheading: 'Stay Safe Online',
    homeDescription: 'Learn about phishing attacks, OTP scams, password security and safe online practices.',
    stat1Value: '80%',
    stat1Label: 'Phishing attacks happen through emails.',
    stat2Value: 'Thousands',
    stat2Label: 'Lose money due to OTP scams every year.',
    stat3Value: 'UPI Fraud',
    stat3Label: 'Cases are increasing rapidly.',
    stat4Value: 'Cyber Crime Helpline',
    stat4Label: '1930',
    startLearning: 'Start Learning',

    tabLogin: 'Login',
    tabRegister: 'Register New User',
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    otpLabel: 'Verification Code (OTP)',
    otpPlaceholder: 'Enter 8-digit OTP',
    btnLogin: 'Login',
    btnGetOtp: 'Get OTP',
    btnResendOtp: 'Resend OTP',
    btnVerifyOtp: 'Verify OTP',
    btnSetPassword: 'Set Password',
    btnCancel: 'Cancel',
    cooldownText: 'Resend OTP in {seconds}s',
    step1Title: 'Step 1: Account Information',
    step2Title: 'Step 2: Email Verification',
    step3Title: 'Step 3: Set Password',
    step1Desc: 'Enter your name and email to receive a verification code.',
    step2Desc: 'Enter the 8-digit OTP sent to your email address.',
    step3Desc: 'Create a secure password to complete your registration.',
    passwordRequirement: 'Password must be at least 8 characters long.',
    pwdStrengthLabel: 'Password Strength',
    pwdStrengthWeak: 'Weak',
    pwdStrengthMedium: 'Medium',
    pwdStrengthStrong: 'Strong',
    pwdRuleMinLength: '8 characters',
    pwdRuleUppercase: 'Use uppercase',
    pwdRuleLowercase: 'Use lowercase',
    pwdRuleNumber: 'Use numbers',
    pwdRuleSymbol: 'Use symbols',
    errPasswordNotStrong: 'Password must be strong to create an account.',
    backToHome: 'Back to Portal Home',
    stepAccount: 'Account',
    stepVerify: 'Verify OTP',
    stepPassword: 'Password',
    processing: 'Processing...',
    sending: 'Sending...',
    verifying: 'Verifying...',
    settingPassword: 'Setting Password...',
    passwordsMatch: 'Passwords match',
    secureAuthNotice: 'End-to-End Secure Supabase Authentication',

    errInvalidEmail: 'Please enter a valid email address.',
    errExistingEmail: 'This email is already registered. Please log in instead.',
    errInvalidOtp: 'Invalid verification code. Please check and try again.',
    errExpiredOtp: 'Verification code has expired. Please request a new OTP.',
    errOtpRateLimit: 'Too many requests. Please wait a few moments before requesting a new OTP.',
    errPasswordLength: 'Password must be at least 8 characters long.',
    errPasswordMismatch: 'Passwords do not match. Please re-enter carefully.',
    errNetwork: 'Network error. Please check your internet connection.',
    errAuthFailed: 'Invalid email or password. Please try again.',
    errDatabase: 'Failed to save profile. Please try again.',
    errSessionExpired: 'Your session has expired. Please log in again.',
    otpSentSuccess: 'Verification code sent to your email.',
    otpVerifiedSuccess: 'Email verified successfully. Now create your password.',
    regCompleteSuccess: 'Registration completed successfully!',
    loginSuccess: 'Logged in successfully.',

    modulesTitle: 'Cybersecurity Learning Modules',
    progressTitle: 'Module Progress',
    progressCompleted: '{completed}/4 completed ({percent}%)',
    moduleLabel: 'Module',
    keyTakeaways: 'Key Takeaways',
    transcriptLabel: 'Transcript',
    btnCompleted: 'Completed Module',
    btnComplete: 'Complete Module',
    btnMarkIncomplete: 'Click to Uncomplete',
    btnCompletedTooltip: 'Click to unmark as completed',
    btnTakeQuiz: 'Take Quiz',
    btnTakeQuizDisabledNotice: 'Complete all 4 modules to unlock the quiz.',
    allModulesCompletedNotice: 'All modules completed! The quiz is now unlocked.',
    clickToPlayVideo: 'Click to Play Video',
    saving: 'Saving...',
    quizReadyPrompt: 'Ready to test your knowledge? Take the 10-question scam awareness quiz.',
    quizRemainingPrompt: '{remaining} more module(s) to complete before taking the quiz.',
    badgeCompleted: 'Completed',

    m1Title: 'Phishing Websites',
    m1Transcript: 'Phishing websites are fraudulent websites designed to imitate trusted organizations and trick users into revealing sensitive information such as passwords, banking details, and personal data.',
    m1Takeaways: [
      'Check the website URL carefully.',
      'Look for HTTPS and the security lock icon.',
      'Avoid clicking suspicious or unknown links.',
      'Verify website authenticity before entering passwords.'
    ],
    m1Btn: 'Completed Module',

    m2Title: 'Strong Passwords',
    m2Transcript: 'Strong passwords use a combination of uppercase letters, lowercase letters, numbers, and special symbols to improve security and reduce the risk of unauthorized access.',
    m2Takeaways: [
      'Use at least 12 characters.',
      'Avoid using birthdays or personal information.',
      'Do not reuse passwords across accounts.',
      'Consider using a password manager.'
    ],
    m2Btn: 'Completed Module',

    m3Title: 'OTP Sharing Scams',
    m3Transcript: 'OTP should never be shared with anyone, including bank employees. Banks, RBI, and other financial institutions never ask customers to disclose OTPs over phone calls, messages, or emails.',
    m3Takeaways: [
      'Never share OTP with anyone.',
      'Ignore suspicious calls and messages.',
      'Verify caller identity before responding.',
      'Banks never ask for OTPs.'
    ],
    m3Btn: 'Complete Module',

    m4Title: 'UPI & QR Code Scams',
    m4Transcript: 'Fraudsters often use fake QR codes, payment requests, and UPI scams to steal money from users. Always verify the sender and transaction details before making any payment.',
    m4Takeaways: [
      'Verify sender identity.',
      'Check transaction details carefully.',
      'Avoid scanning unknown QR codes.',
      'Confirm payment requests before paying.'
    ],
    m4Btn: 'Completed Module',

    quizTitle: 'Cybersecurity Awareness Quiz',
    quizSubtitle: 'Answer all 10 questions to test your scam awareness.',
    quizNotice: 'Please answer all questions before submitting.',
    btnSubmitQuiz: 'Submit Quiz',
    btnRetakeQuiz: 'Retake Quiz',
    btnBackToModules: 'Back to Modules',
    yourScore: 'Your Score',
    correctAnswers: 'Correct Answers',
    totalQuestions: 'Total Questions',
    quizIncompleteAlert: 'Please answer all 10 questions before submitting.',
    perfectScoreMessage: 'Excellent! You have a strong understanding of online scam safety.',
    goodScoreMessage: 'Good effort! Review the questions above to reinforce safe practices.',
    reviewAnswers: 'Review Your Answers',
    quizResultHeading: 'Result',
    correctBadge: 'Correct',
    incorrectBadge: 'Incorrect',

    q1Question: 'Someone asks for an OTP claiming to be SBI.',
    q1Opt1: 'Share OTP',
    q1Opt2: 'Do Not Share OTP',

    q2Question: 'www.sbi-secure-login.xyz',
    q2Opt1: 'Safe',
    q2Opt2: 'Scam',

    q3Question: 'Which is a strong password?',
    q3Opt1: '123456',
    q3Opt2: 'Cyber@Safe2025',

    q4Question: 'HTTPS means?',
    q4Opt1: 'Secure Connection',
    q4Opt2: 'Virus',

    q5Question: 'What should you do if you receive a suspicious email?',
    q5Opt1: 'Delete or Report It',
    q5Opt2: 'Click All Links',

    q6Question: 'Is it safe to use public Wi-Fi for banking?',
    q6Opt1: 'Yes',
    q6Opt2: 'No',

    q7Question: 'What should you do before downloading an app?',
    q7Opt1: 'Check Reviews and Source',
    q7Opt2: 'Download Immediately',

    q8Question: 'Which one is safer?',
    q8Opt1: 'Two-Factor Authentication',
    q8Opt2: 'Password Only',

    q9Question: 'Should you share your ATM PIN?',
    q9Opt1: 'Yes',
    q9Opt2: 'No',

    q10Question: 'What is phishing?',
    q10Opt1: 'A Scam to Steal Information',
    q10Opt2: 'A Type of Antivirus',

    footerNotice: 'Public Cybersecurity Awareness Portal. In case of cyber fraud, report immediately to 1930.',
    helplineNotice: 'National Cyber Crime Reporting Helpline',
    nationalPortal: 'cybercrime.gov.in'
  },

  te: {
    siteTitle: 'సైబర్ సేఫ్',
    login: 'లాగిన్',
    logout: 'లాగౌట్',
    greeting: 'స్వాగతం',

    homeHeading: 'సైబర్ సేఫ్ - ఆన్‌లైన్ స్కామ్ అవగాహన పోర్టల్',
    homeSubheading: 'ఆన్‌లైన్‌లో సురక్షితంగా ఉండండి',
    homeDescription: 'ఫిషింగ్ దాడులు, OTP మోసాలు, పాస్‌వర్డ్ భద్రత మరియు సురక్షిత ఆన్‌లైన్ విధానాల గురించి తెలుసుకోండి.',
    stat1Value: '80%',
    stat1Label: 'ఫిషింగ్ దాడులు ఈమెయిళ్ళ ద్వారా జరుగుతాయి.',
    stat2Value: 'వేలాది మంది',
    stat2Label: 'ప్రతి సంవత్సరం OTP మోసాల వల్ల డబ్బును కోల్పోతున్నారు.',
    stat3Value: 'UPI మోసాలు',
    stat3Label: 'కేసులు వేగంగా పెరుగుతున్నాయి.',
    stat4Value: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్',
    stat4Label: '1930',
    startLearning: 'నేర్చుకోవడం ప్రారంభించండి',

    tabLogin: 'లాగిన్',
    tabRegister: 'కొత్త వినియోగదారు నమోదు',
    emailLabel: 'ఈమెయిల్ చిరునామా',
    emailPlaceholder: 'మీ ఈమెయిల్ నమోదు చేయండి',
    passwordLabel: 'పాస్‌వర్డ్',
    passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    confirmPasswordLabel: 'పాస్‌వర్డ్ నిర్ధారణ',
    confirmPasswordPlaceholder: 'పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి',
    nameLabel: 'పూర్తి పేరు',
    namePlaceholder: 'మీ పూర్తి పేరు నమోదు చేయండి',
    otpLabel: 'ధృవీకరణ కోడ్ (OTP)',
    otpPlaceholder: '8-అంకెల OTP నమోదు చేయండి',
    btnLogin: 'లాగిన్',
    btnGetOtp: 'OTP పొందండి',
    btnResendOtp: 'OTP మళ్లీ పంపండి',
    btnVerifyOtp: 'OTP ధృవీకరించండి',
    btnSetPassword: 'పాస్‌వర్డ్ సెట్ చేయండి',
    btnCancel: 'రద్దు చేయి',
    cooldownText: '{seconds} సెకన్లలో OTP మళ్లీ పంపవచ్చు',
    step1Title: 'దశ 1: ఖాతా వివరాలు',
    step2Title: 'దశ 2: ఈమెయిల్ ధృవీకరణ',
    step3Title: 'దశ 3: పాస్‌వర్డ్ అమరిక',
    step1Desc: 'ధృవీకరణ కోడ్ పొందడానికి మీ పేరు మరియు ఈమెయిల్‌ను నమోదు చేయండి.',
    step2Desc: 'మీ ఈమెయిల్‌కు పంపిన 8-అంకెల OTPని నమోదు చేయండి.',
    step3Desc: 'నమోదు పూర్తి చేయడానికి సురక్షిత పాస్‌వర్డ్‌ను సృష్టించండి.',
    passwordRequirement: 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు కలిగి ఉండాలి.',
    pwdStrengthLabel: 'పాస్‌వర్డ్ బలం',
    pwdStrengthWeak: 'బలహీనమైనది',
    pwdStrengthMedium: 'మధ్యస్థం',
    pwdStrengthStrong: 'బలమైనది',
    pwdRuleMinLength: '8 అక్షరాలు',
    pwdRuleUppercase: 'పెద్ద అక్షరం (A-Z) ఉపయోగించండి',
    pwdRuleLowercase: 'చిన్న అక్షరం (a-z) ఉపయోగించండి',
    pwdRuleNumber: 'సంఖ్యలను ఉపయోగించండి',
    pwdRuleSymbol: 'ప్రత్యేక చిహ్నాలను ఉపయోగించండి',
    errPasswordNotStrong: 'ఖాతాను సృష్టించడానికి పాస్‌వర్డ్ బలంగా ఉండాలి.',
    backToHome: 'పోర్టల్ హోమ్‌కు తిరిగి వెళ్లండి',
    stepAccount: 'ఖాతా',
    stepVerify: 'OTP ధృవీకరణ',
    stepPassword: 'పాస్‌వర్డ్',
    processing: 'ప్రాసెస్ చేస్తోంది...',
    sending: 'పంపుతోంది...',
    verifying: 'ధృవీకరిస్తోంది...',
    settingPassword: 'పాస్‌వర్డ్ సెట్ చేస్తోంది...',
    passwordsMatch: 'పాస్‌వర్డ్‌లు సరిపోలాయి',
    secureAuthNotice: 'ఎండ్-టు-ఎండ్ సురక్షిత ప్రామాణీకరణ',

    errInvalidEmail: 'సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.',
    errExistingEmail: 'ఈ ఈమెయిల్ ఇప్పటికే నమోదై ఉంది. దయచేసి లాగిన్ అవ్వండి.',
    errInvalidOtp: 'చెల్లని ధృవీకరణ కోడ్. దయచేసి తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    errExpiredOtp: 'ధృవీకరణ కోడ్ గడువు ముగిసింది. దయచేసి కొత్త OTPని అభ్యర్థించండి.',
    errOtpRateLimit: 'చాలా ఎక్కువ అభ్యర్థనలు. దయచేసి కొద్దిసేపు వేచి ఉండి ప్రయత్నించండి.',
    errPasswordLength: 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.',
    errPasswordMismatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు. దయచేసి సరిగ్గా నమోదు చేయండి.',
    errNetwork: 'నెట్‌వర్క్ లోపం. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్‌ను తనిఖీ చేయండి.',
    errAuthFailed: 'చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.',
    errDatabase: 'ప్రొఫైల్ సేవ్ చేయడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    errSessionExpired: 'మీ సెషన్ ముగిసింది. దయచేసి మళ్లీ లాగిన్ అవ్వండి.',
    otpSentSuccess: 'ధృవీకరణ కోడ్ మీ ఈమెయిల్‌కు పంపబడింది.',
    otpVerifiedSuccess: 'ఈమెయిల్ విజయవంతంగా ధృవీకరించబడింది. ఇప్పుడు పాస్‌వర్డ్‌ను సెట్ చేయండి.',
    regCompleteSuccess: 'నమోదు విజయవంతంగా పూర్తయింది!',
    loginSuccess: 'విజయవంతంగా లాగిన్ అయ్యారు.',

    modulesTitle: 'సైబర్ సెక్యూరిటీ లెర్నింగ్ మాడ్యూల్స్',
    progressTitle: 'మాడ్యూల్ పురోగతి',
    progressCompleted: '{completed}/4 పూర్తయింది ({percent}%)',
    moduleLabel: 'మాడ్యూల్',
    keyTakeaways: 'ముఖ్యమైన అంశాలు',
    transcriptLabel: 'ట్రాన్స్‌క్రిప్ట్',
    btnCompleted: 'పూర్తయిన మాడ్యూల్',
    btnComplete: 'మాడ్యూల్ పూర్తి చేయండి',
    btnMarkIncomplete: 'అసంపూర్ణంగా గుర్తించండి',
    btnCompletedTooltip: 'పూర్తయినట్లు గుర్తును తీసివేయడానికి క్లిక్ చేయండి',
    btnTakeQuiz: 'క్విజ్ ప్రారంభించండి',
    btnTakeQuizDisabledNotice: 'క్విజ్ తెరవడానికి మొత్తం 4 మాడ్యూళ్లను పూర్తి చేయండి.',
    allModulesCompletedNotice: 'అన్ని మాడ్యూల్స్ పూర్తయ్యాయి! క్విజ్ అన్‌లాక్ చేయబడింది.',
    clickToPlayVideo: 'వీడియో ప్లే చేయడానికి క్లిక్ చేయండి',
    saving: 'సేవ్ చేస్తోంది...',
    quizReadyPrompt: 'మీ పరిజ్ఞానాన్ని పరీక్షించడానికి సిద్ధంగా ఉన్నారా? 10 ప్రశ్నల స్కామ్ అవగాహన క్విజ్ రాయండి.',
    quizRemainingPrompt: 'క్విజ్ రాయడానికి ముందు ఇంకా {remaining} మాడ్యూల్(లు) పూర్తి చేయాలి.',
    badgeCompleted: 'పూర్తయింది',

    m1Title: 'ఫిషింగ్ వెబ్‌సైట్లు',
    m1Transcript: 'ఫిషింగ్ వెబ్‌సైట్‌లు నమ్మకమైన సంస్థల వలె కనిపించే మోసపూరిత వెబ్‌సైట్‌లు. వినియోగదారులను మోసం చేసి పాస్‌వర్డ్‌లు, బ్యాంకింగ్ వివరాలు మరియు వ్యక్తిగత డేటా వంటి సున్నితమైన సమాచారాన్ని దొంగిలించడానికి ఇవి ఉపయోగించబడతాయి.',
    m1Takeaways: [
      'వెబ్‌సైట్ URLను జాగ్రత్తగా తనిఖీ చేయండి.',
      'HTTPS మరియు సెక్యూరిటీ లాక్ చిహ్నం కోసం చూడండి.',
      'అనుమానాస్పద లేదా తెలియని లింక్‌లపై క్లిక్ చేయడం నివారించండి.',
      'పాస్‌వర్డ్‌లు నమోదు చేసే ముందు వెబ్‌సైట్ ప్రామాణికతను ధృవీకరించండి.'
    ],
    m1Btn: 'పూర్తయిన మాడ్యూల్',

    m2Title: 'బలమైన పాస్‌వర్డ్‌లు',
    m2Transcript: 'బలమైన పాస్‌వర్డ్‌లు పెద్ద అక్షరాలు, చిన్న అక్షరాలు, సంఖ్యలు మరియు ప్రత్యేక చిహ్నాల కలయికను కలిగి ఉంటాయి. ఇవి భద్రతను మెరుగుపరుస్తాయి మరియు అనధికారిక ప్రవేశ ప్రమాదాన్ని తగ్గిస్తాయి.',
    m2Takeaways: [
      'కనీసం 12 అక్షరాలను ఉపయోగించండి.',
      'పుట్టినరోజులు లేదా వ్యక్తిగత సమాచారాన్ని ఉపయోగించవద్దు.',
      'వేర్వేరు ఖాతాలలో ఒకే పాస్‌వర్డ్‌ను తిరిగి ఉపయోగించవద్దు.',
      'పాస్‌వర్డ్ మేనేజర్‌ను ఉపయోగించడాన్ని పరిగణించండి.'
    ],
    m2Btn: 'పూర్తయిన మాడ్యూల్',

    m3Title: 'OTP షేరింగ్ మోసాలు',
    m3Transcript: 'బ్యాంక్ ఉద్యోగులతో సహా ఎవరితోనూ OTPని ఎప్పుడూ పంచుకోకూడదు. బ్యాంకులు, RBI మరియు ఇతర ఆర్థిక సంస్థలు ఫోన్ కాల్స్, సందేశాలు లేదా ఈమెయిల్స్ ద్వారా ఎప్పుడూ OTPలను అడగవు.',
    m3Takeaways: [
      'ఎవరితోనూ OTPని పంచుకోవద్దు.',
      'అనుమానాస్పద కాల్స్ మరియు సందేశాలను విస్మరించండి.',
      'స్పందించే ముందు కాలర్ గుర్తింపును ధృవీకరించండి.',
      'బ్యాంకులు ఎప్పుడూ OTPలను అడగవు.'
    ],
    m3Btn: 'మాడ్యూల్ పూర్తి చేయండి',

    m4Title: 'UPI & QR కోడ్ మోసాలు',
    m4Transcript: 'మోసగాళ్ళు తరచుగా నకిలీ QR కోడ్‌లు, చెల్లింపు అభ్యర్థనలు మరియు UPI మోసాల ద్వారా వినియోగదారుల నుండి డబ్బును కాజేస్తారు. ఏదైనా చెల్లింపు చేసే ముందు ఎల్లప్పుడూ పంపినవారిని మరియు లావాదేవీ వివరాలను జాగ్రత్తగా ధృవీకరించండి.',
    m4Takeaways: [
      'చెల్లింపు పంపినవారి గుర్తింపును ధృవీకరించండి.',
      'లావాదేవీ వివరాలను జాగ్రత్తగా తనిఖీ చేయండి.',
      'తెలియని QR కోడ్‌లను స్కాన్ చేయడం నివారించండి.',
      'చెల్లించే ముందు చెల్లింపు అభ్యర్థనలను నిర్ధారించండి.'
    ],
    m4Btn: 'పూర్తయిన మాడ్యూల్',

    quizTitle: 'సైబర్ సెక్యూరిటీ అవగాహన క్విజ్',
    quizSubtitle: 'మీ అవగాహనను పరీక్షించడానికి మొత్తం 10 ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    quizNotice: 'సమర్పించే ముందు అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    btnSubmitQuiz: 'క్విజ్ సమర్పించండి',
    btnRetakeQuiz: 'మళ్లీ ప్రయత్నించండి',
    btnBackToModules: 'మాడ్యూల్స్‌కు తిరిగి వెళ్లండి',
    yourScore: 'మీ స్కోరు',
    correctAnswers: 'సరైన సమాధానాలు',
    totalQuestions: 'మొత్తం ప్రశ్నలు',
    quizIncompleteAlert: 'దయచేసి సమర్పించే ముందు మొత్తం 10 ప్రశ్నలకు సమాధానం ఇవ్వండి.',
    perfectScoreMessage: 'అద్భుతం! మీకు ఆన్‌లైన్ భద్రతపై పూర్తి అవగాహన ఉంది.',
    goodScoreMessage: 'మంచి ప్రయత్నం! భద్రతా పద్ధతులను బలోపేతం చేయడానికి పై ప్రశ్నలను సమీక్షించండి.',
    reviewAnswers: 'మీ సమాధానాలను సమీక్షించండి',
    quizResultHeading: 'ఫలితం',
    correctBadge: 'సరైనది',
    incorrectBadge: 'తప్పు',

    q1Question: 'SBI ప్రతినిధి అని చెప్పుకుంటూ ఎవరైనా OTP అడిగితే మీరు ఏమి చేయాలి?',
    q1Opt1: 'OTP చెప్పాలి',
    q1Opt2: 'OTP ఎప్పుడూ చెప్పకూడదు',

    q2Question: 'www.sbi-secure-login.xyz ఈ లింక్ సురక్షితమైనదా?',
    q2Opt1: 'సురక్షితమైనది',
    q2Opt2: 'మోసం (స్కామ్)',

    q3Question: 'వీటిలో ఏది బలమైన పాస్‌వర్డ్?',
    q3Opt1: '123456',
    q3Opt2: 'Cyber@Safe2025',

    q4Question: 'HTTPS అంటే ఏమిటి?',
    q4Opt1: 'సురక్షిత కనెక్షన్',
    q4Opt2: 'వైరస్',

    q5Question: 'అనుమానాస్పద ఈమెయిల్ వచ్చినప్పుడు మీరు ఏమి చేయాలి?',
    q5Opt1: 'తొలగించండి లేదా రిపోర్ట్ చేయండి',
    q5Opt2: 'అన్ని లింక్‌లపై క్లిక్ చేయండి',

    q6Question: 'బ్యాంకింగ్ లావాదేవీల కోసం పబ్లిక్ Wi-Fi ఉపయోగించడం సురక్షితమేనా?',
    q6Opt1: 'అవును',
    q6Opt2: 'కాదు',

    q7Question: 'ఏదైనా యాప్ డౌన్‌లోడ్ చేసుకునే ముందు మీరు ఏమి చేయాలి?',
    q7Opt1: 'రివ్యూలు మరియు డెవలపర్ మూలాన్ని తనిఖీ చేయండి',
    q7Opt2: 'వెంటనే డౌన్‌లోడ్ చేయండి',

    q8Question: 'వీటిలో ఏది మరింత సురక్షితమైనది?',
    q8Opt1: 'టూ-ఫ్యాక్టర్ ప్రామాణీకరణ (2FA)',
    q8Opt2: 'పాస్‌వర్డ్ మాత్రమే',

    q9Question: 'మీ ATM పిన్‌ను ఎవరితోనైనా పంచుకోవచ్చా?',
    q9Opt1: 'అవును',
    q9Opt2: 'ఎప్పుడూ చెప్పకూడదు (కాదు)',

    q10Question: 'ఫిషింగ్ అంటే ఏమిటి?',
    q10Opt1: 'సమాచారం దొంగిలించడానికి చేసే ఆన్‌లైన్ మోసం',
    q10Opt2: 'ఒక రకమైన యాంటీవైరస్ సాఫ్ట్‌వేర్',

    footerNotice: 'పబ్లిక్ సైబర్ సెక్యూరిటీ అవగాహన పోర్టల్. సైబర్ మోసం జరిగితే వెంటనే 1930 కు ఫిర్యాదు చేయండి.',
    helplineNotice: 'జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్',
    nationalPortal: 'cybercrime.gov.in'
  },

  hi: {
    siteTitle: 'साइबर सेफ',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    greeting: 'स्वागत है',

    homeHeading: 'साइबर सेफ - ऑनलाइन स्कैम जागरूकता पोर्टल',
    homeSubheading: 'ऑनलाइन सुरक्षित रहें',
    homeDescription: 'फ़िशिंग हमलों, ओटीपी घोटालों, पासवर्ड सुरक्षा और सुरक्षित ऑनलाइन प्रथाओं के बारे में जानें।',
    stat1Value: '80%',
    stat1Label: 'फ़िशिंग हमले ईमेल के माध्यम से होते हैं।',
    stat2Value: 'हजारों लोग',
    stat2Label: 'हर साल ओटीपी घोटालों के कारण पैसे गंवाते हैं।',
    stat3Value: 'यूपीआई धोखाधड़ी',
    stat3Label: 'मामले तेजी से बढ़ रहे हैं।',
    stat4Value: 'साइबर अपराध हेल्पलाइन',
    stat4Label: '1930',
    startLearning: 'सीखना शुरू करें',

    tabLogin: 'लॉग इन',
    tabRegister: 'नया उपयोगकर्ता पंजीकरण',
    emailLabel: 'ईमेल पता',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'पासवर्ड पुनः दर्ज करें',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    otpLabel: 'सत्यापन कोड (OTP)',
    otpPlaceholder: '8-अंकों का OTP दर्ज करें',
    btnLogin: 'लॉग इन',
    btnGetOtp: 'ओटीपी प्राप्त करें',
    btnResendOtp: 'ओटीपी पुनः भेजें',
    btnVerifyOtp: 'ओटीपी सत्यापित करें',
    btnSetPassword: 'पासवर्ड सेट करें',
    btnCancel: 'रद्द करें',
    cooldownText: '{seconds} सेकंड में OTP पुनः भेजें',
    step1Title: 'चरण 1: खाता विवरण',
    step2Title: 'चरण 2: ईमेल सत्यापन',
    step3Title: 'चरण 3: पासवर्ड सेट करें',
    step1Desc: 'सत्यापन कोड प्राप्त करने के लिए अपना नाम और ईमेल दर्ज करें।',
    step2Desc: 'अपने ईमेल पर भेजा गया 8-अंकों का OTP दर्ज करें।',
    step3Desc: 'पंजीकरण पूरा करने के लिए एक सुरक्षित पासवर्ड बनाएं।',
    passwordRequirement: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए।',
    pwdStrengthLabel: 'पासवर्ड की मजबूती',
    pwdStrengthWeak: 'कमजोर',
    pwdStrengthMedium: 'मध्यम',
    pwdStrengthStrong: 'मजबूत',
    pwdRuleMinLength: '8 वर्ण',
    pwdRuleUppercase: 'बड़ा अक्षर (A-Z) का प्रयोग करें',
    pwdRuleLowercase: 'छोटा अक्षर (a-z) का प्रयोग करें',
    pwdRuleNumber: 'संख्याओं का प्रयोग करें',
    pwdRuleSymbol: 'चिह्नों का प्रयोग करें',
    errPasswordNotStrong: 'खाता बनाने के लिए पासवर्ड मजबूत होना चाहिए।',
    backToHome: 'पोर्टल होम पर वापस जाएं',
    stepAccount: 'खाता',
    stepVerify: 'ओटीपी सत्यापन',
    stepPassword: 'पासवर्ड',
    processing: 'प्रक्रिया जारी है...',
    sending: 'भेजा जा रहा है...',
    verifying: 'सत्यापित किया जा रहा है...',
    settingPassword: 'पासवर्ड सेट किया जा रहा है...',
    passwordsMatch: 'पासवर्ड मेल खाते हैं',
    secureAuthNotice: 'एंड-टू-एंड सुरक्षित प्रमाणीकरण',

    errInvalidEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    errExistingEmail: 'यह ईमेल पहले से पंजीकृत है। कृपया लॉग इन करें।',
    errInvalidOtp: 'अमान्य सत्यापन कोड। कृपया जांचें और पुनः प्रयास करें।',
    errExpiredOtp: 'सत्यापन कोड की समय सीमा समाप्त हो गई है। नया OTP मांगें।',
    errOtpRateLimit: 'बहुत अधिक अनुरोध। कृपया कुछ समय प्रतीक्षा करें।',
    errPasswordLength: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए।',
    errPasswordMismatch: 'पासवर्ड मेल नहीं खाते। कृपया पुनः सावधानी से दर्ज करें।',
    errNetwork: 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।',
    errAuthFailed: 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।',
    errDatabase: 'प्रोफाइल सहेजने में विफल। कृपया पुनः प्रयास करें।',
    errSessionExpired: 'आपका सत्र समाप्त हो गया है। कृपया पुनः लॉग इन करें।',
    otpSentSuccess: 'सत्यापन कोड आपके ईमेल पर भेज दिया गया है।',
    otpVerifiedSuccess: 'ईमेल सफलतापूर्वक सत्यापित हुआ। अब अपना पासवर्ड बनाएं।',
    regCompleteSuccess: 'पंजीकरण सफलतापूर्वक पूरा हुआ!',
    loginSuccess: 'सफलतापूर्वक लॉग इन हुए।',

    modulesTitle: 'साइबर सुरक्षा लर्निंग मॉड्यूल',
    progressTitle: 'मॉड्यूल प्रगति',
    progressCompleted: '{completed}/4 पूर्ण ({percent}%)',
    moduleLabel: 'मॉड्यूल',
    keyTakeaways: 'मुख्य बिंदु',
    transcriptLabel: 'प्रतिलेख (Transcript)',
    btnCompleted: 'पूर्ण किया गया मॉड्यूल',
    btnComplete: 'मॉड्यूल पूरा करें',
    btnMarkIncomplete: 'अपूर्ण करने के लिए क्लिक करें',
    btnCompletedTooltip: 'पूर्ण किए गए को हटाने के लिए क्लिक करें',
    btnTakeQuiz: 'प्रश्नोत्तरी शुरू करें',
    btnTakeQuizDisabledNotice: 'प्रश्नोत्तरी अनलॉक करने के लिए सभी 4 मॉड्यूल पूरे करें।',
    allModulesCompletedNotice: 'सभी मॉड्यूल पूरे हो गए! प्रश्नोत्तरी अब अनलॉक हो गई है।',
    clickToPlayVideo: 'वीडियो चलाने के लिए क्लिक करें',
    saving: 'सहेजा जा रहा है...',
    quizReadyPrompt: 'अपने ज्ञान का परीक्षण करने के लिए तैयार हैं? 10-प्रश्नों की धोखाधड़ी जागरूकता प्रश्नोत्तरी लें।',
    quizRemainingPrompt: 'प्रश्नोत्तरी लेने से पहले {remaining} और मॉड्यूल पूरा करना होगा।',
    badgeCompleted: 'पूर्ण',

    m1Title: 'फ़िशिंग वेबसाइट्स',
    m1Transcript: 'फ़िशिंग वेबसाइटें वे धोखाधड़ी वाली वेबसाइटें हैं जिन्हें विश्वसनीय संगठनों की नकल करने और उपयोगकर्ताओं को पासवर्ड, बैंकिंग विवरण और व्यक्तिगत डेटा जैसी संवेदनशील जानकारी प्रकट करने के लिए डिज़ाइन किया गया है।',
    m1Takeaways: [
      'वेबसाइट का URL ध्यान से जांचें।',
      'HTTPS और सुरक्षा लॉक आइकन देखें।',
      'संदिग्ध या अज्ञात लिंक पर क्लिक करने से बचें।',
      'पासवर्ड दर्ज करने से पहले वेबसाइट की प्रामाणिकता सत्यापित करें।'
    ],
    m1Btn: 'पूर्ण किया गया मॉड्यूल',

    m2Title: 'मजबूत पासवर्ड',
    m2Transcript: 'मजबूत पासवर्ड सुरक्षा बढ़ाने और अनधिकृत पहुंच के जोखिम को कम करने के लिए बड़े अक्षरों, छोटे अक्षरों, संख्याओं और विशेष चिह्नों के संयोजन का उपयोग करते हैं।',
    m2Takeaways: [
      'कम से कम 12 वर्णों का उपयोग करें।',
      'जन्मदिन या व्यक्तिगत जानकारी का उपयोग करने से बचें।',
      'विभिन्न खातों में एक ही पासवर्ड का पुनः उपयोग न करें।',
      'पासवर्ड मैनेजर का उपयोग करने पर विचार करें।'
    ],
    m2Btn: 'पूर्ण किया गया मॉड्यूल',

    m3Title: 'ओटीपी शेयरिंग धोखाधड़ी',
    m3Transcript: 'बैंक कर्मचारियों सहित किसी के साथ भी कभी ओटीपी साझा नहीं किया जाना चाहिए। बैंक, आरबीआई और अन्य वित्तीय संस्थान कभी भी फोन कॉल, मैसेज या ईमेल पर ग्राहकों से ओटीपी नहीं मांगते हैं।',
    m3Takeaways: [
      'किसी के साथ भी OTP साझा न करें।',
      'संदिग्ध कॉल और संदेशों को अनदेखा करें।',
      'जवाब देने से पहले कॉलर की पहचान सत्यापित करें।',
      'बैंक कभी भी OTP नहीं मांगते।'
    ],
    m3Btn: 'मॉड्यूल पूरा करें',

    m4Title: 'यूपीआई और क्यूआर कोड धोखाधड़ी',
    m4Transcript: 'धोखेबाज अक्सर उपयोगकर्ताओं से पैसे चुराने के लिए नकली क्यूआर कोड, भुगतान अनुरोध और यूपीआई घोटालों का उपयोग करते हैं। कोई भी भुगतान करने से पहले हमेशा प्राप्तकर्ता और लेनदेन के विवरण को सत्यापित करें।',
    m4Takeaways: [
      'भेजने वाले की पहचान सत्यापित करें।',
      'लेनदेन के विवरण की सावधानीपूर्वक जांच करें।',
      'अज्ञात QR कोड स्कैन करने से बचें।',
      'भुगतान करने से पहले भुगतान अनुरोध की पुष्टि करें।'
    ],
    m4Btn: 'पूर्ण किया गया मॉड्यूल',

    quizTitle: 'साइबर सुरक्षा जागरूकता प्रश्नोत्तरी',
    quizSubtitle: 'अपनी जागरूकता का परीक्षण करने के लिए सभी 10 प्रश्नों के उत्तर दें।',
    quizNotice: 'कृपया जमा करने से पहले सभी प्रश्नों के उत्तर दें।',
    btnSubmitQuiz: 'प्रश्नोत्तरी जमा करें',
    btnRetakeQuiz: 'पुनः प्रयास करें',
    btnBackToModules: 'मॉड्यूल पर वापस जाएं',
    yourScore: 'आपका स्कोर',
    correctAnswers: 'सही उत्तर',
    totalQuestions: 'कुल प्रश्न',
    quizIncompleteAlert: 'कृपया जमा करने से पहले सभी 10 प्रश्नों के उत्तर दें।',
    perfectScoreMessage: 'उत्कृष्ट! आपको ऑनलाइन धोखाधड़ी सुरक्षा की बहुत अच्छी समझ है।',
    goodScoreMessage: 'अच्छा प्रयास! सुरक्षित प्रथाओं को सुदृढ़ करने के लिए ऊपर दिए गए प्रश्नों की समीक्षा करें।',
    reviewAnswers: 'अपने उत्तरों की समीक्षा करें',
    quizResultHeading: 'परिणाम',
    correctBadge: 'सही',
    incorrectBadge: 'गलत',

    q1Question: 'एसबीआई से होने का दावा करते हुए कोई आपसे ओटीपी मांगता है तो आप क्या करेंगे?',
    q1Opt1: 'ओटीपी साझा करें',
    q1Opt2: 'ओटीपी कभी साझा न करें',

    q2Question: 'www.sbi-secure-login.xyz क्या यह सुरक्षित है?',
    q2Opt1: 'सुरक्षित',
    q2Opt2: 'धोखाधड़ी (स्कैम)',

    q3Question: 'इनमें से कौन सा एक मजबूत पासवर्ड है?',
    q3Opt1: '123456',
    q3Opt2: 'Cyber@Safe2025',

    q4Question: 'HTTPS का क्या अर्थ है?',
    q4Opt1: 'सुरक्षित कनेक्शन',
    q4Opt2: 'वायरस',

    q5Question: 'यदि आपको कोई संदिग्ध ईमेल प्राप्त होता है तो आपको क्या करना चाहिए?',
    q5Opt1: 'हटाएं या रिपोर्ट करें',
    q5Opt2: 'सभी लिंक पर क्लिक करें',

    q6Question: 'क्या बैंकिंग के लिए सार्वजनिक वाई-फाई का उपयोग करना सुरक्षित है?',
    q6Opt1: 'हाँ',
    q6Opt2: 'नहीं',

    q7Question: 'कोई ऐप डाउनलोड करने से पहले आपको क्या करना चाहिए?',
    q7Opt1: 'समीक्षाएं और आधिकारिक स्रोत जांचें',
    q7Opt2: 'तुरंत डाउनलोड करें',

    q8Question: 'इनमें से कौन अधिक सुरक्षित है?',
    q8Opt1: 'टू-फैक्टर प्रमाणीकरण (2FA)',
    q8Opt2: 'केवल पासवर्ड',

    q9Question: 'क्या आपको अपना एटीएम पिन किसी के साथ साझा करना चाहिए?',
    q9Opt1: 'हाँ',
    q9Opt2: 'कभी नहीं (नहीं)',

    q10Question: 'फ़िशिंग क्या है?',
    q10Opt1: 'जानकारी चुराने का एक ऑनलाइन घोटाला',
    q10Opt2: 'एक प्रकार का एंटीवायरस सॉफ्टवेयर',

    footerNotice: 'सार्वजनिक साइबर सुरक्षा जागरूकता पोर्टल। साइबर धोखाधड़ी के मामले में तुरंत 1930 पर रिपोर्ट करें।',
    helplineNotice: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग हेल्पलाइन',
    nationalPortal: 'cybercrime.gov.in'
  }
};
