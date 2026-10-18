import React from 'react';
import {
  Shield,
  PhoneCall,
  ExternalLink,
  GraduationCap,
  Link2,
  MessageSquareWarning,
  KeyRound,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate?: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-white border-t border-slate-200/90 text-slate-600 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-2 text-slate-900 hover:text-blue-700 font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
              aria-label="Cyber Safe Home"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-2xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-extrabold tracking-tight">{t('siteTitle')}</span>
            </button>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('footerMission')}
            </p>
          </div>

          {/* Column 2: Security Tools */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {t('footerSecurityTools')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('link-safety')}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('navLinkSafety')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('message-safety')}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <MessageSquareWarning className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('navMessageSafety')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('password-checker')}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('navPasswordChecker')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning & Platform Routes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {t('footerLearningPlatform')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('modules')}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('navModules')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('quiz')}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('footerQuizAssessment')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.('dashboard')}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t('footerAdminDashboard')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency & Official Reporting */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              {t('footerEmergencySupport')}
            </h3>
            <div className="space-y-2 text-xs">
              {/* Official 1930 Helpline */}
              <a
                href="tel:1930"
                className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-900 transition-colors shadow-2xs group"
                title="National Cyber Crime Reporting Helpline (Toll-Free 24x7)"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <span className="block text-xs font-bold text-amber-950 group-hover:text-amber-900">
                    {t('footerHelplineTitle')}
                  </span>
                  <span className="block text-2xs text-amber-700 mt-0.5">
                    {t('footerHelplineDesc')}
                  </span>
                </div>
              </a>

              {/* Official National Portal */}
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-700 transition-colors group"
                title="Official National Cyber Crime Reporting Portal"
              >
                <span className="font-mono text-2xs font-medium group-hover:text-blue-700">
                  cybercrime.gov.in
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Notice */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-slate-400 leading-tight">
            &copy; {new Date().getFullYear()} {t('siteTitle')}. {t('footerCopyrightNotice')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
