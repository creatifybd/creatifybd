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

        // REAL ANALYTICS: Message chart for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const messagesQuery = query(
          collection(db, 'messages'),
          where('createdAt', '>=', sevenDaysAgo),
          orderBy('createdAt', 'asc')
        );
        const messagesSnap = await getDocs(messagesQuery);
        const allMessages = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group messages by date
        const messageCounts = {};
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          messageCounts[dateStr] = 0;
        }

        allMessages.forEach(msg => {
          if (msg.createdAt) {
            const msgDate = new Date(msg.createdAt.seconds * 1000);
            const dateStr = msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (messageCounts.hasOwnProperty(dateStr)) {
              messageCounts[dateStr]++;
            }
          }
        });

        const chartData = Object.entries(messageCounts).map(([date, count]) => ({ date, count }));
        setMessageChartData(chartData);

        // REAL ANALYTICS: Service popularity from messages
        const serviceCounts = {};
        allMessages.forEach(msg => {
          const service = msg.service || 'Not specified';
          serviceCounts[service] = (serviceCounts[service] || 0) + 1;
        });

        const serviceData = Object.entries(serviceCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        if (serviceData.length === 0) {
          setServicePopularityData([
            { name: 'No data', value: 1 }
          ]);
        } else {
          setServicePopularityData(serviceData);
        }

        // REAL ANALYTICS: Rating distribution from reviews
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        approvedReviews.forEach(review => {
          const rating = Number(review.rating) || 0;
          if (rating >= 1 && rating <= 5) {
            ratingCounts[rating]++;
          }
        });

        const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
        const ratingColors = { 5: '#22c55e', 4: '#3b82f6', 3: '#f59e0b', 2: '#ef4444', 1: '#991b1b' };
        const ratingData = Object.entries(ratingCounts)
          .map(([name, value]) => ({
            name: `${name} Stars`,
            value: totalRatings > 0 ? Math.round((value / totalRatings) * 100) : 0,
            color: ratingColors[name]
          }))
          .filter(item => item.value > 0);

        if (ratingData.length === 0) {
          setRatingDistributionData([
            { name: 'No ratings', value: 100, color: '#6b7280' }
          ]);
        } else {
          setRatingDistributionData(ratingData);
        }

        // REAL ANALYTICS: Revenue trend from orders (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const ordersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', sixMonthsAgo),
          orderBy('createdAt', 'asc')
        );
        const ordersSnap = await getDocs(ordersQuery);
        const allOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Group orders by month
        const monthlyRevenue = {};
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          monthlyRevenue[monthStr] = 0;
        }

        allOrders.forEach(order => {
          if (order.createdAt && order.totalAmount) {
            const orderDate = new Date(order.createdAt.seconds * 1000);
            const monthStr = orderDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (monthlyRevenue.hasOwnProperty(monthStr)) {
              monthlyRevenue[monthStr] += Number(order.totalAmount) || 0;
            }
          }
        });

        const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
        setRevenueData(revenueData);

        // REAL ANALYTICS: Today's summary
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Count unread messages
        const unreadMsgCount = latestMessages.filter(m => !m.read).length;

        // Count pending orders from today
        const todayOrdersQuery = query(
          collection(db, 'orders'),
          where('createdAt', '>=', today),
          where('createdAt', '<', tomorrow)
        );
        const todayOrdersSnap = await getDocs(todayOrdersQuery);
        const todayOrders = todayOrdersSnap.docs.map(doc => doc.data());
        const pendingOrdersCount = todayOrders.filter(o => o.status === 'pending' || !o.status).length;

        // Today's revenue from completed/paid orders
        const todayRev = todayOrders
          .filter(o => o.status === 'completed' || o.status === 'paid')
          .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

        // Active visitors - keep as mock for now (requires analytics integration)
        const activeVis = Math.floor(Math.random() * 20) + 10;

        // Urgent tasks - count unread messages + pending orders
        const urgentTasks = unreadMsgCount + pendingOrdersCount;

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
