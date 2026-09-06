import React, { useState } from 'react';
import { Check, Clock, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const PackageTabs = ({ packages = {}, onSelect }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const tiers = ['basic', 'standard', 'premium'];
  const p = packages[activeTab] || {};

  return (
    <div className="package-tabs-card">
      <div className="tabs-header">
        {tiers.map((tier) => (
          <button
            key={tier}
            type="button"
            className={`tab-btn ${activeTab === tier ? 'active' : ''}`}
            onClick={() => setActiveTab(tier)}
          >
            {tier === 'basic' && 'Basic'}
            {tier === 'standard' && 'Standard'}
            {tier === 'premium' && 'Premium'}
          </button>
        ))}
      </div>

      <div className="package-details-pane">
        <div className="pane-row-price">
          <h4 className="package-name">{p.name || 'Tier Plan'}</h4>
          <span className="package-price">${p.price} <span className="currency-lbl">USD</span></span>
        </div>

        <p className="package-desc-placeholder">
          Professional delivery containing premium assets and checklist standards.
        </p>

        <div className="meta-delivery-row">
          <div className="meta-item">
            <Clock size={16} />
            <span>{p.deliveryTime} Days Delivery</span>
          </div>
          <div className="meta-item">
            <RotateCcw size={16} />
            <span>{p.revisions === 10 ? 'Unlimited' : `${p.revisions} Revisions`}</span>
          </div>
        </div>

        <ul className="package-deliverables-list">
          {(p.deliverables || []).map((item, idx) => (
            <li key={idx}>
              <Check size={16} className="chk-icon" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="btn-red w-full justify-center"
          onClick={() => onSelect(activeTab)}
          style={{ height: '48px', fontSize: '0.95rem' }}
        >
          Continue (${p.price} USD)
        </button>
      </div>

      <style>{`
        .package-tabs-card {
          background: #060608;
          border: 1px solid rgba(232, 25, 44, 0.15);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 60px rgba(232,25,44,0.06);
          width: 100%;
          position: relative;
        }
        .package-tabs-card::before {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(232,25,44,0.18) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .tabs-header,
        .package-details-pane {
          position: relative;
          z-index: 1;
        }

        .tabs-header {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(232,25,44,0.12);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: #777;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 1.25rem 0.5rem;
          cursor: none;
          transition: all 0.2s;
          position: relative;
        }

        .tab-btn:hover {
          color: white;
        }

        .tab-btn.active {
          color: var(--red);
          background: rgba(232,25,44,0.07);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--red);
        }

        .package-details-pane {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .pane-row-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .package-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
        }

        .package-price {
          font-size: 1.6rem;
          font-weight: 800;
          color: white;
        }

        .currency-lbl {
          font-size: 0.8rem;
          color: #777;
          font-weight: 600;
        }

        .package-desc-placeholder {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #888;
        }

        .meta-delivery-row {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: white;
          font-weight: 600;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .package-deliverables-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .package-deliverables-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.875rem;
          line-height: 1.4;
          color: #b0b0b0;
        }

        .chk-icon {
          color: #4caf50;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
      `}</style>
    </div>
  );
};

export default PackageTabs;
