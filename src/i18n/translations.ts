import { Language } from '../types';

export interface Translations {
  // Navigation
  siteTitle: string;
  login: string;
  logout: string;
  greeting: string;
  navHome: string;
  navLinkSafety: string;
  navMessageSafety: string;
  navPasswordChecker: string;
  navModules: string;
  navDashboard: string;
  btnBack: string;
  btnForward: string;

  // Link Safety Checker
  lsBadge: string;
  lsTitle: string;
  lsDesc: string;
  lsInputLabel: string;
  lsInputPlaceholder: string;
  lsCooldownNote: string;
  lsBtnCheck: string;
  lsBtnChecking: string;
  lsLoadingTitle: string;
  lsLoading1: string;
  lsLoading2: string;
  lsLoading3: string;
  lsLoading4: string;
  lsLoading5: string;
  lsReportTitle: string;
  lsCachedBadge: string;
  lsRequestFresh: string;
  lsSubmittedUrl: string;
  lsDetectedCategories: string;
  lsSummaryTitle: string;
  lsEvidenceTitle: string;
  lsLimitationsTitle: string;
  lsLimitationsNote: string;

  // Message Safety Checker
  msBadge: string;
  msTitle: string;
  msDesc: string;
  msInputLabel: string;
  msInputPlaceholder: string;
  msPrivacyNote: string;
  msBtnCheck: string;
  msBtnChecking: string;
  msLoadingTitle: string;
  msLoading1: string;
  msLoading2: string;
  msLoading3: string;
  msLoading4: string;
  msReportTitle: string;
  msClassification: string;
  msCategoriesTitle: string;
  msPhrasesTitle: string;
  msFindingsTitle: string;
  msRecommendationsTitle: string;
  msOtpWarning: string;

  // Common Checker Strings
  riskCritical: string;
  riskHigh: string;
  riskMedium: string;
  riskLow: string;
  riskUnknown: string;
  cooldownWait: string;
  analysisError: string;
  errUrlEmpty: string;
  errUrlLong: string;
  errUrlScheme: string;
  errUrlInvalid: string;
  errMessageEmpty: string;
  errMessageLong: string;
  recently: string;
  minsAgo: string;
  btnClear: string;
  clearUrlAria: string;

  // Password Checker
  pwdCheckerBadge: string;
  pwdCheckerTitle: string;
  pwdCheckerDesc: string;
  pwdInputLabel: string;
  pwdPlaceholder: string;
  pwdCriteriaTitle: string;
  pwdCritMinLength: string;
  pwdCritUppercase: string;
  pwdCritLowercase: string;
  pwdCritNumber: string;
  pwdCritSymbol: string;
  pwdStrongBannerTitle: string;
  pwdStrongBannerDesc: string;
  pwdSuggestionsTitle: string;
  pwdViewAllSuggestions: string;
  pwdHideAllSuggestions: string;
  pwdScoreVeryStrong: string;
  pwdScoreStrong: string;
  pwdScoreMedium: string;
  pwdScoreWeak: string;

  // Home Page
  homeHeading: string;
  homeSubheading: string;
  homeDescription: string;
  homeHeroTitle: string;
  homeHeroDesc: string;
  homeExploreTools: string;
  homeToolsTitle: string;
  homeToolsSubtitle: string;
  homeAwarenessTitle: string;
  homeHelpTitle: string;
  homeHelpDesc: string;
  homeCallHelpline: string;
  homeReportPortal: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;
  startLearning: string;
  homeTrustBadge: string;
  homeHowItWorksTitle: string;
  homeStep1Title: string;
  homeStep1Desc: string;
  homeStep2Title: string;
  homeStep2Desc: string;
  homeStep3Title: string;
  homeStep3Desc: string;
  homeModulesBannerTitle: string;
  homeModulesBannerDesc: string;

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

  // Forgot Password
  forgotPassword: string;
  resetPasswordTitle: string;
  resetPasswordDesc: string;
  btnResetPassword: string;
  backToLogin: string;
  errEmailNotFound: string;
  passwordResetSuccess: string;
  newPasswordLabel: string;
  confirmNewPasswordLabel: string;
  changeEmail: string;

  // Modules Page
  modulesTitle: string;
  modulesSubtitle: string;
  progressTitle: string;
  progressCompleted: string;
  moduleLabel: string;
  keyTakeaways: string;
  transcriptLabel: string;
  btnCompleted: string;
  btnComplete: string;
  btnMarkIncomplete: string;
  btnCompletedTooltip: string;
  btnPrevModule: string;
  btnNextModule: string;
  btnTakeQuiz: string;
  btnTakeQuizDisabledNotice: string;
  allModulesCompletedNotice: string;
  clickToPlayVideo: string;
  viewFullTranscript: string;
  hideTranscript: string;
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
  btnBackToHome: string;
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
  unattemptedBadge: string;
  quizHighestScore: string;
  quizNewHighestScore: string;

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
  footerMission: string;
  footerSecurityTools: string;
  footerLearningPlatform: string;
  footerQuizAssessment: string;
  footerAdminDashboard: string;
  footerEmergencySupport: string;
  footerHelplineTitle: string;
  footerHelplineDesc: string;
  footerCopyrightNotice: string;

  // Admin / Dashboard
  adminLoginTitle: string;
  adminIdLabel: string;
  adminPasswordLabel: string;
  adminSignInBtn: string;
  adminVerifying: string;
  adminLoginErrorRequired: string;
  adminLoginErrorInvalid: string;
  adminLoginErrorSessionExpired: string;
  adminLoginErrorGeneric: string;
  adminDashboardTitle: string;
  adminRefreshBtn: string;
  adminLogoutBtn: string;
  adminRetryBtn: string;
  adminTotalUsers: string;
  adminTotalModules: string;
  adminFullyCompletedUsers: string;
  adminSummaryHeading: string;
  adminRegisteredUsers: string;
  adminSearchPlaceholder: string;
  adminFilterAll: string;
  adminFilterCompleted: string;
  adminFilterInProgress: string;
  adminFilterNotStarted: string;
  adminLoadingUsers: string;
  adminNoUsers: string;
  adminNoMatchingUsers: string;
  adminClearSearch: string;
  adminTableName: string;
  adminTableEmail: string;
  adminTableProgress: string;
  adminTableQuizScore: string;
  adminQuizNotAttempted: string;
  adminToggleScoreSort: string;
  adminAvgQuizScore: string;
  adminQuizzesAttempted: string;
  adminModulesCount: string;
  adminShowPassword: string;
  adminHidePassword: string;
  adminToggleSort: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    siteTitle: 'Cyber Safe',
    login: 'Login',
    logout: 'Logout',
    greeting: 'Welcome',
    navHome: 'Home',
    navLinkSafety: 'Link Safety',
    navMessageSafety: 'Message Safety',
    navPasswordChecker: 'Password Checker',
    navModules: 'Modules',
    navDashboard: 'Dashboard',
    btnBack: 'Go back to previous page',
    btnForward: 'Go forward to next page',

    // Link Safety Checker
    lsBadge: 'AI-Assisted Threat Intelligence',
    lsTitle: 'Link Safety Checker',
    lsDesc: 'Verify websites and suspicious links before clicking. Detect domain spoofing, fake login pages, and phishing traps.',
    lsInputLabel: 'Website or Link URL',
    lsInputPlaceholder: 'e.g. sbi-kyc-update.com or https://example.com',
    lsCooldownNote: '1 fresh analysis allowed every 30 seconds • No login required',
    lsBtnCheck: 'Check Link Safety',
    lsBtnChecking: 'Analyzing...',
    lsLoadingTitle: 'Evaluating Link Security',
    lsLoading1: 'Validating and normalizing submitted URL...',
    lsLoading2: 'Evaluating domain structure and brand indicators...',
    lsLoading3: 'Checking for suspicious phishing and fraud patterns...',
    lsLoading4: 'Evaluating potential security risks...',
    lsLoading5: 'Preparing your security assessment...',
    lsReportTitle: 'Analysis Report',
    lsCachedBadge: 'Cached Result ({time})',
    lsRequestFresh: 'Request Fresh Analysis',
    lsSubmittedUrl: 'Submitted URL',
    lsDetectedCategories: 'Detected Categories',
    lsSummaryTitle: 'Summary & Explanation',
    lsEvidenceTitle: 'Observable Evidence & Risk Indicators',
    lsLimitationsTitle: 'Important Scope & Limitations',
    lsLimitationsNote: 'Note: Do not enter financial credentials or sensitive passwords on unverified domains.',

