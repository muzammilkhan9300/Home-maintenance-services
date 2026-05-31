import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Trash2, RefreshCw, Mail, X } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { services } from '@/data/services';

const STATUS_COLORS = {
  new:      'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read:     'bg-slate-500/20 text-slate-400 border-slate-500/30',
  replied:  'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const getServiceLabel = (id) => services.find(s => s.id === id)?.title || id;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminLeads = () => {
  const [leads, setLeads]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [status, setStatus]     = useState('all');
  const [service, setService]   = useState('all');
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getContacts({ status, service, search, page, limit: 15 });
      setLeads(data.contacts || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [status, service, search, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id, newStatus) => {
    await adminApi.updateContactStatus(id, newStatus);
    setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
    if (selected?._id === id) setSelected(s => ({ ...s, status: newStatus }));
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    await adminApi.deleteContact(id);
    setLeads(prev => prev.filter(l => l._id !== id));
    setTotal(t => t - 1);
    if (selected?._id === id) setSelected(null);
  };

  const inputClass = 'bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Contact Leads</h1>
          <p className="text-slate-400 text-sm mt-0.5">{total} total submissions</p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-sm transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, email, phone…" className={`${inputClass} pl-10 w-full`} />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className={inputClass}>
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
        <select value={service} onChange={e => { setService(e.target.value); setPage(1); }} className={inputClass}>
          <option value="all">All Services</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.title.substring(0, 40)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/80">
                {['Name', 'Contact', 'Service', 'Message', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/30">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5"><div className="h-4 bg-slate-700/60 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-slate-500">No leads found</td></tr>
              ) : leads.map(lead => (
                <tr key={lead._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors cursor-pointer" onClick={() => setSelected(lead)}>
                  <td className="px-4 py-3.5 text-white font-medium whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-300 text-sm">{lead.email}</div>
                    <div className="text-slate-500 text-xs">{lead.phone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">{getServiceLabel(lead.service).substring(0, 28)}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-sm max-w-[180px]">
                    <span className="line-clamp-2">{lead.message}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">{fmtDate(lead.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>{lead.status}</span>
                  </td>
                  <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(lead)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Eye className="w-4 h-4" /></button>
                      <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)} onClick={e => e.stopPropagation()} className="bg-slate-800 text-slate-400 text-xs border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-yellow-400">
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button onClick={() => deleteLead(lead._id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
            <p className="text-slate-500 text-xs">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 disabled:opacity-40 hover:text-white transition-colors">Prev</button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs border border-slate-700 disabled:opacity-40 hover:text-white transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-white font-bold text-lg">{selected.name}</h2>
                <p className="text-slate-500 text-xs mt-0.5">{fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-3">
              {[['Email', selected.email], ['Phone', selected.phone], ['Service', getServiceLabel(selected.service)]].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-slate-500 text-sm w-16 shrink-0">{k}</span>
                  <span className="text-white text-sm">{v}</span>
                </div>
              ))}
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Message</p>
                <div className="bg-slate-800 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">{selected.message}</div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-slate-500 text-sm">Status:</span>
                <select value={selected.status} onChange={e => updateStatus(selected._id, e.target.value)} className="bg-slate-800 text-white text-sm border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-yellow-400">
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-800">
              <a href={`mailto:${selected.email}?subject=Re: Your ${getServiceLabel(selected.service)} inquiry`} onClick={() => updateStatus(selected._id, 'replied')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-900 font-semibold text-sm hover:brightness-110 transition-all"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
              <button onClick={() => deleteLead(selected._id)} className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
