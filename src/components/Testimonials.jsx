import React from 'react';
import release from '../data/publishedRelease.json';
export default function Testimonials({ fullPage = false }) {
  const reviews = release.reviews.filter(review => review.published === true && review.sourceUrl && review.clientName && review.reviewText);
  if (!reviews.length) return null;
  return <section className="cb-section"><div className="cb-container"><div className="cb-section-heading"><div><p className="cb-eyebrow">একসঙ্গে কাজের অভিজ্ঞতা</p><h2>গ্রাহকের নিজের কথায়</h2></div></div><div className="cb-review-grid">{(fullPage ? reviews : reviews.slice(0, 3)).map(review => <article key={review.id} className="cb-review-card"><blockquote>{review.reviewText}</blockquote><strong>{review.clientName}</strong>{review.company && <small>{review.company}</small>}<a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">মূল অভিজ্ঞতাটি পড়ুন</a></article>)}</div></div></section>;
}