    // Message Safety Checker
    msBadge: 'AI-Assisted Fraud Detection',
    msTitle: 'Message Safety Checker',
    msDesc: 'Analyze suspicious SMS, WhatsApp forwards, and emails. Detect urgency pressure, lottery lures, and OTP fraud.',
    msInputLabel: 'Suspicious Message Text',
    msInputPlaceholder: 'Paste the suspicious SMS, WhatsApp message, email, or alert text here...',
    msPrivacyNote: 'Message content is processed securely and never persisted • No login required',
    msBtnCheck: 'Check Message Safety',
    msBtnChecking: 'Analyzing...',
    msLoadingTitle: 'Evaluating Message Content',
    msLoading1: 'Analyzing message content and structure...',
    msLoading2: 'Looking for suspicious urgency and fraud language...',
    msLoading3: 'Evaluating possible scam indicators...',
    msLoading4: 'Preparing your security assessment...',
    msReportTitle: 'Assessment Report',
    msClassification: 'Overall Classification',
    msCategoriesTitle: 'Detected Scam Category',
    msPhrasesTitle: 'Suspicious Indicators & Phrases',
    msFindingsTitle: 'Detailed Findings',
    msRecommendationsTitle: 'Recommended Precautions',
    msOtpWarning: 'Never share your banking OTP, MPIN, or passwords with anyone, even if the caller claims to represent bank officials or police.',

    // Common Checker Strings
    riskCritical: 'Critical Risk',
    riskHigh: 'High Risk',
    riskMedium: 'Medium Risk',
    riskLow: 'Low Risk',
    riskUnknown: 'Unknown Risk',
    cooldownWait: 'Please wait {seconds} seconds before checking again.',
    analysisError: 'Analysis Error',
    errUrlEmpty: 'Please enter a website URL to analyze.',
    errUrlLong: 'URL exceeds maximum length of 2048 characters.',
    errUrlScheme: 'Unsupported URL protocol. Only standard HTTP and HTTPS links are allowed.',
    errUrlInvalid: 'Please enter a valid website URL (e.g. example.com or https://example.com).',
    errMessageEmpty: 'Please paste or type a suspicious message to analyze.',
    errMessageLong: 'Message exceeds the maximum length of 5000 characters.',
    recently: 'recently',
    minsAgo: '{mins} min{plural} ago',
    btnClear: 'Clear',
    clearUrlAria: 'Clear URL',

    // Password Checker
    pwdCheckerBadge: 'Real-Time Cryptographic Evaluation',
    pwdCheckerTitle: 'Password Strength Checker',
    pwdCheckerDesc: 'Evaluate your password strength in real-time. Check entropy, complexity criteria, and instant security tips.',
    pwdInputLabel: 'Enter Password to Test',
    pwdPlaceholder: 'Type a password (e.g. MySecret#2026)',
    pwdCriteriaTitle: 'Password Requirements',
    pwdCritMinLength: 'At least 8 characters',
    pwdCritUppercase: 'Uppercase letter (A-Z)',
    pwdCritLowercase: 'Lowercase letter (a-z)',
    pwdCritNumber: 'Number (0-9)',
    pwdCritSymbol: 'Special symbol (!@#$%^&*...)',
    pwdStrongBannerTitle: 'Password is Strong!',
    pwdStrongBannerDesc: 'Here are targeted suggestions to advance your security even further:',
    pwdSuggestionsTitle: 'Security Recommendations',
    pwdViewAllSuggestions: 'View All 30 Predefined Security Suggestions',
    pwdHideAllSuggestions: 'Hide Suggestions List',
    pwdScoreVeryStrong: 'Very Strong',
    pwdScoreStrong: 'Strong',
    pwdScoreMedium: 'Medium',
    pwdScoreWeak: 'Weak',

    homeHeading: 'Cyber Safe - Online Scam Awareness Portal',
    homeSubheading: 'Stay Safe Online',
    homeDescription: 'Learn about phishing attacks, OTP scams, password security and safe online practices.',
    homeHeroTitle: 'Stay Safe in a Digital World',
    homeHeroDesc: 'Check suspicious links, analyze scam messages, and strengthen your passwords with simple online security tools.',
    homeExploreTools: 'Explore Security Tools',
    homeToolsTitle: 'Your Security Tools',
    homeToolsSubtitle: 'Quick checks to help you stay safer online.',
    homeAwarenessTitle: 'Cyber Threat Awareness',
    homeHelpTitle: 'Need Help With Cyber Fraud?',
    homeHelpDesc: 'If you suspect financial cyber fraud, contact the cybercrime helpline promptly or use the official reporting portal.',
    homeCallHelpline: 'Call 1930',
    homeReportPortal: 'Report Cybercrime',
    stat1Value: '80%',
    stat1Label: 'Phishing attacks happen through emails.',
    stat2Value: 'Thousands',
    stat2Label: 'Lose money due to OTP scams every year.',
    stat3Value: 'UPI Fraud',
    stat3Label: 'Cases are increasing rapidly.',
    stat4Value: 'Cyber Crime Helpline',
    stat4Label: '1930',
    startLearning: 'Start Learning',
    homeTrustBadge: 'Public Cybersecurity & Scam Defense',
    homeHowItWorksTitle: 'How Cyber Safe Protects You',
    homeStep1Title: '1. Paste Link, Message or Password',
    homeStep1Desc: 'Enter suspicious links, paste forwarded texts, or evaluate a password safely in real-time.',
    homeStep2Title: '2. Instant Threat Analysis',
    homeStep2Desc: 'Our intelligent scanner checks for phishing signatures, deceptive lookalikes, and scam urgency lures.',
    homeStep3Title: '3. Actionable Safety Guidance',
    homeStep3Desc: 'Receive a clear threat classification, identified fraud tactics, and practical steps to stay protected.',
    homeModulesBannerTitle: 'Build Your Cyber Resilience Skills',
    homeModulesBannerDesc: 'Take our 4 interactive awareness modules with curated videos, core takeaways, and short quizzes.',

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
    otpPlaceholder: 'Enter 6-digit OTP',
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
    step2Desc: 'Enter the 6-digit OTP sent to your email address.',
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
    secureAuthNotice: 'End-to-End Secure Authentication',

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

    forgotPassword: 'Forgot Password?',
    resetPasswordTitle: 'Reset Password',
    resetPasswordDesc: 'Enter your registered email address to receive a 6-digit verification code.',
    btnResetPassword: 'Set New Password',
    backToLogin: 'Back to Login',
    errEmailNotFound: 'No registered account found with this email address.',
    passwordResetSuccess: 'Password changed successfully! Redirecting...',
    newPasswordLabel: 'New Password',
    confirmNewPasswordLabel: 'Confirm New Password',
    changeEmail: 'Change email',

    modulesTitle: 'Cybersecurity Learning Modules',
    modulesSubtitle: 'Master essential digital safety skills through step-by-step interactive lessons and practical safety guides.',
    progressTitle: 'Module Progress',
    progressCompleted: '{completed}/4 completed ({percent}%)',
    moduleLabel: 'Module',
    keyTakeaways: 'Key Takeaways',
    transcriptLabel: 'Transcript',
    btnCompleted: 'Completed Module',
    btnComplete: 'Complete Module',
    btnMarkIncomplete: 'Click to Uncomplete',
    btnCompletedTooltip: 'Click to unmark as completed',
    btnPrevModule: 'Previous Module',
    btnNextModule: 'Next Module',
    btnTakeQuiz: 'Take Quiz',
    btnTakeQuizDisabledNotice: 'Complete all 4 modules to unlock the quiz.',
    allModulesCompletedNotice: 'All modules completed! The quiz is now unlocked.',
    clickToPlayVideo: 'Click to Play Video',
    viewFullTranscript: 'Read Full Transcript',
    hideTranscript: 'Hide Transcript',
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
    btnBackToHome: 'Back to Home',
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
    unattemptedBadge: 'Unanswered',
    quizHighestScore: 'Highest Score',
    quizNewHighestScore: 'New Highest Score!',

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
    nationalPortal: 'cybercrime.gov.in',
    footerMission: 'Public awareness portal empowering citizens with actionable cybersecurity education and real-time scam verification tools.',
    footerSecurityTools: 'Security Tools',
    footerLearningPlatform: 'Learning & Platform',
    footerQuizAssessment: 'Quiz & Assessment',
    footerAdminDashboard: 'Admin Dashboard',
    footerEmergencySupport: 'Emergency Support',
    footerHelplineTitle: '1930 Helpline',
    footerHelplineDesc: 'Toll-free 24x7 reporting',
    footerCopyrightNotice: 'Non-commercial public cybersecurity awareness initiative.',

