import { describe, expect, it } from 'vitest';
import release from '../data/publishedRelease.json';
import { validateRelease, normalizeLegacyContent } from '../data/releaseSchema';
import { normalizePhone, validateInquiry } from '../utils/inquiry';
import { offerWhatsAppLink, formatPrice } from '../data/offers';

describe('Publication safeguards', () => {
  it('accepts the complete approved release', () => expect(validateRelease(release)).toEqual([]));
  it.each(['title', 'accent', 'desc'])('rejects old English hero %s', field => {
    const draft = structuredClone(release); draft.content.hero[field] = 'Your growth partner';
    expect(validateRelease(draft).join(' ')).toContain(`hero.${field}`);
  });
  it('rejects private settings, duplicate IDs and nonnumeric offer facts', () => {
    const draft = structuredClone(release);
    draft.site.api_key = 'never-public'; draft.offers[1].id = draft.offers[0].id; draft.offers[0].amountBDT = '৫,০০০';
    const errors = validateRelease(draft).join(' ');
    expect(errors).toContain('private field'); expect(errors).toContain('duplicate ID'); expect(errors).toContain('amountBDT');
  });
  it('requires client permission and review evidence', () => {
    const draft = structuredClone(release); draft.portfolio[0].workType = 'client';
    draft.reviews = [{ id: 'unsupported-review', clientName: 'ক্লায়েন্ট', reviewText: 'দারুণ কাজ', published: true }];
    const errors = validateRelease(draft).join(' ');
    expect(errors).toContain('client publication permission'); expect(errors).toContain('review evidence');
  });
  it('migrates legacy keys without mutating the source or retaining version metadata', () => {
    const old = { about_trust: { lead: 'আমাদের কথা', ceo_note: 'আপনার প্রয়োজন আগে' }, version: 1 };
    expect(normalizeLegacyContent(old)).toEqual({ about_trust: { subtitle: 'আমাদের কথা', ceo_quote: 'আপনার প্রয়োজন আগে' } });
    expect(old.about_trust.lead).toBe('আমাদের কথা');
  });
  it('uses the published amount and name in each offer inquiry', () => {
    for (const offer of release.offers) {
      const message = new URL(offerWhatsAppLink(offer)).searchParams.get('text');
      expect(message).toContain(offer.name); expect(message).toContain(formatPrice(offer.amountBDT));
    }
  });
});
describe('Phone validation', () => {
  it('normalizes Bengali digits and common separators without inventing digits', () => {
    expect(normalizePhone('+৮৮০ (১৭১২)-৩৪৫৬৭৮')).toBe('+8801712345678');
    expect(validateInquiry({ name: 'আলিফ', phone: '০১৭১২-৩৪৫৬৭৮', message: 'আমাদের ডিজাইন প্রয়োজন।' })).toEqual({});
    expect(validateInquiry({ name: 'আলিফ', phone: 'call me', message: 'আমাদের ডিজাইন প্রয়োজন।' })).toHaveProperty('phone');
  });
});
