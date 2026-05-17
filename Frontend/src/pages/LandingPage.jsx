import React from 'react';
import Navbar from '../components/Common/Navbar';
import Hero from '../components/Common/Hero';
import Features from '../components/Common/Features';

import About from '../components/Common/About';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      
      <About />
    </div>
  );
}

export default LandingPage;