    adminLoginTitle: 'Admin Login',
    adminIdLabel: 'Admin ID',
    adminPasswordLabel: 'Password',
    adminSignInBtn: 'Sign In',
    adminVerifying: 'Verifying...',
    adminLoginErrorRequired: 'Please enter both Admin ID and Password.',
    adminLoginErrorInvalid: 'Invalid Admin ID or Password. Please try again.',
    adminLoginErrorSessionExpired: 'Admin session expired or invalid credentials. Please log in again.',
    adminLoginErrorGeneric: 'An error occurred while signing in. Please try again.',
    adminDashboardTitle: 'Admin Dashboard',
    adminRefreshBtn: 'Refresh',
    adminLogoutBtn: 'Logout',
    adminRetryBtn: 'Retry',
    adminTotalUsers: 'Total Users',
    adminTotalModules: 'Total Modules',
    adminFullyCompletedUsers: 'Fully Completed Users',
    adminSummaryHeading: 'Summary',
    adminRegisteredUsers: 'Registered Users',
    adminSearchPlaceholder: 'Search name or email...',
    adminFilterAll: 'All',
    adminFilterCompleted: 'Completed',
    adminFilterInProgress: 'In Progress',
    adminFilterNotStarted: 'Not Started',
    adminLoadingUsers: 'Loading user progress records...',
    adminNoUsers: 'No registered users found',
    adminNoMatchingUsers: 'No matching users',
    adminClearSearch: 'Clear search',
    adminTableName: 'Name',
    adminTableEmail: 'Email',
    adminTableProgress: 'Progress',
    adminTableQuizScore: 'Highest Quiz Score',
    adminQuizNotAttempted: 'Not Attempted',
    adminToggleScoreSort: 'Toggle score sort',
    adminAvgQuizScore: 'Avg Highest Score',
    adminQuizzesAttempted: 'Quizzes Taken',
    adminModulesCount: '{completed} / {total} modules',
    adminShowPassword: 'Show password',
    adminHidePassword: 'Hide password',
    adminToggleSort: 'Toggle alphabetical sort'
  },

  te: {
    siteTitle: 'సైబర్ సేఫ్',
    login: 'లాగిన్',
    logout: 'లాగౌట్',
    greeting: 'స్వాగతం',
    navHome: 'హోమ్',
    navLinkSafety: 'లింక్ భద్రత',
    navMessageSafety: 'సందేశ భద్రత',
    navPasswordChecker: 'పాస్‌వర్డ్ తనిఖీ',
    navModules: 'మాడ్యూల్స్',
    navDashboard: 'డాష్‌బోర్డ్',
    btnBack: 'మునుపటి పేజీకి వెళ్లండి',
    btnForward: 'తదుపరి పేజీకి వెళ్లండి',

    // Link Safety Checker
    lsBadge: 'AI-సహాయక ముప్పు సమాచారం',
    lsTitle: 'లింక్ భద్రతా తనిఖీ',
    lsDesc: 'క్లిక్ చేయడానికి ముందు వెబ్‌సైట్‌లు మరియు లింక్‌లను తనిఖీ చేయండి. నకిలీ లాగిన్ పేజీలు మరియు ఫిషింగ్ ట్రాప్‌లను గుర్తించండి.',
    lsInputLabel: 'వెబ్‌సైట్ లేదా లింక్ URL',
    lsInputPlaceholder: 'ఉదా: sbi-kyc-update.com లేదా https://example.com',
    lsCooldownNote: 'ప్రతి 30 సెకన్లకు 1 సారి మాత్రమే తనిఖీ అనుమతించబడుతుంది • లాగిన్ అవసరం లేదు',
    lsBtnCheck: 'లింక్ భద్రతను తనిఖీ చేయండి',
    lsBtnChecking: 'విశ్లేషిస్తోంది...',
    lsLoadingTitle: 'లింక్ భద్రతను అంచనా వేస్తోంది',
    lsLoading1: 'సమర్పించిన URLని ధృవీకరిస్తోంది...',
    lsLoading2: 'డొమైన్ నిర్మాణం మరియు బ్రాండ్ సూచికలను అంచనా వేస్తోంది...',
    lsLoading3: 'అనుమానాస్పద ఫిషింగ్ మరియు మోసపూరిత నమూనాలను తనిఖీ చేస్తోంది...',
    lsLoading4: 'సంభావ్య భద్రతా ప్రమాదాలను అంచనా వేస్తోంది...',
    lsLoading5: 'మీ భద్రతా నివేదికను సిద్ధం చేస్తోంది...',
    lsReportTitle: 'విశ్లేషణ నివేదిక',
    lsCachedBadge: 'కాష్ చేయబడిన ఫలితం ({time})',
    lsRequestFresh: 'కొత్త విశ్లేషణను అభ్యర్థించండి',
    lsSubmittedUrl: 'సమర్పించిన URL',
    lsDetectedCategories: 'గుర్తించిన వర్గాలు',
    lsSummaryTitle: 'సారాంశం & వివరణ',
    lsEvidenceTitle: 'పరిశీలించదగిన ఆధారాలు & ప్రమాద సూచికలు',
    lsLimitationsTitle: 'ముఖ్యమైన పరిమితులు',
    lsLimitationsNote: 'గమనిక: ధృవీకరించని డొమైన్‌లలో బ్యాంకింగ్ వివరాలు లేదా పాస్‌వర్డ్‌లను నమోదు చేయవద్దు.',

    // Message Safety Checker
    msBadge: 'AI-సహాయక మోసం గుర్తింపు',
    msTitle: 'సందేశ భద్రతా తనిఖీ',
    msDesc: 'అనుమానాస్పద SMS, వాట్సాప్ సందేశాలను విశ్లేషించండి. అత్యవసర ఒత్తిడి, లాటరీ ఎరలు మరియు OTP మోసాలను గుర్తించండి.',
    msInputLabel: 'అనుమానాస్పద సందేశం పాఠం',
    msInputPlaceholder: 'అనుమానాస్పద SMS, వాట్సాప్ సందేశం లేదా ఈమెయిల్ ఇక్కడ పేస్ట్ చేయండి...',
    msPrivacyNote: 'సందేశం సురక్షితంగా విశ్లేషించబడుతుంది మరియు నిల్వ చేయబడదు • లాగిన్ అవసరం లేదు',
    msBtnCheck: 'సందేశ భద్రతను తనిఖీ చేయండి',
    msBtnChecking: 'విశ్లేషిస్తోంది...',
    msLoadingTitle: 'సందేశ కంటెంట్‌ను అంచనా వేస్తోంది',
    msLoading1: 'సందేశ కంటెంట్ మరియు నిర్మాణాన్ని విశ్లేషిస్తోంది...',
    msLoading2: 'అనుమానాస్పద తొందరపాటు మరియు మోసపూరిత భాష కోసం శోధిస్తోంది...',
    msLoading3: 'సంభావ్య మోసాల సూచికలను అంచనా వేస్తోంది...',
    msLoading4: 'మీ భద్రతా నివేదికను సిద్ధం చేస్తోంది...',
    msReportTitle: 'మూల్యాంకన నివేదిక',
    msClassification: 'మొత్తం వర్గీకరణ',
    msCategoriesTitle: 'గుర్తించిన మోసం వర్గం',
    msPhrasesTitle: 'అనుమానాస్పద పదాలు & సూచికలు',
    msFindingsTitle: 'వివరణాత్మక ఫలితాలు',
    msRecommendationsTitle: 'సిఫార్సు చేయబడిన జాగ్రత్తలు',
    msOtpWarning: 'బ్యాంక్ అధికారులు లేదా పోలీసులు అని చెప్పుకున్నప్పటికీ మీ బ్యాంకింగ్ OTP, MPIN లేదా పాస్‌వర్డ్‌లను ఎవరితోనూ పంచుకోవద్దు.',

    // Common Checker Strings
    riskCritical: 'తీవ్రమైన ప్రమాదం',
    riskHigh: 'అధిక ప్రమాదం',
    riskMedium: 'మధ్యస్థ ప్రమాదం',
    riskLow: 'తక్కువ ప్రమాదం',
    riskUnknown: 'తెలియని ప్రమాదం',
    cooldownWait: 'దయచేసి మళ్లీ తనిఖీ చేయడానికి ముందు {seconds} సెకన్లు వేచి ఉండండి.',
    analysisError: 'విశ్లేషణ లోపం',
    errUrlEmpty: 'దయచేసి విశ్లేషించడానికి ఒక వెబ్‌సైట్ URLని నమోదు చేయండి.',
    errUrlLong: 'URL గరిష్టంగా 2048 అక్షరాల పరిమితిని మించిపోయింది.',
    errUrlScheme: 'మద్దతు లేని URL ప్రోటోకాల్. HTTP మరియు HTTPS లింక్‌లు మాత్రమే అనుమతించబడతాయి.',
    errUrlInvalid: 'దయచేసి సరైన వెబ్‌సైట్ URLని నమోదు చేయండి (ఉదా: example.com లేదా https://example.com).',
    errMessageEmpty: 'దయచేసి విశ్లేషించడానికి ఒక అనుమానాస్పద సందేశాన్ని టైప్ చేయండి లేదా పేస్ట్ చేయండి.',
    errMessageLong: 'సందేశం గరిష్టంగా 5000 అక్షరాల పరిమితిని మించిపోయింది.',
    recently: 'ఇటీవల',
    minsAgo: '{mins} నిమిషాల క్రితం',
    btnClear: 'క్లియర్ చేయండి',
    clearUrlAria: 'URL క్లియర్ చేయండి',

    // Password Checker
    pwdCheckerBadge: 'రియల్-టైమ్ భద్రతా మూల్యాంకనం',
    pwdCheckerTitle: 'పాస్‌వర్డ్ బలం తనిఖీ',
    pwdCheckerDesc: 'మీ పాస్‌వర్డ్ బలాన్ని నిజ సమయంలో అంచనా వేయండి. ఎంట్రోపీ, సంక్లిష్టత నిబంధనలు మరియు తక్షణ చిట్కాలను పొందండి.',
    pwdInputLabel: 'పరీక్షించడానికి పాస్‌వర్డ్‌ను నమోదు చేయండి',
    pwdPlaceholder: 'పాస్‌వర్డ్‌ను టైప్ చేయండి (ఉదా: MySecret#2026)',
    pwdCriteriaTitle: 'పాస్‌వర్డ్ అవసరాలు',
    pwdCritMinLength: 'కనీసం 8 అక్షరాలు',
    pwdCritUppercase: 'పెద్ద అక్షరం (A-Z)',
    pwdCritLowercase: 'చిన్న అక్షరం (a-z)',
    pwdCritNumber: 'సంఖ్య (0-9)',
    pwdCritSymbol: 'ప్రత్యేక చిహ్నం (!@#$%^&*...)',
    pwdStrongBannerTitle: 'పాస్‌వర్డ్ బలంగా ఉంది!',
    pwdStrongBannerDesc: 'మీ భద్రతను మరింత పెంచడానికి లక్ష్య సూచనలు ఇక్కడ ఉన్నాయి:',
    pwdSuggestionsTitle: 'భద్రతా సూచనలు',
    pwdViewAllSuggestions: 'మొత్తం 30 భద్రతా సూచనలను చూడండి',
    pwdHideAllSuggestions: 'సూచనల జాబితాను దాచండి',
    pwdScoreVeryStrong: 'చాలా బలంగా ఉంది',
    pwdScoreStrong: 'బలంగా ఉంది',
    pwdScoreMedium: 'మధ్యస్థం',
    pwdScoreWeak: 'బలహీనం',

    homeHeading: 'సైబర్ సేఫ్ - ఆన్‌లైన్ స్కామ్ అవగాహన పోర్టల్',
    homeSubheading: 'ఆన్‌లైన్‌లో సురక్షితంగా ఉండండి',
    homeDescription: 'ఫిషింగ్ దాడులు, OTP మోసాలు, పాస్‌వర్డ్ భద్రత మరియు సురక్షిత ఆన్‌లైన్ విధానాల గురించి తెలుసుకోండి.',
    homeHeroTitle: 'డిజిటల్ ప్రపంచంలో సురక్షితంగా ఉండండి',
    homeHeroDesc: 'సరళమైన ఆన్‌లైన్ భద్రతా సాధనాలతో అనుమానాస్పద లింక్‌లను తనిఖీ చేయండి, సందేశాలను విశ్లేషించండి మరియు మీ పాస్‌వర్డ్‌లను బలోపేతం చేయండి.',
    homeExploreTools: 'భద్రతా సాధనాలను చూడండి',
    homeToolsTitle: 'మీ భద్రతా సాధనాలు',
    homeToolsSubtitle: 'మీరు ఆన్‌లైన్‌లో సురక్షితంగా ఉండటానికి తక్షణ తనిఖీలు.',
    homeAwarenessTitle: 'సైబర్ ముప్పు అవగాహన',
    homeHelpTitle: 'సైబర్ మోసంతో సహాయం కావాలా?',
    homeHelpDesc: 'మీరు ఆర్థిక సైబర్ మోసానికి గురైనట్లు అనుమానిస్తే, వెంటనే సైబర్‌క్రైమ్ హెల్ప్‌లైన్‌ను సంప్రదించండి లేదా అధికారిక పోర్టల్‌లో ఫిర్యాదు చేయండి.',
    homeCallHelpline: '1930 కి కాల్ చేయండి',
    homeReportPortal: 'సైబర్ నేరాన్ని నివేదించండి',
    stat1Value: '80%',
    stat1Label: 'ఫిషింగ్ దాడులు ఈమెయిళ్ళ ద్వారా జరుగుతాయి.',
    stat2Value: 'వేలాది మంది',
    stat2Label: 'ప్రతి సంవత్సరం OTP మోసాల వల్ల డబ్బును కోల్పోతున్నారు.',
    stat3Value: 'UPI మోసాలు',
    stat3Label: 'కేసులు వేగంగా పెరుగుతున్నాయి.',
    stat4Value: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్',
    stat4Label: '1930',
    startLearning: 'నేర్చుకోవడం ప్రారంభించండి',
    homeTrustBadge: 'ప్రజా సైబర్ భద్రత & స్కామ్ రక్షణ',
    homeHowItWorksTitle: 'సైబర్ సేఫ్ మిమ్మల్ని ఎలా రక్షిస్తుంది',
    homeStep1Title: '1. లింక్, సందేశం లేదా పాస్‌వర్డ్ నమోదు చేయండి',
    homeStep1Desc: 'అనుమానాస్పద లింక్‌లు, సందేశాలు నమోదు చేయండి లేదా పాస్‌వర్డ్‌ను నిజ సమయంలో సురక్షితంగా పరీక్షించండి.',
    homeStep2Title: '2. తక్షణ ముప్పు విశ్లేషణ',
    homeStep2Desc: 'మా విశ్లేషణ వ్యవస్థ ఫిషింగ్ గుర్తులు, నకిలీ డొమైన్‌లు మరియు స్కామ్ నమూనాలను గుర్తిస్తుంది.',
    homeStep3Title: '3. కార్యాచరణ భద్రతా మార్గదర్శకత్వం',
    homeStep3Desc: 'మీ ఆర్థిక లావాదేవీలు మరియు వ్యక్తిగత వివరాలను రక్షించుకోవడానికి స్పష్టమైన సలహాలు పొందండి.',
    homeModulesBannerTitle: 'మీ సైబర్ రక్షణ నైపుణ్యాలను పెంచుకోండి',
    homeModulesBannerDesc: 'వీడియో పాఠాలు, ఆచరణాత్మక అంశాలు మరియు క్విజ్‌లతో కూడిన 4 ఇంటరాక్టివ్ అవగాహన మాడ్యూల్స్ పూర్తి చేయండి.',

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
    otpPlaceholder: '6-అంకెల OTP నమోదు చేయండి',
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
    step2Desc: 'మీ ఈమెయిల్‌కు పంపిన 6-అంకెల OTPని నమోదు చేయండి.',
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

    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    resetPasswordTitle: 'పాస్‌వర్డ్‌ను రీసెట్ చేయండి',
    resetPasswordDesc: '6-అంకెల ధృవీకరణ కోడ్ పొందడానికి మీ నమోదిత ఈమెయిల్ చిరునామాను నమోదు చేయండి.',
    btnResetPassword: 'కొత్త పాస్‌వర్డ్ సెట్ చేయండి',
    backToLogin: 'లాగిన్‌కు తిరిగి వెళ్లండి',
    errEmailNotFound: 'ఈ ఈమెయిల్ చిరునామాతో నమోదిత ఖాతా ఏదీ కనుగొనబడలేదు.',
    passwordResetSuccess: 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది! దారిమళ్లిస్తోంది...',
    newPasswordLabel: 'కొత్త పాస్‌వర్డ్',
    confirmNewPasswordLabel: 'కొత్త పాస్‌వర్డ్ నిర్ధారణ',
    changeEmail: 'ఈమెయిల్ మార్చండి',

    modulesTitle: 'సైబర్ సెక్యూరిటీ లెర్నింగ్ మాడ్యూల్స్',
    modulesSubtitle: 'దశలవారీ ఇంటరాక్టివ్ పాఠాలు మరియు ఆచరణాత్మక భద్రతా మార్గదర్శకాల ద్వారా ముఖ్యమైన సైబర్ భద్రతా నైపుణ్యాలను నేర్చుకోండి.',
    progressTitle: 'మాడ్యూల్ పురోగతి',
    progressCompleted: '{completed}/4 పూర్తయింది ({percent}%)',
    moduleLabel: 'మాడ్యూల్',
    keyTakeaways: 'ముఖ్యమైన అంశాలు',
    transcriptLabel: 'ట్రాన్స్‌క్రిప్ట్',
    btnCompleted: 'పూర్తయిన మాడ్యూల్',
    btnComplete: 'మాడ్యూల్ పూర్తి చేయండి',
    btnMarkIncomplete: 'అసంపూర్ణంగా గుర్తించండి',
    btnCompletedTooltip: 'పూర్తయినట్లు గుర్తును తీసివేయడానికి క్లిక్ చేయండి',
    btnPrevModule: 'మునుపటి మాడ్యూల్',
    btnNextModule: 'తదుపరి మాడ్యూల్',
    btnTakeQuiz: 'క్విజ్ ప్రారంభించండి',
    btnTakeQuizDisabledNotice: 'క్విజ్ తెరవడానికి మొత్తం 4 మాడ్యూళ్లను పూర్తి చేయండి.',
    allModulesCompletedNotice: 'అన్ని మాడ్యూల్స్ పూర్తయ్యాయి! క్విజ్ అన్‌లాక్ చేయబడింది.',
    clickToPlayVideo: 'వీడియో ప్లే చేయడానికి క్లిక్ చేయండి',
    viewFullTranscript: 'పూర్తి ట్రాన్స్‌క్రిప్ట్ చదవండి',
    hideTranscript: 'ట్రాన్స్‌క్రిప్ట్ దాచండి',
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
    btnBackToHome: 'హోమ్‌కు తిరిగి వెళ్లండి',
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
    unattemptedBadge: 'సమాధానం ఇవ్వలేదు',
    quizHighestScore: 'అత్యధిక స్కోరు',
    quizNewHighestScore: 'కొత్త అత్యధిక స్కోరు!',

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
    nationalPortal: 'cybercrime.gov.in',
    footerMission: 'పౌరులకు ఆన్‌లైన్ మోసాల అవగాహన మరియు నిజ-సమయ ధృవీకరణ సాధనాలను అందించే పబ్లిక్ పోర్టల్.',
    footerSecurityTools: 'భద్రతా సాధనాలు',
    footerLearningPlatform: 'లెర్నింగ్ & ప్లాట్‌ఫారమ్',
    footerQuizAssessment: 'క్విజ్ & మూల్యాంకనం',
    footerAdminDashboard: 'అడ్మిన్ డ్యాష్‌బోర్డ్',
    footerEmergencySupport: 'అత్యవసర సహాయం',
    footerHelplineTitle: '1930 హెల్ప్‌లైన్',
    footerHelplineDesc: 'ఉచిత 24x7 ఫిర్యాదు సేవ',
    footerCopyrightNotice: 'వాణిజ్యేతర పబ్లిక్ సైబర్ సెక్యూరిటీ అవగాహన కార్యక్రమం.',

    adminLoginTitle: 'అడ్మిన్ లాగిన్',
    adminIdLabel: 'అడ్మిన్ ఐడీ',
    adminPasswordLabel: 'పాస్‌వర్డ్',
    adminSignInBtn: 'సైన్ ఇన్',
    adminVerifying: 'ధృవీకరిస్తోంది...',
    adminLoginErrorRequired: 'దయచేసి అడ్మిన్ ఐడీ మరియు పాస్‌వర్డ్ రెండింటినీ నమోదు చేయండి.',
    adminLoginErrorInvalid: 'చెల్లని అడ్మిన్ ఐడీ లేదా పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.',
    adminLoginErrorSessionExpired: 'అడ్మిన్ సెషన్ గడువు ముగిసింది లేదా చెల్లని ఆధారాలు. దయచేసి మళ్లీ లాగిన్ అవ్వండి.',
    adminLoginErrorGeneric: 'సైన్ ఇన్ చేసేటప్పుడు లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    adminDashboardTitle: 'అడ్మిన్ డ్యాష్‌బోర్డ్',
    adminRefreshBtn: 'రిఫ్రెష్',
    adminLogoutBtn: 'లాగౌట్',
    adminRetryBtn: 'మళ్లీ ప్రయత్నించండి',
    adminTotalUsers: 'మొత్తం వినియోగదారులు',
    adminTotalModules: 'మొత్తం మాడ్యూల్స్',
    adminFullyCompletedUsers: 'పూర్తి చేసిన వినియోగదారులు',
    adminSummaryHeading: 'సారాంశం',
    adminRegisteredUsers: 'నమోదిత వినియోగదారులు',
    adminSearchPlaceholder: 'పేరు లేదా ఇమెయిల్ శోధించండి...',
    adminFilterAll: 'అన్నీ',
    adminFilterCompleted: 'పూర్తయినవి',
    adminFilterInProgress: 'పురోగతిలో ఉంది',
    adminFilterNotStarted: 'ప్రారంభించబడలేదు',
    adminLoadingUsers: 'వినియోగదారు పురోగతి రికార్డులను లోడ్ చేస్తోంది...',
    adminNoUsers: 'నమోదిత వినియోగదారులు ఎవరూ లేరు',
    adminNoMatchingUsers: 'సరిపోలే వినియోగదారులు ఎవరూ లేరు',
    adminClearSearch: 'శోధనను క్లియర్ చేయండి',
    adminTableName: 'పేరు',
    adminTableEmail: 'ఇమెయిల్',
    adminTableProgress: 'పురోగతి',
    adminTableQuizScore: 'అత్యధిక క్విజ్ స్కోరు',
    adminQuizNotAttempted: 'రాయలేదు',
    adminToggleScoreSort: 'స్కోరు క్రమబద్ధీకరణను మార్చండి',
    adminAvgQuizScore: 'సగటు అత్యధిక స్కోరు',
    adminQuizzesAttempted: 'పూర్తయిన క్విజ్‌లు',
    adminModulesCount: '{completed} / {total} మాడ్యూల్స్',
    adminShowPassword: 'పాస్‌వర్డ్ చూపించు',
    adminHidePassword: 'పాస్‌వర్డ్ దాచండి',
    adminToggleSort: 'అక్షరక్రమ అమరికను మార్చండి'
  },

  hi: {
    siteTitle: 'साइबर सेफ',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    greeting: 'स्वागत है',
    navHome: 'होम',
    navLinkSafety: 'लिंक सुरक्षा',
    navMessageSafety: 'संदेश सुरक्षा',
    navPasswordChecker: 'पासवर्ड चेकर',
    navModules: 'मॉड्यूल',
    navDashboard: 'डैशबोर्ड',
    btnBack: 'पिछले पृष्ठ पर जाएं',
    btnForward: 'अगले पृष्ठ पर जाएं',

    // Link Safety Checker
    lsBadge: 'एआई-सहायक खतरा खुफिया',
    lsTitle: 'लिंक सुरक्षा चेकर',
    lsDesc: 'क्लिक करने से पहले वेबसाइट और संदिग्ध लिंक की जांच करें। फर्जी लॉगिन पेज और फ़िशिंग जाल का आसानी से पता लगाएं।',
    lsInputLabel: 'वेबसाइट या लिंक URL',
    lsInputPlaceholder: 'उदा. sbi-kyc-update.com या https://example.com',
    lsCooldownNote: 'हर 30 सेकंड में 1 नई जांच की अनुमति है • लॉगिन की आवश्यकता नहीं है',
    lsBtnCheck: 'लिंक सुरक्षा जांचें',
    lsBtnChecking: 'विश्लेषण हो रहा है...',
    lsLoadingTitle: 'लिंक सुरक्षा का मूल्यांकन हो रहा है',
    lsLoading1: 'जमा किए गए URL को सत्यापित किया जा रहा है...',
    lsLoading2: 'डोमेन संरचना और ब्रांड संकेतकों का मूल्यांकन किया जा रहा है...',
    lsLoading3: 'संदिग्ध फ़िशिंग और धोखाधड़ी पैटर्न की जांच की जा रही है...',
    lsLoading4: 'संभावित सुरक्षा जोखिमों का मूल्यांकन किया जा रहा है...',
    lsLoading5: 'आपकी सुरक्षा रिपोर्ट तैयार की जा रही है...',
    lsReportTitle: 'विश्लेषण रिपोर्ट',
    lsCachedBadge: 'कैश किया गया परिणाम ({time})',
    lsRequestFresh: 'नया विश्लेषण अनुरोध करें',
    lsSubmittedUrl: 'जमा किया गया URL',
    lsDetectedCategories: 'पहचाने गए वर्ग',
    lsSummaryTitle: 'सारांश और विवरण',
    lsEvidenceTitle: 'अवलोकन योग्य प्रमाण और जोखिम संकेतक',
    lsLimitationsTitle: 'महत्वपूर्ण सीमाएं',
    lsLimitationsNote: 'नोट: असत्यापित डोमेन पर वित्तीय क्रेडेंशियल्स या पासवर्ड दर्ज न करें।',

    // Message Safety Checker
    msBadge: 'एआई-सहायक धोखाधड़ी पहचान',
    msTitle: 'संदेश सुरक्षा चेकर',
    msDesc: 'संदिग्ध एसएमएस और व्हाट्सएप संदेशों का विश्लेषण करें। जल्दबाजी के दबाव, लॉटरी के झांसे और ओटीपी धोखाधड़ी को पहचानें।',
    msInputLabel: 'संदिग्ध संदेश पाठ',
    msInputPlaceholder: 'संदिग्ध एसएमएस, व्हाट्सएप संदेश या ईमेल यहां पेस्ट करें...',
    msPrivacyNote: 'संदेश सुरक्षित रूप से संसाधित होता है और कभी संग्रहीत नहीं होता • लॉगिन की आवश्यकता नहीं है',
    msBtnCheck: 'संदेश सुरक्षा जांचें',
    msBtnChecking: 'विश्लेषण हो रहा है...',
    msLoadingTitle: 'संदेश सामग्री का मूल्यांकन हो रहा है',
    msLoading1: 'संदेश सामग्री और संरचना का विश्लेषण हो रहा है...',
    msLoading2: 'संदिग्ध तात्कालिकता और धोखाधड़ी की भाषा की तलाश हो रही है...',
    msLoading3: 'संभावित स्कैम संकेतकों का मूल्यांकन हो रहा है...',
    msLoading4: 'आपकी सुरक्षा रिपोर्ट तैयार की जा रही है...',
    msReportTitle: 'मूल्यांकन रिपोर्ट',
    msClassification: 'समग्र वर्गीकरण',
    msCategoriesTitle: 'पहचाने गए स्कैम वर्ग',
    msPhrasesTitle: 'संदिग्ध शब्द और संकेतक',
    msFindingsTitle: 'विस्तृत निष्कर्ष',
    msRecommendationsTitle: 'अनुशंसित सावधानियां',
    msOtpWarning: 'बैंक अधिकारी या पुलिस होने का दावा करने पर भी अपना बैंकिंग ओटीपी, एमपीआईएन या पासवर्ड किसी के साथ साझा न करें।',

    // Common Checker Strings
    riskCritical: 'गंभीर जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskMedium: 'मध्यम जोखिम',
    riskLow: 'कम जोखिम',
    riskUnknown: 'अज्ञात जोखिम',
    cooldownWait: 'कृपया दोबारा जांच करने से पहले {seconds} सेकंड प्रतीक्षा करें।',
    analysisError: 'विश्लेषण त्रुटि',
    errUrlEmpty: 'कृपया विश्लेषण के लिए वेबसाइट URL दर्ज करें।',
    errUrlLong: 'URL 2048 अक्षरों की अधिकतम सीमा से अधिक है।',
    errUrlScheme: 'असमर्थित URL प्रोटोकॉल। केवल HTTP और HTTPS लिंक की अनुमति है।',
    errUrlInvalid: 'कृपया मान्य वेबसाइट URL दर्ज करें (उदा. example.com या https://example.com)।',
    errMessageEmpty: 'कृपया विश्लेषण के लिए एक संदिग्ध संदेश पेस्ट करें या लिखें।',
    errMessageLong: 'संदेश 5000 अक्षरों की अधिकतम सीमा से अधिक है।',
    recently: 'हाल ही में',
    minsAgo: '{mins} मिनट पहले',
    btnClear: 'हटाएं',
    clearUrlAria: 'URL हटाएं',

    // Password Checker
    pwdCheckerBadge: 'रीयल-टाइम सुरक्षा मूल्यांकन',
    pwdCheckerTitle: 'पासवर्ड मजबूती चेकर',
    pwdCheckerDesc: 'रीयल-टाइम में अपने पासवर्ड की मजबूती जांचें। एंट्रॉपी स्कोर, जटिलता के नियम और उपयोगी सुरक्षा सुझाव प्राप्त करें।',
    pwdInputLabel: 'जांच के लिए पासवर्ड दर्ज करें',
    pwdPlaceholder: 'पासवर्ड टाइप करें (उदा. MySecret#2026)',
    pwdCriteriaTitle: 'पासवर्ड आवश्यकताएं',
    pwdCritMinLength: 'कम से कम 8 अक्षर',
    pwdCritUppercase: 'बड़ा अक्षर (A-Z)',
    pwdCritLowercase: 'छोटा अक्षर (a-z)',
    pwdCritNumber: 'संख्या (0-9)',
    pwdCritSymbol: 'विशेष प्रतीक (!@#$%^&*...)',
    pwdStrongBannerTitle: 'पासवर्ड मजबूत है!',
    pwdStrongBannerDesc: 'सुरक्षा को और बढ़ाने के लिए सुझाव:',
    pwdSuggestionsTitle: 'सुरक्षा सुझाव',
    pwdViewAllSuggestions: 'सभी 30 सुरक्षा सुझाव देखें',
    pwdHideAllSuggestions: 'सुझाव सूची छिपाएं',
    pwdScoreVeryStrong: 'बहुत मजबूत',
    pwdScoreStrong: 'मजबूत',
    pwdScoreMedium: 'मध्यम',
    pwdScoreWeak: 'कमजोर',

    homeHeading: 'साइबर सेफ - ऑनलाइन स्कैम जागरूकता पोर्टल',
    homeSubheading: 'ऑनलाइन सुरक्षित रहें',
    homeDescription: 'फ़िशिंग हमलों, ओटीपी घोटालों, पासवर्ड सुरक्षा और सुरक्षित ऑनलाइन प्रथाओं के बारे में जानें।',
    homeHeroTitle: 'डिजिटल दुनिया में सुरक्षित रहें',
    homeHeroDesc: 'सरल ऑनलाइन सुरक्षा टूल्स के साथ संदिग्ध लिंक जांचें, स्कैम संदेशों का विश्लेषण करें और अपने पासवर्ड मजबूत करें।',
    homeExploreTools: 'सुरक्षा टूल्स देखें',
    homeToolsTitle: 'आपके सुरक्षा टूल्स',
    homeToolsSubtitle: 'ऑनलाइन सुरक्षित रहने के लिए त्वरित जांच।',
    homeAwarenessTitle: 'साइबर खतरे की जागरूकता',
    homeHelpTitle: 'क्या आपको साइबर धोखाधड़ी में मदद चाहिए?',
    homeHelpDesc: 'यदि आपको वित्तीय साइबर धोखाधड़ी का संदेह है, तो तुरंत साइबर क्राइम हेल्पलाइन से संपर्क करें या आधिकारिक पोर्टल पर रिपोर्ट करें।',
    homeCallHelpline: '1930 पर कॉल करें',
    homeReportPortal: 'साइबर अपराध की रिपोर्ट करें',
    stat1Value: '80%',
    stat1Label: 'फ़िशिंग हमले ईमेल के माध्यम से होते हैं।',
    stat2Value: 'हजारों लोग',
    stat2Label: 'हर साल ओटीपी घोटालों के कारण पैसे गंवाते हैं।',
    stat3Value: 'यूपीआई धोखाधड़ी',
    stat3Label: 'मामले तेजी से बढ़ रहे हैं।',
    stat4Value: 'साइबर अपराध हेल्पलाइन',
    stat4Label: '1930',
    startLearning: 'सीखना शुरू करें',
    homeTrustBadge: 'सार्वजनिक साइबर सुरक्षा और स्कैम सुरक्षा',
    homeHowItWorksTitle: 'साइबर सेफ आपकी सुरक्षा कैसे करता है',
    homeStep1Title: '1. लिंक, संदेश या पासवर्ड दर्ज करें',
    homeStep1Desc: 'संदिग्ध लिंक, फ़ॉरवर्ड किए गए संदेश दर्ज करें या रीयल-टाइम में पासवर्ड का सुरक्षित परीक्षण करें।',
    homeStep2Title: '2. त्वरित खतरा विश्लेषण',
    homeStep2Desc: 'हमारा स्मार्ट विश्लेषक फ़िशिंग पैटर्न, भ्रामक डोमेन और धोखाधड़ी के दबाव की जांच करता है।',
    homeStep3Title: '3. व्यावहारिक सुरक्षा मार्गदर्शन',
    homeStep3Desc: 'अपने वित्त और व्यक्तिगत जानकारी को सुरक्षित रखने के लिए स्पष्ट सुझाव और दिशा-निर्देश प्राप्त करें।',
    homeModulesBannerTitle: 'अपने साइबर सुरक्षा कौशल का निर्माण करें',
    homeModulesBannerDesc: 'वीडियो पाठ, व्यावहारिक सुझाव और संक्षिप्त क्विज़ के साथ 4 इंटरैक्टिव जागरूकता मॉड्यूल पूरा करें।',

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
    otpPlaceholder: '6-अंकों का OTP दर्ज करें',
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
    step2Desc: 'अपने ईमेल पर भेजा गया 6-अंकों का OTP दर्ज करें।',
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

    forgotPassword: 'पासवर्ड भूल गए?',
    resetPasswordTitle: 'पासवर्ड रीसेट करें',
    resetPasswordDesc: '6-अंकों का सत्यापन कोड प्राप्त करने के लिए अपना पंजीकृत ईमेल पता दर्ज करें।',
    btnResetPassword: 'नया पासवर्ड सेट करें',
    backToLogin: 'लॉग इन पर वापस जाएं',
    errEmailNotFound: 'इस ईमेल पते के साथ कोई पंजीकृत खाता नहीं मिला।',
    passwordResetSuccess: 'पासवर्ड सफलतापूर्वक बदल दिया गया! पुनर्निर्देशित किया जा रहा है...',
    newPasswordLabel: 'नया पासवर्ड',
    confirmNewPasswordLabel: 'नए पासवर्ड की पुष्टि करें',
    changeEmail: 'ईमेल बदलें',

    modulesTitle: 'साइबर सुरक्षा लर्निंग मॉड्यूल',
    modulesSubtitle: 'चरण-दर-चरण इंटरैक्टिव पाठों और व्यावहारिक सुरक्षा गाइडों के माध्यम से आवश्यक डिजिटल सुरक्षा कौशल सीखें।',
    progressTitle: 'मॉड्यूल प्रगति',
    progressCompleted: '{completed}/4 पूर्ण ({percent}%)',
    moduleLabel: 'मॉड्यूल',
    keyTakeaways: 'मुख्य बिंदु',
    transcriptLabel: 'प्रतिलेख (Transcript)',
    btnCompleted: 'पूर्ण किया गया मॉड्यूल',
    btnComplete: 'मॉड्यूल पूरा करें',
    btnMarkIncomplete: 'अपूर्ण करने के लिए क्लिक करें',
    btnCompletedTooltip: 'पूर्ण किए गए को हटाने के लिए क्लिक करें',
    btnPrevModule: 'पिछला मॉड्यूल',
    btnNextModule: 'अगला मॉड्यूल',
    btnTakeQuiz: 'प्रश्नोत्तरी शुरू करें',
    btnTakeQuizDisabledNotice: 'प्रश्नोत्तरी अनलॉक करने के लिए सभी 4 मॉड्यूल पूरे करें।',
    allModulesCompletedNotice: 'सभी मॉड्यूल पूरे हो गए! प्रश्नोत्तरी अब अनलॉक हो गई है।',
    clickToPlayVideo: 'वीडियो चलाने के लिए क्लिक करें',
    viewFullTranscript: 'पूरा ट्रांसक्रिप्ट पढ़ें',
    hideTranscript: 'ट्रांसक्रिप्ट छिपाएं',
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
    btnBackToHome: 'होम पर वापस जाएं',
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
    unattemptedBadge: 'उत्तर नहीं दिया',
    quizHighestScore: 'उच्चतम स्कोर',
    quizNewHighestScore: 'नया उच्चतम स्कोर!',

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
    nationalPortal: 'cybercrime.gov.in',
    footerMission: 'नागरिकों को साइबर सुरक्षा शिक्षा और रीयल-टाइम धोखाधड़ी सत्यापन उपकरण प्रदान करने वाला सार्वजनिक पोर्टल।',
    footerSecurityTools: 'सुरक्षा उपकरण',
    footerLearningPlatform: 'लर्निंग और प्लेटफॉर्म',
    footerQuizAssessment: 'क्विज़ और मूल्यांकन',
    footerAdminDashboard: 'एडमिन डैशबोर्ड',
    footerEmergencySupport: 'आपातकालीन सहायता',
    footerHelplineTitle: '1930 हेल्पलाइन',
    footerHelplineDesc: 'टोल-फ्री 24x7 रिपोर्टिंग',
    footerCopyrightNotice: 'गैर-व्यावसायिक सार्वजनिक साइबर सुरक्षा जागरूकता पहल।',

    adminLoginTitle: 'एडमिन लॉगिन',
    adminIdLabel: 'एडमिन आईडी',
    adminPasswordLabel: 'पासवर्ड',
    adminSignInBtn: 'साइन इन',
    adminVerifying: 'सत्यापित हो रहा है...',
    adminLoginErrorRequired: 'कृपया एडमिन आईडी और पासवर्ड दोनों दर्ज करें।',
    adminLoginErrorInvalid: 'अमान्य एडमिन आईडी या पासवर्ड। कृपया पुनः प्रयास करें।',
    adminLoginErrorSessionExpired: 'एडमिन सत्र समाप्त हो गया या अमान्य क्रेडेंशियल। कृपया पुनः लॉगिन करें।',
    adminLoginErrorGeneric: 'साइन इन करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    adminDashboardTitle: 'एडमिन डैशबोर्ड',
    adminRefreshBtn: 'रिफ्रेश',
    adminLogoutBtn: 'लॉगआउट',
    adminRetryBtn: 'पुनः प्रयास करें',
    adminTotalUsers: 'कुल उपयोगकर्ता',
    adminTotalModules: 'कुल मॉड्यूल',
    adminFullyCompletedUsers: 'पूर्ण किए गए उपयोगकर्ता',
    adminSummaryHeading: 'सारांश',
    adminRegisteredUsers: 'पंजीकृत उपयोगकर्ता',
    adminSearchPlaceholder: 'नाम या ईमेल खोजें...',
    adminFilterAll: 'सभी',
    adminFilterCompleted: 'पूर्ण',
    adminFilterInProgress: 'प्रगति पर',
    adminFilterNotStarted: 'प्रारंभ नहीं हुआ',
    adminLoadingUsers: 'उपयोगकर्ता प्रगति रिकॉर्ड लोड हो रहे हैं...',
    adminNoUsers: 'कोई पंजीकृत उपयोगकर्ता नहीं मिला',
    adminNoMatchingUsers: 'कोई मेल खाने वाला उपयोगकर्ता नहीं मिला',
    adminClearSearch: 'खोज साफ़ करें',
    adminTableName: 'नाम',
    adminTableEmail: 'ईमेल',
    adminTableProgress: 'प्रगति',
    adminTableQuizScore: 'उच्चतम प्रश्नोत्तरी स्कोर',
    adminQuizNotAttempted: 'प्रयास नहीं किया',
    adminToggleScoreSort: 'स्कोर क्रम बदलें',
    adminAvgQuizScore: 'औसत उच्चतम स्कोर',
    adminQuizzesAttempted: 'प्रश्नोत्तरी पूर्ण',
    adminModulesCount: '{completed} / {total} मॉड्यूल',
    adminShowPassword: 'पासवर्ड दिखाएं',
    adminHidePassword: 'पासवर्ड छुपाएं',
    adminToggleSort: 'वर्णमाला क्रम बदलें'
  }
};

