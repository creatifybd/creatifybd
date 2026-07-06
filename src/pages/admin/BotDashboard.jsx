import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motion } from 'framer-motion';
import {
  Bot, Users, TrendingUp, Mail, Phone, Globe,
  RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Search, Filter, ExternalLink, Activity, Zap
} from 'lucide-react';

// ─── helpers ────────────────────────────────────────────────────────────────

async function getBotConfig() {
  try {
    const snap = await getDoc(doc(db, 'settings', 'private'));
    const data = snap.exists() ? snap.data() : {};
    return {
      url: (data.bot_api_url || '').replace(/\/$/, ''),
      token: data.bot_api_token || '',
    };
  } catch {
    return { url: '', token: '' };
  }
}

async function botFetch(path, cfg) {
  if (!cfg.url || !cfg.token) throw new Error('Bot API not configured in Firestore settings/private');
  const res = await fetch(`${cfg.url}${path}`, {
    headers: { 'X-Admin-Token': cfg.token },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const SEGMENT_COLORS = { Hot: '#ef4444', Warm: '#f59e0b', Cold: '#3b82f6' };
const SOURCE_LABELS = {
  google_maps: 'Google Maps',
  openstreetmap: 'OpenStreetMap (BD)',
  openstreetmap_usa: 'OpenStreetMap (USA)',
  data_gov_bd: 'Public Dataset',
};

// ─── sub-components ─────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon, color, sub }) => (
  <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div className="stat-icon" style={{ background: `${color}18`, color, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.72rem', color: 'var(--adm-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: 1.1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'var(--adm-dim)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  </div>
);

const SegmentBadge = ({ segment }) => {
  const color = SEGMENT_COLORS[segment] || '#6b7280';
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
      fontSize: '0.72rem', fontWeight: '700', background: `${color}18`, color,
    }}>{segment || '—'}</span>
  );
};

const StatusDot = ({ ok }) => (
  <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: ok ? '#22c55e' : '#ef4444', marginRight: 6,
  }} />
);

// ─── main component ──────────────────────────────────────────────────────────

