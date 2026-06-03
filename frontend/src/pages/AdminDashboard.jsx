import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card from '../components/Common/Card';
import api from '../services/api';
import { 
  Users, 
  Layers, 
  Activity, 
  DollarSign, 
  Trash2, 
  AlertTriangle,
  X,
  ShieldCheck
} from 'lucide-react';
import { MetricCardSkeleton, TableSkeleton } from '../components/Common/SkeletonLoaders';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  
  // Trades Table Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Administrative Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      // System Metrics
      const analyticsRes = await api.get('/admin/analytics');
      setAnalytics(analyticsRes.data.data);

      // Registered Users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data);

      // System-wide Trades (paginated)
      const tradesRes = await api.get(`/admin/trades?page=${page}&limit=8`);
      setTrades(tradesRes.data.data);
      if (tradesRes.data.pagination) {
        setTotalPages(tradesRes.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error('Failed to load administrative analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page]);

  const handleOpenDelete = (trade) => {
    setSelectedTrade(trade);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/trades/${selectedTrade.id}`);
      toast.success('Trade administratively deleted.');
      setIsDeleteOpen(false);
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to delete trade record.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !analytics) {
    return (
      <DashboardLayout title="Admin Control Center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <TableSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Control Center">
      
      {/* Statistics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-indigo-500">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Accounts</span>
            <h3 className="text-2xl font-bold text-white mt-1">{analytics?.totalUsers}</h3>
          </div>
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Accounts */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-emerald-500">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Accounts</span>
            <h3 className="text-2xl font-bold text-white mt-1">{analytics?.activeUsers}</h3>
          </div>
          <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Total Trades logged */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-indigo-400">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">System Trades</span>
            <h3 className="text-2xl font-bold text-white mt-1">{analytics?.totalTrades}</h3>
          </div>
          <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Net cumulative profits */}
        <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-amber-500">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Global Net P&L</span>
            <h3 className={`text-xl font-bold mt-1 ${analytics?.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {analytics?.totalProfit >= 0 ? '+' : ''}${analytics?.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Traded Assets */}
        <Card title="Top System Tickers">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase">
                  <th className="pb-2 px-2">Ticker</th>
                  <th className="pb-2 px-2 text-right">Trades Count</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.topAssets.map((asset, idx) => (
                  <tr key={idx} className="border-b border-slate-800/40 text-sm">
                    <td className="py-2.5 px-2 font-semibold text-white">{asset.asset_name}</td>
                    <td className="py-2.5 px-2 text-right text-indigo-400 font-bold">{asset.tradeCount}</td>
                  </tr>
                ))}
                {(!analytics?.topAssets || analytics.topAssets.length === 0) && (
                  <tr>
                    <td colSpan="2" className="py-4 text-center text-slate-500 text-xs">No asset data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Registrations */}
        <Card title="Recent Registered Users" className="lg:col-span-2">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase">
                  <th className="pb-2 px-2">ID</th>
                  <th className="pb-2 px-2">Name</th>
                  <th className="pb-2 px-2">Email</th>
                  <th className="pb-2 px-2 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentRegistrations.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/40 text-sm">
                    <td className="py-2.5 px-2 text-slate-500">#{u.id}</td>
                    <td className="py-2.5 px-2 font-semibold text-white">{u.name}</td>
                    <td className="py-2.5 px-2 text-slate-400">{u.email}</td>
                    <td className="py-2.5 px-2 text-right text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* Users Accounts Registry Table */}
      <Card title="System-wide Registered Users">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 px-4">Account ID</th>
                <th className="pb-3 px-4">Name</th>
                <th className="pb-3 px-4">Email Address</th>
                <th className="pb-3 px-4">System Role</th>
                <th className="pb-3 px-4 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors text-sm">
                  <td className="py-4 px-4 text-slate-500">#{u.id}</td>
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-1.5">
                    {u.name}
                    {u.role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </td>
                  <td className="py-4 px-4 text-slate-400">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                      u.role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-850 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-slate-400">
                    {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Global Trades Ledger Table */}
      <Card title="System-wide Trades Ledger">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="pb-3 px-4">Trade ID</th>
                <th className="pb-3 px-4">User ID</th>
                <th className="pb-3 px-4">Asset</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Type</th>
                <th className="pb-3 px-4">Entry</th>
                <th className="pb-3 px-4">Exit</th>
                <th className="pb-3 px-4">Qty</th>
                <th className="pb-3 px-4 text-right">Profit/Loss</th>
                <th className="pb-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors text-sm">
                  <td className="py-4 px-4 text-slate-500">#{trade.id}</td>
                  <td className="py-4 px-4 text-slate-400 font-semibold">User #{trade.user_id}</td>
                  <td className="py-4 px-4 font-semibold text-white">{trade.asset_name}</td>
                  <td className="py-4 px-4 text-slate-400">{trade.asset_category}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      trade.trade_type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {trade.trade_type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-medium">${parseFloat(trade.entry_price).toFixed(2)}</td>
                  <td className="py-4 px-4 text-slate-300 font-medium">
                    {trade.status === 'CLOSED' ? `$${parseFloat(trade.exit_price).toFixed(2)}` : '--'}
                  </td>
                  <td className="py-4 px-4 text-slate-300">{parseFloat(trade.quantity)}</td>
                  <td className={`py-4 px-4 font-bold text-right ${
                    trade.status === 'OPEN' ? 'text-slate-400' :
                    parseFloat(trade.profit_loss) > 0 ? 'text-emerald-400' : 
                    parseFloat(trade.profit_loss) < 0 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {trade.status === 'OPEN' ? '--' : 
                      `${parseFloat(trade.profit_loss) > 0 ? '+' : ''}$${parseFloat(trade.profit_loss).toFixed(2)}`
                    }
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleOpenDelete(trade)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete trade as admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Trades Table Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800/50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 disabled:opacity-35"
            >
              Prev
            </button>
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-400 disabled:opacity-35"
            >
              Next
            </button>
          </div>
        )}
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-premium relative text-center space-y-5">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white text-center">Administrative Trade Deletion</h3>
              <p className="text-sm text-slate-400 mt-2">
                WARNING: You are about to permanently delete trade record #{selectedTrade?.id} belonging to User #{selectedTrade?.user_id}. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="w-full border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={deleting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                {deleting ? 'Deleting...' : 'Force Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminDashboard;
