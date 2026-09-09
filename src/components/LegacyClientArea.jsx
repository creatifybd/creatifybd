import React from 'react';
import '../styles/legacy-account.css';

// Retain the existing order portal styling without loading Firebase Auth on
// every public page or requiring clients to sign into an administrator account.
export default function LegacyClientArea({ children }) {
  return <div className="cb-account-area">{children}</div>;
}
