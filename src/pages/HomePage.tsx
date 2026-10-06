import React from 'react';
import { ArrowRight, ShieldAlert, Users, CreditCard, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';

interface HomePageProps {
  onNavigate: (view: ViewState) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      onNavigate('modules');
    } else {
      onNavigate('auth');
    }
  };

  return (
    <div className="py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Content Area */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base font-semibold tracking-wide text-blue-700 uppercase mb-3">
            {t('homeSubheading')}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('homeHeading')}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('homeDescription')}
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleStartLearning}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <span>{t('startLearning')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Four Exact Awareness Statistics */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Stat 1 */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t('stat1Value')}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat1Label')}
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t('stat2Value')}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat2Label')}
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded bg-red-50 text-red-700 flex items-center justify-center mb-4">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t('stat3Value')}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-snug">
                  {t('stat3Label')}
                </p>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {t('stat4Value')}
                </div>
                <div className="mt-1 text-3xl font-extrabold text-emerald-700 tracking-tight">
                  {t('stat4Label')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
