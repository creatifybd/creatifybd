import React, { createContext, useContext } from 'react';
import release from '../data/publishedRelease.json';

const publishedSettings = Object.freeze({
  settings: release.site,
  content: release.content,
  release,
  paymentSettings: null,
  loading: false,
});
const SettingsContext = createContext(publishedSettings);

// Public visitors never seed, migrate or write CMS data. Admin screens load
// their drafts separately; a deployment publishes one complete content version.
export const SettingsProvider = ({ children }) => (
  <SettingsContext.Provider value={publishedSettings}>{children}</SettingsContext.Provider>
);
export const useSettings = () => useContext(SettingsContext);
