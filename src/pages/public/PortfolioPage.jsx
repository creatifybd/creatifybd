import React from 'react';
import Navbar from '../../components/Navbar';
import Portfolio from '../../components/Portfolio';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';

const PortfolioPage = () => {
  const seo = usePageSEO('portfolio', {
    title: "Creative Agency Portfolio | Graphic Design, Video Editing & Digital Marketing Work | CreatifyBD",
    description: "Explore CreatifyBD creative agency portfolio featuring premium graphic design, video editing, social media management, and digital marketing projects delivered for USA, Canada, and Australia clients."
  });

  return (
    <div className="portfolio-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="creative agency portfolio, graphic design portfolio, video editing portfolio, digital marketing portfolio, social media management portfolio, best graphic design work, creative design showcase, marketing agency portfolio, web design portfolio, branding portfolio, video production portfolio, creative work samples, design agency portfolio, digital marketing case studies, social media marketing portfolio, creative agency work samples"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "CreatifyBD Creative Portfolio",
          "description": "Collection of premium graphic design, video editing, and digital marketing projects by CreatifyBD creative agency.",
          "url": "https://creatifybd.com/portfolio",
          "provider": {
            "@type": "Organization",
            "name": "CreatifyBD",
            "url": "https://creatifybd.com"
          }
        }}
      />
      <Navbar />
      <Portfolio fullPage={true} />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
