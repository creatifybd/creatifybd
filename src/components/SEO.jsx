import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title = "CreatifyBD | Digital Marketing, Branding & Creative Agency in Dhaka",
  description = "CreatifyBD helps brands grow through digital marketing, branding, social media management, web development, photography, videography and creative content production.",
  keywords = "digital marketing agency dhaka, creative agency bangladesh, web design dhaka, branding agency bangladesh, social media marketing, content production, seo services, creatifybd",
  image = "https://creatifybd.com/og-image.png",
  url = null,
  type = "website",
  schema = null,
  noIndex = false
}) => {
  const location = useLocation();
  const siteName = "CreatifyBD";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  let path = location.pathname;
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1);
  }
  const canonicalUrl = url || `https://creatifybd.com${path}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Advanced Bots Control */}
      <meta
        name="robots"
        content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}
      />

      {/* Noindex for Firebase staging domain */}
      {typeof window !== 'undefined' && window.location.hostname === 'creatify-bd.web.app' && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Dynamic JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
