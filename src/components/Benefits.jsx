const benefits = [
  {
    ringText: (
      <>
        Client-
        <br />
        Centred
      </>
    ),
    eyebrow: 'Flexibility & Client-Centered Approach',
    heading: 'Built around how you actually want to work',
    checks: [
      { h: 'No Long-Term Lock-In', p: "Month-to-month on retainers — stay because it's working, not because of a contract." },
      { h: 'Unlimited Revisions', p: "We refine the work until you're genuinely satisfied, not just until the invoice clears." },
      { h: 'Fixed, Transparent Pricing', p: 'You know the exact cost before work begins — no surprise line items later.' },
    ],
  },
  {
    ringText: (
      <>
        24h
        <br />
        Response
      </>
    ),
    eyebrow: 'Speed & Professionalism',
    heading: 'Experienced hands on every single deliverable',
    checks: [
      { h: '7+ Years of Real Client Work', p: 'Backed by hands-on experience across brand, packaging and digital design.' },
      { h: 'Fast, Reliable Turnaround', p: 'Clear timelines communicated upfront — and kept.' },
      { h: 'Direct Communication', p: 'You talk to the person doing the work. Always. No account-manager relay.' },
    ],
  },
  {
    ringText: (
      <>
        Full
        <br />
        Ownership
      </>
    ),
    eyebrow: 'Organization & Full Control',
    heading: 'Everything handed over, fully and clearly yours',
    checks: [
      { h: 'Native Source Files', p: 'Original, editable files delivered for complete ownership — no lock-in to us.' },
      { h: 'Organized Handoff', p: 'Every deliverable labelled, export-ready, and easy to find later.' },
      { h: 'Ongoing Support', p: 'Questions after delivery are part of the service, not a paid extra.' },
    ],
  },
]

export default function Benefits() {
  return (
    <div className="wrap">
      {benefits.map((b, i) => (
        <div className="benefit" key={i}>
          <div className="benefit-visual reveal">
            <div className="ring">
              <div className="ring-in" style={{ fontSize: '1.1rem' }}>
                {b.ringText}
              </div>
            </div>
          </div>
          <div className="reveal">
            <span className="eyebrow">{b.eyebrow}</span>
            <h3>{b.heading}</h3>
            <div className="check-list">
              {b.checks.map((c, j) => (
                <div className="check-item" key={j}>
                  <div className="check-mark">✓</div>
                  <div>
                    <h4>{c.h}</h4>
                    <p>{c.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
