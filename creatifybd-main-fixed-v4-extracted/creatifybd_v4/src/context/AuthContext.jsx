import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

// Legacy bootstrap owners — kept only so the two original accounts never get
// locked out while the `admins/{email}` collection is being populated.
// Any other admin access must go through the `admins` collection (see AdminUsers.jsx).
const LEGACY_OWNER_EMAILS = ['binashad7@gmail.com', 'creatifybd@gmail.com'];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (import.meta.env.DEV) console.warn('Auth state check timed out. Continuing as guest.');
      setUser(null);
      setLoading(false);
      setRoleLoading(false);
    }, 5000);

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        window.clearTimeout(timeoutId);
        setUser(currentUser);
        setLoading(false);

        if (!currentUser) {
          setRole(null);
          setRoleLoading(false);
          return;
        }

        setRoleLoading(true);
        try {
          const email = (currentUser.email || '').toLowerCase();
          const adminSnap = await getDoc(doc(db, 'admins', email));
          if (adminSnap.exists()) {
            setRole(adminSnap.data().role || 'editor');
          } else if (LEGACY_OWNER_EMAILS.includes(email)) {
            setRole('owner');
          } else {
            setRole(null);
          }
        } catch (err) {
          if (import.meta.env.DEV) console.error('Failed to resolve admin role:', err);
          const email = (currentUser.email || '').toLowerCase();
          setRole(LEGACY_OWNER_EMAILS.includes(email) ? 'owner' : null);
        } finally {
          setRoleLoading(false);
        }
      }, (error) => {
        window.clearTimeout(timeoutId);
        if (import.meta.env.DEV) console.error('Auth state error:', error);
        setUser(null);
        setLoading(false);
        setRoleLoading(false);
      });
    } catch (error) {
      window.clearTimeout(timeoutId);
      if (import.meta.env.DEV) console.error('Auth listener failed:', error);
      setLoading(false);
      setRoleLoading(false);
    }

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    role,
    roleLoading,
    isAdmin: !!role,
    isOwner: role === 'owner',
    isEditor: role === 'owner' || role === 'editor',
    isViewer: role === 'viewer',
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
