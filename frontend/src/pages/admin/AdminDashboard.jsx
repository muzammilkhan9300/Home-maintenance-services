import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, FileText, Megaphone, Star,
  TrendingUp, Users, ArrowRight, RefreshCw, Clock,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { adminApi } from '@/lib/adminApi';
import { services } from '@/data/services';

const COLORS = ['#f59e0b', '#6366f1', '#22c55e', '#ef4444', '#8b5cf6'];

const StatCard = ({ icon: Icon, label, value, sub, color, to }) => (
  <Link to={to || '#'} className="block bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all hover:bg-slate-800 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value ?? '—'}</div>
    <div className="text-sm text-slate-400 font-medium">{label}</div>
    {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
  </Link>
);

const getServiceLabel = (id) => services.find(s => s.id === id)?.title?.substring(0, 25) || id;

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400', read: 'bg-slate-500/20 text-slate-400',
  replied: 'bg-green-500/20 text-green-400', archived: 'bg-yellow-500/20 text-yellow-400',
  reviewing: 'bg-purple-500/20 text-purple-400', shortlisted: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
};

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, r, a] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRecent(),
        adminApi.getAnalytics(30),
      ]);
      setStats(s); setRecent(r); setAnalytics(a);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const chartTooltipStyle = {
    contentStyle: { background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '12px' },
    cursor: { fill: 'rgba(245,158,11,0.05)' },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Montserrat']">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Welcome back — here's what's happening.</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-sm transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Total Leads" value={stats?.totalLeads} sub={`${stats?.newLeads ?? 0} unread`} color="bg-yellow-400/10 text-yellow-400" to="/admin/leads" />
        <StatCard icon={Users} label="Today's Leads" value={stats?.todayLeads} sub={`${stats?.weekLeads ?? 0} this week`} color="bg-blue-400/10 text-blue-400" to="/admin/leads" />
        <StatCard icon={FileText} label="Applications" value={stats?.totalApplications} sub={`${stats?.newApplications ?? 0} new`} color="bg-purple-400/10 text-purple-400" to="/admin/careers" />
        <StatCard icon={Megaphone} label="Active Ads" value={stats?.activeAds} sub={`${stats?.totalAds ?? 0} total`} color="bg-green-400/10 text-green-400" to="/admin/ads" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Testimonials</p>
          <p className="text-2xl font-bold text-white">{stats?.publishedTestimonials ?? '—'}</p>
          <p className="text-xs text-slate-600 mt-0.5">Published</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notices</p>
          <p className="text-2xl font-bold text-white">{stats?.activeNotices ?? '—'}</p>
          <p className="text-xs text-slate-600 mt-0.5">Active banners</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weekly Leads</p>
          <p className="text-2xl font-bold text-yellow-400">{stats?.weekLeads ?? '—'}</p>
          <p className="text-xs text-slate-600 mt-0.5">Last 7 days</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Unread</p>
          <p className="text-2xl font-bold text-blue-400">{(stats?.newLeads ?? 0) + (stats?.newApplications ?? 0)}</p>
          <p className="text-xs text-slate-600 mt-0.5">Leads + Apps</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Leads over time */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white font-semibold">Leads Over Time</p>
              <p className="text-slate-500 text-xs">Last 30 days</p>
            </div>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          {analytics?.dailyLeads?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.dailyLeads}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="_id" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
                <Tooltip {...chartTooltipStyle} labelFormatter={v => `Date: ${v}`} />
                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          )}
        </div>

        {/* Leads by status donut */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-white font-semibold mb-1">Lead Status</p>
          <p className="text-slate-500 text-xs mb-4">Breakdown</p>
          {analytics?.byStatus?.length ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={analytics.byStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                  {analytics.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip {...chartTooltipStyle} formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Top services bar chart */}
      {analytics?.byService?.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <p className="text-white font-semibold mb-1">Leads by Service</p>
          <p className="text-slate-500 text-xs mb-5">Last 30 days — top requested services</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analytics.byService} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
              <YAxis type="category" dataKey="_id" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={getServiceLabel} width={130} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [v, 'Leads']} labelFormatter={getServiceLabel} />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent leads */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">Recent Leads</p>
            <Link to="/admin/leads" className="text-yellow-400 text-xs hover:text-yellow-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recent?.recentLeads?.length ? recent.recentLeads.map((l) => (
              <div key={l._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  {l.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{l.name}</p>
                  <p className="text-slate-500 text-xs truncate">{getServiceLabel(l.service)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[l.status] || statusColors.new}`}>{l.status}</span>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            )) : <p className="text-slate-600 text-sm py-4 text-center">No leads yet</p>}
          </div>
        </div>

        {/* Recent applications */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold">Recent Applications</p>
            <Link to="/admin/careers" className="text-yellow-400 text-xs hover:text-yellow-300 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recent?.recentApps?.length ? recent.recentApps.map((a) => (
              <div key={a._id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400 shrink-0">
                  {a.firstName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{a.firstName} {a.lastName}</p>
                  <p className="text-slate-500 text-xs truncate">{a.jobTitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[a.status] || statusColors.new}`}>{a.status}</span>
                  <span className="text-slate-600 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            )) : <p className="text-slate-600 text-sm py-4 text-center">No applications yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
