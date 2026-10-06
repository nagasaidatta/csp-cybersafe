import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, User, KeyRound, AlertCircle, CheckCircle2, Shield, ArrowLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AuthMode, RegisterStep, ViewState } from '../types';

interface AuthPageProps {
  onNavigate: (view: ViewState) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user, saveProfile, refreshProfile } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cooldown for OTP Resend (30 seconds)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // If user verifies email via confirmation link or OTP in another window/tab,
  // automatically advance to Step 3 (Set Password)
  useEffect(() => {
    if (user && mode === 'register' && registerStep < 3) {
      setRegisterStep(3);
      setSuccessMessage(t('otpVerifiedSuccess'));
      setErrorMessage(null);
    }
  }, [user, mode, registerStep, t]);

  const startCooldown = () => {
    setCooldownRemaining(30);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
    setRegisterStep(1);
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };

  // -------------------------------------------------------------
  // LOGIN SUBMIT (Email + Password only)
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage(t('errInvalidEmail'));
      return;
    }

    if (!password) {
      setErrorMessage(t('errPasswordLength'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage(t('errAuthFailed'));
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setErrorMessage(t('errNetwork'));
        } else {
          setErrorMessage(t('errAuthFailed'));
        }
        return;
      }

      if (data.user) {
        await refreshProfile();
        onNavigate('modules');
      }
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION STEP 1: Get OTP / Resend OTP
  // -------------------------------------------------------------
  const handleGetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearMessages();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage(t('nameLabel') + ' is required.');
      return;
    }

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage(t('errInvalidEmail'));
      return;
    }

    if (cooldownRemaining > 0) return;

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          data: { name: cleanName },
          shouldCreateUser: true,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit') || error.status === 429) {
          setErrorMessage(t('errOtpRateLimit'));
        } else if (error.message.toLowerCase().includes('network')) {
          setErrorMessage(t('errNetwork'));
        } else {
          setErrorMessage(error.message || t('errAuthFailed'));
        }
        return;
      }

      setOtpRequested(true);
      startCooldown();
      setSuccessMessage(t('otpSentSuccess'));
      setRegisterStep(2);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION STEP 2: Verify OTP
  // -------------------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanOtp = otp.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage(t('errInvalidOtp'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    setLoading(true);
    try {
      // 1. Try with type: 'email' (standard for signInWithOtp)
      let verifyResult = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: 'email',
      });

      // 2. If it fails, fallback to type: 'signup' (if Supabase treated it as new signup)
      if (verifyResult.error) {
        const signupResult = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanOtp,
          type: 'signup',
        });
        if (!signupResult.error) {
          verifyResult = signupResult;
        }
      }

      const { data, error } = verifyResult;

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('expired')) {
          setErrorMessage(t('errExpiredOtp'));
        } else if (msg.includes('rate limit') || error.status === 429) {
          setErrorMessage(t('errOtpRateLimit'));
        } else {
          setErrorMessage(t('errInvalidOtp'));
        }
        return;
      }

      if (data.session || data.user) {
        setSuccessMessage(t('otpVerifiedSuccess'));
        setRegisterStep(3);
      } else {
        setErrorMessage(t('errInvalidOtp'));
      }
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // REGISTRATION STEP 3 & 4: Set Password & Store Profile
  // -------------------------------------------------------------
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (password.length < 8) {
      setErrorMessage(t('errPasswordLength'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('errPasswordMismatch'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured.');
      return;
    }

    setLoading(true);
    try {
      // 1. Update user password in Supabase Auth
      const { error: pwdError } = await supabase.auth.updateUser({
        password: password,
        data: { name: name.trim() },
      });

      if (pwdError) {
        setErrorMessage(pwdError.message || t('errAuthFailed'));
        setLoading(false);
        return;
      }

      // 2. Step 4: Store profile information in 'profiles' table
      const profileSaved = await saveProfile(name, email);
      if (!profileSaved) {
        console.warn('Note: Profile table upsert skipped or pending RLS. Proceeding with authenticated session.');
      }

      setSuccessMessage(t('regCompleteSuccess'));
      // Access granted to learning content
      setTimeout(() => {
        onNavigate('modules');
      }, 500);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14 max-w-md mx-auto px-4">
      {/* Back to Home Button */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal Home</span>
      </button>

      {/* Supabase Notice if not configured */}
      {!isSupabaseConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-900 text-xs sm:text-sm">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            Supabase Configuration Required
          </p>
          <p>
            Please set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> in your environment or <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> file to enable live authentication and database persistence.
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Auth Tabs: Login vs Register */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`py-3.5 text-center text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabLogin')}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`py-3.5 text-center text-sm font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-white text-blue-700 border-b-2 border-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabRegister')}
          </button>
        </div>

        <div className="p-6">
          {/* Error & Success Alerts */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-5 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
              <div className="leading-snug">{successMessage}</div>
            </div>
          )}

          {/* ---------------- LOGIN FORM ---------------- */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="login-email">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="login-password">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                >
                  {loading ? 'Processing...' : t('btnLogin')}
                </button>
              </div>
            </form>
          )}

          {/* ---------------- REGISTRATION FLOW ---------------- */}
          {mode === 'register' && (
            <div>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      registerStep >= 1 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </span>
                  <span className="text-xs font-medium text-slate-700">Account</span>
                </div>
                <div className="w-6 h-px bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      registerStep >= 2 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    2
                  </span>
                  <span className="text-xs font-medium text-slate-700">Verify OTP</span>
                </div>
                <div className="w-6 h-px bg-slate-300"></div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      registerStep === 3 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    3
                  </span>
                  <span className="text-xs font-medium text-slate-700">Password</span>
                </div>
              </div>

              {/* STEP 1: INITIAL REGISTRATION (Name, Email -> Get OTP) */}
              {registerStep === 1 && (
                <form onSubmit={handleGetOtp} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2">
                    {t('step1Desc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-name">
                      {t('nameLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('namePlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-email">
                      {t('emailLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || cooldownRemaining > 0}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                    >
                      {loading
                        ? 'Sending...'
                        : otpRequested && cooldownRemaining > 0
                        ? t('cooldownText', { seconds: cooldownRemaining })
                        : otpRequested
                        ? t('btnResendOtp')
                        : t('btnGetOtp')}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {registerStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2">
                    {t('step2Desc')} <strong>{email}</strong>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-otp">
                      {t('otpLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder={t('otpPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-sm font-mono tracking-widest border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                    >
                      {loading ? 'Verifying...' : t('btnVerifyOtp')}
                    </button>
                  </div>

                  {/* Resend OTP button with exact 30-second cooldown */}
                  <div className="text-center pt-2 border-t border-slate-100">
                    {cooldownRemaining > 0 ? (
                      <span className="text-xs text-slate-500 font-medium">
                        {t('cooldownText', { seconds: cooldownRemaining })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleGetOtp()}
                        disabled={loading}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline focus:outline-none"
                      >
                        {t('btnResendOtp')}
                      </button>
                    )}
                  </div>

                  {/* Supabase Email template guidance */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 leading-normal">
                    <span className="font-semibold text-slate-800 block mb-0.5">Tip:</span>
                    If your email contains a "Confirm email address" button, you can click it to confirm directly, or configure Supabase's template to display the 6-digit code.
                  </div>
                </form>
              )}

              {/* STEP 3: PASSWORD SETUP */}
              {registerStep === 3 && (
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2">
                    {t('step3Desc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-pwd">
                      {t('passwordLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-pwd"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('passwordPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {t('passwordRequirement')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-confirm-pwd">
                      {t('confirmPasswordLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-confirm-pwd"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmPasswordPlaceholder')}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 bg-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60"
                    >
                      {loading ? 'Setting Password...' : t('btnSetPassword')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security badge notice */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Shield className="w-4 h-4 text-slate-400" />
        <span>End-to-End Secure Supabase Authentication</span>
      </div>
    </div>
  );
};
