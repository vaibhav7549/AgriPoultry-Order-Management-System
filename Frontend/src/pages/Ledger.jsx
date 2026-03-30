import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { IndianRupee, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull, formatDate } from '../utils/helpers';
import { exportToCSV } from '../utils/exportUtils';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

function getLedgerStatus(due, paid, total) {
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

export default function Ledger() {
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const purchases = useStore(s => s.purchases);
  const ledgerEntries = useStore(s => s.ledgerEntries);
  const invoices = useStore(s => s.invoices);
  const bulkOrderHistory = useStore(s => s.bulkOrderHistory);
  const fetchPurchases = useStore(s => s.fetchPurchases);
  const fetchLedgerEntries = useStore(s => s.fetchLedgerEntries);
  const fetchInvoices = useStore(s => s.fetchInvoices);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showPayModal, setShowPayModal] = useState(null);
  const [payForm, setPayForm] = useState({ amount: '' });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);

  const bulkDateByOrderId = useMemo(() => {
    const m = new Map();
    (bulkOrderHistory || []).forEach(o => m.set(o.id, o.date));
    return m;
  }, [bulkOrderHistory]);

  const purchaseIdToBulkOrderId = useMemo(() => {
    const m = new Map();
    (purchases || []).forEach(p => m.set(p.purchaseId, p.bulkOrderId));
    return m;
  }, [purchases]);

  const totals = useMemo(() => {
    const totalOrdered = (purchases || []).reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
    const totalPaid = (purchases || []).reduce((acc, p) => acc + (Number(p.paidAmount) || 0), 0);
    const outstandingDue = (purchases || []).reduce((acc, p) => acc + (Number(p.dueAmount) || 0), 0);
    return { totalOrdered, totalPaid, outstandingDue };
  }, [purchases]);

  const purchaseRows = useMemo(() => {
    const rows = (purchases || []).map(p => {
      const total = Number(p.totalAmount) || 0;
      const paid = Number(p.paidAmount) || 0;
      const due = Number(p.dueAmount) || 0;
      const status = getLedgerStatus(due, paid, total);
      const date = bulkDateByOrderId.get(p.bulkOrderId) || '';
      return {
        purchaseId: p.purchaseId,
        bulkOrderId: p.bulkOrderId,
        date,
        total,
        paid,
        due,
        status,
      };
    });

    const q = (searchTerm || '').toLowerCase();
    return rows.filter(r => {
      const matchQ = !q || String(r.bulkOrderId || '').toLowerCase().includes(q) || String(r.status || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [purchases, bulkDateByOrderId, searchTerm, statusFilter]);

  const ledgerRows = useMemo(() => {
    return (ledgerEntries || []).map(e => ({
      ledgerId: e.ledgerId,
      date: e.date,
      type: e.type,
      referenceType: e.referenceType,
      referenceId: e.referenceId,
      amount: Number(e.amount) || 0,
      balance: Number(e.balance) || 0,
    }));
  }, [ledgerEntries]);

  const invoiceRows = useMemo(() => {
    const orderIds = new Set((purchases || []).map(p => p.bulkOrderId).filter(Boolean));
    return (invoices || []).filter(inv => orderIds.has(inv.orderId));
  }, [invoices, purchases]);

  const handleExport = () => {
    if (activeTab === 'transactions') {
      const data = purchaseRows.map(r => ({
        Date: r.date,
        'BO ID': r.bulkOrderId,
        Total: r.total,
        Paid: r.paid,
        Due: r.due,
        Status: r.status,
      }));
      exportToCSV(data, 'Distributor_Ledger');
      return;
    }
    if (activeTab === 'ledger') {
      const data = ledgerRows.map(r => ({
        Date: r.date,
        Type: r.type,
        'Reference Type': r.referenceType,
        'Reference Id': r.referenceId,
        Amount: r.amount,
        Balance: r.balance,
      }));
      exportToCSV(data, 'Ledger_Entries');
      return;
    }
    const data = invoiceRows.map(inv => ({
      Invoice: inv.id,
      Date: inv.date,
      OrderId: inv.orderId,
      Amount: inv.amount,
      Status: inv.status,
    }));
    exportToCSV(data, 'Invoices');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 skeleton w-1/3" />
        <div className="grid grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="h-24 skeleton" />)}</div>
        <div className="h-96 skeleton mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">My Ledger</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Distributor ledger synced from MySQL</p>
        </div>
        <button onClick={handleExport} className="btn-outline flex items-center gap-2 text-sm"><Download size={16} /> Export CSV</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Ordered', value: formatCurrencyFull(totals.totalOrdered), color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
          { label: 'Total Paid', value: formatCurrencyFull(totals.totalPaid), color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Outstanding Due', value: formatCurrencyFull(totals.outstandingDue), color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
          { label: 'Ledger Entries', value: String((ledgerEntries || []).length), color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-static p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${card.color}`}><IndianRupee size={20} /></div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit">
        {[
          { key: 'transactions', label: 'Transactions' },
          { key: 'ledger', label: 'Ledger Entries' },
          { key: 'invoices', label: 'Invoices' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'transactions' && (
        <div className="card-static overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex flex-wrap gap-3 items-center">
            <input type="text" placeholder="Search BO id..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-base text-sm w-48 sm:w-64" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-base text-sm w-auto">
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Date', 'BO ID', 'Total', 'Paid', 'Due', 'Status', 'Action'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {purchaseRows.map((r, i) => (
                  <tr key={r.purchaseId ?? r.bulkOrderId} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'} hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors`}>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(r.date)}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-green-600">{r.bulkOrderId}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(r.total)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">{formatCurrencyFull(r.paid)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-red-600">{formatCurrencyFull(r.due)}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      {r.due > 0 && (
                        <button
                          onClick={() => {
                            setShowPayModal({ purchaseId: r.purchaseId, bulkOrderId: r.bulkOrderId, due: r.due });
                            setPayForm({ amount: String(r.due) });
                          }}
                          className="text-xs text-green-600 font-medium hover:underline"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {purchaseRows.length === 0 && (
                  <tr><td colSpan={7} className="py-10 px-4 text-center text-sm text-gray-500">No purchases found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="card-static overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Date', 'Type', 'Reference', 'Amount', 'Balance'].map(h => (
                    <th key={h} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {ledgerRows.map((r, i) => (
                  <tr key={r.ledgerId ?? i} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(r.date)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{r.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">
                      {r.referenceType} · {purchaseIdToBulkOrderId.get(r.referenceId) || r.referenceId}
                    </td>
                    <td className={`py-3 px-4 text-sm font-medium ${r.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrencyFull(r.amount)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyFull(r.balance)}</td>
                  </tr>
                ))}
                {ledgerRows.length === 0 && (
                  <tr><td colSpan={5} className="py-10 px-4 text-center text-sm text-gray-500">No ledger entries found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {invoiceRows.map(inv => (
            <div key={inv.id} className="card-static p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{inv.id}</span>
                </div>
                <span className="badge badge-pending">{inv.status}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="text-gray-700 dark:text-gray-300">{formatDate(inv.date)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Order</span><span className="text-gray-700 dark:text-gray-300">{inv.orderId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-bold text-gray-900 dark:text-white">{formatCurrencyFull(inv.amount)}</span></div>
              </div>
            </div>
          ))}
          {invoiceRows.length === 0 && (
            <div className="col-span-full card-static p-8 text-center text-sm text-gray-500">
              No invoices found.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showPayModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Pay for BO</h3>
                <button onClick={() => setShowPayModal(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-500 mb-2">
                  BO: <span className="font-semibold text-gray-800 dark:text-gray-200">{showPayModal.bulkOrderId}</span> · Due: <span className="font-semibold text-red-600">{formatCurrencyFull(showPayModal.due)}</span>
                </p>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={payForm.amount}
                    onChange={e => setPayForm({ amount: e.target.value })}
                    className="input-base text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowPayModal(null)} className="btn-outline flex-1">Cancel</button>
                  <button
                    onClick={async () => {
                      const amount = Number(payForm.amount);
                      if (!Number.isFinite(amount) || amount <= 0) return;
                      try {
                        await api.patch(`/purchases/${showPayModal.purchaseId}/pay`, { amount });
                        addToast(`Payment recorded for BO ${showPayModal.bulkOrderId}`, 'success');
                        setShowPayModal(null);
                        setPayForm({ amount: '' });
                        if (currentUser?.userId != null) {
                          fetchPurchases({ distributorId: currentUser.userId });
                          fetchLedgerEntries(currentUser.userId);
                          fetchInvoices();
                        }
                      } catch (err) {
                        addToast(err?.message || 'Payment failed', 'error');
                      }
                    }}
                    className="btn-primary flex-1"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