export const CLASSIFICATION_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Link classifications
  'no known threat detected': {
    en: 'No Known Threat Detected',
    te: 'తెలిసిన ముప్పు ఏదీ గుర్తించబడలేదు',
    hi: 'कोई ज्ञात खतरा नहीं मिला'
  },
  'malicious or dangerous': {
    en: 'Malicious or Dangerous',
    te: 'హానికరమైన లేదా ప్రమాదకరమైనది',
    hi: 'दुर्भावनापूर्ण या खतरनाक'
  },
  'phishing': {
    en: 'Phishing',
    te: 'ఫిషింగ్',
    hi: 'फ़िशिंग'
  },
  'fake banking website': {
    en: 'Fake Banking Website',
    te: 'నకిలీ బ్యాంకింగ్ వెబ్‌సైట్',
    hi: 'फर्जी बैंकिंग वेबसाइट'
  },
  'brand impersonation or replica website': {
    en: 'Brand Impersonation or Replica Website',
    te: 'బ్రాండ్ అనుకరణ లేదా నకిలీ వెబ్‌సైట్',
    hi: 'ब्रांड प्रतिरूपण या नकली वेबसाइट'
  },
  'piracy-related website': {
    en: 'Piracy-Related Website',
    te: 'పైరసీ సంబంధిత వెబ్‌సైట్',
    hi: 'पायरेसी से संबंधित वेबसाइट'
  },
  'mod apk distributor': {
    en: 'Mod APK Distributor',
    te: 'మోడ్ APK పంపిణీదారు',
    hi: 'मॉड एपीके वितरक'
  },
  'betting or gambling website': {
    en: 'Betting or Gambling Website',
    te: 'బెట్టింగ్ లేదా జూదం వెబ్‌సైట్',
    hi: 'सट्टेबाजी या जुआ वेबसाइट'
  },
  'suspicious website': {
    en: 'Suspicious Website',
    te: 'అనుమానాస్పద వెబ్‌సైట్',
    hi: 'संदिग्ध वेबसाइट'
  },
  'unable to verify': {
    en: 'Unable to Verify',
    te: 'ధృవీకరించడం సాధ్యం కాలేదు',
    hi: 'सत्यापित करने में असमर्थ'
  },

  // Message classifications
  'likely scam': {
    en: 'Likely Scam',
    te: 'స్కామ్ అయ్యే అవకాశం ఉంది',
    hi: 'संभावित स्कैम'
  },
  'suspicious': {
    en: 'Suspicious',
    te: 'అనుమానాస్పదమైనది',
    hi: 'संदिग्ध'
  },
  'no strong scam indicators detected': {
    en: 'No Strong Scam Indicators Detected',
    te: 'బలమైన స్కామ్ సూచికలు కనుగొనబడలేదు',
    hi: 'कोई मजबूत स्कैम संकेतक नहीं मिले'
  }
};

