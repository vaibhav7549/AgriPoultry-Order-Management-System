import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { useToast } from '../context/ToastContext';
import { Edit3, Plus, Save, X, AlertTriangle, History, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull } from '../utils/helpers';

const EMOJIS = ['🌾', '🐣', '🐥', '🌿', '💉', '🥚', '🐔', '🌽', '🥜', '🧪', '📦', '🏥'];

export default function ProductMaster() {
  const { products, updateProduct, addProduct } = useStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSpecific, setShowSpecific] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', unit: 'bags', costPrice: '', suggestedDistributorPrice: '', suggestedFarmerPrice: '', stock: 'Medium', emoji: '📦', minOrder: '', category: 'Feed' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const startEdit = (product) => { setEditingId(product.id); setEditForm({ costPrice: product.costPrice, suggestedDistributorPrice: product.suggestedDistributorPrice, suggestedFarmerPrice: product.suggestedFarmerPrice, stock: product.stock, minOrder: product.minOrder }); };

  const saveEdit = () => {
    updateProduct(editingId, { costPrice: Number(editForm.costPrice), suggestedDistributorPrice: Number(editForm.suggestedDistributorPrice), suggestedFarmerPrice: Number(editForm.suggestedFarmerPrice), stock: editForm.stock, minOrder: Number(editForm.minOrder) });
    addToast('Pricing updated and synced to distributors', 'success');
    setEditingId(null);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    addProduct({ ...newProduct, costPrice: Number(newProduct.costPrice), suggestedDistributorPrice: Number(newProduct.suggestedDistributorPrice), suggestedFarmerPrice: Number(newProduct.suggestedFarmerPrice), minOrder: Number(newProduct.minOrder) });
    addToast('New product added successfully', 'success');
    setShowAddModal(false);
    setNewProduct({ name: '', description: '', unit: 'bags', costPrice: '', suggestedDistributorPrice: '', suggestedFarmerPrice: '', stock: 'Medium', emoji: '📦', minOrder: '', category: 'Feed' });
  };

  const lowStockProducts = products.filter(p => p.stock === 'Low');

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-64 skeleton" />)}</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Product & Price Master</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage base inventory pricing. Updates sync to distributors.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16} /> Add Product</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {products.map(product => {
              const isEditing = editingId === product.id;

              return (
                <div key={product.id} className="card-static p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-3xl">{product.emoji}</div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${product.stock === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.stock}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{product.name}</h3>

                    {isEditing ? (
                      <div className="space-y-2 mt-3">
                        <div><label className="text-xs text-gray-500">Cost Price (₹)</label>
                          <input type="number" value={editForm.costPrice} onChange={e => setEditForm(f => ({ ...f, costPrice: e.target.value }))} className="input-base text-sm py-1.5" /></div>
                        <div><label className="text-xs text-gray-500">Sugg. Dist Price (₹)</label>
                          <input type="number" value={editForm.suggestedDistributorPrice} onChange={e => setEditForm(f => ({ ...f, suggestedDistributorPrice: e.target.value }))} className="input-base text-sm py-1.5" /></div>
                        <div><label className="text-xs text-gray-500">Sugg. Farmer Price (₹)</label>
                          <input type="number" value={editForm.suggestedFarmerPrice} onChange={e => setEditForm(f => ({ ...f, suggestedFarmerPrice: e.target.value }))} className="input-base text-sm py-1.5" /></div>
                        <div><label className="text-xs text-gray-500">Stock Level</label>
                          <select value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))} className="input-base text-sm py-1.5">
                            <option>High</option><option>Medium</option><option>Low</option>
                          </select></div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => setEditingId(null)} className="flex-1 btn-outline text-sm py-1.5"><X size={14} className="inline mr-1" />Cancel</button>
                          <button onClick={saveEdit} className="flex-1 btn-primary text-sm py-1.5"><Save size={14} className="inline mr-1" />Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1.5 mt-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Cost Price</span><span className="font-bold text-red-600">{formatCurrencyFull(product.costPrice || 0)}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Sugg. Dist</span><span className="font-bold text-gray-700 dark:text-gray-200">{formatCurrencyFull(product.suggestedDistributorPrice || 0)}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-gray-500">Sugg. Farmer</span><span className="font-bold text-green-600">{formatCurrencyFull(product.suggestedFarmerPrice || 0)}</span></div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => startEdit(product)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 font-medium transition-colors"><Edit3 size={14} /> Edit</button>
                          <button onClick={() => setShowSpecific(product)} className="flex-1 py-1.5 text-xs text-blue-600 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">Custom Prices</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inventory Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="lg:w-64 shrink-0">
            <div className="card-static p-4 sticky top-4">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={16} className="text-red-500" /><h3 className="font-heading font-semibold text-gray-900 dark:text-white text-sm">Low Stock Alerts</h3></div>
              <div className="space-y-2">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">{p.emoji} {p.name}</p>
                    <button className="text-xs text-red-600 font-medium hover:underline mt-1">Restock</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-custom">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <form onSubmit={handleAddProduct} className="p-5 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setNewProduct(p => ({ ...p, emoji: e }))} className={`text-xl p-1.5 rounded-lg border-2 transition-all ${newProduct.emoji === e ? 'border-green-500 bg-green-50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>{e}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Name</label><input required value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} className="input-base text-sm" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label><input value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className="input-base text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Category</label><select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className="input-base text-sm"><option>Feed</option><option>Chicks</option><option>Healthcare</option></select></div>
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Unit</label><select value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} className="input-base text-sm"><option value="bags">Bags</option><option value="chicks">Chicks</option><option value="packs">Packs</option></select></div>
                </div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Cost Price (₹)</label><input required type="number" value={newProduct.costPrice} onChange={e => setNewProduct(p => ({ ...p, costPrice: e.target.value }))} className="input-base text-sm" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Sugg. Dist (₹)</label><input required type="number" value={newProduct.suggestedDistributorPrice} onChange={e => setNewProduct(p => ({ ...p, suggestedDistributorPrice: e.target.value }))} className="input-base text-sm" /></div>
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Sugg. Farmer (₹)</label><input required type="number" value={newProduct.suggestedFarmerPrice} onChange={e => setNewProduct(p => ({ ...p, suggestedFarmerPrice: e.target.value }))} className="input-base text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Stock</label><select value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} className="input-base text-sm"><option>High</option><option>Medium</option><option>Low</option></select></div>
                  <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Min Order</label><input type="number" value={newProduct.minOrder} onChange={e => setNewProduct(p => ({ ...p, minOrder: e.target.value }))} className="input-base text-sm" /></div>
                </div>
                <button type="submit" className="w-full btn-primary py-2.5 mt-2">Add Product</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price History Modal */}
      {/* Specific Prices Modal */}
      <AnimatePresence>
        {showSpecific && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Custom Pricing — {showSpecific.name}</h3>
                <button onClick={() => setShowSpecific(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-custom">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Distributor Prices</h4>
                  {Object.entries(showSpecific.distributorPrices || {}).map(([id, price]) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm mb-2">
                       <span className="text-gray-600 dark:text-gray-400 font-medium">{id}</span>
                       <span className="text-gray-900 dark:text-white font-bold">{formatCurrencyFull(price)}</span>
                    </div>
                  ))}
                  {Object.keys(showSpecific.distributorPrices || {}).length === 0 && <p className="text-xs text-gray-500">No custom distributor prices.</p>}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">Farmer Prices</h4>
                  {Object.entries(showSpecific.farmerPrices || {}).map(([id, price]) => (
                    <div key={id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm mb-2">
                       <span className="text-gray-600 dark:text-gray-400 font-medium">{id}</span>
                       <span className="text-gray-900 dark:text-white font-bold">{formatCurrencyFull(price)}</span>
                    </div>
                  ))}
                  {Object.keys(showSpecific.farmerPrices || {}).length === 0 && <p className="text-xs text-gray-500">No custom farmer prices.</p>}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <button onClick={() => setShowSpecific(null)} className="w-full btn-primary py-2.5">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
