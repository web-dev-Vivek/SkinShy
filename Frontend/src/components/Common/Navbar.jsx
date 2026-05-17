import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import gsap from 'gsap';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return; // Don't animate if mobile menu is open

      const currentScroll = window.scrollY;
      
      // Prevent tiny scroll jitter - only animate on significant scroll
      if (Math.abs(currentScroll - lastScrollRef.current) < 50) return;

      const isScrollingDown = currentScroll > lastScrollRef.current;

      gsap.to(navRef.current, {
        y: isScrollingDown ? -100 : 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Reset navbar position when mobile menu opens
  useEffect(() => {
    if (isOpen) {
      gsap.to(navRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav ref={navRef} className="fixed top-0 backdrop-blur-xl left-0 right-0 z-50 ">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className="cursor-pointer group flex-shrink-0"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
              Skinshy
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-custom-charcoal transition-all duration-300"></div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => handleNavigation('/guide')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
            >
              Guide
            </button>
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
                >
                  Browse
                </button>
                <button
                  onClick={() => handleNavigation('/product_Comparasion')}
                  className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
                >
                  Compare
                </button>
              </>
            )}
          </div>

            {/* Right Side Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {!isSignedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="px-3 sm:px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition font-medium text-sm"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <ProfileDropdown />
              )}
            </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 group flex-shrink-0 hover:bg-custom-light-gray/20 rounded-lg transition-all duration-200 active:bg-custom-light-gray/40"
          >
            <div className={`w-5 h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="bg-custom-white flex flex-col gap-1 py-4 px-4">
            <button
              onClick={() => handleNavigation('/guide')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal hover:bg-custom-light-gray/20 font-medium transition-all py-3 px-3 text-sm rounded-lg"
            >
              📚 Guide
            </button>
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="text-left text-custom-dark-gray hover:text-custom-charcoal hover:bg-custom-light-gray/20 font-medium transition-all py-3 px-3 text-sm rounded-lg"
                >
                  🔍 Browse Products
                </button>
                <button
                  onClick={() => handleNavigation('/product_Comparasion')}
                  className="text-left text-custom-dark-gray hover:text-custom-charcoal hover:bg-custom-light-gray/20 font-medium transition-all py-3 px-3 text-sm rounded-lg"
                >
                  📖 Compare Ingredients
                </button>
              </>
            )}
            <div className="flex flex-col gap-3 pt-2 border-t border-custom-light-gray/30 mt-2">
              {!isSignedIn ? (
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-4 py-3 bg-custom-charcoal text-custom-white font-semibold rounded-lg hover:bg-custom-black active:scale-95 transition-all duration-200 w-full text-sm"
                >
                  Sign Up Free
                </button>
              ) : (
                <>
                  <div className="pt-2">
                    <ProfileDropdown isMobile={true} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
