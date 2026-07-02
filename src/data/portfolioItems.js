const base = '/assets/portfolio';

const descriptions = {
  social: 'A complete social media management concept with content pillars, branded post systems, visual direction, and performance-ready presentation for international audiences.',
  branding: 'A polished brand identity system covering logo direction, typography, color palette, collateral, product mockups, and launch-ready visual assets.',
  marketing: 'A digital marketing campaign board showing channel strategy, funnel planning, performance metrics, landing visuals, and conversion-focused creative direction.',
  video: 'A video production and editing concept with campaign frames, thumbnail direction, motion storyboards, platform formats, and polished launch presentation.',
  web: 'A responsive website design concept with desktop and mobile layouts, conversion sections, content hierarchy, and premium visual design.'
};

const serviceLabels = {
  social: 'Social Media Management',
  branding: 'Branding & Logo Design',
  marketing: 'Digital Marketing',
  video: 'Video Editing',
  web: 'Website Design'
};

const folderByCategory = {
  social: 'social-media-management',
  branding: 'logo-design-branding',
  marketing: 'digital-marketing',
  video: 'video-editing',
  web: 'website-design'
};

const tagsByCategory = {
  social: ['social media manager', 'content calendar', 'brand content', 'instagram marketing'],
  branding: ['logo design', 'brand identity', 'visual identity', 'brand guidelines'],
  marketing: ['digital marketing', 'performance marketing', 'lead generation', 'campaign strategy'],
  video: ['video editing', 'promo video', 'short-form video', 'motion creative'],
  web: ['website design', 'landing page', 'responsive UI', 'conversion design']
};

const makeItems = (category, titles, industries = []) => {
  const folder = folderByCategory[category];
  return titles.map((title, index) => {
    const number = String(index + 1).padStart(2, '0');
    const service = serviceLabels[category];
    const industry = industries[index] || 'Brand growth';
    return {
      id: `${folder}-${number}`,
      title,
      category,
      service,
      industry,
      image: `${base}/${folder}/${folder}-${number}.jpg`,
      description: `${descriptions[category]} Focus: ${industry.toLowerCase()}.`,
      seoTitle: `${title} | ${service} Portfolio | CreatifyBD`,
      seoDescription: `${title} by CreatifyBD, a premium ${service.toLowerCase()} portfolio project for ambitious global brands.`,
      tags: tagsByCategory[category]
    };
  });
};

