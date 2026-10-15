import React from 'react';
import { IssuePriority } from '../types';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface Props {
  priority: IssuePriority | string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriorityBadge: React.FC<Props> = ({ priority, size = 'md' }) => {
  const getConfig = () => {
    switch (priority) {
      case 'Critical':
        return {
          bg: 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400/30',
          icon: ShieldAlert,
          label: 'Critical',
          dot: 'bg-red-500 animate-ping',
        };
      case 'High':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: AlertTriangle,
          label: 'High',
          dot: 'bg-orange-500',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: AlertCircle,
          label: 'Medium',
          dot: 'bg-amber-500',
        };
      case 'Low':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: Info,
          label: 'Low',
          dot: 'bg-emerald-500',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Info,
          label: priority,
          dot: 'bg-gray-400',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2 mr-0.5">
        {priority === 'Critical' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
