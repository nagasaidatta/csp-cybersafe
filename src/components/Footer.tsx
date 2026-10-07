import React from 'react';
import { PhoneCall, ExternalLink, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                {t('homeHeading')}
              </p>
              <p className="text-xs text-slate-400">
                {t('footerNotice')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded border border-slate-700 text-white">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">{t('stat4Value')}:</span>
              <span className="font-bold text-amber-400">1930</span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-white transition-colors"
            >
              <span>{t('nationalPortal')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
