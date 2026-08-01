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
  // Strip trailing slash unless it's the root homepage
  const cleanPath = resolvedPath === '/' ? '' : resolvedPath.replace(/\/$/, '');
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

  // JSON-LD Local Business structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE_NAME,
    image: resolvedOgImage,
    '@id': SITE_URL,
    url: canonicalHref,
    telephone: '+971505387736',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/AfnanPropertyCare',
      'https://www.instagram.com/afnan_propertycareservices',
    ],
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
