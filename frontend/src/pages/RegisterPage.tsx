import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { MapPin, Sparkles, UserPlus } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    setLoading(true);
    try {
      await register({
        full_name: fullName,
        email,
        password,
        phone: phone.trim() || undefined,
      });
      showToast('Account registered successfully! Welcome to CivicAI.', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Registration failed. Please check inputs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
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
          Create Citizen Account
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Join your community to report infrastructure issues and track real-time resolution.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 backdrop-blur-xl sm:px-10 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-xs"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
