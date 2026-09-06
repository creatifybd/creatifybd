import { useEffect } from 'react';

/**
 * useReveal — React hook that observes all `.sr` elements and adds `.vis`
 * once they scroll into view. Call this inside any component that renders
 * dynamic (Firestore-loaded) content so the observer always runs AFTER
 * the DOM is ready, eliminating the setTimeout hack.
 *
 * @param {any} dep — Optional dependency (e.g. a data array from Firestore)
 *                    to re-run the observer after data finishes loading.
 */
const useReveal = (dep = null) => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('vis');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.sr:not(.vis)');
    elements.forEach((el) => io.observe(el));

    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
};

export default useReveal;