const BotDashboard = () => {
  const [cfg, setCfg] = useState(null);
  const [summary, setSummary] = useState(null);
  const [botStatus, setBotStatus] = useState(null);
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState('bd');
  const [segment, setSegment] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  // load bot config once
  useEffect(() => {
    getBotConfig().then(setCfg);
  }, []);

  // fetch summary + bot status
  const fetchOverview = useCallback(async (config) => {
    if (!config) return;
    try {
      const [sumData, statusData] = await Promise.all([
        botFetch('/api/sheets/summary', config),
        botFetch('/lead-collection/status', config),
      ]);
      if (sumData.status === 'success') setSummary(sumData.summary);
      setBotStatus(statusData);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message);
    }
  }, []);

  // fetch leads page
  const fetchLeads = useCallback(async (config, pg, mkt, seg, srch) => {
    if (!config) return;
    setLeadsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pg, per_page: 50, market: mkt,
        ...(seg && { segment: seg }),
        ...(srch && { search: srch }),
      });
      const data = await botFetch(`/api/sheets/leads?${params}`, config);
      if (data.status === 'success') {
        setLeads(data.rows || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!cfg) return;
    setLoading(true);
    Promise.all([
      fetchOverview(cfg),
      fetchLeads(cfg, 1, market, segment, search),
    ]).finally(() => setLoading(false));
  }, [cfg]);

  useEffect(() => {
    if (!cfg) return;
    setPage(1);
    fetchLeads(cfg, 1, market, segment, search);
  }, [market, segment, search, cfg]);

  useEffect(() => {
    if (!cfg) return;
    fetchLeads(cfg, page, market, segment, search);
  }, [page]);

  // auto-refresh overview every 60s
  useEffect(() => {
    if (!cfg) return;
    const id = setInterval(() => fetchOverview(cfg), 60000);
    return () => clearInterval(id);
  }, [cfg, fetchOverview]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleRefresh = () => {
    if (!cfg) return;
    fetchOverview(cfg);
    fetchLeads(cfg, page, market, segment, search);
  };

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-dim)' }}>
      <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
      <div>Connecting to Marketing Bot...</div>
    </div>
  );

  if (!cfg?.url || !cfg?.token) return (
    <div className="admin-card" style={{ maxWidth: 520 }}>
      <AlertCircle size={32} color="#ef4444" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Bot API not configured</h2>
      <p style={{ color: 'var(--adm-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>
        Add <code>bot_api_url</code> and <code>bot_api_token</code> to Firestore at{' '}
        <strong>settings / private</strong> to connect the Marketing Bot dashboard.
      </p>
    </div>
  );

  const isRunning = botStatus?.scheduler === 'running';
  const bdLeads = summary?.bd_leads ?? 0;
  const usaLeads = summary?.usa_leads ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bot size={22} color="var(--adm-red)" /> Marketing Bot
          </h1>
          <p style={{ color: 'var(--adm-dim)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Read-only view of Google Sheets data synced by the autonomous bot.
            {lastRefresh && <span> · Last refreshed {lastRefresh.toLocaleTimeString()}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: isRunning ? '#22c55e' : '#ef4444' }}>
            <StatusDot ok={isRunning} />{isRunning ? 'Bot Running' : 'Bot Stopped'}
          </span>
          <button className="admin-btn-secondary" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '0.9rem 1.2rem', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* KPI cards */}
      {summary && (
        <div className="stat-grid">
          <KpiCard label="Total Leads" value={summary.total_leads} icon={<Users size={18} />} color="#E8192C" sub={`BD: ${bdLeads} · USA: ${usaLeads}`} />
          <KpiCard label="Hot Leads" value={summary.hot} icon={<Zap size={18} />} color="#ef4444" />
          <KpiCard label="Warm Leads" value={summary.warm} icon={<TrendingUp size={18} />} color="#f59e0b" />
          <KpiCard label="With Email" value={summary.with_email} icon={<Mail size={18} />} color="#8b5cf6" />
          <KpiCard label="WhatsApp Ready" value={summary.with_phone} icon={<Phone size={18} />} color="#22c55e" />
          <KpiCard label="With Website" value={summary.with_website} icon={<Globe size={18} />} color="#3b82f6" />
        </div>
      )}

      {/* Source breakdown */}
      {summary?.sources && Object.keys(summary.sources).length > 0 && (
        <div className="admin-card">
          <h3 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} color="var(--adm-red)" /> Lead Sources
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(summary.sources).sort((a, b) => b[1] - a[1]).map(([src, count]) => (
              <div key={src} style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '700' }}>{SOURCE_LABELS[src] || src}</span>
                <span style={{ color: 'var(--adm-dim)', marginLeft: 6 }}>{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leads table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--adm-border)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <h3 style={{ fontWeight: '700', fontSize: '1rem', flex: 1, minWidth: 120 }}>
            Leads <span style={{ color: 'var(--adm-dim)', fontWeight: '400', fontSize: '0.85rem' }}>({total.toLocaleString()} total)</span>
          </h3>

          {/* Market toggle */}
          <div style={{ display: 'flex', background: 'var(--adm-bg)', borderRadius: 8, padding: 3, gap: 2 }}>
            {[['bd', 'Bangladesh'], ['usa', 'USA']].map(([val, label]) => (
              <button key={val} onClick={() => setMarket(val)} style={{
                padding: '4px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700',
                background: market === val ? 'var(--adm-red)' : 'transparent',
                color: market === val ? '#fff' : 'var(--adm-dim)',
              }}>{label}</button>
            ))}
          </div>

          {/* Segment filter */}
          <select value={segment} onChange={e => setSegment(e.target.value)} className="admin-input" style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }}>
            <option value="">All Segments</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text" placeholder="Search name, email, phone…"
              value={searchInput} onChange={e => setSearchInput(e.target.value)}
              className="admin-input" style={{ width: 220, padding: '6px 10px', fontSize: '0.82rem' }}
            />
            <button type="submit" className="admin-btn-secondary" style={{ padding: '6px 12px' }}>
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          {leadsLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-dim)' }}>
              <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : leads.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--adm-dim)', fontSize: '0.9rem' }}>No leads found.</div>
          ) : (
            <table className="data-table" style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>Business / Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Segment</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((row, i) => {
                  const name = row.business_name || row.school_name || '—';
                  const location = row.city ? `${row.city}, ${row.state}` : (row.location || row.district || '—');
                  return (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}>
                      <td style={{ fontWeight: '600', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={name}>{name}</td>
                      <td style={{ color: 'var(--adm-dim)', fontSize: '0.82rem' }}>{row.type || '—'}</td>
                      <td style={{ color: 'var(--adm-dim)', fontSize: '0.82rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {row.email
                          ? <a href={`mailto:${row.email}`} style={{ color: 'var(--adm-red)', textDecoration: 'none' }}>{row.email}</a>
                          : <span style={{ color: 'var(--adm-dim)' }}>—</span>}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {row.whatsapp_url
                          ? <a href={row.whatsapp_url} target="_blank" rel="noreferrer" style={{ color: '#22c55e', textDecoration: 'none' }}>{row.phone || row.phone_e164}</a>
                          : <span style={{ color: 'var(--adm-dim)' }}>{row.phone || '—'}</span>}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {row.website
                          ? <a href={row.website} target="_blank" rel="noreferrer" style={{ color: 'var(--adm-red)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <ExternalLink size={12} /> Visit
                            </a>
                          : <span style={{ color: 'var(--adm-dim)' }}>—</span>}
                      </td>
                      <td><SegmentBadge segment={row.segment} /></td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--adm-dim)' }}>{SOURCE_LABELS[row.source] || row.source || '—'}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--adm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--adm-dim)' }}>
            <span>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="admin-btn-secondary" style={{ padding: '4px 10px' }}>
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="admin-btn-secondary" style={{ padding: '4px 10px' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bot scheduler jobs */}
      {botStatus?.lead_jobs?.length > 0 && (
        <div className="admin-card">
          <h3 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} color="var(--adm-red)" /> Scheduler Jobs
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {botStatus.lead_jobs.map((job) => (
              <div key={job.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.9rem', background: 'var(--adm-bg)', borderRadius: 8, fontSize: '0.82rem' }}>
                <span style={{ fontWeight: '600' }}>{job.name}</span>
                <span style={{ color: 'var(--adm-dim)' }}>
                  Next: {job.next_run_time ? new Date(job.next_run_time).toLocaleString() : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BotDashboard;
