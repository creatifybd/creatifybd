import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OptimizedImage: High-performance image component with animated skeleton placeholder,
 * automatic fallback on error, and smooth fade-in transition.
 */
const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  aspectRatio = 'auto',
  priority = false,
  objectFit = 'cover',
  fallbackSrc = '/assets/hero-visual.png'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div 
      className={`opt-img-container ${className}`} 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%', 
        height: '100%',
        aspectRatio: aspectRatio,
        background: 'transparent',
        borderRadius: 'inherit'
      }}

    >
      {/* Animated Skeleton Placeholder */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="opt-img-skeleton"
          />
        )}
      </AnimatePresence>

      {/* Actual Image */}
      {currentSrc && !hasError && (
        <motion.img
          src={currentSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            display: 'block',
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
