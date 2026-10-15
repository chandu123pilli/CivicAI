import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  Menu,
  Sparkles,
  User as UserIcon,
  Check,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface Props {
  onToggleMobileMenu: () => void;
  onOpenAIChat: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleMobileMenu, onOpenAIChat }) => {
  const { user, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left side: Mobile Toggle & Welcome Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-slate-800">
            {isAdmin ? 'Municipal Operations Center' : 'Citizen Civic Portal'}
          </h2>
          <p className="text-xs text-slate-600">
            {isAdmin ? 'Triage, prioritize & coordinate civic resolutions' : 'Report issues, track progress & improve your city'}
          </p>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAIChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-blue-700 hover:from-cyan-500/20 hover:to-blue-500/20 border border-blue-200 shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>Ask CivicAI</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.is_read && markAsRead(n.id)}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 flex items-start gap-2.5 cursor-pointer ${
                        !n.is_read ? 'bg-blue-50/50 font-medium' : 'text-slate-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          !n.is_read ? 'bg-blue-600' : 'bg-transparent'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-slate-800 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <NavLink
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center">
            {user?.full_name?.charAt(0) || <UserIcon className="w-4 h-4" />}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {user?.full_name?.split(' ')[0] || 'User'}
            </div>
            <div className="text-[10px] text-slate-500 capitalize">
              {user?.role || 'Citizen'}
            </div>
          </div>
        </NavLink>
      </div>
    </header>
  );
};
