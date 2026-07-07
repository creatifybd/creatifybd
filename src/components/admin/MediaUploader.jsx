import React, { useRef, useState } from 'react';
import { File, FileText, Film, Image as ImageIcon, Link2, Loader2, UploadCloud, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadAsset } from '../../utils/cloudinary';

const inferType = (url = '') => {
  const clean = url.split('?')[0].toLowerCase();
  if (/\.(png|jpe?g|webp|gif|svg|avif)$/.test(clean)) return 'image';
  if (/\.(mp4|webm|mov|m4v|avi)$/.test(clean)) return 'video';
  if (/\.pdf$/.test(clean)) return 'pdf';
  return 'file';
};

const MediaPreview = ({ url, type }) => {
  if (!url) return null;
  if (type === 'image') return <img src={url} alt="Uploaded asset preview" />;
  if (type === 'video') return <video src={url} controls preload="metadata" />;
  if (type === 'pdf') return <div className="media-file-preview"><FileText size={28} /><span>PDF document</span></div>;
  return <div className="media-file-preview"><File size={28} /><span>Linked file</span></div>;
};

const MediaUploader = ({
  label = 'Media',
  value = '',
  onChange,
  accept = '*/*',
  folder = 'creatifybd/media',
  helperText = 'Images, videos, PDFs, and general files up to 100 MB.',
  context = 'general'
}) => {
  const inputRef = useRef(null);
  const [mode, setMode] = useState('upload');
  const [link, setLink] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [assetType, setAssetType] = useState(inferType(value));

  // Context-aware helper text
  const getContextHelper = () => {
    if (helperText && helperText !== 'Images, videos, PDFs, and general files up to 100 MB.') {
      return helperText;
    }
    
    const folderLower = folder.toLowerCase();
    
    if (folderLower.includes('gigs')) {
      return 'Recommended: 1280x769px (16:9.5) for gig covers. Max 100 MB.';
    }
    if (folderLower.includes('portfolio')) {
      return 'Recommended: 1920x1080px (16:9) for portfolio items. Max 100 MB.';
    }
    if (folderLower.includes('services')) {
      return 'Recommended: 800x600px (4:3) for service images. Max 100 MB.';
    }
    if (folderLower.includes('content/hero') || folderLower.includes('hero')) {
      return 'Recommended: 1920x1080px (16:9) for hero images. Max 100 MB.';
    }
    if (folderLower.includes('content/about') || folderLower.includes('about')) {
      return 'Recommended: 800x800px (1:1) for team/office photos. Max 100 MB.';
    }
    if (folderLower.includes('content/contact')) {
      return 'Recommended: 1200x600px (2:1) for contact/office images. Max 100 MB.';
    }
    
    return 'Images, videos, PDFs, and general files up to 100 MB.';
  };

  const displayHelperText = getContextHelper();

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const asset = await uploadAsset(file, setProgress, { folder });
      setAssetType(asset.resourceType === 'image' ? 'image' : asset.resourceType === 'video' ? 'video' : inferType(asset.url));
      setLink(asset.url);
      onChange?.(asset.url, asset);
      toast.success(`${file.name} uploaded`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const applyLink = () => {
    try {
      const parsed = new URL(link);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
      const type = inferType(link);
      setAssetType(type);
      onChange?.(link.trim(), { url: link.trim(), resourceType: type, source: 'link' });
      toast.success('Media link applied');
    } catch {
      toast.error('Enter a valid http(s) file link');
    }
  };

  const clear = () => {
    setLink('');
    setAssetType('file');
    onChange?.('', null);
  };

  return (
    <div className="media-uploader">
      <div className="media-uploader-head">
        <label>{label}</label>
        <div className="media-mode-tabs" role="tablist" aria-label={`${label} source`}>
          <button type="button" className={mode === 'upload' ? 'active' : ''} onClick={() => setMode('upload')}><UploadCloud size={15} /> Upload</button>
          <button type="button" className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')}><Link2 size={15} /> Link</button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          className={`media-dropzone ${dragging ? 'dragging' : ''}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }}
          onDrop={(event) => { event.preventDefault(); setDragging(false); uploadFile(event.dataTransfer.files?.[0]); }}
        >
          <input ref={inputRef} type="file" accept={accept} onChange={(event) => uploadFile(event.target.files?.[0])} hidden />
          {uploading ? <><Loader2 className="animate-spin" size={28} /><strong>Uploading {progress}%</strong><div className="media-progress"><span style={{ width: `${progress}%` }} /></div></> : <><UploadCloud size={30} /><strong>Drop a file here</strong><span>or</span><button type="button" onClick={() => inputRef.current?.click()}>Browse files</button></>}
        </div>
      ) : (
        <div className="media-link-row">
          <Link2 size={18} />
          <input type="url" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://.../your-file.pdf" />
          <button type="button" onClick={applyLink}>Use link</button>
        </div>
      )}

      <p className="media-uploader-help">{displayHelperText}</p>
      {value && <div className="media-current"><MediaPreview url={value} type={assetType || inferType(value)} /><a href={value} target="_blank" rel="noreferrer">Open asset</a><button type="button" onClick={clear} aria-label="Remove selected asset"><X size={16} /></button></div>}
      <style>{`
        .media-uploader{display:grid;gap:.75rem}.media-uploader-head{display:flex;align-items:center;justify-content:space-between;gap:1rem}.media-uploader-head>label{font-size:.82rem;font-weight:700;color:var(--adm-text)}
        .media-mode-tabs{display:flex;border:1px solid var(--adm-border);border-radius:8px;padding:3px;background:var(--adm-bg)}.media-mode-tabs button{border:0;background:transparent;color:var(--adm-dim);padding:.4rem .65rem;border-radius:6px;display:flex;align-items:center;gap:.35rem;font-size:.75rem;font-weight:700;cursor:pointer}.media-mode-tabs button.active{background:var(--adm-surface);color:var(--adm-red);box-shadow:0 1px 4px rgba(0,0,0,.08)}
        .media-dropzone{min-height:150px;border:2px dashed var(--adm-border);border-radius:10px;background:var(--adm-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.45rem;color:var(--adm-dim);transition:.2s;padding:1.25rem;text-align:center}.media-dropzone.dragging{border-color:var(--adm-red);background:rgba(232,25,44,.06)}.media-dropzone strong{color:var(--adm-text)}.media-dropzone button,.media-link-row button{border:0;background:var(--adm-red);color:#fff;border-radius:7px;padding:.55rem .9rem;font-weight:700;cursor:pointer}.media-progress{width:min(260px,80%);height:6px;background:var(--adm-border);border-radius:99px;overflow:hidden}.media-progress span{display:block;height:100%;background:var(--adm-red);transition:width .2s}
        .media-link-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.65rem;border:1px solid var(--adm-border);border-radius:10px;background:var(--adm-bg);padding:.65rem .75rem;color:var(--adm-dim)}.media-link-row input{border:0;outline:0;background:transparent;color:var(--adm-text);min-width:0;width:100%}.media-uploader-help{font-size:.72rem;color:var(--adm-dim)}
        .media-current{position:relative;min-height:88px;border:1px solid var(--adm-border);border-radius:10px;background:var(--adm-surface);padding:.55rem;display:flex;align-items:center;gap:.75rem;overflow:hidden}.media-current img,.media-current video{width:112px;height:72px;object-fit:contain;background:#101114;border-radius:6px}.media-current>a{color:var(--adm-red);font-size:.78rem;font-weight:700;overflow:hidden;text-overflow:ellipsis}.media-current>button{margin-left:auto;width:32px;height:32px;border:1px solid var(--adm-border);background:var(--adm-bg);color:var(--adm-text);border-radius:7px;display:grid;place-items:center;cursor:pointer}.media-file-preview{width:112px;height:72px;display:grid;place-items:center;align-content:center;gap:.2rem;background:var(--adm-bg);color:var(--adm-dim);border-radius:6px;font-size:.68rem}
        @media(max-width:560px){.media-uploader-head{align-items:flex-start;flex-direction:column}.media-link-row{grid-template-columns:auto 1fr}.media-link-row button{grid-column:1/-1}.media-current img,.media-current video,.media-file-preview{width:84px}}
      `}</style>
    </div>
  );
};

export default MediaUploader;
