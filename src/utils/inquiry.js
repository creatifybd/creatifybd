export const normalizeBanglaDigits = value => String(value || '').replace(/[০-৯]/g, digit => String(digit.charCodeAt(0) - 0x09e6));
export const normalizePhone = value => normalizeBanglaDigits(value).replace(/[\s()\-]/g, '');
export function validateInquiry(data) {
  const errors = {};
  if (!data.name?.trim() || data.name.trim().length < 2) errors.name = 'কমপক্ষে ২ অক্ষরে আপনার নাম লিখুন।';
  if (!/^\+?\d{10,15}$/.test(normalizePhone(data.phone))) errors.phone = 'সঠিক ফোন বা WhatsApp নম্বর লিখুন।';
  if (data.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'সঠিক ইমেইল ঠিকানা লিখুন।';
  if (!data.message?.trim() || data.message.trim().length < 10) errors.message = 'কমপক্ষে ১০ অক্ষরে আপনার প্রয়োজন জানান।';
  return errors;
}
