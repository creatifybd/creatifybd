import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { Trash2, CheckCircle2, Circle, Search, MailOpen, MailX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const MessagesList = () => {
  const confirm = useConfirm();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'messages'), (snap) => {
      const sorted = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const tA = a.createdAt?.toMillis?.() || a.timestamp?.toMillis?.() || 0;
          const tB = b.createdAt?.toMillis?.() || b.timestamp?.toMillis?.() || 0;
          return tB - tA;
        });
      setMessages(sorted);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isRead = (m) => m.read || m.status === 'read';
  const getDate = (m) => m.createdAt?.toDate?.() || m.timestamp?.toDate?.() || null;

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete this message?',
      description: 'This message will be permanently removed.',
      confirmLabel: 'Delete',
      tone: 'danger'
    });
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success('Message deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    }
  };

  const toggleRead = async (id, currentlyRead) => {
    try {
      await updateDoc(doc(db, 'messages', id), {
        read: !currentlyRead,
        status: currentlyRead ? 'unread' : 'read'
      });
    } catch (err) {
      toast.error('Failed to update message');
    }
  };

  // ── Filtering ──────────────────────────────────────────────────
  const filtered = messages.filter(m => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.contact?.toLowerCase().includes(q) ||
      m.service?.toLowerCase().includes(q) ||
      m.business?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q) ||
      m.project?.toLowerCase().includes(q)
    );
  });

  // ── Bulk select ────────────────────────────────────────────────
  const allFilteredIds = filtered.map(m => m.id);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id));

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(allFilteredIds));
  };

  const bulkMarkRead = async (readValue) => {
    if (!selected.size) return;
    setBulkWorking(true);
    try {
      const batch = writeBatch(db);
      [...selected].forEach(id =>
        batch.update(doc(db, 'messages', id), { read: readValue, status: readValue ? 'read' : 'unread' })
      );
      await batch.commit();
      toast.success(`${selected.size} message${selected.size > 1 ? 's' : ''} marked ${readValue ? 'read' : 'unread'}`);
      setSelected(new Set());
    } catch {
      toast.error('Failed to update messages');
    } finally {
      setBulkWorking(false);
    }
  };

  const bulkDelete = async () => {
    if (!selected.size) return;
    const ok = await confirm({
      title: `Delete ${selected.size} message${selected.size > 1 ? 's' : ''}?`,
      description: 'These messages will be permanently removed.',
      confirmLabel: 'Delete All',
      tone: 'danger'
    });
    if (!ok) return;
    setBulkWorking(true);
    try {
      const batch = writeBatch(db);
      [...selected].forEach(id => batch.delete(doc(db, 'messages', id)));
      await batch.commit();
      toast.success(`${selected.size} message${selected.size > 1 ? 's' : ''} deleted`);
      setSelected(new Set());
    } catch {
      toast.error('Failed to delete messages');
    } finally {
      setBulkWorking(false);
    }
  };

  const unreadCount = messages.filter(m => !isRead(m)).length;

  return (
    <div>
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">
            Customer Inquiries
            {unreadCount > 0 && (
              <span style={{
                background: 'var(--adm-red)', color: '#fff',
                fontSize: '0.68rem', fontWeight: '700',
                padding: '0.15rem 0.55rem', borderRadius: '100px',
                marginLeft: '0.75rem', verticalAlign: 'middle'
              }}>
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="adm-page-desc">Manage and track all messages from the contact form.</p>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--adm-dim)', fontWeight: '600' }}>
          {messages.length} total · {unreadCount} unread
        </span>
      </div>

      {/* Search */}
      <div className="adm-filter-bar" style={{ marginBottom: '1.25rem' }}>
        <div className="adm-search-box" style={{ flex: 1 }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by name, email, service, or message…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          {searchQ && (
            <button
              onClick={() => setSearchQ('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-dim)', padding: 0, lineHeight: 1, fontSize: '1rem' }}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bulk-action-bar" style={{ marginBottom: '1rem' }}>
          <span>{selected.size} selected</span>
          <button onClick={() => bulkMarkRead(true)} disabled={bulkWorking}>
            <MailOpen size={14} /> Mark Read
          </button>
          <button onClick={() => bulkMarkRead(false)} disabled={bulkWorking}>
            <MailX size={14} /> Mark Unread
          </button>
          <button className="danger" onClick={bulkDelete} disabled={bulkWorking}>
            <Trash2 size={14} /> Delete Selected
          </button>
          <button
            onClick={() => setSelected(new Set())}
            style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)' }}
            disabled={bulkWorking}
          >
            Deselect All
          </button>
        </div>
      )}

      <div className="admin-card">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--adm-red)', width: '16px', height: '16px' }}
                  aria-label="Select all messages"
                />
              </th>
              <th>Status</th>
              <th>Date</th>
              <th>Customer Info</th>
              <th>Business &amp; Service</th>
              <th>Project Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.id}
                style={{
                  opacity: isRead(m) ? 0.65 : 1,
                  background: selected.has(m.id) ? 'var(--adm-red-soft)' : undefined
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(m.id)}
                    onChange={() => toggleSelect(m.id)}
                    style={{ cursor: 'pointer', accentColor: 'var(--adm-red)', width: '16px', height: '16px' }}
                    aria-label={`Select message from ${m.name}`}
                  />
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <button
                    onClick={() => toggleRead(m.id, isRead(m))}
                    style={{ background: 'none', border: 'none', color: isRead(m) ? 'var(--adm-success)' : 'var(--adm-red)', cursor: 'pointer', padding: 0 }}
                    title={isRead(m) ? 'Mark as Unread' : 'Mark as Read'}
                    aria-label={isRead(m) ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {isRead(m) ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--adm-text)' }}>
                    {getDate(m)?.toLocaleDateString() || 'No date'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-dim)' }}>
                    {getDate(m)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}
                  </div>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.3rem', color: 'var(--adm-text)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--adm-dim)' }}>{m.email || m.contact}</div>
                  {m.phone && <div style={{ fontSize: '0.8rem', color: 'var(--adm-dim)' }}>{m.phone}</div>}
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--adm-text)' }}>{m.business || 'Personal'}</div>
                  <div style={{ color: 'var(--adm-red)', fontSize: '0.75rem', fontWeight: '700' }}>{m.service}</div>
                  {m.budget && <div style={{ fontSize: '0.75rem', color: 'var(--adm-dim)' }}>{m.budget}</div>}
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--adm-dim)', maxWidth: '380px', lineHeight: '1.4', margin: 0 }}>
                    {m.message || m.project}
                  </p>
                </td>
                <td style={{ verticalAlign: 'top' }}>
                  <button
                    onClick={() => handleDelete(m.id)}
                    aria-label="Delete message"
                    style={{ background: 'none', border: 'none', color: 'var(--adm-danger)', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-dim)' }}>
                  {searchQ ? 'No messages match your search.' : 'No messages yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessagesList;
