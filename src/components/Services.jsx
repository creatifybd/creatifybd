const services = [
  { key: 'a', title: 'Graphic Design', desc: 'Brand identity, logos & marketing creative.' },
  { key: 'b', title: 'Digital Marketing', desc: 'SEO & growth-focused campaign execution.' },
  { key: 'c', title: 'Video Editing', desc: 'Short and long-form edits for every platform.' },
  { key: 'd', title: 'Website Design', desc: 'Fast, on-brand sites built to convert.' },
]

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Our Services</span>
          <h2>Everything your brand needs, under one roof.</h2>
          <p>
            Pick a single service or bundle several — every deliverable comes from CreatifyBD
            directly, never outsourced.
          </p>
        </div>
        <div className="services-grid-img" id="signature">
          <div className="svc-tile signature reveal">
            <div className="svc-tile-content">
              <span className="flag">★ Signature Service</span>
              <h3>Social Media Management</h3>
              <p>Setup, content, posting, community and SEO — we run the whole account.</p>
            </div>
          </div>
          {services.map((s) => (
            <div className={`svc-tile ${s.key} reveal`} key={s.key}>
              <div className="svc-tile-content">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="see-all reveal">
          <a href="#pricing" className="btn btn-outline">
            See Pricing For Every Service →
          </a>
        </div>
      </div>
    </section>
  )
}
