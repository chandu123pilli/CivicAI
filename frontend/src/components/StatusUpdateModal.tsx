import React, { useState } from 'react';
import { Issue, IssueStatus, IssuePriority } from '../types';
import { adminService } from '../services/adminService';
import { useNotifications } from '../context/NotificationContext';
import { X, CheckCircle2, Shield, Wrench, AlertCircle } from 'lucide-react';

interface Props {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: Issue) => void;
}

const DEPARTMENTS = [
  'Roads and Public Works',
  'Sanitation',
  'Water Department',
  'Electricity Department',
  'Drainage and Public Health',
  'Public Safety',
  'General Administration',
];

const STATUS_OPTIONS: IssueStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

const PRIORITY_OPTIONS: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const StatusUpdateModal: React.FC<Props> = ({ issue, isOpen, onClose, onSuccess }) => {
  const { showToast } = useNotifications();
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);
  const [department, setDepartment] = useState<string>(issue.department);
  const [note, setNote] = useState<string>('');
  const [resolutionDetails, setResolutionDetails] = useState<string>(issue.resolution_details || '');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await adminService.updateIssueStatus(issue.id, {
        new_status: status,
        priority,
        department,
        note: note.trim() || undefined,
        resolution_details: status === 'Resolved' ? resolutionDetails.trim() || undefined : undefined,
      });

      showToast(`Complaint #${issue.tracking_id} updated to ${status}.`, 'success');
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update issue status', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm">Administrative Action — #{issue.tracking_id}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Status Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Lifecycle Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                    status === st
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Department Assignment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assign Responsible Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Override */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Priority Rating
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((pr) => (
                <button
                  type="button"
                  key={pr}
                  onClick={() => setPriority(pr)}
                  className={`py-1.5 px-2 rounded-lg border text-center font-medium text-xs ${
                    priority === pr
                      ? pr === 'Critical'
                        ? 'bg-red-600 text-white border-red-600'
                        : pr === 'High'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : pr === 'Medium'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Details if marked Resolved */}
          {status === 'Resolved' && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 animate-in fade-in">
              <label className="block font-semibold text-emerald-900">
                Resolution Details & Verification Note
              </label>
              <textarea
                value={resolutionDetails}
                onChange={(e) => setResolutionDetails(e.target.value)}
                rows={2}
                placeholder="Describe remedial action taken (e.g. filled pothole with hot mix asphalt, sanitized area)..."
                className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
                required={status === 'Resolved'}
              />
            </div>
          )}

          {/* Administrative Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internal Log / Citizen Status Update Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Work order dispatched to field unit #4"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : 'Confirm Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
