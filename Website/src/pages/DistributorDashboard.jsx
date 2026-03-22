import React from 'react';
import { useStore } from '../lib/store';
import { Users, Clock, IndianRupee, FileText, Plus, FilePlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const chartData = [
  { name: 'Mon', orders: 12, revenue: 4000 },
  { name: 'Tue', orders: 19, revenue: 7000 },
  { name: 'Wed', orders: 15, revenue: 5500 },
  { name: 'Thu', orders: 25, revenue: 9500 },
  { name: 'Fri', orders: 22, revenue: 8000 },
  { name: 'Sat', orders: 30, revenue: 11000 },
  { name: 'Sun', orders: 28, revenue: 10500 },
];

export default function DistributorDashboard() {
  const user = useStore(state => state.user);
  const farmerOrders = useStore(state => state.farmerOrders);

  const pendingOrders = farmerOrders.filter(o => o.status === 'Pending').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-slate-500 dark:text-gray-400">Here's what's happening today in your distribution network.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Plus size={18} />
            Log Farmer Order
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FilePlus size={18} />
            Draft Bulk Order
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Metric Cards */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Farmers Managed</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">124</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-primary-500 font-medium">+12%</span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Pending Orders</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{pendingOrders}</h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-amber-500 font-medium">Needs attention</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">₹1.2M</h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              <IndianRupee size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-primary-500 font-medium">+8%</span>
            <span className="text-slate-400 ml-2">from last month</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Due to Company</p>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">₹450K</h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
              <FileText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
             <button className="text-red-500 dark:text-red-400 font-medium hover:underline">Pay Now</button>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 h-[400px]"
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Recent Activity (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#0f172a', fontWeight: '500' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Revenue (₹)" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
