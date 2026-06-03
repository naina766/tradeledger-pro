import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'None', width: 'w-0', color: 'bg-slate-700' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/\d/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;

    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak', width: 'w-1/3', color: 'bg-red-500' };
      case 2:
      case 3:
        return { label: 'Medium', width: 'w-2/3', color: 'bg-yellow-500' };
      case 4:
        return { label: 'Strong', width: 'w-full', color: 'bg-emerald-500' };
      default:
        return { label: 'None', width: 'w-0', color: 'bg-slate-700' };
    }
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      return toast.error('Please fill in all fields.');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setSubmitting(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Orb */}
      <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-premium p-8 relative z-10 space-y-6">
        
        {/* Brand logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold mb-2 shadow-glow">
            <TrendingUp className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400">Get started tracking your trade records</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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

            {/* Password strength indicator */}
            {password && (
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Password Strength:</span>
                  <span className={
                    strength.label === 'Weak' ? 'text-red-400' :
                    strength.label === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
                  }>{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.width} ${strength.color} transition-all duration-300`}></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20 pt-3"
          >
            {submitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login CTA */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
