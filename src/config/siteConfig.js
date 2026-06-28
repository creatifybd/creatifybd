// CreatifyBD Site Configuration
// Update these values as needed for your business

export const siteConfig = {
  // Business Information
  businessName: 'CreatifyBD',
  websiteUrl: 'https://creatifybd.com',
  email: 'hello@creatifybd.com',
  phone: '+880 1951 676600',
  whatsappNumber: '+8801951676600',
  address: 'Dhaka, Bangladesh',
  
  // Social Media Links
  socialLinks: {
    facebook: 'https://www.facebook.com/creatifybd',
    instagram: 'https://www.instagram.com/creatifybd',
    linkedin: 'https://www.linkedin.com/company/creatifybd',
    twitter: 'https://twitter.com/creatifybd'
  },
  
  // Payment Information - Payoneer
  payoneer: {
    accountName: 'CreatifyBD / [Your Name]', // Update with actual account name
    email: 'payments@creatifybd.com', // Update with actual Payoneer email
    currency: 'USD',
    note: 'Please include your name or project name in the payment note if possible.'
  },
  
  // Payment Information - DBBL Bank Transfer
  dbbl: {
    bankName: 'Dutch-Bangla Bank Limited',
    accountName: 'CreatifyBD / [Your Name]', // Update with actual account name
    accountNumber: 'XXXXXXXXXXXX', // Update with actual account number
    branch: 'Dhaka Main Branch', // Update with actual branch
    routingNumber: 'XXXXXXXX', // Update with actual routing number if available
    paymentReference: 'Client Name / Project Name'
  },
  
  // Payment Instructions
  paymentInstructions: {
    verificationTime: 'Usually within 24 hours after submitting valid payment proof.',
    proofRequirements: 'Transaction ID, amount, payment date, and screenshot or receipt.',
    supportEmail: 'hello@creatifybd.com'
  },
  
  // Admin Information
  adminEmail: 'binashad7@gmail.com',
  
  // SEO Configuration
  seo: {
    defaultTitle: 'CreatifyBD | Digital Marketing, Branding & Creative Agency in Dhaka',
    defaultDescription: 'CreatifyBD helps brands grow through digital marketing, branding, social media management, web development, photography, videography and creative content production.',
    defaultKeywords: 'digital marketing agency dhaka, creative agency bangladesh, web design dhaka, branding agency bangladesh, social media marketing, content production, seo services',
    canonicalUrl: 'https://creatifybd.com'
  },
  
  // WhatsApp Message Template
  whatsappMessage: 'Hello CreatifyBD, I want to discuss a project.',
  
  // Services List (for dropdowns and forms)
  services: [
    'Social Media Marketing',
    'Branding & Creative Design',
    'Web Design & Development',
    'Content Production',
    'SEO & Performance Marketing',
    'Photography & Videography',
    'Digital Marketing Strategy',
    'Other'
  ],
  
  // Budget Ranges (for contact form)
  budgetRanges: [
    { value: '5k-10k', label: '৳5,000 - ৳10,000' },
    { value: '10k-30k', label: '৳10,000 - ৳30,000' },
    { value: '30k-50k', label: '৳30,000 - ৳50,000' },
    { value: '50k-100k', label: '৳50,000 - ৳100,000' },
    { value: '100k+', label: '৳100,000+' }
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
