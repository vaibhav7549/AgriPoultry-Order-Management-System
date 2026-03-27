import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { IndianRupee, TrendingUp, ArrowDownLeft, ArrowUpRight, Calendar, Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrencyFull, formatDate, getStatusColor } from '../utils/helpers';
import { exportToCSV } from '../utils/exportUtils';
import { MONTHLY_PROFIT, INVOICES } from '../data/mockData';

export default function Ledger() {
  const transactions = useStore(s => s.transactions);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 skeleton" />)}</div><div className="h-96 skeleton mt-4" /></div>;

  const tabs = [
    { key: 'transactions', label: 'Transactions' },
    { key: 'profit', label: 'Profit Analysis' },
    { key: 'invoices', label: 'Invoices' },
  ];

  const handleExport = () => {
    const exportData = transactions.map(t => ({
      Date: t.date,
      Description: t.description,
      Credit: t.credit || 0,
      Debit: t.debit || 0,
      Balance: t.balance
    }));
    exportToCSV(exportData, 'My_Ledger');
  };

  const filteredTransactions = transactions.filter(t => {
    const sMatch = !searchTerm || t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const tMatch = typeFilter === 'All' || t.type === typeFilter;
    return sMatch && tMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">My Ledger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your revenue, payments, and profit</p>
        </div>
        <button onClick={handleExport} className="btn-outline flex items-center gap-2 text-sm"><Download size={16} /> Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹12.4M', icon: <IndianRupee size={20} />, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
          { label: 'Total Paid to Company', value: '₹8.2M', icon: <ArrowUpRight size={20} />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Net Profit', value: '₹4.2M', icon: <TrendingUp size={20} />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Outstanding Due', value: '₹450K', icon: <ArrowDownLeft size={20} />, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-static p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card-static overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-3 items-center">
             <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-base text-sm w-48 sm:w-64" />
             <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-base text-sm w-auto">
               <option value="All">All Types</option>
               <option value="sale">Sale</option>
               <option value="purchase">Purchase</option>
               <option value="payment">Payment</option>
               <option value="expense">Expense</option>
             </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Date', 'Description', 'Credit', 'Debit', 'Balance'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredTransactions.map((txn, i) => (
                  <tr key={txn.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'} hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors`}>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(txn.date)}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{txn.description}</td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">{txn.credit > 0 ? `+${formatCurrencyFull(txn.credit)}` : '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium text-red-600">{txn.debit > 0 ? `-${formatCurrencyFull(txn.debit)}` : '-'}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(txn.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profit Analysis Tab */}
      {activeTab === 'profit' && (
        <div className="space-y-6">
          <div className="card-static p-5">
            <h3 className="text-lg font-heading font-semibold text-gray-900 dark:text-white mb-4">Monthly Profit vs Company Cost</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_PROFIT} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                  <Tooltip formatter={v => [formatCurrencyFull(v)]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="profit" name="Profit" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="Company Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-static overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700"><h3 className="font-heading font-semibold text-gray-900 dark:text-white text-sm">Product-wise Margin</h3></div>
            <table className="w-full text-left">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase">Base</th>
                <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase">Dist Price</th>
                <th className="py-2 px-4 text-xs font-semibold text-gray-500 uppercase">Margin</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {[
                  { name: 'Starter Feed', base: 1000, dist: 1200 },
                  { name: 'Finisher Feed', base: 1300, dist: 1500 },
                  { name: 'Broiler Chicks', base: 32, dist: 40 },
                  { name: 'Layer Chicks', base: 40, dist: 50 },
                  { name: 'Premium Feed', base: 500, dist: 650 },
                  { name: 'Vaccine Pack', base: 250, dist: 320 },
                ].map(p => (
                  <tr key={p.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <td className="py-2 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">{formatCurrencyFull(p.base)}</td>
                    <td className="py-2 px-4 text-sm text-gray-500">{formatCurrencyFull(p.dist)}</td>
                    <td className="py-2 px-4 text-sm font-semibold text-green-600">{Math.round(((p.dist - p.base) / p.base) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INVOICES.map(inv => (
            <div key={inv.id} className="card-static p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FileText size={16} className="text-green-600" /><span className="font-semibold text-gray-900 dark:text-white text-sm">{inv.id}</span></div>
                <span className={`badge ${getStatusColor(inv.status)}`}>{inv.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="text-gray-700 dark:text-gray-300">{formatDate(inv.date)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Order</span><span className="text-gray-700 dark:text-gray-300">{inv.orderId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900 dark:text-white">{formatCurrencyFull(inv.amount)}</span></div>
              </div>
              <button className="w-full btn-outline text-sm py-1.5 flex items-center justify-center gap-1"><Download size={14} /> Download</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
