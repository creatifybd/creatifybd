// CreatifyBD Site Configuration
// Update these values as needed for your business

export const siteConfig = {
  // Business Information
  businessName: 'CreatifyBD',
  websiteUrl: 'https://creatifybd.com',
  tagline: 'Social media management and creative services for growing brands',
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
  
  // Payment configuration is stored in Firestore settings/private/payment
  // and loaded only in the admin panel and PaymentPage via SettingsContext.
  // DO NOT store real account numbers or payment links in this public config.
  payoneer: {
    currency: 'USD',
    note: 'Enter the exact amount from your order confirmation. Add your Order ID (e.g. CBD-1234567) in the payment note.',
    placeholder: true
  },

  // DBBL bank details are stored in Firestore settings/private/payment (admin-only)
  dbbl: {
    bankName: 'Dutch Bangla Bank Limited',
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
    defaultTitle: 'CreatifyBD | Premium Global Creative Partner & Design Subscription',
    defaultDescription: 'CreatifyBD is an elite creative partner for brands globally. Get high-end social media management, brand design, video editing, and website creation at up to 50% lower cost than standard agency rates.',
    defaultKeywords: 'creative agency, global design subscription, social media management, graphic design, video editing, website design, brand identity, digital marketing, CreatifyBD',
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
    getProposal: 'Get a Free Proposal',
    startProject: 'Start a Project',
    viewPortfolio: 'View Our Work',
    contactWhatsApp: 'Contact on WhatsApp',
    proceedToPayment: 'Proceed to Manual Payment'
  }
};

export default siteConfig;

