import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminApi } from '@/lib/adminApi';
import { services } from '@/data/services';

const COLORS = ['#f59e0b', '#6366f1', '#22c55e', '#ef4444', '#8b5cf6', '#06b6d4'];

const PERIODS = [
  { label: '7 Days',  value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

const getServiceLabel = (id) => services.find(s => s.id === id)?.title?.substring(0, 22) || id;

const tooltipStyle = {
  contentStyle: { background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '12px' },
};

const AdminAnalytics = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [period, setPeriod] = useState(30);

  const fetchData = async () => {
    setLoad(true);
    try { setData(await adminApi.getAnalytics(period)); }
    catch(e) { console.error(e); }
    finally { setLoad(false); }
  };

  useEffect(() => { fetchData(); }, [period]);

  const totalLeadsInPeriod = data?.dailyLeads?.reduce((s, d) => s + d.count, 0) || 0;
  const totalAppsInPeriod  = data?.dailyApplications?.reduce((s, d) => s + d.count, 0) || 0;
  const topService = data?.byService?.[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setPeriod(p.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.value ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Leads', value: totalLeadsInPeriod, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Applications', value: totalAppsInPeriod, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Top Service', value: topService ? getServiceLabel(topService._id) : '—', color: 'text-blue-400', bg: 'bg-blue-400/10', small: true },
          { label: 'Active Ads', value: data?.adStats?.length ?? '—', color: 'text-green-400', bg: 'bg-green-400/10' },
        ].map(c => (
          <div key={c.label} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.bg}`}>
              <BarChart2 className={`w-5 h-5 ${c.color}`} />
            </div>
            <p className={`${c.small ? 'text-base' : 'text-3xl'} font-bold text-white`}>{c.value}</p>
            <p className="text-slate-400 text-xs mt-1">{c.label} in period</p>
          </div>
        ))}
      </div>

      {/* Leads over time */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-yellow-400" />
          <p className="text-white font-semibold">Leads Over Time</p>
        </div>
        {data?.dailyLeads?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.dailyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="_id" stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} tickFormatter={v=>v.slice(5)} />
              <YAxis stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} labelFormatter={v=>`Date: ${v}`} formatter={(v)=>[v,'Leads']} />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r:5, fill:'#f59e0b' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : <div className="h-[220px] flex items-center justify-center text-slate-600">No lead data in this period</div>}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Leads by service */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-white font-semibold mb-5">Leads by Service</p>
          {data?.byService?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.byService} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="_id" stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} tickFormatter={getServiceLabel} width={120} />
                <Tooltip {...tooltipStyle} formatter={(v)=>[v,'Leads']} labelFormatter={getServiceLabel} />
                <Bar dataKey="count" fill="#f59e0b" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-slate-600">No data</div>}
        </div>

        {/* Lead status pie */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-white font-semibold mb-5">Lead Status Breakdown</p>
          {data?.byStatus?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.byStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={55} outerRadius={90}>
                  {data.byStatus.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:'11px', color:'#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-slate-600">No data</div>}
        </div>
      </div>

      {/* Applications over time */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
        <p className="text-white font-semibold mb-5">Job Applications Over Time</p>
        {data?.dailyApplications?.length ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data.dailyApplications}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="_id" stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} tickFormatter={v=>v.slice(5)} />
              <YAxis stroke="#475569" tick={{ fill:'#64748b', fontSize:10 }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} labelFormatter={v=>`Date: ${v}`} formatter={(v)=>[v,'Applications']} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-[180px] flex items-center justify-center text-slate-600">No application data in this period</div>}
      </div>

      {/* Ad performance */}
      {data?.adStats?.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-white font-semibold mb-4">Ad Performance</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  {['Ad Title','Placement','Views','Clicks','CTR'].map(h=>(
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.adStats.map(ad => (
                  <tr key={ad._id} className="border-b border-slate-700/30">
                    <td className="px-3 py-2.5 text-white text-sm">{ad.title}</td>
                    <td className="px-3 py-2.5 text-slate-400 text-xs">{ad.placement}</td>
                    <td className="px-3 py-2.5 text-slate-300 text-sm">{ad.viewCount}</td>
                    <td className="px-3 py-2.5 text-slate-300 text-sm">{ad.clickCount}</td>
                    <td className="px-3 py-2.5 text-yellow-400 text-sm font-medium">
                      {ad.viewCount > 0 ? `${((ad.clickCount/ad.viewCount)*100).toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
