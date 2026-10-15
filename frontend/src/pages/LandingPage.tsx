import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  BarChart2,
  Users,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, isAdmin, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role: 'admin' | 'citizen') => {
    await loginAsDemo(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white font-heading">
                  CivicAI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Hackathon 2K26
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smarter Reports. Safer Communities.</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/map" className="hover:text-cyan-400 transition-colors">
              Community Map
            </Link>
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              AI Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-800/50 text-cyan-400 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-Powered Municipal Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight font-heading">
            Transforming City Feedback into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Decisive Civic Action
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Report potholes, water leaks, and municipal hazards in seconds. CivicAI uses
            machine learning to classify severity, eliminate duplicate dispatches, route tasks to
            departments, and keep citizens informed.
          </p>

          {/* Quick Demo Access Bar */}
          <div className="mt-10 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              ⚡ Instant Hackathon Demo Accounts (1-Click Login):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer group"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-200" />
                <span>Launch as Chief Admin</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleDemoLogin('citizen')}
                className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs transition-colors cursor-pointer group"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Launch as Citizen Alex</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <span>Admin: <code>admin@civicai.org</code></span>
              <span>•</span>
              <span>Citizen: <code>citizen.alex@civicai.org</code></span>
            </div>
          </div>

          {/* Secondary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/map"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Explore Live Community Map</span>
            </Link>
            <Link
              to="/report"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Report an Issue (No account needed to test)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Grid */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-extrabold text-cyan-400">100%</div>
              <div className="text-xs font-medium text-slate-400 mt-1">AI-Assisted Triage</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-extrabold text-blue-400">&lt; 1 sec</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Classification Speed</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-extrabold text-indigo-400">7 Depts</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Automated Routing</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-3xl font-extrabold text-emerald-400">0 API Key</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Required (Offline Ready)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-cyan-400 font-semibold text-xs uppercase tracking-widest">
            Engineering Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
            Key CivicAI Capabilities
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Designed to address chronic municipal pain points: fragmented complaint channels,
            unverified priorities, redundant reports, and lack of citizen visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Intelligent Severity & Category Prediction
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Analyzes report text against civic hazard indicators. Instantly estimates urgency
              (Critical, High, Medium, Low) with clear, auditable explanations for municipal staff.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Smart Duplicate Detection
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Combines Haversine geographic distance with token Jaccard similarity. Flags matching
              complaints within 1km radius so field crews never duplicate work orders.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">
              Geospatial Hotspot GIS Map
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Interactive Leaflet OpenStreetMap visualization. Priority color-coded pins, cluster
              radiuses, and category filters give citizens and administrators panoramic city awareness.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">CivicAI Platform</span>
            <span>• Built for VORTEX 2K26 Global AI Innovation Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/map" className="hover:text-slate-300">Public Map</Link>
            <Link to="/login" className="hover:text-slate-300">Login</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
