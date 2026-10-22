import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Avatar, AVATAR_OPTIONS, AvatarId } from '../components/Avatar';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { ViewState } from '../types';

interface EditProfilePageProps {
  onNavigate: (view: ViewState) => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ onNavigate }) => {
  const { user, profile, updateAvatar, updateDisplayName } = useAuth();
  const { t } = useLanguage();

  const currentSavedName = profile?.name || user?.user_metadata?.name || '';
  const [avatarId, setAvatarId] = useState<AvatarId>((profile?.avatar_id as AvatarId) || 'avatar-1');
  const [displayName, setDisplayName] = useState(currentSavedName);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState<'name' | 'avatar' | 'password' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile?.avatar_id) {
      setAvatarId(profile.avatar_id as AvatarId);
    }
  }, [profile?.avatar_id]);

  useEffect(() => {
    if (currentSavedName && !displayName) {
      setDisplayName(currentSavedName);
    }
  }, [currentSavedName, displayName]);

  // Password criteria verification
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passedCriteriaCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  const passwordReady = passedCriteriaCount === 5;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isNameChanged = displayName.trim().length >= 2 && displayName.trim() !== currentSavedName;

  const clearMessage = () => setMessage(null);
  const notify = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveName = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessage();
    const name = displayName.trim();
    if (name.length < 2 || name.length > 50) {
      return notify('error', t('profileNameLengthError'));
    }
    setSaving('name');
    const result = await updateDisplayName(name);
    setSaving(null);
    notify(
      result.success ? 'success' : 'error',
      result.success ? t('profileNameUpdated') : result.error || 'Unable to update display name.'
    );
  };

  const handleSelectAvatar = async (id: AvatarId) => {
    if (id === avatarId) return;
    clearMessage();
    setAvatarId(id);
    setSaving('avatar');
    const success = await updateAvatar(id);
    setSaving(null);
    if (success) {
      notify('success', t('profileAvatarSaved'));
    }
  };

  const handleSavePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessage();
    if (!passwordReady) {
      return notify('error', t('pwdCriteriaTitle'));
    }
    if (newPassword !== confirmPassword) {
      return notify('error', t('errPasswordMismatch'));
    }
    if (!isSupabaseConfigured) {
      return notify('error', 'Password updates are unavailable in this environment.');
    }
    setSaving('password');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        notify('error', error.message);
      } else {
        setNewPassword('');
        setConfirmPassword('');
        notify('success', t('profilePasswordUpdated'));
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>{t('viewProfile')}</span>
          </button>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t('profileEditAction')}
          </h1>
        </div>

        {/* Global Feedback Alert */}
        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium shadow-xs transition-all ${
              message.type === 'success'
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-red-100 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-red-600" />
              )}
              <span className="truncate">{message.text}</span>
            </div>
            <button
              type="button"
              onClick={clearMessage}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Profile Information & Avatar Card */}
        <section className="rounded-2xl bg-white p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100/70 text-blue-700">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('profileInfoSection')}
            </h2>
          </div>

          {/* Avatar Selector: Big selected avatar on left, 10 small avatars on right */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-5 sm:p-6 rounded-2xl bg-slate-100/80">
            {/* Big Selected Avatar on Left */}
            <div className="flex flex-col items-center shrink-0 sm:border-r sm:border-slate-200/80 sm:pr-8">
              <div className="relative">
                <Avatar
                  avatarId={avatarId}
                  className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-white shadow-sm rounded-full"
                />
                {saving === 'avatar' && (
                  <div className="absolute inset-0 rounded-full bg-slate-900/30 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-700 text-center max-w-[110px] truncate">
                {t(AVATAR_OPTIONS.find((a) => a.id === avatarId)?.nameKey as never)}
              </span>
            </div>

            {/* 10 Small Avatars on Right */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600">
                  {t('profileAvatarSection')}
                </span>
                {saving === 'avatar' && (
                  <span className="text-xs text-blue-600 font-medium animate-pulse">Saving...</span>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 lg:gap-3 w-full">
                {AVATAR_OPTIONS.map((avatar) => {
                  const isSelected = avatar.id === avatarId;
                  const avatarName = t(avatar.nameKey as never);
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      disabled={saving === 'avatar'}
                      onClick={() => handleSelectAvatar(avatar.id)}
                      title={avatarName}
                      aria-label={avatarName}
                      className={`group relative rounded-full p-0.5 transition-all cursor-pointer focus:outline-none flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-blue-600 ring-offset-2 scale-105'
                          : 'hover:scale-110 hover:opacity-100 opacity-70'
                      }`}
                    >
                      <Avatar avatarId={avatar.id} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full" />
                      {isSelected && (
                        <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-blue-600 text-white shadow-xs ring-1 ring-white">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Personal Info Form */}
          <form onSubmit={handleSaveName} className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name Input */}
              <div className="space-y-1.5">
                <label htmlFor="display-name" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  {t('profileDisplayName')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
                    placeholder={t('profileDisplayNamePlaceholder')}
                  />
                </div>
              </div>

              {/* Read-Only Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="user-email" className="block text-xs sm:text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <span className="text-[11px] font-medium text-slate-400">Read-only</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="user-email"
                    type="email"
                    disabled
                    readOnly
                    value={user?.email || ''}
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50 pl-10 pr-9 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving === 'name' || !isNameChanged}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving === 'name' ? t('profileUpdatingName') : t('profileUpdateNameBtn')}
              </button>
            </div>
          </form>
        </section>

        {/* 2. Password & Security Card */}
        <section className="rounded-2xl bg-white p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100/70 text-amber-800">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t('profileSecuritySection')}
            </h2>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField
                id="new-password"
                label={t('profileNewPassword')}
                value={newPassword}
                onChange={setNewPassword}
                shown={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                placeholder="Enter new password"
              />

              <PasswordField
                id="confirm-password"
                label={t('profileConfirmNewPassword')}
                value={confirmPassword}
                onChange={setConfirmPassword}
                shown={showConfirmation}
                onToggle={() => setShowConfirmation(!showConfirmation)}
                placeholder="Confirm new password"
                matchState={
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? 'matched'
                      : 'mismatched'
                    : undefined
                }
              />
            </div>

            {/* Dynamic Strength Indicator (Revealed only while typing) */}
            {newPassword.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {/* Strength Meter Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Password Strength</span>
                    <span
                      className={`font-semibold ${
                        passedCriteriaCount <= 2
                          ? 'text-red-500'
                          : passedCriteriaCount <= 4
                          ? 'text-amber-500'
                          : 'text-emerald-600'
                      }`}
                    >
                      {passedCriteriaCount <= 2 ? 'Weak' : passedCriteriaCount <= 4 ? 'Moderate' : 'Strong'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 h-1.5">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isActive = passedCriteriaCount >= level;
                      let color = 'bg-slate-200';
                      if (isActive) {
                        color =
                          passedCriteriaCount <= 2
                            ? 'bg-red-500'
                            : passedCriteriaCount <= 4
                            ? 'bg-amber-500'
                            : 'bg-emerald-500';
                      }
                      return <div key={level} className={`rounded-full h-full transition-all ${color}`} />;
                    })}
                  </div>
                </div>

                {/* Compact Requirements Chips */}
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <RequirementChip met={hasMinLength} label="8+ chars" />
                  <RequirementChip met={hasUppercase} label="Uppercase" />
                  <RequirementChip met={hasLowercase} label="Lowercase" />
                  <RequirementChip met={hasNumber} label="Number" />
                  <RequirementChip met={hasSpecial} label="Special char" />
                </div>
              </div>
            )}

            {/* Update Password Action */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving === 'password' || !passwordReady || !passwordsMatch}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving === 'password' ? t('profileUpdatingPassword') : t('profileUpdatePasswordBtn')}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  shown: boolean;
  onToggle: () => void;
  matchState?: 'matched' | 'mismatched';
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  shown,
  onToggle,
  matchState,
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-slate-700">
        {label}
      </label>
      {matchState === 'matched' && (
        <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
          <Check className="w-3 h-3" /> Matches
        </span>
      )}
      {matchState === 'mismatched' && (
        <span className="text-[11px] font-medium text-red-500">Does not match</span>
      )}
    </div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Lock className="w-4 h-4" />
      </div>
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          matchState === 'mismatched'
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'
        }`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const RequirementChip: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors ${
      met
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-slate-100 text-slate-500'
    }`}
  >
    {met && <Check className="w-3 h-3 stroke-[2.5]" />}
    <span>{label}</span>
  </span>
);
