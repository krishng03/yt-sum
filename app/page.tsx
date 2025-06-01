'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import Auth from '@/components/Auth';
import MainContent from '@/components/MainContent';

type AppState = 'landing' | 'auth' | 'main';

interface User {
  userid: number;
  username: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);

  // ------ Checks user session exists from cookies ------
  const checkUserSession = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // { userid: number, username: string }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);
  // ------ Checks user session exists from cookies ------
  

  const handleGetStarted = async () => {
    // Check if user is already logged in before going to auth
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setCurrentView('main');
      } else {
        // User not logged in, go to auth
        setCurrentView('auth');
      }
    } catch (error) {
      // User not logged in, go to auth
      setCurrentView('auth');
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setUser(null);
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setCurrentView('main');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('auth');
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      
      {currentView === 'auth' && (
        <Auth 
          onBackToLanding={handleBackToLanding}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {currentView === 'main' && (
        <MainContent 
          onBackToLanding={handleBackToLanding}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
