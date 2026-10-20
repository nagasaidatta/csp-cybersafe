# Cyber Safe - Online Scam Awareness & Threat Defense Portal

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Threat_Intelligence-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

A production-ready, professional, public cybersecurity awareness and threat analysis portal designed to educate citizens, prevent financial fraud, and provide real-time AI security tools against online scams, phishing links, OTP theft, and UPI fraud.

---

## 🌟 Key Features

### 1. 🛡️ Interactive Learning Modules
- **4 Official Awareness Modules**:
  - **Module 1**: Phishing Websites & Fake Portals
  - **Module 2**: Strong Passwords & Account Protection
  - **Module 3**: OTP & Social Engineering Fraud
  - **Module 4**: UPI, QR Codes & Financial Scams
- Performance-optimized click-to-load video facades to eliminate multi-player network overhead.
- Step-by-step transcripts and 4 actionable Key Takeaways per module.
- Single-query persistent learner progress synchronized with Supabase database (`module_progress` table).

### 2. 🧠 Unlocked Awareness Quiz & Score Tracking
- Dynamic progress bar unlocking the quiz upon completing all 4 learning modules.
- 10-question evaluation with answer explanations and reviews.
- Quiz score persistence in Supabase (`quiz_scores` table and `profiles.highest_quiz_score`), tracking high scores and completion timestamps.

### 3. 🔗 AI-Powered Link Safety Checker (`/api/check-link`)
- Deep URL heuristic and threat intelligence powered by **Google Gemini API** (Flash models with automatic model fallback).
- SSRF protection (blocks private IP ranges, `localhost`, and internal metadata services).
- Evaluates domain characteristics, phishing patterns, brand impersonation, deceptive credential harvesting, fake banking portals, and modded APK distributors.
- Returns threat classification, risk level (Low, Medium, High, Critical), observable evidence, and localized explanations in English, Telugu, and Hindi.

### 4. 📩 AI-Powered Message & SMS Fraud Detector (`/api/check-message`)
- Instant analysis of suspicious SMS, WhatsApp forwards, email headers, electricity cutoff alerts, lottery prizes, and fake job offers.
- Strict prompt injection sandboxing preventing user text from executing arbitrary instructions.
- Extracts suspicious phrases, categorizes scam types (UPI fraud, fake customer care, impersonation), and suggests practical next steps.

### 5. 🔑 Interactive Password Strength & Resilience Analyzer
- Real-time client-side analysis measuring password length, character diversity, structural entropy, and brute-force crack-time estimation.
- Actionable tips to construct memorable passphrases resistant to dictionary attacks.

