import React from 'react';
import Navbar from '../../components/Navbar';
import Services from '../../components/Services';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <SEO
        title="Creative, Digital Marketing & Web Services | CreatifyBD"
        description="Explore CreatifyBD services including social media marketing, branding, web design, photography, videography, SEO and content production."
        keywords="digital marketing services dhaka, web development bangladesh, SEO services dhaka, branding services, creatifybd services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing & Web Development",
          "provider": {
            "@type": "LocalBusiness",
            "name": "CreatifyBD"
          }
        }}
      />
      <Navbar />
      <Services fullPage={true} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
