import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const start = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * 100));
      
      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 800); // Wait for exit animation
        }, 500);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="preloader"
        >
          <div className="preloader-content">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="preloader-brand"
            >
              <img src="/favicon.png" alt="CreatifyBD" style={{ height: '80px', marginBottom: '1.5rem' }} />
            </motion.div>
            <div className="preloader-progress">
              <div className="preloader-bar" style={{ width: `${count}%` }}></div>
            </div>
            <div className="preloader-num">{count}%</div>
          </div>
          <div className="preloader-bg-text">CREATIVITY • GROWTH • RESULTS</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
