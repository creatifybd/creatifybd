const steps = [
  { num: 'STEP 01', title: 'Choose a Package', desc: 'Pick the service and tier that matches your needs and budget from our published pricing.' },
  { num: 'STEP 02', title: 'Kickoff Call', desc: 'A short call to align on your brand, goals and expectations before anything starts.' },
  { num: 'STEP 03', title: 'Brief & Access', desc: "You share brand assets, references and any account access we'll need to begin." },
  { num: 'STEP 04', title: 'Setup & Planning', desc: 'Accounts configured or a content/design calendar built around your first month.' },
  { num: 'STEP 05', title: 'First Delivery', desc: 'Initial designs, posts or pages delivered for your review within the agreed timeline.' },
  { num: 'STEP 06', title: 'Feedback & Revisions', desc: 'You review, we refine — until the work is exactly right, not just "done."' },
  { num: 'STEP 07', title: 'Ongoing Management', desc: 'For retainers, we take over day-to-day execution while keeping you updated.' },
  { num: 'STEP 08', title: 'Monthly Reporting', desc: 'A clear report each month on what shipped and how it performed.' },
]

export default function Process() {
  return (
    <section id="process" style={{ background: 'var(--surface)' }}>
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">How It Works</span>
          <h2>Here's how to get started</h2>
          <p>The same clear route, every time — from first message to a fully managed brand presence.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card reveal" key={i}>
              <span className="step-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
