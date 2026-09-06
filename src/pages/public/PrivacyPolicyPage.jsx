import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import usePageSEO from '../../hooks/usePageSEO';

const PolicyLayout = ({ title, seoDescription, lastUpdated, children }) => (
  <div className="policy-page-shell">
    <SEO title={`${title} | CreatifyBD`} description={seoDescription} />
    <Navbar />
    <div className="container" style={{ maxWidth: '780px', margin: '0 auto', padding: '8rem 1.5rem 6rem' }}>
      <div className="policy-header">
        <h1>{title}</h1>
        <p className="last-updated">সর্বশেষ আপডেট: {lastUpdated}</p>
      </div>
      <div className="policy-body">{children}</div>
    </div>
    <Footer />
    <style>{`
      .policy-page-shell {
        min-height: 100vh;
        background: var(--surface);
        color: var(--ink);
      }

      .policy-header {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border);
      }
      .policy-header h1 {
        font-size: clamp(2rem, 4vw, 2.8rem);
        font-weight: 900;
        color: var(--ink);
        margin-bottom: 0.5rem;
      }
      .last-updated {
        font-size: 0.85rem;
        color: var(--muted);
      }
      .policy-body h2 {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--ink);
        margin: 2.5rem 0 1rem;
      }
      .policy-body p, .policy-body li {
        color: var(--muted);
        font-size: 0.95rem;
        line-height: 1.7;
        margin-bottom: 0.75rem;
      }
      .policy-body ul {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
      }
      .policy-body a {
        color: var(--brand-red);
        text-decoration: underline;
      }
      .policy-body strong {
        color: var(--ink);
        font-weight: 700;
      }
    `}</style>
  </div>
);

export const PrivacyPolicyPage = () => {
  const seo = usePageSEO('privacy', {
    title: "গোপনীয়তা নীতিমালা (Privacy Policy)",
    description: "CreatifyBD-এর গোপনীয়তা নীতিমালা — আপনার তথ্য আমরা কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখি।"
  });
  return (
    <PolicyLayout
      title={seo.title}
      seoDescription={seo.description}
      lastUpdated="জানুয়ারি ২০২৬"
    >
      <p>CreatifyBD ("আমরা", "আমাদের") <strong>creatifybd.com</strong> ওয়েবসাইটটি পরিচালনা করে। এই গোপনীয়তা নীতিমালায় ব্যাখ্যা করা হয়েছে যে আপনি যখন আমাদের ওয়েবসাইট ব্যবহার করেন বা আমাদের সার্ভিস নেন, তখন আমরা কীভাবে আপনার তথ্য সুরক্ষিত রাখি।</p>

      <h2>১. যে তথ্যগুলো আমরা সংগ্রহ করি</h2>
      <p>আমাদের সাথে যোগাযোগের সময় আমরা নিচের তথ্যগুলো গ্রহণ করতে পারি:</p>
      <ul>
        <li>আপনার নাম, ইমেইল, ফোন/হোয়াটসঅ্যাপ নম্বর ও প্রতিষ্ঠানের নাম।</li>
        <li>প্রজেক্ট রিকোয়ারমেন্ট এবং ডিজাইনের প্রয়োজনীয় ফাইল বা ব্রিফ।</li>
        <li>ওয়েবসাইটের ইউজার এক্সপেরিয়েন্স উন্নয়নের জন্য মৌলিক অ্যানালিটিক্স তথ্য।</li>
      </ul>

      <h2>২. তথ্যের ব্যবহার</h2>
      <ul>
        <li>আপনার প্রজেক্টের কাজ সম্পন্ন করা এবং নিয়মিত আপডেট জানানোর জন্য।</li>
        <li>গ্রাহক সেবা ও দ্রুত যোগাযোগের সুবিধার্থে (হোয়াটসঅ্যাপ/ইমেইল/কল)।</li>
        <li>আমাদের সেবার মান প্রতিনিয়ত উন্নত করার জন্য।</li>
      </ul>

      <h2>৩. তথ্যের সুরক্ষা ও গোপনীয়তা</h2>
      <p>আমরা <strong>কখনোই আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা অপব্যবহার করি না</strong>। আপনার সমস্ত ফাইল এবং ব্যবসায়িক তথ্য সম্পূর্ণ সুরক্ষিত রাখা হয়।</p>

      <h2>৪. যোগাযোগ</h2>
      <p>গোপনীয়তা নীতিমালা সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের ইমেইল করুন <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a> অথবা সরাসরি <a href="/contact">যোগাযোগ পেজে</a> আসুন।</p>
    </PolicyLayout>
  );
};

