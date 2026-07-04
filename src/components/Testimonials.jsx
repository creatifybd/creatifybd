import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideReveal, StaggerReveal, StaggerChild } from './MotionReveal';

const FALLBACK = [
  {
    id: 'f1',
    name: 'Emily Carter',
    role: 'Founder, Aurevia Skincare',
    role_bn: 'ফাউন্ডার, অরেভিয়া স্কিনকেয়ার',
    text: 'CreatifyBD gave Aurevia a complete brand identity that finally matches our product quality. The logo direction and packaging mockups impressed every retail buyer we pitched to.',
    text_bn: 'ক্রিয়েটিফাইবিডি অরেভিয়াকে এমন একটা ব্র্যান্ড আইডেন্টিটি দিয়েছে যা আমাদের প্রোডাক্টের মানের সাথে পুরোপুরি মানানসই। লোগো ও প্যাকেজিং মকআপ দেখে প্রতিটা রিটেইল বায়ার মুগ্ধ হয়েছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f2',
    name: 'Daniel Osei',
    role: 'Co-Founder, NexoPay',
    role_bn: 'কো-ফাউন্ডার, নেক্সোপে',
    text: 'The brand system CreatifyBD built for NexoPay felt instantly credible to investors. Clean, professional, and exactly the fintech identity we needed.',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি ব্র্যান্ড সিস্টেম নেক্সোপেকে ইনভেস্টরদের কাছে তাৎক্ষণিকভাবে বিশ্বাসযোগ্য করে তুলেছে। ঠিক যে ধরনের ফিনটেক আইডেন্টিটি আমাদের দরকার ছিল, তারা তাই দিয়েছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f3',
    name: 'Marco Ruiz',
    role: 'Owner, Brasa Fire Restaurant',
    role_bn: 'মালিক, ব্রাসা ফায়ার রেস্তোরাঁ',
    text: 'Our restaurant branding needed personality and warmth. CreatifyBD nailed it — the new identity is on every menu, sign, and social post now.',
    text_bn: 'আমাদের রেস্তোরাঁর ব্র্যান্ডিংয়ে উষ্ণতা ও ব্যক্তিত্ব দরকার ছিল। ক্রিয়েটিফাইবিডি সেটা একদম ঠিকভাবে করেছে — নতুন আইডেন্টিটি এখন প্রতিটা মেনু, সাইনবোর্ড আর সোশ্যাল পোস্টে আছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f4',
    name: 'Claire Whitman',
    role: 'General Manager, Harbor & Pine',
    role_bn: 'জেনারেল ম্যানেজার, হারবার অ্যান্ড পাইন',
    text: 'Guests comment on our new branding constantly. CreatifyBD understood exactly the boutique hospitality feel we were going for.',
    text_bn: 'অতিথিরা প্রায়ই আমাদের নতুন ব্র্যান্ডিং নিয়ে প্রশংসা করেন। বুটিক হসপিটালিটির যে ফিল আমরা চেয়েছিলাম, ক্রিয়েটিফাইবিডি সেটা একদম বুঝে কাজ করেছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f5',
    name: 'Ryan Coleman',
    role: 'Founder, Petello',
    role_bn: 'ফাউন্ডার, পেটেলো',
    text: 'From logo to packaging, Petello finally looks like the premium pet brand we always wanted to be.',
    text_bn: 'লোগো থেকে প্যাকেজিং পর্যন্ত, পেটেলো এখন সেই প্রিমিয়াম পেট ব্র্যান্ডের মতো দেখাচ্ছে যা আমরা সবসময় হতে চেয়েছিলাম।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f6',
    name: 'Priya Nair',
    role: 'Head of Marketing, NovaGrid',
    role_bn: 'হেড অব মার্কেটিং, নোভাগ্রিড',
    text: 'Our SaaS landing page and brand kit from CreatifyBD helped us close bigger enterprise deals. First impressions matter, and now ours is strong.',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি স্যাস ল্যান্ডিং পেজ ও ব্র্যান্ড কিট আমাদের বড় এন্টারপ্রাইজ ডিল ক্লোজ করতে সাহায্য করেছে। প্রথম ইম্প্রেশনটাই এখন অনেক শক্তিশালী।',
    stars: 5,
    tag: 'Website Design',
  },
  {
    id: 'f7',
    name: 'Isabelle Moreau',
    role: 'Creative Director, Solenne',
    role_bn: 'ক্রিয়েটিভ ডিরেক্টর, সোলেন',
    text: 'Our fashion identity needed to feel luxury without being cold. CreatifyBD delivered exactly that balance.',
    text_bn: 'আমাদের ফ্যাশন আইডেন্টিটিতে লাক্সারি ফিল দরকার ছিল, কিন্তু ঠান্ডা মনে হওয়া যাবে না। ক্রিয়েটিফাইবিডি ঠিক সেই ব্যালেন্সটা এনে দিয়েছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f8',
    name: 'Olivia Bennett',
    role: 'Owner, Crumb & Hearth Bakery',
    role_bn: 'মালিক, ক্রাম অ্যান্ড হার্থ বেকারি',
    text: "Our bakery's social content calendar from CreatifyBD noticeably increased foot traffic from Instagram alone.",
    text_bn: 'ক্রিয়েটিফাইবিডির বানানো কনটেন্ট ক্যালেন্ডার আমাদের বেকারির ইনস্টাগ্রাম থেকে দোকানে আসা কাস্টমার উল্লেখযোগ্যভাবে বাড়িয়ে দিয়েছে।',
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f9',
    name: 'Marcus Reed',
    role: 'Director of Admissions, BrightNest',
    role_bn: 'ডিরেক্টর অব অ্যাডমিশনস, ব্রাইটনেস্ট',
    text: 'Enrollment inquiries went up noticeably after CreatifyBD rebuilt our brand and social presence.',
    text_bn: 'ক্রিয়েটিফাইবিডি আমাদের ব্র্যান্ড ও সোশ্যাল উপস্থিতি নতুন করে সাজানোর পর ভর্তির অনুসন্ধান লক্ষণীয়ভাবে বেড়েছে।',
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f10',
    name: 'Jason Hale',
    role: 'Broker, NorthVale Realty',
    role_bn: 'ব্রোকার, নর্থভেল রিয়েলটি',
    text: 'Our new real estate branding and social campaign made us look like the top agency in the area — bookings followed.',
    text_bn: 'আমাদের নতুন রিয়েল এস্টেট ব্র্যান্ডিং ও সোশ্যাল ক্যাম্পেইন আমাদের এলাকার সেরা এজেন্সির মতো দেখিয়েছে — বুকিংও সেই অনুযায়ী বেড়েছে।',
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f11',
    name: 'Sophie Lambert',
    role: 'Founder, Lunora Wellness',
    role_bn: 'ফাউন্ডার, লুনোরা ওয়েলনেস',
    text: 'The wellness brand system CreatifyBD created feels calm, premium, and completely "us."',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি ওয়েলনেস ব্র্যান্ড সিস্টেমটা শান্ত, প্রিমিয়াম এবং একদম আমাদের নিজস্ব মনে হয়।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f12',
    name: 'Grace Thompson',
    role: 'Marketing Manager, Atlas Ascent Travel',
    role_bn: 'মার্কেটিং ম্যানেজার, অ্যাটলাস অ্যাসেন্ট ট্রাভেল',
    text: 'Our travel campaign videos and social content from CreatifyBD captured exactly the adventure feeling we wanted to sell.',
    text_bn: 'ক্রিয়েটিফাইবিডির বানানো ট্রাভেল ক্যাম্পেইন ভিডিও ও সোশ্যাল কনটেন্ট আমরা যে অ্যাডভেঞ্চার অনুভূতি বিক্রি করতে চেয়েছিলাম, ঠিক সেটাই ধরে ফেলেছে।',
    stars: 5,
    tag: 'Social Media',
  },
  {
    id: 'f13',
    name: 'Ethan Walsh',
    role: 'Owner, Roast Harbor Coffee',
    role_bn: 'মালিক, রোস্ট হারবার কফি',
    text: 'From branding to packaging, CreatifyBD helped Roast Harbor stand out on a crowded shelf.',
    text_bn: 'ব্র্যান্ডিং থেকে শুরু করে প্যাকেজিং পর্যন্ত, ক্রিয়েটিফাইবিডি রোস্ট হারবারকে ভিড়ে ভরা শেলফে আলাদা করে তুলতে সাহায্য করেছে।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f14',
    name: 'Natalie Brooks',
    role: 'Owner, Veloura Spa',
    role_bn: 'মালিক, ভেলোরা স্পা',
    text: 'Clients now recognize our brand instantly thanks to the identity CreatifyBD designed.',
    text_bn: 'ক্রিয়েটিফাইবিডির ডিজাইন করা আইডেন্টিটির কারণে ক্লায়েন্টরা এখন আমাদের ব্র্যান্ড সাথে সাথেই চিনে ফেলেন।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f15',
    name: 'Adam Whitfield',
    role: 'Product Lead, Fluxora',
    role_bn: 'প্রোডাক্ট লিড, ফ্লাক্সোরা',
    text: 'Our product identity needed a modern tech feel — CreatifyBD delivered on time and beyond expectations.',
    text_bn: 'আমাদের প্রোডাক্ট আইডেন্টিটিতে আধুনিক টেক ফিল দরকার ছিল — ক্রিয়েটিফাইবিডি সময়মতো এবং প্রত্যাশার চেয়ে ভালো কাজ করে দিয়েছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f16',
    name: 'Liam Foster',
    role: 'Sales Director, MaxCrest Property',
    role_bn: 'সেলস ডিরেক্টর, ম্যাক্সক্রেস্ট প্রপার্টি',
    text: 'The branding and website CreatifyBD built helped us close listings faster with a more credible online presence.',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি ব্র্যান্ডিং ও ওয়েবসাইট আরও বিশ্বাসযোগ্য অনলাইন উপস্থিতির মাধ্যমে আমাদের লিস্টিং দ্রুত ক্লোজ করতে সাহায্য করেছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f17',
    name: 'Chloe Anderson',
    role: 'Founder, Lisselle Beauty',
    role_bn: 'ফাউন্ডার, লিসেল বিউটি',
    text: 'Our packaging redesign from CreatifyBD elevated Lisselle from a small startup to a shelf-ready beauty brand.',
    text_bn: 'ক্রিয়েটিফাইবিডির প্যাকেজিং রিডিজাইন লিসেলকে একটা ছোট স্টার্টআপ থেকে শেলফ-রেডি বিউটি ব্র্যান্ডে পরিণত করেছে।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f18',
    name: 'Benjamin Clarke',
    role: 'Principal Architect, Stonecrest',
    role_bn: 'প্রিন্সিপাল আর্কিটেক্ট, স্টোনক্রেস্ট',
    text: "CreatifyBD's identity work reflects the precision and elegance we bring to every project.",
    text_bn: 'ক্রিয়েটিফাইবিডির আইডেন্টিটি কাজ আমরা প্রতিটা প্রজেক্টে যে নির্ভুলতা ও এলিগেন্স নিয়ে আসি, সেটাই প্রতিফলিত করে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f19',
    name: 'Michael Turner',
    role: 'CEO, HelioGrid Solar',
    role_bn: 'সিইও, হেলিওগ্রিড সোলার',
    text: 'Our new branding and website communicate trust — critical for a solar company. CreatifyBD understood that.',
    text_bn: 'আমাদের নতুন ব্র্যান্ডিং ও ওয়েবসাইট বিশ্বাসযোগ্যতা তুলে ধরে — একটা সোলার কোম্পানির জন্য যা অত্যন্ত জরুরি। ক্রিয়েটিফাইবিডি সেটা বুঝেই কাজ করেছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f20',
    name: 'Antonio Reyes',
    role: 'Owner, Savora Restaurant',
    role_bn: 'মালিক, সাভোরা রেস্তোরাঁ',
    text: 'Our new website and brand identity brought in more online reservations than ever.',
    text_bn: 'আমাদের নতুন ওয়েবসাইট ও ব্র্যান্ড আইডেন্টিটি আগের চেয়ে অনেক বেশি অনলাইন রিজার্ভেশন এনে দিয়েছে।',
    stars: 5,
    tag: 'Website Design',
  },
  {
    id: 'f21',
    name: 'Rachel Kim',
    role: 'Head of Growth, Finexa',
    role_bn: 'হেড অব গ্রোথ, ফিনেক্সা',
    text: "CreatifyBD's brand kit and dashboard design gave Finexa the polish we needed to pitch to investors.",
    text_bn: 'ক্রিয়েটিফাইবিডির ব্র্যান্ড কিট ও ড্যাশবোর্ড ডিজাইন ফিনেক্সাকে ইনভেস্টরদের কাছে পিচ করার জন্য যে পলিশ দরকার ছিল, তা দিয়েছে।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f22',
    name: 'David Whitmore',
    role: 'Broker, Monvero Realty',
    role_bn: 'ব্রোকার, মনভেরো রিয়েলটি',
    text: 'Every listing now carries our new brand identity — clients notice the difference immediately.',
    text_bn: 'এখন প্রতিটা লিস্টিং আমাদের নতুন ব্র্যান্ড আইডেন্টিটি বহন করে — ক্লায়েন্টরা পার্থক্যটা সাথে সাথেই বুঝতে পারেন।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f23',
    name: 'Samantha Wells',
    role: 'Co-Founder, TalentBridge',
    role_bn: 'কো-ফাউন্ডার, ট্যালেন্টব্রিজ',
    text: 'Our recruitment platform branding finally matches how serious we are about hiring solutions.',
    text_bn: 'আমাদের রিক্রুটমেন্ট প্ল্যাটফর্মের ব্র্যান্ডিং এখন আমাদের হায়ারিং সলিউশনের গুরুত্বের সাথে পুরোপুরি মানানসই।',
    stars: 5,
    tag: 'Branding & Identity',
  },
  {
    id: 'f24',
    name: 'Carlos Medina',
    role: 'Founder, Monterra Coffee Co.',
    role_bn: 'ফাউন্ডার, মন্টেরা কফি কোং',
    text: 'The packaging CreatifyBD designed helped Monterra get accepted into three new retail chains.',
    text_bn: 'ক্রিয়েটিফাইবিডির ডিজাইন করা প্যাকেজিং মন্টেরাকে তিনটা নতুন রিটেইল চেইনে জায়গা করে দিতে সাহায্য করেছে।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f25',
    name: 'Isabella Grant',
    role: 'Owner, Velora Chocolatier',
    role_bn: 'মালিক, ভেলোরা চকোলাটিয়ের',
    text: 'Our chocolate packaging finally looks as premium as it tastes — thanks to the CreatifyBD design team.',
    text_bn: 'আমাদের চকোলেটের প্যাকেজিং এখন স্বাদের মতোই প্রিমিয়াম দেখায় — এর কৃতিত্ব ক্রিয়েটিফাইবিডির ডিজাইন টিমের।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f26',
    name: 'Tyler Brooks',
    role: 'Founder, Northpaw Pet Food',
    role_bn: 'ফাউন্ডার, নর্থপ ফুড',
    text: "CreatifyBD's packaging design helped Northpaw compete with national pet food brands on the shelf.",
    text_bn: 'ক্রিয়েটিফাইবিডির প্যাকেজিং ডিজাইন নর্থপকে শেলফে জাতীয় পর্যায়ের পেট ফুড ব্র্যান্ডগুলোর সাথে প্রতিযোগিতা করতে সাহায্য করেছে।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f27',
    name: 'Emma Rodriguez',
    role: 'Owner, Golden Hive Honey',
    role_bn: 'মালিক, গোল্ডেন হাইভ হানি',
    text: 'Our honey packaging now stands out at every farmers market and grocery shelf we sell in.',
    text_bn: 'আমাদের মধুর প্যাকেজিং এখন প্রতিটা ফার্মার্স মার্কেট ও গ্রোসারি শেলফে আলাদাভাবে নজর কাড়ে।',
    stars: 5,
    tag: 'Packaging Design',
  },
  {
    id: 'f28',
    name: 'Jordan Blake',
    role: 'Founder, Urban Echo',
    role_bn: 'ফাউন্ডার, আরবান ইকো',
    text: 'The apparel designs CreatifyBD created for our streetwear drops sold out within days.',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি অ্যাপারেল ডিজাইনগুলো দিয়ে আমাদের স্ট্রিটওয়্যার ড্রপ কয়েক দিনের মধ্যেই বিক্রি হয়ে গেছে।',
    stars: 5,
    tag: 'Apparel Design',
  },
  {
    id: 'f29',
    name: 'Chris Dalton',
    role: 'Founder, Iron Pulse',
    role_bn: 'ফাউন্ডার, আয়রন পালস',
    text: 'Our performance apparel graphics needed to feel bold and athletic — CreatifyBD delivered exactly that.',
    text_bn: 'আমাদের পারফরম্যান্স অ্যাপারেল গ্রাফিক্সে বোল্ড ও অ্যাথলেটিক ফিল দরকার ছিল — ক্রিয়েটিফাইবিডি ঠিক সেটাই দিয়েছে।',
    stars: 5,
    tag: 'Apparel Design',
  },
  {
    id: 'f30',
    name: 'Hannah Price',
    role: 'Owner, Ember Table',
    role_bn: 'মালিক, এম্বার টেবিল',
    text: 'The storytelling video CreatifyBD produced for our restaurant launch brought in a wave of new reservations.',
    text_bn: 'ক্রিয়েটিফাইবিডির বানানো স্টোরিটেলিং ভিডিও আমাদের রেস্তোরাঁ লঞ্চে নতুন রিজার্ভেশনের ঢেউ নিয়ে এসেছে।',
    stars: 5,
    tag: 'Video Production',
  },
  {
    id: 'f31',
    name: 'Victoria Hughes',
    role: 'Principal Designer, NovaNest Interiors',
    role_bn: 'প্রিন্সিপাল ডিজাইনার, নোভানেস্ট ইন্টেরিয়র্স',
    text: 'Our new website finally reflects the quality of our interior design work — inquiries have increased significantly.',
    text_bn: 'আমাদের নতুন ওয়েবসাইট এখন আমাদের ইন্টেরিয়র ডিজাইন কাজের মান পুরোপুরি প্রতিফলিত করে — অনুসন্ধান উল্লেখযোগ্যভাবে বেড়েছে।',
    stars: 5,
    tag: 'Website Design',
  },
  {
    id: 'f32',
    name: 'Dr. James Whitmore',
    role: 'Owner, Mediora Dental Clinic',
    role_bn: 'মালিক, মেডিওরা ডেন্টাল ক্লিনিক',
    text: 'Our new website and online booking flow from CreatifyBD made it so much easier for patients to book appointments.',
    text_bn: 'ক্রিয়েটিফাইবিডির তৈরি নতুন ওয়েবসাইট ও অনলাইন বুকিং সিস্টেম রোগীদের জন্য অ্যাপয়েন্টমেন্ট বুক করা অনেক সহজ করে দিয়েছে।',
    stars: 5,
    tag: 'Website Design',
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="tm-stars">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--red)" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const EASE_EXPO = [0.16, 1, 0.3, 1];

const TestimonialCard = ({ item, isActive, onClick, lang }) => (
  <motion.div
    layout
    className={`tm-card ${isActive ? 'tm-card--active' : ''}`}
    onClick={onClick}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.7, ease: EASE_EXPO }}
    whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.35, ease: EASE_EXPO } }}
  >
    <div className="tm-card-inner">
      <div className="tm-card-top">
        <div className="tm-avatar-wrap">
          <img
            src={item.imageUrl || `https://ui-avatars.com/api/?name=${item.name}&background=E8192C&color=fff`}
            alt={item.name}
            className="tm-avatar"
            loading="lazy"
          />
        </div>
        <div className="tm-card-meta">
          <div className="tm-name">{item.name}</div>
          <div className="tm-role">{lang === 'bn' && item.role_bn ? item.role_bn : item.role}</div>
        </div>
        {item.tag && <div className="tm-tag">{item.tag}</div>}
      </div>

      <StarRating count={item.stars || 5} />

      <blockquote className="tm-quote">
        "{lang === 'bn' && item.text_bn ? item.text_bn : item.text}"
      </blockquote>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const { lang } = useLanguage();
  const intervalRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        if (!snap.empty) {
          setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const display = items.length > 0 ? items : FALLBACK;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [display.length]);

  const handleSelect = (idx) => {
    clearInterval(intervalRef.current);
    setActive(idx);
    intervalRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % display.length);
    }, 5000);
  };

  const activeItem = display[active];

  return (
    <section className="tm-section" id="testimonials">
      <div className="tm-bg-glow" aria-hidden="true" />

      <div className="tm-inner">
        {/* ─── Left: Header + Featured Quote ─── */}
        <SlideReveal from="left">
          <div className="tm-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
            >
              <div className="tm-eyebrow">
                <span className="tm-eyebrow-dot" />
                {lang === 'bn' ? 'ক্লায়েন্ট রিভিউ' : 'Client Testimonials'}
              </div>

              <h2 className="tm-heading">
                {lang === 'bn'
                  ? <>বিশ্বাস ও<br /><span className="tm-heading-accent">সাফল্য।</span></>
                  : <>Trusted by<br /><span className="tm-heading-accent">Visionaries.</span></>
                }
              </h2>

              <p className="tm-subtext">
                {lang === 'bn'
                  ? 'আমাদের ক্লায়েন্টরাই আমাদের সেরা পরিচয়। তাদের সাফল্যের গল্প আমাদের অনুপ্রেরণা।'
                  : "Our clients' success stories are our greatest achievement. Real results, real impact."
                }
              </p>
            </motion.div>

            {/* Featured Active Quote */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem?.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
                className="tm-featured"
              >
                <div className="tm-featured-quote-icon">
                  <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 36V22.5C0 9 8.1 2.1 24.3 0l1.8 3.6C17.1 5.7 12.6 10.2 11.7 18H21V36H0ZM27 36V22.5C27 9 35.1 2.1 51.3 0l1.8 3.6C44.1 5.7 39.6 10.2 38.7 18H48V36H27Z" fill="var(--red)" opacity="0.15"/>
                  </svg>
                </div>

                <blockquote className="tm-featured-quote">
                  {lang === 'bn' && activeItem?.text_bn ? activeItem.text_bn : activeItem?.text}
                </blockquote>

                <div className="tm-featured-author">
                  <img
                    src={activeItem?.imageUrl || `https://ui-avatars.com/api/?name=${activeItem?.name}&background=E8192C&color=fff`}
                    alt={activeItem?.name}
                    className="tm-featured-avatar"
                  />
                  <div>
                    <div className="tm-featured-name">{activeItem?.name}</div>
                    <div className="tm-featured-role">
                      {lang === 'bn' && activeItem?.role_bn ? activeItem.role_bn : activeItem?.role}
                    </div>
                    <StarRating count={activeItem?.stars || 5} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="tm-progress-dots">
              {display.map((_, i) => (
                <button
                  key={i}
                  className={`tm-dot ${active === i ? 'tm-dot--active' : ''}`}
                  onClick={() => handleSelect(i)}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </SlideReveal>

        {/* ─── Right: Card Grid ─── */}
        <SlideReveal from="right" delay={0.15}>
          <div className="tm-right">
            <div className="tm-cards-grid">
              {display.map((item, i) => (
                <TestimonialCard
                  key={item.id}
                  item={item}
                  isActive={active === i}
                  onClick={() => handleSelect(i)}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        </SlideReveal>
      </div>
    </section>
  );
};

export default Testimonials;