export const CURATED_PORTFOLIO = [
  ...makeItems('marketing', [
    'Beauty Brand Digital Growth Campaign',
    'Demand Generation System for SaaS',
    'Property Sales Digital Marketing Campaign',
    'Restaurant Local Growth Campaign',
    'Education Enrollment Marketing Funnel',
    'Fitness Performance Marketing Dashboard',
    'Travel Booking Digital Campaign',
    'Healthcare Lead Generation System',
    'Fintech Product Growth Campaign',
    'Fashion Brand Digital Growth Plan'
  ], ['Beauty and skincare', 'SaaS demand generation', 'Real estate sales', 'Restaurant marketing', 'Education enrollment', 'Fitness performance', 'Travel bookings', 'Healthcare leads', 'Fintech growth', 'Fashion ecommerce']),

  ...makeItems('branding', [
    'Aurevia Skincare Brand Identity',
    'NexoPay Fintech Brand System',
    'Brasa Fire Restaurant Identity',
    'Harbor & Pine Hospitality Branding',
    'Petello Pet Care Brand Identity',
    'Arbora Sustainable Home Brand',
    'Vetro Atelier Interior Studio Identity',
    'PulsePeak Performance Brand Kit',
    'Bloom Floral Boutique Identity',
    'NovaGrid SaaS Identity System',
    'Solenne Luxury Fashion Identity',
    'Verdura Natural Goods Branding',
    'SentriCore Cybersecurity Brand System',
    'Crumb & Hearth Bakery Branding',
    'BrightNest Education Brand Kit',
    'NorthVale Real Estate Identity',
    'Lunora Wellness Brand System',
    'Atlas Ascent Travel Brand Identity',
    'Roast Harbor Coffee Identity',
    'Avenlo Lifestyle Retail Branding',
    'Veloura Spa Brand Identity',
    'Fluxora Tech Product Identity',
    'MaxCrest Property Brand System',
    'Veridra Luxury Retreat Branding',
    'Lisselle Beauty Brand Identity',
    'NextBloom Education Platform Branding',
    'Stonecrest Architecture Identity',
    'PureNest Dental Wellness Brand',
    'HelioGrid Solar Energy Brand',
    'Hartwell Hospitality Identity',
    'Savora Restaurant Brand System',
    'Finexa Finance App Brand Kit',
    'PureSet Dental Brand System',
    'Monvero Real Estate Brand Identity',
    'Aurelix Beauty Packaging System',
    'Stonecove Property Brand Identity',
    'Hartwell Hotel Experience Branding',
    'TalentBridge Hiring Platform Branding',
    'HelioCore Energy Brand System',
    'Verdora Estate Retreat Branding'
  ], ['Skincare', 'Fintech', 'Restaurant', 'Hospitality', 'Pet care', 'Sustainable retail', 'Interior design', 'Fitness', 'Floral retail', 'SaaS', 'Fashion', 'Natural products', 'Cybersecurity', 'Bakery', 'Education', 'Real estate', 'Wellness', 'Travel', 'Coffee', 'Lifestyle retail', 'Spa', 'Technology', 'Property', 'Luxury retreat', 'Beauty', 'Education technology', 'Architecture', 'Dental care', 'Solar energy', 'Hotel', 'Restaurant', 'Finance', 'Dental wellness', 'Real estate', 'Beauty packaging', 'Property', 'Hospitality', 'Recruitment', 'Energy', 'Luxury estate']),

  ...makeItems('social', [
    'Atlas Ascent Travel Social Media System',
    'Lunora Wellness Content Calendar',
    'Roast Harbor Coffee Community Campaign',
    'Avenlo Fashion Social Media Management',
    'BrightNest Education Social Growth Kit',
    'NorthVale Real Estate Social Campaign',
    'SentriCore Cybersecurity Content Plan',
    'Crumb & Hearth Bakery Content Calendar',
    'Solenne Luxury Fashion Social Presence',
    'Verdura Natural Product Social Kit'
  ], ['Travel', 'Wellness', 'Coffee', 'Fashion', 'Education', 'Real estate', 'Cybersecurity', 'Bakery', 'Luxury fashion', 'Natural products']),

  ...makeItems('video', [
    'SaaS Product Launch Motion Campaign',
    'Cinematic Real Estate Walkthrough Series',
    'Ember Table Restaurant Storytelling Video',
    'Veloura Skin Beauty Video Campaign',
    'Atlas Drift Journey Video Series',
    'Iron Pulse Fitness Promo Edits',
    'Noir Avenue Fashion Editorial Video',
    'SparkBloom Kids Explainer Campaign',
    'Signal Room Podcast Video System',
    'Vanta Velocity Automotive Promo'
  ], ['SaaS', 'Real estate', 'Restaurant', 'Beauty', 'Travel', 'Fitness', 'Fashion', 'Children education', 'Podcast', 'Automotive']),

  ...makeItems('web', [
    'NovaNest Interior Design Website',
    'Finexa Finance Growth Dashboard',
    'Solara Skin Ecommerce Website',
    'Eduvora Learning Platform UI',
    'Tripora Travel Booking Website',
    'Lexford & Co Legal Website',
    'Savora Restaurant Website',
    'UrbanAxis Real Estate Website',
    'GreenGrid Solar Landing Page',
    'Mediora Dental Clinic Website'
  ], ['Interior design', 'Finance', 'Skincare ecommerce', 'Education', 'Travel booking', 'Legal services', 'Restaurant', 'Real estate', 'Solar energy', 'Dental care'])
];

export default CURATED_PORTFOLIO;
