import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Card from '../components/Common/Card';
import api from '../services/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  X,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { TableSkeleton } from '../components/Common/SkeletonLoaders';
import toast from 'react-hot-toast';

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filters & Pagination state
  const [search, setSearch] = useState('');
  const [tradeType, setTradeType] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('trade_date');
  const [order, setOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals visibility state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Active items for editing/deleting
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_category: 'CRYPTO',
    exchange: '',
    trade_type: 'BUY',
    status: 'CLOSED',
    entry_price: '',
    exit_price: '',
    quantity: '',
    notes: '',
    trade_date: ''
  });

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trades', {
        params: {
          page,
          limit: 10,
          search,
          trade_type: tradeType,
          asset_category: category,
          status,
          sort,
          order
        }
      });
      setTrades(res.data.data);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages);
        setTotalItems(res.data.pagination.total);
      }
    } catch (err) {
      toast.error('Failed to load trade journal records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [page, tradeType, category, status, sort, order]);

  // Debounced search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchTrades();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleOpenCreate = () => {
    setFormData({
      asset_name: '',
      asset_category: 'CRYPTO',
      exchange: '',
      trade_type: 'BUY',
      status: 'CLOSED',
      entry_price: '',
      exit_price: '',
      quantity: '',
      notes: '',
      trade_date: new Date().toISOString().substring(0, 16)
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (trade) => {
    setSelectedTrade(trade);
    
    // Format timestamp for datetime-local input matching
    let dateStr = '';
    if (trade.trade_date) {
      dateStr = new Date(trade.trade_date).toISOString().substring(0, 16);
    }

    setFormData({
      asset_name: trade.asset_name,
      asset_category: trade.asset_category,
      exchange: trade.exchange || '',
      trade_type: trade.trade_type,
      status: trade.status,
      entry_price: parseFloat(trade.entry_price),
      exit_price: trade.exit_price ? parseFloat(trade.exit_price) : '',
      quantity: parseFloat(trade.quantity),
      notes: trade.notes || '',
      trade_date: dateStr
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (trade) => {
    setSelectedTrade(trade);
    setIsDeleteOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Clear exit price if trade becomes OPEN
      if (name === 'status' && value === 'OPEN') {
        updated.exit_price = '';
      }
      return updated;
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_name || !formData.entry_price || !formData.quantity) {
      return toast.error('Please enter all required fields.');
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.status === 'OPEN') {
        delete payload.exit_price;
      }
      await api.post('/trades', payload);
      toast.success('Trade recorded successfully!');
      setIsCreateOpen(false);
      fetchTrades();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trade.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset_name || !formData.entry_price || !formData.quantity) {
      return toast.error('Please enter all required fields.');
    }

    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.status === 'OPEN') {
        payload.exit_price = 0; // Backend handles reset
      }
      await api.put(`/trades/${selectedTrade.id}`, payload);
      toast.success('Trade updated successfully!');
      setIsEditOpen(false);
      fetchTrades();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update trade.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/trades/${selectedTrade.id}`);
      toast.success('Trade deleted successfully.');
      setIsDeleteOpen(false);
      fetchTrades();
    } catch (err) {
      toast.error('Failed to delete trade record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Trade Ledger">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-premium">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
            placeholder="Search asset ticker (e.g. BTC, AAPL)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <select
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-300"
            value={tradeType}
            onChange={(e) => { setTradeType(e.target.value); setPage(1); }}
          >
            <option value="">All Actions (BUY/SELL)</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          {/* Category Filter */}
          <select
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-300"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            <option value="CRYPTO">CRYPTO</option>
            <option value="STOCK">STOCK</option>
            <option value="FOREX">FOREX</option>
            <option value="COMMODITY">COMMODITY</option>
          </select>

          {/* Status Filter */}
          <select
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-300"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Sort Filter */}
          <select
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-slate-300"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="trade_date">Sort: Date</option>
            <option value="profit_loss">Sort: Profit/Loss</option>
            <option value="entry_price">Sort: Entry Price</option>
            <option value="quantity">Sort: Quantity</option>
            <option value="asset_name">Sort: Asset Name</option>
          </select>

          {/* Order Toggler */}
          <button
            onClick={() => setOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
            className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800"
          >
            {order}
          </button>

          {/* Create Button */}
          <button
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-glow hover:shadow-indigo-500/20 flex items-center gap-1.5 ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            Add Trade
          </button>
        </div>

      </div>

      {/* Main content table */}
      {loading ? (
        <TableSkeleton />
      ) : trades.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 rounded-xl text-center shadow-premium space-y-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="text-white font-bold text-lg">No Matching Trades Found</h4>
          <p className="text-slate-400 max-w-sm mx-auto text-sm">
            Try adjusting your search criteria, clearing active filters, or add a new trade record.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Asset</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Exchange</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Entry</th>
                    <th className="pb-3 px-4">Exit</th>
                    <th className="pb-3 px-4">Qty</th>
                    <th className="pb-3 px-4 text-right">Profit/Loss</th>
                    <th className="pb-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-800/40 hover:bg-slate-900/30 transition-colors text-sm">
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(trade.trade_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {trade.asset_name}
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {trade.asset_category}
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {trade.exchange || 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          trade.trade_type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {trade.trade_type}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          trade.status === 'CLOSED' ? 'bg-slate-800 text-slate-400' : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        ${parseFloat(trade.entry_price).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium">
                        {trade.status === 'CLOSED' ? `$${parseFloat(trade.exit_price).toFixed(2)}` : '--'}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {parseFloat(trade.quantity)}
                      </td>
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(trade)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                            title="Edit entry"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(trade)}
                            className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete entry"
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
          </Card>

          {/* Pagination panel */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-slate-500 bg-slate-900 border border-slate-800 px-6 py-4 rounded-xl shadow-premium">
              <span>Showing Page {page} of {totalPages} (Total: {totalItems} executions)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE TRADE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-premium relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Record Execution</h3>
            
            <form onSubmit={handleCreateSubmit} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Asset Ticker *</label>
                <input
                  type="text"
                  name="asset_name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="e.g. BTC, AAPL, EURUSD"
                  value={formData.asset_name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                <select
                  name="asset_category"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.asset_category}
                  onChange={handleFormChange}
                >
                  <option value="CRYPTO">CRYPTO</option>
                  <option value="STOCK">STOCK</option>
                  <option value="FOREX">FOREX</option>
                  <option value="COMMODITY">COMMODITY</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Exchange</label>
                <input
                  type="text"
                  name="exchange"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="e.g. Binance, NASDAQ"
                  value={formData.exchange}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Type</label>
                <select
                  name="trade_type"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.trade_type}
                  onChange={handleFormChange}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Status</label>
                <select
                  name="status"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="CLOSED">CLOSED</option>
                  <option value="OPEN">OPEN</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Entry Price *</label>
                <input
                  type="number"
                  step="any"
                  name="entry_price"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="0.00"
                  value={formData.entry_price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase ${formData.status === 'OPEN' ? 'text-slate-600' : 'text-slate-400'}`}>Exit Price</label>
                <input
                  type="number"
                  step="any"
                  name="exit_price"
                  disabled={formData.status === 'OPEN'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-30 text-white"
                  placeholder="0.00"
                  value={formData.exit_price}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Quantity *</label>
                <input
                  type="number"
                  step="any"
                  name="quantity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="0.00"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Trade Date</label>
                <input
                  type="datetime-local"
                  name="trade_date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.trade_date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Execution Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  placeholder="Strategy triggers, emotional triggers, trade setup metrics..."
                  value={formData.notes}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-span-2 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="w-full border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20"
                >
                  {submitting ? 'Recording...' : 'Record Execution'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT TRADE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-premium relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white">Edit Execution Details</h3>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Asset Ticker *</label>
                <input
                  type="text"
                  name="asset_name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={formData.asset_name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                <select
                  name="asset_category"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.asset_category}
                  onChange={handleFormChange}
                >
                  <option value="CRYPTO">CRYPTO</option>
                  <option value="STOCK">STOCK</option>
                  <option value="FOREX">FOREX</option>
                  <option value="COMMODITY">COMMODITY</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Exchange</label>
                <input
                  type="text"
                  name="exchange"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={formData.exchange}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Type</label>
                <select
                  name="trade_type"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.trade_type}
                  onChange={handleFormChange}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Status</label>
                <select
                  name="status"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="CLOSED">CLOSED</option>
                  <option value="OPEN">OPEN</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Entry Price *</label>
                <input
                  type="number"
                  step="any"
                  name="entry_price"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={formData.entry_price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold uppercase ${formData.status === 'OPEN' ? 'text-slate-600' : 'text-slate-400'}`}>Exit Price</label>
                <input
                  type="number"
                  step="any"
                  name="exit_price"
                  disabled={formData.status === 'OPEN'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-30 text-white"
                  value={formData.exit_price}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Quantity *</label>
                <input
                  type="number"
                  step="any"
                  name="quantity"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Trade Date</label>
                <input
                  type="datetime-local"
                  name="trade_date"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-300"
                  value={formData.trade_date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Execution Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  value={formData.notes}
                  onChange={handleFormChange}
                />
              </div>

              <div className="col-span-2 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-full border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-glow hover:shadow-indigo-500/20"
                >
                  {submitting ? 'Saving...' : 'Save Details'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-premium relative text-center space-y-5">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Delete Execution Entry?</h3>
              <p className="text-sm text-slate-400 mt-2">
                This action is permanent and will remove {selectedTrade?.asset_name} execution logs from database metrics.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="w-full border border-slate-800 hover:bg-slate-800 text-slate-400 font-semibold py-2.5 rounded-xl transition-all"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Trades;
