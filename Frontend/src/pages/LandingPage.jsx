import React from 'react';
import Navbar from '../components/Common/Navbar';
import Hero from '../components/Common/Hero';
import Features from '../components/Common/Features';
import Showcase from '../components/Common/Showcase';
import About from '../components/Common/About';

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <About />
    </div>
  );
}

export default LandingPage;
