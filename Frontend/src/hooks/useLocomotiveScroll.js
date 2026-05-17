import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

/**
 * Custom hook to initialize and manage Locomotive Scroll
 * Provides smooth scrolling with parallax effects
 * @param {boolean} enabled - Whether to enable locomotive scroll (default: true)
 * @returns {Object} - scroll instance and container ref
 */
export const useLocomotiveScroll = (enabled = true) => {
  const scrollRef = useRef(null);
  const scrollInstanceRef = useRef(null);

  useEffect(() => {
    if (!enabled || !scrollRef.current) return;

    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smartphone: {
        smooth: true
      },
      tablet: {
        smooth: true
      },
      getDirection: true,
      getSpeed: true,
      multiplier: 1,
      lerp: 0.1, // Lower = smoother but slower response
      class: 'is-reveal'
    });

    scrollInstanceRef.current = scroll;

    // Update Locomotive Scroll on window resize
    const handleResize = () => {
      scroll.update();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollInstanceRef.current) {
        scrollInstanceRef.current.destroy();
        scrollInstanceRef.current = null;
      }
    };
  }, [enabled]);

  return {
    scrollRef,
    scrollInstance: scrollInstanceRef.current
  };
};

export default useLocomotiveScroll;
