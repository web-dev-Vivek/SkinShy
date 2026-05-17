import React from 'react';
import Navbar from '../components/Common/Navbar';
import Hero from '../components/Common/Hero';
import Features from '../components/Common/Features';
import About from '../components/Common/About';
import useLocomotiveScroll from '../hooks/useLocomotiveScroll';

function LandingPage() {
  const { scrollRef } = useLocomotiveScroll(true);

  return (
    <div className="landing-page" data-scroll-container ref={scrollRef}>
      <Navbar />
      <Hero />
      <Features />
      <About />
    </div>
  );
}

export default LandingPage;
