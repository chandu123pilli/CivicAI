import React, { useState } from 'react';
import { DuplicateRecord } from '../types';
import { adminService } from '../services/adminService';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { X, CopyCheck, AlertTriangle, Check, CheckCheck, Split } from 'lucide-react';

interface Props {
  duplicate: DuplicateRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: DuplicateRecord) => void;
}

export const DuplicateReviewModal: React.FC<Props> = ({
  duplicate,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { showToast } = useNotifications();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !duplicate) return null;

  const scorePct = Math.round(duplicate.similarity_score * 100);

  const handleAction = async (status: 'Confirmed Duplicate' | 'Marked Independent') => {
    setLoading(true);
    try {
      const updated = await adminService.updateDuplicateStatus(duplicate.id, status);
      showToast(`Duplicate pair marked as: ${status}`, 'success');
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update review status', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CopyCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              Duplicate Review — Pair #{duplicate.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Similarity Score Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border-b border-amber-200/60 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 font-extrabold text-base flex items-center justify-center border border-amber-300">
              {scorePct}%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Composite Similarity Confidence
              </div>
              <p className="text-xs text-slate-600">
                Calculated using geospatial distance, token overlap, and category matching.
              </p>
            </div>
          </div>
          <div className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            Current Status: <strong>{duplicate.review_status}</strong>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="p-5 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Source Report */}
          <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full text-[11px]">
                Source Report (New)
              </span>
              <span className="font-mono text-slate-500 font-bold">
                {duplicate.source_issue.tracking_id}
              </span>
            </div>

            <h4 className="font-bold text-sm text-slate-900">
              {duplicate.source_issue.title}
            </h4>

            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-800">{duplicate.source_issue.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Priority:</span>
                <PriorityBadge priority={duplicate.source_issue.priority} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={duplicate.source_issue.status} size="sm" />
              </div>
              {duplicate.source_issue.address && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-700 text-right truncate max-w-[170px]">
                    {duplicate.source_issue.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Matched Report */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full text-[11px]">
                Existing Matched Report
              </span>
              <span className="font-mono text-slate-500 font-bold">
                {duplicate.matched_issue.tracking_id}
              </span>
            </div>

            <h4 className="font-bold text-sm text-slate-900">
              {duplicate.matched_issue.title}
            </h4>

            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-slate-800">{duplicate.matched_issue.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Priority:</span>
                <PriorityBadge priority={duplicate.matched_issue.priority} size="sm" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <StatusBadge status={duplicate.matched_issue.status} size="sm" />
              </div>
              {duplicate.matched_issue.address && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-700 text-right truncate max-w-[170px]">
                    {duplicate.matched_issue.address}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Decision Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-500 max-w-sm">
            Confirming as duplicate links both reports so crews do not duplicate field visits.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAction('Marked Independent')}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Mark Independent</span>
            </button>
            <button
              type="button"
              onClick={() => handleAction('Confirmed Duplicate')}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Confirm Duplicate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
