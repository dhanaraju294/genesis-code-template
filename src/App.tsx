import React, { useState } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SignUpPage from './components/SignUpPage';

type Page = 'home' | 'login' | 'signup' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<any>(null);

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const navigateToSignUp = () => {
    setCurrentPage('signup');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setUser(null);
  };

  const navigateToDashboard = (userData: any) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage 
          onNavigateToLogin={navigateToLogin}
          onNavigateToSignUp={navigateToSignUp}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onBack={navigateToHome} 
          onLoginSuccess={navigateToDashboard}
          onNavigateToSignUp={navigateToSignUp}
          onNavigateToHome={navigateToHome}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpPage 
          onBack={navigateToHome} 
          onSignUpSuccess={navigateToDashboard}
          onNavigateToLogin={navigateToLogin}
           onNavigateToHome={navigateToHome}

        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onLogout={navigateToHome} 
          user={user}
          onSwitchAccount={navigateToLogin}
          onNavigateToHome={navigateToHome}
        />
      )}
    </>
  );
}

export default App;