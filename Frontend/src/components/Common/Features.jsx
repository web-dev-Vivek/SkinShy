import React, { useState } from 'react';

function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: '🔐',
      title: 'Safety Score',
      description: 'Get personalized safety ratings for every product based on your skin type, allergies, and sensitivities.',
      highlight: 'Core Feature'
    },
    {
      id: 2,
      icon: '🔍',
      title: 'Browse & Search',
      description: 'Easily search and browse through 700+ skincare products with detailed information and ratings.',
      highlight: 'Curated'
    },
    {
      id: 3,
      icon: '📚',
      title: 'Ingredient Glossary',
      description: 'Learn about every ingredient with benefits, warnings, reactivity scores, and skin type compatibility.',
      highlight: 'Educational'
    },
    {
      id: 4,
      icon: '🎯',
      title: 'Smart Matching',
      description: 'Products matched to your unique skin profile with personalized compatibility analysis.',
      highlight: 'Personalized'
    },
    {
      id: 5,
      icon: '⚠️',
      title: 'Allergen Protection',
      description: 'Comprehensive allergen detection and warnings to keep your skin safe from triggers.',
      highlight: 'Safe'
    },
    {
      id: 6,
      icon: '💡',
      title: 'Detailed Insights',
      description: 'In-depth analysis of product formulations, ingredient interactions, and effectiveness for you.',
      highlight: 'Smart'
    }
  ];

  return (
    <section id="features" className="section-spacing relative w-full bg-gradient-to-b from-[#E9D4BC] to-white">
      
      

      <div className="container-custom">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
            <span className="text-xs md:text-sm font-medium text-custom-dark-gray tracking-widest uppercase">
              Why Choose Us
            </span>
            <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
          </div>
          
          <h2 className="heading-gradient text-4xl md:text-5xl lg:text-6xl mb-6">
            Designed for You
          </h2>
          
          <p className="text-lg md:text-xl text-custom-dark-gray leading-relaxed">
            Discover the powerful features that make skincare selection personalized, safe, and informed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="glass glass-hover rounded-3xl p-8 group h-full cursor-pointer border border-white/20 shadow-lg hover:shadow-2xl relative">
                 
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md group-hover:bg-white/25 transition-all duration-300 border border-white/20 shadow-md">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </span>
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

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-custom-charcoal/40 to-custom-dark-gray/40 group-hover:w-full transition-all duration-300 rounded-b-3xl"></div>
              </div>
            </div>
          ))}
        </div>

         {/* CTA Section */}
         <div className="bg-custom-charcoal mt-20 md:mt-32 p-12 md:p-16 rounded-3xl text-custom-white text-center animate-slide-up delay-3">
            <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
             Ready to Transform Your Skincare?
            </h3>
             <p className="text-lg text-custom-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users discovering products perfectly matched to their skin.
            </p>
             <button className="px-8 py-4 bg-custom-white text-custom-charcoal font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg">
              Browse Products
            </button>
         </div>
      </div>
    </section>
  );
}

export default Features;
