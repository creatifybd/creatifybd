const testimonials = [
  {
    tag: 'Social Media Management',
    quote: '"Sample placeholder — replace with a real quote from your Fiverr or client reviews before publishing."',
    who: 'Placeholder Client',
    role: 'Role, Company — via Fiverr',
  },
  {
    tag: 'Brand & Packaging',
    quote: '"Sample placeholder — replace with a real quote from your Fiverr or client reviews before publishing."',
    who: 'Placeholder Client',
    role: 'Role, Company — via Fiverr',
  },
  {
    tag: 'Website Design',
    quote: '"Sample placeholder — replace with a real quote from your Fiverr or client reviews before publishing."',
    who: 'Placeholder Client',
    role: 'Role, Company — Direct Client',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="wrap">
        <div className="section-head center reveal">
          <span className="eyebrow">Client Feedback</span>
          <h2>What Clients Say</h2>
        </div>
        <div className="testi-scroll">
          {testimonials.map((t, i) => (
            <div className="testi-card2 reveal" key={i}>
              <span className="service-tag2">{t.tag}</span>
              <div className="testi-scores">
                <div>
                  Quality<b>5.0</b>
                </div>
                <div>
                  Schedule<b>5.0</b>
                </div>
                <div>
                  Communication<b>5.0</b>
                </div>
              </div>
              <p className="quote">{t.quote}</p>
              <div className="who">{t.who}</div>
              <div className="whorole">{t.role}</div>
            </div>
          ))}
        </div>
        <p className="testi-note">
          These cards are placeholders — swap in your real client reviews (with permission) before
          this goes live. We never publish a quote we can't back up.
        </p>
      </div>
    </section>
  )
}
