import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
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
    let raf;

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      follower.x = lerp(follower.x, mouse.x, 0.1);
      follower.y = lerp(follower.y, mouse.y, 0.1);
      dot.style.transform  = `translate(${mouse.x}px,${mouse.y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${follower.x}px,${follower.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        follower.x = e.clientX;
        follower.y = e.clientY;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    };

    const onOver = (e) => {
      const t = e.target;
      const isInput = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT';
      if (isInput) {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
        return;
      }
      dot.style.opacity  = visible ? '1' : '0';
      ring.style.opacity = visible ? '1' : '0';

      const isLink = t.tagName === 'A' || !!t.closest('a');
      const isBtn  = t.tagName === 'BUTTON' || !!t.closest('button') || t.getAttribute('role') === 'button';
      if (isLink || isBtn) {
        ring.classList.add('cc-ring--hover');
        dot.classList.add('cc-dot--hover');
        const lbl = t.getAttribute('data-cursor') || t.closest('[data-cursor]')?.getAttribute('data-cursor') || 'View';
        if (label) label.textContent = lbl;
      } else {
        ring.classList.remove('cc-ring--hover');
        dot.classList.remove('cc-dot--hover');
        if (label) label.textContent = '';
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Primary dot — exact mouse position */}
      <div ref={dotRef} className="cc-dot" />

      {/* Follower ring — lags behind with lerp */}
      <div ref={ringRef} className="cc-ring">
        <span ref={labelRef} className="cc-label" />
      </div>

      <style>{`
        @media (pointer: fine) {
          *, *::before, *::after { cursor: none !important; }
        }

        /* ── Primary dot ── */
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
          transition: opacity .15s, width .25s cubic-bezier(.16,1,.3,1),
                      height .25s cubic-bezier(.16,1,.3,1),
                      background .2s;
        }
        .cc-dot--hover {
          width: 4px !important;
          height: 4px !important;
          background: #fff !important;
        }

        /* ── Follower ring ── */
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
          transition: opacity .15s,
                      width .35s cubic-bezier(.16,1,.3,1),
                      height .35s cubic-bezier(.16,1,.3,1),
                      background .35s,
                      border-color .35s;
        }
        .cc-ring--hover {
          width: 68px !important;
          height: 68px !important;
          background: rgba(232,25,44,.07) !important;
          border-color: #E8192C !important;
          border-width: 1.5px !important;
        }

        /* ── Label inside ring ── */
        .cc-label {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: .6px;
          text-transform: uppercase;
          color: #E8192C;
          font-family: 'DM Sans', sans-serif;
          opacity: 0;
          pointer-events: none;
          white-space: nowrap;
          transition: opacity .2s;
        }
        .cc-ring--hover .cc-label { opacity: 1; }

        /* Hide on touch devices */
        @media (hover: none), (pointer: coarse) {
          .cc-dot, .cc-ring { display: none !important; }
          *, *::before, *::after { cursor: auto !important; }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
