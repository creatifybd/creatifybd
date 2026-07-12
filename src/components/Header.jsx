export default function Header() {
  return (
    <header>
      <div className="nav">
        <a href="#" className="logo">
          Creatify<span>BD</span>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#services">
              Capabilities <span className="caret"></span>
            </a>
            <div className="mega">
              <a href="#signature" className="signature">
                Social Media Management <span className="flag">Signature</span>
              </a>
              <a href="#services">Graphic Design</a>
              <a href="#services">Digital Marketing</a>
              <a href="#services">Video Editing</a>
              <a href="#services">Website Design</a>
              <a href="#services" className="all-link">
                All Services →
              </a>
            </div>
          </li>
          <li>
            <a href="#work">
              Our Work <span className="caret"></span>
            </a>
            <div className="mega">
              <a href="#work">Portfolio</a>
              <a href="#testimonials">Client Feedback</a>
            </div>
          </li>
          <li>
            <a href="#process">Process</a>
          </li>
          <li>
            <a href="#about">About Us</a>
          </li>
        </ul>
        <div className="nav-right">
          <a href="#contact" className="btn btn-accent nav-cta">
            Book a Call
          </a>
          <div className="burger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  )
}
