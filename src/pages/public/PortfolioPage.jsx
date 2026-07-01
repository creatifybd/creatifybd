import React from 'react';
import Navbar from '../../components/Navbar';
import Portfolio from '../../components/Portfolio';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const PortfolioPage = () => {
  return (
    <div className="portfolio-page">
      <SEO
        title="Portfolio | CreatifyBD Creative Work"
        description="Explore CreatifyBD portfolio featuring premium graphic design, branding, and digital marketing projects delivered with excellence."
        keywords="creatifybd portfolio, creative agency work dhaka, web design portfolio bangladesh, digital marketing case studies"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "CreatifyBD Portfolio",
          "description": "Collection of premium digital marketing and design projects by CreatifyBD.",
          "url": "https://creatifybd.com/work"
        }}
      />
      <Navbar />
      <Portfolio fullPage={true} />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
