import React from 'react';
import { ArrowRight, CalendarCheck, CheckCircle, Clock, LineChart, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeReveal, SlideReveal, StaggerReveal, StaggerChild, BlurReveal } from './MotionReveal';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const benefits = [
  {
    icon: <CalendarCheck size={20} />,
    title: 'Done-for-you monthly calendar',
    desc: 'Post ideas, designs, captions, hashtags, and scheduling prepared before the month starts.'
  },
  {
    icon: <MessageSquareText size={20} />,
    title: 'Brand voice and community support',
    desc: 'Professional captions, customer-facing replies guidance, and consistent visual tone.'
  },
  {
    icon: <LineChart size={20} />,
    title: 'Performance reporting',
    desc: 'Monthly reach, engagement, content winners, and next-step recommendations.'
  }
];

const calendarDays = [
  { day: 'Mon', done: true },
  { day: 'Tue', done: true },
  { day: 'Wed', done: true },
  { day: 'Thu', done: true },
  { day: 'Fri', done: false },
  { day: 'Sat', done: false },
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
  const title = globalizeCopy(smmContent.title, 'Monthly social media management for international brands');
  const lead = globalizeCopy(
    smmContent.lead,
    'A dedicated creative workflow for brands that need consistent, polished social media without hiring a full in-house team.'
  );

  return (
    <section className="smm-highlight-section">
      <div className="container">
        <div className="smm-grid">
          <SlideReveal from="left">
            <div>
              <FadeReveal>
                <span className="eyebrow">{smmContent.eyebrow || 'Managed Social Media'}</span>
              </FadeReveal>
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
                <Link to="/services" className="btn-red smm-cta">
                  {smmContent.cta_label || 'Explore SMM Packages'} <ArrowRight size={16} />
                </Link>
              </FadeReveal>
            </div>
          </SlideReveal>

          <SlideReveal from="right" delay={0.2}>
            <BlurReveal delay={0.3}>
              <div className="smm-visuals" aria-label="Social media management deliverables">
                <div className="smm-panel-header">
                  <span>{smmContent.board_title || 'Monthly Growth Board'}</span>
                  <strong className="smm-status-badge">{smmContent.status || 'Ready for Review'}</strong>
                </div>
                <div className="smm-metrics-grid">
                  <div className="smm-metric-item">
                    <small>{metrics.left_label || 'Content pieces'}</small>
                    <strong>{metrics.left_value || '30'}</strong>
                    <span>{metrics.left_note || 'Posts, stories, reels'}</span>
                  </div>
                  <div className="smm-metric-item">
                    <small>{metrics.right_label || 'Platforms'}</small>
                    <strong>{metrics.right_value || '3'}</strong>
                    <span>{metrics.right_note || 'Instagram, Facebook, LinkedIn'}</span>
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
                  <strong>Included:</strong> {smmContent.included || 'content calendar, branded templates, short-form video direction, caption writing, scheduling support, and analytics.'}
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
