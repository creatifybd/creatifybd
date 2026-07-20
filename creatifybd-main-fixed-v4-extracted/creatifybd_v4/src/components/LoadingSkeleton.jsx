import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className="skeleton-card" style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '360px' }}>
            <div className="skeleton-thumb" style={{ background: 'var(--surface-muted)', borderRadius: '12px', height: '180px', width: '100%', animation: 'shimmer 1.5s infinite linear' }} />
            <div className="skeleton-badge" style={{ background: 'var(--surface-muted)', borderRadius: '4px', height: '16px', width: '30%', animation: 'shimmer 1.5s infinite linear' }} />
            <div className="skeleton-title" style={{ background: 'var(--surface-muted)', borderRadius: '4px', height: '24px', width: '90%', animation: 'shimmer 1.5s infinite linear' }} />
            <div className="skeleton-text" style={{ background: 'var(--surface-muted)', borderRadius: '4px', height: '14px', width: '70%', animation: 'shimmer 1.5s infinite linear' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <div className="skeleton-avatar" style={{ background: 'var(--surface-muted)', borderRadius: '50%', height: '28px', width: '28px', animation: 'shimmer 1.5s infinite linear' }} />
              <div className="skeleton-price" style={{ background: 'var(--surface-muted)', borderRadius: '4px', height: '20px', width: '25%', animation: 'shimmer 1.5s infinite linear' }} />
            </div>
          </div>
        );
      case 'table-row':
        return (
          <tr key={index}>
            <td style={{ padding: '1.25rem 1rem' }}><div style={{ height: '16px', background: 'var(--surface-muted)', borderRadius: '4px', width: '40%', animation: 'shimmer 1.5s infinite linear' }} /></td>
            <td><div style={{ height: '16px', background: 'var(--surface-muted)', borderRadius: '4px', width: '70%', animation: 'shimmer 1.5s infinite linear' }} /></td>
            <td><div style={{ height: '16px', background: 'var(--surface-muted)', borderRadius: '4px', width: '30%', animation: 'shimmer 1.5s infinite linear' }} /></td>
            <td><div style={{ height: '24px', background: 'var(--surface-muted)', borderRadius: '12px', width: '50px', animation: 'shimmer 1.5s infinite linear' }} /></td>
            <td><div style={{ height: '28px', background: 'var(--surface-muted)', borderRadius: '6px', width: '32px', animation: 'shimmer 1.5s infinite linear' }} /></td>
          </tr>
        );
      case 'detail':
      default:
        return (
          <div key={index} className="skeleton-detail" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ height: '40px', background: 'var(--surface-muted)', borderRadius: '8px', width: '60%', animation: 'shimmer 1.5s infinite linear' }} />
            <div style={{ height: '300px', background: 'var(--surface-muted)', borderRadius: '16px', width: '100%', animation: 'shimmer 1.5s infinite linear' }} />
            <div style={{ height: '20px', background: 'var(--surface-muted)', borderRadius: '4px', width: '100%', animation: 'shimmer 1.5s infinite linear' }} />
            <div style={{ height: '20px', background: 'var(--surface-muted)', borderRadius: '4px', width: '90%', animation: 'shimmer 1.5s infinite linear' }} />
            <div style={{ height: '20px', background: 'var(--surface-muted)', borderRadius: '4px', width: '75%', animation: 'shimmer 1.5s infinite linear' }} />
          </div>
        );
    }
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
};

export default LoadingSkeleton;