export const CATEGORY_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'phishing': {
    en: 'Phishing',
    te: 'ఫిషింగ్',
    hi: 'फ़िशिंग'
  },
  'brand impersonation': {
    en: 'Brand Impersonation',
    te: 'బ్రాండ్ అనుకరణ',
    hi: 'ब्रांड प्रतिरूपण'
  },
  'fake banking': {
    en: 'Fake Banking',
    te: 'నకిలీ బ్యాంకింగ్',
    hi: 'फर्जी बैंकिंग'
  },
  'fake banking alert': {
    en: 'Fake Banking Alert',
    te: 'నకిలీ బ్యాంకింగ్ హెచ్చరిక',
    hi: 'फर्जी बैंकिंग अलर्ट'
  },
  'upi payment scam': {
    en: 'UPI Payment Scam',
    te: 'UPI చెల్లింపు స్కామ్',
    hi: 'यूपीआई भुगतान स्कैम'
  },
  'otp request': {
    en: 'OTP Request',
    te: 'OTP అభ్యర్థన',
    hi: 'ओटीपी अनुरोध'
  },
  'phishing lure': {
    en: 'Phishing Lure',
    te: 'ఫిషింగ్ ఎర',
    hi: 'फ़िशिंग प्रलोभन'
  },
  'fake customer support': {
    en: 'Fake Customer Support',
    te: 'నకిలీ కస్టమర్ సపోర్ట్',
    hi: 'फर्जी कस्टमर सपोर्ट'
  },
  'lottery scam': {
    en: 'Lottery Scam',
    te: 'లాటరీ స్కామ్',
    hi: 'लॉटरी स्कैम'
  },
  'job scam': {
    en: 'Job Scam',
    te: 'ఉద్యోగ స్కామ్',
    hi: 'नौकरी स्कैम'
  },
  'investment scam': {
    en: 'Investment Scam',
    te: 'పెట్టుబడి స్కామ్',
    hi: 'निवेश स्कैम'
  },
  'impersonation attempt': {
    en: 'Impersonation Attempt',
    te: 'గుర్తింపు అనుకరణ యత్నం',
    hi: 'प्रतिरूपण प्रयास'
  },
  'extortion or threat': {
    en: 'Extortion or Threat',
    te: 'బ్లాక్‌మెయిల్ లేదా బెదిరింపు',
    hi: 'जबरन वसूली या धमकी'
  },
  'electricity bill scam': {
    en: 'Electricity Bill Scam',
    te: 'విద్యుత్ బిల్లు స్కామ్',
    hi: 'बिजली बिल स्कैम'
  },
  'kyc update scam': {
    en: 'KYC Update Scam',
    te: 'KYC అప్‌డేట్ స్కామ్',
    hi: 'केवाईसी अपडेट स्कैम'
  },
  'part-time job offer': {
    en: 'Part-time Job Offer',
    te: 'పార్ట్ టైమ్ జాబ్ ఆఫర్',
    hi: 'पार्ट-टाइम नौकरी प्रस्ताव'
  },
  'courier / delivery scam': {
    en: 'Courier / Delivery Scam',
    te: 'కొరియర్ / డెలివరీ స్కామ్',
    hi: 'कूरियर / डिलीवरी स्कैम'
  },
  'loan approval scam': {
    en: 'Loan Approval Scam',
    te: 'రుణ ఆమోదం స్కామ్',
    hi: 'ऋण स्वीकृति स्कैम'
  },
  'transactional alert': {
    en: 'Transactional Alert',
    te: 'లావాదేవీల హెచ్చరిక',
    hi: 'लेन-देन अलर्ट'
  },
  'legitimate website': {
    en: 'Legitimate Website',
    te: 'నిజమైన వెబ్‌సైట్',
    hi: 'वैध वेबसाइट'
  },
  'no known threat': {
    en: 'No Known Threat',
    te: 'తెలిసిన ముప్పు లేదు',
    hi: 'कोई ज्ञात खतरा नहीं'
  },
  'credential harvesting': {
    en: 'Credential Harvesting',
    te: 'వివరాల దొంగతనం',
    hi: 'क्रेडेंशियल चोरी'
  },
  'deceptive url': {
    en: 'Deceptive URL',
    te: 'మోసపూరిత URL',
    hi: 'भ्रामक URL'
  },
  'financial fraud': {
    en: 'Financial Fraud',
    te: 'ఆర్థిక మోసం',
    hi: 'वित्तीय धोखाधड़ी'
  },
  'social engineering': {
    en: 'Social Engineering',
    te: 'సోషల్ ఇంజనీరింగ్',
    hi: 'सोशल इंजीनियरिंग'
  },
  'mod apk distributor': {
    en: 'Mod APK Distributor',
    te: 'మోడ్ APK పంపిణీదారు',
    hi: 'मॉड एपीके वितरक'
  },
  'mod apk': {
    en: 'Mod APK',
    te: 'మోడ్ APK',
    hi: 'मॉड एपीके'
  },
  'piracy-related website': {
    en: 'Piracy-Related Website',
    te: 'పైరసీ సంబంధిత వెబ్‌సైట్',
    hi: 'पायरेसी से संबंधित वेबसाइट'
  },
  'piracy-related': {
    en: 'Piracy-Related',
    te: 'పైరసీ సంబంధిత',
    hi: 'पायरेसी से संबंधित'
  },
  'piracy': {
    en: 'Piracy',
    te: 'పైరసీ',
    hi: 'पायरेसी'
  },
  'betting or gambling website': {
    en: 'Betting or Gambling Website',
    te: 'బెట్టింగ్ లేదా జూదం వెబ్‌సైట్',
    hi: 'सट्टेबाजी या जुआ वेबसाइट'
  },
  'betting or gambling': {
    en: 'Betting or Gambling',
    te: 'బెట్టింగ్ లేదా జూదం',
    hi: 'सट्टेबाजी या जुआ'
  },
  'gambling': {
    en: 'Gambling',
    te: 'జూదం',
    hi: 'जुआ'
  },
  'malicious or dangerous': {
    en: 'Malicious or Dangerous',
    te: 'హానికరమైన లేదా ప్రమాదకరమైనది',
    hi: 'दुर्भावनापूर्ण या खतरनाक'
  },
  'malicious': {
    en: 'Malicious',
    te: 'హానికరమైనది',
    hi: 'दुर्भावनापूर्ण'
  },
  'suspicious website': {
    en: 'Suspicious Website',
    te: 'అనుమానాస్పద వెబ్‌సైట్',
    hi: 'संदिग्ध वेबसाइट'
  },
  'suspicious': {
    en: 'Suspicious',
    te: 'అనుమానాస్పదమైనది',
    hi: 'संदिग्ध'
  }
};

