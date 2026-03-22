import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Plus, X, Search, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FarmerOrders() {
  const farmerOrders = useStore(state => state.farmerOrders);
  const addFarmerOrder = useStore(state => state.addFarmerOrder);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({ farmerName: '', product: 'Starter Feed', qty: '' });

  const PRICES = {
    'Starter Feed': 1200,
    'Finisher Feed': 1500,
    'Broiler Chicks': 40,
    'Layer Chicks': 50
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const qty = parseInt(formData.qty, 10);
    const amount = qty * PRICES[formData.product];
    addFarmerOrder({ farmerName: formData.farmerName, product: formData.product, qty, amount });
    setFormData({ farmerName: '', product: 'Starter Feed', qty: '' });
    setIsDrawerOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Farmer Orders</h1>
          <p className="text-slate-500 dark:text-gray-400">Manage orders requested by farmers.</p>
        </div>
        <button onClick={() => setIsDrawerOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Order
        </button>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between bg-slate-50/50 dark:bg-gray-800/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto rounded-b-xl scrollbar-custom">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
              <tr>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Order ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Farmer Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Product</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Qty</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Total Amount</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700">Status</th>
                <th className="py-4 px-6 font-semibold text-slate-600 dark:text-gray-300 text-sm border-b border-slate-200 dark:border-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/50">
              {farmerOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-700/20 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-slate-900 dark:text-white">{order.id}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-300 font-medium">{order.farmerName}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-400">{order.product}</td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-gray-400">{order.qty}</td>
                  <td className="py-4 px-6 text-sm text-slate-900 dark:text-white font-medium">₹{order.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' : 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Edit">
                          <Edit2 size={16} />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30" title="Mark Paid">
                          <CheckCircle size={16} />
                       </button>
                       <button className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {farmerOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-gray-400">
              No orders found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Sliding Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-slate-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Farmer Order</h2>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-custom">
                <form id="drawer-form" onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Farmer Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.farmerName}
                      onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                      className="input-base" 
                      placeholder="e.g. Ramu Kaka" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Product</label>
                    <select 
                      value={formData.product}
                      onChange={(e) => setFormData({...formData, product: e.target.value})}
                      className="input-base"
                    >
                      <optgroup label="Feed">
                        <option value="Starter Feed">Starter Feed (₹1200/bag)</option>
                        <option value="Finisher Feed">Finisher Feed (₹1500/bag)</option>
                      </optgroup>
                      <optgroup label="Chicks">
                        <option value="Broiler Chicks">Broiler Chicks (₹40/bird)</option>
                        <option value="Layer Chicks">Layer Chicks (₹50/bird)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Quantity</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: e.target.value})}
                      className="input-base" 
                      placeholder="Amount" 
                    />
                  </div>

                  {formData.qty && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
                      <div className="flex justify-between items-center text-sm mb-1 text-slate-600 dark:text-gray-400">
                        <span>Unit Price:</span>
                        <span>₹{PRICES[formData.product]}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg text-primary-700 dark:text-primary-400 mt-2 pt-2 border-t border-primary-200 dark:border-primary-800/50">
                        <span>Total Calculation:</span>
                        <span>₹{(parseInt(formData.qty, 10) * PRICES[formData.product]).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/80">
                <button form="drawer-form" type="submit" className="w-full btn-primary py-3">
                  Create Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
