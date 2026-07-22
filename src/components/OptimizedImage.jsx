import React, { useState, useEffect, useRef } from 'react';

/**
 * OptimizedImage: High-performance, bulletproof image component.
 * Handles cached image detection, instant load recognition, skeleton placeholders,
 * and smooth fade-in transitions without staying blank.
 */
const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  aspectRatio = 'auto',
  priority = false,
  objectFit = 'cover',
  fallbackSrc = ''
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  // Handle cached images that load before React mounts or attaches onLoad
  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
  }, [currentSrc]);

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
      {!isLoaded && !hasError && (
        <div 
          className="opt-img-skeleton"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            borderRadius: 'inherit'
          }}
        />
      )}

      {/* Actual Image */}
      {currentSrc && !hasError && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            display: 'block',
            borderRadius: 'inherit',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.35s ease-in-out',
            position: 'relative',
            zIndex: 2
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
