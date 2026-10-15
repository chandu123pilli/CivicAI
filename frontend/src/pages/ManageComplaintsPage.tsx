import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueService, IssueFilterParams } from '../services/issueService';
import { Issue } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import {
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  MapPin,
  Clock
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Roads and potholes',
  'Garbage and sanitation',
  'Water supply and leakage',
  'Streetlights and electricity',
  'Drainage and flooding',
  'Public safety',
  'Other',
];

const STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];
const DEPARTMENTS = [
  'All',
  'Roads and Public Works',
  'Sanitation',
  'Water Department',
  'Electricity Department',
  'Drainage and Public Health',
  'Public Safety',
  'General Administration',
];

export const ManageComplaintsPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [priority, setPriority] = useState('All');
  const [department, setDepartment] = useState('All');

  // Modal
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const params: IssueFilterParams = {
        page,
        limit,
        status: status !== 'All' ? status : undefined,
        category: category !== 'All' ? category : undefined,
        priority: priority !== 'All' ? priority : undefined,
        department: department !== 'All' ? department : undefined,
        search: search.trim() || undefined,
      };
      const data = await issueService.getIssues(params);
      setIssues(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [page, status, category, priority, department]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadComplaints();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <span>Manage All Civic Complaints</span>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
              {total} total records
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Triage, update lifecycle stages, and assign tasks across municipal departments.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Tracking ID, title, description, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Statuses' : s}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'All Priorities' : p}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer hidden md:block"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
            Loading complaints data from backend...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No complaints match the specified search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Tracking ID</th>
                  <th className="p-3.5">Title & Location</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Assigned Dept</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Submitted</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <Link to={`/issues/${issue.id}`} className="hover:underline">
                        {issue.tracking_id}
                      </Link>
                    </td>
                    <td className="p-3.5 max-w-sm">
                      <div className="font-semibold text-slate-900 truncate">{issue.title}</div>
                      {issue.address && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{issue.address}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700 whitespace-nowrap">{issue.category}</td>
                    <td className="p-3.5 text-slate-800 font-medium whitespace-nowrap">
                      {issue.department}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {new Date(issue.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition-colors cursor-pointer text-xs"
                      >
                        Triage / Edit
                      </button>
                      <Link
                        to={`/issues/${issue.id}`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 inline-flex items-center transition-colors"
                        title="View Full Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      {selectedIssue && (
        <StatusUpdateModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onSuccess={() => {
            loadComplaints();
          }}
        />
      )}
    </div>
  );
};
