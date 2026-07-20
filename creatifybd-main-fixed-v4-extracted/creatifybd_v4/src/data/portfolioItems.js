const base = '/assets/portfolio';

const descriptions = {
  social: 'A complete social media management concept with content pillars, branded post systems, visual direction, and performance-ready presentation for international audiences.',
  branding: 'A polished brand identity system covering logo direction, typography, color palette, collateral, product mockups, and launch-ready visual assets.',
  marketing: 'A digital marketing campaign board showing channel strategy, funnel planning, performance metrics, landing visuals, and conversion-focused creative direction.',
  video: 'A video production and editing concept with campaign frames, thumbnail direction, motion storyboards, platform formats, and polished launch presentation.',
  web: 'A responsive website design concept with desktop and mobile layouts, conversion sections, content hierarchy, and premium visual design.',
  packaging: 'A production-ready packaging concept combining shelf impact, clear hierarchy, premium mockups, and a cohesive visual system across every product touchpoint.',
  apparel: 'A complete apparel graphic concept with original artwork, garment mockups, print placement, supporting brand details, and retail-ready presentation.'
};

const serviceLabels = {
  social: 'Social Media Management',
  branding: 'Branding & Logo Design',
  marketing: 'Digital Marketing',
  video: 'Video Editing',
  web: 'Website Design',
  packaging: 'Product Packaging Design',
  apparel: 'T-Shirt Design'
};

const folderByCategory = {
  social: 'social-media-management',
  branding: 'logo-design-branding',
  marketing: 'digital-marketing',
  video: 'video-editing',
  web: 'website-design',
  packaging: 'product-packaging-design',
  apparel: 't-shirt-design'
};

