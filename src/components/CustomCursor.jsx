import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Snappier spring configuration
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const quickSpring = { damping: 20, stiffness: 600, mass: 0.2 };
  
  const dotX = useSpring(0, quickSpring);
  const dotY = useSpring(0, quickSpring);
  const ringX = useSpring(0, springConfig);
  const ringY = useSpring(0, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor') || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [dotX, dotY, ringX, ringY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Snappy Dot */}
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      
      {/* Delayed Fluid Ring */}
      <motion.div
        className="cursor-ring"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 90 : 40,
          height: isHovered ? 90 : 40,
          backgroundColor: isHovered ? 'rgba(232, 25, 44, 0.9)' : 'transparent',
          borderColor: isHovered ? 'transparent' : 'rgba(232, 25, 44, 0.5)',
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cursor-text"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
