import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { MapPin, Sparkles, LogIn, Shield, User, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, isAdmin } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      showToast('Welcome back! Signed in successfully.', 'success');
      // Navigation is handled after auth state updates or default
      const savedUser = JSON.parse(localStorage.getItem('civicai_user') || '{}');
      if (savedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'admin' | 'citizen') => {
    setLoading(true);
    try {
      await loginAsDemo(role);
      showToast(`Logged in with demo ${role} credentials!`, 'success');
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      showToast('Demo login error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <MapPin className="w-6 h-6 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 absolute -top-1 -right-1" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white font-heading">
              CivicAI
            </span>
            <p className="text-xs text-slate-400">Smarter Reports. Safer Communities.</p>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white font-heading">
          Sign In to Your Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Enter your credentials or use the 1-click hackathon demo accounts below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 backdrop-blur-xl sm:px-10 space-y-6">
          {/* Quick Demo Buttons */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Hackathon Evaluation:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Demo Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('citizen')}
                className="py-2.5 px-3 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Demo Citizen</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Create citizen account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
