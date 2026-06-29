import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const PolicyLayout = ({ title, seoDescription, lastUpdated, children }) => (
  <div className="policy-page-shell">
    <SEO title={`${title} | CreatifyBD`} description={seoDescription} />
    <Navbar />
    <div className="container" style={{ maxWidth: '780px', margin: '0 auto', padding: '8rem 1.5rem 6rem' }}>
      <div className="policy-header">
        <h1>{title}</h1>
        <p className="last-updated">Last updated: {lastUpdated}</p>
      </div>
      <div className="policy-body">{children}</div>
    </div>
    <Footer />
    <style>{`
      .policy-page-shell {
        min-height: 100vh;
        background: var(--charcoal, #0d0e12);
        color: var(--ink, #ffffff);
      }

      .policy-header {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .policy-header h1 {
        font-size: clamp(2rem, 4vw, 2.8rem);
        font-weight: 900;
        color: #ffffff;
        margin-bottom: 0.5rem;
      }
      .last-updated {
        font-size: 0.85rem;
        color: #888d96;
      }
      .policy-body h2 {
        font-size: 1.3rem;
        font-weight: 800;
        color: #ffffff;
        margin: 2.5rem 0 1rem;
      }
      .policy-body p, .policy-body li {
        color: #c8cacf;
        font-size: 0.95rem;
        line-height: 1.7;
        margin-bottom: 0.75rem;
      }
      .policy-body ul {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
      }
      .policy-body a {
        color: var(--red);
        text-decoration: underline;
      }
      .policy-body strong {
        color: #ffffff;
        font-weight: 700;
      }
    `}</style>
  </div>
);

export const PrivacyPolicyPage = () => (
  <PolicyLayout
    title="Privacy Policy"
    seoDescription="CreatifyBD's privacy policy — how we collect, use, and protect your personal data."
    lastUpdated="June 2025"
  >
    <p>CreatifyBD ("we", "us", or "our") operates <strong>creatifybd.com</strong>. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website or engage our services.</p>

    <h2>1. Information We Collect</h2>
    <p>We collect the following categories of personal data:</p>
    <ul>
      <li>Contact details you submit (name, email, phone, company name, country).</li>
      <li>Order intake requirements and project briefs you provide to us.</li>
      <li>Payment proof screenshots and transaction reference IDs you voluntarily submit.</li>
      <li>Website analytics data (page views, session duration) collected via Firebase Analytics.</li>
    </ul>

    <h2>2. How We Use Your Data</h2>
    <ul>
      <li>To process your project orders and communicate delivery updates.</li>
      <li>To verify manual payment transactions linked to your order records.</li>
      <li>To improve our website and service communication quality.</li>
      <li>To send service confirmations and order status notifications via email.</li>
    </ul>

    <h2>3. Data Sharing</h2>
    <p>We <strong>do not sell</strong> your personal data to third parties. We may share data with trusted platforms (Firebase, Google Workspace) solely for operational purposes under strict data protection terms.</p>

    <h2>4. Data Retention</h2>
    <p>We retain your order data for up to 3 years for accounting and dispute resolution purposes. You may request deletion of your personal data by contacting us at <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a>.</p>

    <h2>5. Security</h2>
    <p>Your data is stored in Google Firebase with enterprise-grade encryption. We apply security rules to restrict unauthorized access to order documents and uploaded files.</p>

    <h2>6. Your Rights</h2>
    <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, email us at <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a>.</p>

    <h2>7. Contact</h2>
    <p>For any privacy concerns, contact us at <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a> or via our <a href="/contact">contact page</a>.</p>
  </PolicyLayout>
);

export const TermsPage = () => (
  <PolicyLayout
    title="Terms of Service"
    seoDescription="Read CreatifyBD's terms of service — usage rules, payment obligations, and intellectual property rights."
    lastUpdated="June 2025"
  >
    <p>By accessing CreatifyBD's website or placing an order, you agree to these Terms of Service. Please read them carefully.</p>

    <h2>1. Service Agreement</h2>
    <p>CreatifyBD provides creative services including social media management, graphic design, video editing, and website design. All services are described in the specific gig packages at time of purchase.</p>

    <h2>2. Payment Terms</h2>
    <ul>
      <li>All prices are listed in USD.</li>
      <li>Payments are made manually via Payoneer or DBBL Bank Transfer.</li>
      <li>Production begins only after payment verification is confirmed by our admin team.</li>
      <li>Payment proofs must be submitted via the payment verification form within 3 business days of order creation.</li>
    </ul>

    <h2>3. Delivery Timelines</h2>
    <p>Delivery timelines stated in each package are business day estimates and begin upon verified payment and completed intake form submission. Delays caused by missing client information will pause the delivery clock.</p>

    <h2>4. Intellectual Property</h2>
    <p>Upon full payment and project completion, the client receives full commercial ownership of the delivered creative assets. CreatifyBD reserves the right to showcase anonymized samples in our portfolio unless the client explicitly opts out during order submission.</p>

    <h2>5. Client Obligations</h2>
    <ul>
      <li>Provide accurate and complete project requirements during the intake form.</li>
      <li>Respond to review and approval requests within 5 business days to avoid delivery delays.</li>
      <li>Ensure all provided assets (logos, images, text) do not violate copyright laws.</li>
    </ul>

    <h2>6. Dispute Resolution</h2>
    <p>If you are unsatisfied with a delivery, please first submit a revision request. Refund disputes must be raised within 7 days of final delivery. See our <a href="/refund-policy">Refund Policy</a> for full terms.</p>

    <h2>7. Governing Law</h2>
    <p>These terms are governed by the laws of Bangladesh. Any disputes will be handled through good-faith negotiation first.</p>
  </PolicyLayout>
);

