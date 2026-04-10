import React, { useState, useEffect } from 'react';

export default function InfoTooltip({ steps, title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop view: tooltip in top-right blank space
  if (!isMobile) {
    return (
      <div className="relative inline-block">
        {/* Info Icon Button - Desktop */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-gray-700/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-3xl transition-all duration-300 hover:scale-110"
          title={`Learn about ${title}`}
        >
          <span className="text-sm text-black font-semibold">i</span>
        </button>

        {/* Glassmorphism Tooltip - Desktop (Top Right) */}
        {isOpen && (
          <>
            {/* Tooltip positioned in top-right */}
            <div className="fixed top-8 right-8 z-50 w-96 max-h-96 overflow-y-auto p-4 rounded-2xl bg-white/20 backdrop-blur-3xl border border-white/30 shadow-2xl text-black"
              style={{
                animation: 'slideInFromRight 0.3s ease-out',
                backdropFilter: 'blur(80px)',
                WebkitBackdropFilter: 'blur(80px)'
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/20">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700/70 hover:text-black hover:scale-[1.2] text-xl font-bold leading-none transform translate ease 400 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-black">{step}</p>
                  </div>
                ))}
              </div>

              {/* Pointer/Arrow */}
              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white/20 border-l border-t border-white/30 rotate-45" />
            </div>

            {/* Overlay to close tooltip */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* CSS Animations */}
            <style>{`
              @keyframes slideInFromRight {
                from {
                  opacity: 0;
                  transform: translateX(100px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
          </>
        )}
      </div>
    );
  }

  // Mobile view: full screen overlay with slide animation
  return (
    <div className="relative inline-block">
      {/* Info Icon Button - Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-6 h-6 ml-2 rounded-full bg-gray-700/20 hover:bg-black/30 text-white border border-white/30 backdrop-blur-3xl transition-all duration-300 active:scale-95"
        title={`Learn about ${title}`}
      >
        <span className="text-sm font-semibold">i</span>
      </button>

      {/* Mobile Full Screen Overlay */}
      {isOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* Glassmorphism Suggestion Panel - Slides from Right */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-[95%] max-w-md backdrop-blur-3xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 pl-4 pr-4 pointer-events-auto"
              style={{
                animation: 'slideInFullScreen 0.4s ease-out',
                backdropFilter: 'blur(80px)',
                WebkitBackdropFilter: 'blur(80px)'
              }}
            >
              {/* Header with Back Button */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
                <h3 className="text-lg font-bold text-white flex-1 text-center">{title}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-xl font-bold leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Steps Content */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-white/90">{step}</p>
                  </div>
                ))}
              </div>

              
            </div>
          </div>

          {/* CSS Animations for Mobile */}
          <style>{`
            @keyframes slideInFullScreen {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
