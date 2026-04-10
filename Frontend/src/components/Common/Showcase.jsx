import React, { useState } from 'react';

function Showcase() {
  const [activeTab, setActiveTab] = useState('skincare');

  const showcaseItems = {
    skincare: [
      {
        id: 1,
        name: 'Hydration Master',
        category: 'Moisturizers',
        rating: 4.9,
        reviews: 328,
      },
      {
        id: 2,
        name: 'Radiant Glow Serum',
        category: 'Serums',
        rating: 4.8,
        reviews: 256,
      },
      {
        id: 3,
        name: 'Pure Cleanse',
        category: 'Cleansers',
        rating: 4.7,
        reviews: 412,
      },
    ],
    trending: [
      {
        id: 4,
        name: 'Vitamin C Boost',
        category: 'Serums',
        rating: 4.9,
        reviews: 567,
      },
      {
        id: 5,
        name: 'Night Renewal',
        category: 'Night Creams',
        rating: 4.8,
        reviews: 324,
      },
      {
        id: 6,
        name: 'Sun Defense Pro',
        category: 'Sunscreen',
        rating: 4.9,
        reviews: 441,
      },
    ],
  };

  return (
    <section id="showcase" className="section-spacing relative w-full bg-custom-off-white">
      
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-custom-white opacity-40 blur-3xl"></div>
      </div>

      <div className="container-custom">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 animate-slide-up">
          <h2 className="heading-gradient text-4xl md:text-5xl lg:text-6xl mb-6">
            Curated Collections
          </h2>
          <p className="text-lg md:text-xl text-custom-dark-gray">
            Explore our handpicked selection of premium skincare products, each chosen for excellence.
          </p>
        </div>

        {/* Tabs */}
         <div className="inline-flex justify-center gap-4 mb-12 animate-slide-up delay-1 mx-auto block">
           {['skincare', 'trending'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
                className={`px-6 md:px-8 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-custom-charcoal text-custom-white'
                    : 'bg-custom-off-white text-custom-charcoal border border-custom-light-gray hover:bg-custom-light-gray hover:border-custom-dark-gray'
                }`}
             >
               {tab === 'skincare' ? 'Best Sellers' : 'Trending'}
             </button>
           ))}
         </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {showcaseItems[activeTab].map((item, index) => (
            <div
              key={item.id}
              className="animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card group h-full flex flex-col">
                 
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 rounded-xl bg-custom-light-gray mb-6 flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300">
                    <span className="text-5xl">✨</span>
                  </div>

                {/* Product Info */}
                <div className="flex-grow space-y-3">
                  <div>
                    <p className="text-xs text-custom-dark-gray mb-1">{item.category}</p>
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.floor(item.rating) ? '⭐' : '☆'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-custom-dark-gray">
                      {item.rating} ({item.reviews})
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="mt-6 w-full py-3 border border-custom-charcoal text-custom-charcoal font-semibold rounded-lg hover:bg-custom-charcoal hover:text-custom-white transition-all duration-300">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16 animate-slide-up delay-4">
          <button className="px-10 py-4 border-2 border-custom-charcoal text-custom-charcoal font-semibold rounded-xl hover:bg-custom-charcoal hover:text-custom-white transition-all duration-300">
            View All Products →
          </button>
        </div>
      </div>
    </section>
  );
}

export default Showcase;
