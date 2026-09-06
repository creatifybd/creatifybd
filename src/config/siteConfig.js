// CreatifyBD Site Configuration
// Bangladesh-focused configuration

export const siteConfig = {
  // Business Information
  businessName: 'CreatifyBD',
  websiteUrl: 'https://creatifybd.com',
  tagline: 'Branding, social media, video, and web for Bangladeshi businesses',
  email: 'hello@creatifybd.com',
  phone: '+880 1951 676600',
  whatsappNumber: '+8801951676600',
  address: 'Dhaka, Bangladesh',

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
    defaultTitle: 'CreatifyBD — বাংলাদেশের Trusted Creative Agency | Branding, Social, Video & Web',
    defaultDescription: 'CreatifyBD হলো বাংলাদেশের একটি full-service creative agency। আমরা branding, social media management, video editing, এবং website design-এ সাহায্য করি। WhatsApp বা Email-এ যোগাযোগ করুন।',
    defaultKeywords: 'creative agency bangladesh, branding dhaka, social media management bangladesh, graphic design bangladesh, video editing bangladesh, website design dhaka, digital marketing bangladesh, CreatifyBD',
    canonicalUrl: 'https://creatifybd.com'
  },
  
  // WhatsApp Message Template
  whatsappMessage: 'Hello CreatifyBD! আমি একটি project নিয়ে আলোচনা করতে চাই।',
  
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
    getProposal: 'Get a Custom Quote',
    startProject: 'Start a Project',
    viewPortfolio: 'See Our Work',
    contactWhatsApp: 'Chat on WhatsApp',
  }
};

export default siteConfig;
