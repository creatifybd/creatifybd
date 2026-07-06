import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// ─── Inline gig data (avoids ESM/CJS headache in build script) ───────────────
const GIGS = [
  {
    slug: 'monthly-social-media-management',
    title: 'Monthly Social Media Management for Growing Brands',
    category: 'Social Media Management',
    overview: 'Get consistent, premium content posted on your channels with full monthly management.',
    description: 'Struggling to post consistently? We handle everything from content strategy and eye-catching post design to caption writing, hashtag research, and monthly scheduling. Build authority in the USA, Canada, and Australia markets.',
    startingPrice: 299,
    packages: { basic: { name: 'Starter Growth', price: 299, deliveryTime: 30 }, standard: { name: 'Business Pro', price: 499, deliveryTime: 30 }, premium: { name: 'Ultimate Brand Scale', price: 799, deliveryTime: 30 } },
    faqs: [
      { q: 'Which platforms do you manage?', a: 'We primarily manage Facebook, Instagram, LinkedIn, and Pinterest.' },
      { q: 'How is the content approved?', a: 'We create a full monthly content calendar draft for your approval before any post goes live.' }
    ],
    related: ['facebook-page-management', 'instagram-content-management', 'brand-launch-social-media-kit']
  },
  {
    slug: 'facebook-page-management',
    title: 'Facebook Page Management & Content Strategy',
    category: 'Social Media Management',
    overview: 'Grow your business page reach and build a community on Facebook.',
    description: 'A professional Facebook page is essential for local trust. We structure your page, design high-impact cover layouts, and write high-converting copy that turns visitors into customers.',
    startingPrice: 199,
    packages: { basic: { name: 'Basic Presence', price: 199, deliveryTime: 14 }, standard: { name: 'Engagement Boost', price: 349, deliveryTime: 30 }, premium: { name: 'Authority Build', price: 549, deliveryTime: 30 } },
    faqs: [{ q: 'Do you run paid Facebook Ads?', a: 'Yes, we design the ad creatives and copy. Advanced campaign setup is available as an add-on.' }],
    related: ['monthly-social-media-management', 'brand-launch-social-media-kit']
  },
  {
    slug: 'instagram-content-management',
    title: 'Premium Instagram Grid & Content Management',
    category: 'Social Media Management',
    overview: 'Aesthetic grid layout, stories, and reels strategies for Instagram.',
    description: 'Instagram is a visual portfolio. We design gorgeous aesthetic grids, highlight icons, stories, and write engaging captions that turn followers into brand advocates.',
    startingPrice: 220,
    packages: { basic: { name: 'Aesthetic Grid Starter', price: 220, deliveryTime: 14 }, standard: { name: 'Instagram Pro Grid', price: 399, deliveryTime: 30 }, premium: { name: 'Ultimate Insta-Growth', price: 649, deliveryTime: 30 } },
    faqs: [{ q: 'Do you schedule the posts?', a: 'Yes, we schedule using Meta Business Suite, Buffer, or Later depending on your preference.' }],
    related: ['monthly-social-media-management', 'brand-launch-social-media-kit']
  },
  {
    slug: 'brand-launch-social-media-kit',
    title: 'Complete Brand Launch Social Media Kit',
    category: 'Social Media Management',
    overview: 'Full social channels setup and cohesive launch content bundle.',
    description: 'Launching a new business? Set up your platforms professionally from day one. Get cohesive headers, profile designs, highlight templates, and post templates for a consistent brand launch look.',
    startingPrice: 179,
    packages: { basic: { name: 'Starter Kit', price: 179, deliveryTime: 7 }, standard: { name: 'Brand Launch Pack', price: 299, deliveryTime: 12 }, premium: { name: 'Omnichannel Enterprise', price: 499, deliveryTime: 18 } },
    faqs: [{ q: 'Do you write the bio/about text?', a: 'Yes! All packages include writing optimized bios and taglines for your target audience.' }],
    related: ['brand-identity-design', 'professional-logo-design']
  },
  {
    slug: 'professional-logo-design',
    title: 'Premium Professional Logo Design Services',
    category: 'Graphic Design',
    overview: 'High-end vector logos representing your brand identity.',
    description: 'Your logo is the first impression of your brand. We create clean, memorable, premium vector logos tailored to capture brands value statement instantly.',
    startingPrice: 99,
    packages: { basic: { name: 'Basic Concept', price: 99, deliveryTime: 4 }, standard: { name: 'Professional Vector', price: 179, deliveryTime: 6 }, premium: { name: 'Enterprise Logo Kit', price: 299, deliveryTime: 8 } },
    faqs: [{ q: 'What file formats do you deliver?', a: 'We deliver AI, EPS, SVG, PDF, high-res PNG, and JPEG formats.' }],
    related: ['brand-identity-design', 'social-media-poster-design']
  },
  {
    slug: 'social-media-poster-design',
    title: 'Custom Social Media Poster & Banner Design',
    category: 'Graphic Design',
    overview: 'Eye-catching posters, ads, and banners for promotion.',
    description: 'Transform your marketing with high-converting custom banners and poster designs that stop the scroll. Ideal for promotions, product launches, or events.',
    startingPrice: 45,
    packages: { basic: { name: 'Single Poster', price: 45, deliveryTime: 2 }, standard: { name: 'Promo Pack', price: 119, deliveryTime: 4 }, premium: { name: 'Campaign Premium Pack', price: 199, deliveryTime: 6 } },
    faqs: [{ q: 'Do you use templates?', a: 'No. Every poster is custom designed from scratch using premium visual layout software.' }],
    related: ['youtube-thumbnail-design', 'business-flyer-design']
  },
  {
    slug: 'youtube-thumbnail-design',
    title: 'High-CTR YouTube Thumbnail Design Package',
    category: 'Graphic Design',
    overview: 'Attention-grabbing thumbnails that skyrocket your video CTR.',
    description: 'A great video with a poor thumbnail gets no views. We design hyper-engaging YouTube thumbnails tailored to capture clicks from USA, Canada, and Australia audiences.',
    startingPrice: 35,
    packages: { basic: { name: 'Single Thumbnail', price: 35, deliveryTime: 2 }, standard: { name: 'Creator Triad', price: 89, deliveryTime: 3 }, premium: { name: 'Pro YouTuber Pack', price: 199, deliveryTime: 7 } },
    faqs: [{ q: 'What is the format?', a: 'Delivered in standard 1280x720 JPEG or PNG under 2MB, optimized for YouTube upload guidelines.' }],
    related: ['youtube-video-editing', 'short-form-reels-editing']
  },
  {
    slug: 'vector-illustration',
    title: 'Custom Flat and 3D Vector Illustration',
    category: 'Graphic Design',
    overview: 'Bespoke illustrations for websites, apps, and branding.',
    description: 'Stand out from standard stock illustrations. We draw completely custom, eye-catching flat vectors or isometric icons to bring your brand assets and landing pages to life.',
    startingPrice: 65,
    packages: { basic: { name: 'Single Character/Icon', price: 65, deliveryTime: 3 }, standard: { name: 'Full Scene Illustration', price: 149, deliveryTime: 5 }, premium: { name: 'Illustration Asset Pack', price: 279, deliveryTime: 8 } },
    faqs: [{ q: 'Do you deliver SVG formats?', a: 'Yes, all illustrations are created natively in vector formats and exported to editable SVG.' }],
    related: ['professional-logo-design', 'landing-page-design']
  },
  {
    slug: 'business-flyer-design',
    title: 'Professional Corporate & Business Flyer Design',
    category: 'Graphic Design',
    overview: 'Sleek flyers, leaflets, and brochures to market your business offline.',
    description: 'Print materials need high visual rhythm and readability. We design premium business flyers and brochures optimized to showcase your product features or services clearly.',
    startingPrice: 55,
    packages: { basic: { name: 'Single Page Flyer', price: 55, deliveryTime: 3 }, standard: { name: 'Double-Sided Flyer', price: 99, deliveryTime: 4 }, premium: { name: 'Tri-Fold Brochure', price: 189, deliveryTime: 6 } },
    faqs: [{ q: 'Do you provide printing services?', a: 'No, we deliver print-ready digital vector layouts for any commercial printer.' }],
    related: ['social-media-poster-design', 'brand-identity-design']
  },
  {
    slug: 'brand-identity-design',
    title: 'Complete Corporate Brand Identity Design Guidelines',
    category: 'Graphic Design',
    overview: 'Full corporate brand guide containing typography, colors, and layout rules.',
    description: 'Ensure absolute brand consistency across print and digital media. We create your style guidelines: typography rules, primary/secondary color schemes, spacing patterns, and asset use.',
    startingPrice: 350,
    packages: { basic: { name: 'Brand Style Sheet', price: 350, deliveryTime: 6 }, standard: { name: 'Identity Guide Book', price: 599, deliveryTime: 12 }, premium: { name: 'Enterprise Guidelines', price: 999, deliveryTime: 20 } },
    faqs: [{ q: 'Do I need a logo first?', a: 'Yes. If you need a logo designed too, you can add it as a custom order or choose the premium package.' }],
    related: ['professional-logo-design', 'brand-launch-social-media-kit']
  },
  {
    slug: 'short-form-reels-editing',
    title: 'Short-form Reels, TikTok & Shorts Video Editing',
    category: 'Video Editing',
    overview: 'High-engaging shorts, reels, and TikTok video editing with captions.',
    description: 'Short-form video is the king of attention. We edit raw footage into highly viral Reels, YouTube Shorts, and TikTok videos using cinematic sound effects, visual zooms, colorful captions, and overlays.',
    startingPrice: 40,
    packages: { basic: { name: 'Single Reel Starter', price: 40, deliveryTime: 2 }, standard: { name: 'Creator Pack (5 Videos)', price: 179, deliveryTime: 5 }, premium: { name: 'Viral Brand Scale (15 Videos)', price: 449, deliveryTime: 12 } },
    faqs: [{ q: 'Do you provide the raw footage?', a: 'No, you must provide your raw video clips (talking head footage or screen recordings).' }],
    related: ['youtube-thumbnail-design', 'youtube-video-editing']
  },
  {
    slug: 'youtube-video-editing',
    title: 'Professional YouTube Video Editing Services',
    category: 'Video Editing',
    overview: 'High-quality landscape video editing for YouTube channels.',
    description: 'Keep your viewers hooked and increase watch time. We edit high-quality landscape videos for YouTube: transitions, B-roll integrations, sound design, and text call-outs.',
    startingPrice: 120,
    packages: { basic: { name: 'Vlog / Talking Head Starter', price: 120, deliveryTime: 4 }, standard: { name: 'Narrative Story / Tech Pro', price: 220, deliveryTime: 7 }, premium: { name: 'Cinematic Documentary', price: 399, deliveryTime: 12 } },
    faqs: [{ q: 'What software do you edit in?', a: 'We edit primarily in Adobe Premiere Pro and DaVinci Resolve.' }],
    related: ['youtube-thumbnail-design', 'short-form-reels-editing']
  },
  {
    slug: 'promotional-video-editing',
    title: 'High-Converting Corporate Promotional Video Editing',
    category: 'Video Editing',
    overview: 'Premium corporate reels, promo videos, and brand explainers.',
    description: 'Represent your corporate authority with a premium promotional video. We mix stock clips, raw recordings, cinematic sound effects, and typography to build high-converting assets.',
    startingPrice: 150,
    packages: { basic: { name: 'Promo Starter', price: 150, deliveryTime: 3 }, standard: { name: 'Brand Explainer', price: 280, deliveryTime: 6 }, premium: { name: 'Enterprise Commercial', price: 499, deliveryTime: 10 } },
    faqs: [{ q: 'Do you write the scripts?', a: 'Standard and Premium packages include professional script writing.' }],
    related: ['social-media-ad-video-editing', 'landing-page-design']
  },
  {
    slug: 'social-media-ad-video-editing',
    title: 'High-Converting E-commerce Ad Video Editing',
    category: 'Video Editing',
    overview: 'High-converting video ads for Facebook, Instagram, and TikTok.',
    description: 'Transform raw product clips into high-converting video ads. We script hooks, design captions, add visual highlights, and format ads in square, landscape, or portrait styles.',
    startingPrice: 60,
    packages: { basic: { name: 'Single Product Ad', price: 60, deliveryTime: 2 }, standard: { name: 'Omnichannel Ad Trio', price: 139, deliveryTime: 4 }, premium: { name: 'Scale Campaign Bundle', price: 249, deliveryTime: 6 } },
    faqs: [{ q: 'Do you find the footage for drop shipping ads?', a: 'Yes, we can compile and edit clips from YouTube/web links.' }],
    related: ['social-media-poster-design', 'landing-page-design']
  },
  {
    slug: 'business-website-design',
    title: 'Premium Business Website Design & React Setup',
    category: 'Website Design',
    overview: 'Modern, responsive multi-page website showcasing your local services.',
    description: 'Elevate your online authority. We build fast, fully responsive corporate websites containing customized service pages, contact capture forms, and clean SEO-optimized layouts.',
    startingPrice: 499,
    packages: { basic: { name: 'Starter Business Page', price: 499, deliveryTime: 10 }, standard: { name: 'Growth Corporate Site', price: 899, deliveryTime: 18 }, premium: { name: 'Omnichannel Enterprise Platform', price: 1499, deliveryTime: 28 } },
    faqs: [{ q: 'What tech stack do you use?', a: 'We specialize in React/Vite/Next.js for speed, and WordPress for content-heavy sites.' }],
    related: ['landing-page-design', 'website-redesign']
  },
  {
    slug: 'landing-page-design',
    title: 'High-Converting Product/Service Landing Page Design',
    category: 'Website Design',
    overview: 'High-converting single-page landing page optimized for lead capture.',
    description: 'Stop wasting ad spend on generic web layouts. We build high-converting, mobile-first, responsive landing pages designed to capture leads, subscriptions, or direct order requests.',
    startingPrice: 249,
    packages: { basic: { name: 'Starter Landing Page', price: 249, deliveryTime: 5 }, standard: { name: 'Conversion Pro Landing', price: 449, deliveryTime: 8 }, premium: { name: 'Omni Ad-Campaign Hub', price: 699, deliveryTime: 12 } },
    faqs: [{ q: 'Do you provide copywriting?', a: 'Standard and Premium packages include persuasive copywriting in high-converting US/CA/AU English.' }],
    related: ['business-website-design', 'website-redesign']
  },
  {
    slug: 'portfolio-website-design',
    title: 'Personal Portfolio & Creative Showcase Website',
    category: 'Website Design',
    overview: 'Showcase your skills, designs, or works with a professional portfolio site.',
    description: 'You are your brand. We design highly visual, grid-based personal portfolio websites with case study structures, reviews displays, and responsive gallery viewports.',
    startingPrice: 199,
    packages: { basic: { name: 'Single Page Portfolio', price: 199, deliveryTime: 5 }, standard: { name: 'Pro Showcase Site', price: 349, deliveryTime: 9 }, premium: { name: 'Enterprise Agency Hub', price: 599, deliveryTime: 14 } },
    faqs: [{ q: 'Can I add new projects myself?', a: 'Yes! Standard and Premium packages include easy-to-update content structures or Firebase DB integrations.' }],
    related: ['business-website-design', 'landing-page-design']
  },
  {
    slug: 'website-redesign',
    title: 'Complete Corporate Website Redesign & Modernization',
    category: 'Website Design',
    overview: 'Modernize your slow, outdated website with premium UI/UX designs.',
    description: 'An outdated, slow website destroys your brand authority. We completely audit your site, rebuild it with lightning-fast React architecture, optimize mobile, and enhance structural SEO.',
    startingPrice: 399,
    packages: { basic: { name: 'Mobile UX Redesign', price: 399, deliveryTime: 7 }, standard: { name: 'Full Site Rebuild (Pro)', price: 749, deliveryTime: 15 }, premium: { name: 'Enterprise Platform Refresh', price: 1299, deliveryTime: 24 } },
    faqs: [{ q: 'Will I lose my existing Google SEO rankings?', a: 'No. We configure proper 301 redirects to protect your existing authority.' }],
    related: ['business-website-design', 'landing-page-design']
  }
];

