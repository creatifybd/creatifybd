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
  CreditCard
} from 'lucide-react';
import '../admin.css';

// Admin Sub-pages
import Overview from './admin/Overview';
import ServicesManager from './admin/Services';
import PortfolioManager from './admin/Portfolio';
import MessagesList from './admin/Messages';
import TestimonialsManager from './admin/Testimonials';
import CaseStudiesManager from './admin/CaseStudies';
import SettingsManager from './admin/Settings';
import ContentManager from './admin/ContentManager';
import PricingManager from './admin/PricingManager';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if(window.confirm("Sign out of admin panel?")) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/content', label: 'Page Content', icon: <Activity size={18} /> },
    { path: '/admin/services', label: 'Services', icon: <Briefcase size={18} /> },
    { path: '/admin/portfolio', label: 'Portfolio', icon: <ImageIcon size={18} /> },
    { path: '/admin/case-studies', label: 'Case Studies', icon: <Briefcase size={18} /> },
    { path: '/admin/pricing', label: 'Pricing Plans', icon: <CreditCard size={18} /> },
    { path: '/admin/testimonials', label: 'Testimonials', icon: <Star size={18} /> },
    { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { path: '/admin/settings', label: 'Branding & SEO', icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar - Changed nav to div to avoid global nav styling conflicts */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div style={{ width: '32px', height: '32px', background: 'var(--adm-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={16} color="white" />
          </div>
          <span className="logo-text" style={{ fontWeight: '800', fontSize: '1.2rem', color: 'white', whiteSpace: 'nowrap' }}>
            Creatify<span style={{ color: 'var(--adm-red)' }}>Admin</span>
          </span>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>{item.icon}</span>
              <span className="nav-text" style={{ pointerEvents: 'none' }}>{item.label}</span>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--adm-border)', paddingTop: '1.5rem' }}>
          <div style={{ padding: '0 0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={18} color="var(--adm-dim)" />
            </div>
            <div className="nav-text admin-profile-info" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'white' }}>Admin User</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--adm-dim)' }}>Online</div>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ color: '#ff4444', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={18} /></span>
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="case-studies" element={<CaseStudiesManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="messages" element={<MessagesList />} />
          <Route path="settings" element={<SettingsManager />} />
        </Routes>
      </main>

    </div>
  );
};

export default AdminDashboard;
