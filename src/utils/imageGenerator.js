import { uploadAsset } from './cloudinary';

/**
 * Upload an image File, Blob, or Data URL to Cloudinary
 * Returns secure URL string
 */
export const uploadConceptImage = async (fileOrBlob) => {
  try {
    const result = await uploadAsset(fileOrBlob, () => {}, { folder: 'lead_crm_mockups' });
    return result.url;
  } catch (err) {
    console.warn('Cloudinary upload failed, falling back to base64 / data URL:', err.message);
    // Fallback: convert to Base64 Data URL if Cloudinary upload fails
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
    });
  }
};

/**
 * Read image from clipboard
 */
export const readImageFromClipboard = async () => {
  if (!navigator.clipboard || !navigator.clipboard.read) {
    throw new Error('Clipboard API not supported in this browser. Please use Ctrl+V to paste or upload an image file.');
  }

  const items = await navigator.clipboard.read();
  for (const item of items) {
    for (const type of item.types) {
      if (type.startsWith('image/')) {
        const blob = await item.getType(type);
        return blob;
      }
    }
  }
  throw new Error('No image found in clipboard. Copy an image first, then click paste!');
};
