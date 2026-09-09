import React, { useState } from 'react';

// Keep images visible in the server-rendered HTML, including when JS is slow.
export default function OptimizedImage({ src, alt = '', className = '', aspectRatio = 'auto', priority = false, objectFit = 'cover', fallbackSrc = '', srcSet, sizes, width, height }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const currentSrc = failedSrc === src && fallbackSrc ? fallbackSrc : src;
  return <div className={`opt-img-container ${className}`} style={{ position: 'relative', overflow: 'hidden', width: '100%', aspectRatio, borderRadius: 'inherit' }}>
    <img src={currentSrc} srcSet={failedSrc === src ? undefined : srcSet} sizes={sizes} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={() => setFailedSrc(src)} style={{ width: '100%', height: aspectRatio === 'auto' ? 'auto' : '100%', objectFit, display: 'block' }} />
  </div>;
}
