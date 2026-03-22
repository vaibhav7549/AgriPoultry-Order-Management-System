import React from 'react';
import { Store, PackageSearch, Truck, IndianRupee, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';

const LIVE_FEED = [
  { id: 1, time: '2 mins ago', message: 'Agro Distributors Ltd placed an order for 5000 Chicks', type: 'order' },
  { id: 2, time: '15 mins ago', message: 'City Hatcheries order #BO-2002 updated to Processing', type: 'status' },
  { id: 3, time: '1 hour ago', message: 'Payment of ₹220,000 received from Farm Connect', type: 'payment' },
  { id: 4, time: '2 hours ago', message: 'Driver Ramesh dispatched for Route A shipments', type: 'logistics' },
  { id: 5, time: '3 hours ago', message: 'New Distributor registered: Valley Supplies', type: 'system' },
];

export default function CompanyDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Master Control</h1>
        <p className="text-slate-500 dark:text-gray-400">High-level overview of fulfillment operations and active network.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <motion.div variants={itemVariants} className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Store size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Active Distributors</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">48</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
            <PackageSearch size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Pending Bulk Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">14</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600 dark:text-primary-400">
            <Truck size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Units Shipped YTD</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1.2M+</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card p-6 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Gross Revenue YTD</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹45.2M</h3>
          </div>
        </motion.div>
      </motion.div>

      {/* Live Fulfillment Feed */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="p-4 bg-slate-50 dark:bg-gray-800/80 border-b border-slate-200 dark:border-gray-700 flex items-center gap-3">
          <BellRing className="text-primary-500 animate-pulse" size={20} />
          <h2 className="font-bold text-slate-900 dark:text-white flex-1">Live Operation Feed</h2>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </div>
        
        <div className="relative h-[300px] overflow-hidden bg-white dark:bg-gray-800">
          {/* Fading borders for continuous scroll effect visually */}
          <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10 pointers-events-none" />
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10 pointers-events-none" />
          
          <div className="p-6 h-full overflow-y-auto scrollbar-custom space-y-4">
            {LIVE_FEED.map((feed) => (
              <div key={feed.id} className="flex gap-4 items-start relative before:absolute before:left-2 before:top-8 before:bottom-[-24px] before:w-[2px] before:bg-slate-100 dark:before:bg-gray-700 last:before:hidden">
                <div className="relative z-10 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 mt-1 shadow-sm shrink-0
                  ${feed.type === 'order' ? 'bg-amber-400' : feed.type === 'payment' ? 'bg-green-500' : feed.type === 'status' ? 'bg-blue-400' : 'bg-slate-400'}
                " style={{
                  backgroundColor: feed.type === 'order' ? '#FBBF24' : feed.type === 'payment' ? '#10B981' : feed.type === 'status' ? '#60A5FA' : '#94A3B8'
                }} />
                <div>
                  <p className="font-medium text-slate-800 dark:text-gray-200">{feed.message}</p>
                  <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">{feed.time}</span>
                </div>
              </div>
            ))}
            <div className="text-center text-sm text-slate-400 dark:text-gray-600 pt-4">End of recent activity</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
