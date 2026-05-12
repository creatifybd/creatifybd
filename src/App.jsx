import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'));
const ProcessPage = lazy(() => import('./pages/public/ProcessPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const CaseStudiesPage = lazy(() => import('./pages/public/CaseStudiesPage'));
const CaseStudyDetailPage = lazy(() => import('./pages/public/CaseStudyDetailPage'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <ScrollToTop />
      <CustomCursor />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
          <Route path="/work" element={<PageWrapper><PortfolioPage /></PageWrapper>} />
          <Route path="/process" element={<PageWrapper><ProcessPage /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><PricingPage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/case-studies" element={<PageWrapper><CaseStudiesPage /></PageWrapper>} />
          <Route path="/case-study/:id" element={<PageWrapper><CaseStudyDetailPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
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
    background: 'var(--black, #0f0f0f)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(232,25,44,0.2)',
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
                    style: {
                      background: '#1a1a1a',
                      color: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #333',
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      fontFamily: 'DM Sans, sans-serif',
                    },
                    success: {
                      iconTheme: { primary: '#E8192C', secondary: '#fff' },
                    },
                    error: {
                      iconTheme: { primary: '#ff4444', secondary: '#fff' },
                    },
                  }}
                />
              </Router>
            </LanguageProvider>
          </SettingsProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
