import React, { useState } from 'react';

function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: '🔍',
      title: 'Intelligent Search',
      description: 'Advanced algorithm finds products perfectly matched to your skin profile and concerns.',
      highlight: 'AI-Powered'
    },
    {
      id: 2,
      icon: '⭐',
      title: 'Smart Recommendations',
      description: 'Personalized suggestions based on your skin type, climate, and lifestyle preferences.',
      highlight: 'Personal'
    },
    {
      id: 3,
      icon: '🛡️',
      title: 'Ingredient Analysis',
      description: 'Deep dive into every ingredient with allergen warnings and effectiveness ratings.',
      highlight: 'Detailed'
    },
    {
      id: 4,
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Visual journey of your skin transformation with before-after comparisons.',
      highlight: 'Visual'
    },
    {
      id: 5,
      icon: '💬',
      title: 'Community Insights',
      description: 'Real reviews from users with similar skin types and concerns as you.',
      highlight: 'Trusted'
    },
    {
      id: 6,
      icon: '🎯',
      title: 'Budget Friendly',
      description: 'Find luxury products at every price point without compromising quality.',
      highlight: 'Smart'
    }
  ];

  return (
    <section id="features" className="section-spacing relative w-full bg-custom-white">
      
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 right-10 w-72 h-72 rounded-full bg-custom-light-gray opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-custom-gray opacity-15 blur-3xl"></div>
      </div>

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
            Discover the features that make skincare shopping a personalized, intelligent experience unlike anything else.
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
              <div className="bg-custom-white border border-custom-light-gray rounded-2xl p-8 group h-full cursor-pointer">
                 
                  {/* Icon Container */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-custom-light-gray group-hover:bg-custom-charcoal transition-colors duration-300">
                      <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </span>
                    </div>
                  </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
                      {feature.title}
                    </h3>
                    <span className="text-xs font-semibold text-custom-dark-gray bg-custom-light-gray px-3 py-1 rounded-full group-hover:bg-custom-charcoal group-hover:text-custom-white transition-colors duration-300">
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
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-custom-charcoal to-custom-dark-gray group-hover:w-full transition-all duration-300"></div>
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
             Start Free Trial
           </button>
         </div>
      </div>
    </section>
  );
}

export default Features;