### 6. 🤖 CyberSafe AI Assistant (Floating Chatbot - `/api/chat`)
- Draggable, floating interactive assistant powered by **Groq API** (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`).
- Specialized exclusively in cybersecurity advice, Indian cyber law, scam defense, and portal navigation.
- Strict boundary rules: Refuses off-topic questions (cooking, entertainment, coding, general trivia) in the user's language.
- Interactive deep-links within responses (e.g., jump directly to Link Checker, Modules, Quiz, or Dashboard).

### 7. 🌐 Full Native Trilingual Localization
- Instant switching between **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
- Hand-crafted, culturally accurate dictionaries for all navigation, learning content, quiz questions, auth dialogues, and AI outputs—no automated machine-translation artifacts.

### 8. 👤 User Profile & Customization
- Profile view showcasing learner statistics, completion rates, avatar badges, and highest quiz marks.
- Custom SVG avatar selection and display name updates.
- In-portal password changes handled securely via Supabase Auth.

### 9. 🔐 Hardened Authentication & Recovery Flow
- **Email + Password Login**: Powered by Supabase Auth with Row Level Security (RLS).
- **OTP-Verified Registration**: 6-digit email OTP verification (`verifyOtp`) with a 30-second cooldown timer to prevent rate limits.
- **Forgot Password Recovery**: Secure self-service password reset using email OTP tokens.
- Sensitive credentials (passwords, OTP codes) are never stored in custom database tables, cookies, or localStorage.

### 10. 📊 Administrative Learner Dashboard (`/api/dashboard-progress`)
- Protected admin dashboard requiring administrator authentication.
- Aggregated insights: total registered learners, completed modules, average quiz scores, and completion percentage breakdowns.

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│               CyberSafe Frontend (SPA)                 │
│         React 18 + TypeScript + Tailwind CSS           │
│   (Modules, Quiz, Password Checker, AI Floating Chat)   │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       Client-Side Auth & DB      Serverless API Routes
                │                  (Vercel / Vite Proxy)
                ▼                        │
   ┌─────────────────────────┐           ▼
   │     Supabase Cloud      │  ┌───────────────────────┐
   │ ─────────────────────── │  │ • /api/check-link     │ ──► Google Gemini API
   │ • Auth (Email + OTP)    │  │ • /api/check-message  │
   │ • PostgreSQL Database   │  │ • /api/chat           │ ──► Groq API (LLaMA)
   │ • Row Level Security    │  │ • /api/dashboard-...  │ ──► Supabase Admin
   └─────────────────────────┘  └───────────────────────┘
```

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Database & Auth**: Supabase PostgreSQL with strict RLS policies
- **Serverless API Layer**:
  - `/api/check-link`: Google Gemini URL threat heuristics
  - `/api/check-message`: Google Gemini message fraud analyzer
  - `/api/chat`: Groq LLaMA 3.3 70B conversational security assistant
  - `/api/dashboard-progress`: Supabase service role data aggregator for admin metrics

---

## 📁 Project Directory Structure

```
csp-jrg/
├── api/                             # Serverless API endpoints
│   ├── _gemini.js                   # Gemini API client, rate limiting & model fallbacks
│   ├── chat.js                      # CyberSafe AI Chatbot (Groq integration)
│   ├── check-link.js                # AI Link Safety threat analyzer
│   ├── check-message.js             # AI Message scam detector
│   └── dashboard-progress.js        # Admin metrics aggregation endpoint
├── public/                          # Static assets
├── src/
│   ├── components/                  # Shared UI components
│   │   ├── Avatar.tsx               # Preset user avatar SVG selectors
│   │   ├── CyberSafeChat.tsx        # Floating, draggable AI assistant
│   │   ├── Footer.tsx               # Emergency helplines & navigation links
│   │   └── Navbar.tsx               # Language selector & user menu
│   ├── context/                     # React Context (AuthContext)
│   ├── data/                        # Static learning & quiz datasets
│   │   ├── modulesData.ts           # 4 video modules metadata
│   │   └── quizData.ts              # 10 quiz questions
│   ├── i18n/                        # Trilingual translation dictionaries
│   │   ├── en.ts                    # English strings
│   │   ├── te.ts                    # Telugu (తెలుగు) strings
│   │   └── hi.ts                    # Hindi (हिन्दी) strings
│   ├── pages/                       # Portal Views
│   │   ├── AuthPage.tsx             # Login, Register (OTP), Forgot Password
│   │   ├── DashboardPage.tsx        # Admin learner progress & analytics
│   │   ├── EditProfilePage.tsx      # Avatar selection & password update
│   │   ├── HomePage.tsx             # Public landing & quick safety tools
│   │   ├── LinkSafetyPage.tsx       # AI link safety verification UI
│   │   ├── MessageSafetyPage.tsx    # AI SMS & message safety verification UI
│   │   ├── ModulesPage.tsx          # 4 awareness video modules
│   │   ├── PasswordCheckerPage.tsx  # Password strength analyzer
│   │   ├── ProfilePage.tsx          # Learner profile & completion badges
│   │   └── QuizPage.tsx             # 10-question cyber quiz UI
│   ├── types/                       # TypeScript interfaces
│   ├── utils/                       # Security & helper utilities
│   ├── App.tsx                      # Root component & state-based router
│   ├── main.tsx                     # React application entry point
│   └── index.css                    # Tailwind CSS base & utilities
├── supabase/
│   └── schema.sql                   # Database tables, RLS policies, indexes & RPCs
├── .env.example                     # Environment variables template
├── package.json                     # NPM dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript compiler options
├── vercel.json                      # Vercel deployment rewrites
└── vite.config.ts                   # Vite configuration with local API middleware
```

---

## 🗄️ Supabase Database Schema

To set up your database, navigate to the **SQL Editor** in your [Supabase Dashboard](https://supabase.com/dashboard) and execute the queries below (also available in `supabase/schema.sql`):

```sql
-- 1. Create 'profiles' table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_id TEXT DEFAULT 'avatar-1' NOT NULL,
  highest_quiz_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public email check"
  ON public.profiles FOR SELECT TO anon
  USING (true);


-- 2. Create 'module_progress' table
CREATE TABLE IF NOT EXISTS public.module_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 4),
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own module progress"
  ON public.module_progress FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_module_progress_user
  ON public.module_progress (user_id);


-- 3. Create 'quiz_scores' table
CREATE TABLE IF NOT EXISTS public.quiz_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  highest_score INT NOT NULL DEFAULT 0,
  last_score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 10,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own quiz score"
  ON public.quiz_scores FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view quiz scores"
  ON public.quiz_scores FOR SELECT TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_user
  ON public.quiz_scores (user_id);


-- 4. Email check RPC function (prevents duplicate registration attempts)
CREATE OR REPLACE FUNCTION public.check_email_exists(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE LOWER(email) = LOWER(TRIM(check_email))
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE LOWER(email) = LOWER(TRIM(check_email))
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_email_exists(TEXT) TO anon, authenticated;
```

---

## 🔑 Supabase Authentication Settings

1. In Supabase Dashboard, open **Authentication** $\to$ **Providers** $\to$ **Email**.
2. Enable the **Email** provider.
3. Turn off **Confirm email** if you want seamless OTP sign-up, or configure the confirmation template.
4. Set **Email OTP Expiration** to your desired duration (e.g., 3600 seconds).
5. In **Email Templates** $\to$ **Confirmation / Magic Link**, insert `{{ .Token }}` so users receive their 6-digit verification code.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Client-Side Configuration (Public)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Server-Side Configuration (Never exposed to the client)
# Required for Admin Dashboard to aggregate user progress across learners
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Admin Dashboard Credentials (Defaults: admin / cybersafe)
ADMIN_ID=admin
ADMIN_PASSWORD=cybersafe

# Google Gemini API (Required for Link Safety and Message Safety Checkers)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash

# Groq API (Required for CyberSafe AI Chat Assistant)
# Get a free key at https://console.groq.com/keys
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
```

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Public (Frontend) | URL of your Supabase project |
| `VITE_SUPABASE_ANON_KEY` | Public (Frontend) | Anonymous public key for Supabase Auth and Client Queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret (Backend) | Service role key for admin aggregation in `/api/dashboard-progress` |
| `ADMIN_ID` | Secret (Backend) | Username for logging into `/dashboard` |
| `ADMIN_PASSWORD` | Secret (Backend) | Password for logging into `/dashboard` |
| `GEMINI_API_KEY` | Secret (Backend) | API key for Gemini threat analysis in `/api/check-link` and `/api/check-message` |
| `GEMINI_MODEL` | Secret (Backend) | Primary Gemini model ID (`gemini-1.5-flash`, etc.) |
| `GROQ_API_KEY` | Secret (Backend) | API key for CyberSafe AI assistant in `/api/chat` |
| `GROQ_MODEL` | Secret (Backend) | Groq model ID (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`) |

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd csp-jrg
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase, Gemini, and Groq keys in .env.local
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   *Note: `vite.config.ts` includes built-in server middleware that simulates all `/api/*` serverless routes during local development.*

5. **Build and test production bundle**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select your repository.
3. Set the Framework Preset to **Vite**.
4. Add all environment variables listed above under **Project Settings** $\to$ **Environment Variables**.
5. Click **Deploy**. Vercel will automatically build the frontend and deploy the serverless functions located in `/api`.

---

## 🚨 Cyber Crime Emergency Information (India)

If you or someone you know has been targeted by cyber fraud or online financial theft:

- 📞 **National Cyber Crime Helpline**: Dial **1930** (Toll-Free, 24x7)
- 🌐 **National Cyber Crime Reporting Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- ⏱️ **Golden Hour Principle**: Report financial fraud within **2 hours** to maximize the chance of freezing fraudulent transactions before money is withdrawn.
