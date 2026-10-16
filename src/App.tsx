import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ModulesPage } from './pages/ModulesPage';
import { QuizPage } from './pages/QuizPage';
import { LinkSafetyPage } from './pages/LinkSafetyPage';
import { MessageSafetyPage } from './pages/MessageSafetyPage';
import { PasswordCheckerPage } from './pages/PasswordCheckerPage';
import { ViewState } from './types';

const VALID_VIEWS: ViewState[] = [
  'home',
  'auth',
  'modules',
  'quiz',
  'link-safety',
  'message-safety',
  'password-checker'
];

const getViewFromHash = (): ViewState => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (VALID_VIEWS.includes(hash as ViewState)) {
    return hash as ViewState;
  }
  return 'home';
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  const [currentView, setCurrentView] = useState<ViewState>(() => getViewFromHash());
  const [historyStack, setHistoryStack] = useState<ViewState[]>(() => [getViewFromHash()]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Initialize history state on first mount
  useEffect(() => {
    const initialView = getViewFromHash();
    setCurrentView(initialView);
    setHistoryStack([initialView]);
    setHistoryIndex(0);
    window.history.replaceState({ view: initialView, index: 0 }, '', `#/${initialView}`);
  }, []);

  // Listen to browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const targetView = (event.state?.view || getViewFromHash() || 'home') as ViewState;
      const targetIndex = typeof event.state?.index === 'number' ? event.state.index : undefined;

      // Protected views check
      if ((targetView === 'modules' || targetView === 'quiz') && !user && !loading) {
        setCurrentView('auth');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setCurrentView(targetView);
      if (targetIndex !== undefined) {
        setHistoryIndex(targetIndex);
      } else {
        setHistoryIndex((prev) => Math.max(0, prev - 1));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, loading]);

  const handleNavigate = (view: ViewState) => {
    let targetView = view;
    // Protected views require login
    if ((targetView === 'modules' || targetView === 'quiz') && !user && !loading) {
      targetView = 'auth';
    }

    if (targetView === currentView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const nextIndex = historyIndex + 1;
    const nextStack = [...historyStack.slice(0, nextIndex), targetView];

    window.history.pushState({ view: targetView, index: nextIndex }, '', `#/${targetView}`);
    setHistoryStack(nextStack);
    setHistoryIndex(nextIndex);
    setCurrentView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < historyStack.length - 1;

  const handleGoBack = () => {
    if (canGoBack) {
      window.history.back();
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      window.history.forward();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'auth' && <AuthPage onNavigate={handleNavigate} />}
        {currentView === 'modules' && (
          user ? <ModulesPage onNavigate={handleNavigate} /> : <AuthPage onNavigate={handleNavigate} />
        )}
        {currentView === 'quiz' && (
          user ? <QuizPage onNavigate={handleNavigate} /> : <AuthPage onNavigate={handleNavigate} />
        )}
        {currentView === 'link-safety' && <LinkSafetyPage onNavigate={handleNavigate} />}
        {currentView === 'message-safety' && <MessageSafetyPage onNavigate={handleNavigate} />}
        {currentView === 'password-checker' && <PasswordCheckerPage onNavigate={handleNavigate} />}
      </main>


      {/* Portal Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
