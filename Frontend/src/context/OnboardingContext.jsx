import React, { createContext, useState, useEffect } from 'react';

export const OnboardingContext = createContext();

const STORAGE_KEY = 'skinshy_onboarding_data';
const SIGNUP_FLAG_KEY = 'skinshy_complete_signup';
const ONBOARDING_FLAG_KEY = 'skinshy_complete_onboarding';

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

const getInitialSignupFlag = () => {
  try {
    const stored = localStorage.getItem(SIGNUP_FLAG_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch (error) {
    return null;
  }
};

const getInitialOnboardingFlag = () => {
  try {
    const stored = localStorage.getItem(ONBOARDING_FLAG_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    return 0;
  }
};

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState(getInitialData());
  const [complete_signup, setCompleteSignup] = useState(getInitialSignupFlag());
  const [complete_onboarding, setCompleteOnboarding] = useState(getInitialOnboardingFlag());

  // Persist onboarding data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
    } catch (error) {
      console.error('Error saving onboarding data to localStorage:', error);
    }
  }, [onboardingData]);

  // Persist complete_signup flag to localStorage
  useEffect(() => {
    try {
      if (complete_signup !== null) {
        localStorage.setItem(SIGNUP_FLAG_KEY, complete_signup.toString());
      }
    } catch (error) {
      console.error('Error saving signup flag to localStorage:', error);
    }
  }, [complete_signup]);

  // Persist complete_onboarding flag to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ONBOARDING_FLAG_KEY, complete_onboarding.toString());
    } catch (error) {
      console.error('Error saving onboarding flag to localStorage:', error);
    }
  }, [complete_onboarding]);

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({
      ...prev,
      ...data
    }));
  };

  const setSignupComplete = () => {
    console.log('setSignupComplete called, setting complete_signup to 0');
    setCompleteSignup(0); // 0 = just signed up, needs onboarding
  };

  const setOnboardingComplete = () => {
    console.log('setOnboardingComplete called, setting complete_onboarding to 1');
    setCompleteOnboarding(1); // 1 = onboarding completed
  };

  const clearSignupFlag = () => {
    setCompleteSignup(null);
    try {
      localStorage.removeItem(SIGNUP_FLAG_KEY);
    } catch (error) {
      console.error('Error clearing signup flag:', error);
    }
  };

  const clearOnboardingData = () => {
    const emptyData = {
      skinType: '',
      highSensitivity: false,
      knownAllergies: [],
      productChangeRate: ''
    };
    setOnboardingData(emptyData);
    setCompleteOnboarding(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_FLAG_KEY);
    } catch (error) {
      console.error('Error clearing onboarding data from localStorage:', error);
    }
  };

  return (
    <OnboardingContext.Provider value={{
      onboardingData,
      updateOnboardingData,
      clearOnboardingData,
      complete_signup,
      setSignupComplete,
      complete_onboarding,
      setOnboardingComplete,
      clearSignupFlag
    }}>
      {console.log('OnboardingContext Provider - complete_signup:', complete_signup, 'complete_onboarding:', complete_onboarding)}
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
