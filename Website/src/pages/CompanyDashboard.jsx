import React, { useState, useEffect, useRef } from 'react';
import { Store, PackageSearch, Truck, IndianRupee, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LIVE_FEED_EVENTS, MONTHLY_REVENUE, TOP_DISTRIBUTORS } from '../data/mockData';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedIdx, setFeedIdx] = useState(0);
  const [visibleFeeds, setVisibleFeeds] = useState(LIVE_FEED_EVENTS.slice(0, 6));
  const feedRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  // Auto-scroll live feed
  useEffect(() => {
    const interval = setInterval(() => {
      setFeedIdx(prev => {
        const next = (prev + 1) % LIVE_FEED_EVENTS.length;
        const newItem = LIVE_FEED_EVENTS[next];
        setVisibleFeeds(prevFeeds => [newItem, ...prevFeeds.slice(0, 7)]);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const feedDotColor = (type) => {
    if (type === 'order') return 'bg-amber-400';
    if (type === 'payment') return 'bg-green-500';
    if (type === 'status') return 'bg-blue-400';
    if (type === 'dispatch') return 'bg-gray-400';
    return 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 skeleton w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton" />)}
        </div>
        <div className="h-72 skeleton" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Master Control</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">High-level overview of fulfillment operations and active network.</p>
      </div>

      {/* Stat Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Distributors', value: '48', icon: <Store size={24} />, bg: 'bg-indigo-50 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', path: '/distributor-ledger' },
          { label: 'Pending Bulk Orders', value: '14', icon: <PackageSearch size={24} />, bg: 'bg-amber-50 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', path: '/kanban-fulfillment' },
          { label: 'Units Shipped YTD', value: '1.2M+', icon: <Truck size={24} />, bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', path: '/kanban-fulfillment' },
          { label: 'Gross Revenue YTD', value: '₹45.2M', icon: <IndianRupee size={24} />, bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', path: '/distributor-ledger' },
        ].map((card, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants} 
            onClick={() => navigate(card.path)}
            className="card-static p-5 flex items-center gap-4 cursor-pointer hover:ring-2 hover:ring-green-500 transition-all hover:-translate-y-1"
          >
            <div className={`p-3 rounded-2xl ${card.bg} ${card.text}`}>{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Live Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-static overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <BellRing className="text-green-500 animate-pulse" size={18} />
          <h2 className="font-heading font-semibold text-gray-900 dark:text-white flex-1">Live Operation Feed</h2>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
        </div>
        <div ref={feedRef} className="relative h-72 overflow-hidden bg-white dark:bg-gray-800">
          <div className="absolute top-0 w-full h-6 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10" />
          <div className="absolute bottom-0 w-full h-6 bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10" />
          <div className="p-4 h-full overflow-y-auto scrollbar-custom space-y-3">
            {visibleFeeds.map((feed, i) => (
              <motion.div key={`${feed.id}-${i}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 items-start">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${feedDotColor(feed.type)}`} />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{feed.message}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{feed.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-static p-5">
          <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Revenue by Month</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `₹${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={v => [`₹${(v / 100000).toFixed(1)}L`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card-static p-5">
          <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Top Distributors by Volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_DISTRIBUTORS} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="volume" fill="#16a34a" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Decorative Map */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card-static p-5">
        <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Distributor Network — Maharashtra</h2>
        <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 300" className="w-full h-full max-w-md opacity-30 dark:opacity-20 text-green-600" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M120,80 Q160,40 220,60 Q280,80 300,120 Q320,170 280,220 Q240,260 180,250 Q120,240 100,200 Q80,160 100,120 Q110,90 120,80 Z" fill="currentColor" opacity="0.1" stroke="currentColor" />
          </svg>
          {/* City dots */}
          {[
            { name: 'Mumbai', x: '30%', y: '55%' },
            { name: 'Pune', x: '42%', y: '60%' },
            { name: 'Nashik', x: '38%', y: '35%' },
            { name: 'Kolhapur', x: '35%', y: '80%' },
            { name: 'Sangli', x: '48%', y: '78%' },
            { name: 'Aurangabad', x: '55%', y: '40%' },
          ].map(city => (
            <div key={city.name} className="absolute flex flex-col items-center" style={{ left: city.x, top: city.y }}>
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/40 animate-pulse" />
              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mt-1">{city.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
