-- ========================================================
-- CYBER SAFE - ONLINE SCAM AWARENESS PORTAL
-- SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ========================================================

-- 1. Create 'profiles' table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_id TEXT DEFAULT 'avatar-1' NOT NULL,
  highest_quiz_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure column exists if table was previously created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS highest_quiz_score INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_id TEXT DEFAULT 'avatar-1';

-- Enable RLS on 'profiles'
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies: Authenticated users can only read & write their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow email existence check during registration
CREATE POLICY "Allow public email check"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);


-- 2. Create 'module_progress' table
CREATE TABLE IF NOT EXISTS public.module_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id INT NOT NULL CHECK (module_id BETWEEN 1 AND 4),
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

-- Enable RLS on 'module_progress'
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;

-- Module Progress RLS Policies: Authenticated users can only access & mutate their own progress
DROP POLICY IF EXISTS "Users can view own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can insert own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can update own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can delete own module progress" ON public.module_progress;
DROP POLICY IF EXISTS "Users can manage own module progress" ON public.module_progress;

CREATE POLICY "Users can manage own module progress"
  ON public.module_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: Performance Index on module_progress
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

-- Enable RLS on 'quiz_scores'
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

-- Quiz Scores RLS Policies
DROP POLICY IF EXISTS "Users can manage own quiz score" ON public.quiz_scores;
CREATE POLICY "Users can manage own quiz score"
  ON public.quiz_scores
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view quiz scores" ON public.quiz_scores;
CREATE POLICY "Authenticated users can view quiz scores"
  ON public.quiz_scores
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Performance Index on quiz_scores
CREATE INDEX IF NOT EXISTS idx_quiz_scores_user
  ON public.quiz_scores (user_id);


-- 4. Helper RPC to check if an email already exists in auth.users or profiles
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
