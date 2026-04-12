import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import ProfileDropdown from './ProfileDropdown';

function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

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
            <button
              onClick={() => scrollToSection('features')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors text-sm"
            >
              About
            </button>
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
                <>
                  <button
                    onClick={() => handleNavigation('/search')}
                    className="px-3 sm:px-4 py-2 border-2 border-custom-charcoal text-custom-charcoal rounded-lg hover:bg-custom-charcoal hover:text-custom-white transition font-medium text-sm"
                  >
                    Browse
                  </button>
                  <ProfileDropdown />
                </>
              )}
            </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 group flex-shrink-0"
          >
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="bg-custom-white flex flex-col gap-3 py-4 border-t border-custom-light-gray -mx-4 px-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2 text-sm"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2 text-sm"
            >
              Showcase
            </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2 text-sm"
              >
                About
              </button>
                 <div className="flex flex-col gap-2 pt-3 border-t border-custom-light-gray">
                    {!isSignedIn ? (
                      <button
                        onClick={() => handleNavigation('/signup')}
                        className="px-4 py-2 bg-custom-charcoal text-custom-white rounded-lg hover:bg-custom-black transition font-medium w-full text-sm"
                      >
                        Sign Up
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNavigation('/search')}
                          className="px-4 py-2 border-2 border-custom-charcoal text-custom-charcoal rounded-lg hover:bg-custom-charcoal hover:text-custom-white transition font-medium w-full text-sm"
                        >
                          Browse Products
                        </button>
                        <div className="border-t border-custom-light-gray pt-2 -mx-4 px-4">
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
