import React from 'react';
import { Check, Minus } from 'lucide-react';

const PackageComparison = ({ packages = {} }) => {
  const basic = packages.basic || {};
  const standard = packages.standard || {};
  const premium = packages.premium || {};

  // Extract all unique feature keys
  const allFeatureKeys = new Set([
    ...Object.keys(basic.features || {}),
    ...Object.keys(standard.features || {}),
    ...Object.keys(premium.features || {})
  ]);

  const formatFeatureLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderValue = (val) => {
    if (typeof val === 'boolean') {
      return val ? <Check size={18} className="chk-icon-val" /> : <Minus size={16} className="dash-icon-val" />;
    }
    return val;
  };

  return (
    <div className="package-comparison-table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th className="feature-col">Feature Comparison</th>
            <th>Basic</th>
            <th>Standard</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="feature-label-cell">Package Price</td>
            <td className="price-cell">${basic.price} USD</td>
            <td className="price-cell">${standard.price} USD</td>
            <td className="price-cell">${premium.price} USD</td>
          </tr>
          <tr>
            <td className="feature-label-cell">Delivery Time</td>
            <td>{basic.deliveryTime} Days</td>
            <td>{standard.deliveryTime} Days</td>
            <td>{premium.deliveryTime} Days</td>
          </tr>
          <tr>
            <td className="feature-label-cell">Revisions</td>
            <td>{basic.revisions}</td>
            <td>{standard.revisions}</td>
            <td>{premium.revisions === 10 ? 'Unlimited' : premium.revisions}</td>
          </tr>
          {Array.from(allFeatureKeys).map((key) => (
            <tr key={key}>
              <td className="feature-label-cell">{formatFeatureLabel(key)}</td>
              <td>{renderValue(basic.features?.[key])}</td>
              <td>{renderValue(standard.features?.[key])}</td>
              <td>{renderValue(premium.features?.[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    <style>{`
      .package-comparison-table-wrapper {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        overflow: auto;
        background: var(--surface);
        margin: 2.5rem 0;
      }
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        font-size: 0.9rem;
        min-width: 600px;
      }
      .comparison-table th {
        background: var(--surface-soft);
        color: var(--ink);
        font-weight: 700;
        padding: 1.25rem 1rem;
        border-bottom: 1px solid var(--border);
        font-family: var(--font-display);
      }
      .comparison-table th:first-child {
        text-align: left;
      }
      .comparison-table td {
        padding: 1rem;
        color: var(--ink);
        border-bottom: 1px solid var(--border-soft);
      }
      .comparison-table tr:last-child td {
        border-bottom: none;
      }
      .comparison-table tbody tr:hover td {
        background: var(--surface-soft);
      }
      .feature-col {
        text-align: left;
        font-weight: 600;
        color: var(--muted);
        min-width: 180px;
      }
      .feature-label-cell {
        text-align: left;
        font-size: 0.85rem;
        color: var(--muted);
        font-weight: 500;
      }
      .price-cell {
        color: var(--brand-red);
        font-weight: 700;
        font-size: 1rem;
      }
      .chk-icon-val {
        color: var(--success);
      }
      .dash-icon-val {
        color: var(--gray-400);
      }
    `}</style>
    </div>
  );
};

export default PackageComparison;
