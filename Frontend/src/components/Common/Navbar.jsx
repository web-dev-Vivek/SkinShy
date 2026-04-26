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
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className="cursor-pointer group flex-shrink-0 flex items-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-extrabold bg-gradient-to-r from-[#da5ca6] to-[#000000] bg-clip-text text-transparent tracking-tight hover:scale-[1.02] transition-transform duration-300">
              Skinshy
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="relative px-1 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm group transition-colors"
                >
                  <span>Browse</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-rose-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </button>
                <button
                  onClick={() => handleNavigation('/ingredient-glossary')}
                  className="relative px-1 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm group transition-colors"
                >
                  <span>Compare</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-rose-400 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full"></span>
                </button>
              </>
            )}
          </div>

          {/* Right Side Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!isSignedIn ? (
              <button
                onClick={() => handleNavigation('/signup')}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-semibold text-sm tracking-wide"
              >
                Sign Up
              </button>
            ) : (
              <ProfileDropdown />
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 group flex-shrink-0 hover:bg-slate-100 rounded-full transition-all duration-200"
            aria-label="Toggle Menu"
          >
            <div className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col gap-2 py-4 px-2 border-t border-gray-100 pb-6">
            {isSignedIn && (
              <>
                <button
                  onClick={() => handleNavigation('/search')}
                  className="flex items-center text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all py-3 px-4 text-sm rounded-xl"
                >
                  <span className="mr-3 text-lg">🔍</span> Browse Products
                </button>
                <button
                  onClick={() => handleNavigation('/ingredient-glossary')}
                  className="flex items-center text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all py-3 px-4 text-sm rounded-xl"
                >
                  <span className="mr-3 text-lg">📖</span> Compare Ingredients
                </button>
              </>
            )}
            
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-2 px-2">
              {!isSignedIn ? (
                <button
                  onClick={() => handleNavigation('/signup')}
                  className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 w-full text-sm text-center tracking-wide"
                >
                  Sign Up Free
                </button>
              ) : (
                <div className="flex justify-center pt-2">
                  <ProfileDropdown isMobile={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;