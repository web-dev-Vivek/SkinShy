import React from 'react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <section id="about" className="section-spacing relative w-full bg-gradient-to-b from-white to-[#a08a7c] bg-center bg-cover bg-no-repeat overflow-hidden" data-scroll
      style={{ backgroundImage: `
      url(${window.innerWidth >= 768 ? '/Back2.png' : '/Back2mobile.png'})
    `}}>
      
      {/* Parallax Background - moves slower than content */}
      <div className="absolute inset-0 -z-20 will-change-transform"
        data-scroll
        data-scroll-speed="-0.4"
        style={{
          backgroundImage: `url(${window.innerWidth >= 768 ? '/Back2.png' : '/Back2mobile.png'})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
       >
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10"
       >
         <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-custom-off-white opacity-30 blur-3xl"></div>
         <div className="absolute top-20 left-0 w-64 h-64 rounded-full bg-custom-light-gray opacity-20 blur-3xl"></div>
       </div>

      <div className="container-custom">
        
        {/* Main Content */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
           
           {/* Left Content */}
           <div className="space-y-8 animate-slide-up will-change-transform" data-scroll data-scroll-speed="1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-1 bg-custom-charcoal rounded-full"></div>
                <span className="text-xs md:text-sm font-medium text-custom-dark-gray tracking-widest uppercase">
                  About Skinshy 
                </span>
              </div>
              
               <h2 className="heading-gradient text-4xl md:text-5xl lg:text-6xl text-white">
                 Precision Meets Beauty
               </h2>
            </div>

             <p className="text-lg text-white leading-relaxed max-w-2xl">
               We believe skincare isn't one-size-fits-all. Skinshy combines cutting-edge AI technology with deep skincare expertise to deliver truly personalized recommendations. Every product match is backed by data, science, and thousands of user experiences.
             </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-custom-charcoal flex items-center justify-center">
                  <span className="text-custom-white text-sm">✓</span>
                </div>
                <div>
                   <h4 className="font-archivo font-bold text-white mb-1">Data-Driven</h4>
                   <p className="text-white">Every recommendation backed by advanced analytics</p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-custom-charcoal flex items-center justify-center">
                  <span className="text-custom-white text-sm">✓</span>
                </div>
                <div>
                   <h4 className="font-archivo font-bold text-white mb-1">Expert Curated</h4>
                   <p className="text-white">Verified by dermatologists and beauty experts</p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-custom-charcoal flex items-center justify-center">
                  <span className="text-custom-white text-sm">✓</span>
                </div>
                <div>
                   <h4 className="font-archivo font-bold text-white mb-1">Community Driven</h4>
                   <p className="text-white">Insights from thousands of real skin profiles</p>
                 </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/signup')}
              className="btn-primary mt-8"
            >
              Join Our Community
            </button>
          </div>

            {/* Right Visual */}
            <div className="relative animate-slide-up delay-2 will-change-transform" data-scroll data-scroll-speed="1">
             <div className="grid grid-cols-2 gap-6">
               {/* Large Card */}
               <div className="glass-premium col-span-2 rounded-3xl p-8 md:p-10">
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="font-playfair font-bold text-2xl text-custom-charcoal">Premium Match</h4>
                   
                 </div>
                 <p className="text-custom-dark-gray">AI finds your perfect product match</p>
               </div>

               {/* Small Cards */}
               <div className="glass-card">
                 <p className="text-3xl mb-2">10K+</p>
                 <p className="text-sm text-custom-dark-gray">Products in Database</p>
               </div>

               <div className="glass-card">
                 <p className="text-3xl mb-2">50K+</p>
                 <p className="text-sm text-custom-dark-gray">Happy Users</p>
               </div>

               <div className="glass-card">
                 <p className="text-3xl mb-2">98%</p>
                 <p className="text-sm text-custom-dark-gray">Satisfaction Rate</p>
               </div>

               <div className="glass-card">
                 <p className="text-3xl mb-2">2M+</p>
                 <p className="text-sm text-custom-dark-gray">Recommendations Daily</p>
               </div>
            </div>
           </div>
        </div>

         {/* Final CTA */}
          <div className="glass-dark mt-16 sm:mt-24 py-12 sm:py-16 md:py-20 px-4 sm:px-8 rounded-2xl sm:rounded-3xl text-custom-white text-center animate-slide-up delay-3 will-change-transform" data-scroll data-scroll-speed="0.8">
           <h3 className="heading-gradient text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 font-playfair font-bold leading-snug">
             Your Perfect Skincare Match Awaits
           </h3>
           <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
             Stop wasting money on products that don't work. Start your personalized skincare journey today.
           </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-0">
              <button
                onClick={() => navigate('/search')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-custom-white text-custom-charcoal font-semibold text-sm sm:text-base rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
               Get Started Free
              </button>
            </div>
         </div>
      </div>
    </section>
  );
}

export default About;
