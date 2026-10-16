import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Copy,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';
import {
  evaluatePasswordStrength,
  getSuggestionText
} from '../data/passwordSuggestions';

interface PasswordCheckerPageProps {
  onNavigate: (view: ViewState) => void;
}

export const PasswordCheckerPage: React.FC<PasswordCheckerPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const evaluation = evaluatePasswordStrength(password);
  const { criteria, isStrong, strengthLabel, scorePercent, contextualSuggestions } = evaluation;

  const getMeterColor = () => {
    switch (strengthLabel) {
      case 'very-strong':
        return 'bg-emerald-600';
      case 'strong':
        return 'bg-emerald-500';
      case 'medium':
        return 'bg-amber-500';
      case 'weak':
        return 'bg-red-500';
      default:
        return 'bg-slate-200';
    }
  };

  const getStrengthText = () => {
    switch (strengthLabel) {
      case 'very-strong':
        return t('pwdScoreVeryStrong');
      case 'strong':
        return t('pwdScoreStrong');
      case 'medium':
        return t('pwdScoreMedium');
      case 'weak':
        return t('pwdScoreWeak');
      default:
        return '';
    }
  };


  return (
    <div className="py-10 sm:py-14 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back to Home Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-blue-700 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            <span>{t('navHome')}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('pwdCheckerTitle')}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            {t('pwdCheckerDesc')}
          </p>
        </div>

        {/* Password Input & Real-Time Meter Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm max-w-3xl mx-auto">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="pwd-input" className="block text-sm font-semibold text-slate-800">
                  {t('pwdInputLabel')}
                </label>
                {password && (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 font-medium transition-colors focus:outline-none"
                      title="Copy password"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassword('')}
                      className="px-2 py-0.5 rounded-md text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium transition-colors focus:outline-none"
                    >
                      Clear
                    </button>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {password.length} {password.length === 1 ? 'char' : 'chars'}
                    </span>
                  </div>
                )}
              </div>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="pwd-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('pwdPlaceholder')}
                  autoComplete="off"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all hover:border-slate-400 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Strength Meter Bar */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span
                    className={`font-bold uppercase tracking-wider ${
                      strengthLabel === 'very-strong' || strengthLabel === 'strong'
                        ? 'text-emerald-700'
                        : strengthLabel === 'medium'
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {getStrengthText()} ({scorePercent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${getMeterColor()}`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Real-Time Criteria Checklist */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                {t('pwdCriteriaTitle')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                    criteria.minLength ? 'text-emerald-900 bg-emerald-50/70 border-emerald-200/80 font-medium' : 'text-slate-500 bg-slate-50/80 border-slate-200/60'
                  }`}
                >
                  {criteria.minLength ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t('pwdCritMinLength')}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                    criteria.uppercase ? 'text-emerald-900 bg-emerald-50/70 border-emerald-200/80 font-medium' : 'text-slate-500 bg-slate-50/80 border-slate-200/60'
                  }`}
                >
                  {criteria.uppercase ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t('pwdCritUppercase')}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                    criteria.lowercase ? 'text-emerald-900 bg-emerald-50/70 border-emerald-200/80 font-medium' : 'text-slate-500 bg-slate-50/80 border-slate-200/60'
                  }`}
                >
                  {criteria.lowercase ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t('pwdCritLowercase')}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
                    criteria.number ? 'text-emerald-900 bg-emerald-50/70 border-emerald-200/80 font-medium' : 'text-slate-500 bg-slate-50/80 border-slate-200/60'
                  }`}
                >
                  {criteria.number ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t('pwdCritNumber')}</span>
                </div>

                <div
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors sm:col-span-2 ${
                    criteria.symbol ? 'text-emerald-900 bg-emerald-50/70 border-emerald-200/80 font-medium' : 'text-slate-500 bg-slate-50/80 border-slate-200/60'
                  }`}
                >
                  {criteria.symbol ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span>{t('pwdCritSymbol')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUGGESTIONS DISPLAY: DISPLAY ONLY AFTER IT BECOMES STRONG */}
        {isStrong && (
          <div className="mt-8 bg-white rounded-2xl border border-emerald-200 shadow-sm max-w-3xl mx-auto overflow-hidden animate-in fade-in">
            {/* Strong Banner */}
            <div className="bg-emerald-50/80 p-6 border-b border-emerald-100 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-emerald-950">
                  {t('pwdStrongBannerTitle')}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  {t('pwdStrongBannerDesc')}
                </p>
              </div>
            </div>

            {/* Relevant Security Suggestions */}
            {contextualSuggestions.length > 0 && (
              <div className="p-6">
                <div className="space-y-2.5">
                  {contextualSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                      <span className="flex-1">{getSuggestionText(sug, language)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
