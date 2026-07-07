import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import { getGigBySlug, categories } from '../../data/gigs';
import { db, storage } from '../../firebase/config';
import { collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowRight, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderStartPage = () => {
  const { gigSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // All hooks declared before any conditional return (Rules of Hooks)
  const [gigOverride, setGigOverride] = useState({});
  const [overrideLoading, setOverrideLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [requirementFile, setRequirementFile] = useState(null);
  const [clientDetails, setClientDetails] = useState({
    fullName: '', email: '', phone: '', companyName: '', country: '', websiteLinks: ''
  });
  const [genericRequirements, setGenericRequirements] = useState({
    projectGoal: '', brandDetails: '', targetAudience: '', stylePreferences: '',
    requiredText: '', deadline: '', additionalInstructions: ''
  });
  const [smmRequirements, setSmmRequirements] = useState({
    platforms: '', currentSocialLinks: '', postingFrequency: '',
    brandGuidelinesNote: '', monthlyGoal: '', competitors: '', accessMethodNote: ''
  });
  const [logoRequirements, setLogoRequirements] = useState({
    logoText: '', slogan: '', preferredColors: '', stylePreference: '',
    logoExamples: '', usageNeeds: ''
  });
  const [thumbnailRequirements, setThumbnailRequirements] = useState({
    videoTitle: '', topic: '', textForThumbnail: '', styleReferences: ''
  });
  const [websiteRequirements, setWebsiteRequirements] = useState({
    businessType: '', pagesNeeded: '', contentAvailability: 'ready',
    competitorWebsites: '', hostingStatus: '', featuresNeeded: ''
  });

  const baseGig = getGigBySlug(gigSlug);

  useEffect(() => {
    if (!baseGig) return;
    const fetchOverride = async () => {
      try {
        const snap = await getDoc(doc(db, 'gig_overrides', baseGig.id));
        if (snap.exists()) setGigOverride(snap.data());
      } catch {
        // silent
      } finally {
        setOverrideLoading(false);
      }
    };
    fetchOverride();
  }, [baseGig?.id]);

  const gig = useMemo(() => {
    if (!baseGig) return null;
    const merged = { ...baseGig, ...gigOverride };
    if (merged.startingPrice && merged.packages?.basic) {
      merged.packages.basic = { ...merged.packages.basic, price: Number(merged.startingPrice) };
    }
    return merged;
  }, [baseGig, gigOverride]);

  const selectedPackage = searchParams.get('package') || 'basic';

  // Conditional return after all hooks
  if (!baseGig) return <Navigate to="/gigs" replace />;

  const p = gig?.packages?.[selectedPackage] || gig?.packages?.basic || {};
  const categoryName = categories[gig?.category]?.name || gig?.category;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { toast.error('File must be smaller than 10MB'); return; }
      setRequirementFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientDetails.fullName || !clientDetails.email || !clientDetails.phone) {
      toast.error('Please fill in all contact information fields.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Initializing your order...');
    try {
      let attachmentUrl = '', attachmentName = '';
      if (requirementFile) {
        setFileUploading(true);
        const fileRef = ref(storage, `order-requirements/${Date.now()}_${requirementFile.name}`);
        await uploadBytes(fileRef, requirementFile);
        attachmentUrl = await getDownloadURL(fileRef);
        attachmentName = requirementFile.name;
        setFileUploading(false);
      }

      let catSpecific = {};
      if (gig.category === 'social-media-management') catSpecific = smmRequirements;
      else if (gig.slug.includes('logo')) catSpecific = logoRequirements;
      else if (gig.slug.includes('thumbnail')) catSpecific = thumbnailRequirements;
      else if (gig.category === 'website-design') catSpecific = websiteRequirements;

      const tokenBytes = new Uint8Array(18);
      crypto.getRandomValues(tokenBytes);
      const clientAccessToken = Array.from(tokenBytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
      const publicOrderId = `CBD-${Math.floor(1000000 + Math.random() * 9000000)}`;

      const orderRef = doc(collection(db, 'orders'), clientAccessToken);
      await setDoc(orderRef, {
        gigId: gig.id, gigSlug: gig.slug, gigTitle: gig.title,
        selectedPackage, price: p.price, deliveryTime: p.deliveryTime,
        status: 'payment_pending', publicOrderId, clientAccessToken,
        clientInfo: { ...clientDetails, createdAt: new Date() },
        requirements: { ...genericRequirements, ...catSpecific, attachmentUrl, attachmentName },
        drafts: [], deliveries: [], internalNotes: '',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });

      toast.success('Order created! Please complete payment.', { id: toastId });
      navigate(`/payment?orderId=${clientAccessToken}&publicOrderId=${publicOrderId}&amount=${p.price}&service=${encodeURIComponent(gig.title)}&email=${encodeURIComponent(clientDetails.email)}`);
    } catch (err) {
      toast.error('Failed to start order. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-start-page">
      <SEO
        title={`Start Order: ${gig.shortTitle} | CreatifyBD`}
        description="Fill in your project details and intake requirements to launch your project."
        noIndex={true}
      />
      <Navbar />
      <div className="container" style={{ padding: '6rem 1rem' }}>
        <div className="order-flow-layout">
          <div className="order-form-column">
            <div className="order-form-card">
              <h2 className="form-title">Submit Project <span className="red">Requirements</span></h2>
              <p className="form-sub-intro">Tell us about your project goal. Our team uses these details as the strategy blueprint.</p>
              <form onSubmit={handleSubmit} className="intake-form">

                <div className="form-section-block">
                  <h3 className="section-title-label">01. Contact Information</h3>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input id="fullName" type="text" required className="luxury-input" placeholder="John Doe"
                        value={clientDetails.fullName} onChange={e => setClientDetails({...clientDetails, fullName: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" type="email" required className="luxury-input" placeholder="john@example.com"
                        value={clientDetails.email} onChange={e => setClientDetails({...clientDetails, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="phone">WhatsApp / Phone *</label>
                      <input id="phone" type="tel" required className="luxury-input" placeholder="+1 (555) 019-2834"
                        value={clientDetails.phone} onChange={e => setClientDetails({...clientDetails, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="companyName">Company / Business Name</label>
                      <input id="companyName" type="text" className="luxury-input" placeholder="My Business Ltd."
                        value={clientDetails.companyName} onChange={e => setClientDetails({...clientDetails, companyName: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <input id="country" type="text" required className="luxury-input" placeholder="e.g. United Kingdom, Singapore"
                        value={clientDetails.country} onChange={e => setClientDetails({...clientDetails, country: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="websiteLinks">Website / Social Links</label>
                      <input id="websiteLinks" type="text" className="luxury-input" placeholder="https://mywebsite.com"
                        value={clientDetails.websiteLinks} onChange={e => setClientDetails({...clientDetails, websiteLinks: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="section-title-label">02. Project Strategy & Details</h3>

                  {gig.category === 'social-media-management' && (
                    <div className="cat-inputs-wrapper">
                      <div className="form-group">
                        <label htmlFor="smm-platforms">Which social platforms do you want us to manage? *</label>
                        <input id="smm-platforms" type="text" required className="luxury-input" placeholder="e.g. Facebook & Instagram, LinkedIn"
                          value={smmRequirements.platforms} onChange={e => setSmmRequirements({...smmRequirements, platforms: e.target.value})} />
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="smm-frequency">Post Frequency Preference *</label>
                          <input id="smm-frequency" type="text" required className="luxury-input" placeholder="e.g. 3 posts per week"
                            value={smmRequirements.postingFrequency} onChange={e => setSmmRequirements({...smmRequirements, postingFrequency: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="smm-goals">Primary monthly goal? *</label>
                          <input id="smm-goals" type="text" required className="luxury-input" placeholder="e.g. Brand awareness, Lead generation"
                            value={smmRequirements.monthlyGoal} onChange={e => setSmmRequirements({...smmRequirements, monthlyGoal: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="smm-competitors">Competitor accounts or visual references</label>
                        <textarea id="smm-competitors" className="luxury-input" style={{ height: '80px' }} placeholder="Provide page links or competitor usernames..."
                          value={smmRequirements.competitors} onChange={e => setSmmRequirements({...smmRequirements, competitors: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {gig.slug.includes('logo') && (
                    <div className="cat-inputs-wrapper">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="logo-text">Logo Text / Business Name *</label>
                          <input id="logo-text" type="text" required className="luxury-input" placeholder="e.g. Creatify"
                            value={logoRequirements.logoText} onChange={e => setLogoRequirements({...logoRequirements, logoText: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="logo-slogan">Logo Tagline / Slogan</label>
                          <input id="logo-slogan" type="text" className="luxury-input" placeholder="e.g. Design. Strategy. Growth."
                            value={logoRequirements.slogan} onChange={e => setLogoRequirements({...logoRequirements, slogan: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="logo-colors">Preferred Color Palette *</label>
                          <input id="logo-colors" type="text" required className="luxury-input" placeholder="e.g. Deep crimson red, charcoal black"
                            value={logoRequirements.preferredColors} onChange={e => setLogoRequirements({...logoRequirements, preferredColors: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="logo-style">Preferred Logo Style *</label>
                          <input id="logo-style" type="text" required className="luxury-input" placeholder="e.g. Minimalist, Vector Emblem"
                            value={logoRequirements.stylePreference} onChange={e => setLogoRequirements({...logoRequirements, stylePreference: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}

                  {gig.slug.includes('thumbnail') && (
                    <div className="cat-inputs-wrapper">
                      <div className="form-group">
                        <label htmlFor="thumb-title">Video Title / Hook Text *</label>
                        <input id="thumb-title" type="text" required className="luxury-input" placeholder="e.g. 5 MISTAKES that destroy startups"
                          value={thumbnailRequirements.videoTitle} onChange={e => setThumbnailRequirements({...thumbnailRequirements, videoTitle: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="thumb-topic">Video Topic / Theme *</label>
                        <input id="thumb-topic" type="text" required className="luxury-input" placeholder="e.g. Business coaching, tech review"
                          value={thumbnailRequirements.topic} onChange={e => setThumbnailRequirements({...thumbnailRequirements, topic: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {gig.category === 'website-design' && (
                    <div className="cat-inputs-wrapper">
                      <div className="form-row-2">
                        <div className="form-group">
                          <label htmlFor="web-biz-type">Type of Business / Services Offered *</label>
                          <input id="web-biz-type" type="text" required className="luxury-input" placeholder="e.g. Real Estate Agency, Dental Clinic"
                            value={websiteRequirements.businessType} onChange={e => setWebsiteRequirements({...websiteRequirements, businessType: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="web-pages">Required Pages List *</label>
                          <input id="web-pages" type="text" required className="luxury-input" placeholder="e.g. Home, Services, Pricing, About, Contact"
                            value={websiteRequirements.pagesNeeded} onChange={e => setWebsiteRequirements({...websiteRequirements, pagesNeeded: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="web-content">Content / Copywriting Availability *</label>
                        <select id="web-content" className="luxury-input" value={websiteRequirements.contentAvailability}
                          onChange={e => setWebsiteRequirements({...websiteRequirements, contentAvailability: e.target.value})}>
                          <option value="ready">I have final copy ready to insert</option>
                          <option value="draft">I have draft notes (needs copy polishing)</option>
                          <option value="need-help">No copywriting (I need CreatifyBD to write the text)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label htmlFor="proj-goal">What is the main goal of this project? *</label>
                    <textarea id="proj-goal" required className="luxury-input" style={{ height: '90px' }}
                      placeholder="e.g. We want to design a premium catalog to showcase homes to premium Australian investors."
                      value={genericRequirements.projectGoal} onChange={e => setGenericRequirements({...genericRequirements, projectGoal: e.target.value})} />
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="proj-audience">Target Audience Description *</label>
                      <input id="proj-audience" type="text" required className="luxury-input" placeholder="e.g. Business owners, age 30-50"
                        value={genericRequirements.targetAudience} onChange={e => setGenericRequirements({...genericRequirements, targetAudience: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="proj-deadline">Desired Deadline (Optional)</label>
                      <input id="proj-deadline" type="date" className="luxury-input"
                        value={genericRequirements.deadline} onChange={e => setGenericRequirements({...genericRequirements, deadline: e.target.value})}
                        min={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                </div>

                <div className="form-section-block">
                  <h3 className="section-title-label">03. Reference Assets & Files</h3>
                  <div className="form-group">
                    <label>Upload Brand Guidelines, Logos, or Reference Files (Max 10MB)</label>
                    <div className="file-upload-wrapper">
                      <input type="file" id="requirement-file" onChange={handleFileChange} className="file-input" />
                      <label htmlFor="requirement-file" className="file-upload-label">
                        <Upload size={22} />
                        <span>{requirementFile ? requirementFile.name : 'Drag & drop or browse files (ZIP, PDF, DOC, JPG, PNG)'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-huge-red w-full justify-center"
                  style={{ height: '54px', fontSize: '1.05rem', fontWeight: '800' }}>
                  {loading
                    ? <>Creating Order... <Loader2 size={20} className="animate-spin" style={{ marginLeft: '1rem' }} /></>
                    : <>Submit Requirements & Continue <ArrowRight size={18} style={{ marginLeft: '1rem' }} /></>
                  }
                </button>
                <p className="onboarding-notice">
                  By continuing, you will submit these requirements to CreatifyBD. Your order state will become "Payment Pending" and you will be routed to the manual payment screen.
                </p>
              </form>
            </div>
          </div>

          <div className="order-summary-column">
            <div className="order-summary-sidebar">
              <h3 className="sidebar-h">Order Summary</h3>
              <div className="summary-service-box">
                <div className="service-thumb-mini">
                  <img src={gig.galleryImages[0]} alt="" />
                </div>
                <div className="service-meta-mini">
                  <h5>{gig.shortTitle}</h5>
                  <span className="cat-lbl">{categoryName}</span>
                </div>
              </div>
              <div className="summary-details-pricing">
                <div className="price-row-item">
                  <span className="lbl">Selected Tier:</span>
                  <span className="val" style={{ textTransform: 'capitalize' }}>{selectedPackage}</span>
                </div>
                <div className="price-row-item">
                  <span className="lbl">Package Name:</span>
                  <span className="val">{p.name}</span>
                </div>
                <div className="price-row-item">
                  <span className="lbl">Delivery Duration:</span>
                  <span className="val">{p.deliveryTime} Days</span>
                </div>
                <div className="price-row-item">
                  <span className="lbl">Included Revisions:</span>
                  <span className="val">{p.revisions === 10 ? 'Unlimited' : p.revisions}</span>
                </div>
                <div className="price-total-divider" />
                <div className="price-row-item total">
                  <span className="lbl">Total Price:</span>
                  <span className="val">${p.price} USD</span>
                </div>
              </div>
              <div className="guarantees-list">
                <div className="g-item"><CheckCircle2 size={15} /><span>Verified Escrow Order Lock</span></div>
                <div className="g-item"><CheckCircle2 size={15} /><span>Global Cost-Advantage Execution</span></div>
                <div className="g-item"><CheckCircle2 size={15} /><span>Dedicated PM Channel</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .order-flow-layout { display: grid; grid-template-columns: 1fr 360px; gap: 3.5rem; max-width: 1200px; margin: 0 auto; align-items: start; }
        @media (max-width: 968px) { .order-flow-layout { grid-template-columns: 1fr; } .order-summary-column { order: -1; } }
        .order-form-card { background: #060608; border: 1px solid rgba(232,25,44,0.15); border-radius: 16px; padding: 3rem; position: relative; overflow: hidden; }
        .order-form-card::before { content: ''; position: absolute; width: 700px; height: 600px; border-radius: 50%; top: -200px; left: 50%; transform: translateX(-50%); background: radial-gradient(circle, rgba(232,25,44,0.16) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .order-form-card > * { position: relative; z-index: 1; }
        @media (max-width: 600px) { .order-form-card { padding: 1.5rem; } }
        .form-title { font-size: 2rem; font-weight: 900; color: white; margin-bottom: 0.5rem; }
        .form-sub-intro { color: #777; font-size: 0.95rem; margin-bottom: 3rem; line-height: 1.5; }
        .form-section-block { margin-bottom: 3rem; padding-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .section-title-label { font-size: 1.15rem; font-weight: 800; color: white; margin-bottom: 1.5rem; letter-spacing: 0.5px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
        @media (max-width: 600px) { .form-row-2 { grid-template-columns: 1fr; margin-bottom: 0; } }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
        .luxury-input { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.875rem 1rem; color: white; font-size: 0.95rem; outline: none; transition: all 0.2s; }
        .luxury-input:focus { border-color: var(--red); background: rgba(255,255,255,0.05); }
        textarea.luxury-input { resize: vertical; }
        .file-upload-wrapper { position: relative; width: 100%; }
        .file-input { position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .file-upload-label { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 2.5rem; border: 2px dashed rgba(255,255,255,0.1); border-radius: 8px; color: #777; cursor: pointer; transition: all 0.2s; text-align: center; }
        .file-upload-label span { font-size: 0.85rem; }
        .file-upload-label:hover { border-color: var(--red); color: var(--red); }
        .onboarding-notice { font-size: 0.75rem; color: #666; line-height: 1.5; text-align: center; margin-top: 1.5rem; }
        .order-summary-sidebar { background: #060608; border: 1px solid rgba(232,25,44,0.15); border-radius: 16px; padding: 2rem; position: sticky; top: 110px; box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 40px rgba(232,25,44,0.06); position: relative; overflow: hidden; }
        .order-summary-sidebar::before { content: ''; position: absolute; width: 300px; height: 300px; border-radius: 50%; top: -80px; right: -50px; background: radial-gradient(circle, rgba(232,25,44,0.16) 0%, transparent 65%); pointer-events: none; z-index: 0; }
        .order-summary-sidebar > * { position: relative; z-index: 1; }
        .sidebar-h { font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 1.5rem; }
        .summary-service-box { display: flex; gap: 1rem; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; }
        .service-thumb-mini { width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: #222; }
        .service-thumb-mini img { width: 100%; height: 100%; object-fit: cover; }
        .service-meta-mini h5 { font-size: 0.95rem; color: white; font-weight: 700; margin-bottom: 0.2rem; }
        .service-meta-mini .cat-lbl { font-size: 0.75rem; color: var(--red); font-weight: 700; text-transform: uppercase; }
        .summary-details-pricing { display: flex; flex-direction: column; gap: 0.75rem; }
        .price-row-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
        .price-row-item .lbl { color: #777; }
        .price-row-item .val { color: white; font-weight: 600; }
        .price-total-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0.5rem 0; }
        .price-row-item.total { font-size: 1.1rem; }
        .price-row-item.total .lbl { color: white; font-weight: 800; }
        .price-row-item.total .val { color: var(--red); font-weight: 800; }
        .guarantees-list { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.6rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; }
        .g-item { display: flex; align-items: center; gap: 0.5rem; color: #888; font-size: 0.8rem; }
        .g-item svg { color: #4caf50; }
      `}</style>
    </div>
  );
};

export default OrderStartPage;
