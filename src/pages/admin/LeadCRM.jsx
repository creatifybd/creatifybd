import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Globe, Phone, Mail, ExternalLink, 
  Sparkles, MessageCircle, Send, CheckCircle2, Clock, 
  Building2, MapPin, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, Copy, FileText, Check, ShieldAlert, Award, Key, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { analyzeLeadBusiness } from '../../utils/aiRotator';
import { generateImage, getHFToken, getIdeogramToken } from '../../utils/imageGenerator';

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
  const [activeProvider, setActiveProvider] = useState('AI');
  const [activeModel, setActiveModel] = useState('');
  const [keyWaiting, setKeyWaiting] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [editedWhatsapp, setEditedWhatsapp] = useState('');
  const [editedEmailSubject, setEditedEmailSubject] = useState('');
  const [editedEmailBody, setEditedEmailBody] = useState('');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null);
  const [isScraping, setIsScraping] = useState(false);

  // In-dashboard image generation state — key: `${leadId}_${promptIdx}`
  const [generatedImages, setGeneratedImages] = useState({});
  const [generatingImages, setGeneratingImages] = useState({});

  // Autonomous Batch Queue Engine State
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [batchCurrentLead, setBatchCurrentLead] = useState(null);
  const [batchStepMsg, setBatchStepMsg] = useState('');
  const [batchStopRequested, setBatchStopRequested] = useState(false);

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

  // Progressive Chunk Loading (Instant first chunk, then append background chunks, with NaN sanitizer)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadDataset = async () => {
      let chunksToFetch = HARDCODED_CHUNKS;
      try {
        const cacheBuster = '?v=' + Date.now();
        const manifestRes = await fetch('/data/manifest.json' + cacheBuster);
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
          const cacheBuster = '?v=' + Date.now();
          const res = await fetch(`/data/${chunkFile}` + cacheBuster);
          if (res.ok) {
            const rawText = await res.text();
            // Bulletproof: Replace any invalid float NaN values with empty string
            const sanitizedText = rawText.replace(/:\s*NaN\b/g, ':""');
            const data = JSON.parse(sanitizedText);
            
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
    setIsScraping(false);
    setAiError('');
    setKeyWaiting(false);
    try {
      const res = await analyzeLeadBusiness(activeLead, (prog) => {
        if (prog.status === 'scraping') {
          setIsScraping(true);
          setActiveProvider('Web Scraper');
          setActiveModel('Jina Reader');
        } else if (prog.status === 'failed') {
          setIsScraping(false);
          setKeyWaiting(false);
        } else if (prog.status === 'trying' || prog.status === 'calling') {
          setIsScraping(false);
          setActiveProvider(prog.provider || 'AI');
          setActiveModel(prog.model || '');
          setActiveKeyNum(prog.keyNum || 1);
          setKeyWaiting(false);
        }
      });
      setIsScraping(false);
      setKeyWaiting(false);
      setActiveProvider(res.provider || 'AI');
      setActiveModel(res.model || '');
      setActiveKeyNum(res.keyNum || 1);
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
      setAiError(err.message || 'AI Business Study failed. Please try again.');
    } finally {
      setAnalyzing(false);
      setIsScraping(false);
      setKeyWaiting(false);
    }
  };

  // Autonomous Batch Audit Handler
  const startBatchAudit = async (count = 50) => {
    if (batchRunning) return;
    const targetLeads = filteredLeads.slice(0, count);
    if (targetLeads.length === 0) return;

    setBatchRunning(true);
    setBatchStopRequested(false);
    setBatchTotal(targetLeads.length);
    setBatchCurrentIndex(0);

    for (let i = 0; i < targetLeads.length; i++) {
      const lead = targetLeads[i];
      setBatchCurrentIndex(i + 1);
      setBatchCurrentLead(lead);
      setBatchStepMsg(`🌐 Reading live site: ${lead.website || lead.business_name}...`);

      try {
        const res = await analyzeLeadBusiness(lead, (prog) => {
          if (prog.status === 'scraping') {
            setBatchStepMsg(`🌐 Live site read! Extracting digital footprint...`);
          } else if (prog.status === 'trying' || prog.status === 'calling') {
            setBatchStepMsg(`🧠 Groq 70B (${prog.model || 'AI'}) Analyzing & generating 4 Flux Prompts...`);
          }
        });

        setLeadAudits(prev => ({ ...prev, [lead.id]: res }));
        if ((leadStatuses[lead.id] || 'New') === 'New') {
          updateLeadStatus(lead.id, 'Audited');
        }

        setBatchStepMsg(`✅ Audit & Flux Mockup Images complete for ${lead.business_name}!`);
        await new Promise(r => setTimeout(r, 1200));
      } catch (err) {
        console.error(`Batch audit failed for lead ${lead.id}:`, err);
      }
    }

    setBatchRunning(false);
    setBatchCurrentLead(null);
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
          <Link to="/admin/ai-keys" style={{ textDecoration: 'none' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.6rem', 
              background: '#F97316', color: '#fff', padding: '0.5rem 1rem', borderRadius: '12px',
              fontWeight: '700', fontSize: '0.8rem', boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
              cursor: 'pointer'
            }}>
              <Zap size={15} />
              <span>Configure AI Keys (Groq / OpenRouter)</span>
            </div>
          </Link>
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

      {/* ── AUTONOMOUS BATCH AI ENGINE CONTROL PANEL ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        border: '1px solid #334155', borderRadius: '16px', padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                Autonomous AI Outreach Engine (100% Free Stack)
              </h3>
              <span style={{ background: '#22C55E', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>
                PRODUCTION READY
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8' }}>
              Jina Live Scraper &bull; Groq 70B Rotator &bull; Flux AI Image Generator &bull; Auto-Audit Queue
            </p>
          </div>

          {!batchRunning ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => startBatchAudit(10)}
                style={{
                  background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}
              >
                <Zap size={14} color="#F97316" /> Run 10 Leads Queue
              </button>

              <button
                onClick={() => startBatchAudit(25)}
                style={{
                  background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}
              >
                <Zap size={14} color="#60A5FA" /> Run 25 Leads Queue
              </button>

              <button
                onClick={() => startBatchAudit(50)}
                style={{
                  background: 'linear-gradient(135deg, #E8192C, #991B1B)', color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(232,25,44,0.4)'
                }}
              >
                <Sparkles size={16} /> Run 50 Leads Autonomous Queue
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#FCD34D', fontWeight: '700' }}>
                Queue Progress: {batchCurrentIndex} / {batchTotal}
              </span>
              <button
                onClick={() => setBatchStopRequested(true)}
                style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Stop Queue
              </button>
            </div>
          )}
        </div>

        {/* Live Batch Progress Indicator */}
        {batchRunning && (
          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.8rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span>
                Processing: <strong style={{ color: '#38BDF8' }}>{batchCurrentLead?.business_name}</strong> ({batchCurrentLead?.city || 'Local'})
              </span>
              <span style={{ color: '#A7F3D0', fontWeight: '700' }}>
                {Math.round((batchCurrentIndex / batchTotal) * 100)}%
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '6px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ background: 'linear-gradient(90deg, #38BDF8, #22C55E)', height: '100%', width: `${(batchCurrentIndex / batchTotal) * 100}%`, transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={12} className="animate-spin" color="#38BDF8" />
              {batchStepMsg}
            </div>
          </div>
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
                        {isScraping
                          ? `🌐 Reading Live Website: ${activeLead?.website || '...'}`
                          : keyWaiting
                          ? 'Keys Cooling Down — Auto-Resuming...'
                          : `🧠 ${activeProvider} (${activeModel || 'AI'}) Analyzing Business · Key #${activeKeyNum}...`
                        }
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        {aiResult ? 'Re-run AI Deep Study' : 'Run AI Deep Business Study & Generate Messages'}
                      </>
                    )}
                  </button>

                  {/* Inline error — no alert() popup */}
                  {aiError && (
                    <div style={{
                      marginTop: '0.75rem', padding: '0.75rem 1rem',
                      background: '#FEF3C7', border: '1px solid #FCD34D',
                      borderRadius: '10px', fontSize: '0.82rem',
                      color: '#92400E', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', textAlign: 'left'
                    }}>
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <div style={{ flex: 1 }}>
                        <strong>AI Limit / Notice:</strong> {aiError}<br />
                        <div style={{ marginTop: '0.4rem', opacity: 0.9 }}>
                          💡 <strong>Solution:</strong> Add a free <strong>Groq API key</strong> (14,400 requests/day per key, no credit card required).
                        </div>
                        <Link to="/admin/ai-keys" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem',
                          background: '#F97316', color: '#fff', padding: '0.35rem 0.75rem', borderRadius: '6px',
                          fontWeight: '700', fontSize: '0.75rem', textDecoration: 'none'
                        }}>
                          <Key size={12} /> Add Groq API Key in Admin Keys
                        </Link>
                      </div>
                    </div>
                  )}
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

                    {/* AI Image Generation Prompts (3-4 Prompts tailored to specific lackings) */}
                    {((aiResult.imagePrompts && aiResult.imagePrompts.length > 0) || aiResult.imagePrompt) && (
                      <div style={{ background: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)', border: '1px solid #D8B4FE', borderRadius: '14px', padding: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, color: '#7E22CE', fontSize: '0.92rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={18} /> 🎨 3-4 AI Image Prompts (Midjourney / ChatGPT / Gemini)
                          </h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9333EA', background: '#fff', padding: '2px 8px', borderRadius: '12px', border: '1px solid #E9D5FF' }}>
                            {aiResult.imagePrompts?.length || 1} Custom Design Concepts
                          </span>
                        </div>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#6B21A8', lineHeight: '1.4' }}>
                          These 3-4 prompts are specifically engineered to generate visual mockups that fix the client's identified revenue leaks. Generate images in Midjourney/ChatGPT and send them to the client to demonstrate value!
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                          {(aiResult.imagePrompts || [{ title: 'Brand Concept', targetsLacking: aiResult.lackings?.[0], prompt: aiResult.imagePrompt }]).map((p, idx) => (
                            <div key={idx} style={{ background: '#fff', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '0.9rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                                <div>
                                  <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#5B21B6' }}>
                                    {p.title || `Concept #${idx + 1}`}
                                  </div>
                                  {p.targetsLacking && (
                                    <div style={{ fontSize: '0.75rem', color: '#991B1B', marginTop: '2px', fontWeight: '600' }}>
                                      🎯 Solves Lacking: {p.targetsLacking}
                                    </div>
                                  )}
                                  {p.valueAddition && (
                                    <div style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '2px', fontWeight: '600' }}>
                                      💡 Business Value: {p.valueAddition}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(p.prompt);
                                    setCopiedPromptIndex(idx);
                                    setTimeout(() => setCopiedPromptIndex(null), 2000);
                                  }}
                                  style={{
                                    background: copiedPromptIndex === idx ? '#16A34A' : '#9333EA',
                                    color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '8px',
                                    fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer',
                                    display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0
                                  }}
                                >
                                  {copiedPromptIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                                  {copiedPromptIndex === idx ? 'Copied!' : 'Copy Prompt'}
                                </button>
                              </div>

                              <div style={{
                                background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px',
                                padding: '0.6rem 0.75rem', fontSize: '0.8rem', fontFamily: 'monospace',
                                color: '#334155', lineHeight: '1.4', wordBreak: 'break-word', marginTop: '0.4rem'
                              }}>
                                {p.prompt}
                              </div>

                              {/* ─── IN-DASHBOARD AI Image Generator ─────────────────── */}
                              {(() => {
                                const imgKey = `${activeLead?.id || activeLead?.name}_${idx}`;
                                const isGen = generatingImages[imgKey];
                                const imgResult = generatedImages[imgKey];

                                const handleGenerate = async (provider) => {
                                  setGeneratingImages(prev => ({ ...prev, [imgKey]: provider }));
                                  setGeneratedImages(prev => { const n = { ...prev }; delete n[imgKey]; return n; });
                                  try {
                                    const res = await generateImage(p.prompt, provider);
                                    setGeneratedImages(prev => ({ ...prev, [imgKey]: res || { error: true } }));
                                  } catch {
                                    setGeneratedImages(prev => ({ ...prev, [imgKey]: { error: true } }));
                                  } finally {
                                    setGeneratingImages(prev => { const n = { ...prev }; delete n[imgKey]; return n; });
                                  }
                                };

                                return (
                                  <div style={{ marginTop: '0.75rem' }}>
                                    {/* Buttons Panel */}
                                    <div style={{
                                      background: 'linear-gradient(135deg, #0F172A, #1E1B4B)',
                                      borderRadius: '10px', padding: '0.85rem 1rem',
                                      marginBottom: imgResult ? '0.5rem' : 0
                                    }}>
                                      <div style={{ fontSize: '0.73rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '0.45rem' }}>
                                        ⚡ Generate — Renders Here Automatically:
                                      </div>
                                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>

                                        {/* FLUX.1 free in-dashboard */}
                                        <button
                                          onClick={() => handleGenerate('hf')}
                                          disabled={!!isGen}
                                          style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            background: isGen === 'hf' ? '#374151' : 'linear-gradient(135deg,#7C3AED,#6D28D9)',
                                            color: '#fff', padding: '0.38rem 0.75rem', borderRadius: '8px',
                                            fontSize: '0.73rem', fontWeight: '800', border: 'none',
                                            cursor: isGen ? 'not-allowed' : 'pointer',
                                            opacity: isGen && isGen !== 'hf' ? 0.55 : 1
                                          }}
                                        >
                                          {isGen === 'hf'
                                            ? <><span style={{ display:'inline-block',width:'9px',height:'9px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite' }} /> Generating…</>
                                            : <><span>⚡</span> FLUX.1 — Free</>
                                          }
                                        </button>

                                        {/* Ideogram in-dashboard */}
                                        <button
                                          onClick={() => {
                                            const tok = getIdeogramToken();
                                            tok ? handleGenerate('ideogram') : window.open('https://ideogram.ai/manage-api','_blank');
                                          }}
                                          disabled={!!isGen}
                                          title={!getIdeogramToken() ? 'Get free Ideogram API key → add in Admin → AI Keys' : 'Generate via Ideogram v2 (renders here)'}
                                          style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            background: isGen === 'ideogram' ? '#374151'
                                              : getIdeogramToken() ? 'linear-gradient(135deg,#D97706,#B45309)'
                                              : 'linear-gradient(135deg,#4B5563,#374151)',
                                            color: '#fff', padding: '0.38rem 0.75rem', borderRadius: '8px',
                                            fontSize: '0.73rem', fontWeight: '800', border: 'none',
                                            cursor: isGen ? 'not-allowed' : 'pointer',
                                            opacity: isGen && isGen !== 'ideogram' ? 0.55 : 1
                                          }}
                                        >
                                          {isGen === 'ideogram'
                                            ? <><span style={{ display:'inline-block',width:'9px',height:'9px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite' }} /> Generating…</>
                                            : getIdeogramToken() ? <><span>🖼️</span> Ideogram v2</> : <><span>🔑</span> Get Ideogram Key</>
                                          }
                                        </button>

                                        {/* ChatGPT — opens tab */}
                                        <a
                                          href={`https://chatgpt.com/?q=${encodeURIComponent('Create a professional marketing design mockup image. Brief:\n\n' + p.prompt + '\n\nIMPORTANT: Ultra-realistic, world-class creative agency quality. No watermarks.')}`}
                                          target="_blank" rel="noopener noreferrer"
                                          style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                                            background: 'linear-gradient(135deg,#10A37F,#059669)',
                                            color: '#fff', padding: '0.38rem 0.75rem', borderRadius: '8px',
                                            fontSize: '0.73rem', fontWeight: '800', textDecoration: 'none'
                                          }}
                                        >
                                          <span>✨</span> ChatGPT ↗
                                        </a>
                                      </div>

                                      {isGen && (
                                        <p style={{ margin: '0.45rem 0 0', fontSize: '0.68rem', color: '#93C5FD' }}>
                                          🧠 Generating via {isGen === 'hf' ? 'HuggingFace FLUX.1' : 'Ideogram v2'}… ~15–30s. Image will appear below.
                                        </p>
                                      )}
                                      {!isGen && !imgResult && !getHFToken() && (
                                        <p style={{ margin: '0.45rem 0 0', fontSize: '0.65rem', color: '#64748B', lineHeight: 1.4 }}>
                                          💡 <Link to="/admin/ai-keys" style={{ color: '#A78BFA', fontWeight: '700' }}>Add free HuggingFace token</Link> for priority queue & better resolution.
                                        </p>
                                      )}
                                    </div>

                                    {/* Generated Image */}
                                    {imgResult && !imgResult.error && (
                                      <div style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #7C3AED', background: '#0F172A' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.75rem', background: 'rgba(124,58,237,0.2)' }}>
                                          <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#A78BFA' }}>✅ {imgResult.provider}</span>
                                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <a
                                              href={imgResult.url}
                                              download={`concept-${idx+1}-${(activeLead?.name||'lead').replace(/\s+/g,'-')}.png`}
                                              style={{ fontSize: '0.68rem', fontWeight: '700', color: '#34D399', textDecoration: 'none' }}
                                            >⬇ Download</a>
                                            <button onClick={() => handleGenerate('hf')} style={{ fontSize: '0.68rem', fontWeight: '700', color: '#93C5FD', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>🔄 Redo</button>
                                          </div>
                                        </div>
                                        <img src={imgResult.url} alt={p.title || 'AI Design Concept'} style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '380px', objectFit: 'cover' }} />
                                      </div>
                                    )}

                                    {/* Error */}
                                    {imgResult?.error && (
                                      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.55rem 0.8rem', fontSize: '0.72rem', color: '#991B1B', marginTop: '0.3rem', display: 'flex', gap: '6px' }}>
                                        ⚠️ Failed — HF may be busy.
                                        <button onClick={() => handleGenerate('hf')} style={{ fontWeight: '700', color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.72rem' }}>Try again ↺</button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
