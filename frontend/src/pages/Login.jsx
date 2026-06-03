import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error('Please fill in all fields.');
    }

    setSubmitting(true);
    try {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Orb */}
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-premium p-8 relative z-10 space-y-8">
        
        {/* Brand logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold mb-2 shadow-glow">
            <TrendingUp className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400">Log in to manage your trade journal executions</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-11 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Register CTA */}
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
