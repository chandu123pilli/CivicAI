import React from 'react';
import { IssueStatus } from '../types';
import { Clock, Eye, Send, Wrench, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  status: IssueStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          label: 'Submitted',
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Eye,
          label: 'Under Review',
        };
      case 'Assigned':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Send,
          label: 'Assigned',
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Wrench,
          label: 'In Progress',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          label: 'Resolved',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
          label: 'Rejected',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition-all`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
