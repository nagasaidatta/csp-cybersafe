# Cyber Safe - Online Scam Awareness Portal

A minimal, professional, production-ready public cybersecurity awareness portal designed to educate citizens on online scams, phishing attacks, OTP fraud, and UPI security.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase Auth & Database**, configured for deployment on **Vercel**.

---

## 🌟 Key Features

1. **Clean, Real Public Portal Aesthetic**
   - Clean, lightweight, and accessible design respecting `prefers-reduced-motion`.
   - Fully responsive across desktop, tablet, and mobile devices.
   - Zero unnecessary animations, no neon lighting, and no fake statistics.

2. **Accurate Multi-Language Support**
   - Instant switching between **English**, **తెలుగు (Telugu)**, and **हिन्दी (Hindi)**.
   - All navigation, educational modules, takeaways, quiz questions, choices, and auth errors are fully localized in a structured dictionary without machine translation APIs.

3. **Supabase Authentication Flow**
   - **Login**: Pure Email + Password authentication via Supabase Auth.
   - **Registration**: Strictly sequenced 4-step verified registration:
     - **Step 1**: Name + Email $\to$ Built-in Supabase Email OTP (`signInWithOtp`).
     - **30-Second Cooldown**: Reliable UI timer preventing rate-limiting on Resend OTP.
     - **Step 2**: 8-digit OTP verification via Supabase Auth (`verifyOtp`).
     - **Step 3**: Password setup via Supabase Auth (`updateUser`).
     - **Step 4**: Non-sensitive profile persistence in the `profiles` table (`id`, `name`, `email`, `created_at`).
   - Passwords and OTPs are never stored in custom database tables, cookies, or local storage.

4. **Interactive Learning Modules**
   - 4 official awareness modules embedded directly on one page:
     - **Module 1**: Phishing Websites
     - **Module 2**: Strong Passwords
     - **Module 3**: OTP Sharing Scams
     - **Module 4**: UPI & QR Code Scams
   - Performance-optimized video facade (click-to-load iframe) preventing multi-player network overhead.
   - Transcripts & 4 actionable Key Takeaways for each module.
   - Single-query persistent module progress in Supabase (`module_progress` table).

5. **Progress & Unlocked Awareness Quiz**
   - Real-time progress bar ($0\%, 25\%, 50\%, 75\%, 100\%$).
   - Quiz button remains disabled until all 4 modules are completed, after which it turns green and unlocks.
   - 10-question single-page quiz with 2 choices per question.
   - Score calculated locally on client (`Your Score: X/10`) with comprehensive answer review.

---

## 🚀 Supabase Setup

### 1. Database Schema & RLS

Open your Supabase project dashboard, navigate to **SQL Editor**, and run the SQL script found in `supabase/schema.sql`:

```sql
-- 1. Create 'profiles' table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
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

-- 2. Create 'module_progress' table
CREATE TABLE IF NOT EXISTS public.module_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 4),
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own module progress"
  ON public.module_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own module progress"
  ON public.module_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own module progress"
  ON public.module_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 2. Supabase Auth Email OTP Configuration

In your Supabase project dashboard:
1. Go to **Authentication** $\to$ **Providers** $\to$ **Email**.
2. Ensure **Enable Email provider** is turned on.
3. Under **Email OTP expiry**, ensure standard token expiry (e.g. 3600 seconds or 10 minutes).
4. In **Email Templates** $\to$ **Confirmation**, you can use the token code `{{ .Token }}` in your email body.

---

## 🛠️ Local Development

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. In the project settings, add the Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
4. Deploy! Vercel automatically detects the Vite configuration and `vercel.json` rewrite rules.

---

## 🛡️ Cyber Crime Reporting Information

In case of online financial fraud or cybercrime in India:
- **National Cyber Crime Helpline**: `1930`
- **National Cyber Crime Reporting Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
