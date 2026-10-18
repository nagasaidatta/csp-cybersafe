import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  User,
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

  const [avatarId, setAvatarId] = useState<AvatarId>((profile?.avatar_id as AvatarId) || 'avatar-1');
  const [displayName, setDisplayName] = useState(profile?.name || user?.user_metadata?.name || '');
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

  // Password criteria verification
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordReady = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const clearMessage = () => setMessage(null);
  const notify = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4500);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-1 sm:mb-2">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 py-1 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>{t('viewProfile')}</span>
          </button>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {t('profileEditAction')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {t('profileAccountSubtitle')}
          </p>
        </div>

        {/* Global Feedback Alert */}
        {message && (
          <div
            role={message.type === 'error' ? 'alert' : 'status'}
            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium shadow-2xs transition-all ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Profile Information Section */}
        <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-4 sm:p-6 flex items-center gap-3">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100/80">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-slate-900">
                {t('profileInfoSection')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Update your display name shown on certificates and leaderboards.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveName} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                    placeholder={t('profileDisplayNamePlaceholder')}
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Visible on your profile, certificates, and learning records.
                </p>
              </div>

              {/* Read-Only Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="user-email" className="block text-xs sm:text-sm font-semibold text-slate-700">
                  Email Address
                </label>
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
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/90 pl-10 pr-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('profileEmailNote')}
                </p>
              </div>
            </div>

            {/* Save Name Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving === 'name' || !displayName.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving === 'name' ? t('profileUpdatingName') : t('profileUpdateNameBtn')}
              </button>
            </div>
          </form>
        </section>

        {/* 2. Choose Avatar Section */}
        <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-4 sm:p-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar avatarId={avatarId} size="sm" className="h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-slate-100 shrink-0" />
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-slate-900">
                  {t('profileAvatarSection')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {t('profileAvatarSubtitle')}
                </p>
              </div>
            </div>
            {saving === 'avatar' && (
              <span className="text-xs font-semibold text-blue-600 animate-pulse shrink-0">
                Saving...
              </span>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = avatar.id === avatarId;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    disabled={saving === 'avatar'}
                    onClick={() => handleSelectAvatar(avatar.id)}
                    className={`group relative flex flex-col items-center justify-between rounded-xl p-2.5 sm:p-4 text-center transition-all cursor-pointer min-h-[114px] sm:min-h-[136px] ${
                      isSelected
                        ? 'border-2 border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/10'
                        : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <span className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-white shadow-xs">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    )}

                    {/* Avatar Graphic */}
                    <div className="my-auto transition-transform group-hover:scale-105">
                      <Avatar avatarId={avatar.id} size="md" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
                    </div>

                    {/* Role Title */}
                    <span
                      className={`mt-1.5 block w-full text-center text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2 px-0.5 ${
                        isSelected ? 'text-blue-900 font-bold' : 'text-slate-700'
                      }`}
                    >
                      {t(avatar.nameKey as never)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start sm:items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>Selected avatar is automatically saved to your profile across all devices.</span>
            </div>
          </div>
        </section>

        {/* 3. Password & Security Section */}
        <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-4 sm:p-6 flex items-center gap-3">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100/80">
              <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-bold text-slate-900">
                {t('profileSecuritySection')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your login credentials and maintain a strong password.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* New Password */}
              <PasswordField
                id="new-password"
                label={t('profileNewPassword')}
                value={newPassword}
                onChange={setNewPassword}
                shown={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                placeholder="Enter new password"
              />

              {/* Confirm New Password */}
              <PasswordField
                id="confirm-password"
                label={t('profileConfirmNewPassword')}
                value={confirmPassword}
                onChange={setConfirmPassword}
                shown={showConfirmation}
                onToggle={() => setShowConfirmation(!showConfirmation)}
                placeholder="Re-enter new password"
              />
            </div>

            {/* Password Validation Checklist */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4">
              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Password Security Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <RequirementItem met={hasMinLength} label="At least 8 characters" />
                <RequirementItem met={hasUppercase} label="At least one uppercase letter (A-Z)" />
                <RequirementItem met={hasLowercase} label="At least one lowercase letter (a-z)" />
                <RequirementItem met={hasNumber} label="At least one numeric digit (0-9)" />
                <RequirementItem met={hasSpecial} label="At least one special character (!@#$...)" />
                {confirmPassword.length > 0 && (
                  <RequirementItem met={passwordsMatch} label="Passwords match exactly" />
                )}
              </div>
            </div>

            {/* Save Password Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving === 'password' || !passwordReady || !passwordsMatch}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  placeholder,
  onChange,
  shown,
  onToggle,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-xs sm:text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Lock className="w-4 h-4" />
      </div>
      <input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-slate-400 hover:text-slate-600 active:text-slate-800 cursor-pointer"
        aria-label={shown ? 'Hide password' : 'Show password'}
      >
        {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

const RequirementItem: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <div className="flex items-start gap-2">
    {met ? (
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
    ) : (
      <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
    )}
    <span className={`leading-snug ${met ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
      {label}
    </span>
  </div>
);
