import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs, getCountFromServer, addDoc, doc, setDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { MessageSquare, Briefcase, Image as ImageIcon, Star, TrendingUp, Sparkles, Zap, Globe, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const Overview = () => {
  const confirm = useConfirm();
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

  const toggleLanguage = async (newLang) => {
    if (newLang === lang) return;
    try {
      await setDoc(doc(db, 'settings', 'site'), { lang: newLang }, { merge: true });
      setLang(newLang);
    } catch (err) { 
      console.error(err);
      toast.error('Failed to update language'); 
    }
  };

  const seedDemoData = async () => {
    const ok = await confirm({
      title: 'Seed demo data?',
      description: 'This will add sample services, portfolio items, reviews, and pricing plans to your website.',
      confirmLabel: 'Seed Data'
    });
    if (!ok) return;
    
    try {
      // Seed Services
      const services = [
        { 
          icon: '📱', 
          title: 'Social Media Management', 
          title_bn: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
          desc: 'Facebook & Instagram setup, content creation, community management, and follower growth.', 
          desc_bn: 'আপনার ব্যবসার ভ্যালু বাড়াতে আমরা করছি প্রফেশনাল সোশ্যাল মিডিয়া ম্যানেজমেন্ট এবং কন্টেন্ট ক্রিয়েশন।',
          price: 'From ৳1,500', bg: 's1', hidden: false 
        },
        { 
          icon: '🎨', 
          title: 'Branding & Logo Design', 
          title_bn: 'ব্র্যান্ডিং ও লোগো ডিজাইন',
          desc: 'Impactful logos and branding materials with unlimited revisions and brand guidelines.', 
          desc_bn: 'আপনার ব্যবসার জন্য একটি ইউনিক আইডেন্টিটি বা লোগো তৈরি করুন যা সবার নজর কাড়বে।',
          price: 'From ৳1,000', bg: 's2', hidden: false 
        },
        { 
          icon: '📸', 
          title: 'Product Photography', 
          title_bn: 'প্রোডাক্ট ফটোগ্রাফি',
          desc: 'Professional studio, lifestyle, and white background shots for your products.', 
          desc_bn: 'আপনার পণ্যের সেরা লুক ফুটিয়ে তুলতে আমরা দিচ্ছি প্রফেশনাল স্টুডিও ও লাইফস্টাইল ফটোগ্রাফি।',
          price: 'From ৳1,500', bg: 's3', hidden: false 
        },
        { 
          icon: '🎬', 
          title: 'Video Production', 
          title_bn: 'ভিডিও প্রোডাকশন',
          desc: '15 to 60-second cinematic brand videos with voice-over and licensed soundtracks.', 
          desc_bn: 'সিনেমাটিক ব্র্যান্ড ভিডিওর মাধ্যমে আপনার ব্যবসার গল্পটি পৌঁছে দিন সবার কাছে।',
          price: 'From ৳2,000', bg: 's4', hidden: false 
        },
        { 
          icon: '💻', 
          title: 'Website Design & Dev', 
          title_bn: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
          desc: 'Responsive, SEO-optimized WordPress websites from single-page to full e-commerce.', 
          desc_bn: 'একটি আধুনিক ও দ্রুতগতির ওয়েবসাইট যা আপনার ব্যবসাকে নিয়ে যাবে অন্য এক উচ্চতায়।',
          price: 'From ৳8,000', bg: 's5', hidden: false 
        }
      ];
      for (const s of services) await addDoc(collection(db, 'services'), s);

      // Seed Portfolio
      const portfolio = [
        { 
          title: 'Nova Fashion Branding', 
          title_bn: 'নোভা ফ্যাশনের ব্র্যান্ডিং সলিউশন',
          category: 'Branding', 
          category_bn: 'ব্র্যান্ডিং',
          imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800', 
          hidden: false 
        },
        { 
          title: 'Organic Food Website', 
          title_bn: 'অর্গানিক ফুড ই-কমার্স ওয়েবসাইট',
          category: 'Web Dev', 
          category_bn: 'ওয়েব ডেভেলপমেন্ট',
          imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', 
          hidden: false 
        }
      ];
      for (const p of portfolio) await addDoc(collection(db, 'portfolio'), p);

      // Seed Testimonials
      const testimonials = [
        { name: 'Rahim Uddin', role: 'CEO, Nova Fashion', role_bn: 'সিইও, নোভা ফ্যাশন', text: 'CreatifyBD transformed our online presence. Highly recommended!', text_bn: 'ক্রিয়েটিফাইবিডির সাথে কাজ করে আমাদের ব্যবসার ভ্যালু অনেক বেড়েছে। তাদের সার্ভিস সত্যিই অসাধারণ!', stars: 5, hidden: false },
        { name: 'Sumaiya Ahmed', role: 'Founder, Green Eats', role_bn: 'ফাউন্ডার, গ্রিন ইটস', text: 'Amazing branding work. They understood our vision perfectly.', text_bn: 'খুবই চমৎকার ব্র্যান্ডিং! তারা আমাদের আইডিয়াকে খুব সুন্দরভাবে ফুটিয়ে তুলেছে।', stars: 5, hidden: false }
      ];
      for (const t of testimonials) await addDoc(collection(db, 'testimonials'), t);

      // Seed Pricing
      const pricing = [
        { 
          category: 'social', tier: 'Basic', tier_bn: 'বেসিক',
          price: '1,500', 
          desc: 'Perfect for getting started online', 
          desc_bn: 'অনলাইনে ব্যবসার নতুন যাত্রার জন্য উপযুক্ত',
          features: ['Facebook page setup', 'Instagram page setup', 'Basic design'], 
          features_bn: ['ফেসবুক পেজ সেটআপ', 'ইনস্টাগ্রাম পেজ সেটআপ', 'বেসিক গ্রাফিক ডিজাইন'],
          order: 1, hidden: false 
        },
        { 
          category: 'social', tier: 'Standard', tier_bn: 'স্ট্যান্ডার্ড',
          price: '3,000', 
          desc: 'Best for growing businesses', 
          desc_bn: 'বর্ধিষ্ণু ব্যবসার জন্য আমাদের সেরা সলিউশন',
          features: ['Full social setup', 'Logo design', '1-week scheduling'], 
          features_bn: ['ফুল সোশ্যাল মিডিয়া সেটআপ', 'লোগো ডিজাইন অন্তর্ভুক্ত', '১ সপ্তাহের কন্টেন্ট শিডিউলিং'],
          order: 2, featured: true, hidden: false 
        }
      ];
      for (const pr of pricing) await addDoc(collection(db, 'pricing'), pr);

      // Seed Settings
      await setDoc(doc(db, 'settings', 'site'), {
        site_name: 'CreatifyBD',
        site_title: 'Digital Marketing & Creative Agency in Dhaka',
        primary_color: '#E8192C',
        secondary_color: '#a8101e',
        lang: 'en'
      }, { merge: true });

      await setDoc(doc(db, 'settings', 'content'), {
        hero: {
          theme: 'light',
          eyebrow: 'BD BASED IN DHAKA, BANGLADESH',
          title: 'Your Creative Partner for Digital <span class="wavy-text">Growth</span>',
          desc: 'Affordable, high-quality digital marketing for startups & small businesses.',
          cta1: 'Start a Project',
          cta2: 'See Our Work'
        },
        process: { theme: 'light' },
        contact: { theme: 'light' }
      }, { merge: true });

      toast.success('Demo data seeded successfully! All sections and settings are now live.');
      window.location.reload();
    } catch (err) { 
      console.error(err);
      toast.error('Seeding failed: ' + err.message); 
    }
  };

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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'var(--adm-card)', padding: '0.4rem', borderRadius: '12px', display: 'flex', border: '1px solid var(--adm-border)' }}>
            <button 
              onClick={() => toggleLanguage('en')}
              style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px', 
                border: 'none', 
                background: lang === 'en' ? 'var(--adm-red)' : 'transparent', 
                color: '#fff', 
                cursor: 'pointer', 
                fontSize: '0.75rem', 
                fontWeight: '800',
                transition: 'all 0.2s ease'
              }}
            >
              EN
            </button>
            <button 
              onClick={() => toggleLanguage('bn')}
              style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px', 
                border: 'none', 
                background: lang === 'bn' ? 'var(--adm-red)' : 'transparent', 
                color: '#fff', 
                cursor: 'pointer', 
                fontSize: '0.75rem', 
                fontWeight: '800',
                transition: 'all 0.2s ease'
              }}
            >
              BN
            </button>
          </div>
          <button className="admin-btn" onClick={seedDemoData} style={{ background: 'var(--adm-soft)', color: 'var(--adm-txt)', border: '1px solid var(--adm-border)' }}>
            Seed Demo Data
          </button>
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
          className="action-widget"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles size={40} style={{ marginBottom: '1.5rem', color: 'var(--adm-red)' }} />
          <h3 style={{ fontWeight: '800', fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--adm-text)' }}>Quick Actions</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--adm-dim)', marginBottom: '2rem' }}>
            Keep your agency profile active to rank higher on Google. Consider adding your latest successful project.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link to="/admin/portfolio" className="admin-btn" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ImageIcon size={16} /> Add Portfolio Item
            </Link>
            <Link to="/admin/services" className="admin-btn-secondary" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} /> Update Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
