import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, getCountFromServer, doc, setDoc, onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { MessageSquare, Briefcase, Image as ImageIcon, Star, TrendingUp, Sparkles, Clock, CheckCircle2, Calendar, DollarSign, Users, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Overview = () => {
  const [stats, setStats] = useState({
    messages: 0,
    services: 0,
    portfolio: 0,
    testimonials: 0,
    avgRating: '—'
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('en');
  const [messageChartData, setMessageChartData] = useState([]);
  const [servicePopularityData, setServicePopularityData] = useState([]);
  const [ratingDistributionData, setRatingDistributionData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [todaySummary, setTodaySummary] = useState({
    unreadMessages: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    activeVisitors: 0,
    urgentTasks: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Use server-side count aggregation instead of downloading every
        // document just to display a number — much cheaper as collections grow.
        const [mCount, sCount, pCount, tCount] = await Promise.all([
          getCountFromServer(collection(db, 'messages')),
          getCountFromServer(collection(db, 'services')),
          getCountFromServer(collection(db, 'portfolio')),
          getCountFromServer(collection(db, 'testimonials'))
        ]);
        const rSnap = await getDocs(collection(db, 'reviews'));
        const approvedReviews = rSnap.docs.map(d => d.data()).filter(r => r.status === 'approved');
        const avgRating = approvedReviews.length
          ? (approvedReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / approvedReviews.length).toFixed(1)
          : '—';

        setStats({
          messages: mCount.data().count,
          services: sCount.data().count,
          portfolio: pCount.data().count,
          testimonials: tCount.data().count,
          avgRating
        });

        const qSnap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5)));
        const latestMessages = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentMessages(latestMessages);

        // Generate mock chart data for messages over last 7 days
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          // Mock data - in production, aggregate from actual messages
          const count = Math.floor(Math.random() * 8) + 1;
          chartData.push({ date, count });
        }
        setMessageChartData(chartData);

        // Generate mock service popularity data
        const serviceData = [
          { name: 'Social Media', value: 35 },
          { name: 'Graphic Design', value: 28 },
          { name: 'Video Editing', value: 20 },
          { name: 'Web Design', value: 12 },
          { name: 'Digital Marketing', value: 5 }
        ];
        setServicePopularityData(serviceData);

        // Generate mock rating distribution data
        const ratingData = [
          { name: '5 Stars', value: 65, color: '#22c55e' },
          { name: '4 Stars', value: 25, color: '#3b82f6' },
          { name: '3 Stars', value: 7, color: '#f59e0b' },
          { name: '2 Stars', value: 2, color: '#ef4444' },
          { name: '1 Star', value: 1, color: '#991b1b' }
        ];
        setRatingDistributionData(ratingData);

        // Generate mock revenue trend data
        const revenue = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
          const amount = Math.floor(Math.random() * 50000) + 20000;
          revenue.push({ month: monthStr, revenue: amount });
        }
        setRevenueData(revenue);

        // Calculate today's summary
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count unread messages
        const unreadMsgCount = latestMessages.filter(m => !m.read).length;

        // Count pending orders (mock data)
        const pendingOrdersCount = Math.floor(Math.random() * 5);

        // Today's revenue (mock data)
        const todayRev = Math.floor(Math.random() * 5000) + 1000;

        // Active visitors (mock data)
        const activeVis = Math.floor(Math.random() * 20) + 10;

        // Urgent tasks (mock data)
        const urgentTasks = Math.floor(Math.random() * 3);

        setTodaySummary({
          unreadMessages: unreadMsgCount,
          pendingOrders: pendingOrdersCount,
          todayRevenue: todayRev,
          activeVisitors: activeVis,
          urgentTasks: urgentTasks
        });
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();

    const unsub = onSnapshot(doc(db, 'settings', 'site'), (docSnap) => {
      if (docSnap.exists()) setLang(docSnap.data().lang || 'en');
    });
    return () => unsub();
  }, []);

  const statCards = [
    { label: 'Total Inquiries', value: stats.messages, icon: <MessageSquare />, color: '#E8192C' },
    { label: 'Portfolio Items', value: stats.portfolio, icon: <ImageIcon />, color: '#8b5cf6' },
    { label: 'Client Reviews', value: stats.testimonials, icon: <Star />, color: '#f59e0b' },
    { label: 'Avg. Review Rating', value: stats.avgRating, icon: <TrendingUp />, color: '#22c55e' },
    { label: 'Active Services', value: stats.services, icon: <Briefcase />, color: '#3b82f6' },
  ];

  if (loading) return <div style={{ padding: '2rem', color: 'var(--adm-text)' }}>Loading statistics...</div>;

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.95rem' }}>Welcome back, Admin! Control your agency's presence from here.</p>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((card, i) => (
          <motion.div 
            key={i} 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="stat-icon" style={{ background: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>{card.label}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.25rem' }}>{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} color="var(--adm-red)" /> Recent Inquiries</h3>
            <Link to="/admin/messages" style={{ color: 'var(--adm-red)', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}>View All</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Interested In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.map((msg) => (
                <tr key={msg.id}>
                  <td style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--adm-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--adm-dim)' }}>
                      {msg.name?.charAt(0).toUpperCase()}
                    </div>
                    {msg.name}
                  </td>
                  <td style={{ color: 'var(--adm-dim)' }}>{msg.service || 'Not specified'}</td>
                  <td>
                    <span className="badge-status badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={12} /> New Lead
                    </span>
                  </td>
                </tr>
              ))}
              {recentMessages.length === 0 && <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-dim)' }}>No recent inquiries.</td></tr>}
            </tbody>
          </table>
        </motion.div>

        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={18} color="var(--adm-red)" /> Messages (7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={messageChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'var(--adm-dim)' }}
                axisLine={{ stroke: 'var(--adm-border)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--adm-dim)' }}
                axisLine={{ stroke: 'var(--adm-border)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--adm-card)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  color: 'var(--adm-text)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#E8192C" 
                strokeWidth={2}
                dot={{ fill: '#E8192C', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} color="var(--adm-red)" /> Service Popularity
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={servicePopularityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--adm-dim)' }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 11, fill: 'var(--adm-dim)' }}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--adm-card)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  color: 'var(--adm-text)'
                }}
              />
              <Bar dataKey="value" fill="#E8192C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={16} color="var(--adm-red)" /> Rating Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={ratingDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {ratingDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--adm-card)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  color: 'var(--adm-text)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
            {ratingDistributionData.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--adm-dim)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                {item.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} color="var(--adm-red)" /> Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--adm-border)" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: 'var(--adm-dim)' }}
                axisLine={{ stroke: 'var(--adm-border)' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--adm-dim)' }}
                axisLine={{ stroke: 'var(--adm-border)' }}
                tickFormatter={(value) => `৳${(value / 1000)}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--adm-card)', 
                  border: '1px solid var(--adm-border)',
                  borderRadius: '8px',
                  color: 'var(--adm-text)'
                }}
                formatter={(value) => `৳${value.toLocaleString()}`}
              />
              <Bar dataKey="revenue" fill="#E8192C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div 
        className="action-widget"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--adm-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} color="var(--adm-red)" /> Today's Summary
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--adm-dim)', fontWeight: '600' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--adm-soft)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <MessageSquare size={20} style={{ color: 'var(--adm-red)', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--adm-text)' }}>{todaySummary.unreadMessages}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unread</div>
          </div>
          <div style={{ background: 'var(--adm-soft)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <Briefcase size={20} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--adm-text)' }}>{todaySummary.pendingOrders}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending</div>
          </div>
          <div style={{ background: 'var(--adm-soft)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <DollarSign size={20} style={{ color: '#22c55e', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--adm-text)' }}>৳{todaySummary.todayRevenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue</div>
          </div>
          <div style={{ background: 'var(--adm-soft)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <Users size={20} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--adm-text)' }}>{todaySummary.activeVisitors}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visitors</div>
          </div>
        </div>

        {todaySummary.urgentTasks > 0 && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontWeight: '700', color: 'var(--adm-text)', fontSize: '0.9rem' }}>{todaySummary.urgentTasks} Urgent Task{todaySummary.urgentTasks > 1 ? 's' : ''}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--adm-dim)' }}>Requires immediate attention</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/messages" className="admin-btn" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <MessageSquare size={16} /> View Messages
          </Link>
          <Link to="/admin/orders" className="admin-btn-secondary" style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} /> Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
