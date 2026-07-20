import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children, requireOwner = false }) => {
  const { user, loading, role, roleLoading, isOwner, logout } = useAuth();

  if (loading || (user && roleLoading)) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface, #FFFBFB)', color: 'var(--ink, #0F0F12)', fontFamily: "'Inter', sans-serif" }}>
        <div className="loader">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!role) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface, #FFFBFB)', padding: '2rem' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center', background: '#fff', border: '1px solid rgba(15,15,18,0.08)', borderRadius: '20px', padding: '3rem 2rem', boxShadow: '0 12px 32px rgba(15,15,18,0.08)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldAlert size={26} />
          </div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F0F12', marginBottom: '0.5rem' }}>Access restricted</h1>
          <p style={{ fontSize: '0.88rem', color: '#667085', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Your account ({user.email}) is signed in but has not been granted admin access. Ask an existing admin to add you from the Admin Users page.
          </p>
          <button
            type="button"
            onClick={() => logout()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#E8192C', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
