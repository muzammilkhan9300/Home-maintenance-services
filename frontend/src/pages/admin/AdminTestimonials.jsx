import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Star, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { services } from '@/data/services';

const emptyForm = { customerName: '', customerLocation: 'Dubai, UAE', rating: 5, reviewText: '', serviceId: '', isPublished: false };

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => onChange(n)}>
        <Star className={`w-5 h-5 transition-colors ${n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
      </button>
    ))}
  </div>
);

const AdminTestimonials = () => {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal]= useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const fetch = async () => {
    setLoading(true);
    try { setList(await adminApi.getTestimonials()); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit   = (t) => { setEditing(t); setForm({ customerName: t.customerName, customerLocation: t.customerLocation, rating: t.rating, reviewText: t.reviewText, serviceId: t.serviceId, isPublished: t.isPublished }); setError(''); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await adminApi.updateTestimonial(editing._id, form);
      else         await adminApi.createTestimonial(form);
      setShowModal(false); fetch();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const togglePublish = async (t) => {
    const updated = await adminApi.updateTestimonial(t._id, { isPublished: !t.isPublished });
    setList(prev => prev.map(x => x._id === t._id ? updated : x));
  };

  const del = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await adminApi.deleteTestimonial(id);
    setList(prev => prev.filter(x => x._id !== id));
  };

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Testimonials</h1>
          <p className="text-slate-400 text-sm mt-0.5">{list.filter(t => t.isPublished).length} published · {list.length} total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length:3}).map((_,i)=><div key={i} className="bg-slate-800/50 rounded-2xl h-48 animate-pulse border border-slate-700/50"/>)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <Star className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No testimonials yet.</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-slate-900 font-semibold text-sm" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>Add First Testimonial</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(t => (
            <div key={t._id} className={`bg-slate-800/50 border rounded-2xl p-5 hover:border-slate-600 transition-all group ${t.isPublished ? 'border-green-500/30' : 'border-slate-700/50'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">{t.customerName}</p>
                  <p className="text-slate-500 text-xs">{t.customerLocation}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(t)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Pencil className="w-3 h-3" /></button>
                  <button onClick={() => del(t._id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n<=t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-3">"{t.reviewText}"</p>
              {t.serviceId && <p className="text-xs text-slate-600 mb-3">{services.find(s=>s.id===t.serviceId)?.title || t.serviceId}</p>}
              <button onClick={() => togglePublish(t)} className={`flex items-center gap-2 text-xs font-medium transition-colors ${t.isPublished ? 'text-green-400' : 'text-slate-500'}`}>
                {t.isPublished ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                {t.isPublished ? 'Published' : 'Unpublished'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
              <div><label className="block text-sm text-slate-400 mb-1.5">Customer Name *</label><input value={form.customerName} onChange={e=>setForm(f=>({...f,customerName:e.target.value}))} className={inputClass} placeholder="John Smith" required /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Location</label><input value={form.customerLocation} onChange={e=>setForm(f=>({...f,customerLocation:e.target.value}))} className={inputClass} placeholder="Dubai, UAE" /></div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Rating</label>
                <StarRating value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))} />
              </div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Review *</label><textarea value={form.reviewText} onChange={e=>setForm(f=>({...f,reviewText:e.target.value}))} className={`${inputClass} resize-none`} rows={3} placeholder="Excellent service…" required /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Service</label>
                <select value={form.serviceId} onChange={e=>setForm(f=>({...f,serviceId:e.target.value}))} className={inputClass}>
                  <option value="">— Select service —</option>
                  {services.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={form.isPublished} onChange={e=>setForm(f=>({...f,isPublished:e.target.checked}))} className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="pub" className="text-sm text-slate-300">Publish on website</label>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-slate-900 font-bold text-sm disabled:opacity-50 hover:brightness-110" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add Testimonial'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
