import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../lib/store';
import { useToast } from '../context/ToastContext';
import { Package, MoreVertical, ChevronDown, ChevronUp, X, Eye, ArrowRight, Download, Phone, Clock, CheckCircle, Truck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrencyFull, formatDate, getStatusColor } from '../utils/helpers';
import { exportToCSV } from '../utils/exportUtils';

const COLUMNS = [
  { key: 'New Orders', color: 'bg-blue-500', label: 'New Orders' },
  { key: 'Processing', color: 'bg-amber-500', label: 'Processing' },
  { key: 'Shipped', color: 'bg-purple-500', label: 'Shipped' },
  { key: 'Delivered', color: 'bg-green-500', label: 'Delivered' },
  { key: 'Rejected', color: 'bg-red-500', label: 'Rejected' },
];

export default function KanbanFulfillment() {
  const { kanbanOrders, moveKanbanOrder } = useStore();
  const { addToast } = useToast();
  const [expandedCards, setExpandedCards] = useState({});
  const [viewOrder, setViewOrder] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [filterDist, setFilterDist] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const toggleExpand = (id) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));

  const onDragEnd = (result) => {
    if (!result.destination || result.source.droppableId === result.destination.droppableId) return;
    moveKanbanOrder(result.draggableId, result.destination.droppableId);
    addToast(`Order moved to ${result.destination.droppableId}`, 'success');
  };

  const moveToNext = (orderId, currentStatus) => {
    const idx = COLUMNS.findIndex(c => c.key === currentStatus);
    if (idx < COLUMNS.length - 1) {
      moveKanbanOrder(orderId, COLUMNS[idx + 1].key);
      addToast(`Order moved to ${COLUMNS[idx + 1].key}`, 'success');
    }
    setMenuOpen(null);
  };

  const handleExport = () => {
    const exportData = kanbanOrders.map(o => ({
      'Order ID': o.id,
      Distributor: o.distributorName,
      Amount: o.totalValue,
      Items: o.items?.length || 0,
      Status: o.status,
      Date: o.date
    }));
    exportToCSV(exportData, 'AgriPoultry_Fulfillment_Orders');
  };

  const uniqueDistributors = [...new Set(kanbanOrders.map(o => o.distributorName))];

  const filteredOrders = kanbanOrders.filter(o => {
    const matchDist = filterDist === 'All' || o.distributorName === filterDist;
    const matchSearch = !searchTerm || o.distributorName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDist && matchSearch;
  });
  const ordersByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = filteredOrders.filter(o => o.status === col.key);
    return acc;
  }, {});

  const statusTimeline = [
    { label: 'New Order', icon: <Clock size={14} /> },
    { label: 'Processing', icon: <Package size={14} /> },
    { label: 'Shipped', icon: <Truck size={14} /> },
    { label: 'Delivered', icon: <CheckCircle size={14} /> },
  ];

  if (loading) return <div className="space-y-4"><div className="h-12 skeleton w-1/3" /><div className="flex gap-4">{[1,2,3,4].map(i => <div key={i} className="h-96 w-72 skeleton" />)}</div></div>;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Bulk Order Fulfillment</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Drag and drop orders to update fulfillment status</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search order ID or dist..." className="pl-8 pr-3 py-2 input-base text-sm w-48 sm:w-64" />
          </div>
          <select value={filterDist} onChange={e => setFilterDist(e.target.value)} className="input-base w-auto text-sm py-2">
            <option value="All">All Distributors</option>
            {uniqueDistributors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={handleExport} className="btn-outline flex items-center gap-1 text-sm py-2"><Download size={14} /> Export</button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-custom">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full min-w-max items-start">
            {COLUMNS.map(col => (
              <div key={col.key} className="w-[300px] flex flex-col h-full max-h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <h3 className="font-heading font-semibold text-gray-700 dark:text-gray-300 text-sm">{col.label}</h3>
                  </div>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-0.5 rounded">{ordersByStatus[col.key].length}</span>
                </div>

                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}
                      className={`flex-1 rounded-xl p-2 border-2 transition-colors overflow-y-auto scrollbar-custom ${snapshot.isDraggingOver ? 'border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10' : 'border-transparent bg-gray-100/50 dark:bg-gray-800/50'}`}>
                      {ordersByStatus[col.key].map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                              className={`bg-white dark:bg-gray-800 rounded-xl p-3 mb-2 border border-gray-100 dark:border-gray-700 shadow-sm ${snapshot.isDragging ? 'shadow-xl ring-2 ring-green-500 rotate-1' : 'hover:shadow-md'} transition-shadow`}
                              style={{ ...provided.draggableProps.style }}>
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">{order.id}</span>
                                <div className="relative">
                                  <button onClick={() => setMenuOpen(menuOpen === order.id ? null : order.id)} className="text-gray-400 hover:text-gray-600"><MoreVertical size={14} /></button>
                                  {menuOpen === order.id && (
                                    <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 w-40">
                                      <button onClick={() => { setViewOrder(order); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"><Eye size={12} /> View Details</button>
                                      {col.key !== 'Delivered' && col.key !== 'Rejected' && <button onClick={() => moveToNext(order.id, col.key)} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50"><ArrowRight size={12} /> Move Next</button>}
                                      {col.key !== 'Rejected' && col.key !== 'Delivered' && <button onClick={() => { moveKanbanOrder(order.id, 'Rejected'); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"><X size={12} /> Reject</button>}
                                      <button onClick={() => setMenuOpen(null)} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"><Phone size={12} /> Contact</button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{order.distributorName}</h4>
                              <p className="text-base font-bold text-gray-800 dark:text-gray-200 mt-1">{formatCurrencyFull(order.totalValue)}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                              <div className="border-t border-gray-100 dark:border-gray-700/50 pt-2 mt-2">
                                <button onClick={() => toggleExpand(order.id)} className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-green-600 transition-colors">
                                  <span className="flex items-center gap-1"><Package size={12} /> {order.items?.length || 0} Items</span>
                                  {expandedCards[order.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {expandedCards[order.id] && (
                                  <div className="mt-2 space-y-1 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-xs">
                                    {order.items?.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-gray-600 dark:text-gray-300"><span>{item.product}</span><span className="font-medium">{item.qty} units</span></div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {viewOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-custom">
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">Order {viewOrder.id}</h3>
                <button onClick={() => setViewOrder(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Distributor</h4>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{viewOrder.distributorName}</p>
                  <p className="text-sm text-gray-500">{viewOrder.contact}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Items</h4>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="py-1 text-left text-xs text-gray-500">Product</th>
                      <th className="py-1 text-right text-xs text-gray-500">Qty</th>
                      <th className="py-1 text-right text-xs text-gray-500">Price</th>
                      <th className="py-1 text-right text-xs text-gray-500">Total</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {viewOrder.items?.map((item, i) => (
                        <tr key={i}><td className="py-1.5 text-gray-800 dark:text-gray-200">{item.product}</td><td className="py-1.5 text-right text-gray-600">{item.qty}</td><td className="py-1.5 text-right text-gray-600">{formatCurrencyFull(item.price)}</td><td className="py-1.5 text-right font-medium text-gray-800 dark:text-gray-200">{formatCurrencyFull(item.qty * item.price)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white mt-2 pt-2 border-t border-gray-200 dark:border-gray-600"><span>Total</span><span className="text-green-600">{formatCurrencyFull(viewOrder.totalValue)}</span></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Status Timeline</h4>
                  <div className="flex items-center gap-2">
                    {statusTimeline.map((step, i) => {
                      const statusIdx = COLUMNS.findIndex(c => c.key === viewOrder.status);
                      const active = i <= statusIdx;
                      return (
                        <React.Fragment key={i}>
                          <div className={`flex flex-col items-center gap-1`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700'}`}>{step.icon}</div>
                            <span className={`text-[10px] font-medium ${active ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                          </div>
                          {i < statusTimeline.length - 1 && <div className={`flex-1 h-0.5 ${i < statusIdx ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
