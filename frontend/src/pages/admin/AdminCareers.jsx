import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Trash2, RefreshCw, Mail, X, FileText } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';

const STATUS_COLORS = {
  new:         'bg-blue-500/20 text-blue-400 border-blue-500/30',
  reviewing:   'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shortlisted: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected:    'bg-red-500/20 text-red-400 border-red-500/30',
};

const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminCareers = () => {
  const [apps, setApps]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('all');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCareers({ status, search, page, limit: 15 });
      setApps(data.applications || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [status, search, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  const updateStatus = async (id, newStatus) => {
    await adminApi.updateCareerStatus(id, newStatus);
    setApps(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
    if (selected?._id === id) setSelected(s => ({ ...s, status: newStatus }));
  };

  const deleteApp = async (id) => {
    if (!window.confirm('Delete this application permanently?')) return;
    await adminApi.deleteCareer(id);
    setApps(prev => prev.filter(a => a._id !== id));
    setTotal(t => t - 1);
    if (selected?._id === id) setSelected(null);
  };

  const inputClass = 'bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Job Applications</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total applicants</p>
        </div>
        <button onClick={fetchApps} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-sm transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, job title…" className={`${inputClass} pl-10 w-full`} />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={inputClass}>
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/80">
                {['Applicant', 'Contact', 'Job Title', 'CV', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-700/30">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3.5"><div className="h-4 bg-slate-700/60 rounded animate-pulse" /></td>
                  ))}
                </tr>
              )) : apps.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-500">No applications yet</td></tr>
              ) : apps.map(app => (
                <tr key={app._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors cursor-pointer" onClick={() => setSelected(app)}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
                        {app.firstName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-white font-medium text-sm">{app.firstName} {app.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-300 text-sm">{app.email}</div>
                    <div className="text-slate-500 text-xs">{app.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300 text-sm">{app.jobTitle}</td>
                  <td className="px-4 py-3.5">
                    {app.cvFileName ? (
                      <span className="flex items-center gap-1 text-xs text-yellow-400"><FileText className="w-3 h-3" />{app.cvFileName.substring(0, 20)}</span>
                    ) : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{fmtDate(app.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[app.status] || STATUS_COLORS.new}`}>{app.status}</span>
                  </td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(app)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Eye className="w-4 h-4" /></button>
                      <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)} onClick={e => e.stopPropagation()} className="bg-slate-800 text-slate-400 text-xs border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-yellow-400">
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button onClick={() => deleteApp(app._id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <p className="text-slate-500 text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 disabled:opacity-40">Prev</button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <div>
                <h2 className="text-white font-bold text-lg">{selected.firstName} {selected.lastName}</h2>
                <p className="text-yellow-400 text-sm">{selected.jobTitle}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Email', selected.email], ['Phone', selected.phone], ['Applied', fmtDate(selected.createdAt)]].map(([k, v]) => (
                <div key={k} className="flex gap-3"><span className="text-slate-500 text-sm w-16 shrink-0">{k}</span><span className="text-white text-sm">{v}</span></div>
              ))}
              {selected.cvFileName && (
                <div className="flex gap-3 items-center">
                  <span className="text-slate-500 text-sm w-16 shrink-0">CV File</span>
                  <span className="flex items-center gap-2 text-yellow-400 text-sm"><FileText className="w-4 h-4" />{selected.cvFileName}</span>
                </div>
              )}
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Cover Letter</p>
                <div className="bg-slate-800 rounded-xl p-4 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Status:</span>
                <select value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)} className="bg-slate-800 text-white text-sm border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-400">
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
              <a href={`mailto:${selected.email}?subject=Re: Your ${selected.jobTitle} Application`} onClick={() => updateStatus(selected._id, 'reviewing')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
              <button onClick={() => deleteApp(selected._id)} className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareers;