const tagsByCategory = {
  social: ['social media manager', 'content calendar', 'brand content', 'instagram marketing'],
  branding: ['logo design', 'brand identity', 'visual identity', 'brand guidelines'],
  marketing: ['digital marketing', 'performance marketing', 'lead generation', 'campaign strategy'],
  video: ['video editing', 'promo video', 'short-form video', 'motion creative'],
  web: ['website design', 'landing page', 'responsive UI', 'conversion design'],
  packaging: ['packaging design', 'product branding', 'label design', 'retail packaging'],
  apparel: ['t-shirt design', 'apparel graphics', 'merchandise design', 'print design']
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
    'Skincare Brand Identity',
    'Fintech Brand System',
    'Restaurant Visual Identity',
    'Hospitality Branding',
    'Pet care Brand Kit',
    'Sustainable retail Brand Identity',
    'Interior design Brand System',
    'Fitness Visual Identity',
    'Floral retail Branding',
    'SaaS Brand Kit',
    'Fashion Brand Identity',
    'Natural products Brand System',
    'Cybersecurity Visual Identity',
    'Bakery Branding',
    'Education Brand Kit',
    'Real estate Brand Identity',
    'Wellness Brand System',
    'Travel Visual Identity',
    'Coffee Branding',
    'Lifestyle retail Brand Kit',
    'Spa Brand Identity',
    'Technology Brand System',
    'Property Visual Identity',
    'Luxury retreat Branding',
    'Beauty Brand Kit',
    'Education technology Brand Identity',
    'Architecture Brand System',
    'Dental care Visual Identity',
    'Solar energy Branding',
    'Hotel Brand Kit',
    'Restaurant Brand Identity',
    'Finance Brand System',
    'Dental wellness Visual Identity',
    'Real estate Branding',
    'Beauty packaging Brand Kit',
    'Property Brand Identity',
    'Hospitality Brand System',
    'Recruitment Visual Identity',
    'Energy Branding',
    'Luxury estate Brand Kit',
    'Premium Logo & Brand Identity Collection'
  ], ['Skincare', 'Fintech', 'Restaurant', 'Hospitality', 'Pet care', 'Sustainable retail', 'Interior design', 'Fitness', 'Floral retail', 'SaaS', 'Fashion', 'Natural products', 'Cybersecurity', 'Bakery', 'Education', 'Real estate', 'Wellness', 'Travel', 'Coffee', 'Lifestyle retail', 'Spa', 'Technology', 'Property', 'Luxury retreat', 'Beauty', 'Education technology', 'Architecture', 'Dental care', 'Solar energy', 'Hotel', 'Restaurant', 'Finance', 'Dental wellness', 'Real estate', 'Beauty packaging', 'Property', 'Hospitality', 'Recruitment', 'Energy', 'Luxury estate', 'Multi-industry brand identity']),

  ...makeItems('packaging', [
    'Coffee Packaging Design',
    'Skincare Packaging System',
    'Herbal tea Product Packaging',
    'Energy drinks Packaging Design',
    'Healthy food Packaging System',
    'Laundry care Product Packaging',
    'Confectionery Packaging Design',
    'Spices Packaging System',
    'Pet care Product Packaging',
    'Supplements Packaging Design',
    'Botanical skincare Packaging System',
    'Coffee Product Packaging',
    'Tea Packaging Design',
    'Honey Packaging System',
    'Laundry care Product Packaging',
    'Energy drinks Packaging Design',
    'Baby care Packaging System',
    'Pet care Product Packaging',
    'Culinary spices Packaging Design',
    'Home fragrance Packaging System',
    'Honey Product Packaging',
    'Men grooming Packaging Design',
    'Baby care Packaging System',
    'Pasta Product Packaging',
    'Fragrance Packaging Design',
    'Functional beverages Packaging System',
    'Home care Product Packaging',
    'Snacks Packaging Design',
    'Ice cream Packaging System',
    'Supplements Product Packaging'
  ], ['Coffee', 'Skincare', 'Herbal tea', 'Energy drinks', 'Healthy food', 'Laundry care', 'Confectionery', 'Spices', 'Pet care', 'Supplements', 'Botanical skincare', 'Coffee', 'Tea', 'Honey', 'Laundry care', 'Energy drinks', 'Baby care', 'Pet care', 'Culinary spices', 'Home fragrance', 'Honey', 'Men grooming', 'Baby care', 'Pasta', 'Fragrance', 'Functional beverages', 'Home care', 'Snacks', 'Ice cream', 'Supplements']),

  ...makeItems('apparel', [
    'Streetwear Apparel Design',
    'Fitness T-Shirt Design',
    'Resort merchandise Merchandise Design',
    'Kids apparel Apparel Design',
    'Sustainable fashion T-Shirt Design',
    'Cafe merchandise Merchandise Design',
    'Festival merchandise Apparel Design',
    'Minimal fashion T-Shirt Design',
    'Outdoor lifestyle Merchandise Design',
    'Collegiate apparel Apparel Design',
    'Streetwear T-Shirt Design',
    'Minimal fashion Merchandise Design',
    'Travel lifestyle Apparel Design',
    'Athletic wear T-Shirt Design',
    'Lifestyle fashion Merchandise Design',
    'Music merchandise Apparel Design',
    'Outdoor lifestyle T-Shirt Design',
    'Cafe merchandise Merchandise Design',
    'Esports Apparel Design',
    'Corporate apparel T-Shirt Design'
  ], ['Streetwear', 'Fitness', 'Resort merchandise', 'Kids apparel', 'Sustainable fashion', 'Cafe merchandise', 'Festival merchandise', 'Minimal fashion', 'Outdoor lifestyle', 'Collegiate apparel', 'Streetwear', 'Minimal fashion', 'Travel lifestyle', 'Athletic wear', 'Lifestyle fashion', 'Music merchandise', 'Outdoor lifestyle', 'Cafe merchandise', 'Esports', 'Corporate apparel']),

  ...makeItems('social', [
    'Travel Social Media System',
    'Wellness Content Calendar',
    'Coffee Social Media Management',
    'Fashion Social Media System',
    'Education Content Calendar',
    'Real estate Social Media Management',
    'Cybersecurity Social Media System',
    'Bakery Content Calendar',
    'Luxury fashion Social Media Management',
    'Natural products Social Media System'
  ], ['Travel', 'Wellness', 'Coffee', 'Fashion', 'Education', 'Real estate', 'Cybersecurity', 'Bakery', 'Luxury fashion', 'Natural products']),

  ...makeItems('video', [
    'SaaS Video Campaign',
    'Real estate Video Series',
    'Restaurant Promo Video',
    'Beauty Video Campaign',
    'Travel Video Series',
    'Fitness Promo Video',
    'Fashion Video Campaign',
    'Children education Video Series',
    'Podcast Promo Video',
    'Automotive Video Campaign'
  ], ['SaaS', 'Real estate', 'Restaurant', 'Beauty', 'Travel', 'Fitness', 'Fashion', 'Children education', 'Podcast', 'Automotive']),

  ...makeItems('web', [
    'Interior design Website Design',
    'Finance Website UI',
    'Skincare ecommerce Landing Page Design',
    'Education Website Design',
    'Travel booking Website UI',
    'Legal services Landing Page Design',
    'Restaurant Website Design',
    'Real estate Website UI',
    'Solar energy Landing Page Design',
    'Dental care Website Design'
  ], ['Interior design', 'Finance', 'Skincare ecommerce', 'Education', 'Travel booking', 'Legal services', 'Restaurant', 'Real estate', 'Solar energy', 'Dental care'])
];

export default CURATED_PORTFOLIO;
