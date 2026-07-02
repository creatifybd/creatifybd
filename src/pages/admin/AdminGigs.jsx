import React, { useEffect, useState } from 'react';
import { gigs as gigDatabase, categories } from '../../data/gigs';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../firebase/config';
import { collection, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { 
  ExternalLink, Star, Package, Eye, ToggleLeft, ToggleRight, 
  Search, Filter, ChevronDown
} from 'lucide-react';

const AdminGigs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [gigStatuses, setGigStatuses] = useState(
    Object.fromEntries(gigDatabase.map(g => [g.id, g.status === 'active']))
  );
  const [savingGig, setSavingGig] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gig_overrides'), (snap) => {
      setGigStatuses(prev => {
        const next = { ...prev };
        snap.docs.forEach(item => {
          const data = item.data();
          if (typeof data.active === 'boolean') next[item.id] = data.active;
        });
        return next;
      });
    });
    return () => unsub();
  }, []);

  const toggleGig = async (id) => {
    const nextActive = !gigStatuses[id];
    setGigStatuses(prev => ({ ...prev, [id]: nextActive }));
    setSavingGig(id);
    try {
      await setDoc(doc(db, 'gig_overrides', id), {
        active: nextActive,
        updatedAt: serverTimestamp()
      }, { merge: true });
      toast.success(nextActive ? 'Gig published' : 'Gig paused');
    } catch (err) {
      console.error(err);
      setGigStatuses(prev => ({ ...prev, [id]: !nextActive }));
      toast.error('Could not update gig status');
    } finally {
      setSavingGig(null);
    }
  };

  const filtered = gigDatabase.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || gig.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="admin-section-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Gigs Manager</h1>
          <p className="adm-page-desc">View and manage your marketplace service listings. Toggle visibility and inspect package details.</p>
        </div>
        <Link to="/gigs" target="_blank" className="adm-btn-primary">
          <ExternalLink size={16} /> View Marketplace
        </Link>
      </div>

      {/* Stats Row */}
      <div className="adm-stats-mini-row">
        <div className="adm-stat-mini">
          <span className="stat-num">{gigDatabase.length}</span>
          <span className="stat-lbl">Total Gigs</span>
        </div>
        <div className="adm-stat-mini">
          <span className="stat-num">{Object.values(gigStatuses).filter(Boolean).length}</span>
          <span className="stat-lbl">Active Listings</span>
        </div>
        <div className="adm-stat-mini">
          <span className="stat-num">{Object.keys(categories).length}</span>
          <span className="stat-lbl">Categories</span>
        </div>
        <div className="adm-stat-mini">
          <span className="stat-num">{gigDatabase.reduce((sum, g) => sum + g.reviewCount, 0)}</span>
          <span className="stat-lbl">Total Reviews</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="adm-filter-bar">
        <div className="adm-search-box">
          <Search size={16} />
          <input 
            type="text"
            placeholder="Search gig title or slug..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="adm-select-wrap">
          <Filter size={15} />
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)}>
            <option value="all">All Categories</option>
            {Object.values(categories).map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gigs Table */}
      <div className="adm-table-card">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Gig Title</th>
              <th>Category</th>
              <th>Starting Price</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(gig => (
              <tr key={gig.id}>
                <td>
                  <div className="gig-table-title-cell">
                    <div className="gig-table-img">
                      <img src={gig.galleryImages?.[0]} alt="" />
                    </div>
                    <div>
                      <div className="table-title-text">{gig.shortTitle}</div>
                      <div className="table-slug-text">/{gig.slug}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="cat-chip">{categories[gig.category]?.name}</span>
                </td>
                <td className="price-cell-adm">${gig.startingPrice} USD</td>
                <td>
                  <div className="rating-cell-adm">
                    <Star size={13} fill="var(--adm-red)" stroke="var(--adm-red)" />
                    <span>{gig.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="dim-cell">{gig.reviewCount}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => toggleGig(gig.id)}
                    disabled={savingGig === gig.id}
                    className={`status-toggle-btn ${gigStatuses[gig.id] ? 'active' : 'inactive'}`}
                    title={gigStatuses[gig.id] ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {gigStatuses[gig.id] 
                      ? <><ToggleRight size={18} /> Active</> 
                      : <><ToggleLeft size={18} /> Paused</>
                    }
                  </button>
                </td>
                <td>
                  <div className="table-actions-row">
                    <Link to={`/gigs/${gig.slug}`} target="_blank" className="adm-icon-btn" title="View live gig page">
                      <Eye size={15} />
                    </Link>
                    <div className="adm-icon-btn" title="View packages">
                      <Package size={15} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .adm-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .adm-page-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--adm-text);
          margin-bottom: 0.25rem;
        }

        .adm-page-desc {
          font-size: 0.85rem;
          color: var(--adm-dim);
        }

        .adm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.25rem;
          background: var(--adm-red);
          color: white;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .adm-btn-primary:hover {
          opacity: 0.85;
        }

        .adm-stats-mini-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .adm-stats-mini-row { grid-template-columns: repeat(2, 1fr); }
        }

        .adm-stat-mini {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-num {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--adm-text);
        }

        .stat-lbl {
          font-size: 0.75rem;
          color: var(--adm-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .adm-filter-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .adm-search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.7rem 1rem;
          flex: 1;
          min-width: 200px;
          color: var(--adm-dim);
        }

        .adm-search-box input {
          background: transparent;
          border: none;
          color: var(--adm-text);
          outline: none;
          font-size: 0.875rem;
          width: 100%;
        }

        .adm-select-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 8px;
          padding: 0.7rem 1rem;
          color: var(--adm-dim);
        }

        .adm-select-wrap select {
          background: transparent;
          border: none;
          color: var(--adm-text);
          outline: none;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .adm-table-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          border-radius: 12px;
          overflow: hidden;
          overflow-x: auto;
        }

        .adm-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          min-width: 700px;
        }

        .adm-table th {
          background: rgba(255,255,255,0.02);
          padding: 1rem 1.25rem;
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--adm-dim);
          border-bottom: 1px solid var(--adm-border);
          font-weight: 700;
        }

        .adm-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          color: var(--adm-text);
          vertical-align: middle;
        }

        .adm-table tbody tr:last-child td {
          border-bottom: none;
        }

        .adm-table tbody tr:hover td {
          background: rgba(255,255,255,0.02);
        }

        .gig-table-title-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .gig-table-img {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          overflow: hidden;
          background: #222;
          flex-shrink: 0;
        }

        .gig-table-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .table-title-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--adm-text);
          margin-bottom: 0.15rem;
        }

        .table-slug-text {
          font-size: 0.7rem;
          color: var(--adm-dim);
          font-family: monospace;
        }

        .cat-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #aaa;
          white-space: nowrap;
        }

        .price-cell-adm {
          font-weight: 700;
          color: var(--adm-red) !important;
        }

        .rating-cell-adm {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 600;
        }

        .dim-cell {
          color: var(--adm-dim) !important;
        }

        .status-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .status-toggle-btn.active {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.2);
        }

        .status-toggle-btn.inactive {
          background: rgba(255,255,255,0.03);
          color: var(--adm-dim);
          border: 1px solid var(--adm-border);
        }

        .table-actions-row {
          display: flex;
          gap: 0.5rem;
        }

        .adm-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--adm-border);
          color: var(--adm-dim);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }

        .adm-icon-btn:hover {
          background: rgba(255,255,255,0.07);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AdminGigs;
