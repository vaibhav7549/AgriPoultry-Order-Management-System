import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../lib/store';
import { ShoppingCart, IndianRupee, Clock, PackageCheck, Phone, MapPin, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyFull, getStatusColor, formatDate } from '../../utils/helpers';

export default function FarmerDashboard() {
  const { currentUser, users } = useAuth();
  const farmerOrders = useStore(s => s.farmerOrders);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  // Filter orders specific to this farmer, though mock data doesn't strictly associate all items by ID right now.
  // For UI, we'll just show all from FARMER_PORTAL_ORDERS assuming they belong to the current user as per dummy data.
  const myOrders = farmerOrders || [];
  
  const pendingCount = myOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const deliveredCount = myOrders.filter(o => o.status === 'Delivered').length;
  const totalSpent = myOrders.reduce((acc, o) => acc + o.totalValue, 0);

  const myDistributor = users?.find(u => u.id === currentUser?.assignedDistributorId);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 skeleton w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 skeleton" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 skeleton" />
          <div className="h-80 skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Namaste, {currentUser?.name} 🙏</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your farm's orders and supplies with ease.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/farmer/place-order')} className="btn-primary flex items-center gap-2 text-sm">
            <ShoppingCart size={16} /> Order Supplies
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} onClick={() => navigate('/farmer/my-orders')} className="card-static p-5 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{myOrders.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400"><ShoppingCart size={22} /></div>
          </div>
          <div className="mt-3"><button onClick={() => navigate('/farmer/my-orders')} className="text-blue-500 font-semibold text-sm hover:underline">View History</button></div>
        </motion.div>

        <motion.div variants={itemVariants} onClick={() => navigate('/farmer/my-orders', { state: { statusFilter: 'Pending' } })} className="card-static p-5 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><Clock size={22} /></div>
          </div>
          <div className="mt-3"><span className="text-amber-500 font-semibold text-sm">Awaiting delivery</span></div>
        </motion.div>

        <motion.div variants={itemVariants} onClick={() => navigate('/farmer/my-orders', { state: { statusFilter: 'Delivered' } })} className="card-static p-5 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{deliveredCount}</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><PackageCheck size={22} /></div>
          </div>
          <div className="mt-3"><span className="text-green-600 font-semibold text-sm">Completed</span></div>
        </motion.div>

        <motion.div variants={itemVariants} onClick={() => navigate('/farmer/my-orders')} className="card-static p-5 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrencyFull(totalSpent)}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400"><IndianRupee size={22} /></div>
          </div>
          <div className="mt-3"><span className="text-gray-400 text-sm">Lifetime value</span></div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 card-static overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <button onClick={() => navigate('/farmer/my-orders')} className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left min-w-[500px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Order ID', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {myOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(order.totalValue)}</td>
                    <td className="py-3 px-4"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                  </tr>
                ))}
                {myOrders.length === 0 && (
                  <tr><td colSpan="4" className="py-6 text-center text-gray-500 text-sm">No orders found. Start by placing an order!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Distributor Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-static p-0 flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-green-200 dark:border-green-700">
              <Building2 size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">Your Distributor</h2>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Assigned Partner</p>
          </div>
          
          <div className="p-5 flex-1 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{myDistributor?.name || 'Distributor'}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {myDistributor?.region || '-'}</p>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0"><Phone size={14} /></div>
                <div>
                  <p className="text-gray-500 text-xs">Contact Number</p>
                    <p className="font-medium text-gray-900 dark:text-white">{myDistributor?.phone || '-'}</p>
                </div>
              </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0"><span className="text-xs font-bold">@</span></div>
                  <div>
                    <p className="text-gray-500 text-xs">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{myDistributor?.email || '-'}</p>
                  </div>
                </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0"><Clock size={14} /></div>
                <div>
                  <p className="text-gray-500 text-xs">Working Hours</p>
                  <p className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full btn-outline border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20 py-2 flex justify-center items-center gap-2">
                <Phone size={16} /> Call Distributor
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
