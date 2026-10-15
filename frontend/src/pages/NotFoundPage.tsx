import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 text-cyan-400 mx-auto flex items-center justify-center shadow-2xl shadow-cyan-500/20">
          <MapPin className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-heading">
            404
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Location Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The civic route or report you are looking for does not exist, has been moved, or is
            outside municipal boundaries.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/map"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>View City Map</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
