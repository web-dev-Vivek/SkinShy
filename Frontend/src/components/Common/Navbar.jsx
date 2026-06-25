import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import gsap from 'gsap';
import useProtectedNavigate from '../../hooks/useProtectedNavigate';
import { useOnboarding } from '../../context/OnboardingContext';

function Navbar() {
  const protectedNavigate = useProtectedNavigate();
  const { isSignedIn, signOut } = useAuth();
  const { logout } = useOnboarding();
  const { user: clerkUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const drawerRef = useRef(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;

      const currentScroll = window.scrollY;
      
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

  // Handle drawer animation
  useEffect(() => {
    if (isOpen) {
      gsap.to(navRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power3.in'
      });

      // Animate overlay in
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });

      // Animate drawer in from right
      gsap.to(drawerRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      });

      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power2.in'
      });

      gsap.to(drawerRef.current, {
        x: 400,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      });

      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleNavigation = (path) => {
    protectedNavigate(path);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    logout();
    signOut(() => {
      window.location.href = '/';
    });
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = isSignedIn ? [
    { label: 'Guide', icon: '📚', image: '/Guide.png', path: '/guide' },
    { label: 'Browse', icon: '🔍', image: '/Browser.png', path: '/search' },
    { label: 'Compare', icon: '⚖️', image: '/Compare.png', path: '/product_Comparasion' },
  ] : [
    { label: 'Guide', icon: '📚', image: '/Guide.png', path: '/guide' },
  ];

  return (
    <>
      {/* Navbar */}
      <nav ref={navRef} className="fixed top-0 backdrop-blur-xl bg-custom-white/95 left-0 right-0 z-40 border-b border-custom-light-gray/20">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 sm:h-20">
             {/* Logo */}
             <div 
               onClick={() => handleNavigation('/')}
               className="cursor-pointer group flex-shrink-0"
             >
               <h1 className="text-2xl sm:text-2xl md:text-3xl font-playfair font-bold text-custom-charcoal group-hover:text-custom-black transition-colors">
                 Skinshy
               </h1>
               <div className="h-0.5 w-0 group-hover:w-full bg-custom-charcoal transition-all duration-300"></div>
             </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-12">
              <button
                onClick={() => handleNavigation('/guide')}
                className="text-sm font-medium text-custom-dark-gray hover:text-custom-charcoal transition-colors duration-200 relative group font-lato"
              >
                Guide
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-charcoal group-hover:w-full transition-all duration-300"></span>
              </button>
              {isSignedIn && (
                <>
                  <button
                    onClick={() => handleNavigation('/search')}
                    className="text-sm font-medium text-custom-dark-gray hover:text-custom-charcoal transition-colors duration-200 relative group font-lato"
                  >
                    Browse
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-charcoal group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/product_Comparasion')}
                    className="text-sm font-medium text-custom-dark-gray hover:text-custom-charcoal transition-colors duration-200 relative group font-lato"
                  >
                    Compare
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-custom-charcoal group-hover:w-full transition-all duration-300"></span>
                  </button>
                </>
              )}
            </div>

            {/* Right Side Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {!isSignedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation('/signup')}
                    className="px-6 py-2.5 bg-custom-charcoal text-custom-white rounded-full hover:bg-custom-black transition-all duration-200 font-medium text-sm font-lato"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-custom-light-gray hover:border-custom-charcoal transition-all duration-200"
                >
                  {clerkUser?.profileImageUrl ? (
                    <img
                      src={clerkUser.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-custom-charcoal flex items-center justify-center text-custom-white text-sm font-semibold font-playfair">
                      {clerkUser?.firstName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
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
        </div>
      </nav>

      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeMenu}
        className="fixed inset-0 bg-custom-charcoal/40 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300"
        style={{ top: '0' }}
      />

       {/* Drawer Menu - Premium Design */}
       <div
         ref={drawerRef}
         className="fixed top-0 right-0 bottom-0 w-4/5 sm:w-3/4 md:max-w-sm bg-custom-white z-50 shadow-2xl rounded-l-3xl flex flex-col overflow-hidden"
         style={{ transform: 'translateX(400px)', opacity: 0 }}
       >
         {/* Close Button */}
         <button
           onClick={closeMenu}
           className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-custom-light-gray/20 transition-all duration-200 z-50"
           aria-label="Close menu"
         >
           <svg className="w-6 h-6 text-custom-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
         </button>

         {/* Profile Section */}
         {isSignedIn && (
           <div className="bg-gradient-to-b from-custom-light-gray/30 to-custom-off-white/20 backdrop-blur-sm p-8 pt-16 border-b border-custom-light-gray/20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-custom-charcoal shadow-lg">
                {clerkUser?.profileImageUrl ? (
                  <img
                    src={clerkUser.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-custom-charcoal flex items-center justify-center text-custom-white text-2xl font-bold font-playfair">
                    {clerkUser?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-lg font-playfair font-bold text-custom-charcoal">
                  {clerkUser?.firstName || 'User'}
                </h2>
                <button
                  onClick={() => {
                    handleNavigation('/profile');
                  }}
                  className="text-xs text-custom-dark-gray hover:text-custom-charcoal transition-colors mt-1 font-lato"
                >
                  View profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full flex items-center gap-4 px-6 py-4 text-custom-dark-gray hover:text-custom-charcoal hover:bg-custom-light-gray/15 rounded-2xl transition-all duration-200 group active:bg-custom-light-gray/30 font-lato text-sm font-medium"
            >
              {/* Use PNG image on all views */}
              <img 
                src={item.image} 
                alt={item.label}
                className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
              />
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </span>
            </button>
          ))}

          {!isSignedIn && (
            <button
              onClick={() => handleNavigation('/signup')}
              className="w-full mt-6 px-6 py-4 bg-custom-charcoal text-custom-white font-semibold rounded-2xl hover:bg-custom-black transition-all duration-200 font-lato text-sm"
            >
              Sign Up
            </button>
          )}
        </div>

        {/* Footer - Sign Out */}
        {isSignedIn && (
          <div className="border-t border-custom-light-gray/20 p-6">
            <button
              onClick={handleSignOut}
              className="w-full px-6 py-3 text-custom-charcoal border border-custom-light-gray rounded-2xl hover:bg-custom-light-gray/20 transition-all duration-200 font-lato text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
