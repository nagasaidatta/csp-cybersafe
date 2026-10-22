import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CyberSafeChat } from './components/CyberSafeChat';
import { ViewState } from './types';

const VALID_VIEWS: ViewState[] = [
  'home',
  'auth',
  'modules',
  'quiz',
  'link-safety',
  'message-safety',
  'password-checker',
  'dashboard',
  'profile',
  'edit-profile'
];

const getViewFromHash = (): ViewState => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash.includes('type=recovery') || hash.includes('access_token')) {
    return 'auth';
  }
  if (VALID_VIEWS.includes(hash as ViewState)) {
    return hash as ViewState;
  }
  return 'home';
};

const REDIRECT_STORAGE_KEY = 'csp_redirect_after_auth';

const getStoredRedirect = (): ViewState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const val = sessionStorage.getItem(REDIRECT_STORAGE_KEY) as ViewState;
    if (val && VALID_VIEWS.includes(val)) return val;
  } catch {
    // ignore
  }
  return null;
};

const storeRedirect = (view: ViewState | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (view && view !== 'home') {
      sessionStorage.setItem(REDIRECT_STORAGE_KEY, view);
    } else {
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

const QUIZ_ORIGIN_STORAGE_KEY = 'csp_quiz_origin';

const getStoredQuizOrigin = (): 'home' | 'modules' => {
  if (typeof window === 'undefined') return 'home';
  try {
    const val = sessionStorage.getItem(QUIZ_ORIGIN_STORAGE_KEY);
    if (val === 'home' || val === 'modules') return val;
  } catch {
    // ignore
  }
  return 'home';
};

const storeQuizOrigin = (origin: 'home' | 'modules') => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(QUIZ_ORIGIN_STORAGE_KEY, origin);
  } catch {
    // ignore
  }
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  const [currentView, setCurrentView] = useState<ViewState>(() => getViewFromHash());
  const [historyStack, setHistoryStack] = useState<ViewState[]>(() => [getViewFromHash()]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<ViewState | null>(() => getStoredRedirect());
  const [quizOrigin, setQuizOrigin] = useState<'home' | 'modules'>(() => getStoredQuizOrigin());

  // Scroll restoration management
  const scrollPositions = useRef<Record<string, number>>({});
  const isRestoringScroll = useRef<boolean>(false);
  const pendingScrollY = useRef<number | null>(null);

  const historyIndexRef = useRef<number>(0);
  const historyStackRef = useRef<ViewState[]>([getViewFromHash()]);
  const currentViewRef = useRef<ViewState>(getViewFromHash());

  historyIndexRef.current = historyIndex;
  historyStackRef.current = historyStack;
  currentViewRef.current = currentView;

  const updateRedirectAfterAuth = (view: ViewState | null) => {
    setRedirectAfterAuth(view);
    storeRedirect(view);
  };

  // Initialize history state on first mount
  useEffect(() => {
    // Disable browser automatic scroll restoration to avoid starting new pages at previous scroll offsets
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const initialView = getViewFromHash();
    if ((initialView === 'modules' || initialView === 'quiz' || initialView === 'profile' || initialView === 'edit-profile') && !user && !loading) {
      updateRedirectAfterAuth(initialView);
      setCurrentView('auth');
      window.history.replaceState({ view: 'auth', index: 0 }, '', '#/auth');
    } else {
      setCurrentView(initialView);
      window.history.replaceState({ view: initialView, index: 0 }, '', `#/${initialView}`);
    }
    setHistoryStack([initialView]);
    setHistoryIndex(0);
  }, []);

  // Continuously record scroll positions per view so we always have the accurate scroll offset
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringScroll.current) return;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      scrollPositions.current[currentView] = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Ensure scroll is immediately placed before the browser paints the new view (no top flash/glitch)
  useLayoutEffect(() => {
    const targetScroll = pendingScrollY.current ?? 0;
    pendingScrollY.current = null;

    isRestoringScroll.current = true;
    window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = targetScroll;
      document.body.scrollTop = targetScroll;
    }

    const rafId = requestAnimationFrame(() => {
      // Secondary check in case dynamic content/layout settled
      if (Math.abs((window.scrollY || document.documentElement.scrollTop || 0) - targetScroll) > 4) {
        window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
      }
      isRestoringScroll.current = false;
    });

    return () => {
      cancelAnimationFrame(rafId);
      isRestoringScroll.current = false;
    };
  }, [currentView]);

  // Listen to browser Back / Forward (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const targetView = (event.state?.view || getViewFromHash() || 'home') as ViewState;
      const targetIndex = typeof event.state?.index === 'number' ? event.state.index : undefined;

      // Save scroll of the view we are leaving right now
      if (currentViewRef.current) {
        scrollPositions.current[currentViewRef.current] = window.scrollY || document.documentElement.scrollTop || 0;
      }

      // Check if moving backwards or forwards
      if (targetIndex !== undefined && targetIndex < historyIndexRef.current) {
        // Going back: restore previous scroll position seamlessly
        pendingScrollY.current = scrollPositions.current[targetView] ?? 0;
      } else if (targetIndex !== undefined && targetIndex > historyIndexRef.current) {
        // Going forward: restore previous scroll position if any, or 0
        pendingScrollY.current = scrollPositions.current[targetView] ?? 0;
      } else {
        pendingScrollY.current = scrollPositions.current[targetView] ?? 0;
      }

      // Protected views check
      if ((targetView === 'modules' || targetView === 'quiz' || targetView === 'profile' || targetView === 'edit-profile') && !user && !loading) {
        updateRedirectAfterAuth(targetView);
        setCurrentView('auth');
        return;
      }

      setCurrentView(targetView);
      if (targetIndex !== undefined) {
        setHistoryIndex(targetIndex);
      } else {
        setHistoryIndex((prev) => Math.max(0, prev - 1));
      }

      // Track origin if navigating back/forward into quiz
      if (targetView === 'quiz' && targetIndex !== undefined && targetIndex > 0) {
        const prev = historyStackRef.current[targetIndex - 1];
        if (prev === 'modules' || prev === 'home') {
          setQuizOrigin(prev);
          storeQuizOrigin(prev);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, loading]);

  const handleNavigate = (view: ViewState, redirectTo?: ViewState) => {
    // Track origin for Quiz page (from home vs from modules)
    if (view === 'quiz') {
      if (currentView === 'modules') {
        setQuizOrigin('modules');
        storeQuizOrigin('modules');
      } else if (currentView === 'home') {
        setQuizOrigin('home');
        storeQuizOrigin('home');
      }
    } else if (view === 'auth' && redirectTo === 'quiz') {
      const origin: 'home' | 'modules' = currentView === 'modules' ? 'modules' : 'home';
      setQuizOrigin(origin);
      storeQuizOrigin(origin);
    }

    let targetView = view;
    // Protected views require login
    if ((targetView === 'modules' || targetView === 'quiz' || targetView === 'profile' || targetView === 'edit-profile') && !user && !loading) {
      updateRedirectAfterAuth(targetView);
      targetView = 'auth';
    } else if (view === 'auth') {
      updateRedirectAfterAuth(redirectTo || 'home');
    } else if (view === 'modules' || view === 'quiz' || view === 'home' || view === 'profile' || view === 'edit-profile') {
      updateRedirectAfterAuth(null);
    }

    if (targetView === currentView) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollPositions.current[currentView] = 0;
      return;
    }

    // Save scroll position of the current page before leaving
    const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
    scrollPositions.current[currentView] = currentScroll;

    // Check if targetView is a previous page in our history stack (user clicking in-app "Back" button)
    const prevIdx = historyStackRef.current.slice(0, historyIndexRef.current).lastIndexOf(targetView);
    if (prevIdx !== -1) {
      // Going back: restore previous scroll position seamlessly without any glitch
      pendingScrollY.current = scrollPositions.current[targetView] ?? 0;
      const delta = prevIdx - historyIndexRef.current;
      window.history.go(delta);
      return;
    }

    // Otherwise, this is forward navigation to a new page -> open cleanly at top (0)
    pendingScrollY.current = 0;
    scrollPositions.current[targetView] = 0;

    const nextIndex = historyIndex + 1;
    const nextStack = [...historyStack.slice(0, nextIndex), targetView];

    window.history.pushState({ view: targetView, index: nextIndex }, '', `#/${targetView}`);
    setHistoryStack(nextStack);
    setHistoryIndex(nextIndex);
    setCurrentView(targetView);
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
      {/* Top Header - hidden when entering admin dashboard */}
      {currentView !== 'dashboard' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={handleGoBack}
          onGoForward={handleGoForward}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentView === 'auth' && <AuthPage onNavigate={handleNavigate} redirectTo={redirectAfterAuth} />}
        {currentView === 'modules' && (
          user ? <ModulesPage onNavigate={handleNavigate} /> : <AuthPage onNavigate={handleNavigate} redirectTo={redirectAfterAuth || 'modules'} />
        )}
        {currentView === 'quiz' && (
          user ? <QuizPage onNavigate={handleNavigate} returnTo={quizOrigin} /> : <AuthPage onNavigate={handleNavigate} redirectTo={redirectAfterAuth || 'quiz'} />
        )}
        {currentView === 'link-safety' && <LinkSafetyPage onNavigate={handleNavigate} />}
        {currentView === 'message-safety' && <MessageSafetyPage onNavigate={handleNavigate} />}
        {currentView === 'password-checker' && <PasswordCheckerPage onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentView === 'profile' && (
          user ? <ProfilePage onNavigate={handleNavigate} /> : <AuthPage onNavigate={handleNavigate} redirectTo={redirectAfterAuth || 'profile'} />
        )}
        {currentView === 'edit-profile' && (
          user ? <EditProfilePage onNavigate={handleNavigate} /> : <AuthPage onNavigate={handleNavigate} redirectTo={redirectAfterAuth || 'edit-profile'} />
        )}
      </main>


      {/* Portal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Movable AI Assistant (CyberSafe AI powered by Groq) */}
      <CyberSafeChat onNavigate={handleNavigate} currentView={currentView} />
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
