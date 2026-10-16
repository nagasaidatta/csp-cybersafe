export type Language = 'en' | 'te' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export interface ModuleProgress {
  user_id: string;
  module_id: number;
  completed: boolean;
  completed_at: string;
}

export interface ModuleItem {
  id: number;
  titleKey: string;
  videoUrl: string;
  videoId: string;
  transcriptKey: string;
  takeawaysKey: string;
  buttonKey: string;
}

export interface QuizQuestionItem {
  id: number;
  questionKey: string;
  optionsKeys: [string, string];
  correctIndex: number; // 0 or 1
}

export type ViewState = 'home' | 'auth' | 'modules' | 'quiz' | 'link-safety' | 'message-safety' | 'password-checker';
export type AuthMode = 'login' | 'register';
export type RegisterStep = 1 | 2 | 3; // 1: initial (name, email -> Get OTP), 2: OTP verification, 3: Password setup

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';

export interface LocalizedContent {
  explanation?: string;
  evidence?: string[];
  recommendations?: string[];
}

export interface LinkSafetyResult {
  submittedUrl: string;
  classification: string;
  riskLevel: RiskLevel;
  categories: string[];
  explanation: string;
  evidence: string[];
  translations?: Partial<Record<Language, LocalizedContent>>;
  limitations?: string;
  cachedAt?: number;
  model?: string;
}

export interface MessageSafetyResult {
  classification: 'Likely Scam' | 'Suspicious' | 'No Strong Scam Indicators Detected' | 'Unable to Verify';
  riskLevel: RiskLevel;
  scamCategories: string[];
  suspiciousPhrases: string[];
  explanation: string;
  recommendations: string[];
  translations?: Partial<Record<Language, LocalizedContent>>;
  limitations?: string;
  cachedAt?: number;
  model?: string;
}

