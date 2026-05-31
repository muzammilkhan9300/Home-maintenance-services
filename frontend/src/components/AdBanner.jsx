import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

/**
 * AdBanner — fetches active ads for a given placement and renders them.
 * placement: 'hero_banner' | 'services_section' | 'footer_strip' | 'popup' | 'sidebar_card'
 */
const AdBanner = ({ placement, className = '' }) => {
  const [ads, setAds]       = useState([]);
  const [dismissed, setDis] = useState({});

  useEffect(() => {
    fetch(`${API_BASE}/api/ads?placement=${placement}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAds(data); })
      .catch(() => {});
  }, [placement]);

  const trackClick = async (id) => {
    try { await fetch(`${API_BASE}/api/ads/${id}/click`, { method: 'POST' }); }
    catch {}
  };

  const trackView = async (id) => {
    try { await fetch(`${API_BASE}/api/ads/${id}/view`, { method: 'POST' }); }
    catch {}
  };

  const visible = ads.filter(a => !dismissed[a._id]);
  if (!visible.length) return null;

  // ── Hero / Footer strip ────────────────────────────────────────────────
  if (placement === 'hero_banner' || placement === 'footer_strip') {
    return (
      <div className={`w-full ${className}`}>
        {visible.map(ad => (
          <div key={ad._id} ref={() => trackView(ad._id)}
            className={`relative flex items-center gap-4 px-6 py-3 ${placement === 'footer_strip' ? 'bg-amber-500/10 border-t border-amber-500/20' : 'bg-gradient-to-r from-yellow-900/40 to-amber-800/30 border-b border-yellow-500/20'}`}>
            {ad.imageUrl && (
              <img src={ad.imageUrl.startsWith('/uploads') ? `${API_BASE}${ad.imageUrl}` : ad.imageUrl} alt={ad.title} className="h-10 w-10 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mr-2">Promotion</span>
              <span className="text-white text-sm font-medium">{ad.title}</span>
              {ad.description && <span className="text-white/70 text-xs ml-2 hidden sm:inline">— {ad.description}</span>}
            </div>
            {ad.linkUrl && (
              <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(ad._id)}
                className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-900 hover:brightness-110 transition-all"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                Learn More
              </a>
            )}
            <button onClick={() => setDis(d => ({ ...d, [ad._id]: true }))} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white/70 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // ── Sidebar card ───────────────────────────────────────────────────────
  if (placement === 'sidebar_card') {
    const ad = visible[0];
    return (
      <div key={ad._id} ref={() => trackView(ad._id)} className={`rounded-2xl overflow-hidden border border-yellow-500/20 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 ${className}`}>
        {ad.imageUrl && (
          <img src={ad.imageUrl.startsWith('/uploads') ? `${API_BASE}${ad.imageUrl}` : ad.imageUrl} alt={ad.title} className="w-full h-32 object-cover" />
        )}
        <div className="p-4">
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Promotion</span>
          <p className="text-white font-semibold text-sm mt-1">{ad.title}</p>
          {ad.description && <p className="text-white/60 text-xs mt-1 line-clamp-2">{ad.description}</p>}
          {ad.linkUrl && (
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(ad._id)}
              className="mt-3 block text-center py-2 rounded-xl text-xs font-bold text-slate-900 hover:brightness-110 transition-all"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
              Learn More
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── Popup ──────────────────────────────────────────────────────────────
  if (placement === 'popup') {
    const ad = visible[0];
    return (
      <div ref={() => trackView(ad._id)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDis(d=>({...d,[ad._id]:true}))}>
        <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
          {ad.imageUrl && <img src={ad.imageUrl.startsWith('/uploads') ? `${API_BASE}${ad.imageUrl}` : ad.imageUrl} alt={ad.title} className="w-full h-48 object-cover" />}
          <div className="p-5">
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-1">Special Offer</p>
            <h3 className="text-white font-bold text-lg">{ad.title}</h3>
            {ad.description && <p className="text-slate-300 text-sm mt-2">{ad.description}</p>}
            <div className="flex gap-3 mt-4">
              {ad.linkUrl && <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(ad._id)} className="flex-1 text-center py-2.5 rounded-xl font-bold text-slate-900 text-sm hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>View Offer</a>}
              <button onClick={() => setDis(d=>({...d,[ad._id]:true}))} className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdBanner;
