import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import {
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Star,
  Activity,
  CreditCard,
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  ShoppingBag,
  ClipboardList,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import '../admin.css';

// Admin Sub-pages
import Overview from './admin/Overview';
import ServicesManager from './admin/Services';
import PortfolioManager from './admin/Portfolio';
import MessagesList from './admin/Messages';
import TestimonialsManager from './admin/Testimonials';
import SettingsManager from './admin/Settings';
import ContentManager from './admin/ContentManager';
import PricingManager from './admin/PricingManager';
import PaymentVerification from './admin/PaymentVerification';
import AdminGigs from './admin/AdminGigs';
import AdminOrders from './admin/AdminOrders';
import AdminReviews from './admin/AdminReviews';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    if(window.confirm("Sign out of admin panel?")) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardList size={18} />, badge: true },
    { path: '/admin/gigs', label: 'Gigs Manager', icon: <ShoppingBag size={18} /> },
    { path: '/admin/reviews', label: 'Reviews', icon: <MessageCircle size={18} /> },
    { path: '/admin/payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { path: '/admin/content', label: 'Page Content', icon: <Activity size={18} /> },
    { path: '/admin/services', label: 'Services', icon: <Briefcase size={18} /> },
    { path: '/admin/portfolio', label: 'Portfolio', icon: <ImageIcon size={18} /> },
    { path: '/admin/pricing', label: 'Pricing Plans', icon: <CreditCard size={18} /> },
    { path: '/admin/testimonials', label: 'Testimonials', icon: <Star size={18} /> },
    { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { path: '/admin/settings', label: 'Branding & SEO', icon: <Settings size={18} /> },
  ];

  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [cmdQuery, setCmdQuery] = React.useState('');

  React.useEffect(() => {
    document.body.classList.add('admin-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredNavItems = navItems.filter(item => item.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  const handleCmdNavigate = (path) => {
    navigate(path);
    setCmdOpen(false);
    setCmdQuery('');
  };

  const currentNavItem = navItems.find(item => item.path === location.pathname) || { label: 'Overview' };
  const adminEmail = auth.currentUser?.email || 'binashad7@gmail.com';

  return (
    <>
      <SEO title="Admin Dashboard | CreatifyBD" noIndex={true} />
      <div className="admin-layout">
      <button
        type="button"
        className="admin-sidebar-backdrop"
        aria-label="Close admin navigation"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Changed nav to div to avoid global nav styling conflicts */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ width: '32px', height: '32px', background: 'var(--adm-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={16} color="white" />
          </div>
          <span className="logo-text" style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white', whiteSpace: 'nowrap' }}>
            Creatify<span style={{ color: 'var(--adm-red)' }}>Admin</span>
          </span>
          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close admin navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>{item.icon}</span>
              <span className="nav-text" style={{ pointerEvents: 'none' }}>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem' }}>
          <button onClick={handleLogout} className="nav-item" style={{ color: '#ff4444', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={18} /></span>
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-header">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            aria-label="Open admin navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-dim)', fontSize: '0.9rem', fontWeight: '500' }}>
            <span>Admin</span>
            <ChevronRight size={14} />
            <span style={{ color: 'white' }}>{currentNavItem.label}</span>
          </div>

          <div className="search-trigger" onClick={() => setCmdOpen(true)}>
            <Search size={16} />
            <span>Search or jump to...</span>
            <span className="cmd-shortcut">Ctrl K</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button aria-label="Notifications" style={{ background: 'none', border: 'none', color: 'var(--adm-dim)', cursor: 'pointer', display: 'flex' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--adm-border)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white' }}>Admin User</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--adm-dim)' }}>{adminEmail}</div>
              </div>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="var(--adm-dim)" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="page-transition-wrap"
            >
              <Routes location={location} key={location.pathname}>
                <Route index element={<Overview />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="gigs" element={<AdminGigs />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="portfolio" element={<PortfolioManager />} />
                <Route path="pricing" element={<PricingManager />} />
                <Route path="payments" element={<PaymentVerification />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="messages" element={<MessagesList />} />
                <Route path="settings" element={<SettingsManager />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div 
            className="cmd-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCmdOpen(false)}
          >
            <motion.div 
              className="cmd-palette"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="cmd-input-wrap">
                <Search size={20} color="var(--adm-dim)" />
                <input 
                  autoFocus
                  type="text" 
                  className="cmd-input" 
                  placeholder="Search modules..."
                  value={cmdQuery}
                  onChange={e => setCmdQuery(e.target.value)}
                />
                <div className="cmd-shortcut" style={{ margin: 0 }}>ESC</div>
              </div>
              <div className="cmd-list">
                {filteredNavItems.length > 0 ? (
                  filteredNavItems.map((item, idx) => (
                    <div 
                      key={item.path} 
                      className={`cmd-item ${idx === 0 ? 'active' : ''}`}
                      onClick={() => handleCmdNavigate(item.path)}
                    >
                      <span className="cmd-icon" style={{ display: 'flex' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--adm-dim)' }}>
                    No results found for "{cmdQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
};

export default AdminDashboard;
