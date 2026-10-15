import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  FileText,
  CopyCheck,
  BarChart3,
  UserCheck,
  Shield,
  LogOut,
  ArrowRightLeft,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Props {
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<Props> = ({ onCloseMobile }) => {
  const { user, isAdmin, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSwitchDemoRole = async () => {
    if (isAdmin) {
      await loginAsDemo('citizen');
      navigate('/dashboard');
    } else {
      await loginAsDemo('admin');
      navigate('/admin');
    }
  };

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    highlight?: boolean;
  }

  const citizenNav: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', path: '/report', icon: PlusCircle, highlight: true },
    { name: 'Community Map', path: '/map', icon: MapPin },
    { name: 'Profile & Settings', path: '/profile', icon: UserCheck },
  ];

  const adminNav: NavItem[] = [
    { name: 'Executive Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Complaints', path: '/admin/complaints', icon: FileText },
    { name: 'Duplicate Reviews', path: '/admin/duplicates', icon: CopyCheck },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Hotspot Map', path: '/map', icon: MapPin },
    { name: 'System Profile', path: '/profile', icon: UserCheck },
  ];

  const links = isAdmin ? adminNav : citizenNav;

  return (
    <aside className="w-64 bg-[#0A1124] text-slate-300 flex flex-col h-full border-r border-slate-800/80 shadow-2xl flex-shrink-0">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5 text-white" />
            <Sparkles className="w-3 h-3 text-cyan-200 absolute -top-1 -right-1" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight font-heading">CivicAI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smarter Reports. Safer Communities.</p>
          </div>
        </NavLink>
      </div>

      {/* Role Badge Banner */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
          <div>
            <div className="text-xs font-semibold text-white capitalize flex items-center gap-1">
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Admin Console
                </>
              ) : (
                'Citizen Portal'
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[110px]">
              {user?.full_name || 'Guest'}
            </div>
          </div>
        </div>

        {/* Demo Role Switcher Button */}
        <button
          onClick={handleSwitchDemoRole}
          title={isAdmin ? 'Switch to Demo Citizen' : 'Switch to Demo Admin'}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors text-[10px] flex items-center gap-1"
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Switch</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 font-semibold'
                  : link.highlight
                  ? 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 border border-cyan-800/40'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <link.icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
              <span>{link.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" />
          </NavLink>
        ))}

        {!isAdmin && (
          <div className="pt-4 px-1">
            <NavLink
              to="/report"
              onClick={onCloseMobile}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Issue Now</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080E1E]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
