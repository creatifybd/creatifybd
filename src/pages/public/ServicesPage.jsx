import React from 'react';
import Navbar from '../../components/Navbar';
import Services from '../../components/Services';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';

const ServicesPage = () => {
  const seo = usePageSEO('services', {
    title: "আমাদের সার্ভিসসমূহ — ব্র্যান্ডিং, সোশ্যাল মিডিয়া, ভিডিও ও ওয়েব | CreatifyBD",
    description: "আপনার বিজনেসের জন্য ফুল-সার্ভিস ক্রিয়েটিভ সলিউশন — সোশ্যাল মিডিয়া ম্যানেজমেন্ট, লোগো ও ব্র্যান্ডিং, ভিডিও এডিটিং এবং ফাস্ট-লোডিং ওয়েবসাইট।"
  });

  return (
    <div className="services-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="ক্রিয়েটিভ সার্ভিস, সোশ্যাল মিডিয়া ম্যানেজমেন্ট, লোগো ডিজাইন, ভিডিও এডিটিং, ওয়েবসাইট ডিজাইন, ডিজিটাল মার্কেটিং বাংলাদেশ, creatifybd services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Digital Marketing & Creative Services",
          "name": "CreatifyBD ক্রিয়েটিভ সার্ভিসেস",
          "description": "সোশ্যাল মিডিয়া ম্যানেজমেন্ট, গ্রাফিক ডিজাইন, ভিডিও এডিটিং এবং ওয়েবসাইট ডেভেলপমেন্ট",
          "provider": {
            "@type": "Organization",
            "name": "CreatifyBD",
            "url": "https://creatifybd.com"
          },
          "areaServed": "Bangladesh"
        }}
      />
      <Navbar />
      <Services fullPage={true} />
      <Footer />
    </div>
  );
};

export default ServicesPage;
