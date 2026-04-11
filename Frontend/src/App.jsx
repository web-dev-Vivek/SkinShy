import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search/:productName" element={<ProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <OnboardingProvider>
      <Router>
        <AppRoutes />
      </Router>
    </OnboardingProvider>
  );
}
