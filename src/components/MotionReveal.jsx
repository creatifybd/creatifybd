import React, { useRef, useState, useEffect, useCallback } from 'react';
  import { motion, useMotionValue, useSpring, useInView } from 'framer-motion';
  import OptimizedImage from './OptimizedImage';

  // ─── Shared Easing ────────────────────────────────────────────────────────────
  const EASE_EXPO    = [0.16, 1, 0.3, 1];
  const EASE_QUAD    = [0.45, 0, 0.55, 1];
  const EASE_SMOOTH  = [0.76, 0, 0.24, 1];

  // ─── TextReveal ───────────────────────────────────────────────────────────────
  export const TextReveal = ({ children, className = '', delay = 0, as = 'h2' }) => {
    const MotionTag = motion[as] || motion.h2;

    if (typeof children !== 'string') {
      return (
        <MotionTag
          className={`text-reveal-container ${className}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay }}
        >
          {children}
        </MotionTag>
      );
    }

    const words = children.split(' ');
    const container = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: delay } },
    };
    const child = {
      visible:  { opacity: 1, y: 0, rotate: 0,   transition: { type: 'spring', damping: 16, stiffness: 140 } },
      hidden:   { opacity: 0, y: 40, rotate: 2,   transition: { type: 'spring', damping: 16, stiffness: 140 } },
    };

    return (
      <MotionTag
        className={`text-reveal-container ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {words.map((word, i) => (
          <span key={i} className="word-mask">
            <motion.span variants={child} className="word-inner">{word}{' '}</motion.span>
          </span>
        ))}
      </MotionTag>
    );
  };

  // ─── CharReveal — Duck Design signature: per-character reveal ─────────────────
  export const CharReveal = ({ children, className = '', delay = 0, as = 'h2', stagger = 0.03 }) => {
    const MotionTag = motion[as] || motion.h2;
    const text = typeof children === 'string' ? children : '';
    const chars = text.split('');

    const container = {
      hidden: {},
      visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    };
    const char = {
      hidden:  { opacity: 0, y: '110%', skewY: 8 },
      visible: { opacity: 1, y: '0%',   skewY: 0, transition: { duration: 0.55, ease: EASE_EXPO } },
    };

    return (
      <MotionTag
        className={`char-reveal-container ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
      >
        {chars.map((c, i) => (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span variants={char} style={{ display: 'inline-block' }}>
              {c === ' ' ? '\u00A0' : c}
            </motion.span>
          </span>
        ))}
      </MotionTag>
    );
  };

  // ─── ImageReveal — directional clip-path wipe ─────────────────────────────────
  export const ImageReveal = ({ children, delay = 0, direction = 'up' }) => {
    const fromMap = {
      up:    { y: '100%', scale: 1.15, opacity: 0 },
      down:  { y: '-100%', scale: 1.15, opacity: 0 },
      left:  { x: '100%', scale: 1.08, opacity: 0 },
      right: { x: '-100%', scale: 1.08, opacity: 0 },
    };
    return (
      <div className="image-reveal-wrap" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit', width: '100%', height: '100%' }}>
        <motion.div
          initial={fromMap[direction]}
          whileInView={{ y: 0, x: 0, scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.4, ease: EASE_EXPO, delay }}
          style={{ width: '100%', height: '100%', willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      </div>
    );
  };

  // ─── FadeReveal — fade + lift, with optional skew ────────────────────────────
  export const FadeReveal = ({ children, delay = 0, skew = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 40, ...(skew && { skewY: 2 }) }}
      whileInView={{ opacity: 1, y: 0, skewY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );

  // ─── SlideReveal — directional horizontal/vertical reveal ────────────────────
  export const SlideReveal = ({ children, delay = 0, from = 'left', className = '' }) => {
    const fromMap = {
      left:   { x: -60, opacity: 0 },
      right:  { x:  60, opacity: 0 },
      bottom: { y:  60, opacity: 0 },
      top:    { y: -60, opacity: 0 },
    };
    return (
      <motion.div
        className={className}
        initial={fromMap[from] || fromMap.left}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1, ease: EASE_EXPO, delay }}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    );
  };

  // ─── BlurReveal — cinematic blur-to-sharp entrance ───────────────────────────
  export const BlurReveal = ({ children, delay = 0, className = '' }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.85, ease: EASE_EXPO, delay }}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  );

  // ─── StaggerReveal — staggered children container ────────────────────────────
  export const StaggerReveal = ({ children, delay = 0, className = '', stagger = 0.1 }) => (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  );

  // Child variant to pair with StaggerReveal
  export const StaggerChild = ({ children, className = '' }) => (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_EXPO } },
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );

  // ─── ScaleReveal — scale up from slight reduction ────────────────────────────
  export const ScaleReveal = ({ children, delay = 0, className = '' }) => (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, ease: EASE_EXPO, delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );

  // ─── CountUp — animated number on scroll ─────────────────────────────────────
  export const CountUp = ({ to, suffix = '', prefix = '', duration = 2, className = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!inView) return;
      let start = 0;
      const step = to / (duration * 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= to) { setCount(to); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 1000 / 60);
      return () => clearInterval(timer);
    }, [inView, to, duration]);

    return (
      <span ref={ref} className={className}>
        {prefix}{count}{suffix}
      </span>
    );
  };

  // ─── MagneticWrap — cursor magnetic pull on hover ────────────────────────────
  export const MagneticWrap = ({ children, strength = 0.3, className = '' }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.5 });

    const handleMouseMove = useCallback((e) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      x.set((e.clientX - (left + width / 2)) * strength);
      y.set((e.clientY - (top + height / 2)) * strength);
    }, [strength, x, y]);

    const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </motion.div>
    );
  };

  // ─── HoverTilt — subtle card tilt following cursor ───────────────────────────
  export const HoverTilt = ({ children, className = '', maxTilt = 6, scale = 1.02 }) => {
    const ref = useRef(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const springRotX = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.4 });
    const springRotY = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.4 });

    const handleMouseMove = useCallback((e) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const relX = (e.clientX - left) / width  - 0.5;
      const relY = (e.clientY - top)  / height - 0.5;
      rotateY.set(relX * maxTilt * 2);
      rotateX.set(-relY * maxTilt * 2);
    }, [maxTilt, rotateX, rotateY]);

    const handleMouseLeave = useCallback(() => { rotateX.set(0); rotateY.set(0); }, [rotateX, rotateY]);

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX: springRotX, rotateY: springRotY }}
        whileHover={{ scale }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ scale: { duration: 0.25, ease: EASE_EXPO } }}
      >
        {children}
      </motion.div>
    );
  };

  // ─── ParallaxImage — vertical parallax on scroll ─────────────────────────────
  export const ParallaxImage = ({ src, alt, className = '' }) => (
    <div className={`parallax-wrap ${className}`} style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <motion.div
        style={{ width: '100%', height: '120%', y: '-10%' }}
        whileInView={{ y: '0%' }}
        transition={{ duration: 2.2, ease: EASE_EXPO }}
        viewport={{ once: false }}
      >
        <OptimizedImage src={src} alt={alt} objectFit="cover" />
      </motion.div>
    </div>
  );
  