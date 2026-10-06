import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ModulesPage } from './pages/ModulesPage';
import { QuizPage } from './pages/QuizPage';
import { ViewState } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const { user, loading } = useAuth();

  const handleNavigate = (view: ViewState) => {
    // Protected views require login
    if ((view === 'modules' || view === 'quiz') && !user && !loading) {
      setCurrentView('auth');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

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
      </main>

      {/* Portal Footer */}
      <Footer />
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
