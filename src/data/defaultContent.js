export const CONTENT_VERSION = 20260722_11;

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
    eyebrow: "For founders who've outgrown freelancers",
    title: 'Your Brand Deserves Creative Work That Actually <span class="text-red">Converts.</span>',
    desc: "CreatifyBD is a dedicated creative team — branding, social, video, and web — built to make your business look and feel like an industry leader, without the industry-sized budget. No more chasing freelancers. No more agency price shock.",
    cta1: 'See Real Client Results',
    cta2: 'Get a Free Quote',
    mockup_primary: ''
  },
  intro_band: {
    title: 'The creative team serious brands keep on retainer.',
    pillars: [
      { title: 'Done-for-you social content', desc: 'Full-service monthly management — strategy, design, captions, and scheduling — so your brand stays active and building audiences while you run your business.', color: '#E8192C' },
      { title: 'Brand identity that commands respect', desc: "Visual identity that makes your business look established from day one — whether pitching investors, launching a product, or competing for international clients.", color: '#7C3AED' },
      { title: 'Video + web that converts', desc: 'High-impact video content and conversion-focused websites that turn first impressions into leads, and leads into loyal customers.', color: '#0EA5E9' }
    ]
  },
  clients: {
    label: 'Trusted by brands in global markets',
    list: 'Maple & Co, Northstar Dental, Harbor Cafe, Green Eats, Nova Clothing, EduBridge, HealthPlus, CraftNest, ShopLocal, ByteWave, Riverside Resto, Summit Fitness'
  },
  smm_highlight: {
    title: 'Your brand, posting consistently — without you lifting a finger.',
    lead: "Most founders know they should be posting consistently. Most don't, because creating quality content takes hours every week. We handle everything — strategy, design, captions, scheduling, and reporting — so your business stays visible, professional, and growing every single week.",
    cta_label: 'Explore SMM Packages',
    board_title: 'Monthly Content Board',
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
      { title: 'A full month of content — before the month starts', desc: "Post ideas, branded designs, captions, hashtags, and scheduling prepared ahead of time so your feed never goes dark." },
      { title: 'Your brand voice, consistently', desc: "Professional captions that sound like you, community engagement guidance, and a visual style that stays on-brand across every post." },
      { title: 'Monthly results, not just activity', desc: "Reach, engagement, content winners, and what we're doing next — so you always know what's working and why." }
    ]
  },
  features: {
    title: 'The agency experience. Without the agency games.',
    subtitle: "No retainer traps. No vague timelines. No 'we'll add that in the next phase.' Just senior-level creative work, delivered transparently.",
    visual_title: 'Creative operations built for recurring growth',
    badges: ['Social Media Management', 'Graphic Design', 'Video Editing', 'Digital Marketing', 'Website Design'],
    stats: [
      { value: '200+', label: 'Clients Served' },
      { value: '7+', label: 'Years Experience' },
      { value: '98%', label: 'Satisfaction Rate' }
    ],
    items: [
      { title: "You'll always know what's happening", desc: "Live project dashboards, milestone updates, and real revision rounds — full visibility, zero chasing." },
      { title: "Fast doesn't mean rushed", desc: "Most deliverables within 48–72h. We're quick because we're experienced, not because we're cutting corners." },
      { title: 'What you see is what you pay', desc: "We quote before we start. No surprise costs added halfway through your project." },
      { title: "Revisions until it's actually right", desc: "We keep refining the work until it matches your vision — revisions are part of the process, not an extra charge." }
    ]
  },
  process: {
    title: 'Starting a project feels like this — not like pulling teeth.',
    subtitle: "Five clear steps from first message to final delivery. You'll always know where things stand, what's next, and when to expect it.",
    steps: [
      { num: '01', title: 'You share the vision', desc: "Tell us about your business, goals, and what you need. No lengthy forms or sales calls — just a message is enough to get started." },
      { num: '02', title: 'We map the roadmap', desc: "We send a clear proposal: timeline, deliverables, revision rounds, and pricing — everything agreed before any work begins." },
      { num: '03', title: 'We make it', desc: "Your dedicated creative team gets to work. Regular updates at every milestone so you're never left wondering." },
      { num: '04', title: 'You shape it', desc: "Structured review rounds where your feedback becomes the next version — clean and organized, not a back-and-forth email chain." },
      { num: '05', title: 'You own it', desc: "Final files delivered, organized, and ready to use. Source files, brand assets, web code — everything is yours, forever." }
    ]
  },
  about_trust: {
    title: 'Built by creators, for businesses that refuse to blend in.',
    subtitle: "CreatifyBD was built on a simple frustration — great creative work shouldn't require a massive agency budget or a freelancer roulette that never quite delivers.",
    team_heading: 'Specialist delivery model',
    ceo_quote: "We saw the same pattern everywhere: brands settling for average work because great agencies were too expensive, and cheaper options kept letting them down. We built CreatifyBD to close that gap permanently — top-tier quality, real team, honest pricing.",
    cta_label: 'Read Our Story',
    stat_years: '7+',
    stat_projects: '500+',
    stat_rating: '4.9?'
  },
  cta_band: {
    heading: 'What would your business look like with a real creative team behind it?',
    subheading: "Most of our clients say the same thing after the first project: 'I wish I'd done this sooner.' Start with one project. See the difference.",
    btn_primary: 'Start a Project',
    btn_secondary: 'hello@creatifybd.com'
  },
  contact: {
    heading: "Let's talk about what you're building.",
    subheading: "Share your goals — we'll come back within 24 hours with a concrete plan and a clear quote. No pressure. No sales script.",
    address: 'Serving clients globally'
  }
};
