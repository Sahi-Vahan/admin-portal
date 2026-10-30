import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component for Admin Command Center
 * Ensures that whenever an admin navigates between dashboard, bookings,
 * reports, specialists, pricing, finance, audit, or settings,
 * the window and scrollable <main> container immediately reset to top (0, 0).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elementId = hash.replace(/^#/, '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Scroll window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Specifically reset main container which has overflow-y-auto in AdminLayout
    const scrollContainers = document.querySelectorAll<HTMLElement>(
      'main, [data-scroll-container], .overflow-y-auto'
    );
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      scrollContainers.forEach((container) => {
        container.scrollTop = 0;
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