const STATIC_ROUTES = [
  {
    path: '',
    title: 'CreatifyBD | Social Media Management, Graphic Design, Video Editing & Websites',
    description: 'CreatifyBD helps brands in the USA, Canada, and Australia grow with social media management, graphic design, video editing, and website design — delivered through a transparent gig-style process.',
    h1: 'Creative Services That Make brands Look Premium Online',
    bodyContent: `
      <p>CreatifyBD helps brands in the <strong>USA, Canada, and Australia</strong> grow with social media management, graphic design, video editing, and website design — delivered through a transparent gig-style process.</p>
      <h2>Our Core Services</h2>
      <ul>
        <li><a href="/services/social-media-management"><strong>Social Media Management</strong></a> — Monthly content calendars, post design, captions, hashtag strategy, reels planning, and monthly analytics reporting.</li>
        <li><a href="/services/graphic-design"><strong>Graphic Design</strong></a> — Professional logo design, brand identity guides, social media posters, flyers, YouTube thumbnails, and custom vector illustrations.</li>
        <li><a href="/services/video-editing"><strong>Video Editing</strong></a> — Cinematic Reels, TikTok, and YouTube video editing with captions, zoom cuts, color grading, and audio mixing.</li>
        <li><a href="/services/website-design"><strong>Website Design</strong></a> — Fast, responsive, and SEO-optimized landing pages and full business websites built with React.</li>
      </ul>
      <h2>Why Choose CreatifyBD?</h2>
      <ul>
        <li>International-standard creative execution from our remote-ready production workflow</li>
        <li>Fixed-price packages with transparent deliverables — no hidden fees</li>
        <li>Manual payment system (Payoneer / DBBL Bank) with order verification</li>
        <li>Revision guarantee on every order</li>
        <li>Serving clients in USA, Canada, and Australia</li>
      </ul>
      <p><a href="/gigs">Browse all service gigs</a> | <a href="/contact">Get a free proposal</a></p>
    `
  },
  {
    path: 'about',
    title: 'About CreatifyBD | Global Creative Agency for USA, Canada & Australia',
    description: 'Learn about CreatifyBD — a remote-ready creative production team serving businesses in the USA, Canada, and Australia with premium social media management, graphic design, video editing, and web design.',
    h1: 'About CreatifyBD — Remote-Ready Production Team Serving International Markets',
    bodyContent: `
      <p>CreatifyBD was founded with a clear mission: make premium creative services accessible and affordable for brands in English-speaking markets without sacrificing quality or transparency.</p>
      <h2>Our Production Office</h2>
      <p>We operate from Global remote operations, one of the world's fastest-growing creative production hubs. Our skilled team of designers, video editors, social media strategists, and web developers brings international-standard results at production-office cost efficiency.</p>
      <h2>Who We Serve</h2>
      <p>We focus exclusively on brands and growing brands in the <strong>USA, Canada, and Australia</strong> who need consistent, high-quality creative output without the overhead of a full-time in-house creative department.</p>
      <h2>Our Transparent Process</h2>
      <p>Every order follows a structured workflow: requirements intake → payment verification → production → draft sharing → revisions → final delivery. You can track your order at every stage through our client portal.</p>
      <p><a href="/gigs">View our service packages</a> | <a href="/team">Meet our team</a></p>
    `
  },
  {
    path: 'services',
    title: 'Services & Pricing Packages | CreatifyBD',
    description: 'Explore CreatifyBD fixed-price creative service packages. Social media management starting at $299/month. Graphic design, video editing, and website design for USA, Canada, and Australia businesses.',
    h1: 'Creative Services & Gig-Style Packages for brands',
    bodyContent: `
      <p>All CreatifyBD services are delivered as transparent, fixed-price packages — no surprises, no scope creep. Browse our four core service categories below.</p>
      <h2>Social Media Management</h2>
      <p>Monthly content calendars, post design, caption writing, hashtag strategy, reels planning, scheduling, and analytics reporting. Starting from $299/month. <a href="/services/social-media-management">Learn more</a></p>
      <h2>Graphic Design</h2>
      <p>Logo design, brand identity, social media posters, flyers, thumbnails, and vector illustrations. Starting from $35. <a href="/services/graphic-design">Learn more</a></p>
      <h2>Video Editing</h2>
      <p>Short-form reels, YouTube video editing, promotional videos, and social media ad videos. Starting from $40. <a href="/services/video-editing">Learn more</a></p>
      <h2>Website Design</h2>
      <p>brand websites, landing pages, portfolio sites, and website redesigns. Starting from $199. <a href="/services/website-design">Learn more</a></p>
      <p><a href="/gigs">Browse all gigs and packages</a></p>
    `
  },
  {
    path: 'services/social-media-management',
    title: 'Social Media Management Service | CreatifyBD',
    description: 'Professional Monthly Social Media Management for Growing Brands in USA, Canada & Australia. Content calendars, post design, captions, hashtags, reels planning, and analytics. Starting at $299/month.',
    h1: 'Social Media Management for brands — USA, Canada & Australia',
    bodyContent: `
      <p>CreatifyBD provides comprehensive monthly social media management tailored for brands in the <strong>USA, Canada, and Australia</strong>. From content strategy to post design, caption writing, and scheduling — we handle it all so you can focus on growing your business.</p>
      <h2>What's Included</h2>
      <ul>
        <li>Monthly content calendar planning</li>
        <li>Custom social media post design (Facebook, Instagram, LinkedIn)</li>
        <li>Engaging caption writing with call-to-action</li>
        <li>Hashtag research and strategy</li>
        <li>Instagram Reels and Stories planning</li>
        <li>Scheduling and publishing support</li>
        <li>Monthly analytics and performance reporting</li>
        <li>Brand consistency maintenance</li>
        <li>Competitor reference tracking</li>
      </ul>
      <h2>Packages & Pricing</h2>
      <ul>
        <li><strong>Starter Growth</strong> — $299/month: 12 posts, 1 platform, content calendar, caption writing</li>
        <li><strong>Business Pro</strong> — $499/month: 20 posts + stories, 2 platforms, reels scripting, monthly report</li>
        <li><strong>Ultimate Brand Scale</strong> — $799/month: 30 posts + 5 reels, 3 platforms, dedicated account manager, bi-weekly analytics</li>
      </ul>
      <h2>Related Gigs</h2>
      <ul>
        <li><a href="/gigs/monthly-social-media-management">Monthly Social Media Management</a></li>
        <li><a href="/gigs/facebook-page-management">Facebook Page Management</a></li>
        <li><a href="/gigs/instagram-content-management">Instagram Content Management</a></li>
        <li><a href="/gigs/brand-launch-social-media-kit">Brand Launch Social Media Kit</a></li>
      </ul>
      <p><a href="/order/start/monthly-social-media-management">Start your social media management order</a></p>
    `
  },
  {
    path: 'services/graphic-design',
    title: 'Graphic Design & Branding Services | CreatifyBD',
    description: 'Professional graphic design services for businesses in USA, Canada & Australia. Logo design, brand identity, social media posters, flyers, thumbnails, and vector illustrations. Starting at $35.',
    h1: 'Graphic Design & Branding Services for International brands',
    bodyContent: `
      <p>Our graphic design team creates premium visual assets that make your brand stand out. From logos to full brand identity systems, every deliverable is crafted to international quality standards.</p>
      <h2>Graphic Design Services</h2>
      <ul>
        <li><a href="/gigs/professional-logo-design"><strong>Logo Design</strong></a> — Vector logos from $99. 2–5 concepts, commercial rights, AI/SVG/PNG files.</li>
        <li><a href="/gigs/brand-identity-design"><strong>Brand Identity Design</strong></a> — Full brand guidelines from $350. Typography, color systems, logo rules, and stationery.</li>
        <li><a href="/gigs/social-media-poster-design"><strong>Social Media Poster Design</strong></a> — Custom promotion posters from $45. High-res, print-ready formats.</li>
        <li><a href="/gigs/business-flyer-design"><strong>Business Flyer Design</strong></a> — Print-ready flyers from $55. Single page to tri-fold brochures.</li>
        <li><a href="/gigs/youtube-thumbnail-design"><strong>YouTube Thumbnail Design</strong></a> — CTR-optimized thumbnails from $35.</li>
        <li><a href="/gigs/vector-illustration"><strong>Vector Illustration</strong></a> — Custom flat and isometric illustrations from $65.</li>
      </ul>
      <p><a href="/gigs">Browse all graphic design gigs</a></p>
    `
  },
  {
    path: 'services/video-editing',
    title: 'Video Editing Services | CreatifyBD',
    description: 'Professional video editing services for YouTube, Instagram Reels, TikTok, promotional videos, and social media ads. Serving businesses in USA, Canada & Australia. Starting at $40.',
    h1: 'Video Editing Services — Reels, YouTube, Promos & Ad Videos',
    bodyContent: `
      <p>CreatifyBD video editing team produces high-impact video content for YouTube, Instagram Reels, TikTok, promotional campaigns, and social media ads. We edit in Adobe Premiere Pro and DaVinci Resolve.</p>
      <h2>Video Editing Services</h2>
      <ul>
        <li><a href="/gigs/short-form-reels-editing"><strong>Short-form Reels Editing</strong></a> — Viral-ready Reels and TikToks with captions and sound design from $40.</li>
        <li><a href="/gigs/youtube-video-editing"><strong>YouTube Video Editing</strong></a> — Long-form YouTube edits up to 25 min with B-roll and color grading from $120.</li>
        <li><a href="/gigs/promotional-video-editing"><strong>Promotional Video Editing</strong></a> — Corporate promo videos from $150 with stock clips and voiceover.</li>
        <li><a href="/gigs/social-media-ad-video-editing"><strong>Social Media Ad Video Editing</strong></a> — High-converting product ad videos from $60.</li>
      </ul>
      <p><a href="/gigs">Browse all video editing gigs</a></p>
    `
  },
  {
    path: 'services/website-design',
    title: 'Website Design Services | CreatifyBD',
    description: 'Premium website design services for brands in USA, Canada & Australia. brand websites, landing pages, portfolio sites, and website redesigns. React/Vite-based. Starting at $199.',
    h1: 'Website Design Services — brand, Landing Page & Portfolio Websites',
    bodyContent: `
      <p>CreatifyBD designs and develops fast, modern, SEO-optimized websites using React/Vite technology. Every website is built to convert visitors into customers with clean UI and compelling copy.</p>
      <h2>Website Design Services</h2>
      <ul>
        <li><a href="/gigs/business-website-design"><strong>Business Website Design</strong></a> — 3–12 page responsive websites from $499.</li>
        <li><a href="/gigs/landing-page-design"><strong>Landing Page Design</strong></a> — High-converting single-page landing pages from $249.</li>
        <li><a href="/gigs/portfolio-website-design"><strong>Portfolio Website Design</strong></a> — Professional portfolio and showcase sites from $199.</li>
        <li><a href="/gigs/website-redesign"><strong>Website Redesign</strong></a> — Modernize your existing site with new UI/UX from $399.</li>
      </ul>
      <p><a href="/gigs">Browse all website design gigs</a></p>
    `
  },
  {
    path: 'gigs',
    title: 'Browse Service Gigs & Creative Packages | CreatifyBD',
    description: 'Purchase premium creative services on-demand. Browse 18+ gigs including social media management, logo design, video editing, and web design — all with transparent fixed pricing.',
    h1: 'Browse All Creative Service Gigs — Social Media, Design, Video & Web',
    bodyContent: `
      <p>CreatifyBD marketplace features 18+ gig-style creative service packages for businesses in USA, Canada, and Australia. Every gig has transparent pricing, clear deliverables, and revision guarantees.</p>
      <h2>Featured: Social Media Management Gigs</h2>
      <ul>
        <li><a href="/gigs/monthly-social-media-management">Monthly Social Media Management — from $299/month</a></li>
        <li><a href="/gigs/facebook-page-management">Facebook Page Management — from $199/month</a></li>
        <li><a href="/gigs/instagram-content-management">Instagram Content Management — from $220/month</a></li>
        <li><a href="/gigs/brand-launch-social-media-kit">Brand Launch Social Media Kit — from $179</a></li>
      </ul>
      <h2>Graphic Design Gigs</h2>
      <ul>
        <li><a href="/gigs/professional-logo-design">Professional Logo Design — from $99</a></li>
        <li><a href="/gigs/brand-identity-design">Brand Identity Design — from $350</a></li>
        <li><a href="/gigs/social-media-poster-design">Social Media Poster Design — from $45</a></li>
        <li><a href="/gigs/youtube-thumbnail-design">YouTube Thumbnail Design — from $35</a></li>
      </ul>
      <h2>Video Editing Gigs</h2>
      <ul>
        <li><a href="/gigs/short-form-reels-editing">Short-form Reels Editing — from $40</a></li>
        <li><a href="/gigs/youtube-video-editing">YouTube Video Editing — from $120</a></li>
        <li><a href="/gigs/promotional-video-editing">Promotional Video Editing — from $150</a></li>
      </ul>
      <h2>Website Design Gigs</h2>
      <ul>
        <li><a href="/gigs/business-website-design">Business Website Design — from $499</a></li>
        <li><a href="/gigs/landing-page-design">Landing Page Design — from $249</a></li>
      </ul>
    `
  },
  {
    path: 'portfolio',
    title: 'Portfolio & Delivered Work Showcase | CreatifyBD',
    description: 'View CreatifyBD portfolio of delivered creative work — social media content, graphic designs, video edits, and websites delivered to businesses in USA, Canada, and Australia.',
    h1: 'Our Portfolio — Delivered Creative Work for International Clients',
    bodyContent: `
      <p>CreatifyBD portfolio showcases actual delivered work for clients in the USA, Canada, and Australia. Explore samples of our social media content, graphic design, video editing, and website projects.</p>
      <h2>Portfolio Categories</h2>
      <ul>
        <li>Social Media Management — Monthly post packages, content calendars, and brand consistency systems</li>
        <li>Graphic Design — Logos, brand identities, social posters, and flyers</li>
        <li>Video Editing — Reels, YouTube videos, and promotional video production</li>
        <li>Website Design — brand sites, landing pages, and portfolio websites</li>
      </ul>
      <p><a href="/gigs">Order a service gig</a> | <a href="/reviews">Read client reviews</a></p>
    `
  },
  {
    path: 'reviews',
    title: 'Client Reviews & Testimonials | CreatifyBD',
    description: 'Read verified client reviews and testimonials from businesses in USA, Canada, and Australia who have used CreatifyBD creative services.',
    h1: 'Client Reviews — What brands Say About CreatifyBD',
    bodyContent: `
      <p>CreatifyBD works with brands in the <strong>USA, Canada, and Australia</strong>. Client feedback is shared publicly after admin verification to ensure authenticity.</p>
      <h2>Why Clients Choose CreatifyBD</h2>
      <ul>
        <li>Transparent fixed pricing with no hidden costs</li>
        <li>Revision guarantee on every order</li>
        <li>Structured order tracking through client portal</li>
        <li>Manual payment verification for financial safety</li>
        <li>Consistent communication throughout the project</li>
      </ul>
      <p><a href="/gigs">Browse our service gigs</a> | <a href="/contact">Get a free proposal</a></p>
    `
  },
  {
    path: 'team',
    title: 'Our Team | CreatifyBD',
    description: 'Meet the CreatifyBD creative production team based in Global remote operations — serving businesses in USA, Canada, and Australia with social media management, design, video editing, and web services.',
    h1: 'Meet the CreatifyBD Team — remote-ready Creative Production Experts',
    bodyContent: `
      <p>CreatifyBD is operated by a team of experienced creative professionals based in Global remote operations. Our team includes social media strategists, graphic designers, video editors, and web developers with combined experience serving international markets.</p>
      <h2>Our Team Specializations</h2>
      <ul>
        <li><strong>Social Media Strategists</strong> — Content planning, platform strategy, and performance tracking</li>
        <li><strong>Graphic Designers</strong> — Logo design, branding, and digital creative assets</li>
        <li><strong>Video Editors</strong> — Reels, YouTube, promotional, and ad video production</li>
        <li><strong>Web Developers</strong> — React/Vite-based responsive website development</li>
        <li><strong>Copywriters</strong> — Engaging captions, ad copy, and website content in US/CA/AU English</li>
      </ul>
      <p><a href="/about">Learn more about CreatifyBD</a> | <a href="/contact">Contact us</a></p>
    `
  },
  {
    path: 'process',
    title: 'Our Process — How CreatifyBD Delivers Creative Services',
    description: 'Learn about CreatifyBD structured workflow for delivering creative services. From requirements intake to final delivery — transparent process for USA, Canada, and Australia clients.',
    h1: 'Our Process — Structured Workflow for Creative Service Delivery',
    bodyContent: `
      <p>CreatifyBD follows a structured, transparent workflow for every creative order. From initial requirements to final delivery, you can track progress at every stage through our client portal.</p>
      <h2>Our 4-Step Process</h2>
      <ul>
        <li><strong>Step 1: Requirements Intake</strong> — Share your project brief, brand assets, and specific requirements through our order form or contact form.</li>
        <li><strong>Step 2: Payment Verification</strong> — Submit manual payment proof (Payoneer or DBBL Bank Transfer). We verify within 24 hours.</li>
        <li><strong>Step 3: Production & Drafts</strong> — Our team creates initial drafts. You review and request revisions through the client portal.</li>
        <li><strong>Step 4: Final Delivery</strong> — Approved deliverables are shared via secure download links. You can request final tweaks if needed.</li>
      </ul>
      <h2>Why Our Process Works</h2>
      <ul>
        <li>Clear communication at every stage</li>
        <li>Revision guarantee on every order</li>
        <li>Manual payment verification for financial safety</li>
        <li>Client portal for tracking progress</li>
        <li>Final approval before delivery</li>
      </ul>
      <p><a href="/gigs">Browse our service gigs</a> | <a href="/contact">Start a project</a></p>
    `
  },
  {
    path: 'pricing',
    title: 'Transparent Pricing Packages | CreatifyBD Creative Services',
    description: 'View CreatifyBD transparent pricing for social media management, graphic design, video editing, and website design. Fixed-price packages with no hidden costs for USA, Canada, and Australia businesses.',
    h1: 'Transparent Pricing — Fixed-Price Creative Service Packages',
    bodyContent: `
      <p>CreatifyBD offers fixed-price creative service packages with transparent deliverables. No hidden costs, no scope creep — clear pricing for businesses in the USA, Canada, and Australia.</p>
      <h2>Social Media Management Pricing</h2>
      <ul>
        <li><strong>Starter Growth</strong> — $299/month: 12 posts, 1 platform, content calendar, caption writing</li>
        <li><strong>Business Pro</strong> — $499/month: 20 posts + stories, 2 platforms, reels scripting, monthly report</li>
        <li><strong>Ultimate Brand Scale</strong> — $799/month: 30 posts + 5 reels, 3 platforms, dedicated account manager</li>
      </ul>
      <h2>Graphic Design Pricing</h2>
      <ul>
        <li><strong>Logo Design</strong> — from $99: Vector logos with commercial rights</li>
        <li><strong>Brand Identity</strong> — from $350: Full brand guidelines and style sheets</li>
        <li><strong>Social Media Posters</strong> — from $45: Custom promotion posters</li>
        <li><strong>YouTube Thumbnails</strong> — from $35: CTR-optimized thumbnails</li>
      </ul>
      <h2>Video Editing Pricing</h2>
      <ul>
        <li><strong>Short-form Reels</strong> — from $40: Viral-ready Reels and TikToks</li>
        <li><strong>YouTube Video Editing</strong> — from $120: Long-form edits with B-roll</li>
        <li><strong>Promotional Videos</strong> — from $150: Corporate promo videos</li>
      </ul>
      <h2>Website Design Pricing</h2>
      <ul>
        <li><strong>brand Website</strong> — from $499: 3-12 page responsive websites</li>
        <li><strong>Landing Page</strong> — from $249: High-converting single-page landing pages</li>
        <li><strong>Portfolio Website</strong> — from $199: Professional portfolio sites</li>
        <li><strong>Website Redesign</strong> — from $399: Modernize existing sites</li>
      </ul>
      <p><a href="/gigs">Browse all service gigs with detailed pricing</a></p>
    `
  },
  {
    path: 'contact',
    title: 'Contact CreatifyBD | Get a Free Creative Proposal',
    description: 'Contact CreatifyBD creative team for custom inquiries, project consultation, or order support. Serving businesses in USA, Canada, and Australia.',
    h1: 'Contact CreatifyBD — Request a Free Proposal or Consultation',
    bodyContent: `
      <p>Ready to grow your brand? Contact the CreatifyBD team for a free proposal, project consultation, or any order-related questions. We typically respond within 24 hours on business days.</p>
      <h2>How to Reach Us</h2>
      <ul>
        <li><strong>Email:</strong> hello@creatifybd.com</li>
        <li><strong>WhatsApp:</strong> +880 1951 676600</li>
        <li><strong>Location:</strong> Serving USA, Canada, Australia, and global clients</li>
      </ul>
      <h2>Services We Offer</h2>
      <ul>
        <li><a href="/services/social-media-management">Social Media Management</a></li>
        <li><a href="/services/graphic-design">Graphic Design</a></li>
        <li><a href="/services/video-editing">Video Editing</a></li>
        <li><a href="/services/website-design">Website Design</a></li>
      </ul>
    `
  },
  {
    path: 'case-studies',
    title: 'Sample Concepts & Creative Work Examples | CreatifyBD',
    description: 'View sample creative concepts demonstrating CreatifyBD capabilities in graphic design, digital marketing, and website design. These are sample projects, not actual client case studies.',
    h1: 'Sample Concepts — Demonstrating Our Creative Capabilities',
    bodyContent: `
      <p>The following are sample concepts demonstrating CreatifyBD creative capabilities in graphic design, digital marketing, and website design. These are portfolio examples showcasing our skills, not actual client case studies.</p>
      <h2>Featured Sample Concepts</h2>
      <ul>
        <li><a href="/case-study/graphic-design-apex">Brand Identity System Design — Sample Concept</a></li>
        <li><a href="/case-study/marketing-luxe">Social Media Marketing Strategy — Sample Concept</a></li>
        <li><a href="/case-study/web-design-finflow">Website UI/UX Design — Sample Concept</a></li>
      </ul>
      <p><strong>Note:</strong> These are sample projects demonstrating our design capabilities. Contact us to discuss your actual creative needs.</p>
      <p><a href="/portfolio">View our portfolio</a> | <a href="/gigs">Order a service</a></p>
    `
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | CreatifyBD',
    description: 'CreatifyBD privacy policy — how we collect, use, and protect your personal information when using our creative services marketplace.',
    h1: 'Privacy Policy — CreatifyBD Creative Services',
    bodyContent: `<p>This Privacy Policy explains how CreatifyBD collects, uses, and protects personal information. <a href="/contact">Contact us</a> if you have questions about your data.</p>`
  },
  // /privacy is an alias in App.jsx — canonical is /privacy-policy (above)
  {
    path: 'privacy',
    title: 'Privacy Policy | CreatifyBD',
    description: 'CreatifyBD privacy policy — how we collect, use, and protect your personal information when using our creative services marketplace.',
    h1: 'Privacy Policy — CreatifyBD Creative Services',
    bodyContent: `<p>This Privacy Policy explains how CreatifyBD collects, uses, and protects personal information. <a href="/contact">Contact us</a> if you have questions about your data.</p>`
  },
  {
    path: 'terms',
    title: 'Terms of Service | CreatifyBD',
    description: 'CreatifyBD terms of service — rules and conditions for using our creative service marketplace and ordering creative services.',
    h1: 'Terms of Service — CreatifyBD Creative Services',
    bodyContent: `<p>These Terms govern your use of CreatifyBD services. By placing an order, you agree to these terms. <a href="/contact">Contact us</a> for clarification.</p>`
  },
  {
    path: 'refund-policy',
    title: 'Refund Policy | CreatifyBD',
    description: 'CreatifyBD refund and cancellation policy for creative service orders including social media management, graphic design, video editing, and website design.',
    h1: 'Refund & Cancellation Policy — CreatifyBD',
    bodyContent: `<p>CreatifyBD refund policy covers all service orders. Orders cancelled before production begins may qualify for a partial refund. <a href="/contact">Contact us</a> for order-specific questions.</p>`
  },
  {
    path: 'revision-policy',
    title: 'Revision Policy | CreatifyBD',
    description: 'CreatifyBD revision policy for all creative service packages — how revisions work, how many are included, and how to request changes.',
    h1: 'Revision Policy — CreatifyBD Creative Services',
    bodyContent: `
      <p>Every CreatifyBD order includes revision rounds based on your selected package. Revisions are intended for design adjustments, not complete topic or concept changes after draft approval.</p>
      <h2>Revision Policy Summary</h2>
      <ul>
        <li>All revision requests must be submitted via the client order portal</li>
        <li>Clearly describe specific adjustments required</li>
        <li>Revisions are processed within 2-3 business days</li>
        <li>Scope changes beyond the agreed brief may require additional fees</li>
      </ul>
      <p><a href="/gigs">View gig revision details</a> | <a href="/contact">Contact support</a></p>
    `
  }
];

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildGigBody(gig) {
  const pkgs = gig.packages;
  const pkgRows = Object.values(pkgs).map(p =>
    `<li><strong>${escapeHtml(p.name)}</strong> — $${p.price} USD · Delivery: ${p.deliveryTime} days</li>`
  ).join('\n');

  const faqItems = (gig.faqs || []).map(f =>
    `<dt><strong>${escapeHtml(f.q)}</strong></dt><dd>${escapeHtml(f.a)}</dd>`
  ).join('\n');

  const relatedLinks = (gig.related || []).map(slug =>
    `<li><a href="/gigs/${slug}">${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</a></li>`
  ).join('\n');

  return `
    <p>${escapeHtml(gig.description)}</p>
    <p><strong>Category:</strong> ${escapeHtml(gig.category)} | <strong>Starting at:</strong> $${gig.startingPrice} USD</p>
    <h2>Service Overview</h2>
    <p>${escapeHtml(gig.overview)}</p>
    <h2>Packages & Pricing</h2>
    <ul>
      ${pkgRows}
    </ul>
    <h2>Frequently Asked Questions</h2>
    <dl>
      ${faqItems}
    </dl>
    <h2>Related Services</h2>
    <ul>
      ${relatedLinks}
    </ul>
    <p>
      <a href="/order/start/${gig.slug}">Start Order</a> |
      <a href="/gigs">Browse All Gigs</a> |
      <a href="/payment">Manual Payment Instructions</a>
    </p>
  `;
}

