import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/issueService';
import { useNotifications } from '../context/NotificationContext';
import { IssueDetail } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import {
  MapPin,
  Clock,
  Send,
  User,
  Shield,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { createPriorityIcon } from '../utils/mapIcons';

export const IssueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const { showToast } = useNotifications();

  const [issue, setIssue] = useState<IssueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const fetchIssueDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await issueService.getIssueDetail(Number(id));
      setIssue(data);
    } catch (err: any) {
      showToast('Failed to load issue details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetail();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !issue) return;

    setCommenting(true);
    try {
      const added = await issueService.postComment(issue.id, newComment.trim());
      setIssue({
        ...issue,
        comments: [...issue.comments, added],
      });
      setNewComment('');
      showToast('Comment posted successfully', 'success');
    } catch (err: any) {
      showToast('Failed to post comment', 'error');
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 animate-pulse">
        Retrieving complaint records and status history...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Issue Not Found</h2>
        <p className="text-xs text-slate-500">The requested report could not be found or you may not have access.</p>
        <Link to="/dashboard" className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link
          to={isAdmin ? '/admin/complaints' : '/dashboard'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {isAdmin ? 'Complaints Management' : 'Dashboard'}</span>
        </Link>

        {isAdmin && (
          <button
            onClick={() => setStatusModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-cyan-300" />
            <span>Update Status / Assign Dept</span>
          </button>
        )}
      </div>

      {/* Main Grid: Details (Left) + Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details, Photos, History Timeline, Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {issue.tracking_id}
              </span>
              <div className="flex items-center gap-2">
                <StatusBadge status={issue.status} size="md" />
                <PriorityBadge priority={issue.priority} size="md" />
              </div>
            </div>

            <h1 className="text-xl font-extrabold text-slate-900 font-heading">
              {issue.title}
            </h1>

            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
              {issue.description}
            </p>

            {/* AI Summary Banner */}
            {issue.ai_summary && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-50/70 to-blue-50/70 border border-cyan-200/80 text-xs text-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-cyan-900">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>AI Executive Briefing</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{issue.ai_summary}</p>
              </div>
            )}

            {/* Priority Reason */}
            {issue.ai_priority_explanation && (
              <div className="text-[11px] text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-800">Priority Rationale:</strong>{' '}
                {issue.ai_priority_explanation}
              </div>
            )}

            {/* Resolution Verification Card */}
            {issue.status === 'Resolved' && issue.resolution_details && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resolution Completed & Verified</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">{issue.resolution_details}</p>
              </div>
            )}

            {/* Attached Photo */}
            {issue.image_path && (
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-2">
                  Uploaded Evidence Photo:
                </span>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 w-full max-w-md bg-slate-900">
                  <img
                    src={issue.image_path}
                    alt={issue.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Progression Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 font-heading">
                Status Lifecycle History
              </h3>
            </div>

            <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 py-2">
              {issue.status_history.map((h, idx) => (
                <div key={h.id || idx} className="relative pl-6">
                  {/* Step Dot */}
                  <div className="absolute -left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />

                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={h.new_status} size="sm" />
                    <span className="text-[11px] text-slate-400">
                      {new Date(h.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      by {h.changed_by_name || 'System'}
                    </span>
                  </div>

                  {h.note && (
                    <p className="mt-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                      {h.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comments & Discussion */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 font-heading">
                Updates & Communication ({issue.comments.length})
              </h3>
            </div>

            <div className="space-y-3">
              {issue.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes or comments posted yet.</p>
              ) : (
                issue.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{c.user_name}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            c.user_role === 'admin'
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {c.user_role === 'admin' ? 'Official / Admin' : 'Citizen'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{c.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="pt-2 flex gap-2">
              <input
                type="text"
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add an update or response note..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{commenting ? 'Posting...' : 'Post'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (1 Col): Meta, Department, Location Map */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3.5 text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
              Routing & Authority
            </h3>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Responsible Dept:</span>
                <span className="font-semibold text-slate-900">{issue.department}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Category:</span>
                <span className="font-medium text-slate-800">{issue.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Reported By:</span>
                <span className="font-medium text-slate-800">{issue.reporter_name || 'Citizen'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Submitted Date:</span>
                <span className="text-slate-600">
                  {new Date(issue.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {issue.resolved_at && (
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 font-semibold">Resolved Date:</span>
                  <span className="text-emerald-800 font-semibold">
                    {new Date(issue.resolved_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location Map Preview */}
          {typeof issue.latitude === 'number' && typeof issue.longitude === 'number' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  Incident Geographic Location
                </span>
              </div>

              {issue.address && (
                <p className="text-xs text-slate-600 truncate">
                  📍 {issue.address}
                </p>
              )}

              <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-200 relative">
                <MapContainer
                  center={[issue.latitude, issue.longitude]}
                  zoom={14}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[issue.latitude, issue.longitude]}
                    icon={createPriorityIcon(issue.priority)}
                  />
                </MapContainer>
              </div>

              <div className="text-[11px] font-mono text-slate-500 text-center">
                {issue.latitude.toFixed(5)}, {issue.longitude.toFixed(5)}
              </div>
            </div>
          )}

          {/* Potential Duplicate Matches (if detected) */}
          {issue.potential_duplicates && issue.potential_duplicates.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Suspected Duplicate Reports</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Our AI duplicate engine flagged {issue.potential_duplicates.length} matching report(s)
                near this geographic area.
              </p>
              {issue.potential_duplicates.map((dup) => (
                <div
                  key={dup.id}
                  className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>{dup.matched_tracking_id}</span>
                    <span className="text-amber-600 font-sans">
                      {Math.round(dup.similarity_score * 100)}% match
                    </span>
                  </div>
                  <div className="font-medium text-slate-800">{dup.matched_title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Status: {dup.review_status}</span>
                    <Link
                      to={`/issues/${dup.matched_issue_id}`}
                      className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span>Compare</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Status Update Modal */}
      {statusModalOpen && (
        <StatusUpdateModal
          issue={issue}
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onSuccess={(updated) => {
            setIssue({
              ...issue,
              ...updated,
            });
            fetchIssueDetail();
          }}
        />
      )}
    </div>
  );
};
