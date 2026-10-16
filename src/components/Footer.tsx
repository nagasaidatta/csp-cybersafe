import React from 'react';
import {
  Shield,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 py-5 text-xs text-slate-500 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand + Copyright */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-center md:text-left">
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="flex items-center gap-2 text-slate-900 hover:text-blue-700 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            aria-label="Cyber Safe Home"
          >
            <div className="w-6 h-6 rounded bg-blue-700 text-white flex items-center justify-center shadow-2xs">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span>{t('siteTitle')}</span>
          </button>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-500">
            &copy; {new Date().getFullYear()} {t('siteTitle')}. {t('footerNotice')}
          </span>
        </div>

        {/* Right: Quick Tools & Official Emergency Helpline */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Quick Helpline Badge */}
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 font-semibold transition-colors shadow-2xs"
            title="National Cyber Crime Reporting Helpline (Toll-Free 24x7)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('homeCallHelpline')}</span>
          </a>

          {/* Official Cybercrime Portal */}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-blue-700 transition-colors font-medium rounded hover:bg-slate-50"
            title="Official National Cyber Crime Reporting Portal"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};
