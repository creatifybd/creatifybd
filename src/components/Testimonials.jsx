import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { TextReveal, FadeReveal } from './MotionReveal';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), where('hidden', '==', false));
    const unsub = onSnapshot(q, (snap) => {
      const dbData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonials(dbData.length > 0 ? dbData : dummyReviews);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const dummyReviews = [
    { id: 1, name: "Al-Amin Hossain", text: "CreatifyBD transformed our brand identity completely. Their attention to detail is unmatched.", text_bn: "ক্রিয়েটিফাইবিডি আমাদের ব্র্যান্ড আইডেন্টিটি সম্পূর্ণ বদলে দিয়েছে। তাদের কাজের নিখুঁততা অতুলনীয়।" },
    { id: 2, name: "Sarah Khan", text: "Best marketing agency in Dhaka. We saw a 300% growth in our social media reach within 3 months.", text_bn: "ঢাকার সেরা মার্কেটিং এজেন্সি। ৩ মাসের মধ্যে আমাদের সোশ্যাল মিডিয়া রিচ ৩০০% বেড়েছে।" },
    { id: 3, name: "Tanvir Ahmed", text: "Professional, creative, and always on time. Highly recommended for any digital project.", text_bn: "পেশাদার, সৃজনশীল এবং সবসময় সময়নিষ্ঠ। যেকোনো ডিজিটাল প্রজেক্টের জন্য তাদের রিকমেন্ড করছি।" },
    { id: 4, name: "Rifat Sultana", text: "Their web design skills are world-class. Our new site is fast and looks stunning.", text_bn: "তাদের ওয়েব ডিজাইন স্কিল আন্তর্জাতিক মানের। আমাদের নতুন সাইটটি দ্রুত এবং দেখতে চমৎকার।" },
    { id: 5, name: "Mehedi Hasan", text: "Great ROI on our Facebook campaigns. They really know the local market dynamics.", text_bn: "আমাদের ফেসবুক ক্যাম্পেইনে দারুণ আরওআই পেয়েছি। তারা লোকাল মার্কেট সম্পর্কে খুব ভালো জানে।" },
    { id: 6, name: "Anika Tabassum", text: "The team is very responsive and understands our requirements perfectly.", text_bn: "টিমটি খুব রেসপনসিভ এবং আমাদের রিকোয়ারমেন্টগুলো নিখুঁতভাবে বোঝে।" },
    { id: 7, name: "Kamrul Islam", text: "Creative concepts that actually convert. Best investment for our business this year.", text_bn: "সৃজনশীল কনসেপ্ট যা আসলে কনভার্ট করে। আমাদের ব্যবসার জন্য এই বছরের সেরা ইনভেস্টমেন্ট।" },
    { id: 8, name: "Zarin Tasnim", text: "Stunning video production. They captured our brand story beautifully.", text_bn: "চমৎকার ভিডিও প্রোডাকশন। তারা আমাদের ব্র্যান্ড স্টোরি খুব সুন্দরভাবে ফুটিয়ে তুলেছে।" },
    { id: 9, name: "Ariful Haque", text: "Technically very strong and creative at the same time. A rare combination.", text_bn: "টেকনিক্যালি খুব শক্তিশালী এবং একই সাথে সৃজনশীল। একটি বিরল কম্বিনেশন।" },
    { id: 10, name: "Nabila Rahman", text: "Helped us scale our e-commerce business significantly. Truly experts.", text_bn: "আমাদের ই-কমার্স ব্যবসা বড় করতে অনেক সাহায্য করেছে। সত্যিকারের এক্সপার্ট।" },
    { id: 11, name: "Sohanur Rahman", text: "Exceptional service and great communication throughout the project.", text_bn: "অসাধারণ সার্ভিস এবং পুরো প্রজেক্ট জুড়ে চমৎকার কমিউনিকেশন ছিল।" },
    { id: 12, name: "Farhana Ahmed", text: "Their strategic approach made a huge difference for our brand positioning.", text_bn: "তাদের স্ট্র্যাটেজিক অ্যাপ্রোচ আমাদের ব্র্যান্ড পজিশনিংয়ে বিশাল পরিবর্তন এনেছে।" },
    { id: 13, name: "Jasim Uddin", text: "Reliable and highly skilled. They deliver what they promise.", text_bn: "নির্ভরযোগ্য এবং অত্যন্ত দক্ষ। তারা যা প্রতিশ্রুতি দেয় তা ডেলিভার করে।" },
    { id: 14, name: "Maliha Chowdhury", text: "The most creative team we have ever worked with. Simply amazing.", text_bn: "আমাদের কাজ করা সবচেয়ে সৃজনশীল টিম। এক কথায় অসাধারণ।" },
    { id: 15, name: "Nasir Ahmed", text: "Great experience working with CreatifyBD. They exceeded our expectations.", text_bn: "ক্রিয়েটিফাইবিডির সাথে কাজ করার দারুণ অভিজ্ঞতা। তারা আমাদের প্রত্যাশা ছাড়িয়ে গেছে।" }
  ];

  const displayTestimonials = [...testimonials, ...testimonials];

  if (loading && testimonials.length === 0) return <section className="section testimonials-section" style={{ minHeight: '400px' }}></section>;

  return (
    <section className="section testimonials-section" id="testimonials" style={{ overflow: 'hidden', background: '#fafafb' }}>
      <div className="container">
        <div className="testi-header">
          <div className="testi-header-main">
            <FadeReveal>
              <div className="eyebrow">{lang === 'bn' ? 'ক্লায়েন্ট রিভিউ' : 'Client Testimonials'}</div>
            </FadeReveal>
            <TextReveal className="section-h">
              {lang === 'bn' ? 'ক্লায়েন্টরা যা বলছেন' : 'Trusted by Innovators'}
            </TextReveal>
          </div>
          
          <FadeReveal delay={0.4}>
            <div className="rating-summary-v2" style={{ background: 'white', borderColor: '#eee' }}>
              <div className="rating-val" style={{ color: '#000' }}>5.0</div>
              <div className="rating-info">
                <div className="rating-stars">★★★★★</div>
                <div className="rating-count" style={{ color: '#666' }}>{lang === 'bn' ? '৫০+ রিভিউ থেকে' : 'From 50+ reviews'}</div>
              </div>
            </div>
          </FadeReveal>
        </div>
      </div>

      <div className="testi-track-wrap">
        <motion.div 
          className="testi-track"
          animate={{ x: [0, -100 * (testimonials.length || 15) + '%'] }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {displayTestimonials.map((t, idx) => (
            <div key={`${t.id}-${idx}`} className="testi-card-v2">
              <div className="testi-card-inner">
                <div className="testi-stars-v2">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p 
                  className="testi-text-v2" 
                  dangerouslySetInnerHTML={{ __html: (lang === 'bn' && t.text_bn) ? t.text_bn : t.text }}
                ></p>
                <div className="testi-author-v2">
                  <div className="testi-avatar-v2">{t.name.charAt(0)}</div>
                  <div className="testi-meta-v2">
                    <div className="testi-name-v2">{t.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
