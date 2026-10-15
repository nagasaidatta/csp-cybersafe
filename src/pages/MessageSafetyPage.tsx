import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Search,
  Clock,
  Info,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Quote,
  CheckSquare
} from 'lucide-react';
import { MessageSafetyResult, RiskLevel, ViewState } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  computeSha256,
  getCachedMessageResult,
  setCachedMessageResult
} from '../utils/security';

interface MessageSafetyPageProps {
  onNavigate: (view: ViewState) => void;
}

export const MessageSafetyPage: React.FC<MessageSafetyPageProps> = () => {
  const { t, language } = useLanguage();

  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<MessageSafetyResult | null>(null);
  const [isCachedResult, setIsCachedResult] = useState(false);

  const statusTimerRef = useRef<number | null>(null);

  const loadingMessages = [
    t('msLoading1'),
    t('msLoading2'),
    t('msLoading3'),
    t('msLoading4')
  ];

  // Rotate realistic status messages during loading
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

    const trimmed = messageInput.trim();
    if (!trimmed) {
      setErrorMessage(t('errMessageEmpty'));
      return;
    }

    if (trimmed.length > 5000) {
      setErrorMessage(t('errMessageLong'));
      return;
    }

    // 1. Calculate SHA-256 for private browser caching
    const msgHash = await computeSha256(trimmed);

    // 2. Check browser cache first
    if (!forceFresh) {
      const cached = getCachedMessageResult(msgHash);
      if (cached) {
        setResult(cached);
        setIsCachedResult(true);
        return;
      }
    }

    // 3. Perform fresh API analysis
    setIsLoading(true);
    setIsCachedResult(false);

    try {
      const res = await fetch('/api/check-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, language })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || t('errNetwork'));
        return;
      }

      const freshResult: MessageSafetyResult = data.result;
      setResult(freshResult);
      // Cache using SHA-256 hash key only (no raw text stored)
      setCachedMessageResult(msgHash, freshResult);
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertOctagon className="w-3.5 h-3.5" />
            {t('riskCritical')}
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
            <XCircle className="w-3.5 h-3.5" />
            {t('riskHigh')}
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('riskMedium')}
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('riskLow')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
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
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            {t('msBadge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('msTitle')}
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {t('msDesc')}
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="message-input" className="block text-sm font-semibold text-slate-800">
                  {t('msInputLabel')}
                </label>
                <span className="text-xs text-slate-400">
                  {messageInput.length} / 5000
                </span>
              </div>
              <textarea
                id="message-input"
                rows={5}
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={t('msInputPlaceholder')}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm transition-colors disabled:bg-slate-50 disabled:text-slate-500 resize-y"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded text-sm animate-in fade-in"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{t('analysisError')}</p>
                  <p className="mt-0.5 text-xs text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading || !messageInput.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin motion-reduce:hidden" />
                    <span>{t('msBtnChecking')}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>{t('msBtnCheck')}</span>
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
            className="mt-8 bg-white p-8 rounded-lg border border-blue-200 shadow-sm max-w-3xl mx-auto text-center animate-in fade-in"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-700 mb-4 animate-pulse motion-reduce:animate-none">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('msLoadingTitle')}</h3>
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
          <div className="mt-8 bg-white rounded-lg border border-slate-200 shadow-sm max-w-3xl mx-auto overflow-hidden animate-in fade-in">
            {/* Top Bar with Cached Badge & Refresh */}
            <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {t('msReportTitle')}
                </span>
                {isCachedResult && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-700">
                    <Clock className="w-3 h-3" />
                    {t('lsCachedBadge', { time: formatMinutesAgo(result.cachedAt) })}
                  </span>
                )}
              </div>
              {isCachedResult && (
                <button
                  type="button"
                  onClick={() => handleSubmit(undefined, true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 focus:outline-none"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('lsRequestFresh')}</span>
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Primary Classification & Risk Badge */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {t('msClassification')}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 pt-1">
                    {result.classification}
                  </h2>
                </div>
                <div className="shrink-0">{getRiskBadge(result.riskLevel)}</div>
              </div>

              {/* Detected Scam Categories */}
              {result.scamCategories && result.scamCategories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                    {t('msCategoriesTitle')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.scamCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suspicious Phrases / Indicators */}
              {result.suspiciousPhrases && result.suspiciousPhrases.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                    {t('msPhrasesTitle')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.suspiciousPhrases.map((phrase, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                      >
                        <Quote className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>"{phrase}"</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation of findings */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('msFindingsTitle')}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
                  {result.explanation}
                </p>
              </div>

              {/* Recommended Precautions Checklist */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
                    {t('msRecommendationsTitle')}
                  </h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-md bg-emerald-50/50 border border-emerald-100 text-sm text-slate-800"
                      >
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        )}
      </div>
    </div>
  );
};
