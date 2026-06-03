import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackPageView } from "@/lib/analytics";

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/public`);
        if (res.ok) {
          const settings = await res.json();
          initAnalytics(settings);
          // Fire initial pageview on load
          trackPageView(location.pathname + location.search);
        }
      } catch (err) {
        console.error("Failed to load public settings for analytics:", err);
      }
    };
    fetchSettings();
  }, []); // Run once on mount

  useEffect(() => {
    // Skip firing on first load since the mount effect handles that after setting fetch
    // Actually, trackPageView handles settings checking, so firing it on subsequent navigation is correct.
    const settings = window.analyticsSettings;
    if (settings) {
      trackPageView(location.pathname + location.search);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;
