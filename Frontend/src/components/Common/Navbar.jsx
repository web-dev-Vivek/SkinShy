import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-custom-white/70 border-b border-custom-light-gray">
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
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
                >
                  Browse
                </button>
                <button
                  onClick={() => handleNavigation('/ingredient-glossary')}
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
          <div className="bg-custom-white/95 backdrop-blur-sm flex flex-col gap-1 py-4 px-4 border-t border-custom-light-gray/30">
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="text-left text-custom-dark-gray hover:text-custom-charcoal hover:bg-custom-light-gray/20 font-medium transition-all py-3 px-3 text-sm rounded-lg"
                >
                  🔍 Browse Products
                </button>
                <button
                  onClick={() => handleNavigation('/ingredient-glossary')}
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
