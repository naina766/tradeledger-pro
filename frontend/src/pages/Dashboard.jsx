import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card from '../components/Common/Card';
import api from '../services/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Layers, 
  Trophy, 
  Plus, 
  PlusCircle, 
  DollarSign 
} from 'lucide-react';
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from '../components/Common/SkeletonLoaders';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch User Analytics
        const analyticsRes = await api.get('/trades/analytics');
        setAnalytics(analyticsRes.data.data);

        // Fetch User Trades (All for plotting graphs, paginated to 5 for recent table)
        const tradesRes = await api.get('/trades?limit=100');
        const trades = tradesRes.data.data;
        
        setRecentTrades(trades.slice(0, 5));

        // Format Cumulative Equity Line Chart Data
        if (trades.length > 0) {
          // Sort chronologically
          const sorted = [...trades].sort((a, b) => new Date(a.trade_date) - new Date(b.trade_date));
          let runningTotal = 0;
          const curve = sorted.map((t) => {
            runningTotal += parseFloat(t.profit_loss || 0);
            return {
              date: new Date(t.trade_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              Balance: parseFloat(runningTotal.toFixed(2))
            };
          });
          setChartData(curve);

          // Format Asset Category Distribution Data
          const categories = {};
          trades.forEach(t => {
            categories[t.asset_category] = (categories[t.asset_category] || 0) + 1;
          });
          const dist = Object.keys(categories).map(cat => ({
            name: cat,
            value: categories[cat]
          }));
          setDistributionData(dist);
        }
      } catch (err) {
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ChartSkeleton /></div>
        </div>
        <TableSkeleton />
      </DashboardLayout>
    );
  }

  // Check if user has no trades logged
  const hasNoTrades = !analytics || analytics.totalTrades === 0;

  return (
    <DashboardLayout title="Dashboard">
      
      {hasNoTrades ? (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-12 text-center max-w-2xl mx-auto space-y-6 shadow-premium mt-12">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">No Trades Logged Yet</h3>
          <p className="text-slate-400">
            Welcome to TradeLedger Pro! To display dynamic win rates, equity curves, and performance distributions, log your first trade execution.
          </p>
          <Link 
            to="/trades" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-glow hover:translate-y-[-2px] mx-auto"
          >
            <Plus className="w-5 h-5" />
            Record Your First Trade
          </Link>
        </div>
      ) : (
        <>
          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            
            {/* Total Trades */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-indigo-500">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Trades</span>
                <h3 className="text-2xl font-bold text-white mt-1">{analytics.totalTrades}</h3>
              </div>
              <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            {/* Win Rate */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-emerald-500">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Win Rate</span>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">{analytics.winRate}%</h3>
              </div>
              <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <Percent className="w-5 h-5" />
              </div>
            </div>

            {/* Winning Trades */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Wins</span>
                <h3 className="text-2xl font-bold text-white mt-1">{analytics.winningTrades}</h3>
              </div>
              <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* Losing Trades */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Losses</span>
                <h3 className="text-2xl font-bold text-white mt-1">{analytics.losingTrades}</h3>
              </div>
              <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            {/* Net Profit */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-indigo-400">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Net P&L</span>
                <h3 className={`text-xl font-bold mt-1 ${analytics.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analytics.netProfit >= 0 ? '+' : ''}${analytics.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${analytics.netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            {/* Best Performing Asset */}
            <div className="glass-panel p-5 rounded-xl flex items-center justify-between shadow-premium border-l-2 border-amber-500">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Best Ticker</span>
                <h3 className="text-2xl font-bold text-amber-500 mt-1 truncate max-w-[80px]">{analytics.bestAsset}</h3>
              </div>
              <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                <Trophy className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cumulative Profit/Loss curve */}
            <Card title="Equity Curve (Cumulative P&L)" className="lg:col-span-2">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Balance" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      dot={{ r: 4, strokeWidth: 1, fill: '#6366f1' }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Distribution Chart */}
            <Card title="Trades by Category">
              <div className="h-72 w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-xs font-semibold">
                  {distributionData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      <span className="text-slate-400">{entry.name} ({entry.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

          </div>

          {/* Recent Trades Table */}
          <Card 
            title="Recent Trade Executions" 
            action={
              <Link to="/trades" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                View All Trades &rarr;
              </Link>
            }
          >
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Asset</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Qty</th>
                    <th className="pb-3 px-4">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors text-sm">
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(trade.trade_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {trade.asset_name}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          trade.trade_type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {trade.trade_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {trade.asset_category}
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {parseFloat(trade.quantity)}
                      </td>
                      <td className={`py-4 px-4 font-bold ${
                        parseFloat(trade.profit_loss) > 0 ? 'text-emerald-400' : 
                        parseFloat(trade.profit_loss) < 0 ? 'text-red-400' : 'text-slate-400'
                      }`}>
                        {parseFloat(trade.profit_loss) > 0 ? '+' : ''}
                        ${parseFloat(trade.profit_loss).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

    </DashboardLayout>
  );
};

export default Dashboard;
