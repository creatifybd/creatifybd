import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.background = '';
    document.body.style.color = '';

    let settingsLoaded = false;
    let contentLoaded = false;
    let paymentLoaded = false;

    const checkDone = () => {
      if (settingsLoaded && contentLoaded && paymentLoaded) setLoading(false);
    };

    // Read from settings/public/site (new path) with fallback to legacy settings/site
    const unsubSettings = onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings(data);

        if (data.primary_color) {
          document.documentElement.style.setProperty('--red', data.primary_color);
        }
        if (data.secondary_color) {
          document.documentElement.style.setProperty('--red-dark', data.secondary_color);
        }
        if (data.favicon_url) {
          const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel*="icon"][sizes="32x32"]', 'link[rel*="icon"][sizes="16x16"]'];
          selectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) el.href = data.favicon_url;
          });
        }
      }
      settingsLoaded = true;
      checkDone();
    }, () => {
      settingsLoaded = true;
      checkDone();
    });

    const unsubContent = onSnapshot(doc(db, 'settings', 'content'), (snap) => {
      if (snap.exists()) setContent(snap.data());
      contentLoaded = true;
      checkDone();
    }, () => {
      contentLoaded = true;
      checkDone();
    });

    // Payment settings (Payoneer / DBBL bank details, trade license).
    // Public-read like the other settings docs above — account numbers for
    // receiving payment aren't secret (a client needs to see them to pay),
    // only the ability to *change* them is restricted (see firestore.rules).
    const unsubPayment = onSnapshot(doc(db, 'settings', 'payment'), (snap) => {
      if (snap.exists()) setPaymentSettings(snap.data());
      paymentLoaded = true;
      checkDone();
    }, () => {
      paymentLoaded = true;
      checkDone();
    });

    return () => {
      unsubSettings();
      unsubContent();
      unsubPayment();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, content, paymentSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
