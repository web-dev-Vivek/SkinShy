import React, { createContext, useState, useEffect } from 'react';

export const OnboardingContext = createContext();

const STORAGE_KEY = 'skinshy_onboarding_data';

const getInitialData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      skinType: '',
      highSensitivity: false,
      knownAllergies: [],
      productChangeRate: ''
    };
  } catch (error) {
    console.error('Error reading onboarding data from localStorage:', error);
    return {
      skinType: '',
      highSensitivity: false,
      knownAllergies: [],
      productChangeRate: ''
    };
  }
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState(getInitialData());

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error);
    }
  }, [onboardingData]);

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({
      ...prev,
      ...data
    }));
  };

  const clearOnboardingData = () => {
    const emptyData = {
      skinType: '',
      highSensitivity: false,
      knownAllergies: [],
      productChangeRate: ''
    };
    setOnboardingData(emptyData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing onboarding data from localStorage:', error);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      onboardingData,
      updateOnboardingData,
      clearOnboardingData
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
