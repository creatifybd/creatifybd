import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(err.message || 'Login failed. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login | CreatifyBD" noIndex={true} />
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse at 50% -20%, #1f222e 0%, #0d0e12 60%, #070709 100%)',
          padding: '1.5rem',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(232, 25, 44, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Login Card Container */}
        <div
          style={{
            width: '100%',
            maxWidth: '370px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '20px',
            padding: '2rem 1.75rem',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0.28rem 0.75rem',
                borderRadius: '100px',
                background: 'rgba(232, 25, 44, 0.08)',
                color: '#e8192c',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}
            >
              <Shield size={12} />
              <span>Admin Console</span>
            </div>

            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#0f0f12',
                margin: '0 0 0.35rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
              Creatify<span style={{ color: '#E8192C' }}>BD</span>
            </h1>
            <p
              style={{
                color: '#6b7280',
                fontSize: '0.82rem',
                margin: 0,
                lineHeight: 1.4
              }}
            >
              Sign in to manage services, orders & leads
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(232, 25, 44, 0.08)',
                color: '#c4101f',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                textAlign: 'center',
                border: '1px solid rgba(232, 25, 44, 0.18)',
                fontWeight: 500
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@creatifybd.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    background: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                    color: '#111827',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e8192c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(232,25,44,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }}
                />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    background: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                    color: '#111827',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e8192c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(232,25,44,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                background: isSubmitting ? '#9ca3af' : '#E8192C',
                color: '#ffffff',
                padding: '0.95rem 1.5rem',
                borderRadius: '14px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.96rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(232, 25, 44, 0.32)',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#c0142a';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.background = '#E8192C';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
            </button>
          </form>

          {/* Footer Back Link */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#6b7280',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.18s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e8192c'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              <ArrowLeft size={14} />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
