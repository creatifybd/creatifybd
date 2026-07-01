import React from 'react';
  import ReactDOM from 'react-dom/client';
  import App from './App';
  import './index.css';
  import './styles/overrides.css';

  // Embed build identifier so each CI run produces unique bundle output.
  // Vite replaces import.meta.env.VITE_* at build time with the literal value.
  if (import.meta.env.VITE_BUILD_ID) {
    document.documentElement.dataset.buildId = import.meta.env.VITE_BUILD_ID;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
