import { create } from 'zustand';

// Initial Mock Data
const initialFarmerOrders = [
  { id: 'FO-1001', farmerName: 'Ramu Kaka', product: 'Premium Feed', qty: 50, amount: 25000, status: 'Pending' },
  { id: 'FO-1002', farmerName: 'Suresh Patil', product: 'Layer Chicks', qty: 200, amount: 12000, status: 'Fulfilled' },
];

const initialKanbanOrders = [
  { id: 'BO-2001', distributorName: 'Agro Distributors Ltd', totalValue: 150000, status: 'New Orders', items: [{ product: 'Starter Feed', qty: 100 }] },
  { id: 'BO-2002', distributorName: 'City Hatcheries', totalValue: 85000, status: 'Processing', items: [{ product: 'Broiler Chicks', qty: 500 }] },
  { id: 'BO-2003', distributorName: 'Farm Connect', totalValue: 220000, status: 'Shipped', items: [{ product: 'Finisher Feed', qty: 200 }] },
];

export const useStore = create((set) => ({
  // --- Auth State ---
  user: null, // { name: string, role: 'distributor' | 'company' }
  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  // --- Distributor State ---
  farmerOrders: initialFarmerOrders,
  bulkDraft: [],
  addFarmerOrder: (order) => set((state) => ({ 
    farmerOrders: [{ ...order, id: `FO-${1000 + state.farmerOrders.length + 1}`, status: 'Pending' }, ...state.farmerOrders] 
  })),
  addToBulkDraft: (item) => set((state) => {
    const existing = state.bulkDraft.find(i => i.id === item.id);
    if (existing) {
      return { bulkDraft: state.bulkDraft.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i) };
    }
    return { bulkDraft: [...state.bulkDraft, item] };
  }),
  clearBulkDraft: () => set({ bulkDraft: [] }),
  submitBulkDraft: () => set((state) => {
    // In a real app, this would hit an API. We'll just clear the draft and add to Company kanban.
    const newOrder = {
      id: `BO-${2000 + state.kanbanOrders.length + 1}`,
      distributorName: state.user?.name || 'Current Distributor',
      totalValue: state.bulkDraft.reduce((acc, item) => acc + (item.companyPrice * item.qty), 0),
      status: 'New Orders',
      items: state.bulkDraft.map(i => ({ product: i.name, qty: i.qty }))
    };
    return { 
      bulkDraft: [], 
      kanbanOrders: [newOrder, ...state.kanbanOrders] 
    };
  }),

  // --- Company State ---
  kanbanOrders: initialKanbanOrders,
  moveKanbanOrder: (orderId, newStatus) => set((state) => ({
    kanbanOrders: state.kanbanOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
  })),
}));
