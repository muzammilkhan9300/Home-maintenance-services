import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://maresidentialpropertycareservicellc.com';
const SITE_NAME = 'Afnan Property Care';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,         // e.g. "/services/ac-cleaning" — overrides auto-detection
  robots,
  themeColor,
  ogTitle,
  ogDescription,
  ogImage,
  ogLocale,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  // Auto-detect canonical from current route if not explicitly provided
  const location = useLocation();
  const rawPath = canonicalUrl ?? location.pathname;
  // Normalize path: replace /ac-cleaning with /services/ac-cleaning if applicable for canonical consistency
  let resolvedPath = rawPath === '/ac-cleaning' ? '/services/ac-cleaning' : rawPath;
  // For root homepage, keep trailing slash ('/'), otherwise strip trailing slash
  const cleanPath = resolvedPath === '/' ? '/' : resolvedPath.replace(/\/$/, '');
  const canonicalHref = `${SITE_URL}${cleanPath}`;

  // Build full, unique title without brand duplication
  let pageTitle = title || `${SITE_NAME} - Premium Home Maintenance Services in Dubai`;
  if (title && !title.includes(SITE_NAME)) {
    pageTitle = `${title} | ${SITE_NAME}`;
  }

  const pageDesc = description
    || 'Licensed property maintenance company in Dubai. AC, plumbing, electrical, painting & handyman services. Trade License No. 1571076.';

  const defaultKeywords =
    'home maintenance dubai, ac repair, handyman services, plumbing dubai, electrical services dubai, painting dubai, property care';

  // Use explicit keywords if provided, otherwise fallback to defaultKeywords
  const pageKeywords = keywords || defaultKeywords;

  // Open Graph fallbacks
  const resolvedOgTitle       = ogTitle        || pageTitle;
  const resolvedOgDesc        = ogDescription  || pageDesc;
  const resolvedOgImage       = ogImage        || DEFAULT_OG_IMAGE;
  const resolvedTwitterTitle  = twitterTitle   || resolvedOgTitle;
  const resolvedTwitterDesc   = twitterDescription || resolvedOgDesc;
  const resolvedTwitterImage  = twitterImage   || resolvedOgImage;
  const resolvedRobots        = robots         || 'index, follow, max-image-preview:large';
  const resolvedThemeColor    = themeColor     || '#0F6CBD';
  const resolvedLocale        = ogLocale       || 'en_AE';

  // Build multi-schema JSON-LD Graph for Google Rich Results & AI Overview citations
  const graphSchemas = [
    {
      '@type': 'HomeAndConstructionBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: 'Muhammad Afnan Residential Property Care Services L.L.C',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon-512x512.png`,
      image: resolvedOgImage,
      telephone: '+971505387736',
      priceRange: 'AED 150 - AED 2500',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rolex Twin Tower, 33 Baniyas Rd, Al Rigga, Deira',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        postalCode: '00000',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.2048,
        longitude: 55.2708,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      sameAs: [
        'https://www.facebook.com/AfnanPropertyCare',
        'https://www.instagram.com/afnan_propertycareservices',
      ],
    },
    {
      '@type': 'Service',
      '@id': `${canonicalHref}#service`,
      name: pageTitle,
      serviceType: 'AC Cleaning & Deep Sanitization Service',
      provider: {
        '@id': `${SITE_URL}/#organization`,
      },
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
        containedInPlace: {
          '@type': 'Country',
          name: 'United Arab Emirates',
        },
      },
      description: pageDesc,
      offers: {
        '@type': 'Offer',
        price: '150.00',
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url: canonicalHref,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalHref}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${SITE_URL}/services`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title || 'AC Cleaning Dubai',
          item: canonicalHref,
        },
      ],
    },
  ];

  // If FAQ items exist or are passed, append FAQPage schema to the graph
  const defaultFaqs = [
    {
      q: 'How often should I get my AC cleaned in Dubai?',
      a: 'We recommend a professional AC deep cleaning at least twice a year in Dubai — ideally before summer (April) and after summer (October). Dubai desert dust and humidity create mold growth inside AC ducts and coils.'
    },
    {
      q: 'What is included in your AC deep cleaning service in Dubai?',
      a: 'Our deep cleaning service includes complete dismantling and pressure washing of indoor coils, blower wheel cleaning, filter sanitization, outdoor condenser coil washing, drain line flushing, and medical-grade anti-bacterial fogging.'
    },
    {
      q: 'How much does AC cleaning cost in Dubai?',
      a: 'Our professional AC cleaning prices start from AED 150 per unit with transparent, upfront pricing and no hidden fees. We also offer discounted package rates for multi-unit apartments and villas.'
    },
    {
      q: 'Can dirty AC coils increase my DEWA electricity bill?',
      a: 'Yes. Clogged AC coils and dirty filters restrict airflow, forcing your compressor to work up to 30% harder to cool your home. Regular coil deep cleaning lowers your DEWA monthly power consumption significantly.'
    },
    {
      q: 'How long does an AC cleaning service take per unit?',
      a: 'A thorough AC deep cleaning takes approximately 45 to 60 minutes per split or package unit, depending on the level of dust buildup and accessibility.'
    },
    {
      q: 'Do you provide same-day AC cleaning service in Dubai?',
      a: 'Yes, we offer same-day AC cleaning appointments 7 days a week across all Dubai areas, including Dubai Marina, JVC, Palm Jumeirah, Downtown, and Deira.'
    },
    {
      q: 'Are your technicians certified and company licensed in Dubai?',
      a: 'Absolutely. Muhammad Afnan Residential Property Care Services L.L.C is a fully licensed Dubai maintenance company under Trade License #1571076, employing certified, background-checked technicians.'
    }
  ];

  graphSchemas.push({
    '@type': 'FAQPage',
    '@id': `${canonicalHref}#faq`,
    mainEntity: defaultFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': graphSchemas,
  };

  return (
    <Helmet>
      {/* ── Standard Meta ────────────────────────────────────── */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content={resolvedRobots} />
      <meta http-equiv="X-Robots-Tag" content={resolvedRobots} />
      <meta name="author" content="Muhammad Afnan Residential Property Care Services L.L.C" />
      <meta name="theme-color" content={resolvedThemeColor} />
      <link rel="publisher" href="https://plus.google.com/+AfnanPropertyCare" />

      {/* ── Canonical ────────────────────────────────────────── */}
      <link rel="canonical" href={canonicalHref} />

      {/* ── Open Graph ───────────────────────────────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalHref} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:locale" content={resolvedLocale} />

      {/* ── Twitter ──────────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalHref} />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDesc} />
      <meta name="twitter:image" content={resolvedTwitterImage} />

      {/* ── JSON-LD Structured Data ──────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
