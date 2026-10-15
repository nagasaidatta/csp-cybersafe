import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Link2,
  MessageSquareWarning,
  KeyRound
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Language, ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200" ref={mobileMenuRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Portal Name & Shield Icon */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
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

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5" aria-label="Main navigation">
          {/* Link Safety */}
          <button
            type="button"
            onClick={() => onNavigate('link-safety')}
            className={`group inline-flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-lg border transition-all duration-150 ${
              currentView === 'link-safety'
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                currentView === 'link-safety'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
            </div>
            <span>{t('navLinkSafety')}</span>
          </button>

          {/* Message Safety */}
          <button
            type="button"
            onClick={() => onNavigate('message-safety')}
            className={`group inline-flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-lg border transition-all duration-150 ${
              currentView === 'message-safety'
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                currentView === 'message-safety'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
              }`}
            >
              <MessageSquareWarning className="w-3.5 h-3.5" />
            </div>
            <span>{t('navMessageSafety')}</span>
          </button>

          {/* Password Checker */}
          <button
            type="button"
            onClick={() => onNavigate('password-checker')}
            className={`group inline-flex items-center gap-2 px-3 py-1.5 text-xs lg:text-sm font-semibold rounded-lg border transition-all duration-150 ${
              currentView === 'password-checker'
                ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-700 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                currentView === 'password-checker'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <span>{t('navPasswordChecker')}</span>
          </button>
        </nav>


        {/* Right Controls: Language Selector + Auth State + Mobile Menu Toggle */}
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
              onClick={() => {
                onNavigate('auth');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
            >
              {t('login')}
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-md animate-in fade-in">
          <button
            type="button"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              currentView === 'home'
                ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200'
                : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                currentView === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Shield className="w-4 h-4" />
            </div>
            <span>{t('navHome')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('link-safety');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              currentView === 'link-safety'
                ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200'
                : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                currentView === 'link-safety' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Link2 className="w-4 h-4" />
            </div>
            <span>{t('navLinkSafety')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('message-safety');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              currentView === 'message-safety'
                ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200'
                : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                currentView === 'message-safety' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <MessageSquareWarning className="w-4 h-4" />
            </div>
            <span>{t('navMessageSafety')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigate('password-checker');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
              currentView === 'password-checker'
                ? 'bg-blue-50 text-blue-700 font-semibold border-blue-200'
                : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                currentView === 'password-checker' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              <KeyRound className="w-4 h-4" />
            </div>
            <span>{t('navPasswordChecker')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
