const priceBlocks = [
  {
    icon: '📱',
    title: 'Social Media Management',
    signature: true,
    cardsClass: '',
    cards: [
      {
        tier: 'Starter',
        old: '$2,200/mo',
        amt: '$1,320',
        per: '/month',
        save: 'You save $880/month',
        feats: [
          '1–2 platforms managed',
          'Account setup & optimization',
          '12–15 posts / month',
          'Basic monthly report',
        ],
        cta: 'Start With Starter',
        outline: true,
      },
      {
        tier: 'Growth',
        pop: 'Most Popular',
        old: '$4,500/mo',
        amt: '$2,700',
        per: '/month',
        save: 'You save $1,800/month',
        feats: [
          '3–4 platforms managed',
          'Content creation + posting calendar',
          '20–24 posts / month',
          'Community engagement',
          'SEO & profile optimization',
        ],
        cta: 'Start With Growth',
        outline: false,
      },
      {
        tier: 'Full Ownership',
        old: '$8,500/mo',
        amt: '$5,100',
        per: '/month',
        save: 'You save $3,400/month',
        feats: [
          'All relevant platforms',
          'Daily posting + video content',
          'Full account responsibility',
          'Advanced SEO & analytics',
          'Dedicated account manager',
        ],
        cta: 'Go Full Ownership',
        outline: true,
      },
    ],
  },
  {
    icon: '🎨',
    title: 'Graphic Design',
    cardsClass: 'two',
    cards: [
      {
        tier: 'Starter Subscription',
        old: '$650/mo',
        amt: '$390',
        per: '/month',
        save: 'You save $260/month',
        feats: [
          'Unlimited design requests',
          '1 active task at a time',
          '48-hour average turnaround',
          'Unlimited revisions',
        ],
        cta: 'Choose Starter',
        outline: true,
      },
      {
        tier: 'Studio Subscription',
        pop: 'Best Value',
        old: '$1,450/mo',
        amt: '$870',
        per: '/month',
        save: 'You save $580/month',
        feats: [
          'Everything in Starter',
          'Dedicated designer',
          '24-hour priority turnaround',
          'Brand guideline development',
        ],
        cta: 'Choose Studio',
        outline: false,
      },
    ],
  },
  {
    icon: '📈',
    title: 'Digital Marketing',
    cardsClass: 'two',
    cards: [
      {
        tier: 'Local Growth',
        old: '$2,000/mo',
        amt: '$1,200',
        per: '/month',
        save: 'You save $800/month',
        feats: [
          'On-page & technical SEO',
          'Monthly keyword tracking',
          'Google Business optimization',
          'Monthly performance report',
        ],
        cta: 'Choose Local Growth',
        outline: true,
      },
      {
        tier: 'Full Funnel',
        pop: 'Best Value',
        old: '$4,000/mo',
        amt: '$2,400',
        per: '/month',
        save: 'You save $1,600/month',
        feats: [
          'Everything in Local Growth',
          'Campaign strategy & execution',
          'Landing page optimization',
          'Bi-weekly strategy check-ins',
        ],
        cta: 'Choose Full Funnel',
        outline: false,
      },
    ],
  },
  {
    icon: '🎬',
    title: 'Video Editing',
    cardsClass: '',
    cards: [
      {
        tier: 'Per Video',
        old: '$350/video',
        amt: '$210',
        per: '/video',
        save: 'You save $140/video',
        feats: [
          'Short-form edit (Reels/TikTok/Shorts)',
          'Captions, transitions, sound design',
          '2 revision rounds',
        ],
        cta: 'Order a Video',
        outline: true,
      },
      {
        tier: 'Short-Form Retainer',
        pop: 'Most Popular',
        old: '$2,200/mo',
        amt: '$1,320',
        per: '/month',
        save: 'You save $880/month',
        feats: [
          '8–12 short-form videos / month',
          'Platform-native pacing & captions',
          'Unlimited revisions',
        ],
        cta: 'Start Retainer',
        outline: false,
      },
      {
        tier: 'Studio Retainer',
        old: '$4,200/mo',
        amt: '$2,520',
        per: '/month',
        save: 'You save $1,680/month',
        feats: [
          'Long-form + short-form videos',
          'Color grading & motion graphics',
          'Dedicated editor',
        ],
        cta: 'Start Studio Retainer',
        outline: true,
      },
    ],
  },
  {
    icon: '💻',
    title: 'Website Design',
    cardsClass: '',
    cards: [
      {
        tier: 'Essential',
        old: '$3,000',
        amt: '$1,800',
        per: 'one-time',
        save: 'You save $1,200',
        feats: ['Up to 6 pages', 'Custom design, mobile-optimized', 'Basic on-page SEO setup'],
        cta: 'Choose Essential',
        outline: true,
      },
      {
        tier: 'Business',
        pop: 'Most Popular',
        old: '$6,500',
        amt: '$3,900',
        per: 'one-time',
        save: 'You save $2,600',
        feats: [
          'Up to 12 pages, fully custom',
          'CMS integration',
          'Advanced SEO structure',
          '30-day post-launch support',
        ],
        cta: 'Choose Business',
        outline: false,
      },
      {
        tier: 'Premium / E-commerce',
        old: '$12,000',
        amt: '$7,200',
        per: 'one-time',
        save: 'You save $4,800',
        feats: [
          'Full e-commerce build',
          'Custom functionality & integrations',
          '90-day post-launch support',
        ],
        cta: 'Choose Premium',
        outline: true,
      },
    ],
  },
]

function PriceCard({ card }) {
  return (
    <div className={`price-card ${card.pop ? 'pop' : ''} reveal`}>
      {card.pop && <div className="pop-tag">{card.pop}</div>}
      <div className="price-tier">{card.tier}</div>
      <div className="price-old">{card.old}</div>
      <div className="price-new">
        <span className="amt">{card.amt}</span>
        <span className="per">{card.per}</span>
      </div>
      <div className="price-save">{card.save}</div>
      <div className="price-feats">
        {card.feats.map((f, i) => (
          <div key={i}>{f}</div>
        ))}
      </div>
      <a href="#contact" className={`btn ${card.outline ? 'btn-outline' : 'btn-accent'}`}>
        {card.cta}
      </a>
    </div>
  )
}

export default function Pricing() {
  return (
    <section id="pricing" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Pricing</span>
          <h2>International standard quality, honestly priced.</h2>
          <p>
            We benchmark every package against verified 2026 international agency rates, then
            price up to 40% below them for the same scope of work.
          </p>
        </div>
        <div className="pricing-note reveal">
          <b>How to read these prices:</b> the crossed-out figure is the current international
          market rate for that exact scope of service. The bold price beside it is what
          CreatifyBD charges for the same deliverables — no shortcuts, no reduced scope.
        </div>

        {priceBlocks.map((block, idx) => (
          <div className="price-block reveal" key={idx}>
            <div className="price-block-head">
              <h3>
                <span className="ic">{block.icon}</span>
                {block.title}
                {block.signature && (
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                    {' '}
                    — Signature Service
                  </span>
                )}
              </h3>
              <span className="savings">Save up to 40%</span>
            </div>
            <div className={`price-cards ${block.cardsClass}`}>
              {block.cards.map((card, i) => (
                <PriceCard card={card} key={i} />
              ))}
            </div>
          </div>
        ))}

        <div className="see-all reveal">
          <a href="#contact" className="btn btn-accent">
            Get a Custom Bundle Quote →
          </a>
        </div>
      </div>
    </section>
  )
}
