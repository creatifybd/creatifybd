import React from 'react';

const ITEMS = [
  'Brand Identity',
  'Logo Design',
  'Packaging Design',
  'Vector Illustration',
  'Social Media',
  'Graphic Design',
  'UI/UX Design',
  'Print Design',
  'Motion Graphics',
  'Typography',
  'Brand Strategy',
  'Visual Identity',
];

const MarqueeTrack = ({ reverse = false }) => (
  <div
    className={`marquee-track${reverse ? ' marquee-track--reverse' : ''}`}
    aria-hidden="true"
  >
    {[...ITEMS, ...ITEMS].map((item, i) => (
      <span key={i} className="marquee-item">
        <span className="marquee-dot" />
        {item}
      </span>
    ))}
  </div>
);

const InfiniteMarquee = () => (
  <div className="marquee-section" aria-hidden="true">
    <div className="marquee-wrapper">
      <MarqueeTrack />
    </div>

    <style>{`
      .marquee-section {
        overflow: hidden;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        background: var(--surface-soft);
        padding: 1rem 0;
      }

      .marquee-wrapper {
        display: flex;
        width: 100%;
        overflow: hidden;
        mask-image: linear-gradient(
          to right,
          transparent 0%,
          black 8%,
          black 92%,
          transparent 100%
        );
        -webkit-mask-image: linear-gradient(
          to right,
          transparent 0%,
          black 8%,
          black 92%,
          transparent 100%
        );
      }

      .marquee-track {
        display: flex;
        align-items: center;
        gap: 0;
        animation: marqueeScroll 28s linear infinite;
        white-space: nowrap;
        flex-shrink: 0;
        min-width: max-content;
      }

      .marquee-track--reverse {
        animation-direction: reverse;
      }

      @keyframes marqueeScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .marquee-item {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0 2.5rem;
        font-family: var(--font-display);
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
        white-space: nowrap;
      }

      .marquee-dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--brand-red);
        flex-shrink: 0;
        opacity: 0.6;
      }

      @media (prefers-reduced-motion: reduce) {
        .marquee-track { animation: none; }
      }
    `}</style>
  </div>
);

export default InfiniteMarquee;
