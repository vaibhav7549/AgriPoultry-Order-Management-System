import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useToast } from '../context/ToastContext';
import { Plus, X, Search, Eye, MoreVertical, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull, formatDate, getStatusColor } from '../utils/helpers';
import { PRODUCTS } from '../data/mockData';

export default function FarmerOrders() {
  const farmerOrders = useStore(s => s.farmerOrders);
  const farmers = useStore(s => s.farmers);
  const addFarmerOrder = useStore(s => s.addFarmerOrder);
  const addFarmer = useStore(s => s.addFarmer);
  const updateFarmerOrderStatus = useStore(s => s.updateFarmerOrderStatus);
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState(location.state?.statusFilter || 'All');
  const [productFilter, setProductFilter] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showNewFarmer, setShowNewFarmer] = useState(false);

  const [formData, setFormData] = useState({ farmerId: '', farmerName: '', farmerPhone: '', product: 'Starter Feed', qty: '', notes: '' });
  const [newFarmer, setNewFarmer] = useState({ name: '', phone: '', village: '', district: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const PRICES = { 'Starter Feed': 1200, 'Finisher Feed': 1500, 'Broiler Chicks': 40, 'Layer Chicks': 50, 'Premium Feed': 650, 'Vaccine Pack': 320 };

  const filtered = farmerOrders.filter(o => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.farmerName.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchProduct = productFilter === 'All' || o.product === productFilter;
    return matchSearch && matchStatus && matchProduct;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const qty = parseInt(formData.qty, 10);
    const unitPrice = PRICES[formData.product] || 0;
    addFarmerOrder({ farmerName: formData.farmerName, farmerPhone: formData.farmerPhone, farmerId: formData.farmerId, product: formData.product, qty, unitPrice, amount: qty * unitPrice, notes: formData.notes });
    addToast('Farmer order created successfully!', 'success');
    setFormData({ farmerId: '', farmerName: '', farmerPhone: '', product: 'Starter Feed', qty: '', notes: '' });
    setIsDrawerOpen(false);
  };

  const handleAddNewFarmer = () => {
    if (!newFarmer.name || !newFarmer.phone) return;
    addFarmer(newFarmer);
    setFormData(prev => ({ ...prev, farmerName: newFarmer.name, farmerPhone: newFarmer.phone }));
    setNewFarmer({ name: '', phone: '', village: '', district: '' });
    setShowNewFarmer(false);
    addToast('New farmer added!', 'success');
  };

  const selectFarmer = (f) => { setFormData(prev => ({ ...prev, farmerId: f.id, farmerName: f.name, farmerPhone: f.phone })); };

  const timelineSteps = [
    { label: 'Placed', icon: <Clock size={14} />, date: viewOrder?.date },
    { label: 'Accepted', icon: <CheckCircle size={14} />, date: viewOrder?.status !== 'Cancelled' && viewOrder?.status !== 'Pending' ? viewOrder?.date : null },
    { label: 'Delivered', icon: <CheckCircle size={14} />, date: viewOrder?.status === 'Delivered' ? viewOrder?.date : null },
  ];

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="h-96 skeleton" /></div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Farmer Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage orders from your farmers network</p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Create Order</button>
      </div>

      {/* Filters */}
      <div className="card-static mb-4">
        <div className="p-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by farmer, order ID, product..." className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-base w-auto text-sm py-2">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="input-base w-auto text-sm py-2">
            <option value="All">All Products</option>
            {Object.keys(PRICES).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-static flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto scrollbar-custom">
          <table className="w-full text-left min-w-[900px]">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10">
              <tr className="border-b border-gray-100 dark:border-gray-700">
                {['Order ID', 'Farmer', 'Phone', 'Product', 'Qty', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group">
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">{order.id}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{order.farmerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.farmerPhone || '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{order.product}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.qty}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(order.amount)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                  <td className="py-3 px-4"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  <td className="py-3 px-4 relative">
                    <button onClick={() => setMenuOpen(menuOpen === order.id ? null : order.id)} className="p-1 text-gray-400 hover:text-gray-600 rounded"><MoreVertical size={16} /></button>
                    {menuOpen === order.id && (
                      <div className="absolute right-4 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 w-44">
                        <button onClick={() => { setViewOrder(order); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><Eye size={14} /> View Details</button>
                        {order.status === 'Pending' && (
                          <>
                            <button onClick={() => { updateFarmerOrderStatus(order.id, 'Delivered'); addToast('Order marked as delivered', 'success'); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50"><CheckCircle size={14} /> Mark Delivered</button>
                            <button onClick={() => { updateFarmerOrderStatus(order.id, 'Cancelled'); addToast('Order cancelled', 'warning'); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><XCircle size={14} /> Cancel</button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Drawer */}
      <AnimatePresence>
        {viewOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewOrder(null)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">Order Details — {viewOrder.id}</h2>
                <button onClick={() => setViewOrder(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-custom">
                {/* Farmer info */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Farmer Information</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{viewOrder.farmerName}</p>
                  <p className="text-sm text-gray-500">{viewOrder.farmerPhone || 'No phone'}</p>
                </div>
                {/* Product */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Product Details</h3>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Product</span><span className="font-medium text-gray-800 dark:text-gray-200">{viewOrder.product}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Quantity</span><span className="font-medium">{viewOrder.qty}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Unit Price</span><span className="font-medium">{formatCurrencyFull(viewOrder.unitPrice || 0)}</span></div>
                  <div className="flex justify-between text-sm border-t pt-2 border-gray-200 dark:border-gray-600"><span className="font-semibold text-gray-800 dark:text-gray-200">Total</span><span className="font-bold text-green-600">{formatCurrencyFull(viewOrder.amount)}</span></div>
                </div>
                {/* Timeline */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Status Timeline</h3>
                  <div className="space-y-3">
                    {timelineSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${step.date ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>{step.icon}</div>
                        <div>
                          <p className={`text-sm font-medium ${step.date ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}`}>{step.label}</p>
                          {step.date && <p className="text-xs text-gray-400">{formatDate(step.date)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {viewOrder.notes && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3"><p className="text-sm text-amber-700 dark:text-amber-300">{viewOrder.notes}</p></div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Order Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col">
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-gray-900 dark:text-white">New Farmer Order</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 scrollbar-custom">
                <form id="create-form" onSubmit={handleCreate} className="space-y-4">
                  {/* Farmer select */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Farmer</label>
                    <select value={formData.farmerId} onChange={e => { const f = farmers.find(x => x.id === e.target.value); if (f) selectFarmer(f); }} className="input-base text-sm">
                      <option value="">Choose a farmer...</option>
                      {farmers.map(f => <option key={f.id} value={f.id}>{f.name} — {f.phone}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowNewFarmer(!showNewFarmer)} className="text-xs text-green-600 font-medium mt-1.5 hover:underline">+ Add New Farmer</button>
                  </div>

                  {showNewFarmer && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
                      <input type="text" value={newFarmer.name} onChange={e => setNewFarmer(prev => ({ ...prev, name: e.target.value }))} className="input-base text-sm" placeholder="Farmer Name" />
                      <input type="tel" value={newFarmer.phone} onChange={e => setNewFarmer(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} className="input-base text-sm" placeholder="Phone" />
                      <div className="flex gap-2">
                        <input type="text" value={newFarmer.village} onChange={e => setNewFarmer(prev => ({ ...prev, village: e.target.value }))} className="input-base text-sm" placeholder="Village" />
                        <input type="text" value={newFarmer.district} onChange={e => setNewFarmer(prev => ({ ...prev, district: e.target.value }))} className="input-base text-sm" placeholder="District" />
                      </div>
                      <button type="button" onClick={handleAddNewFarmer} className="btn-primary text-sm w-full py-2">Add Farmer</button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product</label>
                    <select value={formData.product} onChange={e => setFormData(prev => ({ ...prev, product: e.target.value }))} className="input-base text-sm">
                      {Object.entries(PRICES).map(([p, price]) => <option key={p} value={p}>{p} — {formatCurrencyFull(price)}/unit</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
                    <input type="number" required min="1" value={formData.qty} onChange={e => setFormData(prev => ({ ...prev, qty: e.target.value }))} className="input-base text-sm" placeholder="Enter quantity" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="input-base text-sm resize-none" rows={2} placeholder="Optional notes..." />
                  </div>
                  {formData.qty && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Unit Price</span><span>{formatCurrencyFull(PRICES[formData.product])}</span></div>
                      <div className="flex justify-between text-lg font-bold text-green-700 dark:text-green-400 mt-1 pt-1 border-t border-green-200 dark:border-green-800/50"><span>Total</span><span>{formatCurrencyFull(parseInt(formData.qty || 0) * PRICES[formData.product])}</span></div>
                    </div>
                  )}
                </form>
              </div>
              <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                <button form="create-form" type="submit" className="w-full btn-primary py-2.5" disabled={!formData.farmerName || !formData.qty}>Create Order</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
