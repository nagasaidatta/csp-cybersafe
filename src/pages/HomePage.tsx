import React from 'react';
import {
  ArrowRight,
  ShieldAlert,
  Users,
  CreditCard,
  Link2,
  MessageSquareWarning,
  KeyRound,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';

interface HomePageProps {
  onNavigate: (view: ViewState, redirectTo?: ViewState) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      onNavigate('modules');
    } else {
      onNavigate('auth', 'modules');
    }
  };

  const handleTakeQuiz = () => {
    if (user) {
      onNavigate('quiz');
    } else {
      onNavigate('auth', 'quiz');
    }
  };

  return (
    <div className="py-10 sm:py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">

        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <section aria-labelledby="hero-title" className="text-center max-w-3xl mx-auto pt-3 sm:pt-5">
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            {t('homeHeroTitle')}
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('homeHeroDesc')}
          </p>
        </section>

        {/* ========================================================= */}
        {/* 2. PRIMARY ACTION: THREE SECURITY TOOLS                   */}
        {/* ========================================================= */}
        <section id="security-tools" aria-label={t('homeToolsTitle')} className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {/* Tool 1: Link Safety */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('link-safety')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('link-safety')}
              aria-label={`Open ${t('navLinkSafety')}`}
              className="group cursor-pointer bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-700 transition-colors">
                    {t('navLinkSafety')}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {t('lsDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('link-safety');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  <span>{t('lsBtnCheck')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Tool 2: Message Safety */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('message-safety')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('message-safety')}
              aria-label={`Open ${t('navMessageSafety')}`}
              className="group cursor-pointer bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-amber-700 transition-colors">
                    {t('navMessageSafety')}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {t('msDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('message-safety');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  <span>{t('msBtnCheck')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Tool 3: Password Checker */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('password-checker')}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('password-checker')}
              aria-label={`Open ${t('navPasswordChecker')}`}
              className="group cursor-pointer bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
                    {t('navPasswordChecker')}
                  </h3>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                  {t('pwdCheckerDesc')}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('password-checker');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <span>{t('pwdBtnCheck')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. EDUCATION & ASSESSMENT ACTIONS                         */}
        {/* ========================================================= */}
        <section aria-label="Learning and Assessment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Card 1: Interactive Learning Modules */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleStartLearning}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleStartLearning()}
              className="group cursor-pointer bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t('navModules')}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {t('homeModulesBannerTitle')}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t('homeModulesBannerDesc')}
                </p>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartLearning();
                  }}
                  className="animate-click-me w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 active:scale-95 rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <span>{t('startLearning')}</span>
                  <ArrowRight className="w-4 h-4 animate-arrow-nudge" />
                </button>
              </div>
            </div>

            {/* Card 2: Cybersecurity Awareness Quiz */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleTakeQuiz}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleTakeQuiz()}
              className="group cursor-pointer bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  {t('footerQuizAssessment')}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {t('quizTitle')}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t('quizSubtitle')}
                </p>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTakeQuiz();
                  }}
                  className="animate-click-me w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-white hover:bg-slate-50 active:scale-95 rounded-xl shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  <span>{t('btnTakeQuiz')}</span>
                  <ArrowRight className="w-4 h-4 animate-arrow-nudge" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. AWARENESS METRICS (UNIFIED BALANCED PANEL)              */}
        {/* ========================================================= */}
        <section aria-labelledby="awareness-heading" className="pt-2">
          <div className="mb-5 sm:mb-6 text-center sm:text-left">
            <h2 id="awareness-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('homeAwarenessTitle')}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 md:divide-x md:divide-slate-200">
              {/* Stat 1 */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t('stat1Value')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat1Label')}
                </p>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col justify-between md:pl-8">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t('stat2Value')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat2Label')}
                </p>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col justify-between md:pl-8">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-700 flex items-center justify-center mb-3">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t('stat3Value')}
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat3Label')}
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
