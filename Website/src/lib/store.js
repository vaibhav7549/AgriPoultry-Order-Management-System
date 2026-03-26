import { create } from 'zustand';
import { DISTRIBUTOR_ORDERS, BULK_ORDERS, PRODUCTS, TRANSACTIONS, NOTIFICATIONS, FARMERS } from '../data/mockData';

export const useStore = create((set, get) => ({
  // --- Farmer Orders (Distributor) ---
  farmerOrders: DISTRIBUTOR_ORDERS,
  farmers: FARMERS,
  addFarmerOrder: (order) => set((state) => ({
    farmerOrders: [{ ...order, id: `FO-${1000 + state.farmerOrders.length + 1}`, status: 'Pending', date: new Date().toISOString().split('T')[0] }, ...state.farmerOrders]
  })),
  updateFarmerOrderStatus: (orderId, status) => set((state) => ({
    farmerOrders: state.farmerOrders.map(o => o.id === orderId ? { ...o, status } : o)
  })),
  addFarmer: (farmer) => set((state) => ({
    farmers: [...state.farmers, { ...farmer, id: `F${String(state.farmers.length + 1).padStart(3, '0')}`, totalOrders: 0 }]
  })),

  // --- Bulk Draft (Distributor) ---
  bulkDraft: [],
  bulkOrderHistory: BULK_ORDERS.filter(o => o.distributorId === 'D001'),
  addToBulkDraft: (item) => set((state) => {
    const existing = state.bulkDraft.find(i => i.id === item.id);
    if (existing) {
      return { bulkDraft: state.bulkDraft.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i) };
    }
    return { bulkDraft: [...state.bulkDraft, { ...item, qty: item.qty || 1 }] };
  }),
  updateDraftQty: (itemId, qty) => set((state) => ({
    bulkDraft: qty <= 0
      ? state.bulkDraft.filter(i => i.id !== itemId)
      : state.bulkDraft.map(i => i.id === itemId ? { ...i, qty } : i)
  })),
  removeDraftItem: (itemId) => set((state) => ({
    bulkDraft: state.bulkDraft.filter(i => i.id !== itemId)
  })),
  clearBulkDraft: () => set({ bulkDraft: [] }),
  submitBulkDraft: (userName) => set((state) => {
    const newOrder = {
      id: `BO-${2000 + state.kanbanOrders.length + 1}`,
      distributorId: 'D001',
      distributorName: userName || 'Current Distributor',
      totalValue: state.bulkDraft.reduce((acc, item) => acc + (item.basePrice * item.qty), 0),
      status: 'New Orders',
      date: new Date().toISOString().split('T')[0],
      contact: '9876543210',
      items: state.bulkDraft.map(i => ({ product: i.name, qty: i.qty, price: i.basePrice })),
    };
    return {
      bulkDraft: [],
      kanbanOrders: [newOrder, ...state.kanbanOrders],
      bulkOrderHistory: [newOrder, ...state.bulkOrderHistory],
    };
  }),

  // --- Kanban Orders (Company) ---
  kanbanOrders: BULK_ORDERS,
  moveKanbanOrder: (orderId, newStatus) => set((state) => ({
    kanbanOrders: state.kanbanOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
  })),

  // --- Products (Company) ---
  products: PRODUCTS,
  updateProduct: (productId, updates) => set((state) => ({
    products: state.products.map(p => p.id === productId ? { ...p, ...updates } : p)
  })),
  addProduct: (product) => set((state) => ({
    products: [...state.products, { ...product, id: `p${state.products.length + 1}` }]
  })),

  // --- Transactions (Distributor Ledger) ---
  transactions: TRANSACTIONS,

  // --- Notifications ---
  notifications: NOTIFICATIONS,
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
}));
