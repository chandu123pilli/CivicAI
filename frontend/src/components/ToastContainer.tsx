import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getStyle = () => {
          switch (toast.type) {
            case 'success':
              return {
                bg: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
                icon: CheckCircle2,
                iconColor: 'text-emerald-400',
              };
            case 'error':
              return {
                bg: 'bg-rose-900/90 border-rose-500/50 text-rose-100',
                icon: AlertCircle,
                iconColor: 'text-rose-400',
              };
            case 'warning':
              return {
                bg: 'bg-amber-900/90 border-amber-500/50 text-amber-100',
                icon: AlertTriangle,
                iconColor: 'text-amber-400',
              };
            default:
              return {
                bg: 'bg-slate-900/90 border-cyan-500/50 text-cyan-100',
                icon: Info,
                iconColor: 'text-cyan-400',
              };
          }
        };

        const style = getStyle();
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3 ${style.bg}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