export const RefundPolicyPage = () => (
  <PolicyLayout
    title="Refund Policy"
    seoDescription="CreatifyBD refund policy — when refunds apply, how they're processed, and project cancellation terms."
    lastUpdated="June 2025"
  >
    <p>We are committed to delivering exceptional creative work. This Refund Policy outlines when and how refunds are issued.</p>

    <h2>1. Eligible Refund Scenarios</h2>
    <ul>
      <li><strong>Order not started:</strong> If you cancel within 24 hours of payment verification and production has not begun, you are eligible for a full refund.</li>
      <li><strong>Major non-delivery:</strong> If CreatifyBD fails to deliver your project within 2x the stated package delivery time with no reasonable explanation, you are eligible for a full refund.</li>
      <li><strong>Significant quality departure:</strong> If final delivered files do not match the agreed service scope after revisions have been exhausted, a partial refund may be issued at our discretion.</li>
    </ul>

    <h2>2. Non-Refundable Scenarios</h2>
    <ul>
      <li>You change your mind after production begins.</li>
      <li>The project is fully delivered and accepted by the client.</li>
      <li>Delays caused by late or missing client requirements.</li>
      <li>Custom design concepts already revealed.</li>
    </ul>

    <h2>3. Refund Process</h2>
    <p>All approved refunds are returned via the same manual payment method used during checkout (Payoneer or DBBL Bank Transfer). Refunds are processed within 5–10 business days.</p>

    <h2>4. Requesting a Refund</h2>
    <p>To initiate a refund request, email <a href="mailto:hello@creatifybd.com">hello@creatifybd.com</a> with your Order ID and a clear description of your concern. We aim to respond within 2 business days.</p>

    <h2>5. Chargebacks</h2>
    <p>Initiating a chargeback via your bank without first contacting CreatifyBD support is considered a breach of these terms. We reserve the right to dispute illegitimate chargebacks with full evidence of delivery.</p>
  </PolicyLayout>
);

export const RevisionPolicyPage = () => (
  <PolicyLayout
    title="Revision Policy"
    seoDescription="CreatifyBD revision policy — what's included, how to request changes, and fair use guidelines."
    lastUpdated="June 2025"
  >
    <p>We believe great creative work is built through collaboration. Our revision policy ensures you get results you're proud to publish.</p>

    <h2>1. Revision Allocations</h2>
    <p>Each package includes a defined number of revision rounds as specified in the package deliverables. Revisions are counted per round (one batch of feedback = one revision round).</p>

    <h2>2. What Qualifies as a Revision</h2>
    <ul>
      <li>Color or typography adjustments</li>
      <li>Text content corrections (spelling, copy updates)</li>
      <li>Layout spacing and alignment modifications</li>
      <li>Minor image substitutions within the same concept</li>
    </ul>

    <h2>3. What Does NOT Qualify as a Revision</h2>
    <ul>
      <li>Completely changing the design concept after approval</li>
      <li>Requesting a different service scope than what was purchased</li>
      <li>Changing the video topic or script after editing has been completed</li>
      <li>Adding new elements not listed in the original requirements</li>
    </ul>

    <h2>4. Unlimited Revision Packages</h2>
    <p>Premium packages marked "Unlimited Revisions" cover unlimited rounds of the qualifying revision types defined above, during the active project window (not after final delivery acceptance).</p>

    <h2>5. How to Submit Revisions</h2>
    <p>Log into the <a href="/client/orders">Client Order Portal</a> using your email and Order ID. Use the "Request Revision" button on your order detail page to submit written revision instructions clearly.</p>

    <h2>6. Revision Turnaround Time</h2>
    <p>Standard revision rounds are completed within 2–4 business days. Complex design overhauls may take longer and will be communicated directly.</p>
  </PolicyLayout>
);

export default PrivacyPolicyPage;
