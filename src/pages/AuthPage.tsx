import React, { useState, useEffect, useRef } from 'react';
import { Lock, Mail, User, KeyRound, AlertCircle, CheckCircle2, Circle, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AuthMode, RegisterStep, ForgotStep, ViewState } from '../types';

interface AuthPageProps {
  onNavigate: (view: ViewState) => void;
  redirectTo?: ViewState | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate, redirectTo }) => {
  const { t } = useLanguage();
  const { user, saveProfile, refreshProfile } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>(1);
  const [forgotStep, setForgotStep] = useState<ForgotStep>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  // Password Visibility Toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // If user is logged in and on login mode, navigate immediately
  useEffect(() => {
    if (user && mode === 'login') {
      onNavigate(redirectTo || 'home');
    }
  }, [user, mode, onNavigate, redirectTo]);

  // If user verifies email via confirmation link or OTP in another window/tab,
  // automatically advance to Step 3 (Set Password)
  useEffect(() => {
    if (user && mode === 'register' && registerStep < 3) {
      setRegisterStep(3);
      setSuccessMessage(t('otpVerifiedSuccess'));
      setErrorMessage(null);
    }
  }, [user, mode, registerStep, t]);

  useEffect(() => {
    if (user && mode === 'forgot' && forgotStep < 3) {
      setForgotStep(3);
      setSuccessMessage(t('otpVerifiedSuccess'));
      setErrorMessage(null);
    }
  }, [user, mode, forgotStep, t]);

  // Listen for password recovery events or recovery hash in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('type=recovery')) {
        setMode('forgot');
        setForgotStep(3);
        setSuccessMessage(t('otpVerifiedSuccess'));
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('forgot');
        setForgotStep(3);
        setSuccessMessage(t('otpVerifiedSuccess'));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [t]);

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
    setForgotStep(1);
    setOtp('');
    setPassword('');
    setConfirmPassword('');
  };

  // Real-time password criteria & strength evaluation
  const pwdCriteria = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const fulfilledCount = Object.values(pwdCriteria).filter(Boolean).length;
  const isStrong = fulfilledCount === 5;
  const isMedium = password.length > 0 && fulfilledCount >= 3 && fulfilledCount < 5;
  const isWeak = password.length > 0 && fulfilledCount < 3;

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
      setErrorMessage('Authentication service is not configured yet. Please try again later.');
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
        setSuccessMessage(t('loginSuccess'));
        onNavigate(redirectTo || 'home');
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
      setErrorMessage('Authentication service is not configured yet. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      // 1. PRE-CHECK: Check if account already exists with this email before sending OTP
      try {
        const { data: rpcExists, error: rpcErr } = await supabase.rpc('check_email_exists', {
          check_email: cleanEmail,
        });

        if (!rpcErr && rpcExists === true) {
          setErrorMessage(t('errExistingEmail'));
          setLoading(false);
          return;
        }

        const { data: profileExists, error: profErr } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (!profErr && profileExists) {
          setErrorMessage(t('errExistingEmail'));
          setLoading(false);
          return;
        }
      } catch (checkErr) {
        console.warn('Pre-check email note:', checkErr);
      }

      // 2. Only if no existing account was found, proceed to send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          data: { name: cleanName },
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('OTP error:', error);
        const msg = error.message.toLowerCase();
        if (msg.includes('rate limit') || error.status === 429) {
          setErrorMessage(t('errOtpRateLimit') + ` (${error.message})`);
        } else {
          setErrorMessage(`Error: ${error.message} ${error.status ? `[Status ${error.status}]` : ''}`);
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
      setErrorMessage('Authentication service is not configured.');
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

    if (!isStrong) {
      setErrorMessage(t('errPasswordNotStrong'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('errPasswordMismatch'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured.');
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
        onNavigate(redirectTo || 'modules');
      }, 500);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD STEP 1: Send OTP
  // -------------------------------------------------------------
  const handleForgotGetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearMessages();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setErrorMessage(t('errInvalidEmail'));
      return;
    }

    if (cooldownRemaining > 0) return;

    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured yet. Please try again later.');
      return;
    }

    setLoading(true);
    try {
      // 1. Pre-check if email exists in database
      try {
        const { data: rpcExists, error: rpcErr } = await supabase.rpc('check_email_exists', {
          check_email: cleanEmail,
        });

        if (!rpcErr && rpcExists === false) {
          setErrorMessage(t('errEmailNotFound'));
          setLoading(false);
          return;
        }
      } catch (checkErr) {
        console.warn('Pre-check email note:', checkErr);
      }

      // 2. Request OTP for password reset
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      if (error) {
        console.error('Password reset OTP error:', error);
        const msg = error.message.toLowerCase();
        if (msg.includes('rate limit') || error.status === 429) {
          setErrorMessage(t('errOtpRateLimit') + ` (${error.message})`);
        } else {
          setErrorMessage(`Error: ${error.message} ${error.status ? `[Status ${error.status}]` : ''}`);
        }
        return;
      }

      setOtpRequested(true);
      startCooldown();
      setSuccessMessage(t('otpSentSuccess'));
      setForgotStep(2);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // FORGOT PASSWORD STEP 2: Verify OTP
  // -------------------------------------------------------------
  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    const cleanOtp = otp.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMessage(t('errInvalidOtp'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured.');
      return;
    }

    setLoading(true);
    try {
      // 1. Try with type: 'recovery' (standard for resetPasswordForEmail)
      let verifyResult = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanOtp,
        type: 'recovery',
      });

      // 2. Fallback to type: 'email' if needed
      if (verifyResult.error) {
        const emailResult = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanOtp,
          type: 'email',
        });
        if (!emailResult.error) {
          verifyResult = emailResult;
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
        setForgotStep(3);
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
  // FORGOT PASSWORD STEP 3: Set New Password
  // -------------------------------------------------------------
  const handleForgotSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isStrong) {
      setErrorMessage(t('errPasswordNotStrong'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(t('errPasswordMismatch'));
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage('Authentication service is not configured.');
      return;
    }

    setLoading(true);
    try {
      const { error: pwdError } = await supabase.auth.updateUser({
        password: password,
      });

      if (pwdError) {
        setErrorMessage(pwdError.message || t('errAuthFailed'));
        setLoading(false);
        return;
      }

      await refreshProfile();
      setSuccessMessage(t('passwordResetSuccess'));
      setTimeout(() => {
        onNavigate(redirectTo || 'home');
      }, 1200);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordStrength = () => (
    <div className="mt-3 p-3.5 bg-slate-100/80 rounded-xl space-y-2.5 text-xs">
      {/* Strength Label and Badge */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700">
          {t('pwdStrengthLabel')}:
        </span>
        {password.length > 0 ? (
          <span
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
              isStrong
                ? 'bg-emerald-100 text-emerald-800'
                : isMedium
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isStrong
              ? t('pwdStrengthStrong')
              : isMedium
              ? t('pwdStrengthMedium')
              : t('pwdStrengthWeak')}
          </span>
        ) : (
          <span className="text-slate-400 text-[11px] font-medium">—</span>
        )}
      </div>

      {/* 3-segment Strength Bar */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            password.length === 0
              ? 'bg-slate-200'
              : isWeak
              ? 'bg-red-500'
              : isMedium
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isMedium
              ? 'bg-amber-500'
              : isStrong
              ? 'bg-emerald-500'
              : 'bg-slate-200'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isStrong ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
        />
      </div>

      {/* Realtime 5 Criteria Checklist */}
      <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
        <div
          className={`flex items-center gap-2 transition-colors ${
            pwdCriteria.minLength
              ? 'text-emerald-800 font-medium'
              : 'text-slate-500'
          }`}
        >
          {pwdCriteria.minLength ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span>{t('pwdRuleMinLength')}</span>
        </div>

        <div
          className={`flex items-center gap-2 transition-colors ${
            pwdCriteria.uppercase
              ? 'text-emerald-800 font-medium'
              : 'text-slate-500'
          }`}
        >
          {pwdCriteria.uppercase ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span>{t('pwdRuleUppercase')}</span>
        </div>

        <div
          className={`flex items-center gap-2 transition-colors ${
            pwdCriteria.lowercase
              ? 'text-emerald-800 font-medium'
              : 'text-slate-500'
          }`}
        >
          {pwdCriteria.lowercase ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span>{t('pwdRuleLowercase')}</span>
        </div>

        <div
          className={`flex items-center gap-2 transition-colors ${
            pwdCriteria.number
              ? 'text-emerald-800 font-medium'
              : 'text-slate-500'
          }`}
        >
          {pwdCriteria.number ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span>{t('pwdRuleNumber')}</span>
        </div>

        <div
          className={`flex items-center gap-2 transition-colors ${
            pwdCriteria.symbol
              ? 'text-emerald-800 font-medium'
              : 'text-slate-500'
          }`}
        >
          {pwdCriteria.symbol ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span>{t('pwdRuleSymbol')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-10 sm:py-14 max-w-md mx-auto px-4">
      {/* Back to Home Button */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('backToHome')}</span>
      </button>

      {/* Configuration Notice if not configured */}
      {!isSupabaseConfigured && (
        <div className="mb-6 p-4 bg-amber-100 rounded-md text-amber-900 text-xs sm:text-sm">
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            Authentication Configuration Required
          </p>
          <p>
            Please set the authentication service environment variables in your environment or <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> file to enable live authentication and database persistence.
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Auth Tabs: Login vs Register */}
        {mode !== 'forgot' ? (
          <div className="grid grid-cols-2 border-b border-slate-200/80 bg-slate-100/90">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className={`py-3.5 text-center text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabLogin')}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`py-3.5 text-center text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-blue-700 border-b-2 border-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('tabRegister')}
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-100/90 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 focus:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('backToLogin')}
            </button>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('resetPasswordTitle')}
            </span>
          </div>
        )}

        <div className="p-6 sm:p-7">
          {/* Error & Success Alerts */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-red-100 text-red-900 text-sm flex items-start justify-between gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
              {mode === 'register' && errorMessage === t('errExistingEmail') && (
                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="font-bold underline text-blue-700 hover:text-blue-900 shrink-0 text-xs sm:text-sm whitespace-nowrap"
                >
                  {t('tabLogin')}
                </button>
              )}
              {mode === 'forgot' && errorMessage === t('errEmailNotFound') && (
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="font-bold underline text-blue-700 hover:text-blue-900 shrink-0 text-xs sm:text-sm whitespace-nowrap"
                >
                  {t('tabRegister')}
                </button>
              )}
            </div>
          )}

          {successMessage && (
            <div
              role="status"
              className="mb-5 p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-sm flex items-start gap-2.5"
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
                <div className="relative flex items-center">
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
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-slate-800" htmlFor="login-password">
                    {t('passwordLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep(1);
                      clearMessages();
                      setOtp('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline focus:outline-none"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
                >
                  {loading ? t('processing') : t('btnLogin')}
                </button>
              </div>
            </form>
          )}

          {/* ---------------- REGISTRATION FLOW ---------------- */}
          {mode === 'register' && (
            <div>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      registerStep >= 1 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-xs ${registerStep >= 1 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{t('stepAccount')}</span>
                </div>
                <div className={`flex-1 mx-2 h-0.5 rounded-full ${registerStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      registerStep >= 2 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-xs ${registerStep >= 2 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{t('stepVerify')}</span>
                </div>
                <div className={`flex-1 mx-2 h-0.5 rounded-full ${registerStep === 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      registerStep === 3 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    3
                  </span>
                  <span className={`text-xs ${registerStep === 3 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{t('stepPassword')}</span>
                </div>
              </div>

              {/* STEP 1: INITIAL REGISTRATION (Name, Email -> Get OTP) */}
              {registerStep === 1 && (
                <form onSubmit={handleGetOtp} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t('step1Desc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-name">
                      {t('nameLabel')}
                    </label>
                    <div className="relative flex items-center">
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
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-email">
                      {t('emailLabel')}
                    </label>
                    <div className="relative flex items-center">
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
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || cooldownRemaining > 0}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {loading
                        ? t('sending')
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
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t('step2Desc')} <strong>{email}</strong>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-otp">
                      {t('otpLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder={t('otpPlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 text-sm font-mono tracking-widest border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {loading ? t('verifying') : t('btnVerifyOtp')}
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
                </form>
              )}

              {/* STEP 3: PASSWORD SETUP */}
              {registerStep === 3 && (
                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t('step3Desc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-pwd">
                      {t('passwordLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-pwd"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('passwordPlaceholder')}
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Real-time Password Strength Meter & Criteria Checklist */}
                    {renderPasswordStrength()}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="reg-confirm-pwd">
                      {t('confirmPasswordLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-confirm-pwd"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmPasswordPlaceholder')}
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {password === confirmPassword ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('passwordsMatch')}</span>
                          </span>
                        ) : (
                          <span className="text-red-700 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>{t('errPasswordMismatch')}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !isStrong || password !== confirmPassword}
                      className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isStrong && password === confirmPassword && !loading
                          ? 'text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 focus-visible:ring-blue-600 cursor-pointer hover:shadow'
                          : 'bg-slate-200/60 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? t('settingPassword') : t('btnSetPassword')}
                    </button>
                    {!isStrong && password.length > 0 && (
                      <p className="mt-1.5 text-xs text-center text-slate-500">
                        {t('errPasswordNotStrong')}
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ---------------- FORGOT PASSWORD FLOW ---------------- */}
          {mode === 'forgot' && (
            <div>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      forgotStep >= 1 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    1
                  </span>
                  <span className={`text-xs ${forgotStep >= 1 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                    {t('stepAccount')}
                  </span>
                </div>
                <div className={`flex-1 mx-2 h-0.5 rounded-full ${forgotStep >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      forgotStep >= 2 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-xs ${forgotStep >= 2 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                    {t('stepVerify')}
                  </span>
                </div>
                <div className={`flex-1 mx-2 h-0.5 rounded-full ${forgotStep === 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      forgotStep === 3 ? 'bg-blue-700 text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    3
                  </span>
                  <span className={`text-xs ${forgotStep === 3 ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                    {t('stepPassword')}
                  </span>
                </div>
              </div>

              {/* STEP 1: ENTER EMAIL -> GET OTP */}
              {forgotStep === 1 && (
                <form onSubmit={handleForgotGetOtp} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t('resetPasswordDesc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="forgot-email">
                      {t('emailLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || cooldownRemaining > 0}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {loading
                        ? t('sending')
                        : otpRequested && cooldownRemaining > 0
                        ? t('cooldownText', { seconds: cooldownRemaining })
                        : t('btnGetOtp')}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: VERIFY OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleForgotVerifyOtp} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed flex items-center justify-between">
                    <span>
                      {t('step2Desc')} <strong>{email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep(1);
                        clearMessages();
                      }}
                      className="text-blue-700 hover:text-blue-900 underline text-xs ml-2 shrink-0 font-medium"
                    >
                      {t('changeEmail')}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="forgot-otp">
                      {t('otpLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder={t('otpPlaceholder')}
                        className="w-full pl-9 pr-3 py-2.5 text-sm font-mono tracking-widest border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60"
                    >
                      {loading ? t('verifying') : t('btnVerifyOtp')}
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
                        onClick={() => handleForgotGetOtp()}
                        disabled={loading}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline focus:outline-none"
                      >
                        {t('btnResendOtp')}
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* STEP 3: SET NEW PASSWORD & CONFIRM */}
              {forgotStep === 3 && (
                <form onSubmit={handleForgotSetPassword} className="space-y-4">
                  <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                    {t('step3Desc')}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="forgot-pwd">
                      {t('newPasswordLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-pwd"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('passwordPlaceholder')}
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {renderPasswordStrength()}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-1.5" htmlFor="forgot-confirm-pwd">
                      {t('confirmNewPasswordLabel')}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="forgot-confirm-pwd"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('confirmPasswordPlaceholder')}
                        className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 bg-white shadow-2xs hover:border-slate-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        {password === confirmPassword ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t('passwordsMatch')}</span>
                          </span>
                        ) : (
                          <span className="text-red-700 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>{t('errPasswordMismatch')}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || !isStrong || password !== confirmPassword}
                      className={`w-full py-2.5 px-4 text-sm font-semibold rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        isStrong && password === confirmPassword && !loading
                          ? 'text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 focus-visible:ring-blue-600 cursor-pointer hover:shadow'
                          : 'bg-slate-200/60 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? t('settingPassword') : t('btnResetPassword')}
                    </button>
                    {!isStrong && password.length > 0 && (
                      <p className="mt-1.5 text-xs text-center text-slate-500">
                        {t('errPasswordNotStrong')}
                      </p>
                    )}
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
        <span>{t('secureAuthNotice')}</span>
      </div>
    </div>
  );
};
