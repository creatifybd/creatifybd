import imageCompression from 'browser-image-compression';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

let savedConfigPromise;

const getSavedConfig = async () => {
  if (!savedConfigPromise) {
    savedConfigPromise = getDoc(doc(db, 'settings', 'site'))
      .then((snapshot) => snapshot.exists() ? snapshot.data() : {})
      .catch(() => ({}));
  }
  return savedConfigPromise;
};

export const uploadImage = async (file, onProgress, options = {}) => {
  const saved = await getSavedConfig();
  const cloudName = options.cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || saved.cloudinary_cloud_name;
  const uploadPreset = options.uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || saved.cloudinary_upload_preset;

  if (!cloudName || !uploadPreset) {
    throw new Error('Configure the Cloudinary cloud name and unsigned upload preset in Branding & SEO first.');
  }

  let uploadFile = file;
  if (file.size > 2 * 1024 * 1024) {
    uploadFile = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 2400,
      useWebWorker: true,
      fileType: file.type
    });
  }

  const body = new FormData();
  body.append('file', uploadFile);
  body.append('upload_preset', uploadPreset);
  body.append('folder', options.folder || 'creatifybd');

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onload = () => {
      let payload = {};
      try { payload = JSON.parse(request.responseText); } catch { /* handled below */ }
      if (request.status >= 200 && request.status < 300 && payload.secure_url) {
        onProgress?.(100);
        resolve(payload.secure_url);
      } else {
        reject(new Error(payload.error?.message || 'Cloudinary upload failed.'));
      }
    };
    request.onerror = () => reject(new Error('Could not connect to Cloudinary.'));
    request.send(body);
  });
};
