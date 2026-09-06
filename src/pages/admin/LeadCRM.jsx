import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Search, Filter, Globe, Phone, Mail, ExternalLink, 
  Sparkles, MessageCircle, Send, CheckCircle2, Clock, 
  Building2, MapPin, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, Copy, FileText, Check, ShieldAlert, Award, Key, Zap,
  Upload, Image, Trash2, Clipboard, Save, MessageSquare, StickyNote, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { analyzeLeadBusiness } from '../../utils/aiRotator';
import { 
  saveLeadRecordToFirestore, 
  fetchAllLeadRecordsFromFirestore, 
  updateLeadStatusAndRemarksInFirestore 
} from '../../firebase/leadCrmService';
import { uploadConceptImage, readImageFromClipboard } from '../../utils/imageGenerator';

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
  
  // Persistent Stores (Synced with Firestore)
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

  const [leadRemarks, setLeadRemarks] = useState({});
  const [leadSavedImages, setLeadSavedImages] = useState({});

  // Image Uploading / Pasting States
  const [isUploadingImage, setIsUploadingImage] = useState({});

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [contactFilter, setContactFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Active AI Modal State
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
  const [activeRemarks, setActiveRemarks] = useState('');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null);
  const [isScraping, setIsScraping] = useState(false);

  // Autonomous Batch Queue Engine State
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchCurrentIndex, setBatchCurrentIndex] = useState(0);
  const [batchCurrentLead, setBatchCurrentLead] = useState(null);
  const [batchStepMsg, setBatchStepMsg] = useState('');
  const [batchStopRequested, setBatchStopRequested] = useState(false);

  // Sync from Firestore on Mount (Cross-browser / Cross-device persistence)
  useEffect(() => {
    const syncFirestore = async () => {
      const dbRecords = await fetchAllLeadRecordsFromFirestore();
      if (dbRecords && Object.keys(dbRecords).length > 0) {
        setLeadAudits(prev => {
          const merged = { ...prev };
          Object.values(dbRecords).forEach(r => { if (r.audit) merged[r.leadId || r.id] = r.audit; });
          return merged;
        });

        setLeadStatuses(prev => {
          const merged = { ...prev };
          Object.values(dbRecords).forEach(r => { if (r.status) merged[r.leadId || r.id] = r.status; });
          return merged;
        });

        setLeadRemarks(prev => {
          const merged = { ...prev };
          Object.values(dbRecords).forEach(r => { if (r.remarks) merged[r.leadId || r.id] = r.remarks; });
          return merged;
        });

        setLeadSavedImages(prev => {
          const merged = { ...prev };
          Object.values(dbRecords).forEach(r => { if (r.savedImages) merged[r.leadId || r.id] = r.savedImages; });
          return merged;
        });
      }
    };
    syncFirestore();
  }, []);

  // LocalStorage Fallback Backup
  useEffect(() => {
    try {
      localStorage.setItem('creatify_lead_statuses', JSON.stringify(leadStatuses));
    } catch (e) { console.error('Failed to save leadStatuses locally', e); }
  }, [leadStatuses]);

  useEffect(() => {
    try {
      localStorage.setItem('creatify_lead_audits', JSON.stringify(leadAudits));
    } catch (e) { console.error('Failed to save leadAudits locally', e); }
  }, [leadAudits]);

  // Progressive Lead Dataset Loading
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
      } catch {
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
            const sanitizedText = rawText.replace(/:\s*NaN\b/g, ':""');
            const data = JSON.parse(sanitizedText);
            
            if (isMounted && Array.isArray(data)) {
              allAccumulated = [...allAccumulated, ...data];
              setLeads([...allAccumulated]);
              successCount++;
              setLoadedChunkCount(successCount);
              if (i === 0) setLoading(false);
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

      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
      if (selectedCountry !== 'all' && item.country !== selectedCountry) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      if (contactFilter === 'whatsapp' && !item.whatsapp_url && !item.phone_e164) return false;
      if (contactFilter === 'email' && !item.email) return false;
      if (contactFilter === 'website' && !item.website) return false;

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

  // Status & Remarks Handlers (Save to Firestore instantly)
  const updateLeadStatus = async (leadId, newStatus) => {
    setLeadStatuses(prev => ({ ...prev, [leadId]: newStatus }));
    const lead = leads.find(l => l.id === leadId) || { id: leadId };
    await updateLeadStatusAndRemarksInFirestore(lead, { status: newStatus });
  };

  const updateLeadRemarks = async (leadId, newRemarks) => {
    setLeadRemarks(prev => ({ ...prev, [leadId]: newRemarks }));
    const lead = leads.find(l => l.id === leadId) || { id: leadId };
    await updateLeadStatusAndRemarksInFirestore(lead, { remarks: newRemarks });
  };

  // Concept Image Upload & Clipboard Paste Handler
  const handleSaveConceptImage = async (lead, conceptIdx, fileOrBlobOrUrl) => {
    if (!lead) return;
    const imgKey = `${lead.id}_${conceptIdx}`;
    setIsUploadingImage(prev => ({ ...prev, [imgKey]: true }));

    try {
      let imageUrl = '';
      if (typeof fileOrBlobOrUrl === 'string') {
        imageUrl = fileOrBlobOrUrl;
      } else {
        imageUrl = await uploadConceptImage(fileOrBlobOrUrl);
      }

      const existingForLead = leadSavedImages[lead.id] || {};
      const updatedImages = { ...existingForLead, [conceptIdx]: imageUrl };

      setLeadSavedImages(prev => ({ ...prev, [lead.id]: updatedImages }));

      await updateLeadStatusAndRemarksInFirestore(lead, { savedImages: updatedImages });
    } catch (err) {
      console.error('Failed to upload concept image:', err);
      alert('Could not upload image: ' + (err.message || err));
    } finally {
      setIsUploadingImage(prev => ({ ...prev, [imgKey]: false }));
    }
  };

  const handlePasteClipboardImage = async (lead, conceptIdx) => {
    try {
      const blob = await readImageFromClipboard();
      await handleSaveConceptImage(lead, conceptIdx, blob);
    } catch (err) {
      alert(err.message || 'Clipboard paste failed. Copy an image first.');
    }
  };

  const handleRemoveConceptImage = async (lead, conceptIdx) => {
    if (!lead) return;
    const existing = { ...(leadSavedImages[lead.id] || {}) };
    delete existing[conceptIdx];
    setLeadSavedImages(prev => ({ ...prev, [lead.id]: existing }));
    await updateLeadStatusAndRemarksInFirestore(lead, { savedImages: existing });
  };

  // Open AI Study Modal
  const openStudyModal = (lead) => {
    setActiveLead(lead);
    const existingAudit = leadAudits[lead.id];
    const existingRemarks = leadRemarks[lead.id] || '';
    setActiveRemarks(existingRemarks);

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

      setLeadAudits(prev => ({ ...prev, [activeLead.id]: res }));
      const newStatus = (leadStatuses[activeLead.id] || 'New') === 'New' ? 'Audited' : (leadStatuses[activeLead.id] || 'Audited');
      setLeadStatuses(prev => ({ ...prev, [activeLead.id]: newStatus }));

      // Save to Firestore globally!
      await saveLeadRecordToFirestore(
        activeLead,
        res,
        newStatus,
        activeRemarks || leadRemarks[activeLead.id] || '',
        leadSavedImages[activeLead.id] || {}
      );
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
      if (batchStopRequested) break;
      const lead = targetLeads[i];
      setBatchCurrentIndex(i + 1);
      setBatchCurrentLead(lead);
      setBatchStepMsg(`🌐 Reading live site: ${lead.website || lead.business_name}...`);

      try {
        const res = await analyzeLeadBusiness(lead, (prog) => {
          if (prog.status === 'scraping') {
            setBatchStepMsg(`🌐 Live site read! Extracting digital footprint...`);
          } else if (prog.status === 'trying' || prog.status === 'calling') {
            setBatchStepMsg(`🧠 Groq 70B (${prog.model || 'AI'}) Analyzing & generating 4 Prompts...`);
          }
        });

        setLeadAudits(prev => ({ ...prev, [lead.id]: res }));
        const newStatus = (leadStatuses[lead.id] || 'New') === 'New' ? 'Audited' : leadStatuses[lead.id];
        setLeadStatuses(prev => ({ ...prev, [lead.id]: newStatus }));

        // Save record to Firestore so other admins see it!
        await saveLeadRecordToFirestore(lead, res, newStatus, leadRemarks[lead.id] || '', leadSavedImages[lead.id] || {});

        setBatchStepMsg(`✅ Audit complete for ${lead.business_name}!`);
        await new Promise(r => setTimeout(r, 1000));
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
                Manage 51,090 international leads &bull; Multi-Key Groq / Gemini AI Business Study &bull; ChatGPT DALL-E 3 Mockups &bull; Cloud Persistence
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
              <span>Configure AI Keys (Groq / OpenRouter / Gemini)</span>
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
          <span style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: '600' }}>100% Verified Database</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Filtered Match</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#E8192C', margin: '0.2rem 0 0' }}>{filteredLeads.length.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500' }}>Active View Selection</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Cloud Audited</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#8B5CF6', margin: '0.2rem 0 0' }}>{Object.keys(leadAudits).length.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: '600' }}>Saved in Cloud Firestore</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>Saved Mockups</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#10B981', margin: '0.2rem 0 0' }}>{Object.keys(leadSavedImages).length.toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>ChatGPT Images Saved</span>
        </div>
      </div>

      {/* ── FILTERS & SEARCH BAR ── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Search Box */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Search Lead:</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search business name, city, phone, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', borderRadius: '10px',
                  border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Pipeline Status Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Pipeline Status:</label>
            <select
              value={statusFilter}
              onChange={handleFilterChange(setStatusFilter)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
            >
              <option value="all">All Statuses ({leads.length})</option>
              {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {/* Country Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Country:</label>
            <select
              value={selectedCountry}
              onChange={handleFilterChange(setSelectedCountry)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
            >
              <option value="all">All Countries ({countries.length})</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Niche Type Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Niche / Category:</label>
            <select
              value={selectedType}
              onChange={handleFilterChange(setSelectedType)}
              style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#fff' }}
            >
              <option value="all">All Business Types ({businessTypes.length})</option>
              {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

        </div>

        {(searchTerm || selectedCountry !== 'all' || selectedType !== 'all' || contactFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => { setSearchTerm(''); setSelectedCountry('all'); setSelectedType('all'); setContactFilter('all'); setStatusFilter('all'); setCurrentPage(1); }}
            style={{ marginTop: '0.75rem', background: '#F1F5F9', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ── BATCH AI ENGINE CONTROL PANEL ── */}
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
                Autonomous AI Business Audit Engine
              </h3>
              <span style={{ background: '#22C55E', color: '#fff', fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '20px' }}>
                CLOUD SYNCED
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8' }}>
              Jina Live Reader &bull; Groq 70B Audit &bull; Auto-saves result to Firestore for all admin accounts
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
                <th style={{ padding: '0.9rem 1rem' }}>Category</th>
                <th style={{ padding: '0.9rem 1rem' }}>Location</th>
                <th style={{ padding: '0.9rem 1rem' }}>Contact</th>
                <th style={{ padding: '0.9rem 1rem' }}>Pipeline Status</th>
                <th style={{ padding: '0.9rem 1rem' }}>Internal Remarks</th>
                <th style={{ padding: '0.9rem 1.2rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    <Users size={32} style={{ margin: '0 auto 0.5rem', color: '#CBD5E1' }} />
                    <p style={{ margin: 0, fontWeight: '600' }}>No leads matching your current filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((item, idx) => {
                  const currentStatus = leadStatuses[item.id] || 'New';
                  const statusOpt = STATUS_OPTIONS.find(s => s.id === currentStatus) || STATUS_OPTIONS[0];
                  const hasAudit = !!leadAudits[item.id];
                  const savedImgs = leadSavedImages[item.id] || {};
                  const savedImgCount = Object.keys(savedImgs).length;
                  const remark = leadRemarks[item.id] || '';

                  return (
                    <tr 
                      key={item.id || idx} 
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}
                      className="lead-row-hover"
                    >
                      {/* Business Name & Badges */}
                      <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#0F172A' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span>{item.business_name}</span>
                          {hasAudit && (
                            <span style={{ background: '#F3E8FF', color: '#8B5CF6', padding: '2px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Sparkles size={10} /> Audited
                            </span>
                          )}
                          {savedImgCount > 0 && (
                            <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Image size={10} /> {savedImgCount} Mockup
                            </span>
                          )}
                        </div>
                        {item.address && (
                          <span style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', fontWeight: '400', marginTop: '2px' }}>
                            {item.address.length > 45 ? item.address.substring(0, 45) + '...' : item.address}
                          </span>
                        )}
                      </td>

                      {/* Category */}
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

                      {/* Internal Remarks Inline Input */}
                      <td style={{ padding: '1rem 1rem' }}>
                        <input
                          type="text"
                          defaultValue={remark}
                          onBlur={(e) => {
                            if (e.target.value !== remark) {
                              updateLeadRemarks(item.id, e.target.value);
                            }
                          }}
                          placeholder="Add internal note..."
                          style={{
                            width: '100%', minWidth: '130px', padding: '4px 8px', borderRadius: '6px',
                            border: '1px solid #CBD5E1', fontSize: '0.75rem', outline: 'none', background: '#F8FAFC'
                          }}
                        />
                      </td>

                      {/* Action Button */}
                      <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                        <button
                          onClick={() => openStudyModal(item)}
                          style={{
                            padding: '0.45rem 0.9rem',
                            background: hasAudit ? '#8B5CF6' : 'linear-gradient(135deg, #E8192C, #C21323)',
                            color: '#fff', border: 'none', borderRadius: '10px',
                            fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Sparkles size={13} />
                          {hasAudit ? 'View AI Study' : 'Run AI Study'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length.toLocaleString()} leads
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={14} style={{ display: 'inline' }} /> Prev
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#fff', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Next <ChevronRight size={14} style={{ display: 'inline' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── AI STUDY MODAL ── */}
      <AnimatePresence>
        {activeLead && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '960px',
                maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '1.25rem 1.5rem', background: '#0F172A', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', sticky: 'top' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={18} color="#E8192C" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
                      {activeLead.business_name}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {[activeLead.type, activeLead.city, activeLead.country].filter(Boolean).join(' • ')}
                  </span>
                </div>

                <button
                  onClick={() => setActiveLead(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '700' }}
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Lead Status & Internal Remarks Control Card */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    
                    {/* Pipeline Status Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569' }}>Pipeline Status:</span>
                      <select
                        value={leadStatuses[activeLead.id] || 'New'}
                        onChange={(e) => updateLeadStatus(activeLead.id, e.target.value)}
                        style={{
                          padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1px solid #CBD5E1',
                          fontSize: '0.8rem', fontWeight: '700', outline: 'none', background: '#fff'
                        }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} color="#22C55E" /> Auto-synced to Cloud Firestore
                    </div>
                  </div>

                  {/* Remarks Input */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '3px' }}>
                      📝 Internal Remarks / Notes (Shared with team):
                    </label>
                    <input
                      type="text"
                      value={activeRemarks}
                      onChange={(e) => {
                        setActiveRemarks(e.target.value);
                        updateLeadRemarks(activeLead.id, e.target.value);
                      }}
                      placeholder="e.g. Sent mockup on WhatsApp, client interested in website package..."
                      style={{
                        width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px',
                        border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none', background: '#fff'
                      }}
                    />
                  </div>
                </div>

                {/* AI Study Trigger Button */}
                <div>
                  <button
                    onClick={runAiStudy}
                    disabled={analyzing}
                    style={{
                      width: '100%', padding: '0.9rem',
                      background: analyzing ? '#94A3B8' : 'linear-gradient(135deg, #E8192C, #B91C1C)',
                      color: '#fff', border: 'none', borderRadius: '14px',
                      fontSize: '0.92rem', fontWeight: '800', cursor: analyzing ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(232,25,44,0.3)'
                    }}
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        {isScraping
                          ? `🌐 Reading Live Website: ${activeLead?.website || '...'}`
                          : keyWaiting
                          ? 'Keys Cooling Down — Auto-Resuming...'
                          : `🧠 ${activeProvider} (${activeModel || 'AI'}) Analyzing Business...`
                        }
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        {aiResult ? 'Re-run AI Business Audit' : 'Run AI Deep Business Audit'}
                      </>
                    )}
                  </button>

                  {aiError && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', fontSize: '0.82rem', color: '#92400E', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <div>
                        <strong>AI Limit / Notice:</strong> {aiError}<br />
                        <Link to="/admin/ai-keys" style={{ color: '#F97316', fontWeight: '700', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>
                          Add a free Groq / Gemini key in Admin Keys
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Audit Results */}
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

                      {/* Lackings */}
                      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#991B1B', fontSize: '0.88rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldAlert size={16} /> Revenue &amp; Branding Lackings
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#B91C1C' }}>
                          {aiResult.lackings?.map((l, i) => <li key={i} style={{ marginBottom: '4px' }}>{l}</li>)}
                        </ul>
                      </div>

                    </div>

                    {/* 🎨 3-4 Custom Design Prompts & ChatGPT Integration */}
                    {((aiResult.imagePrompts && aiResult.imagePrompts.length > 0) || aiResult.imagePrompt) && (
                      <div style={{ background: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)', border: '1px solid #D8B4FE', borderRadius: '14px', padding: '1.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, color: '#7E22CE', fontSize: '0.92rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Sparkles size={18} /> 🎨 Custom Visual Concepts &amp; ChatGPT Mockup Generator
                          </h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#9333EA', background: '#fff', padding: '2px 8px', borderRadius: '12px', border: '1px solid #E9D5FF' }}>
                            {aiResult.imagePrompts?.length || 1} Custom Design Concepts
                          </span>
                        </div>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#6B21A8', lineHeight: '1.4' }}>
                          Generate ultra-high quality mockups in ChatGPT (DALL-E 3). Paste or upload the generated image back here to save it forever in the cloud for your team!
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {(aiResult.imagePrompts || [{ title: 'Brand Concept', targetsLacking: aiResult.lackings?.[0], prompt: aiResult.imagePrompt }]).map((p, idx) => {
                            const savedImagesForLead = leadSavedImages[activeLead.id] || {};
                            const savedImgUrl = savedImagesForLead[idx];
                            const isUploadingThis = isUploadingImage[`${activeLead.id}_${idx}`];

                            return (
                              <div key={idx} style={{ background: '#fff', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', gap: '0.5rem' }}>
                                  <div>
                                    <div style={{ fontWeight: '800', fontSize: '0.88rem', color: '#5B21B6' }}>
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

                                {/* ── ChatGPT Button & Paste/Upload Panel ── */}
                                <div style={{ marginTop: '0.8rem', background: '#0F172A', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff' }}>
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span>✨</span> Generate &amp; Save Mockup:
                                    </div>

                                    {/* 1-Click ChatGPT Launcher */}
                                    <a
                                      href={`https://chatgpt.com/?q=${encodeURIComponent(`Create a professional marketing design mockup image based on this brief:\n\n${p.prompt}\n\nIMPORTANT: Make it look like world-class creative agency work. Ultra-realistic, photographic quality. No watermarks.`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'linear-gradient(135deg, #10A37F, #0D9373)',
                                        color: '#fff', padding: '0.4rem 0.85rem', borderRadius: '8px',
                                        fontSize: '0.75rem', fontWeight: '800', textDecoration: 'none',
                                        boxShadow: '0 2px 8px rgba(16,163,127,0.4)'
                                      }}
                                    >
                                      <span>✨</span> Open in ChatGPT (DALL-E 3) ↗
                                    </a>
                                  </div>

                                  {/* Render Saved Mockup Image */}
                                  {savedImgUrl ? (
                                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '2px solid #10B981', background: '#1E293B', marginTop: '0.5rem' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.75rem', background: 'rgba(16,185,129,0.15)' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <CheckCircle2 size={13} /> Saved Mockup Image (Cloud Synced)
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                          <a
                                            href={savedImgUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '0.72rem', fontWeight: '700', color: '#60A5FA', textDecoration: 'none' }}
                                          >
                                            ↗ Open Link
                                          </a>
                                          <button
                                            onClick={() => handleRemoveConceptImage(activeLead, idx)}
                                            style={{ fontSize: '0.72rem', fontWeight: '700', color: '#F87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                          >
                                            🗑️ Remove
                                          </button>
                                        </div>
                                      </div>
                                      <img
                                        src={savedImgUrl}
                                        alt={p.title || 'Client Mockup'}
                                        style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '350px', objectFit: 'cover' }}
                                      />
                                    </div>
                                  ) : (
                                    /* Image Paste / Upload Actions */
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                      
                                      {/* Paste from Clipboard Button */}
                                      <button
                                        onClick={() => handlePasteClipboardImage(activeLead, idx)}
                                        disabled={isUploadingThis}
                                        style={{
                                          background: '#3B82F6', color: '#fff', border: 'none',
                                          borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.75rem',
                                          fontWeight: '800', cursor: 'pointer', display: 'inline-flex',
                                          alignItems: 'center', gap: '5px', boxShadow: '0 2px 6px rgba(59,130,246,0.3)'
                                        }}
                                      >
                                        {isUploadingThis ? (
                                          <RefreshCw size={12} className="animate-spin" />
                                        ) : (
                                          <Clipboard size={13} />
                                        )}
                                        {isUploadingThis ? 'Saving Image...' : '📋 Paste Image from Clipboard'}
                                      </button>

                                      {/* File Upload Selector */}
                                      <label style={{
                                        background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px', padding: '0.45rem 0.85rem', fontSize: '0.75rem',
                                        fontWeight: '700', cursor: 'pointer', display: 'inline-flex',
                                        alignItems: 'center', gap: '5px'
                                      }}>
                                        <Upload size={13} /> Upload Image File
                                        <input
                                          type="file"
                                          accept="image/*"
                                          style={{ display: 'none' }}
                                          onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                              handleSaveConceptImage(activeLead, idx, e.target.files[0]);
                                            }
                                          }}
                                        />
                                      </label>

                                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                        Copy image in ChatGPT → Click Paste Image
                                      </span>
                                    </div>
                                  )}

                                </div>

                              </div>
                            );
                          })}
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
