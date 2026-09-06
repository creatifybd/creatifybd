import React from 'react';
import { ArrowRight, CalendarCheck, CheckCircle, Clock, LineChart, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeReveal, SlideReveal, StaggerReveal, StaggerChild, BlurReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const benefits = [
  {
    icon: <CalendarCheck size={20} />,
    title: 'রেডি মান্থলি কনটেন্ট ক্যালেন্ডার',
    desc: 'মাসের শুরুতেই পোস্টের আইডিয়া, আকর্ষণীয় ডিজাইন, ক্যাপশন ও সিডিউলিং সম্পূর্ণ প্রস্তুত থাকে।'
  },
  {
    icon: <MessageSquareText size={20} />,
    title: 'ব্র্যান্ড টোন ও এনগেজিং ক্যাপশন',
    desc: 'কাস্টমারের মনোযোগ আকর্ষণ করার মতো প্রফেশনাল ক্যাপশন ও শক্তিশালী কল-টু-অ্যাকশন।'
  },
  {
    icon: <LineChart size={20} />,
    title: 'মাসিক পারফরম্যান্স অ্যানালাইসিস',
    desc: 'কোন পোস্টগুলো বেশি রিচ ও রেজাল্ট এনে দিচ্ছে তার স্পষ্ট রিপোর্ট এবং পরবর্তী মাসের গাইডলাইন।'
  }
];

const calendarDays = [
  { day: 'সোম', done: true },
  { day: 'মঙ্গল', done: true },
  { day: 'বুধ', done: true },
  { day: 'বৃহঃ', done: true },
  { day: 'শুক্র', done: false },
  { day: 'শনি', done: false },
];

const SmmHighlight = () => {
  const { content } = useSettings();
  const smmContent = content?.smm_highlight || {};
  const editableBenefits = Array.isArray(smmContent.benefits) && smmContent.benefits.length
    ? smmContent.benefits.map((item, index) => ({
        ...benefits[index % benefits.length],
        ...item
      }))
    : benefits;
  const metrics = smmContent.metrics || {};
  const title = globalizeCopy(smmContent.title, 'সোশ্যাল মিডিয়ায় নিয়মিত উপস্থিতি গড়ে তুলুন, সেলস ও ব্র্যান্ড ট্রাস্ট বাড়ান');
  const lead = globalizeCopy(
    smmContent.lead,
    'প্রতি মাসে ফুল-টাইম টিম রাখার বাড়তি খরচ ছাড়া পান ডেডিকেটেড ক্রিয়েটিভ সাপোর্ট। কনটেন্ট ক্যালেন্ডার থেকে পোস্ট ডিজাইন—সবকিছু রেডি রাখি আমরা।'
  );

  return (
    <section className="smm-highlight-section">
      <div className="container">
        <div className="smm-grid">
          <SlideReveal from="left">
            <div>
              <FadeReveal delay={0.1}>
                <h2>{renderRichTitle(title)}</h2>
              </FadeReveal>
              <FadeReveal delay={0.2}>
                <p className="smm-lead">{lead}</p>
              </FadeReveal>

              <StaggerReveal delay={0.25} stagger={0.1} className="smm-benefits-list">
                {editableBenefits.map((item) => (
                  <StaggerChild key={item.title}>
                    <div className="smm-benefit-item">
                      <div className="smm-benefit-icon">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </StaggerChild>
                ))}
              </StaggerReveal>

              <FadeReveal delay={0.5}>
                <Link to="/services/social-media-management" className="btn-red smm-cta">
                  {smmContent.cta_label || 'সোশ্যাল মিডিয়া প্যাকেজ দেখুন'} <ArrowRight size={16} />
                </Link>
              </FadeReveal>
            </div>
          </SlideReveal>

          <SlideReveal from="right" delay={0.2}>
            <BlurReveal delay={0.3}>
              <div className="smm-visuals" aria-label="Social media management deliverables">
                <div className="smm-panel-header">
                  <span>{smmContent.board_title || 'মান্থলি গ্রোথ রোডম্যাপ'}</span>
                  <strong className="smm-status-badge">{smmContent.status || 'পাবলিশিংয়ের জন্য প্রস্তুত'}</strong>
                </div>
                <div className="smm-metrics-grid">
                  <div className="smm-metric-item">
                    <small>{metrics.left_label || 'ক্রিয়েটিভ কনটেন্ট'}</small>
                    <strong>{metrics.left_value || '৩০+'}</strong>
                    <span>{metrics.left_note || 'পোস্ট, স্টোরি ও রিলস'}</span>
                  </div>
                  <div className="smm-metric-item">
                    <small>{metrics.right_label || 'প্ল্যাটফর্ম সাপোর্ট'}</small>
                    <strong>{metrics.right_value || '৩+'}</strong>
                    <span>{metrics.right_note || 'Facebook, Instagram, LinkedIn'}</span>
                  </div>
                </div>
                <div className="smm-calendar-card">
                  {calendarDays.map(({ day, done }) => (
                    <div className={done ? 'is-ready' : 'is-pending'} key={day}>
                      <span>{day}</span>
                      {done
                        ? <CheckCircle size={13} />
                        : <Clock size={13} className="pending-icon" />
                      }
                    </div>
                  ))}
                </div>
                <div className="smm-note">
                  <strong>অন্তর্ভুক্ত:</strong> {smmContent.included || 'মাসিক কনটেন্ট ক্যালেন্ডার, ব্র্যান্ডেড টেমপ্লেট, শর্ট-ফর্ম ভিডিও/রিলস, এনগেজিং ক্যাপশন, হ্যাশট্যাগ ও অ্যানালিটিক্স।'}
                </div>
              </div>
            </BlurReveal>
          </SlideReveal>
        </div>
      </div>
    </section>
  );
};

export default SmmHighlight;
