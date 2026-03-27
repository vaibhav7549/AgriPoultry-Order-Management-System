import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Search, Download, AlertTriangle, X, IndianRupee, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull, formatDate, getStatusColor } from '../utils/helpers';
import { exportToCSV } from '../utils/exportUtils';
import { DISTRIBUTORS, COMPANY_TRANSACTIONS } from '../data/mockData';

export default function DistributorLedger() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedDist, setSelectedDist] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState(COMPANY_TRANSACTIONS);
  const [showPayModal, setShowPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ amount: '', mode: 'NEFT', reference: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const distributor = selectedDist === 'All' ? null : DISTRIBUTORS.find(d => d.id === selectedDist);
  const distTransactions = selectedDist === 'All' ? transactions : transactions.filter(t => t.distributorId === selectedDist);
  const filteredTransactions = distTransactions.filter(t => !searchTerm || t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || t.paymentMode?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleMarkPaid = () => {
    if (!payForm.amount) return;
    setTransactions(prev => prev.map(t => t.id === showPayModal.id ? { ...t, amountPaid: Number(payForm.amount), paymentMode: payForm.mode, balanceDue: t.orderAmount - Number(payForm.amount), status: Number(payForm.amount) >= t.orderAmount ? 'Paid' : 'Partial' } : t));
    addToast(`Payment of ${formatCurrencyFull(Number(payForm.amount))} recorded`, 'success');
    setShowPayModal(null);
    setPayForm({ amount: '', mode: 'NEFT', reference: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleExport = () => {
    const exportData = distTransactions.map(t => ({
      Date: t.date,
      'Order ID': t.orderId,
      'Order Amount': t.orderAmount,
      'Amount Paid': t.amountPaid,
      'Payment Mode': t.paymentMode || '',
      'Balance Due': t.balanceDue,
      Status: t.status
    }));
    exportToCSV(exportData, `Distributor_Ledger_${distributor?.name || 'All'}`);
  };

  const tabs = [
    { key: 'transactions', label: 'Transactions' },
    { key: 'payments', label: 'Payment History' },
  ];

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 skeleton" />)}</div><div className="h-80 skeleton mt-4" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Distributor Ledger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track payments and outstanding balances</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search order ID or mode..." className="pl-8 pr-3 py-2 input-base text-sm w-48 sm:w-64" />
          </div>
          <select value={selectedDist} onChange={e => setSelectedDist(e.target.value)} className="input-base w-auto text-sm py-2">
            <option value="All">All Distributors</option>
            {DISTRIBUTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button onClick={handleExport} className="btn-outline flex items-center gap-1 text-sm py-2"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* Payment Due Alert */}
      {distributor && distributor.outstanding > 50000 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            ⚠ Outstanding payment of {formatCurrencyFull(distributor.outstanding)} due from {distributor.name}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      {distributor && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Ordered', value: formatCurrencyFull(distributor.totalOrdered), icon: <IndianRupee size={18} />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
            { label: 'Total Paid', value: formatCurrencyFull(distributor.totalPaid), icon: <ArrowUpRight size={18} />, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
            { label: 'Outstanding', value: formatCurrencyFull(distributor.outstanding), icon: <ArrowDownLeft size={18} />, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card-static p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${card.color}`}>{card.icon}</div>
              <div><p className="text-xs font-medium text-gray-500">{card.label}</p><p className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</p></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Date', 'Order ID', 'Order Amount', 'Paid', 'Mode', 'Balance Due', 'Status', 'Action'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filteredTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(txn.date)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">{txn.orderId}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(txn.orderAmount)}</td>
                    <td className="py-3 px-4 text-sm text-green-600 font-medium">{txn.amountPaid > 0 ? formatCurrencyFull(txn.amountPaid) : '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{txn.paymentMode}</td>
                    <td className="py-3 px-4 text-sm font-medium text-red-600">{txn.balanceDue > 0 ? formatCurrencyFull(txn.balanceDue) : '-'}</td>
                    <td className="py-3 px-4"><span className={`badge ${getStatusColor(txn.status)}`}>{txn.status}</span></td>
                    <td className="py-3 px-4">
                      {txn.status !== 'Paid' && (
                        <button onClick={() => { setShowPayModal(txn); setPayForm(f => ({ ...f, amount: String(txn.balanceDue) })); }} className="text-xs text-green-600 font-medium hover:underline">Mark Paid</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'payments' && (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Date', 'Order', 'Amount Paid', 'Mode', 'Reference'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filteredTransactions.filter(t => t.amountPaid > 0).map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(txn.date)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">{txn.orderId}</td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">{formatCurrencyFull(txn.amountPaid)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{txn.paymentMode}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">REF-{txn.id.replace('CT-', '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mark as Paid Modal */}
      <AnimatePresence>
        {showPayModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Record Payment</h3>
                <button onClick={() => setShowPayModal(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-500 mb-2">Order: <span className="font-semibold text-gray-800 dark:text-gray-200">{showPayModal.orderId}</span> · Balance: <span className="font-semibold text-red-600">{formatCurrencyFull(showPayModal.balanceDue)}</span></p>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Amount (₹)</label><input type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} className="input-base text-sm" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Mode</label><select value={payForm.mode} onChange={e => setPayForm(f => ({ ...f, mode: e.target.value }))} className="input-base text-sm"><option>NEFT</option><option>UPI</option><option>Cash</option><option>Cheque</option></select></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Reference #</label><input value={payForm.reference} onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))} className="input-base text-sm" placeholder="Optional" /></div>
                <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Date</label><input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} className="input-base text-sm" /></div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPayModal(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={handleMarkPaid} className="btn-primary flex-1">Record Payment</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
