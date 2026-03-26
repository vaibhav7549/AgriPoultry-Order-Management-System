import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Plus, Minus, Send, X, PackageSearch, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull, formatDate, getStatusColor } from '../utils/helpers';
import { PRODUCTS } from '../data/mockData';

export default function BulkOrdering() {
  const { currentUser } = useAuth();
  const { bulkDraft, addToBulkDraft, updateDraftQty, removeDraftItem, clearBulkDraft, submitBulkDraft, bulkOrderHistory } = useStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const subtotal = bulkDraft.reduce((acc, item) => acc + (item.basePrice * item.qty), 0);
  const gst = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gst;

  const handleAddToCart = (product) => {
    const defaultQty = product.category === 'Feed' ? 10 : product.category === 'Chicks' ? 500 : 5;
    addToBulkDraft({ ...product, qty: defaultQty });
    addToast(`${product.name} added to draft`, 'success');
  };

  const handleSubmit = () => {
    submitBulkDraft(currentUser?.name);
    setShowConfirm(false);
    addToast('Bulk order sent to AgriPoultry Corp!', 'success');
  };

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="h-96 skeleton" /></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Bulk Ordering</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Request bulk supplies from AgriPoultry Company</p>
        </div>
        <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {[{ key: 'catalog', label: 'Catalog', icon: <ShoppingCart size={14} /> }, { key: 'history', label: 'History', icon: <History size={14} /> }].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Product catalog */}
          <div className="w-full lg:w-2/3 overflow-y-auto scrollbar-custom pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRODUCTS.map(product => {
                const inDraft = bulkDraft.find(d => d.id === product.id);
                return (
                  <div key={product.id} className="card-static p-4 flex flex-col justify-between group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl group-hover:scale-110 transition-transform">{product.emoji}</div>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">{product.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                    <div className="flex items-end justify-between mt-3">
                      <p className="text-green-600 dark:text-green-400 font-bold text-lg">
                        {formatCurrencyFull(product.basePrice)} <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
                      </p>
                      {inDraft ? (
                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 rounded-lg px-1">
                          <button onClick={() => updateDraftQty(product.id, inDraft.qty - 1)} className="p-1 text-green-600 hover:bg-green-100 rounded"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-bold text-green-700 dark:text-green-400">{inDraft.qty}</span>
                          <button onClick={() => updateDraftQty(product.id, inDraft.qty + 1)} className="p-1 text-green-600 hover:bg-green-100 rounded"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(product)} className="text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-500 hover:text-white p-2 rounded-lg transition-all"><Plus size={18} /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Draft Panel */}
          <div className="w-full lg:w-1/3 flex flex-col card-static overflow-hidden shrink-0 lg:sticky lg:top-0 lg:max-h-[calc(100vh-180px)]">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <ShoppingCart className="text-green-500" size={18} />
              <h2 className="font-heading font-semibold text-gray-900 dark:text-white flex-1 text-sm">Draft Order</h2>
              <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded-full">{bulkDraft.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 scrollbar-custom">
              {bulkDraft.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                  <PackageSearch size={40} className="mb-3 opacity-50" />
                  <p className="text-sm">Your draft is empty. Add products from the catalog.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bulkDraft.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatCurrencyFull(item.basePrice)} × {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateDraftQty(item.id, item.qty - 1)} className="p-0.5 text-gray-400 hover:text-gray-600 rounded"><Minus size={12} /></button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button onClick={() => updateDraftQty(item.id, item.qty + 1)} className="p-0.5 text-gray-400 hover:text-gray-600 rounded"><Plus size={12} /></button>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">{formatCurrencyFull(item.basePrice * item.qty)}</p>
                      <button onClick={() => removeDraftItem(item.id)} className="p-1 text-gray-400 hover:text-red-500"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>{formatCurrencyFull(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>GST (5%)</span><span>{formatCurrencyFull(gst)}</span></div>
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-600 pt-2"><span>Grand Total</span><span className="text-green-600">{formatCurrencyFull(grandTotal)}</span></div>
              <div className="flex gap-2 pt-1">
                <button onClick={clearBulkDraft} disabled={!bulkDraft.length} className="px-3 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50 transition-all"><Trash2 size={14} /></button>
                <button onClick={() => setShowConfirm(true)} disabled={!bulkDraft.length} className="flex-1 btn-primary flex items-center justify-center gap-2 py-2 text-sm"><Send size={14} /> Send to Company</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order History */
        <div className="card-static overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Order ID', 'Date', 'Items', 'Total Value', 'Status'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {bulkOrderHistory.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.items?.length || 0} items</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(order.totalValue)}</td>
                    <td className="py-3 px-4"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">Confirm Order</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Send bulk order of <span className="font-bold text-green-600">{formatCurrencyFull(grandTotal)}</span> to AgriPoultry Corp?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">Confirm & Send</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
