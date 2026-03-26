import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../lib/store';
import { Users, Clock, IndianRupee, FileText, Plus, FilePlus, UserPlus, BarChart3, Download, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WEEKLY_ACTIVITY } from '../data/mockData';
import { formatCurrencyFull, getStatusColor } from '../utils/helpers';

const ORDER_STATUS_DATA = [
  { name: 'Pending', value: 4, color: '#f59e0b' },
  { name: 'Fulfilled', value: 6, color: '#22c55e' },
  { name: 'Cancelled', value: 2, color: '#ef4444' },
];

export default function DistributorDashboard() {
  const { currentUser } = useAuth();
  const farmerOrders = useStore(s => s.farmerOrders);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const pendingOrders = farmerOrders.filter(o => o.status === 'Pending').length;

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 skeleton w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 skeleton" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 skeleton" /><div className="h-80 skeleton" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Welcome back, {currentUser?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening today in your distribution network.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/farmer-orders')} className="btn-secondary flex items-center gap-2 text-sm">
            <Plus size={16} /> Log Farmer Order
          </button>
          <button onClick={() => navigate('/bulk-ordering')} className="btn-primary flex items-center gap-2 text-sm">
            <FilePlus size={16} /> Draft Bulk Order
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="card-static p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Farmers Managed</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">124</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400"><Users size={22} /></div>
          </div>
          <div className="mt-3 flex items-center text-sm"><span className="text-green-600 font-semibold">+12%</span><span className="text-gray-400 ml-2">from last month</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-static p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Orders</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{pendingOrders}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><Clock size={22} /></div>
          </div>
          <div className="mt-3"><span className="text-amber-500 font-semibold text-sm">Needs attention</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-static p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹1.2M</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><IndianRupee size={22} /></div>
          </div>
          <div className="mt-3 flex items-center text-sm"><span className="text-green-600 font-semibold">+8%</span><span className="text-gray-400 ml-2">from last month</span></div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-static p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due to Company</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹450K</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400"><FileText size={22} /></div>
          </div>
          <div className="mt-3"><button onClick={() => navigate('/ledger')} className="text-red-500 font-semibold text-sm hover:underline">Pay Now</button></div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-static p-5">
          <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Recent Activity (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_ACTIVITY} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-static p-5">
          <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Order Status Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ORDER_STATUS_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {ORDER_STATUS_DATA.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Farmer Orders Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-static overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-heading font-semibold text-gray-900 dark:text-white">Recent Farmer Orders</h2>
          <button onClick={() => navigate('/farmer-orders')} className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead><tr className="border-b border-gray-100 dark:border-gray-700">
              {['Order ID', 'Farmer', 'Product', 'Qty', 'Amount', 'Status'].map(h => (
                <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {farmerOrders.slice(0, 5).map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{order.farmerName}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{order.product}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{order.qty}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(order.amount)}</td>
                  <td className="py-3 px-4"><span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: <UserPlus size={22} />, label: 'Add Farmer', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30', action: () => navigate('/farmer-orders') },
          { icon: <BarChart3 size={22} />, label: 'View Reports', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30', action: () => navigate('/ledger') },
          { icon: <Download size={22} />, label: 'Download Invoice', color: 'text-green-600 bg-green-50 dark:bg-green-900/30', action: () => {} },
          { icon: <Phone size={22} />, label: 'Contact Support', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30', action: () => {} },
        ].map((item, i) => (
          <button key={i} onClick={item.action} className="card-static p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all group cursor-pointer">
            <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
