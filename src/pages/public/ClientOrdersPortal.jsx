import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { siteConfig } from '../../config/siteConfig';
import { whatsappLink } from '../../data/offers';

export default function ClientOrdersPortal() {
  return <><SEO title="অর্ডারের সহায়তা | CreatifyBD" description="চলমান কাজের অগ্রগতি ও ডেলিভারির বিষয়ে CreatifyBD-এর সঙ্গে যোগাযোগ করুন।" noIndex /><Navbar /><main id="main-content" className="cb-section cb-page-top"><div className="cb-container"><p className="cb-eyebrow">চলমান কাজের সহায়তা</p><h1>আপনার অর্ডার নিয়ে কথা বলুন</h1><p>আপনার চলমান কাজের অগ্রগতি বা ডেলিভারি সম্পর্কে জানতে সরাসরি যোগাযোগ করুন।</p><p>অর্ডারের সময় ব্যবহৃত নম্বর বা ইমেইল থেকে অর্ডার আইডি জানিয়ে যোগাযোগ করুন। পরিচয় মিলিয়ে কাজের অগ্রগতি, সংশোধন বা ডেলিভারির বিষয়ে সহায়তা করব।</p><p>পাসওয়ার্ড বা পেমেন্টের গোপন তথ্য পাঠাবেন না।</p><div className="cb-actions"><a className="cb-button cb-button-red" href={whatsappLink('আমার চলমান অর্ডার সম্পর্কে জানতে চাই।')} target="_blank" rel="noopener noreferrer">WhatsApp-এ যোগাযোগ</a><a className="cb-button cb-button-outline" href={`mailto:${siteConfig.email}`}>ইমেইল করুন</a><Link className="cb-button cb-button-outline" to="/contact">যোগাযোগের ফর্ম</Link></div></div></main><Footer /></>;
}
