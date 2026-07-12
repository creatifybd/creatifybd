const items = [
  { label: 'Social Media Management', cls: 'wide' },
  { label: 'Brand Identity', cls: 'tall' },
  { label: 'Logo Design', cls: '' },
  { label: 'Digital Marketing', cls: '' },
  { label: 'Website Design', cls: 'wide' },
  { label: 'Video Editing', cls: '' },
  { label: 'Packaging Design', cls: '' },
  { label: 'Content Design', cls: '' },
]

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Selected Projects</span>
          <h2>Our Work</h2>
          <p>A sample of the categories we design and manage most — full case studies shared on request.</p>
        </div>
        <div className="work-grid">
          {items.map((item, i) => (
            <div className={`work-item ${item.cls} reveal`} key={i}>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="see-all reveal">
          <a href="#" className="btn btn-outline">
            See All Work →
          </a>
        </div>
      </div>
    </section>
  )
}
