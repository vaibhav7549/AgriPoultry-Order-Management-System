import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { ShoppingCart, Plus, Minus, Send, CheckCircle2, PackageSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  { id: 'p1', name: 'Starter Feed', category: 'Feed', companyPrice: 1000, img: '🌾' },
  { id: 'p2', name: 'Finisher Feed', category: 'Feed', companyPrice: 1300, img: '🌾' },
  { id: 'p3', name: 'Broiler Chicks', category: 'Chicks', companyPrice: 32, img: '🐣' },
  { id: 'p4', name: 'Layer Chicks', category: 'Chicks', companyPrice: 40, img: '🐥' },
];

export default function BulkOrdering() {
  const { bulkDraft, addToBulkDraft, submitBulkDraft, clearBulkDraft } = useStore();
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddToCart = (product) => {
    addToBulkDraft({ ...product, qty: product.category === 'Feed' ? 10 : 500 });
  };

  const handleCheckout = () => {
    if (bulkDraft.length === 0) return;
    submitBulkDraft();
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000); // 4 seconds of triumph
  };

  const cartTotal = bulkDraft.reduce((acc, item) => acc + (item.companyPrice * item.qty), 0);

  return (
    <div className="h-full flex flex-col">
      {/* Confetti Celebration Overlay */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Order Sent!</h2>
              <p className="text-slate-500 dark:text-gray-400">Your bulk order has been successfully sent to the Company for processing.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 border-b border-slate-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bulk Ordering</h1>
        <p className="text-slate-500 dark:text-gray-400">Request bulk supplies directly from the AgriPoultry Company.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Pane - Catalog */}
        <div className="w-full lg:w-2/3 flex flex-col h-[500px] lg:h-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto scrollbar-custom pb-4 pr-2">
            {PRODUCTS.map(product => (
              <div key={product.id} className="card p-5 flex flex-col justify-between group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {product.img}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-md">
                    {product.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{product.name}</h3>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                      ₹{product.companyPrice} <span className="text-sm font-normal text-slate-500">/unit</span>
                    </p>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-colors p-2 rounded-lg"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Draft Cart */}
        <div className="w-full lg:w-1/3 flex flex-col card overflow-hidden shrink-0">
          <div className="p-4 bg-slate-50 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 flex items-center gap-3">
             <ShoppingCart className="text-primary-500" />
             <h2 className="font-bold text-slate-900 dark:text-white flex-1">Draft Order</h2>
             <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-xs font-bold px-2 py-1 rounded-full">
               {bulkDraft.length} Items
             </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-custom bg-white dark:bg-gray-800">
            {bulkDraft.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 p-6 text-center">
                <PackageSearch size={48} className="mb-4 opacity-50" />
                <p>Your draft is empty. Add products from the catalog to build your order.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {bulkDraft.map((item, idx) => (
                    <motion.div 
                      key={item.id + idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 border border-slate-100 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-gray-800/50"
                    >
                      <div>
                         <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.name}</p>
                         <p className="text-xs text-slate-500">Vol: {item.qty} units</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-slate-900 dark:text-white text-sm">₹{(item.companyPrice * item.qty).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-gray-800/80 border-t border-slate-200 dark:border-gray-700">
             <div className="flex justify-between items-center mb-4">
               <span className="text-slate-600 dark:text-gray-400 font-medium">Total Estimate</span>
               <span className="text-xl font-bold text-primary-600 dark:text-primary-400">₹{cartTotal.toLocaleString()}</span>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={clearBulkDraft}
                 disabled={bulkDraft.length === 0}
                 className="px-4 py-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
               >
                 Clear
               </button>
               <button 
                 onClick={handleCheckout}
                 disabled={bulkDraft.length === 0}
                 className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
               >
                 <Send size={18} />
                 Send to Company
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
