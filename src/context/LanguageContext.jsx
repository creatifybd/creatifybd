import React, { createContext, useContext } from 'react';

// Language system removed — website is English-only for international clients.
// This stub keeps backward-compatibility with any component that still imports useLanguage.
const LanguageContext = createContext({ lang: 'bn', setLang: () => {} });

export const LanguageProvider = ({ children }) => (
  <LanguageContext.Provider value={{ lang: 'bn', setLang: () => {} }}>
    {children}
  </LanguageContext.Provider>
);

export const useLanguage = () => useContext(LanguageContext);
