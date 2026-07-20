import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const LegalPage = ({ type }) => {
  const location = useLocation();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';

  return (
    <div className="legal-page">
      <SEO
        title={`${title} | CreatifyBD`}
        description={`${title} for CreatifyBD clients and website visitors.`}
        url={`https://creatifybd.com${location.pathname}`}
      />
      <Navbar />
      <main className="container" style={{ padding: '9rem 1rem 5rem', maxWidth: '900px' }}>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle" style={{ marginBottom: '3rem' }}>
          This page explains how CreatifyBD handles website inquiries, project communication, and service use.
        </p>

        {isPrivacy ? (
          <>
            <Section title="Information We Collect" text="When you submit an inquiry, we collect your name, email, phone number, selected service, budget range, and project message so our team can respond." />
            <Section title="How We Use It" text="We use submitted information only for consultation, project planning, client communication, and service improvement." />
            <Section title="Data Sharing" text="We do not sell personal information. We may use trusted infrastructure providers such as Firebase to store and operate the website." />
            <Section title="Contact" text="For privacy questions, email hello@creatifybd.com." />
          </>
        ) : (
          <>
            <Section title="Services" text="CreatifyBD provides digital marketing, branding, design, web development, and creative production services based on agreed project scope." />
            <Section title="Quotes and Timelines" text="Pricing, deliverables, and timelines are confirmed before project work begins. Changes to scope may affect cost or delivery time." />
            <Section title="Client Materials" text="Clients are responsible for providing accurate brand, product, and business information needed to complete the work." />
            <Section title="Contact" text="For service questions, email hello@creatifybd.com." />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

const Section = ({ title, text }) => (
  <section style={{ marginBottom: '2rem' }}>
    <h2 style={{ marginBottom: '0.75rem' }}>{title}</h2>
    <p style={{ color: 'rgba(0,0,0,0.68)', lineHeight: 1.8 }}>{text}</p>
  </section>
);

export default LegalPage;
