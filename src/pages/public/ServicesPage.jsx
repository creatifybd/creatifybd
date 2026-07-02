import React from 'react';
import Navbar from '../../components/Navbar';
import Services from '../../components/Services';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <SEO
        title="Best Digital Marketing Agency Services | Social Media Management, Graphic Design, Video Editing | CreatifyBD"
        description="CreatifyBD is the best digital marketing agency offering comprehensive creative services including social media management, graphic design service, video editing service, and digital marketing service for USA, Canada, and Australia."
        keywords="digital marketing agency services, social media management service, graphic design service, video editing service, creative agency services, best marketing agency services, social media marketing company, graphic design agency, video production company, web design services, content marketing services, branding agency services, online marketing services, creative design services, professional video editing services, social media management USA, digital marketing Canada, creative agency Australia"
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
          "areaServed": [
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "Canada" },
            { "@type": "Country", "name": "Australia" }
          ]
        }}
      />
      <Navbar />
      <Services fullPage={true} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
