import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { issueService } from '../services/issueService';
import { AdminOverview, AdminAnalytics, Issue } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CopyCheck,
  TrendingUp,
  BarChart3,
  Layers,
  Shield,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Wrench,
  MapPin
} from 'lucide-react';
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
  LineChart,
  Line
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Status modal
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ovData, anData, issueData] = await Promise.all([
        adminService.getOverview(),
        adminService.getAnalytics(),
        issueService.getIssues({ limit: 6 }),
      ]);
      setOverview(ovData);
      setAnalytics(anData);
      setRecentIssues(issueData.items);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const PIE_COLORS = ['#3B82F6', '#06B6D4', '#6366F1', '#F59E0B', '#10B981', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold font-heading">
              Municipal Operations & Triage Center
            </h1>
            <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/80 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin HQ
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-department complaint tracking, duplicate detection, and automated AI prioritization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/complaints"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Manage All Complaints</span>
          </Link>
          <Link
            to="/admin/duplicates"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/60 font-semibold text-xs transition-colors"
          >
            <CopyCheck className="w-4 h-4" />
            <span>Review Duplicates</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Complaints
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {overview?.total_complaints ?? 0}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Recorded in database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Unassigned
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {overview?.unassigned_complaints ?? 0}
          </div>
          <span className="text-[10px] text-amber-600 font-medium mt-0.5 block">Needs routing</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            High / Critical
          </span>
          <div className="text-2xl font-extrabold text-red-600 mt-1">
            {overview?.high_critical_complaints ?? 0}
          </div>
          <span className="text-[10px] text-red-600 font-medium mt-0.5 block">High urgency</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Resolved
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {overview?.resolved_complaints ?? 0}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Closed out</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Avg Resolution
          </span>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {overview?.average_resolution_hours ? `${overview.average_resolution_hours}h` : '18h'}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">From submission</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending Duplicates
          </span>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">
            {overview?.pending_duplicates_count ?? 0}
          </div>
          <span className="text-[10px] text-purple-600 font-medium mt-0.5 block">AI cluster match</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Department Workload (Bar Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Department Active Workload Distribution
            </h3>
            <span className="text-xs text-slate-400">Total vs Resolved</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.department_workload || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="total" name="Total Issues" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Breakdown (Pie Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Issues by Category
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.category_distribution || []}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                >
                  {(analytics?.category_distribution || []).map((entry, index) => (
                    <Cell key={`cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table with 1-Click Status Update */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-heading">
              Recent Incoming Complaints Awaiting Action
            </h3>
            <p className="text-xs text-slate-500">Live feed from citizens across all districts</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All ({overview?.total_complaints ?? 0})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Tracking ID</th>
                <th className="p-3">Title & Category</th>
                <th className="p-3">Department</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-700">
                    <Link to={`/issues/${issue.id}`} className="hover:underline">
                      {issue.tracking_id}
                    </Link>
                  </td>
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{issue.title}</div>
                    <div className="text-[11px] text-slate-500">{issue.category}</div>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{issue.department}</td>
                  <td className="p-3">
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveIssue(issue)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition-colors cursor-pointer text-xs"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      {activeIssue && (
        <StatusUpdateModal
          issue={activeIssue}
          isOpen={!!activeIssue}
          onClose={() => setActiveIssue(null)}
          onSuccess={() => {
            fetchAdminData();
          }}
        />
      )}
    </div>
  );
};
