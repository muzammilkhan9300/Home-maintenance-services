import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Eye, MousePointer, Image } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const PLACEMENTS = [
  { value: 'hero_banner',      label: 'Hero Banner' },
  { value: 'services_section', label: 'Services Section' },
  { value: 'footer_strip',     label: 'Footer Strip' },
  { value: 'popup',            label: 'Popup' },
  { value: 'sidebar_card',     label: 'Sidebar Card' },
];

const PLACEMENT_COLORS = {
  hero_banner:      'bg-yellow-500/20 text-yellow-400',
  services_section: 'bg-blue-500/20 text-blue-400',
  footer_strip:     'bg-purple-500/20 text-purple-400',
  popup:            'bg-red-500/20 text-red-400',
  sidebar_card:     'bg-green-500/20 text-green-400',
};

const emptyForm = { title: '', description: '', imageUrl: '', linkUrl: '', placement: 'hero_banner', isActive: true, startDate: '', endDate: '' };

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';

const AdminAds = () => {
  const [ads, setAds]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal]= useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [imageFile, setImageFile]= useState(null);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const fetchAds = async () => {
    setLoading(true);
    try { const data = await adminApi.getAds(); setAds(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAds(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setError(''); setShowModal(true); };
  const openEdit   = (ad) => {
    setEditing(ad);
    setForm({ title: ad.title, description: ad.description, imageUrl: ad.imageUrl, linkUrl: ad.linkUrl, placement: ad.placement, isActive: ad.isActive, startDate: ad.startDate?.slice(0,10) || '', endDate: ad.endDate?.slice(0,10) || '' });
    setImageFile(null); setError(''); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editing) await adminApi.updateAd(editing._id, fd);
      else         await adminApi.createAd(fd);
      setShowModal(false);
      fetchAds();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (ad) => {
    try {
      const updated = await adminApi.updateAdJson(ad._id, { isActive: !ad.isActive });
      setAds(prev => prev.map(a => a._id === ad._id ? updated : a));
    } catch (err) { console.error(err); }
  };

  const deleteAd = async (id) => {
    if (!window.confirm('Delete this ad?')) return;
    await adminApi.deleteAd(id);
    setAds(prev => prev.filter(a => a._id !== id));
  };

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Ad Manager</h1>
          <p className="text-slate-400 text-sm mt-0.5">{ads.length} ads · {ads.filter(a => a.isActive).length} active</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Plus className="w-4 h-4" /> Create Ad
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl h-56 animate-pulse" />)}
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <Megaphone className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No ads yet. Create your first promotion!</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-slate-900 font-semibold text-sm" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>Create Ad</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map(ad => (
            <div key={ad._id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group">
              {/* Image */}
              <div className="relative h-36 bg-slate-700/50">
                {ad.imageUrl ? (
                  <img src={ad.imageUrl.startsWith('/uploads') ? `${API_BASE}${ad.imageUrl}` : ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Image className="w-8 h-8 text-slate-600" /></div>
                )}
                <div className="absolute top-2 left-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PLACEMENT_COLORS[ad.placement] || 'bg-slate-700 text-slate-300'}`}>
                    {PLACEMENTS.find(p => p.value === ad.placement)?.label || ad.placement}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(ad)} className="w-7 h-7 bg-slate-900/90 rounded-lg flex items-center justify-center text-slate-300 hover:text-white"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => deleteAd(ad._id)} className="w-7 h-7 bg-red-900/90 rounded-lg flex items-center justify-center text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1 truncate">{ad.title}</h3>
                {ad.description && <p className="text-slate-400 text-xs line-clamp-2 mb-3">{ad.description}</p>}

                {/* Stats */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Eye className="w-3 h-3" /> {ad.viewCount}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MousePointer className="w-3 h-3" /> {ad.clickCount}</span>
                  {ad.viewCount > 0 && (
                    <span className="text-xs text-slate-500">CTR: {((ad.clickCount / ad.viewCount) * 100).toFixed(1)}%</span>
                  )}
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <button onClick={() => toggleActive(ad)} className={`flex items-center gap-2 text-xs font-medium transition-colors ${ad.isActive ? 'text-green-400' : 'text-slate-500'}`}>
                    {ad.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    {ad.isActive ? 'Active' : 'Inactive'}
                  </button>
                  {ad.linkUrl && (
                    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-400 hover:text-yellow-300 truncate max-w-[120px]">
                      View link ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Ad' : 'Create New Ad'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
              <div><label className="block text-sm text-slate-400 mb-1.5">Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="Summer Promo" required /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} resize-none`} rows={2} placeholder="Optional description…" /></div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full text-slate-400 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-slate-200 file:text-sm hover:file:bg-slate-600 transition-colors" />
                {!imageFile && <div className="mt-2"><label className="block text-xs text-slate-500 mb-1">— or paste image URL —</label><input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={inputClass} placeholder="https://…" /></div>}
              </div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Link URL</label><input value={form.linkUrl} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} className={inputClass} placeholder="https://… (where clicking goes)" /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Placement *</label>
                <select value={form.placement} onChange={e => setForm(f => ({ ...f, placement: e.target.value }))} className={inputClass} required>
                  {PLACEMENTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-slate-400 mb-1.5">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputClass} /></div>
                <div><label className="block text-sm text-slate-400 mb-1.5">End Date</label><input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputClass} /></div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="isActive" className="text-sm text-slate-300">Active (show on website)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-slate-900 font-bold text-sm disabled:opacity-50 hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                  {saving ? 'Saving…' : editing ? 'Update Ad' : 'Create Ad'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Fix missing import
const Megaphone = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;

export default AdminAds;
