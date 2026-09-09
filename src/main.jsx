import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
const path = window.location.pathname.replace(/\/$/, '') || '/';
const app = <React.StrictMode><App /></React.StrictMode>;
// Only hydrate HTML produced for this exact route. SPA fallbacks for account
// and unknown URLs must use a fresh root, not hydrate an unrelated homepage.
if (root.dataset.route === path) hydrateRoot(root, app);
else createRoot(root).render(app);
