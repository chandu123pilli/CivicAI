import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  User as UserIcon,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building2,
  ArrowRightLeft,
  Key,
  CheckCircle2,
  Server,
  Sparkles
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, isAdmin, loginAsDemo } = useAuth();
  const { showToast } = useNotifications();

  const handleSwitch = async (role: 'admin' | 'citizen') => {
    try {
      await loginAsDemo(role);
      showToast(`Switched active session to Demo ${role}!`, 'success');
    } catch (err) {
      showToast('Role switch failed', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
          User Profile & System Settings
        </h1>
        <p className="text-xs text-slate-500">
          Account information, active role configuration, and hackathon test environments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            {user?.full_name?.charAt(0) || 'U'}
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">{user?.full_name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
              <span>{user?.role}</span>
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user?.phone}</span>
              </div>
            )}
            {user?.department && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{user?.department}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Joined{' '}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString([], {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Oct 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (2 Cols): Quick Switcher & System Environment */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Demo Role Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 font-heading">
                1-Click Role Switcher (Hackathon Evaluator Mode)
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quickly switch personas between municipal administrator and regular citizen to
              evaluate permissions, duplicate detection, and citizen complaint workflows.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleSwitch('admin')}
                disabled={isAdmin}
                className={`p-4 rounded-xl border text-left text-xs space-y-1.5 transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-400/20 opacity-90'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-cyan-600" />
                    Chief Admin Sarah
                  </span>
                  {isAdmin && <CheckCircle2 className="w-4 h-4 text-cyan-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Full administrative powers: triage, status overrides, and duplicate reviews.
                </p>
              </button>

              <button
                onClick={() => handleSwitch('citizen')}
                disabled={!isAdmin}
                className={`p-4 rounded-xl border text-left text-xs space-y-1.5 transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/20 opacity-90'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    Citizen Alex Rivera
                  </span>
                  {!isAdmin && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  Standard citizen account: report issues, track history, add comments.
                </p>
              </button>
            </div>
          </div>

          {/* System Environment Architecture */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3.5 text-xs">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 font-heading">
                System Architecture & Connectivity
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Database Layer</span>
                <div className="font-semibold text-slate-900">SQLite (Local ORM)</div>
                <span className="text-[10px] text-slate-500">PostgreSQL / Supabase compatible</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Engine</span>
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Dual Intelligence</span>
                </div>
                <span className="text-[10px] text-slate-500">Gemini API + Deterministic Fallback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
