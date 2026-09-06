import React from 'react';
import Navbar from '../../components/Navbar';
import Portfolio from '../../components/Portfolio';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';

const PortfolioPage = () => {
  const seo = usePageSEO('portfolio', {
    title: "আমাদের পোর্টফোলিও ও কাজের নমুনা — CreatifyBD",
    description: "লোগো ডিজাইন, সোশ্যাল মিডিয়া পোস্টার, ভিডিও এডিটিং ও ওয়েবসাইট ডেভেলপমেন্ট—আমাদের তৈরি করা সফল প্রজেক্টের গ্যালারি।"
  });

  return (
    <div className="portfolio-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="পোর্টফোলিও, গ্রাফিক ডিজাইন স্যাম্পল, ভিডিও এডিটিং কাজ, ওয়েবসাইট পোর্টফোলিও, creatifybd portfolio, creative work bangladesh"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "CreatifyBD ক্রিয়েটিভ পোর্টফোলিও",
          "description": "লোগো ডিজাইন, ভিডিও এডিটিং ও সোশ্যাল মিডিয়া প্রজেক্টের সংগ্রহ",
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
