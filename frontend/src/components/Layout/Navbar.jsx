import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Search, Bell, Shield, CloudLightning } from 'lucide-react';
import api from '../../services/api';

const Navbar = ({ title = 'Dashboard' }) => {
  const { user } = useContext(AuthContext);
  const [healthy, setHealthy] = useState(true);

  useEffect(() => {
    // Quick ping to check network health and show database link status
    const checkHealth = async () => {
      try {
        await api.get('/health');
        setHealthy(true);
      } catch (err) {
        setHealthy(false);
      }
    };
    checkHealth();
  }, []);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 text-slate-400 select-none">
      {/* Title / Breadcrumbs */}
      <div className="flex items-center gap-2">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
      </div>

      {/* Global Dashboard Interactions */}
      <div className="flex items-center gap-6">
        {/* System Health */}
        <div className="flex items-center gap-2 text-xs font-semibold bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
          <span className={`w-2.5 h-2.5 rounded-full ${healthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-slate-400">{healthy ? 'System Online' : 'System Offline'}</span>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h5 className="text-sm font-semibold text-white leading-tight">{user?.name}</h5>
            <span className="text-xs text-slate-500 leading-none capitalize">{user?.role}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase text-sm border border-indigo-400">
            {user?.name?.substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
