import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Activity, 
  Cpu, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col overflow-hidden relative selection:bg-indigo-500">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="h-20 flex items-center justify-between px-6 sm:px-12 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold tracking-tight text-xl">TradeLedger</span>
            <span className="text-indigo-400 font-semibold text-xs ml-1">Pro</span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link 
            to="/register" 
            className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition-all shadow-glow hover:shadow-indigo-500/20 flex items-center gap-1"
          >
            Get Started
            <ChevronRight className="w-4 h-4" />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto relative">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Securing Trade Analytics
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Next Generation <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-400 bg-clip-text text-transparent">
            Journaling for Serious Traders
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-12">
          Eliminate emotions from trading. Log executions, analyze win rates, automate metrics, and secure historical performances on a dashboard built for speed and precision.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/register" 
            className="w-full sm:w-auto text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl transition-all shadow-glow hover:translate-y-[-2px] flex items-center justify-center gap-2"
          >
            Start Your Free Ledger
            <ChevronRight className="w-5 h-5" />
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto text-base font-semibold border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 px-8 py-4 rounded-xl transition-all flex items-center justify-center"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-900 bg-slate-900/20 py-16 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { metric: '$4.2B+', label: 'Traded Volume Logged' },
            { metric: '99.9%', label: 'API Session Uptime' },
            { metric: '15,000+', label: 'Active Trade Accounts' }
          ].map((item, idx) => (
            <div key={idx} className="text-center p-6 glass-panel rounded-xl">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{item.metric}</h3>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Engineered for Precision Analytics
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Everything you need to scale your trading account, wrapped in a premium dashboard layout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: BarChart3, 
              title: 'Automated Metrics', 
              desc: 'Instantly calculate Win-Rate, Net Profit/Loss, and track your cumulative trend line graphs automatically.' 
            },
            { 
              icon: ShieldCheck, 
              title: 'Secure JWT Security', 
              desc: 'Dual token rotation with 15-minute access expirations and 7-day refresh stores keeping keys protected.' 
            },
            { 
              icon: Activity, 
              title: 'Full Lifecycle Tracking', 
              desc: 'Categorize operations across Crypto, Forex, Stocks, and Commodities. Flag OPEN and CLOSED statuses.' 
            }
          ].map((feat, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover rounded-xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <feat.icon className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-lg">{feat.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-t border-slate-900 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Take Control of Your Analytics?
          </h2>
          <p className="text-slate-400">
            Create your account today and start tracking your execution data like a professional institution.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-glow hover:translate-y-[-2px]"
          >
            Get Started Free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 sm:px-12 text-slate-600 text-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-400">TradeLedger Pro</span>
        </div>
        <p>&copy; {new Date().getFullYear()} TradeLedger Pro Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
