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

  targetMarkets: ['USA', 'Canada', 'Australia'],
  
  // Social Media Links
  socialLinks: {
    facebook: 'https://www.facebook.com/creatifybd',
    instagram: 'https://www.instagram.com/creatifybd',
    linkedin: 'https://www.linkedin.com/company/creatifybd',
    behance: '',
    youtube: ''
  },
  
  // Payment Information - Payoneer
  payoneer: {
    accountName: 'MD ALAMIN ALI',
    paymentLink: 'https://link.payoneer.com/Token?t=AC58688EFC1E47B885A7ED5E30B9AC16&src=pl',
    currency: 'USD',
    note: 'Enter the exact amount from your order confirmation. Add your Order ID (e.g. CBD-1234567) in the payment note.',
    placeholder: false
  },

  // Payment Information - DBBL Bank Transfer
  dbbl: {
    bankName: 'Dutch Bangla Bank Limited',
    accountName: 'MD ALAMIN ALI',
    accountNumber: '1241580001138',
    branch: 'Netaiganj Branch',
    routingNumber: '090274996',
    paymentReference: 'Client Name / Project Name',
    placeholder: false
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
    defaultTitle: 'CreatifyBD | Best Digital Marketing Agency | Social Media Management, Graphic Design, Video Editing',
    defaultDescription: 'CreatifyBD is the best digital marketing agency and creative agency offering social media management, graphic design service, video editing service, and digital marketing service for USA, Canada, and Australia. Hire the best marketing agency for your brand.',
    defaultKeywords: 'CreatifyBD, Creatify BD, creatify bd, creative agency, digital marketing agency, marketing agency, best marketing agency, social media management, social media manager, graphic design service, video editing service, digital marketing service, social media marketing agency, creative design agency, best graphic design service, professional video editing, social media management USA, digital marketing Canada, creative agency Australia, social media marketing company, graphic design agency, video production company, web design agency, content marketing agency, branding agency, online marketing agency',
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

