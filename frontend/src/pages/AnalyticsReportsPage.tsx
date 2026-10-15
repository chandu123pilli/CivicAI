import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { AdminAnalytics } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, Download, TrendingUp, Shield, Layers, PieChart as PieIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const AnalyticsReportsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        showToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!analytics) return;
    const rows = [
      ['Metric Type', 'Dimension', 'Count/Value'],
      ...analytics.category_distribution.map((c) => ['Category', c.category, c.count.toString()]),
      ...analytics.status_distribution.map((s) => ['Status', s.status, s.count.toString()]),
      ...analytics.priority_distribution.map((p) => ['Priority', p.priority, p.count.toString()]),
      ...analytics.department_workload.map((d) => [
        'Department',
        d.department,
        `Total: ${d.total}, Resolved: ${d.resolved}`,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicAI_Municipal_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics summary exported as CSV successfully!', 'success');
  };

  const CAT_COLORS = ['#3B82F6', '#06B6D4', '#6366F1', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];
  const PRI_COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <span>Municipal Analytics & Performance Reports</span>
          </h1>
          <p className="text-xs text-slate-500">
            Comprehensive operational intelligence, resolution efficiency, and municipal workload indicators.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!analytics || loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center text-xs text-slate-400 animate-pulse">
          Aggregating department analytics from database...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Charts: Monthly Trend & Priority Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Complaint Volume Trend (Area Chart) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    Complaint Submission Trend
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Monthly Timeline</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthly_trend || []}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stop-color="#3B82F6" stop-opacity={0.4} />
                        <stop offset="95%" stop-color="#3B82F6" stop-opacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="Reports"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Priority Distribution (Bar / Pie) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    Priority & Urgency Distribution
                  </h3>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.priority_distribution || []}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {(analytics?.priority_distribution || []).map((entry, index) => (
                        <Cell key={`pri-${index}`} fill={PRI_COLORS[index % PRI_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Chart: Department Performance (Bar Chart) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-heading">
                  Department Workload & Resolution Ratio
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking active field tickets vs completed resolutions across municipal divisions.
                </p>
              </div>
            </div>

            <div className="h-72 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.department_workload || []}
                  margin={{ top: 10, right: 20, left: -10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="total" name="Total Assigned" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="In Progress / Backlog" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
