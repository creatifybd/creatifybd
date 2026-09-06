import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition = ({ children, location }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 }
        }}
      >
        {/* Red curtain overlay */}
        <motion.div
          className="page-transition-curtain"
          initial={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'top' }}
        />
        
        {/* Content */}
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>

        <style>{`
          .page-transition-curtain {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #E8192C 0%, #C0142A 100%);
            z-index: 9999;
            pointer-events: none;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