function applyMetaAndBody(baseHtml, { title, description, canonical, h1, bodyContent }) {
  let html = baseHtml;

  // Title
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/(<meta name="title" content=")[^"]*(")/gi, `$1${escapeHtml(title)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/gi, `$1${escapeHtml(title)}$2`);
  html = html.replace(/(<meta property="twitter:title" content=")[^"]*(")/gi, `$1${escapeHtml(title)}$2`);

  // Description
  html = html.replace(/(<meta name="description" content=")[^"]*(")/gi, `$1${escapeHtml(description)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/gi, `$1${escapeHtml(description)}$2`);
  html = html.replace(/(<meta property="twitter:description" content=")[^"]*(")/gi, `$1${escapeHtml(description)}$2`);

  // Canonical / OG URL
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/gi, `$1${escapeHtml(canonical)}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/gi, `$1${escapeHtml(canonical)}$2`);
  html = html.replace(/(<meta property="twitter:url" content=")[^"]*(")/gi, `$1${escapeHtml(canonical)}$2`);

  // Replace the static SEO fallback body inside #root with route-specific content
  const staticBody = `<main aria-label="${escapeHtml(title)}" style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:2rem;color:#222;">
      <header>
        <a href="https://creatifybd.com"><strong>CreatifyBD</strong></a> — Premium Creative Agency &amp; Service Marketplace
      </header>
      <h1>${escapeHtml(h1)}</h1>
      ${bodyContent}
      <nav aria-label="Site navigation">
        <ul style="list-style:none;padding:0;display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem;">
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/services/social-media-management">Social Media Management</a></li>
          <li><a href="/gigs">Browse Gigs</a></li>
          <li><a href="/reviews">Reviews</a></li>
          <li><a href="/team">Team</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/portfolio">Portfolio</a></li>
        </ul>
      </nav>
      <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #eee;font-size:0.85rem;color:#666;">
        &copy; 2025 CreatifyBD. All rights reserved. |
        <a href="/privacy-policy">Privacy Policy</a> |
        <a href="/terms">Terms</a> |
        <a href="/refund-policy">Refund Policy</a> |
        <a href="/revision-policy">Revision Policy</a>
      </footer>
    </main>`;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>(?=\s*<script)/, `<div id="root">${staticBody}</div>`);

  return html;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function prerender() {
  if (!fs.existsSync(BASE_TEMPLATE_PATH)) {
    console.error('Error: dist/index.html not found. Run "npm run build" first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(BASE_TEMPLATE_PATH, 'utf-8');
  let count = 0;

  // Render static routes
  for (const route of STATIC_ROUTES) {
    const canonical = `https://creatifybd.com/${route.path}`;
    const rendered = applyMetaAndBody(baseHtml, {
      title: route.title,
      description: route.description,
      canonical,
      h1: route.h1,
      bodyContent: route.bodyContent
    });

    if (route.path === '') {
      // Overwrite the root index.html in place
      fs.writeFileSync(BASE_TEMPLATE_PATH, rendered);
      console.log('Prerendered: / -> dist/index.html');
    } else {
      // Write a flat "<path>.html" file instead of "<path>/index.html".
      // With Firebase Hosting's "cleanUrls" option this is served directly
      // at /<path> with a 200 (no physical directory exists), avoiding the
      // extra 301 redirect that directory-style "index.html" files trigger
      // when the URL is requested without a trailing slash.
      const filePath = path.join(DIST_DIR, `${route.path}.html`);
      ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, rendered);
      console.log(`Prerendered: /${route.path} -> dist/${route.path}.html`);
    }
    count++;
  }

  // Render gig pages
  for (const gig of GIGS) {
    const gigPath = `gigs/${gig.slug}`;
    const canonical = `https://creatifybd.com/${gigPath}`;
    const title = `${gig.title} | CreatifyBD`;
    const description = `${gig.overview} Starting at $${gig.startingPrice} USD. ${gig.category} services for businesses in USA, Canada, and Australia. Transparent pricing, revision guarantee.`;

    const rendered = applyMetaAndBody(baseHtml, {
      title,
      description,
      canonical,
      h1: gig.title,
      bodyContent: buildGigBody(gig)
    });

    const filePath = path.join(DIST_DIR, `${gigPath}.html`);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, rendered);
    console.log(`Prerendered: /${gigPath} -> dist/${gigPath}.html`);
    count++;
  }

  // Render case study pages
  const CASE_STUDIES = [
    {
      slug: 'graphic-design-apex',
      title: 'Brand Identity System Design — Sample Concept | CreatifyBD',
      description: 'Sample concept demonstrating CreatifyBD brand identity design capabilities. Fashion/retail brand visual system including logo, typography, color palette, and guidelines.',
      h1: 'Brand Identity System Design — Sample Concept',
      bodyContent: `
        <p>This is a sample concept demonstrating CreatifyBD brand identity design capabilities for a streetwear brand.</p>
        <h2>Challenge</h2>
        <p>Creating a cohesive visual identity that works across digital and print media while maintaining brand consistency.</p>
        <h2>Solution</h2>
        <p>We developed a modular brand system with variable logo marks, a refined typography hierarchy, and a flexible color palette.</p>
        <p><strong>Note:</strong> This is a sample project demonstrating our design capabilities. <a href="/contact">Contact us</a> to discuss your actual brand identity needs.</p>
        <p><a href="/case-studies">View all case studies</a> | <a href="/gigs/brand-identity-design">Order Brand Identity Design</a></p>
      `
    },
    {
      slug: 'marketing-luxe',
      title: 'Social Media Marketing Strategy — Sample Concept | CreatifyBD',
      description: 'Sample concept demonstrating CreatifyBD social media marketing capabilities for a luxury real estate brand. Content strategy, ad creative design, and campaign planning.',
      h1: 'Social Media Marketing Strategy — Sample Concept',
      bodyContent: `
        <p>This is a sample concept demonstrating CreatifyBD social media marketing capabilities for a luxury real estate brand.</p>
        <h2>Challenge</h2>
        <p>Creating engaging social content that resonates with a luxury audience while maintaining brand sophistication.</p>
        <h2>Solution</h2>
        <p>We developed a content calendar with high-quality visuals, strategic posting schedules, and engagement-focused community management.</p>
        <p><strong>Note:</strong> This is a sample project. <a href="/contact">Contact us</a> to discuss your actual marketing needs.</p>
        <p><a href="/case-studies">View all case studies</a> | <a href="/gigs/monthly-social-media-management">Order Social Media Management</a></p>
      `
    },
    {
      slug: 'web-design-finflow',
      title: 'Website UI/UX Design — Sample Concept | CreatifyBD',
      description: 'Sample concept demonstrating CreatifyBD website design capabilities for a SaaS/FinTech platform. UI/UX design, responsive layouts, and modern web aesthetics.',
      h1: 'Website UI/UX Design — Sample Concept',
      bodyContent: `
        <p>This is a sample concept demonstrating CreatifyBD website design capabilities for a SaaS platform.</p>
        <h2>Challenge</h2>
        <p>Creating an intuitive user interface for a complex data-driven platform.</p>
        <h2>Solution</h2>
        <p>We implemented a clean, card-based architecture with clear information hierarchy and smooth micro-interactions.</p>
        <p><strong>Note:</strong> This is a sample project. <a href="/contact">Contact us</a> to discuss your actual website needs.</p>
        <p><a href="/case-studies">View all case studies</a> | <a href="/gigs/business-website-design">Order Website Design</a></p>
      `
    }
  ];

  for (const cs of CASE_STUDIES) {
    const csPath = `case-study/${cs.slug}`;
    const canonical = `https://creatifybd.com/${csPath}`;
    const rendered = applyMetaAndBody(baseHtml, {
      title: cs.title,
      description: cs.description,
      canonical,
      h1: cs.h1,
      bodyContent: cs.bodyContent
    });
    const filePath = path.join(DIST_DIR, `${csPath}.html`);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, rendered);
    console.log(`Prerendered: /${csPath} -> dist/${csPath}.html`);
    count++;
  }

  console.log(`\nPrerendering complete! ${count} routes generated.`);
}

prerender();
