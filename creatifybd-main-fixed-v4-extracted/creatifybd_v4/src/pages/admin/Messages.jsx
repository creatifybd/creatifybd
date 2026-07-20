import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, writeBatch, addDoc, serverTimestamp } from 'firebase/firestore';
import { Trash2, CheckCircle2, Circle, Search, MailOpen, MailX, Reply, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirm } from '../../context/ConfirmContext';

const MessagesList = () => {
  const confirm = useConfirm();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);

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

  const openReply = (message) => {
    setReplyTo(message);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    setReplySending(true);
    try {
      // Save reply to replies subcollection
      await addDoc(collection(db, 'messages', replyTo.id, 'replies'), {
        text: replyText,
        sentAt: serverTimestamp(),
        sentBy: 'admin'
      });
      // Mark original message as read
      await updateDoc(doc(db, 'messages', replyTo.id), {
        read: true,
        status: 'replied',
        lastRepliedAt: serverTimestamp()
      });
      toast.success('Reply sent successfully');
      setReplyModalOpen(false);
      setReplyTo(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send reply');
    } finally {
      setReplySending(false);
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openReply(m)}
                      aria-label="Reply to message"
                      style={{ background: 'none', border: 'none', color: 'var(--adm-info)', cursor: 'pointer', padding: '4px' }}
                      title="Reply"
                    >
                      <Reply size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      aria-label="Delete message"
                      style={{ background: 'none', border: 'none', color: 'var(--adm-danger)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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

      {/* Reply Modal */}
      {replyModalOpen && replyTo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--adm-card)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--adm-shadow-lg)'
          }}>
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--adm-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--adm-text)' }}>
                Reply to {replyTo.name}
              </h3>
              <button
                onClick={() => setReplyModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--adm-dim)' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
              <div style={{
                background: 'var(--adm-soft)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: 'var(--adm-dim)',
                fontStyle: 'italic'
              }}>
                <strong style={{ color: 'var(--adm-text)', fontStyle: 'normal' }}>Original message:</strong>
                <p style={{ margin: '0.5rem 0 0 0', lineHeight: '1.5' }}>
                  {replyTo.message || replyTo.project}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--adm-text)', marginBottom: '0.5rem' }}>
                  Your reply
                </label>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '0.85rem',
                    border: '1.5px solid var(--adm-border)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    background: 'var(--adm-surface)',
                    color: 'var(--adm-text)'
                  }}
                />
              </div>
            </div>
            
            <div style={{
              padding: '1.25rem',
              borderTop: '1px solid var(--adm-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setReplyModalOpen(false)}
                disabled={replySending}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: '1.5px solid var(--adm-border)',
                  background: 'transparent',
                  color: 'var(--adm-text)',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: replySending ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={replySending}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--adm-red)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: replySending ? 'not-allowed' : 'pointer',
                  opacity: replySending ? 0.6 : 1
                }}
              >
                {replySending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
