// CreatifyBD Gig Database
// 18 Initial production-ready services in 100% authentic Bengali copy

export const categories = {
  'social-media-management': {
    name: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    slug: 'social-media-management',
    desc: 'নিয়মিত পোস্টার ডিজাইন, ট্রেন্ডিং রিলস ও সম্পূর্ণ মাসিক কনটেন্ট ক্যালেন্ডার ম্যানেজমেন্ট।',
    icon: '📱'
  },
  'graphic-design': {
    name: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং',
    slug: 'graphic-design',
    desc: 'প্রিমিয়াম লোগো, ব্র্যান্ড আইডেন্টিটি, ব্যানার ও প্রোডাক্ট প্যাকেজিং ডিজাইন।',
    icon: '🎨'
  },
  'video-editing': {
    name: 'ভিডিও এডিটিং ও রিলস',
    slug: 'video-editing',
    desc: 'সিনেমাটিক রিলস, ইউটিউব ভিডিও এবং হাই-কনভার্সন প্রমোশনাল ভিডিও অ্যাডস।',
    icon: '🎬'
  },
  'website-design': {
    name: 'ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট',
    slug: 'website-design',
    desc: 'সুপার ফাস্ট, কনভার্সন-ফোকাসড আধুনিক ল্যান্ডিং পেজ ও বিজনেস ওয়েবসাইট।',
    icon: '💻'
  }
};

