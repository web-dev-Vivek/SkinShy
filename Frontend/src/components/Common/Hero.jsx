import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('safety');

  return (
    <section 
      className="relative w-full min-h-screen pt-24 pb-12 overflow-hidden bg-custom-white"
      data-scroll
    >
      {/* Background Image - Parallax effect (moves slower) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        data-scroll
        data-scroll-speed="-1"
        style={{ backgroundImage: 'url(/Backmen.png)' }}
      ></div>

        <div 
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          data-scroll
          data-scroll-speed="-1"
          style={{ backgroundImage: 'url(/Backmenmobile.png)' }}
        ></div>

       {/* Background Elements */}
       <div className="absolute inset-0 -z-10">
         <div 
           className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-custom-off-white -z-10 blur-3xl opacity-60"
           data-scroll
           data-scroll-speed="-1"
         ></div>
       </div>

       <div className="container-custom h-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start min-h-[90vh] py-12 md:py-20">
          
           {/* Left Content - Editorial Style */}
           <div className="flex flex-col gap-12 md:gap-16 pt-12 md:pt-20" data-scroll data-scroll-speed="">
            
            {/* Main Heading - Premium Typography */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs md:text-sm font-medium text-custom-dark-gray tracking-widest uppercase">
                  Discover Premium Skincare
                </span>
              </div>
              
              {/* Large Playfair Display Headline */}
              <h1 className="font-playfair text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight text-custom-charcoal font-light">
                Skincare
              </h1>
              
              <h2 className="font-playfair text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tight text-custom-charcoal font-light">
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
                 onClick={() => navigate('/search')}
                 className="px-10 py-4 bg-custom-charcoal text-custom-white font-semibold rounded-full hover:bg-custom-black transition-all duration-300 hover:shadow-xl uppercase text-sm tracking-wider"
               >
                 Browse Products
               </button>
               <div className="flex items-center gap-3">
                 <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
                 <p className="text-xs text-custom-dark-gray tracking-widest uppercase">Explore</p>
               </div>
             </div>

             {/* Material Info Card - Bottom Left */}
             <div className="bg-custom-white border border-custom-light-gray p-8 md:p-10 max-w-sm rounded-3xl mt-auto">
              <h4 className="font-playfair font-bold text-xl md:text-2xl text-custom-charcoal mb-3">
                We use best ingredients!
              </h4>
              <p className="text-sm text-custom-dark-gray leading-relaxed">
                Working with verified suppliers and dermatologist-approved ingredients for maximum effectiveness.
              </p>
            </div>
          </div>

           {/* Right Content - Desktop Featured Card Section */}
           <div className="hidden lg:flex flex-col gap-8 animate-slide-up delay-2 pt-8" data-scroll data-scroll-speed="">
            
             {/* Tab Navigation - Design Elements */}
             <div className="inline-flex gap-4 p-1.5 rounded-full w-fit bg-custom-off-white border border-custom-light-gray">
              {['Safety score', 'Product comparison'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab === 'Safety score' ? 'safety' : 'comparison')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    (tab === 'Safety score' && activeTab === 'safety') || (tab === 'Product comparison' && activeTab === 'comparison')
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
             <div className="bg-custom-white border border-custom-light-gray rounded-3xl p-10 md:p-12 space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-custom-dark-gray tracking-widest uppercase font-medium">Featured</p>
                {activeTab === 'safety' ? (
                  <>
                    <h3 className="font-playfair text-3xl md:text-4xl text-custom-charcoal font-light">
                      Personalized Safety score
                    </h3>
                    <p className="text-sm text-custom-dark-gray pt-2">
                      Get your personalized safety rating.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-playfair text-3xl md:text-4xl text-custom-charcoal font-light">
                      Product comparison with safety score
                    </h3>
                    <p className="text-sm text-custom-dark-gray pt-2">
                      Compare products side by side.
                    </p>
                  </>
                )}
              </div>

               {/* Content Container - Changes based on active tab */}
               <div className="relative rounded-2xl bg-custom-light-gray overflow-hidden h-48 md:h-80">
                {activeTab === 'safety' ? (
                  // Safety Score Image Placeholder
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-custom-light-gray to-custom-off-white">
                    {/* Image placeholder for Safety Score - Edit this manually */}
                    <img 
                      src="/Happyskin.jpg" 
                      alt="Safety Score" 
                      className="w-full h-full object-cover"
                      data-scroll
        data-scroll-speed="-0.01"
                    />
                  </div>
                ) : (
                  // Product Comparison Image Placeholder
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-custom-light-gray to-custom-off-white">
                    {/* Image placeholder for Product Comparison - Edit this manually */}
                    <img 
                      src="/productcompare.png" 
                      alt="Product Comparison" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
               </div>

               {/* Product Label Badge */}
               <div className="absolute -bottom-6 right-6 bg-custom-white border border-custom-light-gray px-6 py-4 rounded-2xl shadow-xl">
                <p className="text-sm font-semibold text-custom-charcoal uppercase tracking-wider">
                  {activeTab === 'safety' ? 'Safety' : 'Compare'}
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
                <p className="font-playfair text-lg md:text-xl text-custom-charcoal font-light">
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
