import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Plug, Code } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const PLACEMENT_STYLES = {
  head:       'bg-purple-500/20 text-purple-400 border-purple-500/30',
  body_start: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  body_end:   'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

const PLACEMENT_LABELS = {
  head:       'HTML Head (<head>)',
  body_start: 'Body Start (After <body>)',
  body_end:   'Body End (Before </body>)',
};

const emptyForm = { name: '', code: '', placement: 'head', isActive: true, description: '' };

const AdminPlugins = () => {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal]= useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getPlugins();
      setList(data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      code: p.code,
      placement: p.placement,
      isActive: p.isActive,
      description: p.description || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await adminApi.updatePlugin(editing._id, form);
      } else {
        await adminApi.createPlugin(form);
      }
      setShowModal(false);
      fetchPlugins();
    } catch(err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p) => {
    try {
      const updated = await adminApi.updatePlugin(p._id, { isActive: !p.isActive });
      setList(prev => prev.map(x => x._id === p._id ? updated : x));
    } catch (err) {
      console.error(err);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this plugin? This will immediately remove its script code from the website.')) return;
    try {
      await adminApi.deletePlugin(id);
      setList(prev => prev.filter(x => x._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Plugins & Custom Scripts</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {list.filter(p => p.isActive).length} active · {list.length} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all"
          style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
        >
          <Plus className="w-4 h-4" /> Add Plugin
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-2xl h-24 animate-pulse border border-slate-700/50" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-2xl">
          <Plug className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No custom scripts or plugins yet.</p>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl text-slate-900 font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
          >
            Add Plugin
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(p => (
            <div
              key={p._id}
              className={`bg-slate-800/50 border rounded-2xl p-5 hover:border-slate-600 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                p.isActive ? 'border-slate-600' : 'border-slate-700/45 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0 text-slate-400">
                  <Code className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${PLACEMENT_STYLES[p.placement]}`}>
                      {p.placement.replace('_', ' ')}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-slate-400 text-xs mt-1">{p.description}</p>
                  )}
                  <div className="mt-2.5 bg-slate-950/70 border border-slate-900/60 rounded-xl p-3 max-h-24 overflow-y-auto font-mono text-[11px] text-slate-400 whitespace-pre-wrap select-all">
                    {p.code}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 md:self-center self-end mt-2 md:mt-0">
                <button
                  onClick={() => toggleActive(p)}
                  className={`transition-colors p-1 rounded-lg ${p.isActive ? 'text-green-400 hover:text-green-300' : 'text-slate-600 hover:text-slate-500'}`}
                  title={p.isActive ? "Deactivate plugin" : "Activate plugin"}
                >
                  {p.isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
                <button
                  onClick={() => openEdit(p)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors md:opacity-0 md:group-hover:opacity-100"
                  title="Edit script"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => del(p._id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10 transition-colors md:opacity-0 md:group-hover:opacity-100"
                  title="Delete script"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-bold text-lg">{editing ? 'Edit Plugin / Script' : 'Add Plugin / Script'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Plugin Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Google Tag Manager, FB Pixel, Tawk.to Chat"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Placement *</label>
                <select
                  value={form.placement}
                  onChange={e => setForm(f => ({ ...f, placement: e.target.value }))}
                  className={inputClass}
                  required
                >
                  <option value="head">{PLACEMENT_LABELS.head}</option>
                  <option value="body_start">{PLACEMENT_LABELS.body_start}</option>
                  <option value="body_end">{PLACEMENT_LABELS.body_end}</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Specify where in the HTML document this custom script should be dynamically injected.
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Description (Optional)</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Marketing tracking tag for Google AdWords"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm text-slate-400">Custom Code Block *</label>
                  <span className="text-[10px] text-slate-500 font-mono">Accepts &lt;script&gt;, &lt;noscript&gt;, &lt;style&gt;, HTML widget code</span>
                </div>
                <textarea
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  className={`${inputClass} resize-y font-mono text-xs`}
                  rows={8}
                  placeholder="<!-- Paste your code snippet here -->&#10;<script>&#10;  (function(w,d,s...&#10;</script>"
                  required
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="pact"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-yellow-500 accent-yellow-400 focus:ring-yellow-400"
                />
                <label htmlFor="pact" className="text-sm text-slate-300 select-none">
                  Enable Plugin (immediately activate on site)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-slate-900 font-bold text-sm disabled:opacity-50 hover:brightness-110 transition-all"
                  style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                >
                  {saving ? 'Saving…' : editing ? 'Update Plugin' : 'Add Plugin'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlugins;
