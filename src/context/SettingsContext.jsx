import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { defaultContent, CONTENT_VERSION } from '../data/defaultContent';

const SettingsContext = createContext();

const deepMerge = (target, source) => {
  if (!source) return { ...target };
  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined && source[key] !== null) {
      output[key] = source[key];
    }
  });
  return output;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [content, setContent] = useState(defaultContent);
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

    // Read from settings/site
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

    // Content settings with codebase version auto-sync
    const unsubContent = onSnapshot(doc(db, 'settings', 'content'), (snap) => {
      if (snap.exists()) {
        const remoteData = snap.data();
        const merged = deepMerge(defaultContent, remoteData);
        
        // If Firestore version is missing or older than codebase CONTENT_VERSION,
        // automatically sync updated codebase content to Firestore
        if (!remoteData.version || Number(remoteData.version) < CONTENT_VERSION) {
          const updatedPayload = { ...merged, version: CONTENT_VERSION, updated_at: Date.now() };
          setDoc(doc(db, 'settings', 'content'), updatedPayload, { merge: true }).catch(console.error);
          setContent(updatedPayload);
        } else {
          setContent(merged);
        }
      } else {
        // Seed Firestore if document doesn't exist
        setDoc(doc(db, 'settings', 'content'), defaultContent, { merge: true }).catch(console.error);
        setContent(defaultContent);
      }
      contentLoaded = true;
      checkDone();
    }, (err) => {
      console.warn('Content fallback to codebase default:', err);
      setContent(defaultContent);
      contentLoaded = true;
      checkDone();
    });

    // Payment settings
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
