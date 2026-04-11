import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
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
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavigation('/')}
            className="cursor-pointer group"
          >
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
              Skinshy
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-custom-charcoal transition-all duration-300"></div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-12">
            <button
              onClick={() => scrollToSection('features')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors"
            >
              About
            </button>
          </div>

           {/* Right Side Buttons */}
           <div className="hidden md:flex items-center gap-4">
             <button
               onClick={() => handleNavigation('/search')}
               className="btn-outline"
             >
               Browse Products
             </button>
           </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 group"
          >
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-custom-charcoal transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-72' : 'max-h-0'}`}>
          <div className="bg-custom-white flex flex-col gap-4 py-6 border-t border-custom-light-gray -mx-4 px-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('showcase')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2"
            >
              Showcase
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-left text-custom-dark-gray hover:text-custom-charcoal font-medium transition-colors py-2"
            >
              About
            </button>
              <div className="flex flex-col gap-3 pt-4 border-t border-custom-light-gray">
                 <button
                   onClick={() => handleNavigation('/search')}
                   className="btn-outline w-full"
                 >
                   Browse Products
                 </button>
               </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
