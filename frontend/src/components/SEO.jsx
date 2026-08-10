import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://maresidentialpropertycareservicellc.com';
const SITE_NAME = 'Afnan Property Care';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * SEO component — Centralized meta tags + JSON-LD structured data for all pages.
 *
 * pageType options:
 *   "homepage"      — WebSite + LocalBusiness + BreadcrumbList (Home) + FAQPage (general)
 *   "services-list" — LocalBusiness + BreadcrumbList + ItemList
 *   "service"       — LocalBusiness + BreadcrumbList (Home › Services › [Service]) + Service + FAQPage
 *   "about"         — LocalBusiness + BreadcrumbList
 *   "contact"       — LocalBusiness + BreadcrumbList
 *   "notfound"      — noindex only
 */
const SEO = ({
  title,
  description,
  keywords,
  canonicalUrl,           // e.g. "/services/ac-cleaning"
  robots,
  themeColor,
  ogTitle,
  ogDescription,
  ogImage,
  ogLocale,
  twitterTitle,
  twitterDescription,
  twitterImage,
  pageType = 'service',   // default: service page
  serviceName,            // used for Service schema + BreadcrumbList
  serviceId,              // used for ItemList / canonical
  faqs,                   // array of { q, a } — if provided, appends FAQPage schema
  serviceList,            // array of { id, title } — used on services-list page for ItemList
}) => {
  const location = useLocation();
  const rawPath = canonicalUrl ?? location.pathname;
  let resolvedPath = rawPath === '/ac-cleaning' ? '/services/ac-cleaning' : rawPath;
  const cleanPath = resolvedPath === '/' ? '/' : resolvedPath.replace(/\/$/, '');
  const canonicalHref = `${SITE_URL}${cleanPath}`;

  let pageTitle = title || `${SITE_NAME} - Premium Home Maintenance Services in Dubai`;
  if (title && !title.includes(SITE_NAME)) {
    pageTitle = `${title} | ${SITE_NAME}`;
  }

  const pageDesc = description
    || 'Licensed property maintenance company in Dubai. AC, plumbing, electrical, painting & handyman services. Trade License No. 1571076.';

  const defaultKeywords =
    'home maintenance dubai, property maintenance dubai, handyman dubai, AC repair dubai, plumbing dubai, electrical services dubai, villa maintenance dubai, painting dubai, licensed maintenance company dubai';

  const pageKeywords = keywords || defaultKeywords;

  const resolvedOgTitle       = ogTitle        || pageTitle;
  const resolvedOgDesc        = ogDescription  || pageDesc;
  const resolvedOgImage       = ogImage        || DEFAULT_OG_IMAGE;
  const resolvedTwitterTitle  = twitterTitle   || resolvedOgTitle;
  const resolvedTwitterDesc   = twitterDescription || resolvedOgDesc;
  const resolvedTwitterImage  = twitterImage   || resolvedOgImage;
  const resolvedRobots        = robots         || 'index, follow, max-image-preview:large';
  const resolvedThemeColor    = themeColor     || '#0F6CBD';
  const resolvedLocale        = ogLocale       || 'en_AE';

  // ── Core LocalBusiness schema (used across all public pages) ───────────────
  const localBusiness = {
    '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: 'Muhammad Afnan Residential Property Care Services L.L.C',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/favicon-512x512.png`,
      width: 512,
      height: 512,
    },
    image: resolvedOgImage,
    telephone: '+971505387736',
    email: 'info@maresidentialpropertycareservicellc.com',
    priceRange: 'AED 150 - AED 2500',
    currenciesAccepted: 'AED',
    paymentAccepted: 'Cash, Bank Transfer, Card',
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
      latitude: 25.2631,
      longitude: 55.3277,
    },
    hasMap: 'https://maps.app.goo.gl/xYour-map-link',
    areaServed: [
      { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
    ],
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
  };

  // ── Build BreadcrumbList based on pageType ─────────────────────────────────
  const buildBreadcrumb = () => {
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }];
    if (pageType === 'services-list') {
      items.push({ '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` });
    } else if (pageType === 'service') {
      items.push({ '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` });
      items.push({ '@type': 'ListItem', position: 3, name: serviceName || title || 'Service', item: canonicalHref });
    } else if (pageType === 'about') {
      items.push({ '@type': 'ListItem', position: 2, name: 'About Us', item: `${SITE_URL}/about` });
    } else if (pageType === 'contact') {
      items.push({ '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` });
    }
    return {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalHref}#breadcrumb`,
      itemListElement: items,
    };
  };

  // ── Assemble @graph based on pageType ──────────────────────────────────────
  const graphSchemas = [];

  // WebSite schema — homepage only (for sitelinks search box signal)
  if (pageType === 'homepage') {
    graphSchemas.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: pageDesc,
      inLanguage: 'en-AE',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/services/{search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    });
  }

  // LocalBusiness — all public pages
  if (pageType !== 'notfound') {
    graphSchemas.push(localBusiness);
  }

  // BreadcrumbList — all public pages
  if (pageType !== 'notfound') {
    graphSchemas.push(buildBreadcrumb());
  }

  // Service schema — service detail pages only
  if (pageType === 'service') {
    graphSchemas.push({
      '@type': 'Service',
      '@id': `${canonicalHref}#service`,
      name: serviceName || title || 'Property Maintenance Service',
      serviceType: serviceName || 'Home Maintenance',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } },
      description: pageDesc,
      offers: {
        '@type': 'Offer',
        price: '150.00',
        priceCurrency: 'AED',
        availability: 'https://schema.org/InStock',
        validFrom: '2026-01-01',
        url: canonicalHref,
      },
    });
  }

  // ItemList schema — services listing page
  if (pageType === 'services-list' && serviceList && serviceList.length > 0) {
    graphSchemas.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}/services#itemlist`,
      name: 'Home Maintenance Services in Dubai',
      description: 'Complete list of residential property maintenance services offered in Dubai.',
      numberOfItems: serviceList.length,
      itemListElement: serviceList.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: s.title,
        url: `${SITE_URL}/services/${s.id}`,
      })),
    });
  }

  // FAQPage schema — homepage general FAQs + service-specific FAQs
  const homepageFaqs = [
    { q: 'What home maintenance services do you offer in Dubai?', a: 'Afnan Property Care offers AC cleaning & maintenance, plumbing & sanitary repair, electrical fittings, building cleaning, painting contracting, floor & wall tiling, plaster works, systems installation, and comprehensive residential property care in Dubai.' },
    { q: 'Are you a licensed home maintenance company in Dubai?', a: 'Yes. Muhammad Afnan Residential Property Care Services L.L.C is a fully licensed limited liability company in Dubai, UAE. Our Trade License number is 1571076. All our technicians are certified and background-checked.' },
    { q: 'Do you offer same-day home maintenance service in Dubai?', a: 'Yes. We offer same-day and emergency property maintenance services across all areas of Dubai, including Dubai Marina, JVC, Palm Jumeirah, Downtown, Business Bay, Jumeirah, Al Barsha, Mirdif, Deira, and Bur Dubai. Call +971-505387736 for immediate assistance.' },
    { q: 'How much do home maintenance services cost in Dubai?', a: 'Our home maintenance services in Dubai start from AED 150 per visit. We provide transparent, upfront fixed quotes before any work begins — no hidden fees, no surprises. Annual Maintenance Contracts (AMC) are also available for comprehensive year-round coverage.' },
    { q: 'Do you cover villas and apartments in Dubai?', a: 'Yes. We provide residential property maintenance for villas, apartments, townhouses, and penthouses across all Dubai communities and neighborhoods.' },
  ];

  if (pageType === 'homepage') {
    graphSchemas.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: homepageFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  if (pageType === 'service' && faqs && faqs.length > 0) {
    graphSchemas.push({
      '@type': 'FAQPage',
      '@id': `${canonicalHref}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

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
      <meta name="geo.region" content="AE-DU" />
      <meta name="geo.placename" content="Dubai" />
      <meta name="geo.position" content="25.2631;55.3277" />
      <meta name="ICBM" content="25.2631, 55.3277" />

      {/* ── Canonical ────────────────────────────────────────── */}
      <link rel="canonical" href={canonicalHref} />

      {/* ── Open Graph ───────────────────────────────────────── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalHref} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={resolvedLocale} />

      {/* ── Twitter / X ──────────────────────────────────────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalHref} />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDesc} />
      <meta name="twitter:image" content={resolvedTwitterImage} />

      {/* ── JSON-LD Structured Data ──────────────────────────── */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
