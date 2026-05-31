import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Bell } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const TYPE_STYLES = {
  info:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  promo:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const emptyForm = { title: '', content: '', type: 'info', isActive: true, startDate: '', endDate: '' };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—';

const AdminNotices = () => {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal]= useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try { setList(await adminApi.getNotices()); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchNotices(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit   = (n) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, type: n.type, isActive: n.isActive, startDate: n.startDate?.slice(0,10)||'', endDate: n.endDate?.slice(0,10)||'' });
    setError(''); setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const data = { ...form, startDate: form.startDate || null, endDate: form.endDate || null };
      if (editing) await adminApi.updateNotice(editing._id, data);
      else         await adminApi.createNotice(data);
      setShowModal(false); fetchNotices();
    } catch(err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const toggleActive = async (n) => {
    const updated = await adminApi.updateNotice(n._id, { isActive: !n.isActive });
    setList(prev => prev.map(x => x._id === n._id ? updated : x));
  };

  const del = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await adminApi.deleteNotice(id);
    setList(prev => prev.filter(x => x._id !== id));
  };

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Site Notices</h1>
          <p className="text-slate-400 text-sm mt-0.5">{list.filter(n=>n.isActive).length} active · {list.length} total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length:3}).map((_,i)=><div key={i} className="bg-slate-800/50 rounded-2xl h-20 animate-pulse border border-slate-700/50"/>)}</div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No notices yet. Create an announcement for your visitors.</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-xl text-slate-900 font-semibold text-sm" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>Add Notice</button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map(n => (
            <div key={n._id} className={`bg-slate-800/50 border rounded-2xl p-5 hover:border-slate-600 transition-all group flex items-start justify-between gap-4 ${n.isActive ? 'border-slate-600' : 'border-slate-700/40 opacity-60'}`}>
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border font-semibold capitalize mt-0.5 ${TYPE_STYLES[n.type]}`}>{n.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{n.title}</p>
                  <p className="text-slate-400 text-sm mt-0.5 line-clamp-2">{n.content}</p>
                  <p className="text-slate-600 text-xs mt-1.5">{fmtDate(n.startDate)} → {fmtDate(n.endDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(n)} className={`transition-colors ${n.isActive ? 'text-green-400' : 'text-slate-600'}`}>
                  {n.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button onClick={() => openEdit(n)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del(n._id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Notice' : 'Add Notice'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
              <div><label className="block text-sm text-slate-400 mb-1.5">Title *</label><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={inputClass} placeholder="Eid Special Offer" required /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Content *</label><textarea value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))} className={`${inputClass} resize-none`} rows={3} placeholder="Get 20% off AC maintenance this Eid…" required /></div>
              <div><label className="block text-sm text-slate-400 mb-1.5">Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className={inputClass}>
                  <option value="info">Info (blue)</option>
                  <option value="promo">Promo (gold)</option>
                  <option value="warning">Warning (amber)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm text-slate-400 mb-1.5">Start Date</label><input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className={inputClass} /></div>
                <div><label className="block text-sm text-slate-400 mb-1.5">End Date</label><input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className={inputClass} /></div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="nact" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))} className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="nact" className="text-sm text-slate-300">Active (show on website)</label>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-slate-900 font-bold text-sm disabled:opacity-50 hover:brightness-110" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create Notice'}
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

export default AdminNotices;
