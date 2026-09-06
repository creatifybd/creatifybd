import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Preloader = ({ onComplete }) => {
  const { settings } = useSettings();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 800; // Smoother and slightly longer animation (800ms)
    const start = Date.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(interval);
      clearTimeout(failsafeTimeout);
      setCount(100);
      // Wait briefly at 100% to let progress register before sliding up
      setTimeout(onComplete, 120);
    };

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Premium cubic ease-out easing for progress count
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * 100));

      if (progress >= 1) {
        finish();
      }
    }, 16);

    // Failsafe: force preloader completion after 3.5s
    const failsafeTimeout = setTimeout(finish, 3500);

    return () => {
      finished = true;
      clearInterval(interval);
      clearTimeout(failsafeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
      className="preloader"
      style={{ background: 'var(--surface, #FFFBFB)' }}
    >
      <div className="preloader-content">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="preloader-brand"
        >
          <img 
            src={settings?.loading_logo_url || '/logo.png'} 
            alt="CreatifyBD" 
            style={{ height: '60px', width: 'auto', marginBottom: '1rem' }} 
          />
        </motion.div>
        <div className="preloader-progress">
          <div className="preloader-bar" style={{ width: `${count}%` }} />
        </div>
        <div className="preloader-num">{count}%</div>
      </div>
      <div className="preloader-bg-text">CREATIVITY / GROWTH / RESULTS</div>
    </motion.div>
  );
};

export default Preloader;
  