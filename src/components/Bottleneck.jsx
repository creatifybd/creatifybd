export default function Bottleneck() {
  const marqueeItems = [
    'Social Media Management',
    'Graphic Design',
    'Digital Marketing',
    'Video Editing',
    'Website Design',
    'Brand Identity',
  ]

  return (
    <>
      <section>
        <div className="wrap feature">
          <div className="feature-visual reveal">
            <div className="ring">
              <div className="ring-in">
                7+ Years
                <br />
                Experience
              </div>
            </div>
          </div>
          <div className="reveal">
            <span className="eyebrow">Fix Your Social Media Bottleneck</span>
            <h2>Your accounts deserve more than "when I get time."</h2>
            <p>
              Most brands know social media matters — and most founders don't have the hours to
              run it properly. CreatifyBD takes it off your plate entirely: setup, content,
              posting, and optimization, handled by a partner who treats your brand like their
              own.
            </p>
            <a href="#pricing" className="btn btn-outline">
              See Our Plans
            </a>
          </div>
        </div>
      </section>

      <div className="strip">
        <p>What we deliver, every day</p>
        <div className="marquee">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
