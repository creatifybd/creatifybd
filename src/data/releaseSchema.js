const bengali = /[\u0980-\u09ff]/;
const safeUrl = value => typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value));
const requiredSections = ['hero', 'about_trust', 'process', 'contact', 'visibility'];

export function validateRelease(release) {
  const errors = [];
  if (!release || typeof release !== 'object') return ['A complete release object is required.'];
  const fields = ['id', 'locale', 'schemaVersion', 'contentVersion', 'site', 'content', 'offers', 'offerNotes', 'services', 'portfolio', 'reviews', 'team'];
  if (Object.keys(release).some(key => !fields.includes(key))) errors.push('Unknown top-level release field.');
  if (!/^bn-[a-z0-9-]+$/.test(release.id || '')) errors.push('Use a stable bn- release ID.');
  if (release.locale !== 'bn-BD' || release.schemaVersion !== 1) errors.push('Only schema 1, bn-BD content can be published.');
  if (!Number.isSafeInteger(release.contentVersion) || release.contentVersion <= 0) errors.push('contentVersion must be a positive integer.');
  const publicSiteFields = ['site_name', 'logo_url', 'favicon_url', 'email', 'phone', 'whatsapp', 'address', 'primary_color', 'secondary_color', 'working_hours'];
  if (!release.site || Object.keys(release.site).some(key => !publicSiteFields.includes(key))) errors.push('Site settings contain an unknown or private field.');
  if (!safeUrl(release.site?.logo_url)) errors.push('A safe logo URL is required.');
  for (const field of ['primary_color', 'secondary_color']) if (!/^#[0-9a-f]{6}$/i.test(release.site?.[field] || '')) errors.push(`Invalid site.${field}.`);
  for (const section of requiredSections) if (!release.content?.[section]) errors.push(`Missing content.${section}.`);
  for (const [field, value] of Object.entries({
    'hero.title': release.content?.hero?.title, 'hero.accent': release.content?.hero?.accent,
    'hero.desc': release.content?.hero?.desc, 'about_trust.subtitle': release.content?.about_trust?.subtitle,
    'about_trust.ceo_quote': release.content?.about_trust?.ceo_quote, 'contact.heading': release.content?.contact?.heading,
  })) if (typeof value !== 'string' || !bengali.test(value)) errors.push(`${field} needs approved Bengali copy.`);
  const checkCopy = (value, field) => {
    if (typeof value === 'string' && value.trim() && !safeUrl(value) && !bengali.test(value)) errors.push(`${field} contains untranslated copy.`);
    else if (Array.isArray(value)) value.forEach((item, index) => checkCopy(item, `${field}.${index}`));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => checkCopy(item, `${field}.${key}`));
  };
  checkCopy(release.content, 'content');
  checkCopy(release.offerNotes, 'offerNotes');
  const checkIds = (items, group) => {
    if (!Array.isArray(items)) { errors.push(`${group} must be an array.`); return []; }
    const ids = new Set();
    for (const item of items) {
      if (!item?.id || !/^[A-Za-z0-9_-]+$/.test(item.id) || ids.has(item.id)) errors.push(`${group} contains a missing, invalid or duplicate ID.`);
      ids.add(item?.id);
    }
    return items.filter(item => item && typeof item === 'object');
  };
  const offers = checkIds(release.offers, 'offers');
  if (offers.length !== 3) errors.push('Exactly three social-media offers are required.');
  for (const offer of offers) {
    for (const field of ['amountBDT', 'posters', 'videos', 'platforms']) if (!Number.isSafeInteger(offer[field]) || offer[field] < 1) errors.push(`${offer.id}.${field} must be a positive integer.`);
    if (offer.billingPeriod !== 'month' || !bengali.test(offer.name || '') || !Array.isArray(offer.features)) errors.push(`${offer.id} has an invalid name, billing period or features.`);
    checkCopy(offer.features, `${offer.id}.features`);
    checkCopy(offer.audience, `${offer.id}.audience`);
  }
  const services = checkIds(release.services, 'services');
  const serviceIds = ['social-media-management', 'graphic-design', 'video-editing', 'website-design'];
  if (services.length !== serviceIds.length || serviceIds.some(id => !services.find(item => item.id === id))) errors.push('The four core service IDs must stay consistent.');
  for (const service of services) {
    if (!bengali.test(service.title || '') || !safeUrl(service.image) || !Array.isArray(service.deliverables)) errors.push(`${service.id} has invalid title, image or deliverables.`);
    for (const field of ['description', 'detail', 'deliverables']) checkCopy(service[field], `${service.id}.${field}`);
  }
  const portfolio = checkIds(release.portfolio, 'portfolio');
  for (const item of portfolio) {
    if (!bengali.test(item.title || '') || !safeUrl(item.image)) errors.push(`${item.id} needs a Bengali title and safe image URL.`);
    if (!['social', 'branding', 'packaging', 'web', 'video', 'apparel'].includes(item.category)) errors.push(`${item.id} has an unsupported category.`);
    if (!['sample', 'concept', 'client'].includes(item.workType)) errors.push(`${item.id} needs an explicit work type.`);
    if (item.workType === 'client' && !item.clientPermission) errors.push(`${item.id} needs confirmed client publication permission.`);
    for (const field of ['description', 'industry']) checkCopy(item[field], `${item.id}.${field}`);
    if (item.thumbnail && !safeUrl(item.thumbnail)) errors.push(`${item.id} has an unsafe thumbnail.`);
    if (item.srcSet && !item.srcSet.split(',').every(candidate => /^\S+ (360|640|1080)w$/.test(candidate.trim()) && safeUrl(candidate.trim().split(' ')[0]))) errors.push(`${item.id} has an invalid responsive image set.`);
  }
  const featured = portfolio.filter(item => Number.isInteger(item.featuredOrder));
  if (featured.length > 12 || new Set(featured.map(item => item.featuredOrder)).size !== featured.length) errors.push('Featured positions must be unique, with at most 12 items.');
  for (const review of checkIds(release.reviews, 'reviews')) if (!review.clientName || !review.reviewText || !/^https:\/\//.test(review.sourceUrl || '') || review.published !== true) errors.push(`${review.id} needs original review evidence before publication.`);
  for (const member of checkIds(release.team, 'team')) if (!member.name || !member.role || (member.photo && !safeUrl(member.photo)) || member.published !== true) errors.push(`${member.id} has incomplete team information.`);
  const text = JSON.stringify(release);
  if (/[\ufffd]|<\/?script\b|javascript:|String\.fromCharCode\(/i.test(text)) errors.push('Invalid text or executable content in release.');
  if (/"(?:api_?key|password|private_?key|access_?token|paymentSettings)"\s*:/i.test(text)) errors.push('Private settings do not belong in a public content release.');
  return errors;
}

export function assertRelease(release) {
  const errors = validateRelease(release);
  if (errors.length) throw new Error(`Content release validation failed:\n${errors.join('\n')}`);
  return release;
}

export function normalizeLegacyContent(content) {
  const normalized = structuredClone(content);
  const about = normalized.about_trust;
  if (about) {
    if (!about.subtitle && about.lead) about.subtitle = about.lead;
    if (!about.ceo_quote && about.ceo_note) about.ceo_quote = about.ceo_note;
    delete about.lead;
    delete about.ceo_note;
  }
  for (const key of ['version', 'updated_at', 'updatedAt', 'releaseId', 'revision', 'baseReleaseId']) delete normalized[key];
  return normalized;
}
