import { create } from 'zustand';
import api from './api';

export const useStore = create((set, get) => ({
  // ─── Data State (initialized empty, fetched from API) ───
  farmerOrders: [],
  farmers: [],
  bulkDraft: [],
  bulkOrderHistory: [],
  kanbanOrders: [],
  products: [],
  transactions: [],
  notifications: [],
  farmerPortalOrders: [],

  // ─── Data Fetching ───
  fetchFarmerOrders: async (params) => {
    try {
      let url = '/farmer-portal-orders';
      if (params?.distributorId != null) url += `?distributorId=${params.distributorId}`;
      else if (params?.farmerId != null) url += `?farmerId=${params.farmerId}`;

      const data = await api.get(url);
      set({ farmerOrders: data || [] });
    } catch { /* keep existing */ }
  },

  fetchFarmers: async (distributorId) => {
    try {
      const url = distributorId ? `/users/farmers?distributorId=${distributorId}` : '/users/farmers';
      const data = await api.get(url);
      set({ farmers: data || [] });
    } catch { /* keep existing */ }
  },

  fetchProducts: async () => {
    try {
      const data = await api.get('/products');
      set({ products: data || [] });
    } catch { /* keep existing */ }
  },

  fetchBulkOrders: async (distributorId) => {
    try {
      const allData = await api.get('/bulk-orders');
      set({ kanbanOrders: allData || [] });
      if (distributorId) {
        const histData = await api.get(`/bulk-orders?distributorId=${distributorId}`);
        set({ bulkOrderHistory: histData || [] });
      } else {
        set({ bulkOrderHistory: allData || [] });
      }
    } catch { /* keep existing */ }
  },

  fetchTransactions: async (userId) => {
    try {
      const url = userId ? `/transactions?userId=${userId}` : '/transactions';
      const data = await api.get(url);
      set({ transactions: data || [] });
    } catch { /* keep existing */ }
  },

  fetchNotifications: async (userId) => {
    try {
      const url = userId ? `/notifications?userId=${userId}` : '/notifications';
      const data = await api.get(url);
      set({ notifications: data || [] });
    } catch { /* keep existing */ }
  },

  // fetchFarmerPortalOrders is obsolete and unified into fetchFarmerOrders

  // ─── Farmer Orders (Distributor) ───
  addFarmerOrder: (order) => {
    const payload = {
      farmerId: order?.farmerId,
      totalValue: order?.amount || 0,
      items: [
        {
          product: order?.product,
          qty: order?.qty,
          price: order?.unitPrice
        }
      ],
      notes: order?.notes
    };

    api.post('/farmer-portal-orders', payload).then(saved => {
      set(s => ({ farmerOrders: [saved, ...s.farmerOrders] }));
    }).catch(() => {});
  },

  updateFarmerOrderStatus: (orderId, status) => {
    set((state) => ({
      farmerOrders: state.farmerOrders.map(o => o.id === orderId ? { ...o, status } : o)
    }));
    api.patch(`/farmer-portal-orders/${orderId}/status`, { status }).then(saved => {
      set(s => ({ farmerOrders: s.farmerOrders.map(o => o.id === orderId ? saved : o) }));
    }).catch(() => {});
  },

  addFarmer: (farmer) => {
    set((state) => ({
      farmers: [...state.farmers, { ...farmer, id: `F${String(state.farmers.length + 1).padStart(3, '0')}`, totalOrders: 0 }]
    }));
  },

  // ─── Bulk Draft (Distributor) ───
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
  submitBulkDraft: (userName) => {
    const state = get();
    const user = JSON.parse(localStorage.getItem('agripoultry_user') || '{}');
    const distributorIdCode = user.id || 'D001';
    const newOrder = {
      distributorId: distributorIdCode,
      distributorName: userName || 'Current Distributor',
      totalValue: state.bulkDraft.reduce((acc, item) => acc + ((item.suggestedDistributorPrice || item.basePrice || 0) * item.qty), 0),
      contact: user.phone || '9876543210',
      items: state.bulkDraft.map(i => ({ product: i.name, qty: i.qty, price: (i.suggestedDistributorPrice || i.basePrice || 0) })),
    };

    // Optimistic local update
    const tempOrder = {
      id: `BO-${2000 + state.kanbanOrders.length + 1}`,
      ...newOrder,
      status: 'New Orders',
      date: new Date().toISOString().split('T')[0],
    };
    set({
      bulkDraft: [],
      kanbanOrders: [tempOrder, ...state.kanbanOrders],
      bulkOrderHistory: [tempOrder, ...state.bulkOrderHistory],
    });

    // Persist to backend
    api.post('/bulk-orders', newOrder).then(saved => {
      set(s => ({
        kanbanOrders: s.kanbanOrders.map(o => o.id === tempOrder.id ? saved : o),
        bulkOrderHistory: s.bulkOrderHistory.map(o => o.id === tempOrder.id ? saved : o),
      }));
    }).catch(() => {});
  },

  // ─── Kanban Orders (Company) ───
  moveKanbanOrder: (orderId, newStatus) => {
    set((state) => ({
      kanbanOrders: state.kanbanOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    }));
    api.patch(`/bulk-orders/${orderId}/status`, { status: newStatus }).catch(() => {});
  },

  // ─── Products (Company) ───
  updateProduct: (productId, updates) => set((state) => ({
    products: state.products.map(p => p.id === productId ? { ...p, ...updates } : p)
  })),
  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, { ...product, id: `p${state.products.length + 1}` }]
    }));
    api.post('/products', product).catch(() => {});
  },

  // ─── Notifications ───
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
    api.patch(`/notifications/${id}/read`, {}).catch(() => {});
  },
  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
    const user = JSON.parse(localStorage.getItem('agripoultry_user') || '{}');
    if (user.id) {
      api.patch(`/notifications/read-all?userId=${user.id}`, {}).catch(() => {});
    }
  },

  // ─── Farmer Portal ───
  farmerDraft: [],
  addToFarmerDraft: (item) => set((state) => {
    const existing = state.farmerDraft.find(i => i.id === item.id);
    if (existing) {
      return { farmerDraft: state.farmerDraft.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty || 1) } : i) };
    }
    return { farmerDraft: [...state.farmerDraft, { ...item, qty: item.qty || 1 }] };
  }),
  updateFarmerDraftQty: (itemId, qty) => set((state) => ({
    farmerDraft: qty <= 0
      ? state.farmerDraft.filter(i => i.id !== itemId)
      : state.farmerDraft.map(i => i.id === itemId ? { ...i, qty } : i)
  })),
  removeFarmerDraftItem: (itemId) => set((state) => ({
    farmerDraft: state.farmerDraft.filter(i => i.id !== itemId)
  })),
  clearFarmerDraft: () => set({ farmerDraft: [] }),
  submitFarmerDraft: async (farmerId, farmerName) => {
    const state = get();
    const user = JSON.parse(localStorage.getItem('agripoultry_user') || '{}');

    // FarmerPortalOrder uses frontend-style code like "F006"
    const farmerIdCode = farmerId || user.id || 'F001';

    // Clear draft immediately for snappy UI
    set({ farmerDraft: [] });
    
    const items = state.farmerDraft.map((item) => {
      const unitPrice =
        item.farmerPrices?.[farmerIdCode] ||
        item.suggestedFarmerPrice ||
        item.distributorPrice ||
        item.unitPrice ||
        0;
      return {
        product: item.name,
        qty: item.qty,
        price: unitPrice
      };
    });

    const totalValue = items.reduce((acc, it) => acc + ((it.price || 0) * (it.qty || 0)), 0);

    try {
      const payload = {
        farmerId: farmerIdCode,
        totalValue,
        items
      };
      const saved = await api.post('/farmer-portal-orders', payload);
      set(s => ({ farmerOrders: [saved, ...s.farmerOrders] }));
    } catch (err) {
      console.error('Failed to save grouped farmer order:', err);
    }
  },
}));
