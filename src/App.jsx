import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import ErrorBoundary from './components/ErrorBoundary';
import WhatsAppButton from './components/WhatsAppButton';

const AccountArea = lazy(() => import('./components/AccountArea'));
const LegacyClientArea = lazy(() => import('./components/LegacyClientArea'));
// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/public/PortfolioPage'));
const ProcessPage = lazy(() => import('./pages/public/ProcessPage'));
const PricingPage = lazy(() => import('./pages/public/PricingPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
// PaymentPage disabled — clients are contacted directly after inquiry
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
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep an invalid escape literal. */ }
      const target = document.getElementById(id);
      if (target) { target.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
const PageWrapper = ({ children }) => <ErrorBoundary level="section">{children}</ErrorBoundary>;
function AppContent() {
  const { pathname } = useLocation();
  const accountPage = pathname.startsWith('/admin') || pathname === '/login';
  return <>
    <ScrollToTop />
    {!accountPage && <WhatsAppButton />}
        <Routes>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
          <Route path="/services/:categorySlug" element={<PageWrapper><ServiceCategoryPage /></PageWrapper>} />
          <Route path="/gigs" element={<Navigate to="/services" replace />} />
          <Route path="/gigs/:slug" element={<Navigate to="/services" replace />} />
          <Route path="/order/start/:gigSlug" element={<Navigate to="/contact" replace />} />
          <Route path="/order/success" element={<PageWrapper><LegacyClientArea><OrderSuccessPage /></LegacyClientArea></PageWrapper>} />
          <Route path="/client/orders" element={<PageWrapper><LegacyClientArea><ClientOrdersPortal /></LegacyClientArea></PageWrapper>} />
          <Route path="/client/orders/:orderId" element={<PageWrapper><LegacyClientArea><ClientOrderDetail /></LegacyClientArea></PageWrapper>} />
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
          <Route path="/payment" element={<Navigate to="/contact" replace />} />
          <Route path="/login" element={<AccountArea><Login /></AccountArea>} />
          <Route
            path="/admin/*"
            element={
              <AccountArea protectedPage><AdminDashboard /></AccountArea>
            }
          />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
  </>;
}
const PageLoadingFallback = () => <div className="cb-route-loading" role="status">পাতাটি প্রস্তুত হচ্ছে…</div>;

export default function App({ RouterComponent = BrowserRouter, location, helmetContext }) {
  return <ErrorBoundary><HelmetProvider context={helmetContext}>
    <SettingsProvider><LanguageProvider><RouterComponent location={location}>
      <Suspense fallback={<PageLoadingFallback />}><AppContent /></Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: 'inherit' } }} />
    </RouterComponent></LanguageProvider></SettingsProvider>
  </HelmetProvider></ErrorBoundary>;
}
