import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { issueService } from '../services/issueService';
import { aiService } from '../services/aiService';
import { useNotifications } from '../context/NotificationContext';
import { MapPicker } from '../components/MapPicker';
import { PriorityBadge } from '../components/PriorityBadge';
import {
  Sparkles,
  Camera,
  MapPin,
  Send,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Upload
} from 'lucide-react';

const CATEGORIES = [
  'Roads and potholes',
  'Garbage and sanitation',
  'Water supply and leakage',
  'Streetlights and electricity',
  'Drainage and flooding',
  'Public safety',
  'Other',
];

export const ReportIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(37.7749);
  const [longitude, setLongitude] = useState<number | null>(-122.4194);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // AI Classification state
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<{
    category: string;
    priority: string;
    priority_explanation: string;
    department: string;
    summary: string;
    is_ai_powered: boolean;
  } | null>(null);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size exceeds 10MB limit', 'error');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleAIAnalyze = async () => {
    if (title.trim().length < 3 || description.trim().length < 10) {
      showToast('Please enter a title and description before requesting AI triage.', 'warning');
      return;
    }

    setAiAnalyzing(true);
    try {
      const res = await aiService.classify(title, description);
      setAiPrediction(res);
      setCategory(res.category);
      showToast('AI analysis completed! Category and priority estimated.', 'success');
    } catch (err) {
      showToast('AI preview failed. You can still select manually.', 'warning');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in title and description', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('category', category);
      if (latitude !== null) formData.append('latitude', latitude.toString());
      if (longitude !== null) formData.append('longitude', longitude.toString());
      if (address.trim()) formData.append('address', address.trim());
      if (selectedFile) formData.append('image', selectedFile);

      const created = await issueService.createIssue(formData);
      setSubmittedIssue(created);
      showToast(`Complaint filed! Tracking ID: ${created.tracking_id}`, 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to submit report. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // If issue has been submitted successfully, render confirmation view
  if (submittedIssue) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden text-center p-8 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Report Filed Successfully
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading pt-2">
              Civic Incident Logged
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your report has been securely registered in the municipal database and routed for
              action.
            </p>
          </div>

          {/* Tracking ID Badge */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
              Official Tracking ID
            </span>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 tracking-wider">
              {submittedIssue.tracking_id}
            </div>
            <p className="text-[11px] text-slate-400">
              Save this ID to check status anytime with our AI Assistant
            </p>
          </div>

          {/* AI Triage Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">AI Priority Rating:</span>
              <PriorityBadge priority={submittedIssue.priority} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Department Routing:</span>
              <span className="font-bold text-slate-900">{submittedIssue.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Category:</span>
              <span className="text-slate-800">{submittedIssue.category}</span>
            </div>
            {submittedIssue.ai_priority_explanation && (
              <div className="pt-1.5 border-t border-slate-200 text-[11px] text-slate-600 italic">
                "{submittedIssue.ai_priority_explanation}"
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/issues/${submittedIssue.id}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              <span>View Timeline & Add Photos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSubmittedIssue(null);
                setTitle('');
                setDescription('');
                setCategory('Other');
                setAiPrediction(null);
                handleRemoveImage();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            Submit a Civic Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report infrastructure hazards, leaks, or sanitation issues. CivicAI automatically triages urgency.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Text, Category, Photo */}
          <div className="lg:col-span-2 space-y-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep crater pothole damaging car rims on 5th Ave"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAIAnalyze}
                  disabled={aiAnalyzing || title.length < 3 || description.length < 10}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-700 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{aiAnalyzing ? 'AI Analyzing...' : 'Auto-Predict with AI'}</span>
                </button>
              </div>
              <textarea
                required
                minLength={10}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific details: approx dimensions, safety hazards, nearest landmarks, whether water is active, etc."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Issue Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attach Photograph (Optional)
              </label>

              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-sm">
                  <img
                    src={previewUrl}
                    alt="Upload Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30 rounded-2xl cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">
                    Click to upload evidence photograph
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Location & AI Triage Summary */}
          <div className="space-y-5">
            {/* AI Assistant Preview Card */}
            {aiPrediction && (
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider font-heading">
                    AI Pre-Triage Prediction
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Predicted Urgency:</span>
                    <PriorityBadge priority={aiPrediction.priority} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target Department:</span>
                    <span className="font-semibold text-cyan-300">{aiPrediction.department}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 italic">
                    "{aiPrediction.priority_explanation}"
                  </p>
                </div>
              </div>
            )}

            {/* Location Selector */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  Incident Geographic Location
                </span>
              </div>

              <MapPicker
                latitude={latitude}
                longitude={longitude}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Street Address or Landmark Hint
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 5th Ave & Market St, next to Metro station"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting & Triaging with AI...' : 'Submit Civic Report'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
