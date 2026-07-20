import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { lang } = useLanguage();

  return (
    <div className="not-found-page" style={{ background: 'var(--black)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEO 
        title="404 Not Found | CreatifyBD"
        description="The page you are looking for does not exist."
        noIndex
      />
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(6rem, 15vw, 12rem)', 
            fontWeight: 900, 
            color: 'var(--red)', 
            lineHeight: 1,
            marginBottom: '1rem'
          }}>
            404
          </h1>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            color: 'var(--white)',
            marginBottom: '2rem'
          }}>
            {lang === 'bn' ? 'পেজটি পাওয়া যায়নি' : 'Page Not Found'}
          </h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
            {lang === 'bn' 
              ? 'আপনি যে পেজটি খুঁজছেন তা সম্ভবত সরিয়ে ফেলা হয়েছে অথবা লিংকটি ভুল।' 
              : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
          </p>
          <Link to="/" className="btn-red">
            {lang === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Homepage'}
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
