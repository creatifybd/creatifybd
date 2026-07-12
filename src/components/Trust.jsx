const stats = [
  { num: '7+', label: 'Years of hands-on design & creative experience' },
  { num: 'Lvl 1', label: 'Fiverr Seller, rated directly by real clients' },
  { num: '40%', label: 'Average savings vs. international agency rates' },
  { num: '24h', label: 'Typical response time, across time zones' },
]

export default function Trust() {
  return (
    <section>
      <div className="wrap">
        <div className="trust-block reveal">
          <div className="trust-block-inner">
            <div>
              <span className="eyebrow">Why Businesses Choose Us</span>
              <h2>No awards page. Just work that speaks for itself.</h2>
              <p>
                We'd rather show you real numbers than borrowed credibility. Here's what actually
                backs CreatifyBD.
              </p>
            </div>
            <div className="trust-grid">
              {stats.map((s, i) => (
                <div className="trust-card" key={i}>
                  <div className="tnum">{s.num}</div>
                  <div className="tlabel">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
