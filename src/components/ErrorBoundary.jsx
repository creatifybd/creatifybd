import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable error boundary.
 *
 * Usage:
 *   <ErrorBoundary>...</ErrorBoundary>                 -> full-page fallback (use ONCE, at the app root)
 *   <ErrorBoundary level="section" label="Portfolio">   -> compact inline fallback (use around individual
 *     ...                                                   routes/sections so one broken part doesn't take
 *   </ErrorBoundary>                                       down the whole site)
 *
 * Every caught error is logged with console.error (unconditionally, not just in DEV) so it shows up in
 * production DevTools consoles too. If window.reportError exists (e.g. wired up to Sentry or another
 * error-tracking service) it is also called, so remote error tracking works automatically once such a
 * service is added — no changes needed here.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    const label = this.props.label ? ` [${this.props.label}]` : '';
    // Intentionally NOT gated behind import.meta.env.DEV — we want this visible in production too.
    console.error(`ErrorBoundary caught an error${label}:`, error, errorInfo);

    // Optional hook for a remote error-tracking service (e.g. Sentry), if one is ever wired up.
    if (typeof window !== 'undefined' && typeof window.reportError === 'function') {
      try {
        window.reportError(error);
      } catch (_) {
        // never let error reporting itself crash the boundary
      }
    }

    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo);
      } catch (_) {
        // ignore
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.level === 'section') {
      // Section-level: just retry rendering the children, no full reload needed.
      return;
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.level === 'section') {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              minHeight: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(232,25,44,0.04)',
              border: '1px solid rgba(232,25,44,0.15)',
              borderRadius: '16px',
              padding: '2rem',
              margin: '1rem 0'
            }}
          >
            <div style={{ maxWidth: '420px', textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}>
              <p style={{ marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {this.props.label ? `${this.props.label} section` : 'This section'} couldn't load right now.
                The rest of the page is unaffected.
              </p>
              <button
                onClick={this.handleReset}
                style={{
                  background: 'transparent',
                  color: '#E8192C',
                  border: '1px solid rgba(232,25,44,0.4)',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Try again
              </button>
              {import.meta.env.DEV && this.state.error && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  textAlign: 'left',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.5)',
                  overflow: 'auto'
                }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                </div>
              )}
            </div>
          </motion.div>
        );
      }

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '2rem',
            fontFamily: 'var(--font-body, system-ui, sans-serif)'
          }}
        >
          <div style={{
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            background: '#ffffff',
            border: '1px solid rgba(16, 24, 40, 0.08)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(232, 25, 44, 0.08)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#E8192C'
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F0F12', marginBottom: '0.65rem', letterSpacing: '-0.02em' }}>
              সাময়িক ত্রুটি হয়েছে
            </h2>
            <p style={{ color: '#667085', fontSize: '0.92rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              আমরা আন্তরিকভাবে দুঃখিত। পেজটি পুনরায় লোড করুন অথবা হোমে ফিরে যান।
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#E8192C',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(232, 25, 44, 0.28)',
                  transition: 'transform 0.18s, background 0.18s'
                }}
              >
                পুনরায় লোড করুন
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f1f3f5',
                  color: '#0F0F12',
                  border: 'none',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                হোম পেজ
              </a>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: 'rgba(255,255,255,0.5)',
                overflow: 'auto'
              }}>
                <strong>Error:</strong> {this.state.error.toString()}
                <br />
                <strong>Stack:</strong> {this.state.errorInfo?.componentStack}
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
