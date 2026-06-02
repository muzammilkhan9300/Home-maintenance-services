import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, FileText, Megaphone,
  Star, Bell, BarChart2, Settings, LogOut, ChevronRight, Shield, X, Plug,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     path: '/admin/dashboard' },
  { icon: MessageSquare,   label: 'Leads',          path: '/admin/leads' },
  { icon: FileText,        label: 'Applications',   path: '/admin/careers' },
  { icon: Megaphone,       label: 'Ads',            path: '/admin/ads' },
  { icon: Star,            label: 'Testimonials',   path: '/admin/testimonials' },
  { icon: Bell,            label: 'Notices',        path: '/admin/notices' },
  { icon: BarChart2,       label: 'Analytics',      path: '/admin/analytics' },
  { icon: Plug,            label: 'Plugins',        path: '/admin/plugins' },
  { icon: Settings,        label: 'Settings',       path: '/admin/settings' },
];

const AdminSidebar = ({ admin, onLogout, onClose }) => {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full relative">
      {/* Mobile close button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-5 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 md:hidden transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm font-['Montserrat'] leading-tight">AFNAN ADMIN</p>
            <p className="text-slate-500 text-xs leading-tight">Property Care</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-300'}`} style={{ width: '18px', height: '18px' }} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-yellow-400/60" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{(admin?.name || 'A')[0].toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name || 'Admin'}</p>
            <p className="text-slate-500 text-xs truncate">{admin?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
