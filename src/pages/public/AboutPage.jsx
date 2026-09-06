import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';
import { ArrowRight, Award, Globe, Quote, ShieldCheck, Users } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const AboutPage = () => {
  const { content } = useSettings();
  const aboutContent = content?.about_trust || {};

  const seo = usePageSEO('about', {
    title: "আমাদের সম্পর্কে — CreatifyBD",
    description: "আপনার ব্র্যান্ডের স্বপ্নকে বাস্তবে রূপ দেওয়ার বিশ্বস্ত ক্রিয়েটিভ পার্টনার। জানুন আমাদের লক্ষ্য ও কাজের ধরণ।"
  });

  return (
    <div className="about-page">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords="about creative agency, about digital marketing agency, about social media management company, about graphic design agency, about video editing company, about web design agency, creatifybd about, creative agency team, creative agency story, marketing agency about us, creative agency mission"
      />
      <Navbar />

      <div className="page-header page-header-light">
        <div className="container">
          <h1 className="page-title">আপনার ব্র্যান্ডের স্বপ্নকে বাস্তবে রূপ দেওয়ার <span className="red">বিশ্বস্ত ক্রিয়েটিভ পার্টনার</span></h1>
          <p className="page-subtitle">
            CreatifyBD বাংলাদেশের সম্ভাবনাময় ব্যবসা ও উদ্যোক্তাদের জন্য বিশ্বমানের ব্র্যান্ডিং, সোশ্যাল মিডিয়া মার্কেটিং, ভিডিও এডিটিং ও ওয়েবসাইট তৈরি করে। কোনো জটিলতা নেই, একদম স্বচ্ছ যোগাযোগ ও আন্তরিক কাজ।
          </p>
        </div>
      </div>

      <main>
        <section className="about-detail-section">
          <div className="container about-detail-grid">
            <div>
              <h2 className="section-h">আমাদের শুরুর গল্প ও লক্ষ্য</h2>
              <p className="section-sub">
                অধিকাংশ ব্যবসা বড় হতে গিয়ে দুটি সমস্যায় পড়ে—হয় অতিমূল্যের এজেন্সির চক্করে পড়ে বাজেট শেষ হয়ে যায়, না হয় একাধিক জায়গায় কাজ করাতে গিয়ে ব্র্যান্ডের ধারাবাহিকতা নষ্ট হয়। আমরা CreatifyBD তৈরি করেছি ঠিক এই সমস্যার সহজ সমাধান দিতে। এখানে একটি নিবেদিত টিম আপনার ব্র্যান্ডিং, কনটেন্ট, ভিডিও এবং ওয়েবসাইট এক ছাদের নিচে পরিচালনা করে।
              </p>
              <div className="ceo-quote about-ceo-feature">
                <div>
                  <Quote size={22} />
                  <p>
                    "{aboutContent.ceo_quote || 'আমরা বিশ্বাস করি প্রতিটি বাংলাদেশি ব্র্যান্ডের বিশ্বমানের প্রেজেন্স পাওয়ার অধিকার আছে। আপনার ব্যবসার সাফল্যই আমাদের প্রতিটি ক্রিয়েটিভ কাজের মূল অনুপ্রেরণা।'}"
                  </p>
                  <strong>CreatifyBD টিম</strong>
                </div>
              </div>
            </div>

            <div className="about-values-grid">
              <div><Globe size={22} /><strong>গ্লোবাল স্ট্যান্ডার্ড</strong><span>আন্তর্জাতিক মানের প্রিমিয়াম ডিজাইন ও ক্রিয়েটিভ আউটপুট।</span></div>
              <div><ShieldCheck size={22} /><strong>স্বচ্ছ পরিকল্পনা</strong><span>স্পষ্ট বাজেট, নির্দিষ্ট ডেডলাইন ও আন্তরিক রিভিশন সুবিধা।</span></div>
              <div><Award size={22} /><strong>কোয়ালিটি কন্ট্রোল</strong><span>ফাইনাল হ্যান্ডওভারের আগে প্রতিটি ফাইল নিখুঁতভাবে যাচাই।</span></div>
              <div><Users size={22} /><strong>দক্ষ ও নিবেদিত টিম</strong><span>ডিজাইনার, ভিডিও এডিটর ও ডেভেলপারদের সমন্বিত শক্তি।</span></div>
            </div>
          </div>
        </section>

        <section className="about-team-section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div className="section-header text-center">
              <h2 className="section-h">আমাদের ক্রিয়েটিভ টিম</h2>
              <p className="section-sub" style={{ maxWidth: '560px', margin: '0 auto 2rem' }}>
                যাদের সৃজনশীল মেধা ও নিরলস পরিশ্রমে প্রতিটি ব্র্যান্ড পায় এক অনন্য ভিজ্যুয়াল পরিচিতি।
              </p>
            </div>
            <Link to="/team" className="admin-btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
              টিম মেম্বারদের দেখুন <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
