import React, { useState, useRef, useEffect } from 'react';
import { Shield, Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language, ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
    onNavigate('home');
  };

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Portal Name & Shield Icon */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
          aria-label="Cyber Safe Home"
        >
          <div className="w-9 h-9 rounded bg-blue-700 text-white flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
              {t('siteTitle')}
            </span>
          </div>
        </button>

        {/* Right Controls: Language Selector + Auth State */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-expanded={langMenuOpen}
              aria-haspopup="true"
              aria-label="Select Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{languages.find((l) => l.code === language)?.label || 'English'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {langMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded shadow-md py-1 z-50 animate-in fade-in"
              >
                {languages.map((item) => (
                  <button
                    key={item.code}
                    role="menuitem"
                    onClick={() => {
                      setLanguage(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                      language === item.code
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Authentication State */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 max-w-[180px] sm:max-w-[240px] truncate"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <User className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="truncate">{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded shadow-md py-1 z-50"
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 text-xs text-slate-500 truncate">
                    {user.email}
                  </div>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
