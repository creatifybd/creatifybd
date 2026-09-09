import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ConfirmProvider } from '../context/ConfirmContext';
import ProtectedRoute from './ProtectedRoute';
import '../styles/legacy-account.css';

// Firebase Auth and administration dependencies load only for account routes.
export default function AccountArea({ children, protectedPage = false }) {
  return <div className="cb-account-area"><AuthProvider><ConfirmProvider>{protectedPage ? <ProtectedRoute>{children}</ProtectedRoute> : children}</ConfirmProvider></AuthProvider></div>;
}
