/**
 * Analytics Utility for Meta Pixel, Google Analytics (GA4), and Google Tag Manager (GTM)
 * Automatically loads scripts and fires tracking events based on IDs configured in Admin Settings.
 */

export const initAnalytics = (settings) => {
  if (!settings) return;
  window.analyticsSettings = settings;

  // Ensure dataLayer exists for Google Tag Manager
  window.dataLayer = window.dataLayer || [];

  const { metaPixelId, googleAnalyticsId } = settings;

  // Initialize and load Meta Pixel (Facebook Pixel)
  if (metaPixelId && !window.fbq) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', metaPixelId);
  }

  // Initialize and load Google Analytics (gtag.js)
  if (googleAnalyticsId && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', googleAnalyticsId, {
      send_page_view: false // We will fire pageviews manually on route changes
    });
  }
};

/**
 * Tracks a virtual page view (essential for Single Page Apps like React)
 */
export const trackPageView = (path) => {
  const settings = window.analyticsSettings;

  // 1. Google Tag Manager (GTM) dataLayer Push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'VirtualPageView',
    page_path: path,
    page_title: document.title,
  });

  if (!settings) return;

  // 2. Meta Pixel PageView
  if (settings.metaPixelId && window.fbq) {
    window.fbq('track', 'PageView');
  }

  // 3. Google Analytics (GA4) PageView
  if (settings.googleAnalyticsId && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    });
  }
};

/**
 * Tracks a Contact Form lead submission success
 */
export const trackLead = (data) => {
  const settings = window.analyticsSettings;

  // 1. GTM dataLayer Push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'contact_form_submit',
    lead_data: {
      name: data.name,
      email: data.email,
      service: data.service,
    },
  });

  if (!settings) return;

  // 2. Meta Pixel Lead conversion
  if (settings.metaPixelId && window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: data.service,
      status: 'success',
    });
  }

  // 3. GA4 generate_lead conversion
  if (settings.googleAnalyticsId && window.gtag) {
    window.gtag('event', 'generate_lead', {
      service: data.service,
      lead_email: data.email,
    });
  }
};

/**
 * Tracks a Career Form application submission success
 */
export const trackApplication = (data) => {
  const settings = window.analyticsSettings;

  // 1. GTM dataLayer Push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'career_form_submit',
    career_data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      jobTitle: data.jobTitle,
    },
  });

  if (!settings) return;

  // 2. Meta Pixel Custom / Standard conversion
  if (settings.metaPixelId && window.fbq) {
    window.fbq('track', 'SubmitApplication', {
      job_title: data.jobTitle,
    });
  }

  // 3. GA4 custom event
  if (settings.googleAnalyticsId && window.gtag) {
    window.gtag('event', 'submit_application', {
      job_title: data.jobTitle,
    });
  }
};

/**
 * Tracks a WhatsApp button click event
 */
export const trackWhatsAppClick = (location, serviceName = '') => {
  const settings = window.analyticsSettings;

  // 1. GTM dataLayer Push
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'whatsapp_click',
    click_data: {
      location: location,
      service: serviceName,
    },
  });

  if (!settings) return;

  // 2. Meta Pixel custom event
  if (settings.metaPixelId && window.fbq) {
    window.fbq('trackCustom', 'WhatsAppClick', {
      location: location,
      service: serviceName,
    });
  }

  // 3. GA4 custom event
  if (settings.googleAnalyticsId && window.gtag) {
    window.gtag('event', 'whatsapp_click', {
      location: location,
      service: serviceName,
    });
  }
};
