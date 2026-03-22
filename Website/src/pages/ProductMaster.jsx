import React, { useState } from 'react';
import { Edit3, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Starter Feed', companyPrice: 1000, distPrice: 1200, img: '🌾', stock: 'High' },
  { id: 'p2', name: 'Finisher Feed', companyPrice: 1300, distPrice: 1500, img: '🌾', stock: 'Medium' },
  { id: 'p3', name: 'Broiler Chicks', companyPrice: 32, distPrice: 40, img: '🐣', stock: 'Low' },
  { id: 'p4', name: 'Layer Chicks', companyPrice: 40, distPrice: 50, img: '🐥', stock: 'High' },
];

export default function ProductMaster() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePriceUpdate = (id, newCompany, newDist) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, companyPrice: newCompany, distPrice: newDist } : p));
    toggleFlip(id);
    
    // Simulate notification
    alert('Simulated Notification: Pricing updated. Push notification sent to all active Distributors.');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Product & Price Master</h1>
          <p className="text-slate-500 dark:text-gray-400">Manage base inventory pricing. Updates dynamically sync to distributors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 perspective-1000">
        {products.map(product => {
          const isFlipped = !!flippedCards[product.id];

          return (
            <div key={product.id} className="relative h-80 w-full group perspective" style={{ perspective: '1000px' }}>
              <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                
                {/* Front Side */}
                <div className="absolute inset-0 backface-hidden w-full h-full card p-6 flex flex-col justify-between" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="flex justify-between items-start">
                    <div className="text-5xl filter drop-shadow-sm">{product.img}</div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${product.stock === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : product.stock === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <div className="text-center mt-4 flex-1 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h3>
                  </div>

                  <div className="space-y-2 mb-4 bg-slate-50 dark:bg-gray-900/50 p-3 rounded-lg border border-slate-100 dark:border-gray-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Base Price:</span>
                      <span className="font-bold text-primary-600 dark:text-primary-400">₹{product.companyPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Sugg. Dist Price:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">₹{product.distPrice}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleFlip(product.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors font-medium text-sm"
                  >
                    <Edit3 size={16} /> Edit Pricing
                  </button>
                </div>

                {/* Back Side (Edit Form) */}
                <div className="absolute inset-0 backface-hidden w-full h-full card p-6 flex flex-col justify-between" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {product.img} Edit {product.name}
                    </h3>
                  </div>

                  <form 
                    className="flex-1 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePriceUpdate(
                         product.id, 
                         e.target.elements.companyPrice.value, 
                         e.target.elements.distPrice.value
                      );
                    }}
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1">Company Base Price (₹)</label>
                      <input 
                        type="number" 
                        name="companyPrice"
                        defaultValue={product.companyPrice} 
                        className="input-base py-1.5 text-sm" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1">Suggested Dist Price (₹)</label>
                      <input 
                        type="number" 
                        name="distPrice"
                        defaultValue={product.distPrice} 
                        className="input-base py-1.5 text-sm" 
                        required 
                      />
                    </div>
                    
                    <div className="pt-2 flex gap-2">
                      <button 
                        type="button"
                        onClick={() => toggleFlip(product.id)}
                        className="flex-1 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex justify-center items-center"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button 
                        type="submit"
                        className="flex-[3] btn-primary py-2 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Update
                      </button>
                    </div>
                  </form>
                </div>

              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