export const TermsPage = () => {
  const seo = usePageSEO('terms', {
    title: "ব্যবহারের শর্তাবলী (Terms of Service)",
    description: "CreatifyBD-এর ব্যবহারের শর্তাবলী ও কাজের নিয়মাবলী।"
  });
  return (
    <PolicyLayout
      title={seo.title}
      seoDescription={seo.description}
      lastUpdated="জানুয়ারি ২০২৬"
    >
      <p>CreatifyBD-এর সার্ভিস গ্রহণ করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মতি জানাচ্ছেন। অনুগ্রহ করে শর্তগুলো মনোযোগ দিয়ে পড়ুন।</p>

      <h2>১. সার্ভিস চুক্তি</h2>
      <p>CreatifyBD ব্র্যান্ডিং, সোশ্যাল মিডিয়া ম্যানেজমেন্ট, ভিডিও এডিটিং এবং ওয়েবসাইট ডেভেলপমেন্ট সার্ভিস প্রদান করে। প্রতিটি সার্ভিসের কাজের পরিধি ও ডেলিভারি সময় আলোচনার ভিত্তিতে চূড়ান্ত করা হয়।</p>

      <h2>২. মূল্য ও পেমেন্ট পদ্ধতি</h2>
      <ul>
        <li>সকল মূল্য বাংলাদেশি টাকা (৳) তে নির্ধারিত।</li>
        <li>প্রজেক্ট শুরু করার পূর্বে আলোচনার ভিত্তিতে চুক্তি সম্পন্ন হয়।</li>
        <li>যেকোনো প্রচলিত স্থানীয় ব্যাংক বা মোবাইল ব্যাংকিং (বিকাশ/নগদ) এর মাধ্যমে পেমেন্ট সম্পন্ন করা যায়।</li>
      </ul>

      <h2>৩. মেধাস্বত্ব ও কপিরাইট</h2>
      <p>প্রজেক্টের সম্পূর্ণ পেমেন্ট সম্পন্ন হওয়ার পর ডেলিভারিকৃত ডিজাইনের পূর্ণ বাণিজ্যিক মালিকানা ক্লায়েন্টের কাছে ন্যস্ত হবে। ক্লায়েন্টের বিশেষ আপত্তি না থাকলে CreatifyBD তাদের পোর্টফোলিওতে কাজের নমুনা প্রদর্শন করতে পারবে।</p>

      <h2>৪. ক্লায়েন্টের দায়িত্ব</h2>
      <ul>
        <li>কাজের জন্য প্রয়োজনীয় সঠিক ব্রিফ ও তথ্য সময়মতো সরবরাহ করা।</li>
        <li>ডিজাইন ড্রাফট পাওয়ার পর দ্রুত ফিডব্যাক প্রদান করা।</li>
      </ul>
    </PolicyLayout>
  );
};

