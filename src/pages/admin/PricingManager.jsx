import React, { useEffect, useRef, useState } from 'react';
import { collection, doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import publishedRelease from '../../data/publishedRelease.json';
import toast from 'react-hot-toast';

export default function PricingManager() {
  const { isEditor } = useAuth();
  const [plans, setPlans] = useState(publishedRelease.offers.map(offer => ({ ...offer, revision: 0 })));
  const [saving, setSaving] = useState('');
  const dirty = useRef(new Set());
  useEffect(() => onSnapshot(collection(db, 'pricing'), snapshot => {
    const stored = new Map(snapshot.docs.map(item => [item.id, item.data()]));
    setPlans(previous => publishedRelease.offers.map(offer => {
      if (dirty.current.has(offer.id)) return previous.find(plan => plan.id === offer.id);
      const data = stored.get(offer.id);
      return data ? { ...offer, name: data.tier || data.name || offer.name, audience: data.desc || data.audience || offer.audience, amountBDT: Number(data.rawPrice ?? data.amountBDT ?? offer.amountBDT), posters: Number(data.posters ?? offer.posters), videos: Number(data.videos ?? offer.videos), platforms: Number(data.platforms ?? offer.platforms), features: data.features || offer.features, revision: data.revision || 0 } : { ...offer, revision: 0 };
    }));
  }, () => toast.error('Pricing drafts could not be loaded.')), []);
  const update = (id, key, value) => { dirty.current.add(id); setPlans(previous => previous.map(plan => plan.id === id ? { ...plan, [key]: value } : plan)); };
  const save = async plan => {
    if (!isEditor) return;
    for (const key of ['amountBDT', 'posters', 'videos', 'platforms']) if (!Number.isSafeInteger(plan[key]) || plan[key] < 1) { toast.error('মূল্য ও কাজের সংখ্যা সঠিকভাবে লিখুন।'); return; }
    if (!/[\u0980-\u09ff]/.test(plan.name)) { toast.error('বাংলায় প্যাকেজের নাম লিখুন।'); return; }
    setSaving(plan.id);
    try {
      const ref = doc(db, 'pricing', plan.id);
      await runTransaction(db, async transaction => {
        const snapshot = await transaction.get(ref);
        if ((snapshot.data()?.revision || 0) !== plan.revision) throw new Error('এই প্যাকেজে অন্য পরিবর্তন এসেছে। পাতাটি নতুন করে খুলে মিলিয়ে নিন।');
        transaction.set(ref, { ...plan, tier: plan.name, desc: plan.audience, rawPrice: plan.amountBDT, price: new Intl.NumberFormat('bn-BD').format(plan.amountBDT), period: '/মাস', category: 'social', hidden: false, published: true, revision: plan.revision + 1, updatedAt: serverTimestamp() }, { merge: true });
      });
      dirty.current.delete(plan.id);
      setPlans(previous => previous.map(item => item.id === plan.id ? { ...plan, revision: plan.revision + 1 } : item));
      toast.success('খসড়া রাখা হয়েছে। নতুন content release deploy হলে প্রকাশ পাবে।');
    } catch (error) { toast.error(error.message || 'খসড়া রাখা যায়নি।'); }
    finally { setSaving(''); }
  };
  return <div className="admin-content-wrap"><div className="admin-page-toolbar"><div><h1>মাসিক প্যাকেজ</h1><p>দাম ও পরিমাণ একবারই ঠিক করুন। Content release প্রকাশ হলে hero, pricing ও WhatsApp বার্তায় একই তথ্য যাবে।</p></div></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 24 }}>{plans.map(plan => <form key={plan.id} className="admin-card" onSubmit={event => { event.preventDefault(); save(plan); }} style={{ padding: 24, display: 'grid', gap: 16 }}>
    <label>প্যাকেজের নাম<input className="admin-input" value={plan.name} onChange={event => update(plan.id, 'name', event.target.value)} required disabled={!isEditor || Boolean(saving)} /></label>
    <label>কার জন্য<input className="admin-input" value={plan.audience} onChange={event => update(plan.id, 'audience', event.target.value)} required disabled={!isEditor || Boolean(saving)} /></label>
    {[['amountBDT', 'মাসিক মূল্য (টাকা)'], ['posters', 'পোস্টারের সংখ্যা'], ['videos', 'ভিডিও / রিলস'], ['platforms', 'প্ল্যাটফর্ম']].map(([key, label]) => <label key={key}>{label}<input className="admin-input" type="number" min="1" step="1" value={plan[key]} onChange={event => update(plan.id, key, Number(event.target.value))} required disabled={!isEditor || Boolean(saving)} /></label>)}
    <label>সুবিধাসমূহ (প্রতি লাইনে একটি)<textarea className="admin-input" rows={4} value={plan.features.join('\n')} onChange={event => update(plan.id, 'features', event.target.value.split('\n'))} disabled={!isEditor || Boolean(saving)} /></label>
    <button className="admin-btn-primary" type="submit" disabled={!isEditor || Boolean(saving)}>{saving === plan.id ? 'রাখা হচ্ছে…' : 'প্যাকেজের খসড়া রাখুন'}</button>
  </form>)}</div></div>;
}