export function translateClassification(classification: string, lang: Language): string {
  if (!classification) return '';
  const key = classification.toLowerCase().trim();
  if (CLASSIFICATION_TRANSLATIONS[key]?.[lang]) {
    return CLASSIFICATION_TRANSLATIONS[key][lang];
  }
  return classification;
}

export function translateCategory(cat: string, lang: Language): string {
  if (!cat) return '';
  const key = cat.toLowerCase().trim();
  if (CATEGORY_TRANSLATIONS[key]?.[lang]) {
    return CATEGORY_TRANSLATIONS[key][lang];
  }
  for (const [dictKey, dictVal] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (key.includes(dictKey) || dictKey.includes(key)) {
      if (dictVal[lang]) return dictVal[lang];
    }
  }
  return cat;
}

export function getLocalizedExplanation(
  result: { explanation: string; translations?: Partial<Record<Language, { explanation?: string }>> } | null | undefined,
  lang: Language
): string {
  if (!result) return '';
  if (lang === 'en') return result.explanation;
  return result.translations?.[lang]?.explanation || result.explanation;
}

export function getLocalizedEvidence(
  result: { evidence: string[]; translations?: Partial<Record<Language, { evidence?: string[] }>> } | null | undefined,
  lang: Language
): string[] {
  if (!result) return [];
  if (lang === 'en') return result.evidence;
  return result.translations?.[lang]?.evidence || result.evidence;
}

export function getLocalizedRecommendations(
  result: { recommendations: string[]; translations?: Partial<Record<Language, { recommendations?: string[] }>> } | null | undefined,
  lang: Language
): string[] {
  if (!result) return [];
  if (lang === 'en') return result.recommendations;
  return result.translations?.[lang]?.recommendations || result.recommendations;
}
