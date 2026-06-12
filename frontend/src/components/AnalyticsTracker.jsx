import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";
import { getBootstrapData } from "@/lib/bootstrap";

/**
 * AnalyticsTracker — loads GA4 / Meta Pixel IDs from the shared bootstrap
 * cache (no extra network request) and fires page-view events on navigation.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  // On first mount: load settings from bootstrap and initialize analytics
  useEffect(() => {
    getBootstrapData()
      .then((data) => {
        const settings = data.settings || {};
        initAnalytics(settings);
        trackPageView(location.pathname + location.search);
      })
      .catch((err) => {
        console.error("Failed to load analytics settings:", err);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On subsequent route changes: fire page-view if analytics is already ready
  useEffect(() => {
    const settings = window.analyticsSettings;
    if (settings) {
      trackPageView(location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
