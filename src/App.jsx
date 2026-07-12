import useSiteEffects from './useSiteEffects'
import Header from './components/Header'
import Hero from './components/Hero'
import Bottleneck from './components/Bottleneck'
import Services from './components/Services'
import Pricing from './components/Pricing'
import Work from './components/Work'
import Process from './components/Process'
import Benefits from './components/Benefits'
import Trust from './components/Trust'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  useSiteEffects()

  return (
    <>
      <div id="progress-bar"></div>
      <Header />
      <Hero />
      <Bottleneck />
      <Services />
      <Pricing />
      <Work />
      <Process />
      <Benefits />
      <Trust />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
