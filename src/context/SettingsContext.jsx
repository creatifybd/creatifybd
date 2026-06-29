import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep the public site dark; individual admin screens can still override locally.
    document.body.setAttribute('data-theme', 'dark');
    document.body.style.background = '#0d0e12';
    document.body.style.color = '#ffffff';

    // Listen to global site settings (Identity, Branding, Colors)
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings(data);
        
        // Update CSS Variables for Theme
        if (data.primary_color) {
          document.documentElement.style.setProperty('--red', data.primary_color);
        }
        if (data.secondary_color) {
           document.documentElement.style.setProperty('--red-dark', data.secondary_color);
        }

        // Dynamically update Favicon (title bar icon)
        if (data.favicon_url) {
          const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel*="icon"][sizes="32x32"]', 'link[rel*="icon"][sizes="16x16"]'];
          selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.href = data.favicon_url;
          });
        }

      }
    }, (err) => {
      console.error("Settings Fetch Error:", err);
      setLoading(false);
    });


    // Listen to section content (Hero, Process, etc.)
    const unsubContent = onSnapshot(doc(db, 'settings', 'content'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setContent(data);
      }
      setLoading(false);
    }, (err) => {
      console.error("Content Fetch Error:", err);
      setLoading(false);
    });


    return () => {
      unsubSettings();
      unsubContent();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, content, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};


export const useSettings = () => useContext(SettingsContext);
