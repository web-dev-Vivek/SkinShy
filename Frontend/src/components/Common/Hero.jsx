import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('interior');

  return (
    <section className="relative w-full min-h-screen pt-24 pb-12 overflow-hidden bg-custom-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-custom-light-gray/40 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-custom-off-white -z-10 blur-3xl opacity-60"></div>
      </div>

      <div className="container-custom h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start min-h-[90vh] py-12 md:py-20">
          
          {/* Left Content - Editorial Style */}
          <div className="flex flex-col gap-12 md:gap-16 animate-slide-up pt-12 md:pt-20">
            
            {/* Main Heading - Premium Typography */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs md:text-sm font-medium text-custom-dark-gray tracking-widest uppercase">
                  Discover Premium Skincare
                </span>
              </div>
              
              {/* Large Lust Font Headline */}
              <h1 className="font-lust text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight text-custom-charcoal font-light">
                Skincare
              </h1>
              
              <h2 className="font-lust text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tight text-custom-charcoal font-light">
                Reimagined<span className="text-5xl md:text-6xl lg:text-7xl">®</span>
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-custom-dark-gray font-light max-w-xl leading-relaxed pt-4">
                / We craft personalized skincare solutions /
              </p>
            </div>

            {/* CTA Button - Minimal Design */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/signup')}
                className="px-10 py-4 bg-custom-charcoal text-custom-white font-semibold rounded-full hover:bg-custom-black transition-all duration-300 hover:shadow-xl uppercase text-sm tracking-wider"
              >
                Start
              </button>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
                <p className="text-xs text-custom-dark-gray tracking-widest uppercase">Explore</p>
              </div>
            </div>

            {/* Material Info Card - Bottom Left */}
            <div className="glass-effect p-8 md:p-10 max-w-sm rounded-3xl mt-auto">
              <h4 className="font-lust font-bold text-xl md:text-2xl text-custom-charcoal mb-3">
                We use best ingredients!
              </h4>
              <p className="text-sm text-custom-dark-gray leading-relaxed">
                Working with verified suppliers and dermatologist-approved ingredients for maximum effectiveness.
              </p>
            </div>
          </div>

          {/* Right Content - Interactive Section */}
          <div className="hidden lg:flex flex-col gap-8 animate-slide-up delay-2 pt-8">
            
            {/* Tab Navigation - Design Elements */}
            <div className="glass-effect inline-flex gap-4 p-1.5 rounded-full w-fit">
              {['Interior', 'Design'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-custom-charcoal text-custom-white'
                      : 'text-custom-dark-gray hover:text-custom-charcoal'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <div className="flex items-center justify-center px-4 py-2 rounded-full bg-custom-charcoal text-custom-white text-sm font-medium">
                +
              </div>
            </div>

            {/* Premium Feature Card */}
            <div className="glass-premium rounded-3xl p-10 md:p-12 space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-custom-dark-gray tracking-widest uppercase font-medium">Featured</p>
                <h3 className="font-lust text-3xl md:text-4xl text-custom-charcoal font-light">
                  Unique design & ergonomics
                </h3>
                <p className="text-sm text-custom-dark-gray pt-2">
                  From blueprints to renders.
                </p>
              </div>

              {/* Product showcase with button */}
              <div className="relative h-48 md:h-56 rounded-2xl bg-gradient-to-br from-custom-light-gray to-custom-gray overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-custom-charcoal/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <span className="text-custom-white text-2xl ml-1">▶</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-custom-charcoal/20 to-transparent"></div>
              </div>

              {/* Product Label Badge */}
              <div className="absolute -bottom-6 right-6 glass-effect px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-sm font-semibold text-custom-charcoal uppercase tracking-wider">
                  Boddtour
                </p>
              </div>
            </div>

            {/* Statistics Section - Bottom Right */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-custom-light-gray flex items-center justify-center text-lg">👤</div>
                <div className="w-12 h-12 rounded-full bg-custom-light-gray flex items-center justify-center text-lg -ml-4">👤</div>
              </div>
              
              <div className="space-y-2">
                <p className="font-lust text-lg md:text-xl text-custom-charcoal font-light">
                  WE CAN COMBINE<br/>NATURE & HOME<br/>COMFORT
                </p>
                <button className="text-xs font-semibold text-custom-charcoal uppercase tracking-wider hover:text-custom-black transition-colors pt-2">
                  LEARN MORE →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <div className="flex justify-center items-center gap-2 absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-0.5 h-8 bg-custom-dark-gray/40"></div>
      </div>
    </section>
  );
}

export default Hero;
