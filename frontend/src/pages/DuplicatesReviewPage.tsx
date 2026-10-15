import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { DuplicateRecord } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { DuplicateReviewModal } from '../components/DuplicateReviewModal';
import { useNotifications } from '../context/NotificationContext';
import { CopyCheck, Split, CheckCheck, Clock, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DuplicatesReviewPage: React.FC = () => {
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDuplicate, setActiveDuplicate] = useState<DuplicateRecord | null>(null);
  const { showToast } = useNotifications();

  const loadDuplicates = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDuplicates(
        statusFilter !== 'All' ? statusFilter : undefined
      );
      setDuplicates(data);
    } catch (err) {
      showToast('Failed to load duplicate pairs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDuplicates();
  }, [statusFilter]);

  const pendingCount = duplicates.filter((d) => d.review_status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <span>AI Potential Duplicate Review Queue</span>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                {pendingCount} Pending Triage
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">
            Automated geospatial and text matching prevents redundant municipal dispatches.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Review Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Confirmed Duplicate">Confirmed Duplicate</option>
            <option value="Marked Independent">Marked Independent</option>
          </select>
        </div>
      </div>

      {/* Grid of duplicate pairs */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
          Analyzing duplicate clusters...
        </div>
      ) : duplicates.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <CopyCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No duplicate matches found</h3>
          <p className="text-xs text-slate-500">
            {statusFilter !== 'All'
              ? 'No duplicate pairs match this filter.'
              : 'Our AI engine has verified all active complaints are distinct.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {duplicates.map((dup) => {
            const scorePct = Math.round(dup.similarity_score * 100);
            return (
              <div
                key={dup.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Confidence Bar Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                      {scorePct}% Match
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Pair #{dup.id}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      dup.review_status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : dup.review_status === 'Confirmed Duplicate'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {dup.review_status}
                  </span>
                </div>

                {/* Reports Comparison Brief */}
                <div className="space-y-3 text-xs">
                  {/* Source */}
                  <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-900 font-mono">
                        {dup.source_issue.tracking_id}
                      </span>
                      <StatusBadge status={dup.source_issue.status} size="sm" />
                    </div>
                    <div className="font-semibold text-slate-900 truncate">
                      {dup.source_issue.title}
                    </div>
                    {dup.source_issue.address && (
                      <div className="text-[10px] text-slate-500 truncate">
                        📍 {dup.source_issue.address}
                      </div>
                    )}
                  </div>

                  {/* Matched */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 font-mono">
                        {dup.matched_issue.tracking_id}
                      </span>
                      <StatusBadge status={dup.matched_issue.status} size="sm" />
                    </div>
                    <div className="font-semibold text-slate-800 truncate">
                      {dup.matched_issue.title}
                    </div>
                    {dup.matched_issue.address && (
                      <div className="text-[10px] text-slate-500 truncate">
                        📍 {dup.matched_issue.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/issues/${dup.source_issue.id}`}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span>•</span>
                    <Link
                      to={`/issues/${dup.matched_issue.id}`}
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Matched</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <button
                    onClick={() => setActiveDuplicate(dup)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Compare & Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {activeDuplicate && (
        <DuplicateReviewModal
          duplicate={activeDuplicate}
          isOpen={!!activeDuplicate}
          onClose={() => setActiveDuplicate(null)}
          onSuccess={() => {
            loadDuplicates();
          }}
        />
      )}
    </div>
  );
};