export const gigs = [
  // ==========================================
  // --- Social Media Management (4 Gigs) ---
  // ==========================================
  {
    id: 'smm-monthly',
    slug: 'monthly-social-media-management',
    legacySlugs: ['monthly-social-media-management-small-business'],
    title: 'কমপ্লিট সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও ব্র্যান্ড গ্রোথ',
    shortTitle: 'মান্থলি সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    category: 'social-media-management',
    subcategory: 'ফুল ম্যানেজমেন্ট',
    overview: 'সম্পূর্ণ মাসিক কনটেন্ট প্ল্যানিং, দৈনিক পোস্টার ডিজাইন, প্রমোশনাল ভিডিও এবং গ্রোথ স্ট্র্যাটেজি।',
    description: 'পোস্ট ডিজাইন করা, ক্যাপশন লেখা আর নিয়মিত পোস্ট করা নিয়ে সময় নষ্ট না করে আপনার সোশ্যাল মিডিয়ার দায়িত্ব আমাদের অভিজ্ঞ টিমের হাতে তুলে দিন। মান্থলি কনটেন্ট ক্যালেন্ডার, হাই-কনভার্সন গ্রাফিক্স, প্রফেশনাল ক্যাপশন, এসইও হ্যাশট্যাগ ও ভিডিও ক্রিয়েটিভস—সবকিছু আমরা হ্যান্ডেল করি।',
    whoIsThisFor: 'ই-কমার্স ও ফেসবুক শপ, স্টার্টআপ, উদ্যোক্তা, ডক্টর, কোচ ও যেকোনো বিজনেস যারা সোশ্যাল মিডিয়ায় ব্র্যান্ড ভ্যালু ও সেলস বাড়াতে চান।',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&h=400&fit=crop'
    ],
    rating: 5.0,
    reviewCount: 24,
    startingPrice: '৫,০০০',
    isSpecialOffer: true,
    packages: {
      basic: {
        name: 'প্যাকেজ ০১ (স্পেশাল অফার)',
        price: '৫,০০০',
        bdtPrice: '৫,০০০',
        period: '/মাস',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: [
          'দৈনিক ২টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৬০টি)',
          'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি)',
          'আকর্ষণীয় বাংলা/ইংলিশ ক্যাপশন ও নিশ হ্যাশট্যাগ',
          'মান্থলি কনটেন্ট প্ল্যানিং ও ডিজাইন সিডিউল',
          '১টি প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট ও সাপোর্ট'
        ],
        features: { platforms: 1, postings: 60, videos: 4, strategy: true }
      },
      standard: {
        name: 'প্যাকেজ ০২ (স্পেশাল অফার)',
        price: '৭,০০০',
        bdtPrice: '৭,০০০',
        period: '/মাস',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: [
          'দৈনিক ৩টি সোশ্যাল মিডিয়া পোস্টার (মাসে ৯০টি)',
          'সপ্তাহে ১টি প্রমোশনাল ভিডিও (মাসে ৪টি)',
          'ট্রেন্ডিং রিলস কনসেপ্ট ও মোশন গ্রাফিক্স',
          'ফেসবুক ও ইনস্টাগ্রাম ২ প্ল্যাটফর্ম সাপোর্ট',
          'এনগেজিং ক্যাপশন ও রেগুলার কনটেন্ট সিডিউলিং'
        ],
        features: { platforms: 2, postings: 90, videos: 4, strategy: true }
      },
      premium: {
        name: 'প্যাকেজ ০৩ (স্পেশাল অফার)',
        price: '১০,০০০',
        bdtPrice: '১০,০০০',
        period: '/মাস',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: [
          'দৈনিক ৫টি সোশ্যাল মিডিয়া পোস্টার (মাসে ১৫০টি)',
          'সপ্তাহে ২টি প্রমোশনাল ভিডিও (মাসে ৮টি)',
          'হাই-কনভার্সন ভিডিও ও সেলস-ফোকাসড ক্রিয়েটিভস',
          'মাল্টি-প্ল্যাটফর্ম ফুল ম্যানেজমেন্ট',
          'ডেডিকেটেড ক্রিয়েটিভ ম্যানেজার ও প্রায়োরিটি সাপোর্ট'
        ],
        features: { platforms: 3, postings: 150, videos: 8, strategy: true }
      }
    },
    faqs: [
      { question: 'কোন কোন প্ল্যাটফর্ম ম্যানেজ করেন?', answer: 'আমরা ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও ইউটিউব প্রফেশনালি ম্যানেজ করি।' },
      { question: 'কনটেন্ট কীভাবে অ্যাপ্রুভ করব?', answer: 'আমরা আগে থেকেই পুরো মাসের কনটেন্ট ড্রাফট শেয়ার করি। আপনার চূড়ান্ত অনুমোদনের পরই তা পাবলিশ করা হয়।' },
      { question: 'পেইড অ্যাড ক্যাম্পেইন করেন?', answer: 'হ্যাঁ, অ্যাড ক্রিয়েটিভ ডিজাইনের পাশাপাশি পেইড অ্যাডস রান ও অপটিমাইজেশনের ব্যবস্থা রয়েছে।' }
    ],
    requirements: [
      'সোশ্যাল মিডিয়া পেজের এক্সেস বা তথ্য।',
      'ব্র্যান্ডের লোগো ও প্রোডাক্ট/সার্ভিস সম্পর্কিত তথ্য।',
      'টার্গেট অডিয়েন্স এবং পছন্দের কোনো স্টাইল রেফারেন্স।'
    ],
    revisionPolicy: 'ডিজাইন ড্রাফট ও ক্যাপশনে ক্লায়েন্টের সন্তুষ্টি অনুযায়ী প্রয়োজনীয় সংশোধন করা হয়।',
    tags: ['social media management', 'facebook marketing', 'content calendar', 'smm bangladesh'],
    industries: ['E-commerce', 'Real Estate', 'Restaurants', 'Clinics', 'Education'],
    relatedGigs: ['brand-launch-social-media-kit', 'social-media-poster-design', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 'smm-fb-page',
    slug: 'facebook-page-management',
    title: 'ফেসবুক পেজ ম্যানেজমেন্ট ও এনগেজমেন্ট অপটিমাইজেশন',
    shortTitle: 'ফেসবুক পেজ ম্যানেজমেন্ট',
    category: 'social-media-management',
    subcategory: 'ফেসবুক',
    overview: 'ফেসবুক পেজের রিচ বৃদ্ধি, আকর্ষণীয় কভার ও রেগুলার এনগেজিং পোস্ট ম্যানেজমেন্ট।',
    description: 'আপনার ফেসবুক পেজকে রূপান্তর করুন একটি নির্ভরযোগ্য বিক্রয় ও ব্র্যান্ড হাবে। আমরা প্রফেশনাল কভার ডিজাইন, পেজ সেটিংস অপটিমাইজেশন, রেগুলার পোস্টার ডিজাইন এবং এনগেজিং ক্যাপশন দিয়ে গ্রাহকের বিশ্বাস অর্জন করতে সাহায্য করি।',
    whoIsThisFor: 'লোকাল শপ, সার্ভিস প্রোভাইডার, ডক্টর চেম্বার, রেস্তোরাঁ ও নতুন উদ্যোক্তাদের জন্য।',
    galleryImages: [
      'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 16,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'স্টার্টার পেজ সেটআপ ও পোস্ট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 14,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৮টি প্রিমিয়াম পোস্ট ডিজাইন', 'প্রফেশনাল কভার ফটো ডিজাইন', 'পেজ বাটন ও বায়ো অপটিমাইজেশন'],
        features: { posts: 8, setup: true, analytics: false }
      },
      standard: {
        name: 'গ্রোথ এনগেজমেন্ট প্যাকেজ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১৫টি ক্রিয়েটিভ পোস্টার', 'কভার ও প্রোফাইল সেটআপ', 'টার্গেটেড অ্যাডস ক্রিয়েটিভ', 'মাসিক এনগেজমেন্ট রিপোর্ট'],
        features: { posts: 15, setup: true, analytics: true }
      },
      premium: {
        name: 'অথরিটি বিল্ডার প্যাকেজ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২৫টি পোস্ট ডিজাইন ও রিলস', 'ব্র্যান্ড স্টাইল গাইডেন্স', '৩টি ভিডিও অ্যাড ক্রিয়েটিভ', 'ফুল মান্থলি পেজ অপটিমাইজেশন'],
        features: { posts: 25, setup: true, analytics: true }
      }
    },
    faqs: [
      { question: 'আপনারা কি বুস্টিং বা অ্যাডস রান করেন?', answer: 'হ্যাঁ, হাই-কনভার্সন অ্যাড ক্রিয়েটিভ তৈরির পাশাপাশি আমরা প্রফেশনাল অ্যাড ক্যাম্পেইন পরিচালনা করি।' }
    ],
    requirements: ['ফেসবুক পেজ এডিটর/অ্যাডমিন এক্সেস', 'লোগো এবং বিজনেসের বিবরণ।'],
    revisionPolicy: 'ড্রাফটিং পর্যায়ে যেকোনো টেক্সট ও গ্রাফিক্সে প্রয়োজনীয় রিভিশন প্রদান করা হয়।',
    tags: ['facebook page', 'facebook posts', 'social media management', 'local business'],
    industries: ['Local Services', 'Restaurants', 'Clinics', 'Law Firms'],
    relatedGigs: ['monthly-social-media-management', 'brand-launch-social-media-kit'],
    status: 'active'
  },
  {
    id: 'smm-instagram',
    slug: 'instagram-content-management',
    title: 'প্রিমিয়াম ইনস্টাগ্রাম গ্রিড, স্টোরিজ ও রিলস ম্যানেজমেন্ট',
    shortTitle: 'ইনস্টাগ্রাম কনটেন্ট ম্যানেজমেন্ট',
    category: 'social-media-management',
    subcategory: 'ইনস্টাগ্রাম',
    overview: 'এসথেটিক গ্রিড লেআউট, আকর্ষণীয় স্টোরিজ এবং ভাইরাল রিলস স্ট্র্যাটেজি।',
    description: 'ইনস্টাগ্রাম হলো আপনার ভিজ্যুয়াল শোরুম। প্রিমিয়াম ৩x৩ গ্রিড লেআউট, হাইলাইট কভার, ট্রেন্ডি রিলস এবং আকর্ষণীয় ক্যাপশনের মাধ্যমে ইনস্টাগ্রাম ভিজিটরদের বিশ্বস্ত ক্রেতায় রূপান্তর করুন।',
    whoIsThisFor: 'ফ্যাশন ও লাইফস্টাইল ব্র্যান্ড, কসমেটিকস, ক্লোদিং, ক্রিয়েটর ও ই-কমার্স উদ্যোক্তা।',
    galleryImages: [
      'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.8,
    reviewCount: 19,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'এসথেটিক গ্রিড স্টার্টার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 14,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৯টি ম্যাচিং গ্রিড পোস্ট (3x3)', 'নিশ হ্যাশট্যাগ সেট', 'হাইলাইট কভার ডিজাইন (৩টি)'],
        features: { posts: 9, highlights: 3 }
      },
      standard: {
        name: 'ইনস্টা প্রো গ্রিড',
        price: 'কাস্টম বাজেট',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১৮টি প্রিমিয়াম গ্রিড পোস্ট', '৩টি ট্রেন্ডি রিলস কনসেপ্ট ও এডিটিং', 'স্টোরি টেমপ্লেটস ডিজাইন', '৬টি হাইলাইট কভার'],
        features: { posts: 18, highlights: 6 }
      },
      premium: {
        name: 'আলটিমেট ইনস্টা-গ্রোথ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 30,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩০টি পোস্ট ও ক্যারোসেল', '৮টি রিলস ও মোশন ভিডিও', 'হ্যাশট্যাগ স্ট্র্যাটেজি ও অডিট', '৯টি হাইলাইট আইকন ও ডেইলি শিডিউলিং'],
        features: { posts: 30, highlights: 9 }
      }
    },
    faqs: [
      { question: 'পোস্টগুলো আপনারা কি সরাসরি শিডিউল করেন?', answer: 'হ্যাঁ, Meta Business Suite বা সরাসরি শিডিউলিংয়ের মাধ্যমে সঠিক সময়ে পাবলিশ করা হয়।' }
    ],
    requirements: ['ইনস্টাগ্রাম অ্যাকাউন্ট অথবা ফেসবুক পেজ কানেকশন', 'প্রোডাক্টের ক্লিয়ার ফটো।'],
    revisionPolicy: 'কনসেপ্ট ও ড্রাফট পর্যায়ে সম্পূর্ণ সন্তুষ্টি নিশ্চিত করতে সংশোধন দেওয়া হয়।',
    tags: ['instagram content', 'instagram grid', 'aesthetic posts', 'social design'],
    industries: ['E-commerce', 'Fashion', 'Beauty', 'Coaches'],
    relatedGigs: ['monthly-social-media-management', 'vector-illustration'],
    status: 'active'
  },
  {
    id: 'smm-brand-kit',
    slug: 'brand-launch-social-media-kit',
    title: 'ব্র্যান্ড লঞ্চ সোশ্যাল মিডিয়া কিট ও প্রোফাইল সেটআপ',
    shortTitle: 'ব্র্যান্ড লঞ্চ সোশ্যাল কিট',
    category: 'social-media-management',
    subcategory: 'ব্র্যান্ড কিট',
    overview: 'নতুন বিজনেসের সকল সোশ্যাল মিডিয়া চ্যানেলের সম্পূর্ণ প্রফেশনাল সেটআপ ও ব্যানার কিট।',
    description: 'নতুন কোনো ব্র্যান্ড বা বিজনেসের যাত্রা শুরু করুন প্রথম দিন থেকেই প্রফেশনাল লুকের সাথে। ফেসবুক, ইনস্টাগ্রাম, লিংকডইন ও ইউটিউবের আকর্ষণীয় ব্যানার, প্রোফাইল পিকচার এবং লঞ্চ পোস্ট ডিজাইন।',
    whoIsThisFor: 'নতুন স্টার্টআপ, রি-ব্র্যান্ডিং হওয়া প্রতিষ্ঠান এবং নতুন ওয়েবসাইট লঞ্চ করা উদ্যোক্তা।',
    galleryImages: [
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 11,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'স্টার্টার লঞ্চ কিট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 7,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২টি চ্যানেলের প্রোফাইল ও কভার ডিজাইন', '৬টি লঞ্চিং পোস্ট ডিজাইন', 'হাই-রেজোলিউশন এক্সপোর্ট ফাইলস'],
        features: { channels: 2, posts: 6 }
      },
      standard: {
        name: 'ব্র্যান্ড লঞ্চ প্রো প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 12,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৪টি চ্যানেলের কভার ও প্রোফাইল আর্ট', '১২টি লঞ্চিং পোস্ট ও ক্যারোসেল', 'হাইলাইট আইকন ও বায়ো কপিরাইটিং'],
        features: { channels: 4, posts: 12 }
      },
      premium: {
        name: 'ফুল অমনিচ্যানেল লঞ্চ কিট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 18,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬টি প্ল্যাটফর্মের ব্যানার ও প্রোফাইল সেট', '২০টি গ্রাফিক্স পোস্ট ও রিলস টেমপ্লেট', 'এডিটেবল সোর্স ফাইলস', 'ব্র্যান্ড স্টাইল গাইড PDF'],
        features: { channels: 6, posts: 20 }
      }
    },
    faqs: [
      { question: 'আপনারা কি পেজের বায়ো বা ডিসক্রিপশন লিখে দেন?', answer: 'হ্যাঁ, আপনার বিজনেসের নিশ অনুযায়ী আকর্ষণীয় বায়ো ও স্লোগান আমরা তৈরি করে দিই।' }
    ],
    requirements: ['বিজনেসের লোগো', 'পছন্দের কালার স্কিম', 'প্রোডাক্ট বা সার্ভিসের বিবরণ।'],
    revisionPolicy: 'কালার সমন্বয়, টাইপোগ্রাফি ও প্লেসমেন্টে প্রয়োজনীয় রিভিশন সুবিধা।',
    tags: ['brand launch', 'social media kit', 'canva templates', 'profile design'],
    industries: ['Startups', 'Personal Brands', 'Coaches', 'Agencies'],
    relatedGigs: ['brand-identity-design', 'professional-logo-design'],
    status: 'active'
  },

  // ==========================================
  // --- Graphic Design & Branding (5 Gigs) ---
  // ==========================================
  {
    id: 'gd-logo',
    slug: 'professional-logo-design',
    title: 'প্রফেশনাল লোগো ডিজাইন ও ব্র্যান্ড আইকন সার্ভিস',
    shortTitle: 'প্রফেশনাল লোগো ডিজাইন',
    category: 'graphic-design',
    subcategory: 'লোগো ডিজাইন',
    overview: 'ইউনিক, আধুনিক ও চিরস্থায়ী ভেক্টর লোগো যা আপনার ব্র্যান্ডের পরিচয়কে তুলে ধরে।',
    description: 'লোগো হচ্ছে যেকোনো ব্যবসার প্রথম পরিচয়। আমরা কোনো রেডিমেড টেমপ্লেট ব্যবহার না করে আপনার বিজনেসের ভাবমূর্তি ও ভিশন অনুযায়ী সম্পূর্ণ ইউনিক, মিনিমাল ও আন্তর্জাতিক মানের ভেক্টর লোগো তৈরি করি।',
    whoIsThisFor: 'নতুন ও প্রতিষ্ঠিত ব্যবসা, স্টার্টআপ, কর্পোরেট প্রতিষ্ঠান ও ই-কমার্স ব্র্যান্ড।',
    galleryImages: [
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 38,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'বেসিক লোগো কনসেপ্ট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 4,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২টি ইউনিক লোগো কনসেপ্ট', 'হাই-রেজ ট্রান্সপারেন্ট PNG ও JPG', 'ডার্ক ও লাইট ব্যাকগ্রাউন্ড ভার্সন'],
        features: { concepts: 2, vector: false, stationary: false }
      },
      standard: {
        name: 'প্রফেশনাল ভেক্টর প্যাকেজ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩টি প্রিমিয়াম কনসেপ্ট', 'এডিটেবল ভেক্টর সোর্স ফাইলস (AI, EPS, SVG, PDF)', 'ওয়েব ফ্যাভিকন আইকন', '১০০% কমার্শিয়াল রাইটস'],
        features: { concepts: 3, vector: true, stationary: false }
      },
      premium: {
        name: 'এন্টারপ্রাইজ লোগো ও ব্র্যান্ড কিট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 8,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৫টি ইউনিক প্রিমিয়াম কনসেপ্ট', 'সকল ভেক্টর ও প্রিন্ট ফরম্যাট', 'স্টেশনারি কিট (ভিজিটিং কার্ড, লেটারহেড ডিজাইন)', '৩ডি মকআপ ও ব্র্যান্ড রুলস'],
        features: { concepts: 5, vector: true, stationary: true }
      }
    },
    faqs: [
      { question: 'কী কী ফাইল ফরম্যাটে লোগো ডেলিভারি দেওয়া হয়?', answer: 'প্রিন্ট এবং ওয়েবের জন্য AI, EPS, SVG, PDF, হাই-রেজোলিউশন PNG এবং JPEG ফরম্যাটে ডেলিভারি পাবেন।' }
    ],
    requirements: ['ব্যবসার নাম ও ট্যাগলাইন', 'ইন্ডাস্ট্রি ও টার্গেট অডিয়েন্স', 'পছন্দের কালার ও রেফারেন্স স্টাইল।'],
    revisionPolicy: 'আপনার পূর্ণ সন্তুষ্টি নিশ্চিত করতে কালার, ফন্ট ও শেপ মডিফিকেশনে আন্তরিক রিভিশন।',
    tags: ['logo design', 'vector logo', 'branding', 'business logo'],
    industries: ['Real Estate', 'Law Firms', 'E-commerce', 'Clinics', 'Restaurants'],
    relatedGigs: ['brand-identity-design', 'social-media-poster-design'],
    status: 'active'
  },
  {
    id: 'gd-poster',
    slug: 'social-media-poster-design',
    title: 'কাস্টম সোশ্যাল মিডিয়া পোস্টার ও ব্যানার ডিজাইন',
    shortTitle: 'পোস্টার ও ব্যানার ডিজাইন',
    category: 'graphic-design',
    subcategory: 'পোস্টার',
    overview: 'সোশ্যাল মিডিয়া ফিডে গ্রাহকের দৃষ্টি আকর্ষণের মতো হাই-কনভার্সন প্রমোশনাল ডিজাইন।',
    description: 'সাধারণ ডিজাইন দিয়ে গ্রাহকের নজর কাড়া যায় না। আমরা তৈরি করি নজরকাড়া প্রমোশনাল ব্যানার, অফার পোস্টার এবং ক্যাম্পেইন ক্রিয়েটিভস যা আপনার কনভার্সন ও এনগেজমেন্ট বহুগুণে বৃদ্ধি করবে।',
    whoIsThisFor: 'ই-কমার্স, ফেসবুক পেইজ, রেস্তোরাঁ, রিয়েল এস্টেট ও যেকোনো ইভেন্ট প্রমোশন।',
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 22,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল পোস্টার ক্রিয়েটিভ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 2,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি হাই-রেজোলিউশন কাস্টম পোস্টার', 'JPG/PNG ফরম্যাট', 'ফেসবুক/ইনস্টাগ্রাম সাইজ অপটিমাইজড'],
        features: { designs: 1, source: false }
      },
      standard: {
        name: 'ক্যাম্পেইন প্রোমো প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 4,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩টি প্রমোশনাল পোস্টার ডিজাইন', 'স্টোরিজ ও ফিড উভয় সাইজ ভার্সন', 'এডিটেবল সোর্স ফাইলস (PSD/AI)'],
        features: { designs: 3, source: true }
      },
      premium: {
        name: 'মেগা ক্যাম্পেইন প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬টি প্রিমিয়াম গ্রাফিক্স পোস্টার', 'ফুল সাইজ ভেরিয়েশন (ফিড, স্টোরি, ব্যানার)', 'সোর্স ফাইল ও প্রিমিয়াম স্টক এসেটস'],
        features: { designs: 6, source: true }
      }
    },
    faqs: [
      { question: 'আপনারা কি টেমপ্লেট ব্যবহার করেন?', answer: 'না, প্রতিটি ডিজাইন আপনার দেওয়া কনটেন্ট ও প্রোডাক্ট অনুযায়ী কাস্টম তৈরি করা হয়।' }
    ],
    requirements: ['পোস্টারের টেক্সট বা অফারের বিবরণ', 'লোগো এবং প্রোডাক্ট ছবি (যদি থাকে)।'],
    revisionPolicy: 'টেক্সট বা কালারের যেকোনো ছোটখাটো সংশোধনে দ্রুত সাপোর্ট।',
    tags: ['poster design', 'social ad design', 'banner graphics', 'flyer design'],
    industries: ['E-commerce', 'Events', 'Real Estate', 'Restaurants'],
    relatedGigs: ['youtube-thumbnail-design', 'business-flyer-design'],
    status: 'active'
  },
  {
    id: 'gd-thumbnail',
    slug: 'youtube-thumbnail-design',
    title: 'হাই-সিটিআর ইউটিউব থাম্বনেইল ডিজাইন প্যাক',
    shortTitle: 'ইউটিউব থাম্বনেইল ডিজাইন',
    category: 'graphic-design',
    subcategory: 'থাম্বনেইল',
    overview: 'হাই-ক্লিক রেট (CTR) নিশ্চিতকারী নজরকাড়া ইউটিউব থাম্বনেইল ডিজাইন।',
    description: 'ভিডিও যতই ভালো হোক, আকর্ষণীয় থাম্বনেইল ছাড়া ভিউ পাওয়া অসম্ভব। আমরা ডিজাইন করি হাই-কনট্রাস্ট ও বোল্ড ইউটিউব থাম্বনেইল যা দর্শকের দৃষ্টি আকর্ষণ করে ভিডিওর ক্লিক রেট বাড়িয়ে তোলে।',
    whoIsThisFor: 'ইউটিউবার, কনটেন্ট ক্রিয়েটর, পডকাস্টার ও অনলাইন ট্রেইনার।',
    galleryImages: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 45,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল থাম্বনেইল',
        price: 'কাস্টম বাজেট',
        deliveryTime: 2,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি হাই-সিটিআর থাম্বনেইল', 'Full HD 1080p অপটিমাইজড', 'ফ্রি স্টক ব্যাকগ্রাউন্ড'],
        features: { count: 1, sources: false }
      },
      standard: {
        name: 'ক্রিয়েটর ট্রায়ো প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 3,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩টি কাস্টম থাম্বনেইল', 'এডিটেবল সোর্স ফাইল (PSD)', 'হাই-কনভার্সন ভিজ্যুয়াল হুকস'],
        features: { count: 3, sources: true }
      },
      premium: {
        name: 'প্রো ইউটিউবার বান্ডেল',
        price: 'কাস্টম বাজেট',
        deliveryTime: 7,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৮টি প্রিমিয়াম থাম্বনেইল ডিজাইন', 'কম্পিটিটর অডিট ও ভিজ্যুয়াল স্ট্র্যাটেজি', 'ভিআইপি ফাস্ট ডেলিভারি ও সোর্স ফাইলਸ'],
        features: { count: 8, sources: true }
      }
    },
    faqs: [
      { question: 'থাম্বনেইল ফরম্যাট কী থাকে?', answer: 'ইউটিউব স্ট্যান্ডার্ড 1280x720 এবং 1920x1080 Full HD সাইজে অপটিমাইজড ফাইল দেওয়া হয়।' }
    ],
    requirements: ['ভিডিও টাইটেল বা হুক টেক্সট', 'ক্রিয়েটরের ফেস ছবি (যদি থাকে)', 'চ্যানেল লিংক বা কালার থিম।'],
    revisionPolicy: 'টেক্সট সাইজ ও ফেস কালার অ্যাডজাস্টমেন্টে দ্রুত রিভিশন।',
    tags: ['youtube thumbnail', 'CTR boost', 'video graphic', 'youtube growth'],
    industries: ['Creators', 'Coaches', 'Vloggers', 'Tech Reviewers'],
    relatedGigs: ['youtube-video-editing', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 'gd-illustration',
    slug: 'vector-illustration',
    title: 'কাস্টম ফ্ল্যাট ও ভেক্টর ইলাস্ট্রেশন ডিজাইন',
    shortTitle: 'ভেক্টর ইলাস্ট্রেশন',
    category: 'graphic-design',
    subcategory: 'ইলাস্ট্রেশন',
    overview: 'ওয়েবসাইট, অ্যাপ এবং ব্র্যান্ড অ্যাসেটের জন্য অনন্য কাস্টম ভেক্টর ইলাস্ট্রেশন।',
    description: 'স্টক ইলাস্ট্রেশনের পরিবর্তে আপনার ব্র্যান্ডের জন্য তৈরি করুন সম্পূর্ণ নিজস্ব ও ইউনিক আর্টওয়ার্ক। ওয়েব ল্যান্ডিং পেজ, অ্যাপ অনবোর্ডিং কিংবা মার্কেটিং ম্যাটেরিয়ালের জন্য পারফেক্ট।',
    whoIsThisFor: 'সফটওয়্যার কোম্পানি, স্টার্টআপ, অ্যাপ ডেভেলপার ও পাবলিশার।',
    galleryImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.8,
    reviewCount: 14,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল ক্যারেক্টার / আইকন',
        price: 'কাস্টম বাজেট',
        deliveryTime: 3,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি ফ্ল্যাট ভেক্টর ইলাস্ট্রেশন', 'PNG ও স্বচ্ছ SVG ফাইল', 'কালার প্যালেট ডকুমেন্টেশন'],
        features: { count: 1, background: false }
      },
      standard: {
        name: 'ফুল সিন ইলাস্ট্রেশন',
        price: 'কাস্টম বাজেট',
        deliveryTime: 5,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি সম্পূর্ণ সিনারি ইলাস্ট্রেশন (ব্যাকগ্রাউন্ড সহ)', 'সোর্স ভেক্টর (AI/EPS)', 'কমার্শিয়াল লাইসেন্স'],
        features: { count: 1, background: true }
      },
      premium: {
        name: 'ইলাস্ট্রেশন অ্যাসেট প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 8,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৪টি ম্যাচিং থিম ইলাস্ট্রেশন', 'হাই-রেজ প্রিন্ট ও ওয়েব রেডি ফরম্যাট', 'সম্পূর্ণ এডিটেবল সোর্স ফাইলਸ'],
        features: { count: 4, background: true }
      }
    },
    faqs: [
      { question: 'SVG ফরম্যাটে পাওয়া যাবে?', answer: 'হ্যাঁ, ওয়েবে সরাসরি ব্যবহারের উপযোগী ক্রিস্টাল ক্লিয়ার স্কেলেবল SVG ফরম্যাট দেওয়া হয়।' }
    ],
    requirements: ['স্টাইল রেফারেন্স বা মুডবোর্ড', 'থিমের বিবরণ ও কালার স্কিম।'],
    revisionPolicy: 'লাইন আর্ট ও কালার সমন্বয়ে প্রয়োজনীয় রিভিশন সুবিধা।',
    tags: ['vector illustration', 'flat design', 'web illustration', 'svg graphic'],
    industries: ['Tech Startups', 'E-commerce', 'Agencies', 'Education'],
    relatedGigs: ['professional-logo-design', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 'gd-flyer',
    slug: 'business-flyer-design',
    title: 'প্রফেশনাল বিজনেস ফ্লায়ার, লিফলেট ও ব্রোশিউর ডিজাইন',
    shortTitle: 'বিজনেস ফ্লায়ার ও ব্রোশিউর',
    category: 'graphic-design',
    subcategory: 'প্রিন্ট ডিজাইন',
    overview: 'অফলাইন মার্কেটিং ও প্রচারের জন্য প্রিমিয়াম প্রিন্ট-রেডি ফ্লায়ার ও লিফলেট।',
    description: 'প্রিন্ট ম্যাটেরিয়ালে সঠিক টাইপোগ্রাফি ও লেআউট অত্যন্ত জরুরি। আপনার পণ্যের সুবিধা বা সার্ভিস বিস্তারিত তুলে ধরতে আমরা ডিজাইন করি আধুনিক ও আকর্ষণীয় ফ্লায়ার ও ফোল্ডিং ব্রোশিউর।',
    whoIsThisFor: 'রিয়েল এস্টেট, ক্লিনিক ও হাসপাতাল, রেস্তোরাঁ ও কর্পোরেট প্রতিষ্ঠান।',
    galleryImages: [
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 20,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল সাইড ফ্লায়ার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 3,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১-সাইড ফ্লায়ার ডিজাইন', 'প্রিন্ট-রেডি CMYK PDF (ব্লিড লাইন সহ)', 'হাই-রেজ এক্সপোর্ট'],
        features: { pages: 1, source: false }
      },
      standard: {
        name: 'ডাবল সাইড কর্পোরেট ফ্লায়ার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 4,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২-সাইড কর্পোরেট ফ্লায়ার', 'সোর্স AI/PSD ফাইল', 'ক্লিন ও প্রফেশনাল গ্রিড লেআউট'],
        features: { pages: 2, source: true }
      },
      premium: {
        name: 'ট্রাই-ফোল্ড ব্রোশিউর',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬-প্যানেল ট্রাই-ফোল্ড ব্রোশিউর', 'প্রিন্ট রেডি ভেক্টর ও সোর্স ফাইলਸ', 'ফ্রি স্টক রিসোর্স সমন্বয়'],
        features: { pages: 6, source: true }
      }
    },
    faqs: [
      { question: 'আপনারা কি প্রিন্ট করে দেন?', answer: 'আমরা সরাসরি কমার্শিয়াল প্রেসে প্রিন্ট করার উপযুক্ত নিখুঁত ভেক্টর প্রিন্ট-রেডি ফাইল (CMYK) প্রদান করি।' }
    ],
    requirements: ['চূড়ান্ত টেক্সট কনটেন্ট', 'লোগো ফাইল ও সাইজ রিকোয়ারমেন্ট।'],
    revisionPolicy: 'টেক্সট পরিবর্তন ও অ্যালাইনমেন্টে দ্রুত সংশোধন দেওয়া হয়।',
    tags: ['flyer design', 'business brochure', 'leaflet layout', 'cmyk print'],
    industries: ['Real Estate', 'Home Services', 'Clinics', 'Corporate'],
    relatedGigs: ['social-media-poster-design', 'brand-identity-design'],
    status: 'active'
  },
  {
    id: 'gd-brand-identity',
    slug: 'brand-identity-design',
    title: 'সম্পূর্ণ কর্পোরেট ব্র্যান্ড আইডেন্টিটি ও স্টাইল গাইডলাইন',
    shortTitle: 'কর্পোরেট ব্র্যান্ড আইডেন্টিটি',
    category: 'graphic-design',
    subcategory: 'ব্র্যান্ডিং',
    overview: 'ডিজিটাল ও প্রিন্ট উভয় মাধ্যমে শতভাগ ধারাবাহিকতা রক্ষার জন্য কমপ্লিট ব্র্যান্ড গাইড বুক।',
    description: 'একটি প্রতিষ্ঠিত ব্র্যান্ডের জন্য সুনির্দিষ্ট ভিজ্যুয়াল গাইড থাকা বাধ্যতামূলক। আমরা তৈরি করি টাইপোগ্রাফি রুলস, কালার প্যালেট, লোগো ইউসেজ ডক, ভিজিটিং কার্ড, প্যাড ও সোশ্যাল মিডিয়া ব্যানার সম্বলিত ব্র্যান্ড ম্যানুয়াল।',
    whoIsThisFor: 'কর্পোরেট প্রতিষ্ঠান, এন্টারপ্রাইজ ও ব্র্যান্ড অথরিটি বাড়াতে আগ্রহী কোম্পানি।',
    galleryImages: [
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 15,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'ব্র্যান্ড স্টাইল শীট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['কালার প্যালেট কোড (HEX, RGB, CMYK)', 'টাইপোগ্রাফি হায়ারার্কি রুলস', 'লোগো ইউসেজ গাইডলাইন কার্ড'],
        features: { pages: 1, guidelines: true }
      },
      standard: {
        name: 'আইডেন্টিটি গাইড বুক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 12,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২-পেজের ব্র্যান্ড ম্যানুয়াল PDF', 'বিজনেস কার্ড ও লেটারহেড লেআউট', 'সোশ্যাল মিডিয়া ব্যানার সেট (৩টি চ্যানেল)'],
        features: { pages: 12, guidelines: true }
      },
      premium: {
        name: 'ফুল এন্টারপ্রাইজ গাইডলাইন',
        price: 'কাস্টম বাজেট',
        deliveryTime: 20,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২৪-পেজের পূর্ণাঙ্গ কর্পোরেট ব্র্যান্ড বুক', 'সম্পূর্ণ স্টেশনারি কিট প্রিন্ট ফাইলস', 'ইমেইল সিগনেচার ও স্লাইড প্রেজেন্টেশন টেমপ্লেট', 'সকল এডিটেবল সোর্স ফাইলਸ'],
        features: { pages: 24, guidelines: true }
      }
    },
    faqs: [
      { question: 'লোগো কি এর অন্তর্ভুক্ত?', answer: 'যদি আপনার লোগো না থাকে, তবে আমাদের লোগো ডিজাইন সার্ভিসের সাথে যুক্ত করে সম্পূর্ণ প্যাকেজ নিতে পারেন।' }
    ],
    requirements: ['বর্তমান লোগো ফাইল', 'কোম্পানির লক্ষ্য ও ভিশন', 'টার্গেট অডিয়েন্স।'],
    revisionPolicy: 'প্রতিটি সেকশনে বিস্তারিত রিভিউয়ের সুযোগ।',
    tags: ['brand identity', 'style guide', 'corporate identity', 'brand book'],
    industries: ['Corporate', 'Real Estate', 'Tech Startups', 'E-commerce'],
    relatedGigs: ['professional-logo-design', 'brand-launch-social-media-kit'],
    status: 'active'
  },

  // ==========================================
  // --- Video Editing (4 Gigs) ---
  // ==========================================
  {
    id: 've-reels',
    slug: 'short-form-reels-editing',
    title: 'শর্ট-ফর্ম রিলস, টিকটক ও ইউটিউব শর্টস ভিডিও এডিটিং',
    shortTitle: 'রিলস ও শর্টস এডিটিং',
    category: 'video-editing',
    subcategory: 'শর্টস ও রিলস',
    overview: 'আকর্ষণীয় হুক, ডাইনামিক সাবটাইটেল ও সাউন্ড ডিজাইন সহ ভাইরাল শর্ট ভিডিও এডিটিং।',
    description: 'সোশ্যাল মিডিয়ায় এখন শর্ট ভিডিওর যুগ। আপনার সাধারণ র ফুটেজকে আমরা রূপান্তর করি হাইপার-এনগেজিং রিলস ও শর্টসে—ট্রেন্ডি ক্যাপশন, সিনেমাটিক সাউন্ড ইফেক্ট, জুম কাট ও কালার গ্রেডিং দিয়ে।',
    whoIsThisFor: 'ইনফ্লুয়েন্সার, বিজনেস ওনার, ট্রেইনার, রিয়েল এস্টেট এজেন্ট ও ক্রিয়েটর।',
    galleryImages: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 52,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল রিলস স্টার্টার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 2,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি ভিডিও এডিট (৩০ সেকেন্ড পর্যন্ত)', 'ট্রেন্ডি ডায়নামিক সাবটাইটেল', 'সাউন্ড ইফেক্টস ও ব্যাকগ্রাউন্ড মিউজিক', '1080x1920 ভার্টিক্যাল ফরম্যাট'],
        features: { count: 1, duration: 30, soundFX: true }
      },
      standard: {
        name: 'ক্রিয়েটর প্যাক (৫টি ভিডিও)',
        price: 'কাস্টম বাজেট',
        deliveryTime: 5,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৫টি রিলস / শর্টস এডিটিং (৬০ সেকেন্ড পর্যন্ত)', 'ইন্টারেক্টিভ ইমোজি ও গ্রাফিক্স পপ-আপ', 'হুক পরামর্শ ও জুম ট্রানজিশন', 'নয়েজ রিমুভাল ও অডিও ব্যালেন্সিং'],
        features: { count: 5, duration: 60, soundFX: true }
      },
      premium: {
        name: 'ভাইরাল ব্র্যান্ড স্কেল (১৫টি ভিডিও)',
        price: 'কাস্টম বাজেট',
        deliveryTime: 12,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১৫টি প্রিমিয়াম রিলস এডিটিং', 'ফুল কালার গ্রেডিং ও সাউন্ড মাস্টারিং', 'কাস্টম ট্রানজিশন ও ওভারলে', 'থাম্বনেইল ফ্রেম সিলেকশন'],
        features: { count: 15, duration: 60, soundFX: true }
      }
    },
    faqs: [
      { question: 'ভিডিও ফুটেজ কি ক্লায়েন্ট পাঠাবে?', answer: 'হ্যাঁ, আপনার মোবাইলে বা ক্যামেরায় ধারণ করা র ভিডিও ফুটেজ গুগল ড্রাইভ বা শেয়ারিং লিংকের মাধ্যমে পাঠাতে হবে।' }
    ],
    requirements: ['র ভিডিও ফাইলস', 'কোনো নির্দিষ্ট টেক্সট বা ক্যাপশন থাকলে তা শেয়ার করুন।'],
    revisionPolicy: 'টাইমিং কাট, সাবটাইটেল কারেকশন ও মিউজিক অ্যাডজাস্টমেন্টে দ্রুত রিভিশন।',
    tags: ['reels editing', 'tiktok edit', 'youtube shorts', 'alex hormozi captions'],
    industries: ['Coaches', 'Real Estate', 'Creators', 'E-commerce'],
    relatedGigs: ['youtube-thumbnail-design', 'youtube-video-editing'],
    status: 'active'
  },
  {
    id: 've-yt',
    slug: 'youtube-video-editing',
    title: 'প্রফেশনাল ইউটিউব ভিডিও এডিটিং ও কালার গ্রেডিং',
    shortTitle: 'ইউটিউব ভিডিও এডিটিং',
    category: 'video-editing',
    subcategory: 'ইউটিউব',
    overview: 'ল্যান্ডস্কেপ ভিডিওর জন্য সিনেমাটিক কাট, B-roll, মোশন গ্রাফিক্স ও উন্নত সাউন্ড ডিজাইন।',
    description: 'দর্শকদের শেষ পর্যন্ত ধরে রাখতে ও ওয়াচ টাইম বাড়াতে প্রয়োজন নিখুঁত এডিটিং। আমরা তৈরি করি হাই-কোয়ালিটি ল্যান্ডস্কেপ ভিডিও—সঠিক B-roll সংযোজন, ডায়নামিক লোয়ার থার্ডস ও ক্রিস্টাল ক্লিয়ার সাউন্ড সহ।',
    whoIsThisFor: 'ইউটিউবার, পডকাস্টার, শিক্ষামূলক চ্যানেল ও কর্পোরেট প্রেজেন্টেশন।',
    galleryImages: [
      'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 31,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'ব্লগ / টকিং হেড স্টার্টার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 4,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৫ মিনিট পর্যন্ত ভিডিও এডিটিং', 'ক্লিন জাম্প কাট ও নয়েজ রিমুভাল', 'লোয়ার থার্ডস ও ব্যাকগ্রাউন্ড মিউজিক'],
        features: { duration: 5, bRoll: false, colorGrade: true }
      },
      standard: {
        name: 'স্টোরিটেলিং / টেক প্রো',
        price: 'কাস্টম বাজেট',
        deliveryTime: 7,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২ মিনিট পর্যন্ত আউটপুট', 'প্রাসঙ্গিক B-Roll ফুটেজ সংযোজন', 'মোশন টাইটেল ও সাউন্ড ডিজাইন', 'উন্নত কালার কারেকশন'],
        features: { duration: 12, bRoll: true, colorGrade: true }
      },
      premium: {
        name: 'সিনেমাটিক ডকুমেন্টারি প্যাক',
        price: 'কাস্টম বাজেট',
        deliveryTime: 12,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['২৫ মিনিট পর্যন্ত পূর্ণাঙ্গ এডিটিং', 'সিনেমাটিক কালার গ্রেডিং', 'কাস্টম গ্রাফিক্স ও স্টক ফুটেজ লাইব্রেরি', 'ফুল HD / 4K রেন্ডার'],
        features: { duration: 25, bRoll: true, colorGrade: true }
      }
    },
    faqs: [
      { question: 'কোন সফটওয়্যারে এডিটিং করা হয়?', answer: 'আমরা মূলত Adobe Premiere Pro, After Effects এবং DaVinci Resolve ব্যবহার করি।' }
    ],
    requirements: ['র ফুটেজের ড্রাইভ লিংক', 'ভিডিওর আউটলাইন বা পয়েন্টের বিবরণ।'],
    revisionPolicy: 'কাটিং ও টাইটেল কারেকশনে আন্তরিক সংশোধন সুবিধা।',
    tags: ['youtube edit', 'video editing', 'premiere pro', 'da vinci resolve'],
    industries: ['Creators', 'Corporate', 'Edu-tech', 'Travel Brands'],
    relatedGigs: ['youtube-thumbnail-design', 'short-form-reels-editing'],
    status: 'active'
  },
  {
    id: 've-promo',
    slug: 'promotional-video-editing',
    title: 'হাই-কনভার্সন কর্পোরেট ও প্রমোশনাল ভিডিও প্রোডাকশন',
    shortTitle: 'প্রমোশনাল ভিডিও এডিটিং',
    category: 'video-editing',
    subcategory: 'প্রমোশনাল',
    overview: 'ব্র্যান্ডের বিশ্বাসযোগ্যতা বৃদ্ধি ও সার্ভিস হাইলাইট করার জন্য প্রিমিয়াম প্রমোশনাল ভিডিও।',
    description: 'আপনার বিজনেসের শক্তি তুলে ধরুন আন্তর্জাতিক মানের প্রমো ভিডিওর মাধ্যমে। স্টক ফুটেজ, সিনেমাটিক মিউজিক, মোশন গ্রাফিক্স ও প্রফেশনাল ভয়েস-ওভারের সমন্বয়ে তৈরি হয় বিক্রয় সহায়ক ভিডিও।',
    whoIsThisFor: 'কর্পোরেট প্রতিষ্ঠান, হাসপাতাল, রিয়েল এস্টেট কোম্পানি ও স্টার্টআপ।',
    galleryImages: [
      'https://images.unsplash.com/photo-1540655037529-dec987208707?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 26,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'প্রমো স্টার্টার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 3,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩০ সেকেন্ড প্রমো ভিডিও', 'টেক্সট ওভারলে ও টাইটেলস', 'রয়্যালটি-ফ্রি ব্যাকগ্রাউন্ড মিউজিক', '1080p Full HD আউটপুট'],
        features: { duration: 30, voiceover: false }
      },
      standard: {
        name: 'ব্র্যান্ড এক্সপ্লেইনার',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬০ সেকেন্ড কমার্শিয়াল প্রমো', 'প্রফেশনাল ভয়েস-ওভার সমন্বয়', 'প্রিমিয়াম স্টক ফুটেজ সংযোজন', 'মোশন গ্রাফিক্স টাইপোগ্রাফি'],
        features: { duration: 60, voiceover: true }
      },
      premium: {
        name: 'এন্টারপ্রাইজ কমার্শিয়াল',
        price: 'কাস্টম বাজেট',
        deliveryTime: 10,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২০ সেকেন্ড সিনেমাটিক প্রমো', 'অ্যাডভান্সড সাউন্ড ডিজাইন ও কাস্টম মিউজিক', 'স্ক্রিপ্ট রাইটিং ও ফুল প্রোডাকশন সাপোর্ট'],
        features: { duration: 120, voiceover: true }
      }
    },
    faqs: [
      { question: 'আপনারা কি ভয়েস-ওভার দেন?', answer: 'হ্যাঁ, স্ট্যান্ডার্ড ও প্রিমিয়াম প্যাকেজে বাংলা বা ইংরেজি প্রফেশনাল ভয়েস-ওভার অন্তর্ভুক্ত থাকে।' }
    ],
    requirements: ['প্রজেক্টের মূল বার্তা ও উদ্দেশ্য', 'লোগো এবং হাইলাইট করার মতো ফিচারসমূহ।'],
    revisionPolicy: 'স্ক্রিন টেক্সট ও লোগো পজিশনিংয়ে দ্রুত রিভিশন।',
    tags: ['promo video', 'brand commercial', 'corporate video', 'explainer ad'],
    industries: ['Clinics', 'Real Estate', 'Tech Startups', 'Restaurants'],
    relatedGigs: ['social-media-ad-video-editing', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 've-ad',
    slug: 'social-media-ad-video-editing',
    title: 'হাই-কনভার্সন ই-কমার্স প্রোডাক্ট ভিডিও অ্যাডস',
    shortTitle: 'ই-কমার্স ভিডিও অ্যাডস',
    category: 'video-editing',
    subcategory: 'অ্যাড ক্রিয়েটিভস',
    overview: 'ফেসবুক ও ইনস্টাগ্রাম পেইড বিজ্ঞাপনের জন্য সরাসরি সেলস এনে দেওয়ার মতো ভিডিও অ্যাডস।',
    description: 'বিজ্ঞাপনের খরচ থেকে সর্বোচ্চ রিটার্ন নিশ্চিত করতে সাধারণ ছবির চেয়ে ভিডিও অ্যাড অনেক বেশি কার্যকর। শক্তিশালী হুক, প্রোডাক্ট বেনিফিট ও ক্লিয়ার কল-টু-অ্যাকশন সহ আমরা তৈরি করি ভিডিও বিজ্ঞাপন।',
    whoIsThisFor: 'ই-কমার্স উদ্যোক্তা, ড্রপশিপার ও প্রোডাক্ট সেলার।',
    galleryImages: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 39,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল প্রোডাক্ট অ্যাড',
        price: 'কাস্টম বাজেট',
        deliveryTime: 2,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি প্রোডাক্ট ভিডিও অ্যাড (৩০ সেকেন্ড)', 'স্কয়ার (১:১) ফরম্যাট', 'হুক টেক্সট ওভারলে ও অফার ব্যানার'],
        features: { formats: 1, duration: 30, script: false }
      },
      standard: {
        name: 'অমনিচ্যানেল অ্যাড ট্রায়ো',
        price: 'কাস্টম বাজেট',
        deliveryTime: 4,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১টি অ্যাডের ৩টি সাইজ ভেরিয়েশন (ফিড, স্টোরি, ওয়াইড)', 'ভাইরাল হুক স্ক্রিপ্ট', 'সাউন্ড ইফেক্টস ও ব্যাকগ্রাউন্ড মিউজিক'],
        features: { formats: 3, duration: 45, script: true }
      },
      premium: {
        name: 'স্কেল ক্যাম্পেইন বান্ডেল',
        price: 'কাস্টম বাজেট',
        deliveryTime: 6,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩টি আলাদা প্রোডাক্ট ভিডিও অ্যাড', 'মাল্টি-সাইজ ফরম্যাট', 'স্ক্রিপ্ট রাইটিং ও কম্পিটিটর অডিট', 'ভয়েস-ওভার ও সেলস হুকস'],
        features: { formats: 3, duration: 60, script: true }
      }
    },
    faqs: [
      { question: 'ড্রপশিপিং বা প্রোডাক্ট ক্লিপস কি আপনারা খুঁজে নেন?', answer: 'হ্যাঁ, আমরা প্রয়োজনীয় স্টক ও প্রোডাক্ট ভিডিও সংগ্রহ করে আকর্ষণীয় অ্যাডে রূপান্তর করি।' }
    ],
    requirements: ['প্রোডাক্টের লিংক বা ছবি', 'অফার ও প্রাইসিং তথ্য।'],
    revisionPolicy: 'হুক পরিবর্তন ও টেক্সট কারেকশনে দ্রুত সংশোধন।',
    tags: ['video ads', 'e-commerce ads', 'facebook ads video', 'tiktok ads editing'],
    industries: ['E-commerce', 'Drop-shipping', 'Fashion', 'SaaS Brands'],
    relatedGigs: ['social-media-poster-design', 'landing-page-design'],
    status: 'active'
  },

  // ==========================================
  // --- Website Design & Dev (4 Gigs) ---
  // ==========================================
  {
    id: 'web-business',
    slug: 'business-website-design',
    legacySlugs: ['small-business-website-design'],
    title: 'প্রিমিয়াম রেসপন্সিভ বিজনেস ওয়েবসাইট ডেভেলপমেন্ট',
    shortTitle: 'বিজনেস ওয়েবসাইট ডেভেলপমেন্ট',
    category: 'website-design',
    subcategory: 'ফুল ওয়েবসাইট',
    overview: 'সুপার ফাস্ট, আধুনিক ও রেসপন্সিভ কর্পোরেট মাল্টি-পেজ ওয়েবসাইট সল্যুশন।',
    description: 'আপনার বিজনেসের বিশ্বাসযোগ্যতা শতগুণে বাড়িয়ে তুলুন একটি আধুনিক ওয়েবসাইটের মাধ্যমে। মোবাইল-ফ্রেন্ডলি ডিজাইন, দ্রুতগতির লোডিং, কন্টাক্ট ইনকোয়ারি ফর্ম ও বেসিক এসইও অপটিমাইজেশন সহ সম্পূর্ণ রেডিমেড ওয়েবসাইট।',
    whoIsThisFor: 'কর্পোরেট প্রতিষ্ঠান, ক্লিনিক ও ডায়াগনস্টিক সেন্টার, ল ফার্ম, ট্রাভেল এজেন্সি ও স্টার্টআপ।',
    galleryImages: [
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 18,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'স্টার্টার বিজনেস সাইট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 10,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৩-পেজ ওয়েবসাইট (হোম, সার্ভিস, যোগাযোগ)', '১০০% মোবাইল ফ্রেন্ডলি রেসপন্সিভ লেআউট', 'ইনকোয়ারি ফর্ম ও হোয়াটসঅ্যাপ বাটন', 'বেসিক অন-পেজ এসইও সেটআপ'],
        features: { pages: 3, responsive: true, speedOptimized: true }
      },
      standard: {
        name: 'গ্রোথ কর্পোরেট পোর্টাল',
        price: 'কাস্টম বাজেট',
        deliveryTime: 18,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬-পেজ কাস্টম ওয়েবসাইট (পোর্টফোলিও/রিভিউ সহ)', 'আধুনিক দ্রুতগতির প্রযুক্তি (React/WordPress)', 'কাস্টমার ডাটাবেজ ইন্টিগ্রেশন', 'ডাইনামিক সার্ভিস ক্যালকুলেটর'],
        features: { pages: 6, responsive: true, speedOptimized: true }
      },
      premium: {
        name: 'এন্টারপ্রাইজ ডিজিটাল প্ল্যাটফর্ম',
        price: 'কাস্টম বাজেট',
        deliveryTime: 28,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২-পেজ পর্যন্ত কাস্টম পোর্টাল', 'ডাইনামিক ব্লগ ও কন্টেন্ট ম্যানেজমেন্ট সিস্টেম', 'পেমেন্ট ও ইনভয়েস সিস্টেম সমন্বয়', 'সুপার ফাস্ট স্পিড অপটিমাইজেশন (LCP <= ১.৫ সে.)', '১ মাস ফ্রি টেকনিক্যাল সাপোর্ট'],
        features: { pages: 12, responsive: true, speedOptimized: true }
      }
    },
    faqs: [
      { question: 'কোন প্রযুক্তিতে ওয়েবসাইট তৈরি করেন?', answer: 'আমরা মূলত আধুনিক, দ্রুতগতির React/Next.js ফ্রেমওয়ার্ক এবং সহজ পরিচালনার জন্য ওয়ার্ডপ্রেস দিয়ে ওয়েবসাইট তৈরি করি।' }
    ],
    requirements: ['ব্যবসার বিস্তারিত বিবরণ', 'প্রয়োজনীয় পেজসমূহের তালিকা', 'লোগো ও কালার রেফারেন্স।'],
    revisionPolicy: 'ডিজাইন ও ডেভেলপমেন্ট পর্যায়ে প্রতিটি সেকশনে আপনার ফিডব্যাক অনুযায়ী রিভিশন দেওয়া হয়।',
    tags: ['web design', 'react website', 'business site', 'local SEO web'],
    industries: ['Clinics', 'Law Firms', 'Real Estate', 'Home Services'],
    relatedGigs: ['landing-page-design', 'website-redesign'],
    status: 'active'
  },
  {
    id: 'web-landing',
    slug: 'landing-page-design',
    title: 'হাই-কনভার্সন প্রোডাক্ট ও সার্ভিস ল্যান্ডিং পেজ ডিজাইন',
    shortTitle: 'ল্যান্ডিং পেজ ডিজাইন',
    category: 'website-design',
    subcategory: 'ল্যান্ডিং পেজ',
    overview: 'পেইড বিজ্ঞাপনের সেলস বাড়ানোর জন্য সুপার ফাস্ট ও আকর্ষণীয় সিঙ্গেল পেজ ওয়েবসাইট।',
    description: 'বিজ্ঞাপনের ট্র্যাফিককে সরাসরি সেলসে রূপান্তর করুন হাই-কনভার্সন ল্যান্ডিং পেজ দিয়ে। দ্রুত লোডিং, আকর্ষণীয় কল-টু-অ্যাকশন, মোবাইল অপটিমাইজড ইন্টারফেস এবং সহজ অর্ডার ফর্ম।',
    whoIsThisFor: 'ই-কমার্স ব্র্যান্ড, কোর্স সেলার, কোচ ও ডিজিটাল সার্ভিস প্রোভাইডার।',
    galleryImages: [
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 22,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'স্টার্টার ল্যান্ডিং পেজ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 5,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১-পেজ লেআউট (৪টি সেকশন পর্যন্ত)', 'লিড কালেকশন ফর্ম ও হোয়াটসঅ্যাপ বাটন', 'স্ট্যান্ডার্ড মোবাইল রেসপন্সিভনেস'],
        features: { sections: 4, responsive: true, animated: false }
      },
      standard: {
        name: 'কনভার্সন প্রো ল্যান্ডিং',
        price: 'কাস্টম বাজেট',
        deliveryTime: 8,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১-পেজ লেআউট (৮টি সেকশন পর্যন্ত)', 'কাস্টম UI অ্যানিমেশন ও মাইক্রো-ইন্টারেকশন', 'ডিরেক্ট অর্ডার ও ইনকোয়ারি ডাটাবেজ', 'A/B টেস্ট রেডি লেআউট'],
        features: { sections: 8, responsive: true, animated: true }
      },
      premium: {
        name: 'ফুল অ্যাড-ক্যাম্পেইন হাব',
        price: 'কাস্টম বাজেট',
        deliveryTime: 12,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২টি সেকশন পর্যন্ত দীর্ঘ ল্যান্ডিং পেজ', 'সোশ্যাল প্রুফ ও ক্লায়েন্ট রিভিউ উইজেট', 'সুপার ফাস্ট লোডিং অপটিমাইজেশন', 'হোয়াটসঅ্যাপ ডিরেক্ট বুকিং ইন্টিগ্রেশন'],
        features: { sections: 12, responsive: true, animated: true }
      }
    },
    faqs: [
      { question: 'কন্টেন্ট বা লেখা কি আপনারা লিখে দেবেন?', answer: 'হ্যাঁ, স্ট্যান্ডার্ড ও প্রিমিয়াম প্যাকেজে বিক্রয় সহায়ক হাই-কনভার্সন বাংলা/ইংরেজি টেক্সট কপিরাইটিং অন্তর্ভুক্ত।' }
    ],
    requirements: ['ল্যান্ডিং পেজের মূল উদ্দেশ্য ও পণ্যের বিবরণ', 'লোগো এবং অফার ডিটেইলস।'],
    revisionPolicy: 'সেকশন বিন্যাস ও বাটনে প্রয়োজনীয় রিভিশন সুবিধা।',
    tags: ['landing page', 'sales page', 'react web page', 'conversion design'],
    industries: ['E-commerce', 'Coaches', 'SaaS Brands', 'Local Businesses'],
    relatedGigs: ['business-website-design', 'website-redesign'],
    status: 'active'
  },
  {
    id: 'web-portfolio',
    slug: 'portfolio-website-design',
    title: 'পার্সোনাল পোর্টফোলিও ও ক্রিয়েটিভ শোকেস ওয়েবসাইট',
    shortTitle: 'পোর্টফোলিও ওয়েবসাইট',
    category: 'website-design',
    subcategory: 'পোর্টফোলিও',
    overview: 'আপনার কাজের নমুনা, দক্ষতা ও অর্জন প্রদর্শনের জন্য দৃষ্টিনন্দন পোর্টফোলিও সাইট।',
    description: 'অনলাইনে নিজের শক্তিশালী ব্র্যান্ড তৈরি করতে একটি পার্সোনাল পোর্টফোলিও সাইট অত্যন্ত গুরুত্বপূর্ণ। আপনার পূর্বের কাজ, ক্লায়েন্ট ফিডব্যাক ও সার্ভিস লিস্ট সাজিয়ে নিন একটি আধুনিক ওয়েবসাইটে।',
    whoIsThisFor: 'ডিজাইনার, কনসালট্যান্ট, ফটোগ্রাফার, ফ্রিল্যান্সার ও ক্রিয়েটিভ প্রফেশনাল।',
    galleryImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 4.9,
    reviewCount: 17,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'সিঙ্গেল পেজ পোর্টফোলিও',
        price: 'কাস্টম বাজেট',
        deliveryTime: 5,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১-পেজ পোর্টফোলিও লেআউট', 'সার্ভিস ও গ্যালারি ডিসপ্লে সেকশন', 'ডাউনলোডেবল রিজিউমে বাটন ও কন্টাক্ট লিঙ্ক'],
        features: { pages: 1, galleries: 1 }
      },
      standard: {
        name: 'প্রো শোকেস সাইট',
        price: 'কাস্টম বাজেট',
        deliveryTime: 9,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৪-পেজ ওয়েবসাইট (হোম, পোর্টফোলিও, সম্পর্কে, যোগাযোগ)', 'ইন্টারেক্টিভ ফিল্টার গ্রিড', 'কেস স্টাডি পপ-আপ ডিটেইলস', 'স্মুথ স্ক্রোল ও অ্যানিমেশনস'],
        features: { pages: 4, galleries: 2 }
      },
      premium: {
        name: 'এজেন্সি গ্রেড পার্সোনাল ব্র্যান্ড',
        price: 'কাস্টম বাজেট',
        deliveryTime: 14,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬-পেজ প্রিমিয়াম ওয়েবসাইট', 'ডাইনামিক প্রজেক্ট ম্যানেজমেন্ট সেটআপ', 'ক্লায়েন্ট টেস্টিমোনিয়াল ক্যারোসেল', 'সম্পূর্ণ স্পিড অপটিমাইজেশন'],
        features: { pages: 6, galleries: 4 }
      }
    },
    faqs: [
      { question: 'পরবর্তীতে নতুন প্রজেক্ট কি আমি নিজে যুক্ত করতে পারব?', answer: 'হ্যাঁ, স্ট্যান্ডার্ড ও প্রিমিয়াম প্যাকেজে সহজ কনটেন্ট আপলোড ব্যবস্থা থাকে।' }
    ],
    requirements: ['আপনার পূর্বের কাজের ছবি ও বিবরণ', 'বায়ো ও সোশ্যাল মিডিয়া প্রোফাইল লিংক।'],
    revisionPolicy: 'লেআউট ও ফন্ট সাইজে আন্তরিক রিভিশন সুবিধা।',
    tags: ['portfolio site', 'personal website', 'creative resume', 'artist showcase'],
    industries: ['Creators', 'Designers', 'Photographers', 'Consultants'],
    relatedGigs: ['business-website-design', 'landing-page-design'],
    status: 'active'
  },
  {
    id: 'web-redesign',
    slug: 'website-redesign',
    title: 'পুরাতন ওয়েবসাইট রি-ডিজাইন ও স্পিড অপটিমাইজেশন',
    shortTitle: 'ওয়েবসাইট রি-ডিজাইন',
    category: 'website-design',
    subcategory: 'রি-ডিজাইন',
    overview: 'ধীরগতির ও পুরাতন ওয়েবসাইটকে রূপান্তর করুন দ্রুতগতির আধুনিক ও আকর্ষণীয় প্ল্যাটফর্মে।',
    description: 'পুরাতন ও ধীরগতির ওয়েবসাইট আপনার ব্যবসার সুনাম নষ্ট করে। আমরা পুরো ওয়েবসাইট অডিট করে সম্পূর্ণ আধুনিক UI/UX ডিজাইনে রূপান্তর করি, মোবাইল ইন্টারফেস ঠিক করি এবং স্পিড বহুগুণ বাড়িয়ে দিই।',
    whoIsThisFor: 'যাদের বর্তমান ওয়েবসাইট স্লো, মোবাইল ফ্রেন্ডলি নয় কিংবা আউটডেটেড ডিজাইনের।',
    galleryImages: [
      'https://images.unsplash.com/photo-1581291518655-9523c932ebcf?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1280&h=769&fit=crop',
      'https://images.unsplash.com/photo-1547658719-da2b81169b7a?q=80&w=1280&h=769&fit=crop'
    ],
    deliveredProjectImages: [],
    rating: 5.0,
    reviewCount: 29,
    startingPrice: 'কাস্টম বাজেট',
    packages: {
      basic: {
        name: 'মোবাইল UX রি-ডিজাইন',
        price: 'কাস্টম বাজেট',
        deliveryTime: 7,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['ফ্রন্ট-এন্ড লেআউট আধুনিকায়ন', 'মোবাইল রেসপন্সিভনেস সম্পূর্ণ সমাধান', 'বিদ্যমান কনটেন্ট সুন্দরভাবে সাজানো'],
        features: { pages: 3, speedImprovement: '30%' }
      },
      standard: {
        name: 'ফুল সাইট রি-বিল্ড (প্রো)',
        price: 'কাস্টম বাজেট',
        deliveryTime: 15,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['৬ পেজ পর্যন্ত আধুনিক রি-বিল্ড', 'ক্লিন আধুনিক রিঅ্যাক্ট/ওয়ার্ডপ্রেস কোড', 'স্পিড অপটিমাইজেশন (ইমেজ ও এসেটস কমপ্রেশন)', 'বিদ্যমান গুগল এসইও রক্ষা ও রিডাইরেকশন'],
        features: { pages: 6, speedImprovement: '60%' }
      },
      premium: {
        name: 'এন্টারপ্রাইজ প্ল্যাটফর্ম রিফ্রেশ',
        price: 'কাস্টম বাজেট',
        deliveryTime: 24,
        revisions: 'প্রয়োজন অনুযায়ী',
        deliverables: ['১২ পেজ পর্যন্ত সম্পূর্ণ রি-ডিজাইন', 'ডাইনামিক কনটেন্ট রি-স্ট্রাকচার', 'কনভার্সন অপটিমাইজেশন উইজেট', '১ মাস ডেডিকেটেড পোস্ট-লঞ্চ সাপোর্ট'],
        features: { pages: 12, speedImprovement: '90%' }
      }
    },
    faqs: [
      { question: 'রি-ডিজাইন করলে গুগল এসইও র‌্যাঙ্কিং হারাবে কি?', answer: 'না। আমরা প্রয়োজনীয় 301 রিডাইরেক্ট এবং সঠিক ইউআরএল স্ট্রাকচার বজায় রেখে এসইও রক্ষা করি।' }
    ],
    requirements: ['বর্তমান ওয়েবসাইটের লিংক', 'হোস্টিং/ডোমেইন এক্সেস ও পরিবর্তনের তালিকা।'],
    revisionPolicy: 'কালার স্কিম ও সেকশন বিন্যাসে প্রয়োজনীয় রিভিশন সাপোর্ট।',
    tags: ['website redesign', 'web conversion', 'react rebuild', 'page speed optimize'],
    industries: ['Law Firms', 'Clinics', 'Home Services', 'Corporate'],
    relatedGigs: ['business-website-design', 'landing-page-design'],
    status: 'active'
  }
];

export const getGigsByCategory = (categorySlug) => {
  return gigs.filter(gig => gig.category === categorySlug && gig.status === 'active');
};

export const getGigBySlug = (slug) => {
  return gigs.find(gig => gig.slug === slug || gig.legacySlugs?.includes(slug));
};
