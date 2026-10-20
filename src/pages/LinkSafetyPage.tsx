import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Search,
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { LinkSafetyResult, RiskLevel, ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  translateClassification,
  translateCategory,
  getLocalizedExplanation,
  getLocalizedEvidence
} from '../i18n/translations';
import {
  normalizeUrl,
  getCachedLinkResult,
  setCachedLinkResult,
  getLinkCooldownRemaining,
  markLinkCooldown,
  formatModelName,
  isPortalSelfUrl,
  getPortalSelfSafetyResult
} from '../utils/security';

interface LinkSafetyPageProps {
  onNavigate: (view: ViewState) => void;
}

export const LinkSafetyPage: React.FC<LinkSafetyPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldownNotice, setCooldownNotice] = useState<string | null>(null);
  const [result, setResult] = useState<LinkSafetyResult | null>(null);
  const [isCachedResult, setIsCachedResult] = useState(false);

  const statusTimerRef = useRef<number | null>(null);

  const loadingMessages = [
    t('lsLoading1'),
    t('lsLoading2'),
    t('lsLoading3'),
    t('lsLoading4'),
    t('lsLoading5')
  ];

  // Rotate realistic status messages during active loading
  useEffect(() => {
    if (isLoading) {
      setLoadingStatusIndex(0);
      statusTimerRef.current = window.setInterval(() => {
        setLoadingStatusIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1800);
    } else {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
        statusTimerRef.current = null;
      }
    }
    return () => {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
      }
    };
  }, [isLoading, loadingMessages.length]);

  const handleSubmit = async (e?: React.FormEvent, forceFresh = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setCooldownNotice(null);

    const targetUrl = urlInput.trim() || result?.submittedUrl || '';
    if (!targetUrl) {
      setErrorMessage(t('errUrlEmpty'));
      return;
    }

    // 1. Normalize and validate input
    const { normalizedUrl, error: valError } = normalizeUrl(targetUrl);
    if (valError) {
      setErrorMessage(t('errUrlInvalid'));
      return;
    }

    // 2. Check if URL is this Cyber Safe Portal itself (Instant verified safe, NO API call)
    if (isPortalSelfUrl(targetUrl) || isPortalSelfUrl(normalizedUrl)) {
      const selfResult = getPortalSelfSafetyResult(targetUrl);
      setResult(selfResult);
      setIsLoading(false);
      setIsCachedResult(false);
      return;
    }

    // 3. Check browser cache first (cache hit consumes NO cooldown)
    if (!forceFresh) {
      const cached = getCachedLinkResult(normalizedUrl);
      if (cached) {
        setResult(cached);
        setIsCachedResult(true);
        return;
      }
    }

    // 3. Check 30-second cooldown for fresh checks
    const remainingSeconds = getLinkCooldownRemaining();
    if (remainingSeconds > 0) {
      setCooldownNotice(t('cooldownWait', { seconds: remainingSeconds }));
      return;
    }

    // 4. Proceed with single API check
    setIsLoading(true);
    setIsCachedResult(false);
    setResult(null);
    markLinkCooldown();

    try {
      const res = await fetch('/api/check-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          const waitTime = data.remainingSeconds || 30;
          setCooldownNotice(t('cooldownWait', { seconds: waitTime }));
        } else {
          setErrorMessage(data.error || t('errNetwork'));
        }
        return;
      }

      const freshResult: LinkSafetyResult = {
        ...data.result,
        model: data.model || data.result?.model
      };
      setResult(freshResult);
      setCachedLinkResult(normalizedUrl, freshResult);
    } catch {
      setErrorMessage(t('errNetwork'));
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <AlertOctagon className="w-3.5 h-3.5" />
            {t('riskCritical')}
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
            <XCircle className="w-3.5 h-3.5" />
            {t('riskHigh')}
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('riskMedium')}
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('riskLow')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            <Info className="w-3.5 h-3.5" />
            {t('riskUnknown')}
          </span>
        );
    }
  };

  const formatMinutesAgo = (timestamp?: number) => {
    if (!timestamp) return t('recently');
    const diffMins = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
    return t('minsAgo', { mins: diffMins, plural: diffMins > 1 ? 's' : '' });
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

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('lsTitle')}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            {t('lsDesc')}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl shadow-md max-w-3xl mx-auto">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div>
              <label htmlFor="url-input" className="block text-sm font-semibold text-slate-800 mb-2">
                {t('lsInputLabel')}
              </label>
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  id="url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                    if (cooldownNotice) setCooldownNotice(null);
                  }}
                  placeholder={t('lsInputPlaceholder')}
                  disabled={isLoading}
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-all hover:border-slate-400 disabled:bg-slate-50 disabled:text-slate-500 shadow-2xs"
                />
                {urlInput && !isLoading && (
                  <button
                    type="button"
                    onClick={() => {
                      setUrlInput('');
                      setResult(null);
                      setErrorMessage(null);
                      setCooldownNotice(null);
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={t('clearUrlAria')}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Cooldown early attempt alert */}
            {cooldownNotice && (
              <div
                role="alert"
                className="flex items-center gap-2.5 p-3.5 bg-amber-100 text-amber-900 rounded-xl text-sm animate-in fade-in"
              >
                <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{cooldownNotice}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 bg-red-100 text-red-900 rounded-xl text-sm animate-in fade-in"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{t('analysisError')}</p>
                  <p className="mt-0.5 text-xs text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin motion-reduce:hidden" />
                    <span>{t('lsBtnChecking')}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t('lsBtnCheck')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Animated Loading Experience */}
        {isLoading && (
          <div
            aria-live="polite"
            className="mt-8 bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto text-center animate-in fade-in"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 mb-4 animate-pulse motion-reduce:animate-none">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('lsLoadingTitle')}</h3>
            <p className="mt-2 text-sm text-blue-700 font-medium h-6 transition-all duration-300">
              {loadingMessages[loadingStatusIndex]}
            </p>
            <div className="mt-5 max-w-xs mx-auto bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-full w-2/3 animate-[pulse_1s_infinite] motion-reduce:w-full" />
            </div>
          </div>
        )}

        {/* Structured Results Display */}
        {result && !isLoading && (
          <div className="mt-8 bg-white rounded-2xl shadow-md max-w-3xl mx-auto overflow-hidden animate-in fade-in">
            {/* Top Bar with Cached Badge & Refresh */}
            <div className="bg-slate-100/90 px-6 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('lsReportTitle')}
                </span>
                {isCachedResult && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-200/80 text-slate-700">
                    <Clock className="w-3 h-3" />
                    {t('lsCachedBadge', { time: formatMinutesAgo(result.cachedAt) })}
                  </span>
                )}
              </div>
              {isCachedResult && (
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 focus:outline-none transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('lsRequestFresh')}</span>
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Submitted URL & Primary Classification */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {t('lsSubmittedUrl')}
                  </span>
                  <div className="flex items-center gap-2 text-slate-900 font-mono text-sm break-all">
                    <span>{result.submittedUrl}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 pt-2 tracking-tight">
                    {translateClassification(result.classification, language)}
                  </h2>
                </div>
                <div className="shrink-0">{getRiskBadge(result.riskLevel)}</div>
              </div>

              {/* Detected Categories */}
              {result.categories && result.categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">
                    {t('lsDetectedCategories')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                      >
                        {translateCategory(cat, language)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concise Explanation */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  {t('lsSummaryTitle')}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-100/80 p-4 rounded-xl">
                  {getLocalizedExplanation(result, language)}
                </p>
              </div>

              {/* Observable Evidence */}
              {getLocalizedEvidence(result, language).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">
                    {t('lsEvidenceTitle')}
                  </h4>
                  <ul className="space-y-2">
                    {getLocalizedEvidence(result, language).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Small grey text in bottom right of the website only while viewing this link result */}
      {result?.model && (
        <aside
          aria-label="AI response model"
          className="fixed bottom-1.5 right-2.5 z-30 pointer-events-none select-none text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-tight"
        >
          {formatModelName(result.model)}
        </aside>
      )}
    </div>
  );
};
