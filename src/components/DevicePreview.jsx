import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const DevicePreview = ({ 
  children, 
  defaultDevice = 'desktop',
  showControls = true,
  className = ''
}) => {
  const [device, setDevice] = useState(defaultDevice);

  const devices = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px', height: '667px' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px', height: '1024px' },
    { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%', height: '600px' }
  ];

  const currentDevice = devices.find(d => d.id === device) || devices[2];

  return (
    <div className={`device-preview ${className}`}>
      {showControls && (
        <div className="device-controls">
          {devices.map((d) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setDevice(d.id)}
                className={`device-btn ${device === d.id ? 'active' : ''}`}
                aria-label={`Switch to ${d.label} view`}
              >
                <Icon size={18} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="device-frame-wrapper">
        <div 
          className={`device-frame device-${device}`}
          style={{
            width: device === 'desktop' ? '100%' : currentDevice.width,
            height: device === 'desktop' ? currentDevice.height : 'auto',
            minHeight: device === 'desktop' ? '400px' : 'auto'
          }}
        >
          <div className="device-screen">
            <div className="device-content">
              {children}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .device-preview {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .device-controls {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .device-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          background: var(--surface-card);
          border: 1.5px solid var(--border-card);
          border-radius: var(--radius-pill);
          color: var(--muted);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .device-btn:hover {
          border-color: var(--brand-red);
          color: var(--brand-red);
          background: var(--brand-red-soft);
        }

        .device-btn.active {
          background: var(--brand-red);
          border-color: var(--brand-red);
          color: var(--white);
        }

        .device-frame-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100%;
          background: var(--surface-soft);
          border-radius: var(--radius-lg);
          padding: 2rem;
          min-height: 400px;
        }

        .device-frame {
          background: var(--surface-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .device-mobile {
          border: 8px solid var(--ink);
          border-radius: 32px;
          max-width: 375px;
          margin: 0 auto;
        }

        .device-mobile::before {
          content: '';
          display: block;
          width: 120px;
          height: 24px;
          background: var(--ink);
          border-radius: 0 0 16px 16px;
          margin: 0 auto;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -8px;
        }

        .device-tablet {
          border: 12px solid var(--ink);
          border-radius: 24px;
          max-width: 768px;
          margin: 0 auto;
        }

        .device-desktop {
          width: 100%;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }

        .device-screen {
          width: 100%;
          height: 100%;
          overflow: auto;
          background: var(--surface);
        }

        .device-content {
          width: 100%;
          min-height: 100%;
        }

        @media (max-width: 768px) {
          .device-frame-wrapper {
            padding: 1rem;
          }

          .device-mobile,
          .device-tablet {
            max-width: 100%;
          }

          .device-btn span {
            display: none;
          }

          .device-btn {
            padding: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DevicePreview;
