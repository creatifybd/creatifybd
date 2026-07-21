import React from 'react';
import Navbar from '../../components/Navbar';
import Process from '../../components/Process';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { motion } from 'framer-motion';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const ProcessPage = () => {
  const seo = usePageSEO('process', {
    title: "How We Work \u2014 From Brief to Final Delivery | CreatifyBD",
    description: "No mystery black box. Here's exactly what happens after you reach out, step by step, from first brief to final files."
  });

  return (
    <div className="process-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about creatifybd, creative agency process, web design workflow, digital marketing strategy"
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.08 }}
          >
            How We <span className="red">Work</span>
          </motion.h1>

          <motion.p
            className="page-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO, delay: 0.2 }}
          >
            A systematic, 4-step approach to turning your vision into a digital masterpiece.
          </motion.p>
        </div>
      </div>

      <Process fullPage={true} />
      <Footer />
    </div>
  );
};

export default ProcessPage;
