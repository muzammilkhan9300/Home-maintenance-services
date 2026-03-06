import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    canonicalUrl,
}) => {
    const siteTitle = title ? `${title} | Afnan Property Care` : 'Afnan Property Care - Premium Home Maintenance Services in Dubai';
    const siteDesc = description || 'Licensed property maintenance company in Dubai. AC, plumbing, electrical, landscaping, painting & handyman services. Trade License No. 1571076.';
    const siteUrl = canonicalUrl ? `https://afnanpropertycare.ae${canonicalUrl}` : 'https://afnanpropertycare.ae';

    const defaultKeywords = 'home maintenance dubai, ac repair, handyman services, plumbing dubai, electrical services dubai, landscaping dubai, property care';

    // JSON-LD structured data for Local Business SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": "Afnan Property Care",
        "image": "https://afnanpropertycare.ae/og-image.jpg",
        "@id": "https://afnanpropertycare.ae",
        "url": "https://afnanpropertycare.ae",
        "telephone": "+971504200736",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rolex Twin Tower, 33 Baniyas Rd, Al Rigga, Deira",
            "addressLocality": "Dubai",
            "addressRegion": "Dubai",
            "postalCode": "00000",
            "addressCountry": "AE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.2048,
            "longitude": 55.2708
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/afnanpropertycare",
            "https://www.instagram.com/afnanpropertycare"
        ]
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={siteDesc} />
            <meta name="keywords" content={keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords} />
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={siteDesc} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={siteUrl} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={siteDesc} />

            {/* JSON-LD LocalBusiness Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
