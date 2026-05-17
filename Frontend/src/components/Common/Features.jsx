import React from 'react';

function Features() {

  const features = [
    {
      id: 1,
      icon: 'safetyscore.png',
      title: 'Safety Score',
      description: 'Get personalized safety ratings for every product based on your skin type, allergies, and sensitivities.',
      speed:1
      ,highlight: 'Core Feature'
    },
    {
      id: 2,
      icon: 'search.png',
      title: 'Browse & Search',
      description: 'Easily search and browse through 1000+ skincare products with detailed information and ratings.',
      speed:1.2
      ,highlight: 'Curated'
    },
    {
      id: 3,
      icon: 'smart_matching.png',
      title: 'Smart Matching',
      description: 'Products matched to your unique skin profile with personalized compatibility analysis.',
      speed:1.4
      ,highlight: 'Personalized'
    },
    {
      id: 4,
      icon: 'Allergen.png',
      title: 'Allergen Protection',
      description: 'Comprehensive allergen detection and warnings to keep your skin safe from triggers.',
      speed:1.6
      ,highlight: 'Safe'
    },
    {
      id: 5,
      icon: 'DetailInsight.png',
      title: 'Detailed Insights',
      description: 'In-depth analysis of product formulations, ingredient interactions, and effectiveness for you.',
      speed:1.8
      ,highlight: 'Smart'
    }
  ];

  return (
    <section 
      id="features" 
      className="section-spacing relative w-full min-h-screen bg-bottom md:bg-center bg-contain md:bg-cover bg-no-repeat overflow-hidden"
      
    >

      {/* Parallax Background - moves slower than content */}
      <div
        className="absolute inset-0 -z-10 will-change-transform"
        data-scroll
        data-scroll-speed="-1.2"
        style={{
          backgroundImage: `url(${window.innerWidth >= 768 ? '/Back.png' : '/Backmobile.jpeg'})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      ></div>

      <div className="container-custom relative z-10" >
        
        {/* Section Header */}
         <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 animate-slide-up will-change-transform" data-scroll data-scroll-speed="1"
         >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
            <span className="text-xs md:text-sm font-medium text-custom-dark-gray tracking-widest uppercase">
              Why Choose Us
            </span>
            <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
          </div>
          
          <h2 
            className="heading-gradient text-4xl md:text-5xl lg:text-6xl mb-6"
           
          >
            Designed for You
          </h2>
          
          <p 
            className="text-lg md:text-xl text-custom-dark-gray leading-relaxed"
           
          >
            Discover the powerful features that make skincare selection personalized, safe, and informed.
          </p>
        </div>

        {/* Features Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {features.map((feature, index) => (
             <div
               className="animate-slide-up will-change-transform"
               data-scroll 
               data-scroll-speed={`${0.5 + (index * 0.2)}`}
             >
              <div className="glass glass-hover rounded-3xl p-8 group h-full cursor-pointer border border-white/20 shadow-lg hover:shadow-2xl relative">
                 
                   {/* Icon Container */}
                   <div className="mb-6">
                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur-md group-hover:bg-white/25 transition-all duration-300 border border-white/20 shadow-md">
                       <img 
                         src={`/${feature.icon}`} 
                         alt={feature.title}
                         className="text-3xl rounded-full transform group-hover:scale-110 transition-transform duration-300"
                       />
                    </div>
                  </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-semibold text-custom-charcoal bg-white/30 backdrop-blur-md px-3 py-1 rounded-full group-hover:bg-white/40 transition-all duration-300 border border-white/20 whitespace-nowrap">
                      {feature.highlight}
                    </span>
                  </div>

                  <p className="text-custom-dark-gray leading-relaxed group-hover:text-custom-charcoal transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-custom-charcoal text-lg font-bold transform group-hover:translate-x-2 transition-transform duration-300">
                    →
                  </span>
                </div>

               </div>
            </div>
          ))} 
        </div>

          
      </div>
    </section>
  );
}

export default Features;
