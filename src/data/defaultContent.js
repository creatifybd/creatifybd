export const CONTENT_VERSION = 20260722_10;

export const defaultContent = {
  version: CONTENT_VERSION,
  visibility: {
    hero: true,
    intro_band: true,
    clients: true,
    smm_highlight: true,
    services: true,
    features: true,
    about_trust: true,
    portfolio: true,
    case_studies: true,
    process: true,
    pricing: true,
    testimonials: true,
    cta_band: true,
    contact: true
  },
  hero: {
    eyebrow: 'Trusted Global Creative Partner',
    title: 'Grow Your Brand with a Trusted Creative Partner',
    desc: 'CreatifyBD is a full-service creative team — branding, social media, video, and web — working together instead of scattered across freelancers. Real people, real turnaround times, and pricing built around your actual project.',
    cta1: 'See Our Work',
    cta2: 'Get a Custom Quote',
    mockup_primary: ''
  },
  intro_band: {
    title: 'The creative services ambitious brands ask for most, packaged for reliable monthly execution',
    pillars: [
      { title: 'Monthly social media management', desc: 'Consistent calendars, post design, captions, scheduling, and reporting for growing brands.', color: '#E8192C' },
      { title: 'Brand-ready creative assets', desc: 'Graphic design, campaign visuals, ad creatives, and templates that keep your business polished.', color: '#7C3AED' },
      { title: 'Video, marketing, and websites', desc: 'Short-form video edits, digital marketing support, and conversion-focused website design.', color: '#0EA5E9' }
    ]
  },
  clients: {
    label: 'Trusted by brands in global markets',
    list: 'Maple & Co, Northstar Dental, Harbor Cafe, Green Eats, Nova Clothing, EduBridge, HealthPlus, CraftNest, ShopLocal, ByteWave, Riverside Resto, Summit Fitness'
  },
  smm_highlight: {
    title: 'Monthly social media management for international brands',
    lead: 'A dedicated creative workflow for founders who need consistent, polished social media without hiring a full in-house team. We plan, design, write, schedule, and report, so your business stays active and trustworthy every week.',
    cta_label: 'Explore SMM Packages',
    board_title: 'Monthly Growth Board',
    status: 'Ready for Review',
    included: 'content calendar, branded templates, short-form video direction, caption writing, scheduling support, and analytics.',
    metrics: {
      left_label: 'Content pieces',
      left_value: '30',
      left_note: 'Posts, stories, reels',
      right_label: 'Platforms',
      right_value: '3',
      right_note: 'Instagram, Facebook, LinkedIn'
    },
    benefits: [
      { title: 'Done-for-you monthly calendar', desc: 'Post ideas, designs, captions, hashtags, and scheduling prepared before the month starts.' },
      { title: 'Brand voice and community support', desc: 'Professional captions, customer-facing replies guidance, and consistent visual tone.' },
      { title: 'Performance reporting', desc: 'Monthly reach, engagement, content winners, and next-step recommendations.' }
    ]
  },
  features: {
    title: 'Elite creative operations without the agency markup',
    subtitle: 'Senior-level talent, async project management, and transparent pricing — premium results at a fraction of standard agency rates.',
    visual_title: 'Creative operations built for recurring growth',
    badges: ['Social Media Management', 'Graphic Design', 'Video Editing', 'Digital Marketing', 'Website Design'],
    stats: [
      { value: '200+', label: 'Clients Served' },
      { value: '7+', label: 'Years Experience' },
      { value: '98%', label: 'Satisfaction Rate' }
    ],
    items: [
      { title: 'Built for international buyers', desc: 'Copy, visuals, formats, and offers are shaped for global audiences.' },
      { title: 'Agency process, gig-style clarity', desc: 'Clear scope, milestones, revisions, and deliverables before work begins.' },
      { title: 'Timezone-friendly production', desc: 'Async updates, organized reviews, and steady weekly progress without meetings overload.' },
      { title: 'Creative tied to business outcomes', desc: 'Content and design decisions are made around leads, trust, reach, and conversion.' }
    ]
  },
  process: {
    title: 'A clear process from first brief to final delivery',
    subtitle: 'Every project follows a visible workflow, so you know what is happening, what needs approval, and when deliverables are due.',
    steps: [
      { num: '01', title: 'Audit and brief', desc: 'We review your current brand, competitors, audience, goals, and existing assets before proposing scope.' },
      { num: '02', title: 'Strategy and calendar', desc: 'We map the service plan, creative direction, content calendar, milestones, and approval process.' },
      { num: '03', title: 'Creative production', desc: 'Designers, editors, writers, and web specialists produce drafts with organized review checkpoints.' },
      { num: '04', title: 'Review and refinement', desc: 'You review via structured feedback rounds — we refine until assets meet final standards.' },
      { num: '05', title: 'Handover and assets', desc: 'Final high-res files, templates, source files, and usage notes handed over cleanly.' }
    ]
  },
  about_trust: {
    title: 'A dedicated creative team for growing businesses',
    lead: 'CreatifyBD brings together experienced designers, editors, copywriters, and web specialists to deliver full-service creative support without traditional agency markup.',
    ceo_name: 'MD ALAMIN ALI',
    ceo_title: 'Founder & Managing Director',
    ceo_note: 'Our goal is simple: deliver elite creative work with total transparency, fast execution, and zero friction for business owners worldwide.',
    ceo_image: '/assets/team-founder.png',
    stat_years: '7+',
    stat_projects: '500+',
    stat_rating: '4.9★'
  },
  cta_band: {
    heading: 'Ready to elevate your brand visual presence?',
    subheading: 'Book a free strategy session or request a custom proposal tailored to your business goals.',
    btn_primary: 'Get Started Today',
    btn_secondary: 'View Our Portfolio'
  },
  contact: {
    heading: 'Let us build something great together',
    subheading: 'Tell us about your brand, goals, and requirements. We will review your brief and respond within 24 hours with a clear plan and quote.',
    address: 'Serving clients globally'
  }
};
