import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  Image as ImageIcon,
  Users,
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
  MessageCircle,
  FolderOpen,
  UserCog,
  History,
  Check,
  ChevronDown,
  Info,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import '../admin.css';

// Admin Sub-pages
import Overview from './admin/Overview';
import ServicesManager from './admin/Services';
import PortfolioManager from './admin/Portfolio';
import TeamManager from './admin/TeamManager';
import MessagesList from './admin/Messages';
import TestimonialsManager from './admin/Testimonials';
import SettingsManager from './admin/Settings';
import ContentManager from './admin/ContentManager';
import PricingManager from './admin/PricingManager';
import PaymentVerification from './admin/PaymentVerification';
import AdminOrders from './admin/AdminOrders';
import AdminReviews from './admin/AdminReviews';
import MediaLibrary from './admin/MediaLibrary';
import AdminUsers from './admin/AdminUsers';
import ActivityLog from './admin/ActivityLog';
import LeadCRM from './admin/LeadCRM';
import AIKeysManager from './admin/AIKeysManager';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isOwner } = useAuth();
  const confirmDialog = useConfirm();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Real-time notifications listener
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(msgs);
      setUnreadCount(msgs.filter(m => !m.read).length);
    });
    return () => unsub();
  }, []);

  // Update current date/time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live visitor count
  useEffect(() => {
    const updateVisitorCount = () => {
      // Mock data - in production, this would come from analytics
      const baseCount = 15;
      const variation = Math.floor(Math.random() * 8);
      setVisitorCount(baseCount + variation);
    };
    updateVisitorCount();
    const interval = setInterval(updateVisitorCount, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, 'messages', notifId), { read: true });
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const updates = notifications.filter(n => !n.read).map(n => 
        updateDoc(doc(db, 'messages', n.id), { read: true })
      );
      await Promise.all(updates);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleLogout = async () => {
    const ok = await confirmDialog({
      title: 'Sign out?',
      description: 'You will need to log in again to access the admin panel.',
      confirmLabel: 'Sign Out',
      tone: 'warning'
    });
    if (ok) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} />, group: 'main' },
    { path: '/admin/leads', label: 'Lead CRM', icon: <Users size={18} />, group: 'main' },
    {path: '/admin/orders', label: 'Orders', icon: <ClipboardList size={18} />, badge: true, group: 'sales'},
    {path: '/admin/reviews', label: 'Reviews', icon: <MessageCircle size={18} />, group: 'sales'},
    { path: '/admin/payments', label: 'Payments', icon: <CreditCard size={18} />, group: 'sales' },
    { path: '/admin/content', label: 'Page Content', icon: <Activity size={18} />, group: 'content' },
    { path: '/admin/services', label: 'Services', icon: <Briefcase size={18} />, group: 'content' },
    { path: '/admin/portfolio', label: 'Portfolio', icon: <ImageIcon size={18} />, group: 'content' },
    { path: '/admin/team', label: 'Team', icon: <Users size={18} />, group: 'content' },
    { path: '/admin/media', label: 'Media Library', icon: <FolderOpen size={18} />, group: 'content' },
    { path: '/admin/pricing', label: 'Pricing Plans', icon: <CreditCard size={18} />, group: 'content' },
    { path: '/admin/testimonials', label: 'Testimonials', icon: <Star size={18} />, group: 'content' },
    { path: '/admin/messages', label: 'Messages', icon: <MessageSquare size={18} />, group: 'communication' },
    { path: '/admin/ai-keys', label: 'AI Keys', icon: <Key size={18} />, group: 'settings' },
    { path: '/admin/settings', label: 'Branding & SEO', icon: <Settings size={18} />, group: 'settings' },
    { path: '/admin/users', label: 'Admin Users', icon: <UserCog size={18} />, ownerOnly: true, group: 'admin' },
    { path: '/admin/activity-log', label: 'Activity Log', icon: <History size={18} />, ownerOnly: true, group: 'admin' },
  ];

  const navGroups = [
    { id: 'main', label: 'Main' },
    { id: 'sales', label: 'Sales & Orders' },
    { id: 'content', label: 'Content Management' },
    { id: 'communication', label: 'Communication' },
    { id: 'settings', label: 'Settings' },
    { id: 'admin', label: 'Admin Only', ownerOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.ownerOnly || isOwner);

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

  const filteredNavItems = visibleNavItems.filter(item => item.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  const handleCmdNavigate = (path) => {
    navigate(path);
    setCmdOpen(false);
    setCmdQuery('');
  };

  const currentNavItem = navItems.find(item => item.path === location.pathname) || { label: 'Overview' };
  const adminEmail = user?.email || auth.currentUser?.email || '';
  const avatarLetter = (adminEmail || 'A').charAt(0).toUpperCase();

  return (
    <>
      <SEO title="Admin Dashboard | CreatifyBD" noIndex={true} />
      <div className="admin-layout">
      <button
        type="button"
        className={`admin-sidebar-backdrop ${sidebarOpen ? 'is-open' : ''}`}
        aria-label="Close admin navigation"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Changed nav to div to avoid global nav styling conflicts */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ width: '32px', height: '32px', background: 'var(--adm-red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Activity size={16} color="white" />
          </div>
          <span className="sidebar-brand-name">
            Creatify<span>Admin</span>
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
          {navGroups.filter(g => !g.ownerOnly || isOwner).map((group) => (
            <div key={group.id} className="sidebar-group">
              <button
                className="sidebar-group-header"
                onClick={() => toggleGroup(group.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--adm-dim)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--adm-txt)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--adm-dim)'}
              >
                <span>{group.label}</span>
                <ChevronDown 
                  size={14} 
                  style={{ 
                    transition: 'transform 0.2s',
                    transform: collapsedGroups[group.id] ? 'rotate(-90deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>
              <AnimatePresence>
                {!collapsedGroups[group.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {visibleNavItems.filter(item => item.group === group.id).map((item) => (
                      <Link 
                        key={item.path} 
                        to={item.path} 
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                        style={{ position: 'relative' }}
                        title={item.label}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>{item.icon}</span>
                        <span className="nav-text" style={{ pointerEvents: 'none' }}>{item.label}</span>
                        {item.badge && (
                          <span style={{
                            marginLeft: 'auto',
                            background: 'var(--adm-red)',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            minWidth: '18px',
                            textAlign: 'center'
                          }}>
                            3
                          </span>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{avatarLetter}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-email">{adminEmail}</div>
              <div className="sidebar-user-role">{role || 'admin'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span style={{ display: 'flex', alignItems: 'center' }}><LogOut size={18} /></span>
            <span>Sign Out</span>
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
            <span style={{ color: 'var(--adm-txt)' }}>{currentNavItem.label}</span>
          </div>

          <div className="search-trigger" onClick={() => setCmdOpen(true)}>
            <Search size={16} />
            <span>Search or jump to...</span>
            <span className="cmd-shortcut">Ctrl K</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--adm-dim)' }}>
              <span>{currentDateTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--adm-dim)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                {visitorCount} visitors
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <button 
                aria-label="Notifications" 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--adm-dim)', 
                  cursor: 'pointer', 
                  display: 'flex',
                  position: 'relative'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--adm-red)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      width: '320px',
                      background: 'var(--adm-card)',
                      border: '1px solid var(--adm-border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1000
                    }}
                  >
                    <div style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--adm-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--adm-text)' }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--adm-red)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              navigate('/admin/messages');
                              setNotifDropdownOpen(false);
                            }}
                            style={{
                              padding: '0.85rem 1rem',
                              borderBottom: '1px solid var(--adm-border)',
                              cursor: 'pointer',
                              background: !notif.read ? 'var(--adm-soft)' : 'transparent',
                              transition: 'background 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--adm-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = !notif.read ? 'var(--adm-soft)' : 'transparent'}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'var(--adm-red-soft)',
                                color: 'var(--adm-red)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                flexShrink: 0
                              }}>
                                {notif.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ 
                                  fontSize: '0.85rem', 
                                  fontWeight: !notif.read ? '700' : '500',
                                  color: 'var(--adm-text)',
                                  marginBottom: '0.15rem'
                                }}>
                                  {notif.name || 'Unknown'}
                                </div>
                                <div style={{ 
                                  fontSize: '0.75rem', 
                                  color: 'var(--adm-dim)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {notif.service || 'New inquiry'}
                                </div>
                              </div>
                              {!notif.read && (
                                <div style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: 'var(--adm-red)',
                                  flexShrink: 0,
                                  marginTop: '4px'
                                }} />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--adm-dim)' }}>
                          No notifications
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--adm-border)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--adm-txt)' }}>Admin User</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--adm-dim)' }}>{adminEmail}</div>
              </div>
              <div style={{ width: '36px', height: '36px', background: 'var(--adm-red-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="var(--adm-red)" />
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
                <Route path="gigs" element={<Navigate to="/admin" replace />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="content" element={<ContentManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="portfolio" element={<PortfolioManager />} />
                <Route path="team" element={<TeamManager />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="pricing" element={<PricingManager />} />
                <Route path="payments" element={<PaymentVerification />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="messages" element={<MessagesList />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="users" element={isOwner ? <AdminUsers /> : <Navigate to="/admin" />} />
                <Route path="activity-log" element={isOwner ? <ActivityLog /> : <Navigate to="/admin" />} />
                <Route path="leads" element={<LeadCRM />} />
                <Route path="ai-keys" element={<AIKeysManager />} />
                <Route path="bot" element={<Navigate to="/admin/leads" replace />} />
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
