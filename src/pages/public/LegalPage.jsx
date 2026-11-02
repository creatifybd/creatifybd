import React from 'react';
import { PrivacyPolicyPage, TermsPage } from './PrivacyPolicyPage';
// Retained compatibility import; both variants use the canonical Bengali policy.
export default function LegalPage({ type }) { return type === 'privacy' ? <PrivacyPolicyPage /> : <TermsPage />; }