export const RefundPolicyPage = () => {
  const seo = usePageSEO('refund_policy', {
    title: "রিফান্ড নীতিমালা (Refund Policy)",
    description: "CreatifyBD-এর রিফান্ড নীতিমালা ও নিয়মাবলী।"
  });
  return (
    <PolicyLayout
      title={seo.title}
      seoDescription={seo.description}
      lastUpdated="জানুয়ারি ২০২৬"
    >
      <p>আমরা প্রতিটি ক্লায়েন্টকে সেরা ক্রিয়েটিভ কোয়ালিটি দিতে প্রতিশ্রুতিবদ্ধ। রিফান্ড সংক্রান্ত নিয়মাবলী নিচে উল্লেখ করা হলো:</p>

      <h2>১. রিফান্ড পাওয়ার ক্ষেত্রসমূহ</h2>
      <ul>
        <li><strong>কাজ শুরুর পূর্বে বাতিল:</strong> অর্ডার কনফার্মেশনের ২৪ ঘণ্টার মধ্যে এবং ডিজাইনার কাজ শুরু করার পূর্বে বাতিল করলে সম্পূর্ণ রিফান্ড প্রযোজ্য।</li>
        <li><strong>অস্বাভাবিক বিলম্ব:</strong> কোনো যুক্তিসঙ্গত কারণ ছাড়া নির্ধারিত ডেডলাইনের দ্বিগুণ সময় অতিবাহিত হলে সম্পূর্ণ রিফান্ড দাবি করা যাবে।</li>
      </ul>

      <h2>২. যেক্ষেত্রে রিফান্ড প্রযোজ্য নয়</h2>
      <ul>
        <li>কাজ অলরেডি শুরু হয়ে গেলে বা ড্রাফট কনসেপ্ট ডেলিভারি হওয়ার পর।</li>
        <li>ফাইনাল ফাইল ক্লায়েন্ট গ্রহণ এবং অনুমোদন করার পর।</li>
      </ul>

      <h2>৩. যোগাযোগ</h2>
      <p>রিফান্ড সংক্রান্ত যেকোনো আলোচনার জন্য আমাদের <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a> এ ইমেইল করুন অথবা আমাদের হোয়াটসঅ্যাপে যোগাযোগ করুন।</p>
    </PolicyLayout>
  );
};

export const RevisionPolicyPage = () => {
  const seo = usePageSEO('revision_policy', {
    title: "রিভিশন নীতিমালা (Revision Policy)",
    description: "CreatifyBD-এর রিভিশন নীতিমালা — কাজের পরিবর্তন ও পরিমার্জনের নিয়মাবলী।"
  });
  return (
    <PolicyLayout
      title={seo.title}
      seoDescription={seo.description}
      lastUpdated="জানুয়ারি ২০২৬"
    >
      <p>আমরা বিশ্বাস করি সুন্দর ক্রিয়েটিভ কাজ পারস্পরিক সহযোগিতার মাধ্যমে তৈরি হয়। আপনার সন্তুষ্টি অর্জনে আমাদের রিভিশন নীতিমালা অত্যন্ত সহযোগিতাপূর্ণ।</p>

      <h2>১. রিভিশনের মধ্যে যা অন্তর্ভুক্ত</h2>
      <ul>
        <li>কালার, ফন্ট বা টাইপোগ্রাফির পরিবর্তন।</li>
        <li>টেক্সট বা বানান সংশোধন।</li>
        <li>লেআউট এবং অ্যালাইনমেন্ট অ্যাডজাস্টমেন্ট।</li>
        <li>একই কনসেপ্টের মধ্যে ছোটখাটো ছবি বা এলিমেন্ট অদলবদল।</li>
      </ul>

      <h2>২. যা রিভিশন হিসেবে গণ্য হবে না</h2>
      <ul>
        <li>কনসেপ্ট সম্পূর্ণ অ্যাপ্রুভ করার পর সম্পূর্ণ ভিন্ন নতুন কনসেপ্ট দাবি করা।</li>
        <li>মূল রিকোয়ারমেন্টের বাইরে অতিরিক্ত কাজ যুক্ত করা।</li>
      </ul>

      <h2>৩. রিভিশন পাওয়ার সময়সীমা</h2>
      <p>সাধারণ রিভিশনগুলো সাধারণত ১–২ কর্মদিবসের মধ্যে সম্পন্ন করে ডেলিভারি দেওয়া হয়।</p>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;
