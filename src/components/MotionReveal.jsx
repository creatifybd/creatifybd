import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextReveal: Animates text word by word using a masked reveal effect.
 */
export const TextReveal = ({ children, className = '', delay = 0 }) => {
  const words = children.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 70,
      rotate: 5,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h2
      className={`text-reveal-container ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <span key={index} className="word-mask">
          <motion.span variants={child} className="word-inner">
            {word}{" "}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
};

/**
 * ImageReveal: Advanced creative mask reveal with scaling.
 */
export const ImageReveal = ({ children, delay = 0 }) => {
  return (
    <div className="image-reveal-wrap" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "-100%" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--red)',
          zIndex: 2,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: delay + 0.2 }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * StaggerReveal: Container for staggered child animations.
 */
export const StaggerReveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
        hidden: {}
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeReveal: Advanced fade and skew reveal for blocks.
 */
export const FadeReveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, skewY: 2 },
        visible: { opacity: 1, y: 0, skewY: 0 }
      }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
};
