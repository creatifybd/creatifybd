import React from 'react';

const LEGACY_TAG_PATTERN = /<\/?(?:span|br)\b/i;
const LOCATION_SPECIFIC_PATTERN = /(bangladesh|dhaka|\bbd\b|small business(?:es)?|local market)/i;

export const stripLegacyMarkup = (value = '') => String(value)
  .replace(/<br\s*\/?>/gi, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

export const globalizeCopy = (value, fallback = '') => {
  const source = String(value || '').trim();
  if (!source || LOCATION_SPECIFIC_PATTERN.test(stripLegacyMarkup(source))) return fallback;
  return source;
};

export const renderRichTitle = (value, fallback = '') => {
  const source = String(value || fallback || '');
  if (!LEGACY_TAG_PATTERN.test(source)) return source;

  const normalized = source.replace(/<br\s*\/?>/gi, '\n');
  const tokens = normalized.split(/(<span\b[^>]*>.*?<\/span>|\n)/gis);

  return tokens.map((token, index) => {
    if (!token) return null;
    if (token === '\n') return <br key={`br-${index}`} />;

    const spanMatch = token.match(/^<span\b([^>]*)>(.*?)<\/span>$/is);
    if (spanMatch) {
      const classMatch = spanMatch[1].match(/class\s*=\s*["']([^"']+)["']/i);
      const className = classMatch && /(red|accent|highlight|text-red)/i.test(classMatch[1]) ? 'text-red' : undefined;
      return (
        <span key={`span-${index}`} className={className}>
          {stripLegacyMarkup(spanMatch[2])}
        </span>
      );
    }

    const inlineText = token
      .replace(/<[^>]+>/g, '')
      .replace(/[ \t]+/g, ' ');
    return <React.Fragment key={`text-${index}`}>{inlineText}</React.Fragment>;
  });
};
