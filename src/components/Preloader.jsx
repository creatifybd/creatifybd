import React, { useEffect, useState } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { useSettings } from '../context/SettingsContext';

  const Preloader = ({ onComplete }) => {
    const { settings } = useSettings();
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const duration = 400;
      const start = Date.now();
      let hideTimeout;
      let completeTimeout;
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        clearInterval(interval);
        clearTimeout(failsafeTimeout);
        setCount(100);
        hideTimeout = setTimeout(() => {
          setIsVisible(false);
          completeTimeout = setTimeout(onComplete, 300);
        }, 80);
      };

      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        setCount(Math.floor(progress * 100));

        if (progress >= 1) {
          finish();
        }
      }, 16);

      // Failsafe: never let the preloader get stuck (e.g. throttled background
      // tabs or slow first paint). Force it to complete after 3s regardless.
      const failsafeTimeout = setTimeout(finish, 3000);

      return () => {
        finished = true;
        clearInterval(interval);
        clearTimeout(failsafeTimeout);
        clearTimeout(hideTimeout);
        clearTimeout(completeTimeout);
      };
    }, [onComplete]);

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ y: '-100%', transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
            className="preloader"
          >
            <div className="preloader-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="preloader-brand"
              >
                <img src={settings?.loading_logo_url || '/favicon.png'} alt="CreatifyBD" style={{ height: '120px', marginBottom: '2rem' }} />
              </motion.div>
              <div className="preloader-progress">
                <div className="preloader-bar" style={{ width: `${count}%` }} />
              </div>
              <div className="preloader-num">{count}%</div>
            </div>
            <div className="preloader-bg-text">CREATIVITY / GROWTH / RESULTS</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  export default Preloader;
  