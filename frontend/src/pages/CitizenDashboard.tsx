import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/issueService';
import { Issue } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  PlusCircle,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  Filter,
  Search,
  MapPin,
  ArrowRight,
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserIssues = async () => {
    setLoading(true);
    try {
      const data = await issueService.getIssues({
        my_reports_only: true,
        limit: 100,
      });
      setIssues(data.items);
    } catch (err) {
      console.error('Failed to load citizen issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIssues();
  }, []);

  // Compute exact metrics from database items
  const totalReports = issues.length;
  const pendingReports = issues.filter(
    (i) => i.status === 'Submitted' || i.status === 'Under Review' || i.status === 'Assigned'
  ).length;
  const inProgressReports = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedReports = issues.filter((i) => i.status === 'Resolved').length;

  // Status distribution for chart
  const statusCounts: Record<string, number> = {};
  issues.forEach((i) => {
    statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
  });

  const chartData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const COLORS = ['#64748B', '#F59E0B', '#6366F1', '#3B82F6', '#10B981', '#EF4444'];

  // Filter issues
  const filteredIssues = issues.filter((i) => {
    const matchStatus = statusFilter === 'All' || i.status === statusFilter;
    const matchCategory = categoryFilter === 'All' || i.category === categoryFilter;
    const matchSearch =
      !searchTerm ||
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.address && i.address.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchStatus && matchCategory && matchSearch;
  });

  const categories = [
    'All',
    'Roads and potholes',
    'Garbage and sanitation',
    'Water supply and leakage',
    'Streetlights and electricity',
    'Drainage and flooding',
    'Public safety',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading">
              Welcome back, {user?.full_name?.split(' ')[0]} 👋
            </h1>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Citizen Portal
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Track the status of all your submitted complaints, see department actions in real time,
            or submit a new issue.
          </p>
        </div>

        <Link
          to="/report"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Civic Issue</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalReports}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Lifetime complaints filed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{pendingReports}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting or assigned</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-2">{inProgressReports}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Crews actively on site</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Issues
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{resolvedReports}</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {totalReports > 0 ? `${Math.round((resolvedReports / totalReports) * 100)}% resolved` : '0%'}
          </span>
        </div>
      </div>

      {/* Main Content: Complaints List + Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): My Complaints List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                My Reported Complaints
              </h2>
              <p className="text-xs text-slate-500">Live feed of your civic submissions</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search ID, title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-36"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-none cursor-pointer hidden md:block"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List Items */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
              Loading complaints from database...
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No complaints found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {issues.length === 0
                  ? "You haven't submitted any complaints yet. Report a pothole, leak, or hazard to get started!"
                  : 'No issues match your current search and filter settings.'}
              </p>
              {issues.length === 0 && (
                <Link
                  to="/report"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Report First Issue</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="py-3.5 hover:bg-slate-50/80 p-3 rounded-xl transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {issue.tracking_id}
                      </span>
                      <StatusBadge status={issue.status} size="sm" />
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {issue.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{issue.category}</span>
                      <span>•</span>
                      <span>{issue.department}</span>
                      {issue.address && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 truncate max-w-[150px]">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {issue.address}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/issues/${issue.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-all flex-shrink-0"
                  >
                    <span>Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Status Breakdown Chart & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Report Status Breakdown
            </h3>

            {chartData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={45}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                No data available for chart
              </div>
            )}
          </div>

          {/* Civic Guidelines Box */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl border border-blue-200/80 p-5 text-xs text-blue-950 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <AlertCircle className="w-4 h-4 text-cyan-600" />
              <span>Civic Reporting Tip</span>
            </div>
            <p className="leading-relaxed text-slate-700">
              Photographs and GPS coordinates assist municipal crews in quickly identifying the exact
              pothole or damaged utility pole.
            </p>
            <Link
              to="/map"
              className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900"
            >
              <span>View citywide issues map</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
