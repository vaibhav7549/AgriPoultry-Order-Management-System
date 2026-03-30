import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyFull, formatDate, getStatusColor } from '../../utils/helpers';
import { exportToCSV } from '../../utils/exportUtils';
import { Search, Filter, Box, X, Download, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function FarmerMyOrders() {
  const { farmerOrders, addToFarmerDraft } = useStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState(location.state?.statusFilter || 'All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const filteredOrders = farmerOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    const exportData = filteredOrders.map(o => ({
      'Order ID': o.id,
      Date: formatDate(o.date),
      Product: o.product,
      Qty: o.qty,
      'Total Amount': o.amount,
      Status: o.status
    }));
    exportToCSV(exportData, 'My_Orders');
  };

  const handleReorder = (order) => {
    addToFarmerDraft({
      id: `p-${order.product?.toLowerCase().replace(/\s+/g, '-')}`,
      name: order.product,
      qty: order.qty,
      distributorPrice: order.unitPrice,
      category: 'Reordered'
    });
    addToast('Items added to cart for reorder!', 'success');
    navigate('/farmer/order');
  };

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/4" /><div className="h-64 skeleton" /></div>;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and review your past orders from your distributor.</p>
      </div>

      <div className="card-static flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search Order ID..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="input-base py-2 text-sm w-full sm:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" />
            <Filter size={18} className="text-gray-400 shrink-0" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-base py-2 text-sm w-full sm:w-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={handleExport} className="btn-outline flex items-center gap-1 text-sm py-2 px-3"><Download size={14} /> <span className="hidden sm:inline">Export</span></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                {['Order ID', 'Date', 'Product & Qty', 'Total Amount', 'Status', 'Action'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 bg-white dark:bg-gray-800">
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.date)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{order.qty}x {order.product}</td>
                  <td className="py-3 px-4 text-sm font-bold text-gray-900 dark:text-white">{formatCurrencyFull(order.amount)}</td>
                  <td className="py-3 px-4"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedOrder(order)} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">View Details</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <Box size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No orders found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Drawer/Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-800 z-50 shadow-2xl flex flex-col border-l border-gray-100 dark:border-gray-700">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Order {selectedOrder.id}</h3>
                  <span className={`badge mt-1 ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-semibold">Order Information</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Date</span><span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedOrder.date)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Distributor ID</span><span className="font-medium text-gray-900 dark:text-white">D001</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Ordered Product</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{selectedOrder.product}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selectedOrder.qty} units × {formatCurrencyFull(selectedOrder.unitPrice || 0)}</p>
                      </div>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{formatCurrencyFull(selectedOrder.amount)}</span>
                    </div>

                    {selectedOrder.items?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">All Items</h5>
                        <div className="space-y-2">
                          {selectedOrder.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700 dark:text-gray-300">{it.qty}x {it.product}</span>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatCurrencyFull((it.price || 0) * (it.qty || 0))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrencyFull(selectedOrder.amount)}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedOrder(null)} className="flex-1 btn-outline py-2.5">Close</button>
                  <button onClick={() => handleReorder(selectedOrder)} className="flex-1 btn-primary py-2.5 flex justify-center items-center gap-2"><RefreshCw size={16} /> Reorder</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
