import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OptimizedImage: A high-performance image component with loading states,
 * skeleton placeholders, and smooth transitions.
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'auto',
  priority = false,
  objectFit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If priority is true, we want to load it immediately
  const loadingStrategy = priority ? 'eager' : 'lazy';

  return (
    <div 
      className={`opt-img-container ${className}`} 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        width: '100%', 
        height: '100%',
        aspectRatio: aspectRatio,
        background: 'rgba(255, 255, 255, 0.03)' // Subtle background for loading
      }}
    >
      {/* Skeleton / Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="opt-img-skeleton"
          />
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="opt-img-error" style={{
          position: absolute,
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.2)',
          fontSize: '0.8rem'
        }}>
          Failed to load image
        </div>
      )}

      {/* The Actual Image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading={loadingStrategy}
        fetchpriority={priority ? 'high' : 'auto'}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.05 
        }}
        transition={{ 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          display: 'block',
          willChange: 'transform, opacity'
        }}
      />
    </div>
  );
};


export default OptimizedImage;
