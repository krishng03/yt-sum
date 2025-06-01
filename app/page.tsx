'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import MainContent from '@/components/MainContent';

const Index = () => {
  const [showMainContent, setShowMainContent] = useState(false);

  const handleGetStarted = () => {
    setShowMainContent(true);
  };

  const handleBackToLanding = () => {
    setShowMainContent(false);
  };

  return (
    <>
      {!showMainContent ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <MainContent onBackToLanding={handleBackToLanding} />
      )}
    </>
  );
};

export default Index;
