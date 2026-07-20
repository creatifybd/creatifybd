// CreatifyBD Site Configuration
// Update these values as needed for your business

export const siteConfig = {
  // Business Information
  businessName: 'CreatifyBD',
  websiteUrl: 'https://creatifybd.com',
  tagline: 'Branding, social media, video, and web for growing businesses',
  email: 'hello@creatifybd.com',
  phone: '+880 1951 676600',
  whatsappNumber: '+8801951676600',
  address: 'Serving clients globally',

  targetMarkets: ['Global'],
  
  // Social Media Links
  socialLinks: {
    facebook: 'https://www.facebook.com/creatifybd',
    instagram: 'https://www.instagram.com/creatifybd',
    linkedin: 'https://www.linkedin.com/company/creatifybd',
    behance: '',
    youtube: ''
  },
  
  // Payment configuration is stored in Firestore settings/payment and loaded
  // via SettingsContext on both the admin panel and the public PaymentPage.
  // This is intentionally public-read (see firestore.rules) — account numbers
  // for RECEIVING payment aren't secret, a client needs to see them to pay.
  // Only the ability to CHANGE these values is restricted to admins.
  // DO NOT store real account numbers here in source control — this object
  // is only the fallback shown before Firestore data loads.
  payoneer: {
    currency: 'USD',
    note: 'Enter the exact amount from your order confirmation. Add your Order ID (e.g. CBD-1234567) in the payment note.',
    placeholder: true
  },

  // DBBL bank details — same Firestore-backed pattern as Payoneer above.
  dbbl: {
    bankName: 'Dutch Bangla Bank Limited',
    placeholder: true
  },

  // Trade license — not yet issued. Admin panel has a field ready to
  // populate this the moment it's available; until then this stays empty
  // and the public site simply doesn't display a license number.
  tradeLicense: {
    number: '',
    issuedDate: '',
    placeholder: true
  },
  
  // Payment Instructions
  paymentInstructions: {
    verificationTime: 'Usually within 24 hours after submitting valid payment proof.',
    proofRequirements: 'Transaction ID, amount, payment date, and screenshot or receipt.',
    supportEmail: 'hello@creatifybd.com'
  },
  
  // Admin Information
  admin: {
    allowedEmails: ['binashad7@gmail.com']
  },
  adminEmail: 'binashad7@gmail.com',
  
  // SEO Configuration
  seo: {
    defaultTitle: 'CreatifyBD \u2014 Branding, Social, Video & Web for Growing Businesses',
    defaultDescription: 'A full-service creative team \u2014 branding, social media, video, and web \u2014 built by 4-7 specialists who work directly with you. No account managers, no five-layer handoffs. Get a custom quote.',
    defaultKeywords: 'creative agency, brand identity, logo design, social media management, graphic design, video editing, website design, digital marketing, CreatifyBD',
    canonicalUrl: 'https://creatifybd.com'
  },
  
  // WhatsApp Message Template
  whatsappMessage: 'Hello CreatifyBD, I want to discuss a project.',
  
  // Services List (for dropdowns and forms)
  services: [
    'Social Media Management',
    'Graphic Design',
    'Video Editing',
    'Website Design',
    'Other'
  ],
  
  // Budget Ranges (for contact form)
  budgetRanges: [
    { value: '50-100', label: '$50 - $100 USD' },
    { value: '100-250', label: '$100 - $250 USD' },
    { value: '250-500', label: '$250 - $500 USD' },
    { value: '500-1000', label: '$500 - $1,000 USD' },
    { value: '1000+', label: '$1,000+ USD' }
  ],
  
  // CTA Button Text
  cta: {
    getProposal: 'Get a Custom Quote',
    startProject: 'Start a Project',
    viewPortfolio: 'See Our Work',
    contactWhatsApp: 'Contact on WhatsApp',
    proceedToPayment: 'Proceed to Manual Payment'
  }
};

export default siteConfig;

