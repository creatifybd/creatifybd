import React from 'react';
import { motion } from 'framer-motion';

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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f0f0f',
            padding: '2rem'
          }}
        >
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
            color: '#fff'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(232,25,44,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              border: '1px solid rgba(232,25,44,0.3)'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8192C" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
              Something went wrong
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.6 }}>
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: '#E8192C',
                color: '#fff',
                border: 'none',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Reload Page
            </button>
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
