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
        <div className="adm-modal-overlay" role="dialog" aria-modal="true" onClick={() => close(false)}>
          <div className="adm-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className={`adm-modal-icon ${state.tone}`}>{ICONS[state.tone] || ICONS.danger}</div>
            <div className="adm-modal-title">{state.title}</div>
            <div className="adm-modal-desc">{state.description}</div>
            <div className="adm-modal-actions">
              <button type="button" className="admin-btn-secondary" onClick={() => close(false)}>{state.cancelLabel}</button>
              <button
                type="button"
                className={state.tone === 'danger' ? 'admin-btn-danger' : 'admin-btn-primary'}
                onClick={() => close(true)}
                autoFocus
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
