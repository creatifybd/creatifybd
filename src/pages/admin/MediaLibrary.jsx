import React, { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { Copy, ExternalLink, File, FileText, Film, Image as ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import MediaUploader from '../../components/admin/MediaUploader';
import { db } from '../../firebase/config';

const iconFor = (type) => type === 'image' ? <ImageIcon size={22} /> : type === 'video' ? <Film size={22} /> : type === 'pdf' ? <FileText size={22} /> : <File size={22} />;

const MediaLibrary = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => onSnapshot(query(collection(db, 'media_assets'), orderBy('createdAt', 'desc')), snapshot => {
    setAssets(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
  }, error => { console.error(error); toast.error('Media library could not be loaded'); }), []);

  const addAsset = async (url, asset) => {
    if (!url) return;
    const resourceType = asset?.resourceType || 'file';
    await addDoc(collection(db, 'media_assets'), {
      url,
      publicId: asset?.publicId || '',
      name: asset?.originalFilename || url.split('/').pop()?.split('?')[0] || 'Linked asset',
      resourceType,
      format: asset?.format || '',
      bytes: asset?.bytes || 0,
      source: asset?.source || 'cloudinary',
      createdAt: serverTimestamp()
    });
    toast.success('Added to media library');
  };

  const removeAsset = async (id) => {
    if (!window.confirm('Remove this item from the media library?')) return;
    await deleteDoc(doc(db, 'media_assets', id));
    toast.success('Removed from library');
  };

  return <div className="admin-content-wrap media-library-page">
    <div className="adm-page-header"><div><h1 className="adm-page-title">Media Library</h1><p className="adm-page-desc">Upload by drag and drop or register any external file link.</p></div></div>
    <div className="admin-card"><MediaUploader label="Add media or document" onChange={addAsset} folder="creatifybd/library" /></div>
    <div className="media-library-grid">{assets.map(asset => <article className="admin-card media-asset-card" key={asset.id}>
      <div className="media-asset-preview">{asset.resourceType === 'image' ? <img src={asset.url} alt={asset.name} /> : asset.resourceType === 'video' ? <video src={asset.url} preload="metadata" /> : iconFor(asset.resourceType)}</div>
      <div className="media-asset-info"><strong>{asset.name}</strong><span>{asset.resourceType || 'file'}{asset.format ? ` · ${asset.format}` : ''}</span></div>
      <div className="media-asset-actions"><button type="button" onClick={() => { navigator.clipboard.writeText(asset.url); toast.success('Link copied'); }} title="Copy link"><Copy size={16} /></button><a href={asset.url} target="_blank" rel="noreferrer" title="Open asset"><ExternalLink size={16} /></a><button type="button" onClick={() => removeAsset(asset.id)} title="Remove from library"><Trash2 size={16} /></button></div>
    </article>)}</div>
    <style>{`.media-library-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem;margin-top:1.25rem}.media-asset-card{padding:.75rem}.media-asset-preview{height:150px;background:var(--adm-bg);border-radius:8px;display:grid;place-items:center;color:var(--adm-dim);overflow:hidden}.media-asset-preview img,.media-asset-preview video{width:100%;height:100%;object-fit:contain}.media-asset-info{display:grid;gap:.2rem;padding:.8rem .15rem}.media-asset-info strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.media-asset-info span{font-size:.72rem;color:var(--adm-dim);text-transform:capitalize}.media-asset-actions{display:flex;gap:.5rem}.media-asset-actions button,.media-asset-actions a{width:34px;height:34px;border:1px solid var(--adm-border);background:var(--adm-bg);color:var(--adm-text);border-radius:7px;display:grid;place-items:center;cursor:pointer}`}</style>
  </div>;
};

export default MediaLibrary;
