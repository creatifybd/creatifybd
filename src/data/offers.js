import release from './publishedRelease.json';
import { siteConfig } from '../config/siteConfig';

export const offers = release.offers;
export const offerNotes = release.offerNotes;
export const formatBangla = value => new Intl.NumberFormat('bn-BD').format(value);
export const formatPrice = value => `৳${formatBangla(value)}`;
export const whatsappLink = (message = siteConfig.whatsappMessage) =>
  `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
export const offerWhatsAppLink = offer => whatsappLink(
  `CreatifyBD, “${offer.name}” প্যাকেজটি নিয়ে কথা বলতে চাই। মাসিক ${formatPrice(offer.amountBDT)}—${formatBangla(offer.posters)}টি পোস্টার ও ${formatBangla(offer.videos)}টি ভিডিও। কাজের পরিধি ও শুরু করার নিয়ম জানতে চাই।`
);
