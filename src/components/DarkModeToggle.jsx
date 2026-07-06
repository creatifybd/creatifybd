import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('creatify-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('creatify-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('creatify-theme', 'light');
    }
  }, [dark]);

  return (
    <motion.button
      className="dm-toggle"
      onClick={() => setDark(d => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex' }}
          >
            <Sun size={17} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ display: 'flex' }}
          >
            <Moon size={17} />
          </motion.span>
        )}
      </AnimatePresence>

      <style>{`
        .dm-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid var(--border-card, rgba(16,24,40,0.08));
          background: var(--surface-card, #fff);
          color: var(--muted, #667085);
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }
        .dm-toggle:hover {
          border-color: var(--brand-red, #e8192c);
          color: var(--brand-red, #e8192c);
          background: var(--brand-red-soft, rgba(232,25,44,0.06));
        }
      `}</style>
    </motion.button>
  );
};

export default DarkModeToggle;
