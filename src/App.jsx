import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollProgress from './components/ScrollProgress';
import { MagneticWrap } from './components/MotionReveal';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'));
const ProcessPage = lazy(() => import('./pages/public/ProcessPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const LegalPage = lazy(() => import('./pages/public/LegalPage'));
const PaymentPage = lazy(() => import('./pages/public/PaymentPage'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Marketplace pages
const ServiceCategoryPage = lazy(() => import('./pages/public/ServiceCategoryPage'));
const OrderSuccessPage = lazy(() => import('./pages/public/OrderSuccessPage'));

// Client portal pages
const ClientOrdersPortal = lazy(() => import('./pages/public/ClientOrdersPortal'));
const ClientOrderDetail = lazy(() => import('./pages/public/ClientOrderDetail'));

// Trust & info pages
const TeamPage = lazy(() => import('./pages/public/TeamPage'));
const ReviewsPage = lazy(() => import('./pages/public/ReviewsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/public/RefundPolicyPage'));
const RevisionPolicyPage = lazy(() => import('./pages/public/RevisionPolicyPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.99 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.994,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <ErrorBoundary level="section">
      {children}
    </ErrorBoundary>
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Global magnetic effect for .btn-red and .btn-huge-red buttons
  useEffect(() => {
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') return;

    const applyMagneticEffect = () => {
      const buttons = document.querySelectorAll('.btn-red, .btn-huge-red');
      
      buttons.forEach(button => {
        if (button.dataset.magneticApplied) return;
        
        button.dataset.magneticApplied = 'true';
        button.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)';
        button.style.willChange = 'transform';
        
        const handleMouseMove = (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const strength = 0.15;
          button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        };
        
        const handleMouseLeave = () => {
          button.style.transform = 'translate(0, 0)';
        };
        
        button.addEventListener('mousemove', handleMouseMove, { passive: true });
        button.addEventListener('mouseleave', handleMouseLeave);
        
        // Store handlers for cleanup
        button.dataset.magneticHandlers = JSON.stringify({ handleMouseMove, handleMouseLeave });
      });
    };

    // Apply initially
    applyMagneticEffect();
    
    // Re-apply on DOM changes with debouncing
    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(applyMagneticEffect, 100);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      // Cleanup event listeners
      const buttons = document.querySelectorAll('.btn-red, .btn-huge-red');
      buttons.forEach(button => {
        if (button.dataset.magneticHandlers) {
          const { handleMouseMove, handleMouseLeave } = JSON.parse(button.dataset.magneticHandlers);
          button.removeEventListener('mousemove', handleMouseMove);
          button.removeEventListener('mouseleave', handleMouseLeave);
          delete button.dataset.magneticApplied;
          delete button.dataset.magneticHandlers;
        }
      });
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/admin') || location.pathname === '/login') return undefined;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 2,
      lerp: 0.1,
    });

    let frameId;
    let lastTime = 0;
    function raf(time) {
      const deltaTime = time - lastTime;
      lastTime = time;
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [location.pathname]);

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <WhatsAppButton />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
          <Route path="/services/:categorySlug" element={<PageWrapper><ServiceCategoryPage /></PageWrapper>} />
          <Route path="/gigs" element={<Navigate to="/services" replace />} />
          <Route path="/gigs/:slug" element={<Navigate to="/services" replace />} />
          <Route path="/order/start/:gigSlug" element={<Navigate to="/contact" replace />} />
          <Route path="/order/success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
          <Route path="/client/orders" element={<PageWrapper><ClientOrdersPortal /></PageWrapper>} />
          <Route path="/client/orders/:orderId" element={<PageWrapper><ClientOrderDetail /></PageWrapper>} />
          <Route path="/portfolio" element={<PageWrapper><PortfolioPage /></PageWrapper>} />
          <Route path="/work" element={<Navigate to="/portfolio" replace />} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/process" element={<PageWrapper><ProcessPage /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/case-studies" element={<Navigate to="/portfolio" replace />} />
          <Route path="/case-study/:slug" element={<Navigate to="/portfolio" replace />} />
          <Route path="/team" element={<PageWrapper><TeamPage /></PageWrapper>} />
          <Route path="/reviews" element={<PageWrapper><ReviewsPage /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
          <Route path="/refund-policy" element={<PageWrapper><RefundPolicyPage /></PageWrapper>} />
          <Route path="/revision-policy" element={<PageWrapper><RevisionPolicyPage /></PageWrapper>} />
          <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicyPage /></PageWrapper>} />
          <Route path="/payment" element={<PageWrapper><PaymentPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

// Loading fallback for lazy-loaded components
const PageLoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface, #ffffff)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(232,25,44,0.16)',
      borderTopColor: '#E8192C',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <ConfirmProvider>
          <SettingsProvider>
            <LanguageProvider>
              <Router>
                <Suspense fallback={<PageLoadingFallback />}>
                  <AppContent />
                </Suspense>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    className: 'adm-toast',
                    style: {
                      background: '#ffffff',
                      color: '#0F0F12',
                      borderRadius: '12px',
                      border: '1px solid rgba(15,15,18,0.08)',
                      boxShadow: '0 12px 32px rgba(15,15,18,0.10)',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                    },
                    success: {
                      iconTheme: { primary: '#E8192C', secondary: '#fff' },
                    },
                    error: {
                      iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    },
                  }}
                />
              </Router>
            </LanguageProvider>
          </SettingsProvider>
          </ConfirmProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
