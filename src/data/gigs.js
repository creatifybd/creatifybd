// CreatifyBD Gig Database
// 18 Initial production-ready services

export const categories = {
  'social-media-management': {
    name: 'Social Media Management',
    slug: 'social-media-management',
    desc: 'Grow your business with premium social content, calendars, and strategies.',
    icon: '📱'
  },
  'graphic-design': {
    name: 'Graphic Design',
    slug: 'graphic-design',
    desc: 'Premium branding, logos, posters, and visual identities.',
    icon: '🎨'
  },
  'video-editing': {
    name: 'Video Editing',
    slug: 'video-editing',
    desc: 'Cinematic reels, YouTube edits, and high-converting video ads.',
    icon: '🎬'
  },
  'website-design': {
    name: 'Website Design',
    slug: 'website-design',
    desc: 'Stunning landing pages and full business websites optimized for conversions.',
    icon: '💻'
  }
};

export const gigs = [
  // --- Social Media Management ---
  {
    id: 'smm-monthly',
    slug: 'monthly-social-media-management',
    legacySlugs: ['monthly-social-media-management-small-business'],
    title: 'Complete Social Media Management & Brand Growth Retainer',
    shortTitle: 'Monthly Social Media Management',
    category: 'social-media-management',
    subcategory: 'Full Management',
    overview: 'Full-service monthly content creation, design, scheduling, and strategic growth for your brand.',
    description: 'Stop wasting 15+ hours a week struggling to design posts, write captions, and stay consistent. We take full responsibility for your social media channels. From custom high-conversion post graphics to caption copywriting, SEO-optimized hashtag strategies, and content calendars — we handle it all. By operating on a modern, meeting-free productized model, we deliver international agency-grade work at up to 40% less than traditional retainer costs. Perfect for founders looking to build serious brand authority.',
    whoIsThisFor: 'Global startups, SaaS companies, founders, e-commerce brands, and agency owners seeking elite social presence with zero management hassle.',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&h=400&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 24,
    startingPrice: 299,
    packages: {
      basic: {
        name: 'Starter Growth (Save 40%)',
        price: 299,
        deliveryTime: 30,
        revisions: 3,
        deliverables: [
          '12 Custom Visual Post Designs',
          'Caption Copywriting & Hashtags',
          'Complete Content Calendar Planning',
          '1 Platform Optimization & Setup',
          'Elite Quality (40% below standard $500/mo)'
        ],
        features: { platforms: 1, postings: 12, strategy: true, reporting: false }
      },
      standard: {
        name: 'Business Pro (Save 41%)',
        price: 499,
        deliveryTime: 30,
        revisions: 5,
        deliverables: [
          '20 Premium Posts (Grid + Stories)',
          'Reels Video Scripting & Templates',
          'Caption Copywriting & SEO Hashtags',
          '2 Platforms Full Management',
          'Monthly Performance & Growth Report',
          'Premium Value (41% below standard $850/mo)'
        ],
        features: { platforms: 2, postings: 20, strategy: true, reporting: true }
      },
      premium: {
        name: 'Ultimate Scale (Save 41%)',
        price: 799,
        deliveryTime: 30,
        revisions: 10,
        deliverables: [
          '30 Custom Post / Carousel Designs',
          '5 Short-form Video Reels included',
          'Full Strategy & Copywriting',
          '3 Platforms Full Management',
          'Dedicated Creative Manager',
          'Bi-weekly Review & Strategy Call',
          'Enterprise Quality (41% below standard $1,350/mo)'
        ],
        features: { platforms: 3, postings: 35, strategy: true, reporting: true }
      }
    },
    faqs: [
      { question: 'Which platforms do you manage?', answer: 'We primarily manage Facebook, Instagram, LinkedIn, and Pinterest. We can also handle Twitter/X or TikTok depending on your custom needs.' },
      { question: 'How is the content approved?', answer: 'We create a content calendar draft for the entire month. We do not publish anything without your direct review and approval.' }
    ],
    requirements: [
      'Social media page access or credentials details.',
      'Brand assets (logo, font settings, raw images).',
      'Target audience guidelines and competitor accounts.'
    ],
    revisionPolicy: 'Revisions cover alignment edits to post designs and captions. Complete topic changes after draft approval may incur additional costs.',
    tags: ['smm', 'social media management', 'content calendar', 'facebook marketing'],
    industries: ['Real Estate', 'E-commerce', 'Coaches', 'Clinics', 'Restaurants'],
    relatedGigs: ['brand-launch-social-media-kit', 'social-media-poster-design', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 'smm-fb-page',
    slug: 'facebook-page-management',
    title: 'Facebook Page Management & Content Strategy',
    shortTitle: 'Facebook Page Management',
    category: 'social-media-management',
    subcategory: 'Facebook',
    overview: 'Grow your business page reach and build a community on Facebook.',
    description: 'A professional Facebook page is essential for local trust. We structure your page info, design high-impact cover layouts, and write high-converting copy that turns visitors into local customers.',
    whoIsThisFor: 'Local services, clinics, law firms, restaurants, and local brick-and-mortar brands.',
    galleryImages: [
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 16,
    startingPrice: 199,
    packages: {
      basic: {
        name: 'Basic Presence',
        price: 199,
        deliveryTime: 14,
        revisions: 2,
        deliverables: ['8 Posts', 'Page Setup Optimization', 'Custom Cover Image'],
        features: { posts: 8, setup: true, analytics: false }
      },
      standard: {
        name: 'Engagement Boost',
        price: 349,
        deliveryTime: 30,
        revisions: 4,
        deliverables: ['15 Posts', 'Custom Cover & Profile graphics', 'Basic Ad Setup Support', 'Community Engagement Moderation'],
        features: { posts: 15, setup: true, analytics: true }
      },
      premium: {
        name: 'Authority Build',
        price: 549,
        deliveryTime: 30,
        revisions: 6,
        deliverables: ['25 Posts', 'Cover & Brand Guidelines', 'Full Ad Creatives (3 ads)', 'Monthly Review Call'],
        features: { posts: 25, setup: true, analytics: true }
      }
    },
    faqs: [
      { question: 'Do you run paid Facebook Ads?', answer: 'Yes, we design the ad creatives and copy. Advanced campaign setup is available as an extra add-on.' }
    ],
    requirements: ['Facebook page admin access.', 'Logo and brief company info.'],
    revisionPolicy: 'Free text and graphic adjustments during drafting phase.',
    tags: ['facebook page', 'facebook posts', 'social media management', 'local business'],
    industries: ['Local Services', 'Restaurants', 'Clinics', 'Law Firms'],
    relatedGigs: ['monthly-social-media-management', 'brand-launch-social-media-kit'],
    status: 'active'
  },
  {
    id: 'smm-instagram',
    slug: 'instagram-content-management',
    title: 'Premium Instagram Grid & Content Management',
    shortTitle: 'Instagram Content Management',
    category: 'social-media-management',
    subcategory: 'Instagram',
    overview: 'Aesthetic grid layout, stories, and reels strategies for Instagram.',
    description: 'Instagram is a visual portfolio. We design gorgeous aesthetic grids, highlight icons, stories, and write engaging captions that turn followers into brand advocates.',
    whoIsThisFor: 'E-commerce, lifestyle brands, fashion, cosmetics, and designers.',
    galleryImages: [
      'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.8,
    reviewCount: 19,
    startingPrice: 220,
    packages: {
      basic: {
        name: 'Aesthetic Grid Starter',
        price: 220,
        deliveryTime: 14,
        revisions: 3,
        deliverables: ['9 Grid Posts (3x3 layout)', 'Hashtag Set', 'Highlight Cover Designs'],
        features: { posts: 9, highlights: 3 }
      },
      standard: {
        name: 'Instagram Pro Grid',
        price: 399,
        deliveryTime: 30,
        revisions: 5,
        deliverables: ['18 Aesthetic Posts', '3 Reels Video Concept Scripts', 'Story Templates'],
        features: { posts: 18, highlights: 6 }
      },
      premium: {
        name: 'Ultimate Insta-Growth',
        price: 649,
        deliveryTime: 30,
        revisions: 8,
        deliverables: ['30 Posts (Grid & Carousels)', '8 Reels templates', 'Hashtag sets + Competitor audits', 'Weekly engagement check'],
        features: { posts: 30, highlights: 9 }
      }
    },
    faqs: [
      { question: 'Do you schedule the posts?', answer: 'Yes, we schedule using Meta Business Suite, Buffer, or Later depending on your preference.' }
    ],
    requirements: ['Instagram account credentials or Facebook page connection.', 'High-res product images.'],
    revisionPolicy: 'Unlimited aesthetic adjustments during concept drafting stage.',
    tags: ['instagram content', 'instagram grid', 'aesthetic posts', 'social design'],
    industries: ['E-commerce', 'Fashion', 'Beauty', 'Coaches'],
    relatedGigs: ['monthly-social-media-management', 'vector-illustration'],
    status: 'active'
  },
  {
    id: 'smm-brand-kit',
    slug: 'brand-launch-social-media-kit',
    title: 'Complete Brand Launch Social Media Kit',
    shortTitle: 'Brand Launch Kit',
    category: 'social-media-management',
    subcategory: 'Kit',
    overview: 'Full social channels setup and cohesive launch content bundle.',
    description: 'Launching a new business? Set up your platforms professionally from day one. Get cohesive headers, profile designs, highlight templates, and post templates for a consistent launch look.',
    whoIsThisFor: 'New startups, brand refreshes, and newly launched websites.',
    galleryImages: [
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 11,
    startingPrice: 179,
    packages: {
      basic: {
        name: 'Starter Kit',
        price: 179,
        deliveryTime: 7,
        revisions: 2,
        deliverables: ['Profile & Cover Designs (2 channels)', '6 Launch Post Graphics', 'Brand Assets Export'],
        features: { channels: 2, posts: 6 }
      },
      standard: {
        name: 'Brand Launch Pack',
        price: 299,
        deliveryTime: 12,
        revisions: 4,
        deliverables: ['Profile & Cover Designs (4 channels)', '12 Launch Post Graphics', 'Highlight Icons', 'Launch Caption Templates'],
        features: { channels: 4, posts: 12 }
      },
      premium: {
        name: 'Omnichannel Enterprise',
        price: 499,
        deliveryTime: 18,
        revisions: 6,
        deliverables: ['Cohesive banners for 6 platforms', '20 Post Graphics', 'Custom Canva editable templates', 'Brand Style Guide PDF'],
        features: { channels: 6, posts: 20 }
      }
    },
    faqs: [
      { question: 'Do you write the bio/about text?', answer: 'Yes! All packages include writing optimized bios/taglines for your target audience.' }
    ],
    requirements: ['Business logo', 'Target colors or preferences', 'Brief description of services/products.'],
    revisionPolicy: 'Revisions include layout color adjustments and logo positioning adjustments.',
    tags: ['brand launch', 'social media kit', 'canva templates', 'profile design'],
    industries: ['Startups', 'Personal Brands', 'Coaches', 'Agencies'],
    relatedGigs: ['brand-identity-design', 'professional-logo-design'],
    status: 'active'
  },

  // --- Graphic Design ---
  {
    id: 'gd-logo',
    slug: 'professional-logo-design',
    title: 'Premium Professional Logo Design Services',
    shortTitle: 'Professional Logo Design',
    category: 'graphic-design',
    subcategory: 'Logo',
    overview: 'High-end vector logos representing your brand identity.',
    description: 'Your logo is the first impression of your brand. We create clean, memorable, premium vector logo layouts tailored to capture your value statement instantly.',
    whoIsThisFor: 'Businesses needing a custom, non-template logo that reflects corporate authority.',
    galleryImages: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 38,
    startingPrice: 99,
    packages: {
      basic: {
        name: 'Basic Concept',
        price: 99,
        deliveryTime: 4,
        revisions: 3,
        deliverables: ['2 Logo Concepts', 'High-res Transparent PNG/JPEG', 'Color & Monochrome versions'],
        features: { concepts: 2, vector: false, stationary: false }
      },
      standard: {
        name: 'Professional Vector',
        price: 179,
        deliveryTime: 6,
        revisions: 5,
        deliverables: ['3 Premium Logo Concepts', 'Vector Source Files (AI/EPS/PDF)', 'Favicon Icon', 'Commercial Rights'],
        features: { concepts: 3, vector: true, stationary: false }
      },
      premium: {
        name: 'Enterprise Logo Kit',
        price: 299,
        deliveryTime: 8,
        revisions: 10,
        deliverables: ['5 Concepts', 'Vector Files + Print formats', 'Stationery kit designs (business card, letterhead)', '3D Mockups'],
        features: { concepts: 5, vector: true, stationary: true }
      }
    },
    faqs: [
      { question: 'What file formats do you deliver?', answer: 'We deliver AI, EPS, SVG, PDF, high-res PNG, and JPEG formats.' }
    ],
    requirements: ['Business Name', 'Slogan (if any)', 'Industry/Target Audience', 'Color Preferences', 'Style references (minimalist, bold, classic, etc.)'],
    revisionPolicy: 'We work closely on concept refining. Revisions cover shape adjustments, typography changes, and color switches.',
    tags: ['logo design', 'vector logo', 'branding', 'business logo'],
    industries: ['Real Estate', 'Law Firms', 'E-commerce', 'Clinics', 'Restaurants'],
    relatedGigs: ['brand-identity-design', 'social-media-poster-design'],
    status: 'active'
  },
  {
    id: 'gd-poster',
    slug: 'social-media-poster-design',
    title: 'Custom Social Media Poster & Banner Design',
    shortTitle: 'Social Media Poster Design',
    category: 'graphic-design',
    subcategory: 'Poster',
    overview: 'Eye-catching posters, ads, and banners for promotion.',
    description: 'Transform your marketing with high-converting custom banners and poster designs that stop the scroll. Ideal for promotions, offers, product launches, or events.',
    whoIsThisFor: 'Brands wanting premium ad creatives, events promotion, or marketing materials.',
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 22,
    startingPrice: 45,
    packages: {
      basic: {
        name: 'Single Poster',
        price: 45,
        deliveryTime: 2,
        revisions: 2,
        deliverables: ['1 High-res Custom Poster', 'JPG/PNG export', '1 Size variant (e.g. Square)'],
        features: { designs: 1, source: false }
      },
      standard: {
        name: 'Promo Pack',
        price: 119,
        deliveryTime: 4,
        revisions: 4,
        deliverables: ['3 Poster Designs', 'Resize for Stories/Banners', 'Source PSD/AI Files', 'High-res layouts'],
        features: { designs: 3, source: true }
      },
      premium: {
        name: 'Campaign Premium Pack',
        price: 199,
        deliveryTime: 6,
        revisions: 6,
        deliverables: ['6 Graphic Layouts', 'Full size variations for Stories/Ads/Printers', 'Custom illustrations if needed', 'Source files'],
        features: { designs: 6, source: true }
      }
    },
    faqs: [
      { question: 'Do you use templates?', answer: 'No. Every poster is custom designed from scratch using premium visual layout software.' }
    ],
    requirements: ['Exact text to show on poster', 'Logo assets', 'Target dimensions/platform', 'Images to include (optional)'],
    revisionPolicy: 'Covers minor layout, text and color adjustments.',
    tags: ['poster design', 'social ad design', 'banner graphics', 'flyer design'],
    industries: ['E-commerce', 'Events', 'Real Estate', 'Restaurants'],
    relatedGigs: ['youtube-thumbnail-design', 'business-flyer-design'],
    status: 'active'
  },
  {
    id: 'gd-thumbnail',
    slug: 'youtube-thumbnail-design',
    title: 'High-CTR YouTube Thumbnail Design Package',
    shortTitle: 'YouTube Thumbnail Design',
    category: 'graphic-design',
    subcategory: 'Thumbnails',
    overview: 'Attention-grabbing thumbnails that skyrocket your video CTR.',
    description: 'A great video with a poor thumbnail gets no views. We design hyper-engaging, high-contrast, attention-grabbing YouTube thumbnails tailored to capture clicks from global audiences.',
    whoIsThisFor: 'YouTubers, creators, business channels, and coaches seeking growth.',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 45,
    startingPrice: 35,
    packages: {
      basic: {
        name: 'Single Thumbnail',
        price: 35,
        deliveryTime: 2,
        revisions: 2,
        deliverables: ['1 Custom thumbnail design', 'Full HD 1080p format', 'Free stock background inclusion'],
        features: { count: 1, sources: false }
      },
      standard: {
        name: 'Creator Triad',
        price: 89,
        deliveryTime: 3,
        revisions: 4,
        deliverables: ['3 High-CTR Custom Thumbnails', 'Source Files (PSD/AI)', 'Unlimited stock components'],
        features: { count: 3, sources: true }
      },
      premium: {
        name: 'Pro YouTuber Pack',
        price: 199,
        deliveryTime: 7,
        revisions: 6,
        deliverables: ['8 Custom Thumbnails', 'VIP support & fast revisions', 'Competitor visual analysis', 'Editable templates'],
        features: { count: 8, sources: true }
      }
    },
    faqs: [
      { question: 'What is the format?', answer: 'Delivered in standard 1280x720 JPEG or PNG under 2MB, optimized for YouTube upload guidelines.' }
    ],
    requirements: ['Video Title / Hook Text', 'Reference images / Face photos of the creator', 'Preferred color theme or brand styling'],
    revisionPolicy: 'Text layout modifications, facial asset sizing adjustments, background adjustments.',
    tags: ['youtube thumbnail', 'CTR boost', 'video graphic', 'youtube growth'],
    industries: ['Creators', 'Coaches', 'Vloggers', 'Tech Reviewers'],
    relatedGigs: ['youtube-video-editing', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 'gd-illustration',
    slug: 'vector-illustration',
    title: 'Custom Flat and 3D Vector Illustration',
    shortTitle: 'Vector Illustration',
    category: 'graphic-design',
    subcategory: 'Illustration',
    overview: 'Bespoke illustrations for websites, apps, and branding.',
    description: 'Stand out from standard stock illustrations. We draw completely custom, eye-catching flat vectors or isometric icons to bring your brand assets, web landing page, or product pages to life.',
    whoIsThisFor: 'Web designers, software startups, apps, book covers, and creative agencies.',
    galleryImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.8,
    reviewCount: 14,
    startingPrice: 65,
    packages: {
      basic: {
        name: 'Single Character/Icon',
        price: 65,
        deliveryTime: 3,
        revisions: 3,
        deliverables: ['1 Custom Flat Vector Illustration', 'PNG/SVG transparent files', 'Color palette definitions'],
        features: { count: 1, background: false }
      },
      standard: {
        name: 'Full Scene Illustration',
        price: 149,
        deliveryTime: 5,
        revisions: 5,
        deliverables: ['1 Full scene vector (characters + background)', 'Source Vector (AI/EPS)', 'Commercial license'],
        features: { count: 1, background: true }
      },
      premium: {
        name: 'Illustration Asset Pack',
        price: 279,
        deliveryTime: 8,
        revisions: 7,
        deliverables: ['4 Matching theme illustrations / scenes', 'High-res print formats', 'Source files', 'Dedicated styling consultation'],
        features: { count: 4, background: true }
      }
    },
    faqs: [
      { question: 'Do you deliver SVG formats?', answer: 'Yes, all illustrations are created natively in vector formats and exported to editable SVG.' }
    ],
    requirements: ['Style references/sketches or style board', 'Theme description', 'Color scheme requirements'],
    revisionPolicy: 'Covers line alterations and color scheme updates.',
    tags: ['vector illustration', 'flat design', 'web illustration', 'svg graphic'],
    industries: ['Tech Startups', 'E-commerce', 'Agencies', 'Education'],
    relatedGigs: ['professional-logo-design', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 'gd-flyer',
    slug: 'business-flyer-design',
    title: 'Professional Corporate & Business Flyer Design',
    shortTitle: 'Business Flyer Design',
    category: 'graphic-design',
    subcategory: 'Flyers',
    overview: 'Sleek flyers, leaflets, and brochures to market your business offline.',
    description: 'Print materials need high visual rhythm and readability. We design premium business flyers, pamphlets, and hand-out brochures optimized to showcase your product features or services clearly.',
    whoIsThisFor: 'Real estate agents, clinics, restaurants, contractors, and local firms.',
    galleryImages: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 20,
    startingPrice: 55,
    packages: {
      basic: {
        name: 'Single Page Flyer',
        price: 55,
        deliveryTime: 3,
        revisions: 2,
        deliverables: ['1-Sided flyer design', 'Print-ready PDF (CMYK)', 'High-res export'],
        features: { pages: 1, source: false }
      },
      standard: {
        name: 'Double-Sided Flyer',
        price: 99,
        deliveryTime: 4,
        revisions: 4,
        deliverables: ['2-Sided corporate flyer', 'Source AI/PSD file', 'Custom layout structures'],
        features: { pages: 2, source: true }
      },
      premium: {
        name: 'Tri-Fold Brochure',
        price: 189,
        deliveryTime: 6,
        revisions: 6,
        deliverables: ['6-Panel Tri-Fold Brochure', 'Source files', 'Free visual stock resources'],
        features: { pages: 6, source: true }
      }
    },
    faqs: [
      { question: 'Do you provide printing services?', answer: 'No, we deliver print-ready digital vector layouts (with proper bleed and trim lines) for any commercial printer.' }
    ],
    requirements: ['Final text content copy', 'Logo vectors', 'Page dimension requirements', 'Images to display'],
    revisionPolicy: 'Text copy edits, box sizing, and minor alignment edits.',
    tags: ['flyer design', 'business brochure', 'leaflet layout', 'cmyk print'],
    industries: ['Real Estate', 'Home Services', 'Clinics', 'Corporate'],
    relatedGigs: ['social-media-poster-design', 'brand-identity-design'],
    status: 'active'
  },
  {
    id: 'gd-brand-identity',
    slug: 'brand-identity-design',
    title: 'Complete Corporate Brand Identity Design Guidelines',
    shortTitle: 'Brand Identity Design',
    category: 'graphic-design',
    subcategory: 'Corporate Branding',
    overview: 'Full corporate brand guide containing typography, colors, and layout rules.',
    description: 'Ensure absolute brand consistency across print and digital media. We create your style guidelines: typography rules, primary/secondary color schemes, spacing patterns, asset use, and business assets templates.',
    whoIsThisFor: 'Established businesses looking to build a unified, premium corporate identity.',
    galleryImages: [
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 15,
    startingPrice: 350,
    packages: {
      basic: {
        name: 'Brand Style Sheet',
        price: 350,
        deliveryTime: 6,
        revisions: 3,
        deliverables: ['Color Palette (HEX/CMYK)', 'Typography Hierarchy Rules', 'Logo usage do/dont page', '1 Page Brand Card'],
        features: { pages: 1, guidelines: true }
      },
      standard: {
        name: 'Identity Guide Book',
        price: 599,
        deliveryTime: 12,
        revisions: 5,
        deliverables: ['12-Page Brand Book PDF', 'Logo Variants rules', 'Corporate business card & letterhead layouts', 'Matching Social banners (3 profiles)'],
        features: { pages: 12, guidelines: true }
      },
      premium: {
        name: 'Enterprise Guidelines',
        price: 999,
        deliveryTime: 20,
        revisions: 8,
        deliverables: ['24-Page Full Corporate Brand Guide', 'Stationery kit print templates', 'Email signature HTML', 'Presentation Slide templates', 'Commercial rights & raw templates source files'],
        features: { pages: 24, guidelines: true }
      }
    },
    faqs: [
      { question: 'Do I need a logo first?', answer: 'Yes. If you need a logo designed too, you can add it as a custom order or choose the premium package.' }
    ],
    requirements: ['Current logo file', 'Core company values or brand story', 'Target competitors and demographic description'],
    revisionPolicy: 'Covers details alignment, typographic layout scaling, and page modifications.',
    tags: ['brand identity', 'style guide', 'corporate identity', 'brand book'],
    industries: ['Corporate', 'Real Estate', 'Tech Startups', 'E-commerce'],
    relatedGigs: ['professional-logo-design', 'brand-launch-social-media-kit'],
    status: 'active'
  },

  // --- Video Editing ---
  {
    id: 've-reels',
    slug: 'short-form-reels-editing',
    title: 'Short-form Reels, TikTok & Shorts Video Editing',
    shortTitle: 'Short-form Reels Editing',
    category: 'video-editing',
    subcategory: 'Shorts',
    overview: 'High-engaging shorts, reels, and TikTok video editing with captions.',
    description: 'Short-form video is the king of attention. We edit raw footage into highly viral Reels, YouTube Shorts, and TikTok videos using cinematic sound effects, visual zooms, colorful captions, and overlays.',
    whoIsThisFor: 'Creators, coaches, influencers, real estate agents, and brands seeking reach.',
    galleryImages: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 52,
    startingPrice: 40,
    packages: {
      basic: {
        name: 'Single Reel Starter',
        price: 40,
        deliveryTime: 2,
        revisions: 2,
        deliverables: ['1 Video Edit (Up to 30s)', 'Alex Hormozi style text captions', 'Sound effects, transitions', '1080x1920 portrait format'],
        features: { count: 1, duration: 30, soundFX: true }
      },
      standard: {
        name: 'Creator Pack (5 Videos)',
        price: 179,
        deliveryTime: 5,
        revisions: 4,
        deliverables: ['5 Video Reels / Shorts (Up to 60s each)', 'Interactive caption styling & emojis', 'Zoom cuts, sound design, graphics overlays', 'Topic Hook scripting advice'],
        features: { count: 5, duration: 60, soundFX: true }
      },
      premium: {
        name: 'Viral Brand Scale (15 Videos)',
        price: 449,
        deliveryTime: 12,
        revisions: 6,
        deliverables: ['15 Reels edits', 'Color grading & audio cleaning', 'Eye-catching custom stock transitions', 'Thumbnail frames creation', 'Full platform tags & caption copy templates'],
        features: { count: 15, duration: 60, soundFX: true }
      }
    },
    faqs: [
      { question: 'Do you provide the raw footage?', answer: 'No, you must provide your raw video clips (talking head footage or screen recordings).' }
    ],
    requirements: ['Raw video files', 'Script or text to caption (optional)', 'Style preference (e.g. Hormozi style, clean style, cinematic style)'],
    revisionPolicy: 'Covers pacing cuts, subtitle corrections, and background track volume adjustments.',
    tags: ['reels editing', 'tiktok edit', 'youtube shorts', 'alex hormozi captions'],
    industries: ['Coaches', 'Real Estate', 'Creators', 'E-commerce'],
    relatedGigs: ['youtube-thumbnail-design', 'youtube-video-editing'],
    status: 'active'
  },
  {
    id: 've-yt',
    slug: 'youtube-video-editing',
    title: 'Professional YouTube Video Editing Services',
    shortTitle: 'YouTube Video Editing',
    category: 'video-editing',
    subcategory: 'YouTube',
    overview: 'High-quality landscape video editing for YouTube channels.',
    description: 'Keep your viewers hooked and increase watch time. We edit high-quality landscape videos for YouTube: transitions, B-roll integrations, sound design, and text call-outs.',
    whoIsThisFor: 'Vloggers, tech channels, business channels, and documentary creators.',
    galleryImages: [
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 31,
    startingPrice: 120,
    packages: {
      basic: {
        name: 'Vlog / Talking Head Starter',
        price: 120,
        deliveryTime: 4,
        revisions: 3,
        deliverables: ['Up to 5 minutes edited output', 'Clean cuts, noise reduction', 'Text titles, royalty-free background audio'],
        features: { duration: 5, bRoll: false, colorGrade: true }
      },
      standard: {
        name: 'Narrative Story / Tech Pro',
        price: 220,
        deliveryTime: 7,
        revisions: 5,
        deliverables: ['Up to 12 minutes edited output', 'B-roll footage integrations', 'Motion titles & call-outs', 'Advanced sound design & audio mixing'],
        features: { duration: 12, bRoll: true, colorGrade: true }
      },
      premium: {
        name: 'Cinematic Documentary',
        price: 399,
        deliveryTime: 12,
        revisions: 8,
        deliverables: ['Up to 25 minutes output', 'Professional color grading', 'Stock video overlays & custom assets creation', 'Full project files export optional'],
        features: { duration: 25, bRoll: true, colorGrade: true }
      }
    },
    faqs: [
      { question: 'What software do you edit in?', answer: 'We edit primarily in Adobe Premiere Pro and DaVinci Resolve.' }
    ],
    requirements: ['Raw footage assets link', 'Video Outline or timestamp guide', 'Intro/Outro files (if any)'],
    revisionPolicy: 'Revisions cover editing cuts adjustments, sound track choice swap, and title spelling correction.',
    tags: ['youtube edit', 'video editing', 'premiere pro', 'da vinci resolve'],
    industries: ['Creators', 'Corporate', 'Edu-tech', 'Travel Brands'],
    relatedGigs: ['youtube-thumbnail-design', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 've-promo',
    slug: 'promotional-video-editing',
    title: 'High-Converting Corporate Promotional Video Editing',
    shortTitle: 'Promotional Video Editing',
    category: 'video-editing',
    subcategory: 'Promotion',
    overview: 'Premium corporate reels, promo videos, and brand explainers.',
    description: 'Represent your corporate authority with a premium promotional video. We mix stock clips, raw recordings, cinematic sound effects, text typography, and clean voice-overs to build high-converting assets.',
    whoIsThisFor: 'Clinics, agencies, startups, real estate projects, and corporate brands.',
    galleryImages: [
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 26,
    startingPrice: 150,
    packages: {
      basic: {
        name: 'Promo Starter',
        price: 150,
        deliveryTime: 3,
        revisions: 2,
        deliverables: ['30s Promo video design', 'Overlay titles text', 'Royalty-free background music', '1080p output'],
        features: { duration: 30, voiceover: false }
      },
      standard: {
        name: 'Brand explainer',
        price: 280,
        deliveryTime: 6,
        revisions: 4,
        deliverables: ['60s Commercial output', 'Included premium AI/Human voiceover', 'Stock videos integrated', 'Motion graphic typography'],
        features: { duration: 60, voiceover: true }
      },
      premium: {
        name: 'Enterprise Commercial',
        price: 499,
        deliveryTime: 10,
        revisions: 6,
        deliverables: ['120s Cinematic brand promo', 'Advanced sound design & custom music sync', 'Color-graded stock library layout', 'Script writing included'],
        features: { duration: 120, voiceover: true }
      }
    },
    faqs: [
      { question: 'Do you write the scripts?', answer: 'Standard and Premium packages include professional script writing.' }
    ],
    requirements: ['Project Goals / Brand Style guide', 'Key services to highlight', 'Raw video files or images (optional)'],
    revisionPolicy: 'Covers logo positioning, screen layout text modification, and track swap.',
    tags: ['promo video', 'brand commercial', 'corporate video', 'explainer ad'],
    industries: ['Clinics', 'Real Estate', 'Tech Startups', 'Restaurants'],
    relatedGigs: ['social-media-ad-video-editing', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 've-ad',
    slug: 'social-media-ad-video-editing',
    title: 'High-Converting E-commerce Ad Video Editing',
    shortTitle: 'Social Media Ad Video Editing',
    category: 'video-editing',
    subcategory: 'Ads',
    overview: 'High-converting video ads for Facebook, Instagram, and TikTok.',
    description: 'Transform raw product clips into high-converting video ads. We script hooks, design captions, add visual highlights, and format ads in square, landscape, or portrait styles.',
    whoIsThisFor: 'E-commerce store owners, drop shippers, and digital product agencies.',
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 39,
    startingPrice: 60,
    packages: {
      basic: {
        name: 'Single Product Ad',
        price: 60,
        deliveryTime: 2,
        revisions: 2,
        deliverables: ['1 Custom product ad video (Up to 30s)', '1 size format (Square)', 'Hook text overlays'],
        features: { formats: 1, duration: 30, script: false }
      },
      standard: {
        name: 'Omnichannel Ad Trio',
        price: 139,
        deliveryTime: 4,
        revisions: 4,
        deliverables: ['1 Ad with 3 variations (Square, Stories, landscape)', 'Viral hook variations script', 'Sound effects & visual call-outs'],
        features: { formats: 3, duration: 45, script: true }
      },
      premium: {
        name: 'Scale Campaign Bundle',
        price: 249,
        deliveryTime: 6,
        revisions: 6,
        deliverables: ['3 Separate Product Ad videos', 'Multi-size formats for each ad', 'Professional script writing & competitor visual analysis', 'Custom voiceovers'],
        features: { formats: 3, duration: 60, script: true }
      }
    },
    faqs: [
      { question: 'Do you find the footage for drop shipping ads?', answer: 'Yes, we can compile and edit clips from YouTube/web links (standard fair-use guidelines).' }
    ],
    requirements: ['Product web links / photos', 'Specific text scripts (optional)', 'Logo files'],
    revisionPolicy: 'Covers hook replacements, logo display swap, and caption text corrections.',
    tags: ['video ads', 'e-commerce ads', 'facebook ads video', 'tiktok ads editing'],
    industries: ['E-commerce', 'Drop-shipping', 'Fashion', 'SaaS Brands'],
    relatedGigs: ['social-media-poster-design', 'landing-page-design'],
    status: 'active'
  },

  // --- Website Design ---
  {
    id: 'web-business',
    slug: 'business-website-design',
    legacySlugs: ['small-business-website-design'],
    title: 'Premium Business Website Design & React Setup',
    shortTitle: 'Business Website Design',
    category: 'website-design',
    subcategory: 'Full Website',
    overview: 'Modern, responsive multi-page website showcasing your local services.',
    description: 'Elevate your online authority. We build fast, fully responsive corporate websites containing customized services pages, contact capture forms, and clean, high-contrast Dark/Light layouts optimized for SEO.',
    whoIsThisFor: 'Clinics, law firms, home service firms, real estate agencies, and startups.',
    galleryImages: [
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 18,
    startingPrice: 499,
    packages: {
      basic: {
        name: 'Starter Business Page',
        price: 499,
        deliveryTime: 10,
        revisions: 3,
        deliverables: ['3-Page Website (Home, Services, Contact)', 'Fully responsive design', 'Contact form setup', 'SEO meta setup'],
        features: { pages: 3, responsive: true, speedOptimized: true }
      },
      standard: {
        name: 'Growth Corporate Site',
        price: 899,
        deliveryTime: 18,
        revisions: 5,
        deliverables: ['6-Page Custom Site (includes Portfolio/About/Reviews)', 'React/Vite setup or WordPress integration', 'Advanced contact inquiry database integration', 'Dynamic pricing/Gig calculator widget'],
        features: { pages: 6, responsive: true, speedOptimized: true }
      },
      premium: {
        name: 'Omnichannel Enterprise Platform',
        price: 1499,
        deliveryTime: 28,
        revisions: 10,
        deliverables: ['Up to 12 Pages custom site', 'Dynamic blog management CMS', 'Manual payment proof submission collection setup', 'Complete speed optimization (LCP <= 1.5s)', '1 Month maintenance support'],
        features: { pages: 12, responsive: true, speedOptimized: true }
      }
    },
    faqs: [
      { question: 'What tech stack do you use?', answer: 'We specialize in React/Vite/Next.js for speed, and WordPress or custom platforms for content-heavy sites.' }
    ],
    requirements: ['Business overview description', 'Pages mapping outline', 'Color scheme / brand files', 'Hosting / domain access details'],
    revisionPolicy: 'Revisions include content layout changes, colors adjustments, and font scaling.',
    tags: ['web design', 'react website', 'business site', 'local SEO web'],
    industries: ['Clinics', 'Law Firms', 'Real Estate', 'Home Services'],
    relatedGigs: ['landing-page-design', 'website-redesign'],
    status: 'active'
  },
  {
    id: 'web-landing',
    slug: 'landing-page-design',
    title: 'High-Converting Product/Service Landing Page Design',
    shortTitle: 'Landing Page Design',
    category: 'website-design',
    subcategory: 'Landing Page',
    overview: 'High-converting single-page landing page optimized for lead capture.',
    description: 'Stop wasting ad spend on generic web layouts. We build high-converting, mobile-first, responsive landing pages designed specifically to capture leads, subscriptions, or direct order requests.',
    whoIsThisFor: 'E-commerce brands, SaaS startups, coaches, and local campaigns.',
    galleryImages: [
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 22,
    startingPrice: 249,
    packages: {
      basic: {
        name: 'Starter Landing Page',
        price: 249,
        deliveryTime: 5,
        revisions: 2,
        deliverables: ['1-Page Layout containing up to 4 sections', 'Lead capture intake form', 'Standard responsiveness'],
        features: { sections: 4, responsive: true, animated: false }
      },
      standard: {
        name: 'Conversion Pro Landing',
        price: 449,
        deliveryTime: 8,
        revisions: 4,
        deliverables: ['1-Page Layout containing up to 8 sections', 'Custom UI components & subtle animations', 'Email list signup setup (Mailchimp/etc.)', 'A/B test layout structures optimization'],
        features: { sections: 8, responsive: true, animated: true }
      },
      premium: {
        name: 'Omni Ad-Campaign Hub',
        price: 699,
        deliveryTime: 12,
        revisions: 6,
        deliverables: ['Up to 12 sections layout', 'Integrated manual payment portal features', 'Social proof / client reviews widgets', 'Complete high speed asset optimization'],
        features: { sections: 12, responsive: true, animated: true }
      }
    },
    faqs: [
      { question: 'Do you provide copy writing?', answer: 'Standard and Premium packages include persuasive copywriting written in high-converting US/CA/AU English.' }
    ],
    requirements: ['Landing page goals', 'Product info / key benefits list', 'Logo assets', 'Target host / domain settings'],
    revisionPolicy: 'Minor section adjustments, button changes, block color swaps.',
    tags: ['landing page', 'sales page', 'react web page', 'conversion design'],
    industries: ['E-commerce', 'Coaches', 'SaaS Brands', 'Local Businesses'],
    relatedGigs: ['business-website-design', 'website-redesign'],
    status: 'active'
  },
  {
    id: 'web-portfolio',
    slug: 'portfolio-website-design',
    title: 'Personal Portfolio & Creative Showcase Website',
    shortTitle: 'Portfolio Website Design',
    category: 'website-design',
    subcategory: 'Portfolio Site',
    overview: 'Showcase your skills, designs, or works with a professional portfolio site.',
    description: 'You are your brand. We design highly visual, grid-based personal portfolio websites containing case studies structures, reviews displays, and responsive gallery viewports.',
    whoIsThisFor: 'Designers, creators, photographers, consultants, and executives.',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 17,
    startingPrice: 199,
    packages: {
      basic: {
        name: 'Single Page Portfolio',
        price: 199,
        deliveryTime: 5,
        revisions: 2,
        deliverables: ['1-Page Portfolio layout', 'Services and Gallery display sections', 'Resume download file hookup'],
        features: { pages: 1, galleries: 1 }
      },
      standard: {
        name: 'Pro Showcase Site',
        price: 349,
        deliveryTime: 9,
        revisions: 4,
        deliverables: ['4-Page Website (Home, Work, About, Contact)', 'Interactive work filters grids', 'Case studies detail popups', 'Subtle micro-interactions animations'],
        features: { pages: 4, galleries: 2 }
      },
      premium: {
        name: 'Enterprise Agency Hub',
        price: 599,
        deliveryTime: 14,
        revisions: 6,
        deliverables: ['6-Page Web layout', 'Dynamic content filters', 'Live database configuration (Firestore) for reviews/projects management', 'Complete speed optimization'],
        features: { pages: 6, galleries: 4 }
      }
    },
    faqs: [
      { question: 'Can I add new projects myself?', answer: 'Yes! The Standard and Premium packages are built with an easy-to-use content file structure or Firebase DB integrations.' }
    ],
    requirements: ['High-res pictures of your work', 'Bio details / resume content', 'Social profile links'],
    revisionPolicy: 'Grid alignment adjustments, font swaps, and overlay modifications.',
    tags: ['portfolio site', 'personal website', 'creative resume', 'artist showcase'],
    industries: ['Creators', 'Designers', 'Photographers', 'Consultants'],
    relatedGigs: ['business-website-design', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 'web-redesign',
    slug: 'website-redesign',
    title: 'Complete Corporate Website Redesign & Modernization',
    shortTitle: 'Website Redesign',
    category: 'website-design',
    subcategory: 'Redesign',
    overview: 'Modernize your slow, outdated website with premium UI/UX designs.',
    description: 'An outdated, slow website destroys your brand authority. We completely audit your site, rebuild it with lightning-fast React architecture, optimize the mobile interface, and enhance structural SEO.',
    whoIsThisFor: 'Businesses with legacy sites seeking modern layouts and faster loading speeds.',
    galleryImages: [
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 29,
    startingPrice: 399,
    packages: {
      basic: {
        name: 'Mobile UX Redesign',
        price: 399,
        deliveryTime: 7,
        revisions: 3,
        deliverables: ['Re-skinning the front-end page layouts', 'Mobile responsiveness fix', 'Pre-existing content integration'],
        features: { pages: 3, speedImprovement: '30%' }
      },
      standard: {
        name: 'Full Site Rebuild (Pro)',
        price: 749,
        deliveryTime: 15,
        revisions: 5,
        deliverables: ['Up to 6 pages rebuild from scratch', 'Clean modern react components', 'Speed optimizations (reduce assets size)', 'URL redirection routing configuration for SEO preservation'],
        features: { pages: 6, speedImprovement: '60%' }
      },
      premium: {
        name: 'Enterprise Platform Refresh',
        price: 1299,
        deliveryTime: 24,
        revisions: 8,
        deliverables: ['Up to 12 pages redesigned', 'Complete dynamic content restructure', 'Database performance overhaul', 'Conversion optimization widgets inclusion', '1 Month deployment support'],
        features: { pages: 12, speedImprovement: '90%' }
      }
    },
    faqs: [
      { question: 'Will I lose my existing Google SEO rankings?', answer: 'No. We configure proper 301 redirects and preserve URL pathways to protect your existing authority.' }
    ],
    requirements: ['Current website link', 'Domain control details', 'Target layout updates list', 'Text corrections or logo assets'],
    revisionPolicy: 'Adjust colors schemes, layout spacing adjustments, and button positions.',
    tags: ['website redesign', 'web conversion', 'react rebuild', 'page speed optimize'],
    industries: ['Law Firms', 'Clinics', 'Home Services', 'Corporate'],
    relatedGigs: ['business-website-design', 'landing-page-design'],
    status: 'active'
  }
];

export const getGigsByCategory = (categorySlug) => {
  return gigs.filter(gig => gig.category === categorySlug && gig.status === 'active');
};

export const getGigBySlug = (slug) => {
  return gigs.find(gig => gig.slug === slug || gig.legacySlugs?.includes(slug));
};
