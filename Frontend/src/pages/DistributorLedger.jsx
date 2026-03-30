import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, AlertTriangle, X, IndianRupee } from 'lucide-react';
import { formatCurrencyFull, formatDate } from '../utils/helpers';
import { exportToCSV } from '../utils/exportUtils';

function getPurchaseStatus(total, paid, due) {
  if (due <= 0) return 'Paid';
  if (paid > 0 && paid < total) return 'Partial';
  return 'Unpaid';
}

function statusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (s === 'partial') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
}

export default function DistributorLedger() {
  const { addToast } = useToast();
  const { currentUser, users } = useAuth();

  const purchasesAll = useStore(s => s.purchases);
  const ledgerEntries = useStore(s => s.ledgerEntries);
  const [allPaymentsLedgerEntries, setAllPaymentsLedgerEntries] = useState([]);
  const bulkOrderHistory = useStore(s => s.bulkOrderHistory);
  const fetchLedgerEntries = useStore(s => s.fetchLedgerEntries);
  const fetchPurchases = useStore(s => s.fetchPurchases);

  const [loading, setLoading] = useState(true);
  const [selectedDistributorId, setSelectedDistributorId] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');
  const [showPayModal, setShowPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ amount: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const distributors = useMemo(() => {
    return (users || [])
      .filter(u => (u.role || '').toLowerCase() === 'distributor')
      .map(u => ({ userId: u.userId, name: u.name }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [users]);

  const selectedDistDbId = selectedDistributorId === 'All' ? null : Number(selectedDistributorId);

  const bulkDateByOrderId = useMemo(() => {
    const m = new Map();
    (bulkOrderHistory || []).forEach(o => m.set(o.id, o.date));
    return m;
  }, [bulkOrderHistory]);

  const filteredPurchases = useMemo(() => {
    if (selectedDistDbId == null) return purchasesAll || [];
    return (purchasesAll || []).filter(p => p.distributorId === selectedDistDbId);
  }, [purchasesAll, selectedDistDbId]);

  const filteredTransactions = useMemo(() => {
    const q = (searchTerm || '').toLowerCase();
    return filteredPurchases.filter(t => !q || String(t.bulkOrderId || '').toLowerCase().includes(q));
  }, [filteredPurchases, searchTerm]);

  const summary = useMemo(() => {
    const totalOrdered = (filteredPurchases || []).reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
    const totalPaid = (filteredPurchases || []).reduce((acc, p) => acc + (Number(p.paidAmount) || 0), 0);
    const outstanding = (filteredPurchases || []).reduce((acc, p) => acc + (Number(p.dueAmount) || 0), 0);
    return { totalOrdered, totalPaid, outstanding };
  }, [filteredPurchases]);

  const purchaseIdToBulkOrderId = useMemo(() => {
    const m = new Map();
    (filteredPurchases || []).forEach(p => m.set(p.purchaseId, p.bulkOrderId));
    return m;
  }, [filteredPurchases]);

  // Live ledger refresh for selected distributor.
  useEffect(() => {
    if (!selectedDistDbId) return;
    fetchLedgerEntries(selectedDistDbId);
    const interval = setInterval(() => fetchLedgerEntries(selectedDistDbId), 7000);
    return () => clearInterval(interval);
  }, [selectedDistDbId, fetchLedgerEntries]);

  // When "All Distributors" is selected, fetch payment ledger entries for everyone (company view).
  useEffect(() => {
    if (selectedDistDbId != null) {
      setAllPaymentsLedgerEntries([]);
      return;
    }
    let cancelled = false;
    const run = async () => {
      try {
        const results = await Promise.all(
          (distributors || []).map(d => api.get(`/ledger/${d.userId}`))
        );
        const merged = results.flat().filter(e => e.referenceType === 'PAYMENT');
        if (!cancelled) setAllPaymentsLedgerEntries(merged);
      } catch {
        // If one request fails, keep the current state.
      }
    };
    run();
    const interval = setInterval(run, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedDistDbId, distributors]);

  const handleExport = () => {
    const exportData = filteredPurchases.map(p => {
      const total = Number(p.totalAmount) || 0;
      const paid = Number(p.paidAmount) || 0;
      const due = Number(p.dueAmount) || 0;
      const status = getPurchaseStatus(total, paid, due);
      return {
        Date: bulkDateByOrderId.get(p.bulkOrderId) || '',
        'BO ID': p.bulkOrderId,
        'Order Amount': total,
        Paid: paid,
        'Balance Due': due,
        Status: status,
      };
    });
    exportToCSV(exportData, `Distributor_Ledger_${selectedDistDbId ? selectedDistDbId : 'All'}`);
  };

  const tabs = [
    { key: 'transactions', label: 'Transactions' },
    { key: 'payments', label: 'Payment History' },
  ];

  const handleRecordPayment = async () => {
    if (!showPayModal || !payForm.amount) return;
    const amount = Number(payForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    try {
      await api.patch(`/purchases/${showPayModal.purchaseId}/pay`, { amount });
      addToast(`Payment recorded for BO ${showPayModal.bulkOrderId}`, 'success');
      setShowPayModal(null);
      setPayForm({ amount: '' });

      // Refresh purchases immediately.
      if (currentUser?.userId != null) {
        fetchPurchases({ companyId: currentUser.userId });
      }
      if (selectedDistDbId) {
        fetchLedgerEntries(selectedDistDbId);
      }
    } catch (err) {
      addToast(err?.message || 'Failed to record payment', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 skeleton w-1/3" />
        <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 skeleton" />)}</div>
        <div className="h-80 skeleton mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Distributor Ledger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">DB-backed purchases + payments</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search BO id..."
              className="pl-8 pr-3 py-2 input-base text-sm w-48 sm:w-64"
            />
          </div>

          <select value={selectedDistributorId} onChange={e => setSelectedDistributorId(e.target.value)} className="input-base w-auto text-sm py-2">
            <option value="All">All Distributors</option>
            {distributors.map(d => <option key={d.userId} value={d.userId}>{d.name}</option>)}
          </select>

          <button onClick={handleExport} className="btn-outline flex items-center gap-1 text-sm py-2"><Download size={14} /> Export</button>
        </div>
      </div>

      {selectedDistDbId != null && summary.outstanding > 50000 && (
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            ⚠ Outstanding payment of {formatCurrencyFull(summary.outstanding)} due
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Ordered', value: formatCurrencyFull(summary.totalOrdered), color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Total Paid', value: formatCurrencyFull(summary.totalPaid), color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
          { label: 'Outstanding', value: formatCurrencyFull(summary.outstanding), color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-static p-4 flex items-center gap-3">
            <div className={`p-2 rounded-xl ${card.color}`}><IndianRupee size={18} /></div>
            <div>
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[860px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Date', 'BO ID', 'Order Amount', 'Paid', 'Balance Due', 'Status', 'Action'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filteredTransactions.map((txn, i) => {
                  const total = Number(txn.totalAmount) || 0;
                  const paid = Number(txn.paidAmount) || 0;
                  const due = Number(txn.dueAmount) || 0;
                  const status = getPurchaseStatus(total, paid, due);
                  const date = bulkDateByOrderId.get(txn.bulkOrderId) || '';
                  return (
                    <tr key={txn.purchaseId} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(date)}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">{txn.bulkOrderId}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(total)}</td>
                      <td className="py-3 px-4 text-sm text-green-600 font-medium">{formatCurrencyFull(paid)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-red-600">{formatCurrencyFull(due)}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${statusBadgeClass(status)}`}>{status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {due > 0 && (
                          <button
                            onClick={() => {
                              setShowPayModal({
                                purchaseId: txn.purchaseId,
                                bulkOrderId: txn.bulkOrderId,
                              });
                              setPayForm({ amount: String(due) });
                            }}
                            className="text-xs text-green-600 font-medium hover:underline"
                          >
                            Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr><td colSpan={7} className="py-10 px-4 text-center text-sm text-gray-500">No purchases found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                {['Date', 'BO ID', 'Amount Paid', 'Ledger Type', 'Balance'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {selectedDistDbId == null && (
                  <tr><td colSpan={5} className="py-10 px-4 text-center text-sm text-gray-500">Select a distributor to view payments.</td></tr>
                )}
                {selectedDistDbId != null && (ledgerEntries || []).map((e, i) => {
                  if (e.referenceType !== 'PAYMENT') return null;
                  return (
                    <tr key={e.ledgerId ?? i} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDate(e.date)}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        {purchaseIdToBulkOrderId.get(e.referenceId) || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">{formatCurrencyFull(Number(e.amount) || 0)}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{e.type}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(Number(e.balance) || 0)}</td>
                    </tr>
                  );
                })}

                {selectedDistDbId == null && allPaymentsLedgerEntries.length === 0 && (
                  <tr><td colSpan={5} className="py-10 px-4 text-center text-sm text-gray-500">No payment history yet.</td></tr>
                )}

                {selectedDistDbId == null && allPaymentsLedgerEntries.map((e, i) => (
                  <tr key={e.ledgerId ?? i} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(e.date)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">
                      {purchaseIdToBulkOrderId.get(e.referenceId) || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">{formatCurrencyFull(Number(e.amount) || 0)}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{e.type}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(Number(e.balance) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showPayModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Record Payment</h3>
                <button onClick={() => setShowPayModal(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-500 mb-2">BO: <span className="font-semibold text-gray-800 dark:text-gray-200">{showPayModal.bulkOrderId}</span></p>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Amount (₹)</label>
                  <input type="number" value={payForm.amount} onChange={e => setPayForm({ amount: e.target.value })} className="input-base text-sm" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPayModal(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={handleRecordPayment} className="btn-primary flex-1">Record</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
