import React from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Lightbulb, PenTool, Rocket, CheckCircle, BarChart } from 'lucide-react';
import { FadeReveal, SlideReveal } from './MotionReveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { globalizeCopy, renderRichTitle } from '../utils/contentText';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const steps = [
  {
    num: '01',
    icon: <FileSearch size={26} />,
    title: 'Audit and brief',
    desc: 'We review your brand, competitors, and goals before proposing scope.'
  },
  {
    num: '02',
    icon: <Lightbulb size={26} />,
    title: 'Strategy and calendar',
    desc: 'We map the service plan, creative direction, and content calendar.'
  },
  {
    num: '03',
    icon: <PenTool size={26} />,
    title: 'Creative production',
    desc: 'Our specialists produce drafts with organized review checkpoints.'
  },
  {
    num: '04',
    icon: <CheckCircle size={26} />,
    title: 'Review and refine',
    desc: 'Client feedback is incorporated through structured revision rounds.'
  },
  {
    num: '05',
    icon: <Rocket size={26} />,
    title: 'Launch and improve',
    desc: 'Final assets are delivered with performance notes and recommendations.'
  }
];

const Process = ({ highlight = false, fullPage = false }) => {
  const { content } = useSettings();
  const processContent = content?.process || {};
  const editableSteps = Array.isArray(processContent.steps) && processContent.steps.length
    ? processContent.steps.map((step, index) => ({ ...steps[index % steps.length], ...step }))
    : steps;
  const title = globalizeCopy(processContent.title, 'A clear process from first brief to <span class="text-red">final delivery</span>');
  const subtitle = globalizeCopy(
    processContent.subtitle,
    'Every project follows a visible workflow, so you know what is happening, what needs approval, and when deliverables are due.'
  );

  // Timeline animation
  const { scrollYProgress } = useScroll();
  const timelineWidth = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section className={`section process-section ${fullPage ? 'full-page-section' : ''}`} id="process">
      <div className="container">
        {!fullPage && (
          <div className="process-header">
            <FadeReveal>
              <div className="eyebrow">{processContent.eyebrow || 'Our Workflow'}</div>
            </FadeReveal>
            <SlideReveal delay={0.1}>
              <h2 className="section-h">{renderRichTitle(title)}</h2>
            </SlideReveal>
            <FadeReveal delay={0.2}>
              <p className="section-sub">{subtitle}</p>
            </FadeReveal>
          </div>
        )}

        {/* Keep the native CSS grid — animate each article directly */}
        <div className="process-grid-light" role="list" aria-label="Workflow steps">
          {/* Timeline connector line */}
          <motion.div 
            className="process-timeline-line"
            style={{ scaleX: timelineWidth }}
            initial={{ scaleX: 0 }}
            aria-hidden="true"
          />
          
          {editableSteps.map((step, index) => (
            <motion.article
              key={step.num}
              className="process-step-card"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.75, ease: EASE_EXPO, delay: index * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.28, ease: EASE_EXPO } }}
              role="listitem"
              aria-label={`Step ${step.num}: ${step.title}`}
            >
              <div className="process-step-top">
                <span>{step.num}</span>
                <div>{step.icon}</div>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.article>
          ))}
        </div>

        {highlight && (
          <FadeReveal delay={0.3}>
            <div className="section-action">
              <Link to="/process" className="btn-huge-red">Explore Our Full Workflow -&gt;</Link>
            </div>
          </FadeReveal>
        )}
      </div>
    </section>
  );
};

export default Process;
