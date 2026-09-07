import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return ctx.confirm;
};

const ICONS = {
  danger: <ShieldAlert size={26} />,
  warning: <AlertTriangle size={26} />,
  info: <Info size={26} />
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((options) => {
    const opts = typeof options === 'string' ? { description: options } : (options || {});
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setState({
        title: opts.title || 'Are you sure?',
        description: opts.description || 'This action cannot be undone.',
        confirmLabel: opts.confirmLabel || 'Confirm',
        cancelLabel: opts.cancelLabel || 'Cancel',
        tone: opts.tone || 'danger'
      });
    });
  }, []);

  const close = (result) => {
    setState(null);
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => close(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            background: 'rgba(15, 15, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '20px',
              padding: '2.25rem 2rem 1.75rem',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.06)',
              textAlign: 'center',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                background: state.tone === 'danger' ? 'rgba(232, 25, 44, 0.1)' : state.tone === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                color: state.tone === 'danger' ? '#e8192c' : state.tone === 'warning' ? '#f59e0b' : '#3b82f6',
              }}
            >
              {ICONS[state.tone] || ICONS.danger}
            </div>

            {/* Title & Description */}
            <h3
              style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: '#111827',
                margin: '0 0 0.5rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.02em'
              }}
            >
              {state.title}
            </h3>
            <p
              style={{
                fontSize: '0.92rem',
                color: '#6b7280',
                margin: '0 0 1.75rem',
                lineHeight: 1.55,
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              {state.description}
            </p>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <button
                type="button"
                onClick={() => close(false)}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.25rem',
                  borderRadius: '12px',
                  border: '1.5px solid #e5e7eb',
                  background: '#f9fafb',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s, border-color 0.18s',
                  outline: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
              >
                {state.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '0.8rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: state.tone === 'danger' ? '#e8192c' : '#111827',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: state.tone === 'danger' ? '0 4px 16px rgba(232,25,44,0.32)' : '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'transform 0.18s, opacity 0.18s',
                  outline: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export default ConfirmContext;
