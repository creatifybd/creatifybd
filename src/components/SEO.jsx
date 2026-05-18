import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "CreatifyBD | Best Digital Marketing & Creative Agency in Dhaka", 
  description = "CreatifyBD is the leading creative agency in Dhaka, offering top-class digital marketing, branding, web development, and video production services for global brands.",
  keywords = "Creatify BD, CreatifyBD, digital marketing agency dhaka, best creative agency bangladesh, web design dhaka, branding bangladesh, SEO agency dhaka",
  image = "https://creatify-bd.web.app/og-image.jpg",
  url = "https://creatify-bd.web.app/",
  type = "website",
  schema = null
}) => {
  const siteName = "CreatifyBD";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Advanced Bots Control */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

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
