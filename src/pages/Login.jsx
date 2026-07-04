import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
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
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #fafafa 0%, #f2f3f5 100%)', padding: '2rem' }}>
      <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid rgba(15,15,20,0.08)', boxShadow: '0 20px 50px rgba(15,15,20,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#14151a', marginBottom: '0.5rem', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
            Creatify<span style={{ color: '#E8192C' }}>BD</span> Admin
          </h1>
          <p style={{ color: 'rgba(20,21,26,0.55)', fontSize: '0.875rem' }}>Secure access to your creative command center</p>
        </div>

        {error && (
          <div role="alert" style={{ background: 'rgba(232,25,44,0.08)', color: '#c4101f', padding: '0.8rem', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(232,25,44,0.18)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="admin-email" style={{ display: 'block', color: 'rgba(20,21,26,0.6)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} aria-hidden="true" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(20,21,26,0.35)' }} />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creatifybd.com"
                autoComplete="email"
                style={{ width: '100%', background: '#f7f7f9', border: '1.5px solid rgba(15,15,20,0.1)', borderRadius: '12px', padding: '0.85rem 1rem 0.85rem 2.8rem', color: '#14151a', outline: 'none', transition: 'border-color 0.2s' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="admin-password" style={{ display: 'block', color: 'rgba(20,21,26,0.6)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} aria-hidden="true" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(20,21,26,0.35)' }} />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ width: '100%', background: '#f7f7f9', border: '1.5px solid rgba(15,15,20,0.1)', borderRadius: '12px', padding: '0.85rem 1rem 0.85rem 2.8rem', color: '#14151a', outline: 'none', transition: 'border-color 0.2s' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? '#c8c9cf' : '#E8192C',
              color: '#fff',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}
            {!isSubmitting && <ArrowRight size={18} aria-hidden="true" />}
          </button>
        </form>
      </div>
    </main>
    </>
  );
};

export default Login;
