import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    const mouse = { x: -200, y: -200 };
    const follower = { x: -200, y: -200 };
    let visible = false;
    let isMoving = false;
    let rafId = null;

    const lerp = (a, b, t) => a + (b - a) * t;

    const updatePosition = () => {
      follower.x = lerp(follower.x, mouse.x, 0.15);
      follower.y = lerp(follower.y, mouse.y, 0.15);

      dot.style.transform  = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${follower.x}px, ${follower.y}px, 0) translate(-50%, -50%)`;

      const dist = Math.hypot(mouse.x - follower.x, mouse.y - follower.y);
      if (dist > 0.1 || isMoving) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    };

    const startAnimation = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;

      if (!visible) {
        visible = true;
        follower.x = e.clientX;
        follower.y = e.clientY;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }

      startAnimation();
      clearTimeout(onMove.stopTimeout);
      onMove.stopTimeout = setTimeout(() => {
        isMoving = false;
      }, 100);
    };

    // Debounced mouseover check using event delegation for performance
    let hoverTimeout = null;
    const onOver = (e) => {
      if (hoverTimeout) return;
      hoverTimeout = setTimeout(() => {
        hoverTimeout = null;
        const t = e.target;
        if (!t) return;
        const isInput = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT';
        if (isInput) {
          dot.style.opacity  = '0';
          ring.style.opacity = '0';
          return;
        }

        const isInteractive = t.closest('a, button, [role="button"], input, select, textarea');
        if (isInteractive) {
          ring.classList.add('cc-ring--hover');
          dot.classList.add('cc-dot--hover');
          const lbl = isInteractive.getAttribute('data-cursor') || '';
          if (label) label.textContent = lbl;
        } else {
          ring.classList.remove('cc-ring--hover');
          dot.classList.remove('cc-dot--hover');
          if (label) label.textContent = '';
        }
      }, 16);
    };

    const onLeave = () => {
      visible = false;
      isMoving = false;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };

    const onDown = () => {
      dot.classList.add('cc-dot--click');
      ring.classList.add('cc-ring--click');
    };

    const onUp = () => {
      dot.classList.remove('cc-dot--click');
      ring.classList.remove('cc-ring--click');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (onMove.stopTimeout) clearTimeout(onMove.stopTimeout);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div ref={dotRef} className="cc-dot" aria-hidden="true" />
      <div ref={ringRef} className="cc-ring" aria-hidden="true">
        <span ref={labelRef} className="cc-label" />
      </div>

      <style>{`
        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }

        .cc-dot {
          position: fixed;
          top: 0; left: 0;
          width: 7px; height: 7px;
          background: #E8192C;
          border-radius: 50%;
          pointer-events: none;
          z-index: 999999;
          opacity: 0;
          will-change: transform;
          transition: opacity .15s, width .2s ease, height .2s ease, background .2s;
        }
        .cc-dot--hover {
          width: 4px !important;
          height: 4px !important;
          background: #fff !important;
        }
        .cc-dot--click {
          width: 3px !important;
          height: 3px !important;
        }

        .cc-ring {
          position: fixed;
          top: 0; left: 0;
          width: 38px; height: 38px;
          border: 1.5px solid rgba(232,25,44,.55);
          border-radius: 50%;
          pointer-events: none;
          z-index: 999998;
          opacity: 0;
          will-change: transform;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity .15s, width .25s ease, height .25s ease, background .25s, border-color .25s;
        }
        .cc-ring--hover {
          width: 64px !important;
          height: 64px !important;
          background: rgba(232,25,44,.07) !important;
          border-color: #E8192C !important;
        }
        .cc-ring--click {
          width: 54px !important;
          height: 54px !important;
        }

        .cc-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
          color: #E8192C;
          font-family: var(--font-body);
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          transition: opacity .2s;
        }
        .cc-ring--hover .cc-label { opacity: 1; }

        @media (hover: none), (pointer: coarse) {
          .cc-dot, .cc-ring { display: none !important; }
          *, *::before, *::after { cursor: auto !important; }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
