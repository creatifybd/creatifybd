import release from '../data/publishedRelease.json';
// CreatifyBD Site Configuration
// Bangladesh-focused configuration

export const siteConfig = {
  // Business Information
  businessName: 'CreatifyBD',
  websiteUrl: 'https://creatifybd.com',
  tagline: 'বাংলাদেশের ব্যবসার জন্য কনটেন্ট, ডিজাইন, ভিডিও ও ওয়েবসাইট',
  email: release.site.email,
  phone: release.site.phone,
  whatsappNumber: release.site.whatsapp,
  address: release.site.address,

  targetMarkets: ['Bangladesh'],
  
  // Social Media Links
  socialLinks: {
    facebook: 'https://www.facebook.com/creatifybd',
    instagram: 'https://www.instagram.com/creatifybd',
    linkedin: 'https://www.linkedin.com/company/creatifybd',
    behance: '',
    youtube: ''
  },
  
  // Payment is disabled — clients contact us after placing inquiry.
  // We reach out via WhatsApp or email to discuss and finalize.
  lemonSqueezy: {
    storeId: '437558',
    apiKey: '',
    checkoutUrl: 'https://creatifybd.lemonsqueezy.com',
    testVariantId: '1942003',
    enabled: false
  },
  payoneer: {
    currency: 'BDT',
    note: 'আমরা inquiry পাওয়ার পর WhatsApp বা Email-এ payment details জানাবো।',
    placeholder: true
  },

  // DBBL bank details
  dbbl: {
    bankName: 'Dutch Bangla Bank Limited',
    placeholder: true
  },

  // Trade license
  tradeLicense: {
    number: '',
    issuedDate: '',
    placeholder: true
  },
  
  // Payment Instructions
  paymentInstructions: {
    verificationTime: 'Inquiry review within 24 hours.',
    proofRequirements: 'We will contact you after receiving your inquiry.',
    supportEmail: 'hello@creatifybd.com'
  },
  
  // Admin Information
  admin: {
    allowedEmails: ['binashad7@gmail.com']
  },
  adminEmail: 'binashad7@gmail.com',
  
  // SEO Configuration
  seo: {
    defaultTitle: 'CreatifyBD — আপনার ব্যবসার কনটেন্ট, ডিজাইন ও ওয়েবসাইট',
    defaultDescription: 'বাংলাদেশের ব্যবসার জন্য নিয়মিত সোশ্যাল মিডিয়া কনটেন্ট, ব্র্যান্ডিং, ভিডিও ও ওয়েবসাইট। মাসিক প্যাকেজ ৫,০০০ টাকা থেকে। আপনার প্রয়োজন নিয়ে কথা বলুন।',
    defaultKeywords: 'creative agency bangladesh, branding dhaka, social media management bangladesh, graphic design bangladesh, video editing bangladesh, website design dhaka, digital marketing bangladesh, CreatifyBD',
    canonicalUrl: 'https://creatifybd.com'
  },
  
  // WhatsApp Message Template
  whatsappMessage: 'CreatifyBD, আমার ব্যবসার পেজ ও কনটেন্ট নিয়ে আলোচনা করতে চাই।',
  
  // Services List (for dropdowns and forms)
  services: [
    'Social Media Management',
    'Graphic Design',
    'Video Editing',
    'Website Design',
    'Other'
  ],
  
  // Budget Ranges in BDT (for contact form)
  budgetRanges: [
    { value: '500-2000',    label: '৳500 – ৳2,000' },
    { value: '2000-5000',   label: '৳2,000 – ৳5,000' },
    { value: '5000-15000',  label: '৳5,000 – ৳15,000' },
    { value: '15000-50000', label: '৳15,000 – ৳50,000' },
    { value: '50000+',      label: '৳50,000+' },
  ],
  
  // CTA Button Text
  cta: {
    getProposal: 'আপনার কাজের খরচ জানুন',
    startProject: 'আপনার প্রয়োজন জানান',
    viewPortfolio: 'কাজের নমুনা দেখুন',
    contactWhatsApp: 'WhatsApp-এ কথা বলুন',
  }
};

export default siteConfig;
