import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Copy, ExternalLink, File, FileText, Film, Image as ImageIcon, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { db } from '../../firebase/config';
import { useConfirm } from '../../context/ConfirmContext';

const iconFor = (type) =>
  type === 'image' ? <ImageIcon size={22} /> :
  type === 'video' ? <Film size={22} /> :
  type === 'pdf'   ? <FileText size={22} /> :
                     <File size={22} />;

const MediaLibrary = () => {
  const confirm = useConfirm();
  const [assets, setAssets] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() =>
    onSnapshot(
      query(collection(db, 'media_assets'), orderBy('createdAt', 'desc')),
      (snap) => setAssets(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => { console.error(err); toast.error('Media library could not be loaded'); }
    ),
  []);

  const addAsset = async (url, asset) => {
    if (!url) return;
    await addDoc(collection(db, 'media_assets'), {
      url,
      publicId: asset?.publicId || '',
      name: asset?.originalFilename || url.split('/').pop()?.split('?')[0] || 'Linked asset',
      resourceType: asset?.resourceType || 'file',
      format: asset?.format || '',
      bytes: asset?.bytes || 0,
      source: asset?.source || 'cloudinary',
      createdAt: serverTimestamp()
    });
    toast.success('Added to media library');
  };

  const removeAsset = async (id) => {
    const ok = await confirm({
      title: 'Remove this item?',
      description: 'This removes it from the media library. Files already used on the site keep working via their existing URL.',
      confirmLabel: 'Remove',
      tone: 'danger'
    });
    if (!ok) return;
    await deleteDoc(doc(db, 'media_assets', id));
    toast.success('Removed from library');
  };

  // ── Filtering ──────────────────────────────────────────────────
  const filtered = assets.filter(a => {
    if (!searchQ) return true;
    const q = searchQ.toLowerCase();
    return a.name?.toLowerCase().includes(q) || a.resourceType?.toLowerCase().includes(q) || a.format?.toLowerCase().includes(q);
  });

  // ── Bulk select ────────────────────────────────────────────────
  const allFilteredIds = filtered.map(a => a.id);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selected.has(id));

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allFilteredIds));

  const bulkDelete = async () => {
    if (!selected.size) return;
    const ok = await confirm({
      title: `Remove ${selected.size} item${selected.size > 1 ? 's' : ''}?`,
      description: 'These items will be removed from the media library. Files already in use will keep working.',
      confirmLabel: 'Remove All',
      tone: 'danger'
    });
    if (!ok) return;
    setBulkWorking(true);
    try {
      const batch = writeBatch(db);
      [...selected].forEach(id => batch.delete(doc(db, 'media_assets', id)));
      await batch.commit();
      toast.success(`${selected.size} item${selected.size > 1 ? 's' : ''} removed`);
      setSelected(new Set());
    } catch {
      toast.error('Failed to remove items');
    } finally {
      setBulkWorking(false);
    }
  };

  return (
    <div className="admin-content-wrap media-library-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Media Library</h1>
          <p className="adm-page-desc">Upload by drag-and-drop or register any external file link.</p>
        </div>
        <span style={{ fontSize: '0.82rem', color: 'var(--adm-dim)', fontWeight: '600' }}>
          {assets.length} item{assets.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="admin-card">
        <MediaUploader label="Add media or document" onChange={addAsset} folder="creatifybd/library" />
      </div>

      {/* Search + bulk bar */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="adm-search-box" style={{ flex: 1, minWidth: '220px' }}>
          <Search size={15} />
          <input
            type="text"
            placeholder="Search by filename or type…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
          />
          {searchQ && (
            <button onClick={() => setSearchQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--adm-dim)', padding: 0, fontSize: '1rem' }} aria-label="Clear">✕</button>
          )}
        </div>
        {selected.size > 0 && (
          <div className="bulk-action-bar" style={{ margin: 0 }}>
            <span>{selected.size} selected</span>
            <button className="danger" onClick={bulkDelete} disabled={bulkWorking}>
              <Trash2 size={14} /> Delete Selected
            </button>
            <button onClick={() => setSelected(new Set())} style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              Deselect All
            </button>
          </div>
        )}
      </div>

      {/* Select-all row */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="checkbox"
            id="media-select-all"
            checked={allSelected}
            onChange={toggleAll}
            style={{ cursor: 'pointer', accentColor: 'var(--adm-red)', width: '16px', height: '16px' }}
          />
          <label htmlFor="media-select-all" style={{ fontSize: '0.8rem', color: 'var(--adm-dim)', cursor: 'pointer', fontWeight: '600' }}>
            Select all {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </label>
        </div>
      )}

      {/* Grid */}
      <div className="media-library-grid">
        {filtered.map(asset => (
          <article
            key={asset.id}
            className="admin-card media-asset-card"
            style={{ outline: selected.has(asset.id) ? '2px solid var(--adm-red)' : undefined, position: 'relative' }}
          >
            {/* Select checkbox */}
            <input
              type="checkbox"
              checked={selected.has(asset.id)}
              onChange={() => toggleSelect(asset.id)}
              style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 2, cursor: 'pointer', accentColor: 'var(--adm-red)', width: '16px', height: '16px' }}
              aria-label={`Select ${asset.name}`}
            />
            <div className="media-asset-preview">
              {asset.resourceType === 'image'
                ? <img src={asset.url} alt={asset.name} />
                : asset.resourceType === 'video'
                  ? <video src={asset.url} preload="metadata" />
                  : iconFor(asset.resourceType)}
            </div>
            <div className="media-asset-info">
              <strong title={asset.name}>{asset.name}</strong>
              <span>{asset.resourceType || 'file'}{asset.format ? ` · ${asset.format}` : ''}</span>
            </div>
            <div className="media-asset-actions">
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(asset.url); toast.success('Link copied'); }}
                title="Copy link"
                aria-label="Copy link"
              >
                <Copy size={16} />
              </button>
              <a href={asset.url} target="_blank" rel="noreferrer" title="Open asset" aria-label="Open asset">
                <ExternalLink size={16} />
              </a>
              <button type="button" onClick={() => removeAsset(asset.id)} title="Remove from library" aria-label="Remove from library">
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--adm-dim)' }}>
            {searchQ ? 'No items match your search.' : 'No media uploaded yet.'}
          </div>
        )}
      </div>

      <style>{`
        .media-library-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .media-asset-card { padding: 0.75rem; }
        .media-asset-preview {
          height: 150px;
          background: var(--adm-bg);
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: var(--adm-dim);
          overflow: hidden;
        }
        .media-asset-preview img,
        .media-asset-preview video {
          width: 100%; height: 100%; object-fit: contain;
        }
        .media-asset-info {
          display: grid;
          gap: 0.2rem;
          padding: 0.8rem 0.15rem;
        }
        .media-asset-info strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--adm-text);
          font-size: 0.85rem;
        }
        .media-asset-info span {
          font-size: 0.72rem;
          color: var(--adm-dim);
          text-transform: capitalize;
        }
        .media-asset-actions {
          display: flex;
          gap: 0.5rem;
        }
        .media-asset-actions button,
        .media-asset-actions a {
          width: 34px; height: 34px;
          border: 1px solid var(--adm-border);
          background: var(--adm-bg);
          color: var(--adm-text);
          border-radius: 7px;
          display: grid;
          place-items: center;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .media-asset-actions button:hover,
        .media-asset-actions a:hover {
          border-color: var(--adm-red);
          color: var(--adm-red);
        }
      `}</style>
    </div>
  );
};

export default MediaLibrary;
