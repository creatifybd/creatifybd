import React from 'react';
import Navbar from '../../components/Navbar';
import Services from '../../components/Services';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';

const ServicesPage = () => {
  const seo = usePageSEO('services', {
    title: "What We Do \u2014 Branding, Social Media, Video & Web | CreatifyBD",
    description: "Four disciplines, one team, zero gaps between departments who've never met each other. See how we build brands, run social, edit video, and ship websites."
  });

  return (
    <div className="services-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="digital marketing agency services, social media management service, graphic design service, video editing service, creative agency services, best marketing agency services, social media marketing company, graphic design agency, video production company, web design services, content marketing services, branding agency services, online marketing services, creative design services, professional video editing services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing & Creative Services",
          "name": "CreatifyBD Digital Marketing Services",
          "description": "Comprehensive digital marketing and creative services including social media management, graphic design, video editing, and website design",
          "provider": {
            "@type": "Organization",
            "name": "CreatifyBD",
            "url": "https://creatifybd.com"
          },
          "areaServed": "Global"
        }}
      />
      <Navbar />
      <Services fullPage={true} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
