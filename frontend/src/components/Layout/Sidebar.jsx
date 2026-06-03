import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  LineChart, 
  User, 
  LogOut, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Trades', path: '/trades', icon: LineChart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen text-slate-400">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-white font-bold tracking-tight text-lg">TradeLedger</span>
          <span className="text-indigo-400 font-semibold text-xs ml-1">Pro</span>
        </div>
      </div>

      {/* User Information */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 uppercase border border-slate-700">
            {user?.name?.substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white text-sm font-semibold truncate">{user?.name}</h4>
            <span className="text-xs text-slate-500 capitalize flex items-center gap-1">
              {user?.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />}
              {user?.role} Role
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold' 
                  : 'hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="pt-6 mt-6 border-t border-slate-800">
            <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Administration
            </span>
            <NavLink
              to="/admin"
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500 font-semibold' 
                    : 'hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Admin Panel
            </NavLink>
          </div>
        )}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
