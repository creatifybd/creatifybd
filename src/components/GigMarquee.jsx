import React from 'react';
import { Link } from 'react-router-dom';
import { gigs } from '../data/gigs';
import GigCard from './GigCard';

const GigMarqueeCard = ({ gig, duplicate = false }) => (
  <div
    className="gig-marquee-card"
    aria-hidden={duplicate ? 'true' : undefined}
  >
    <GigCard gig={gig} />
  </div>
);

const GigMarquee = () => {
  const activeGigs = gigs.filter(gig => gig.status === 'active');
  const rowOne = activeGigs.filter((_, index) => index % 2 === 0);
  const rowTwo = activeGigs.filter((_, index) => index % 2 === 1);

  return (
    <section className="gig-marquee-section" aria-label="Our Services">
      <div className="gig-marquee-header">
        <h2 className="gig-marquee-title">Our Services</h2>
        <p className="gig-marquee-subtitle">Premium creative services for your brand growth</p>
      </div>
      
      <div className="gig-marquee">
        {[rowOne, rowTwo].map((row, rowIndex) => (
          <div className={`gig-marquee-row gig-marquee-row--${rowIndex === 0 ? 'left' : 'right'}`} key={rowIndex}>
            <div className="gig-marquee-track">
              {[false, true].map(duplicate => (
                <div
                  className="gig-marquee-group"
                  key={duplicate ? 'duplicate' : 'primary'}
                  aria-hidden={duplicate ? 'true' : undefined}
                >
                  {row.map((gig, itemIndex) => (
                    <GigMarqueeCard
                      key={`${duplicate ? 'duplicate' : 'primary'}-${gig.id}`}
                      gig={gig}
                      duplicate={duplicate}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gig-marquee-footer">
        <Link to="/gigs" className="btn-red">View All Services →</Link>
      </div>

      <style>{`
        .gig-marquee-section {
          padding: 4rem 0;
          background: var(--surface);
          overflow: hidden;
        }
        .gig-marquee-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 0 2rem;
        }
        .gig-marquee-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .gig-marquee-subtitle {
          font-size: 1.1rem;
          color: var(--muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .gig-marquee {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .gig-marquee-row {
          display: flex;
          overflow: hidden;
          width: 100%;
        }
        .gig-marquee-track {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        .gig-marquee-row--right .gig-marquee-track {
          animation: scroll-reverse 40s linear infinite;
        }

        /* ── Pause animation when hovering any card in the row ── */
        .gig-marquee-row:hover .gig-marquee-track {
          animation-play-state: paused;
        }

        .gig-marquee-group {
          display: flex;
          gap: 1.5rem;
          padding: 0 0.75rem;
        }
        .gig-marquee-card {
          flex-shrink: 0;
          width: 320px;
        }
        .gig-marquee-card .gig-card {
          pointer-events: auto;
        }
        .gig-marquee-card[aria-hidden="true"] .gig-card {
          pointer-events: none;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .gig-marquee-footer {
          text-align: center;
          padding: 0 2rem;
        }
        .gig-marquee-footer .btn-red {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: var(--brand-red);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .gig-marquee-footer .btn-red:hover {
          background: var(--red-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }
        @media (max-width: 768px) {
          .gig-marquee-title { font-size: 2rem; }
          .gig-marquee-subtitle { font-size: 1rem; }
          .gig-marquee-card { width: 280px; }
          .gig-marquee-group { gap: 1rem; }
        }
      `}</style>
    </section>
  );
};

export default GigMarquee;
