import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Globe, Phone, Mail, ExternalLink, 
  Sparkles, MessageCircle, Send, CheckCircle2, Clock, 
  Building2, MapPin, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, Copy, FileText, Check, ShieldAlert, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeLeadBusiness } from '../../utils/geminiRotator';

const STATUS_OPTIONS = [
  { id: 'New', label: 'New Lead', color: '#64748B', bg: '#F1F5F9' },
  { id: 'Audited', label: 'AI Audited', color: '#8B5CF6', bg: '#F3E8FF' },
  { id: 'Contacted', label: 'Contacted', color: '#0EA5E9', bg: '#E0F2FE' },
  { id: 'Replied', label: 'Replied', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'Proposal Sent', label: 'Proposal Sent', color: '#6366F1', bg: '#EEF2FF' },
  { id: 'Closed Won', label: 'Closed Won ($)', color: '#10B981', bg: '#D1FAE5' },
  { id: 'Not Interested', label: 'Not Interested', color: '#EF4444', bg: '#FEE2E2' }
];

const ITEMS_PER_PAGE = 25;
const HARDCODED_CHUNKS = ['leads_1.json', 'leads_2.json', 'leads_3.json', 'leads_4.json', 'leads_5.json'];

const LeadCRM = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedChunkCount, setLoadedChunkCount] = useState(0);
  const [error, setError] = useState('');
  
  // Local storage lead status & audits tracker
  const [leadStatuses, setLeadStatuses] = useState(() => {
    try {
      const saved = localStorage.getItem('creatify_lead_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [leadAudits, setLeadAudits] = useState(() => {
    try {
      const saved = localStorage.getItem('creatify_lead_audits');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Active AI Modal
  const [activeLead, setActiveLead] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeKeyNum, setActiveKeyNum] = useState(1);
  const [aiResult, setAiResult] = useState(null);
  const [editedWhatsapp, setEditedWhatsapp] = useState('');
  const [editedEmailSubject, setEditedEmailSubject] = useState('');
  const [editedEmailBody, setEditedEmailBody] = useState('');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Save statuses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('creatify_lead_statuses', JSON.stringify(leadStatuses));
    } catch (e) {
      console.error('Failed to save statuses to localStorage', e);
    }
  }, [leadStatuses]);

  // Save audits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('creatify_lead_audits', JSON.stringify(leadAudits));
    } catch (e) {
      console.error('Failed to save audits to localStorage', e);
    }
  }, [leadAudits]);

  // Progressive Chunk Loading (Instant first chunk, then append background chunks)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDataset = async () => {
      let chunksToFetch = HARDCODED_CHUNKS;
      try {
        const manifestRes = await fetch('/data/manifest.json?v=' + Date.now());
        if (manifestRes.ok) {
          const manifest = await manifestRes.json();
          if (Array.isArray(manifest.chunks) && manifest.chunks.length > 0) {
            chunksToFetch = manifest.chunks;
          }
        }
      } catch (e) {
        console.warn('Manifest fetch skipped, using default chunks');
      }

      let allAccumulated = [];
      let successCount = 0;

      for (let i = 0; i < chunksToFetch.length; i++) {
        const chunkFile = chunksToFetch[i];
        try {
          const res = await fetch(`/data/${chunkFile}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted && Array.isArray(data)) {
              allAccumulated = [...allAccumulated, ...data];
              setLeads([...allAccumulated]);
              successCount++;
              setLoadedChunkCount(successCount);
              if (i === 0) setLoading(false); // First chunk ready! Hide main spinner
            }
          }
        } catch (err) {
          console.error(`Failed loading chunk ${chunkFile}:`, err);
        }
      }

      if (isMounted) {
        setLoading(false);
        if (allAccumulated.length === 0) {
          setError('Failed to load leads dataset. Please refresh or check connection.');
        } else {
          setError('');
        }
      }
    };

    loadDataset();

    return () => { isMounted = false; };
  }, []);

  // Filter lists
  const countries = useMemo(() => {
    const set = new Set();
    leads.forEach(l => { if (l.country) set.add(l.country); });
    return Array.from(set).sort();
  }, [leads]);

  const businessTypes = useMemo(() => {
    const counts = {};
    leads.forEach(l => {
      if (l.type) counts[l.type] = (counts[l.type] || 0) + 1;
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(item => {
      const currentStatus = leadStatuses[item.id] || 'New';

      // Status filter
      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;

      // Country filter
      if (selectedCountry !== 'all' && item.country !== selectedCountry) return false;

      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      // Contact filter
      if (contactFilter === 'whatsapp' && !item.whatsapp_url && !item.phone_e164) return false;
      if (contactFilter === 'email' && !item.email) return false;
      if (contactFilter === 'website' && !item.website) return false;

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = (item.business_name || '').toLowerCase().includes(q);
        const matchCity = (item.city || '').toLowerCase().includes(q);
        const matchState = (item.state || '').toLowerCase().includes(q);
        const matchPhone = (item.phone || '').toLowerCase().includes(q);
        const matchEmail = (item.email || '').toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchState && !matchPhone && !matchEmail) {
          return false;
        }
      }

      return true;
    });
  }, [leads, searchTerm, selectedCountry, selectedType, contactFilter, statusFilter, leadStatuses]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeadStatuses(prev => ({ ...prev, [leadId]: newStatus }));
  };

  // Open AI Study Modal
  const openStudyModal = (lead) => {
    setActiveLead(lead);
    const existingAudit = leadAudits[lead.id];
    if (existingAudit) {
      setAiResult(existingAudit);
      setEditedWhatsapp(existingAudit.whatsappMessage || '');
      setEditedEmailSubject(existingAudit.emailSubject || '');
      setEditedEmailBody(existingAudit.emailBody || '');
    } else {
      setAiResult(null);
      setEditedWhatsapp('');
      setEditedEmailSubject('');
      setEditedEmailBody('');
    }
  };

  // Run AI Business Study
  const runAiStudy = async () => {
    if (!activeLead) return;
    setAnalyzing(true);
    try {
      const res = await analyzeLeadBusiness(activeLead, (keyNum) => {
        setActiveKeyNum(keyNum);
      });
      setActiveKeyNum(res.keyUsed || 1);
      setAiResult(res);
      setEditedWhatsapp(res.whatsappMessage || '');
      setEditedEmailSubject(res.emailSubject || '');
      setEditedEmailBody(res.emailBody || '');

      // Save audit
      setLeadAudits(prev => ({ ...prev, [activeLead.id]: res }));
      // Update status to Audited if still New
      if ((leadStatuses[activeLead.id] || 'New') === 'New') {
        updateLeadStatus(activeLead.id, 'Audited');
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      alert(err.message || 'AI Business Study failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // WhatsApp Trigger
  const handleSendWhatsApp = () => {
    if (!activeLead) return;
    const phone = activeLead.phone_e164 || activeLead.phone || '';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(editedWhatsapp);
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodedText}` 
      : activeLead.whatsapp_url 
        ? `${activeLead.whatsapp_url}&text=${encodedText}` 
        : `https://wa.me/?text=${encodedText}`;

    window.open(waUrl, '_blank');
    updateLeadStatus(activeLead.id, 'Contacted');
  };

  // Email Trigger
  const handleSendEmail = () => {
    if (!activeLead) return;
    const email = activeLead.email || '';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(editedEmailSubject)}&body=${encodeURIComponent(editedEmailBody)}`;
    window.location.href = mailtoUrl;
    updateLeadStatus(activeLead.id, 'Contacted');
  };

  // Copy helpers
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'wa') {
      setCopiedWhatsapp(true);
      setTimeout(() => setCopiedWhatsapp(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#E8192C' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A' }}>Loading International Leads Dataset...</h3>
        <p style={{ fontSize: '0.9rem' }}>Streaming 51,090 verified leads progressively...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#E8192C', padding: '0.45rem', borderRadius: '10px', color: '#fff', display: 'flex' }}>
              <Users size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Lead CRM &amp; AI Outreach Engine
              </h1>
              <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                Manage 51,090 international leads &bull; Multi-Key Gemini AI Deep Business Study &bull; WhatsApp &amp; Email Automation
              </p>
            </div>
          </div>
        </div>

        {/* API Key Rotation & Load Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {loadedChunkCount < 5 && (
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700', color: '#92400E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} className="animate-spin" /> Loading Chunks: {loadedChunkCount}/5 ({leads.length.toLocaleString()} leads)
            </div>
          )}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', 
            background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 1rem', borderRadius: '12px' 
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
              Gemini Rotator: <strong style={{ color: '#E8192C' }}>11 API Keys Active</strong> (Auto Switch)
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {error}
        </div>
      )}

      {/* ── METRICS SUMMARY CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Loaded Leads</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', margin: '0.2rem 0 0' }}>{leads.length.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: '600' }}>100% Validated Leads</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Filtered Match</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#E8192C', margin: '0.2rem 0 0' }}>{filteredLeads.length.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Ready for Outreach</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>WhatsApp Direct</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#16A34A', margin: '0.2rem 0 0' }}>
            {leads.filter(l => l.whatsapp_url || l.phone_e164).length.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: '600' }}>88.8% Contactable</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Email Available</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2563EB', margin: '0.2rem 0 0' }}>
            {leads.filter(l => l.email).length.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '600' }}>46.2% Verified Email</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Contacted / Audited</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8B5CF6', margin: '0.2rem 0 0' }}>
            {Object.keys(leadStatuses).filter(k => leadStatuses[k] !== 'New').length.toLocaleString()}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: '600' }}>In Pipeline</span>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div style={{ 
        background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.2rem', 
        marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search business name, city, phone, email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{
              width: '100%', padding: '0.65rem 1rem 0.65rem 2.4rem', border: '1px solid #CBD5E1', 
              borderRadius: '10px', fontSize: '0.88rem', outline: 'none', background: '#F8FAFC'
            }}
          />
        </div>

        {/* Country Filter */}
        <select
          value={selectedCountry}
          onChange={handleFilterChange(setSelectedCountry)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', outline: 'none', fontWeight: '600' }}
        >
          <option value="all">🌐 All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Niche / Type Filter */}
        <select
          value={selectedType}
          onChange={handleFilterChange(setSelectedType)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', outline: 'none', fontWeight: '600' }}
        >
          <option value="all">🏢 All Niches / Types</option>
          {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Contact Channel Filter */}
        <select
          value={contactFilter}
          onChange={handleFilterChange(setContactFilter)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', outline: 'none', fontWeight: '600' }}
        >
          <option value="all">📞 All Contact Methods</option>
          <option value="whatsapp">💬 Has WhatsApp</option>
          <option value="email">✉️ Has Email</option>
          <option value="website">🌐 Has Website</option>
        </select>

        {/* Pipeline Status Filter */}
        <select
          value={statusFilter}
          onChange={handleFilterChange(setStatusFilter)}
          style={{ padding: '0.65rem 1rem', border: '1px solid #CBD5E1', borderRadius: '10px', fontSize: '0.85rem', background: '#fff', outline: 'none', fontWeight: '600' }}
        >
          <option value="all">📊 All Pipeline Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>

        {/* Reset Filters Button */}
        {(searchTerm || selectedCountry !== 'all' || selectedType !== 'all' || contactFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm(''); setSelectedCountry('all'); setSelectedType('all'); 
              setContactFilter('all'); setStatusFilter('all'); setCurrentPage(1);
            }}
            style={{ padding: '0.65rem 1rem', background: '#F1F5F9', border: 'none', borderRadius: '10px', fontSize: '0.82rem', fontWeight: '700', color: '#475569', cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ── LEADS TABLE ── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.9rem 1.2rem' }}>Business Name</th>
                <th style={{ padding: '0.9rem 1rem' }}>Niche / Category</th>
                <th style={{ padding: '0.9rem 1rem' }}>Location</th>
                <th style={{ padding: '0.9rem 1rem' }}>Contact Info</th>
                <th style={{ padding: '0.9rem 1rem' }}>Pipeline Status</th>
                <th style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}>AI Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    <Users size={32} style={{ margin: '0 auto 0.5rem', color: '#CBD5E1' }} />
                    <p style={{ margin: 0, fontWeight: '600' }}>No leads matching your current filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((item, idx) => {
                  const currentStatus = leadStatuses[item.id] || 'New';
                  const statusOpt = STATUS_OPTIONS.find(s => s.id === currentStatus) || STATUS_OPTIONS[0];
                  const hasAudit = !!leadAudits[item.id];

                  return (
                    <tr 
                      key={item.id || idx} 
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      className="lead-row-hover"
                    >
                      {/* Business Name */}
                      <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#0F172A' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>{item.business_name}</span>
                          {hasAudit && (
                            <span style={{ background: '#F3E8FF', color: '#8B5CF6', padding: '2px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Sparkles size={10} /> Audited
                            </span>
                          )}
                        </div>
                        {item.address && (
                          <span style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', fontWeight: '400', marginTop: '2px' }}>
                            {item.address.length > 45 ? item.address.substring(0, 45) + '...' : item.address}
                          </span>
                        )}
                      </td>

                      {/* Niche */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <span style={{ background: '#F1F5F9', color: '#334155', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '600' }}>
                          {item.type || 'General'}
                        </span>
                      </td>

                      {/* Location */}
                      <td style={{ padding: '1rem 1rem', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                          <MapPin size={13} color="#64748B" />
                          <span>{[item.city, item.state, item.country].filter(Boolean).join(', ')}</span>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {(item.phone_e164 || item.phone) && (
                            <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <MessageCircle size={12} /> {item.phone_e164 || item.phone}
                            </span>
                          )}
                          {item.email && (
                            <span style={{ fontSize: '0.76rem', color: '#2563EB', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} /> {item.email}
                            </span>
                          )}
                          {item.website && (
                            <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: '#64748B', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Globe size={11} /> {item.website.replace(/^https?:\/\//, '').replace(/\/$/, '')} <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Pipeline Status Dropdown */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <select
                          value={currentStatus}
                          onChange={(e) => updateLeadStatus(item.id, e.target.value)}
                          style={{
                            padding: '4px 10px', borderRadius: '20px', border: 'none',
                            fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                            color: statusOpt.color, background: statusOpt.bg, outline: 'none'
                          }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>

                      {/* AI Action */}
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                        <button
                          onClick={() => openStudyModal(item)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.55rem 1rem', background: '#E8192C', color: '#fff',
                            border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700',
                            cursor: 'pointer', boxShadow: '0 2px 8px rgba(232,25,44,0.25)',
                            transition: 'transform 0.15s, background 0.15s'
                          }}
                        >
                          <Sparkles size={14} />
                          {hasAudit ? 'View AI Study' : 'AI Deep Study'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div style={{ padding: '1rem 1.2rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '500' }}>
            Showing <strong>{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</strong> to <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}</strong> of <strong>{filteredLeads.length.toLocaleString()}</strong> leads
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              style={{
                padding: '0.4rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px',
                background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: '600'
              }}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', padding: '0 0.5rem' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              style={{
                padding: '0.4rem 0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px',
                background: '#fff', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', fontWeight: '600'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── AI BUSINESS STUDY MODAL ── */}
      <AnimatePresence>
        {activeLead && (
          <div 
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.6)', 
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
            }}
            onClick={(e) => e.target === e.currentTarget && setActiveLead(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#fff', width: '100%', maxWidth: '850px', maxHeight: '90vh', 
                borderRadius: '20px', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1.25rem 1.5rem', background: '#0F172A', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={20} color="#E8192C" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
                      AI Business Audit &amp; Outreach Generator
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      Target: {activeLead.business_name} &bull; {activeLead.city}, {activeLead.country}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', color: '#CBD5E1', fontWeight: '600' }}>
                    Gemini Key #{activeKeyNum} Active
                  </span>
                  <button 
                    onClick={() => setActiveLead(null)}
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', flex: 1 }}>
                
                {/* Lead Summary Info Card */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Niche</span>
                    <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#0F172A', fontSize: '0.88rem' }}>{activeLead.type || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Phone / WhatsApp</span>
                    <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#16A34A', fontSize: '0.88rem' }}>{activeLead.phone_e164 || activeLead.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Email</span>
                    <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#2563EB', fontSize: '0.88rem' }}>{activeLead.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Website</span>
                    {activeLead.website ? (
                      <a href={activeLead.website.startsWith('http') ? activeLead.website : `https://${activeLead.website}`} target="_blank" rel="noreferrer" style={{ display: 'block', margin: '2px 0 0', fontWeight: '700', color: '#E8192C', fontSize: '0.85rem', textDecoration: 'none' }}>
                        Visit Site &rarr;
                      </a>
                    ) : <p style={{ margin: '2px 0 0', color: '#94A3B8', fontSize: '0.85rem' }}>No Website</p>}
                  </div>
                </div>

                {/* AI Action Trigger Button */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <button
                    disabled={analyzing}
                    onClick={runAiStudy}
                    style={{
                      padding: '0.85rem 2rem', background: analyzing ? '#94A3B8' : 'linear-gradient(135deg, #E8192C, #991B1B)',
                      color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '800',
                      cursor: analyzing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(232,25,44,0.3)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.15s'
                    }}
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        AI is Studying Business &amp; Rotating Keys...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        {aiResult ? 'Re-run AI Deep Study' : 'Run AI Deep Business Study & Generate Messages'}
                      </>
                    )}
                  </button>
                </div>

                {/* AI Output Section */}
                {aiResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Strengths & Lackings Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      
                      {/* Strengths */}
                      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#166534', fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Award size={16} /> Business Strengths
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#15803D' }}>
                          {aiResult.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
                        </ul>
                      </div>

                      {/* Lackings / Growth Opportunities */}
                      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#991B1B', fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldAlert size={16} /> Identified Lackings &amp; Opportunities
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#B91C1C' }}>
                          {aiResult.lackings?.map((l, i) => <li key={i} style={{ marginBottom: '4px' }}>{l}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* WhatsApp Message Editor */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <h4 style={{ margin: 0, color: '#16A34A', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MessageCircle size={16} /> Customized WhatsApp Message
                        </h4>
                        <button
                          onClick={() => copyToClipboard(editedWhatsapp, 'wa')}
                          style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedWhatsapp ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                          {copiedWhatsapp ? 'Copied!' : 'Copy Text'}
                        </button>
                      </div>

                      <textarea
                        rows={6}
                        value={editedWhatsapp}
                        onChange={(e) => setEditedWhatsapp(e.target.value)}
                        style={{
                          width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1',
                          fontSize: '0.85rem', fontFamily: 'sans-serif', outline: 'none', lineHeight: '1.5', background: '#fff'
                        }}
                      />

                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={handleSendWhatsApp}
                          style={{
                            padding: '0.65rem 1.4rem', background: '#16A34A', color: '#fff', border: 'none',
                            borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
                          }}
                        >
                          <Send size={15} /> Send via WhatsApp Now
                        </button>
                      </div>
                    </div>

                    {/* Email Proposal Editor */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '14px', padding: '1.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <h4 style={{ margin: 0, color: '#2563EB', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Mail size={16} /> Customized Email Proposal
                        </h4>
                        <button
                          onClick={() => copyToClipboard(`Subject: ${editedEmailSubject}\n\n${editedEmailBody}`, 'email')}
                          style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          {copiedEmail ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                          {copiedEmail ? 'Copied!' : 'Copy Full Email'}
                        </button>
                      </div>

                      {/* Email Subject */}
                      <div style={{ marginBottom: '0.6rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Subject Line:</label>
                        <input
                          type="text"
                          value={editedEmailSubject}
                          onChange={(e) => setEditedEmailSubject(e.target.value)}
                          style={{
                            width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1',
                            fontSize: '0.85rem', fontWeight: '600', outline: 'none', background: '#fff'
                          }}
                        />
                      </div>

                      {/* Email Body */}
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Body Content:</label>
                        <textarea
                          rows={8}
                          value={editedEmailBody}
                          onChange={(e) => setEditedEmailBody(e.target.value)}
                          style={{
                            width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1',
                            fontSize: '0.85rem', fontFamily: 'sans-serif', outline: 'none', lineHeight: '1.5', background: '#fff'
                          }}
                        />
                      </div>

                      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={handleSendEmail}
                          style={{
                            padding: '0.65rem 1.4rem', background: '#2563EB', color: '#fff', border: 'none',
                            borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                          }}
                        >
                          <Mail size={15} /> Send via Email App
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .lead-row-hover:hover {
          background: #F8FAFC !important;
        }
      `}</style>
    </div>
  );
};

export default LeadCRM;
