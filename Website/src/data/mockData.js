// ============================
// AgriPoultry OS — Mock Data
// ============================

// --- DUMMY USERS (Auth) ---
export const DUMMY_USERS = [
  // Distributors
  { id: 'D001', username: 'demo_distributor', phone: '9876543210', password: 'dist@123', role: 'distributor', name: 'Demo Distributor', company: 'Farm Connect Distributors', email: 'demo@farmconnect.com', address: '123 Market Road, Kolhapur, Maharashtra', avatar: 'D', region: 'Kolhapur' },
  { id: 'D002', username: 'ravi_dist', phone: '9123456780', password: 'ravi@123', role: 'distributor', name: 'Ravi Supplies', company: 'Ravi Agro Distributors', email: 'ravi@agro.com', address: '45 Supply Lane, Pune, Maharashtra', avatar: 'R', region: 'Pune' },
  { id: 'D003', username: 'city_hatch', phone: '9988776655', password: 'city@123', role: 'distributor', name: 'City Hatcheries', company: 'City Hatcheries Pvt Ltd', email: 'city@hatch.com', address: '78 Hatch Road, Mumbai', avatar: 'C', region: 'Mumbai' },
  // Companies
  { id: 'C001', username: 'agripoultry_corp', phone: '9000000001', password: 'admin@123', role: 'company', name: 'AgriPoultry Corp', company: 'AgriPoultry Corp Pvt Ltd', email: 'admin@agripoultry.com', address: 'HQ, Industrial Area, Sangli', avatar: 'A', department: 'Operations' },
  { id: 'C002', username: 'poultry_manager', phone: '9000000002', password: 'manager@123', role: 'company', name: 'Poultry Manager', company: 'AgriPoultry Corp Pvt Ltd', email: 'manager@agripoultry.com', address: 'Branch Office, Kolhapur', avatar: 'P', department: 'Sales' },
  // Farmers
  { id: "F001", username: "ramu_kaka", phone: "9876501234", password: "ramu@123", role: "farmer", name: "Ramu Kaka", village: "Shirol", taluka: "Shirol", district: "Kolhapur", state: "Maharashtra", assignedDistributorId: "D001", assignedDistributorName: "Demo Distributor", email: "ramu@farm.com", avatar: "R", totalOrders: 12, activeOrders: 1 },
  { id: "F002", username: "suresh_patil", phone: "9123401234", password: "suresh@123", role: "farmer", name: "Suresh Patil", village: "Kagal", taluka: "Kagal", district: "Kolhapur", state: "Maharashtra", assignedDistributorId: "D001", assignedDistributorName: "Demo Distributor", email: "suresh@farm.com", avatar: "S", totalOrders: 8, activeOrders: 0 },
  { id: "F003", username: "anita_more", phone: "9988001234", password: "anita@123", role: "farmer", name: "Anita More", village: "Ichalkaranji", taluka: "Hatkanangle", district: "Kolhapur", state: "Maharashtra", assignedDistributorId: "D002", assignedDistributorName: "Ravi Supplies", email: "anita@farm.com", avatar: "A", totalOrders: 5, activeOrders: 2 },
  { id: "F004", username: "vijay_jadhav", phone: "9765001234", password: "vijay@123", role: "farmer", name: "Vijay Jadhav", village: "Nandani", taluka: "Karveer", district: "Kolhapur", state: "Maharashtra", assignedDistributorId: "D001", assignedDistributorName: "Demo Distributor", email: "vijay@farm.com", avatar: "V", totalOrders: 20, activeOrders: 3 },
  { id: "F005", username: "meena_chavan", phone: "9654001234", password: "meena@123", role: "farmer", name: "Meena Chavan", village: "Peth Vadgaon", taluka: "Hatkananagale", district: "Kolhapur", state: "Maharashtra", assignedDistributorId: "D003", assignedDistributorName: "City Hatcheries", email: "meena@farm.com", avatar: "M", totalOrders: 3, activeOrders: 1 }
];

// --- PRODUCTS ---
export const PRODUCTS = [
  { id: 'p1', name: 'Starter Feed', category: 'Feed', unit: 'bags', basePrice: 1000, distPrice: 1200, emoji: '🌾', stock: 'High', minOrder: 10, description: 'Nutritious starter feed for young chicks (0-4 weeks)' },
  { id: 'p2', name: 'Finisher Feed', category: 'Feed', unit: 'bags', basePrice: 1300, distPrice: 1500, emoji: '🌾', stock: 'Medium', minOrder: 10, description: 'High-protein finisher feed for market-ready birds' },
  { id: 'p3', name: 'Broiler Chicks', category: 'Chicks', unit: 'chicks', basePrice: 32, distPrice: 40, emoji: '🐣', stock: 'Low', minOrder: 100, description: 'Day-old broiler chicks, vaccinated and healthy' },
  { id: 'p4', name: 'Layer Chicks', category: 'Chicks', unit: 'chicks', basePrice: 40, distPrice: 50, emoji: '🐥', stock: 'High', minOrder: 100, description: 'Day-old layer chicks for egg production' },
  { id: 'p5', name: 'Premium Feed', category: 'Feed', unit: 'bags', basePrice: 500, distPrice: 650, emoji: '🌿', stock: 'Medium', minOrder: 20, description: 'Organic premium feed blend with added minerals' },
  { id: 'p6', name: 'Vaccine Pack', category: 'Healthcare', unit: 'packs', basePrice: 250, distPrice: 320, emoji: '💉', stock: 'High', minOrder: 5, description: 'Complete vaccination kit for poultry flocks' },
];

// --- FARMERS ---
export const FARMERS = [
  { id: 'F001', name: 'Ramu Kaka', phone: '9812345001', village: 'Borgaon', district: 'Kolhapur', totalOrders: 23 },
  { id: 'F002', name: 'Suresh Patil', phone: '9812345002', village: 'Hatkanangale', district: 'Kolhapur', totalOrders: 18 },
  { id: 'F003', name: 'Ganesh Jadhav', phone: '9812345003', village: 'Kagal', district: 'Kolhapur', totalOrders: 31 },
  { id: 'F004', name: 'Prakash Shinde', phone: '9812345004', village: 'Ichalkaranji', district: 'Kolhapur', totalOrders: 12 },
  { id: 'F005', name: 'Rajesh Deshmukh', phone: '9812345005', village: 'Panhala', district: 'Kolhapur', totalOrders: 27 },
  { id: 'F006', name: 'Anil More', phone: '9812345006', village: 'Baramati', district: 'Pune', totalOrders: 15 },
  { id: 'F007', name: 'Vijay Kulkarni', phone: '9812345007', village: 'Indapur', district: 'Pune', totalOrders: 22 },
  { id: 'F008', name: 'Sachin Pawar', phone: '9812345008', village: 'Shirur', district: 'Pune', totalOrders: 9 },
  { id: 'F009', name: 'Manoj Gaikwad', phone: '9812345009', village: 'Tasgaon', district: 'Sangli', totalOrders: 20 },
  { id: 'F010', name: 'Deepak Nikam', phone: '9812345010', village: 'Miraj', district: 'Sangli', totalOrders: 14 },
  { id: 'F011', name: 'Sanjay Bhosale', phone: '9812345011', village: 'Walwa', district: 'Sangli', totalOrders: 16 },
  { id: 'F012', name: 'Ramesh Sawant', phone: '9812345012', village: 'Thane', district: 'Mumbai', totalOrders: 8 },
  { id: 'F013', name: 'Kiran Chavan', phone: '9812345013', village: 'Nashik Road', district: 'Nashik', totalOrders: 19 },
  { id: 'F014', name: 'Tushar Wagh', phone: '9812345014', village: 'Sinnar', district: 'Nashik', totalOrders: 11 },
  { id: 'F015', name: 'Mahesh Yadav', phone: '9812345015', village: 'Kannad', district: 'Aurangabad', totalOrders: 7 },
];

// --- DISTRIBUTOR / FARMER ORDERS ---
export const DISTRIBUTOR_ORDERS = [
  { id: 'FO-1001', farmerId: 'F001', farmerName: 'Ramu Kaka', farmerPhone: '9812345001', product: 'Premium Feed', qty: 50, unitPrice: 650, amount: 32500, status: 'Pending', date: '2026-03-25', notes: 'Deliver before weekend' },
  { id: 'FO-1002', farmerId: 'F002', farmerName: 'Suresh Patil', farmerPhone: '9812345002', product: 'Layer Chicks', qty: 200, unitPrice: 50, amount: 10000, status: 'Fulfilled', date: '2026-03-24', notes: '' },
  { id: 'FO-1003', farmerId: 'F003', farmerName: 'Ganesh Jadhav', farmerPhone: '9812345003', product: 'Starter Feed', qty: 30, unitPrice: 1200, amount: 36000, status: 'Fulfilled', date: '2026-03-23', notes: 'Regular monthly order' },
  { id: 'FO-1004', farmerId: 'F004', farmerName: 'Prakash Shinde', farmerPhone: '9812345004', product: 'Broiler Chicks', qty: 500, unitPrice: 40, amount: 20000, status: 'Cancelled', date: '2026-03-22', notes: 'Customer cancelled' },
  { id: 'FO-1005', farmerId: 'F005', farmerName: 'Rajesh Deshmukh', farmerPhone: '9812345005', product: 'Finisher Feed', qty: 25, unitPrice: 1500, amount: 37500, status: 'Pending', date: '2026-03-22', notes: '' },
  { id: 'FO-1006', farmerId: 'F006', farmerName: 'Anil More', farmerPhone: '9812345006', product: 'Vaccine Pack', qty: 10, unitPrice: 320, amount: 3200, status: 'Fulfilled', date: '2026-03-21', notes: 'Seasonal vaccination' },
  { id: 'FO-1007', farmerId: 'F007', farmerName: 'Vijay Kulkarni', farmerPhone: '9812345007', product: 'Premium Feed', qty: 40, unitPrice: 650, amount: 26000, status: 'Pending', date: '2026-03-20', notes: '' },
  { id: 'FO-1008', farmerId: 'F009', farmerName: 'Manoj Gaikwad', farmerPhone: '9812345009', product: 'Starter Feed', qty: 60, unitPrice: 1200, amount: 72000, status: 'Fulfilled', date: '2026-03-19', notes: 'Bulk purchase' },
  { id: 'FO-1009', farmerId: 'F010', farmerName: 'Deepak Nikam', farmerPhone: '9812345010', product: 'Layer Chicks', qty: 300, unitPrice: 50, amount: 15000, status: 'Pending', date: '2026-03-18', notes: '' },
  { id: 'FO-1010', farmerId: 'F011', farmerName: 'Sanjay Bhosale', farmerPhone: '9812345011', product: 'Finisher Feed', qty: 15, unitPrice: 1500, amount: 22500, status: 'Fulfilled', date: '2026-03-17', notes: '' },
  { id: 'FO-1011', farmerId: 'F013', farmerName: 'Kiran Chavan', farmerPhone: '9812345013', product: 'Broiler Chicks', qty: 1000, unitPrice: 40, amount: 40000, status: 'Fulfilled', date: '2026-03-16', notes: 'Large order' },
  { id: 'FO-1012', farmerId: 'F015', farmerName: 'Mahesh Yadav', farmerPhone: '9812345015', product: 'Premium Feed', qty: 20, unitPrice: 650, amount: 13000, status: 'Cancelled', date: '2026-03-15', notes: 'Payment issue' },
];

// --- BULK ORDERS (across 4 kanban statuses) ---
export const BULK_ORDERS = [
  // New Orders
  { id: 'BO-2001', distributorId: 'D001', distributorName: 'Farm Connect Distributors', items: [{ product: 'Starter Feed', qty: 100, price: 1000 }, { product: 'Vaccine Pack', qty: 20, price: 250 }], totalValue: 105000, status: 'New Orders', date: '2026-03-25', contact: '9876543210' },
  { id: 'BO-2002', distributorId: 'D002', distributorName: 'Ravi Agro Distributors', items: [{ product: 'Broiler Chicks', qty: 5000, price: 32 }], totalValue: 160000, status: 'New Orders', date: '2026-03-25', contact: '9123456780' },
  { id: 'BO-2003', distributorId: 'D003', distributorName: 'City Hatcheries Pvt Ltd', items: [{ product: 'Layer Chicks', qty: 3000, price: 40 }, { product: 'Premium Feed', qty: 50, price: 500 }], totalValue: 145000, status: 'New Orders', date: '2026-03-24', contact: '9988776655' },
  // Processing
  { id: 'BO-2004', distributorId: 'D001', distributorName: 'Farm Connect Distributors', items: [{ product: 'Finisher Feed', qty: 200, price: 1300 }], totalValue: 260000, status: 'Processing', date: '2026-03-23', contact: '9876543210' },
  { id: 'BO-2005', distributorId: 'D002', distributorName: 'Ravi Agro Distributors', items: [{ product: 'Starter Feed', qty: 150, price: 1000 }, { product: 'Broiler Chicks', qty: 2000, price: 32 }], totalValue: 214000, status: 'Processing', date: '2026-03-22', contact: '9123456780' },
  { id: 'BO-2006', distributorId: 'D003', distributorName: 'City Hatcheries Pvt Ltd', items: [{ product: 'Vaccine Pack', qty: 100, price: 250 }], totalValue: 25000, status: 'Processing', date: '2026-03-21', contact: '9988776655' },
  // Shipped
  { id: 'BO-2007', distributorId: 'D001', distributorName: 'Farm Connect Distributors', items: [{ product: 'Premium Feed', qty: 300, price: 500 }], totalValue: 150000, status: 'Shipped', date: '2026-03-20', contact: '9876543210' },
  { id: 'BO-2008', distributorId: 'D002', distributorName: 'Ravi Agro Distributors', items: [{ product: 'Layer Chicks', qty: 4000, price: 40 }], totalValue: 160000, status: 'Shipped', date: '2026-03-19', contact: '9123456780' },
  { id: 'BO-2009', distributorId: 'D003', distributorName: 'City Hatcheries Pvt Ltd', items: [{ product: 'Finisher Feed', qty: 100, price: 1300 }, { product: 'Starter Feed', qty: 80, price: 1000 }], totalValue: 210000, status: 'Shipped', date: '2026-03-18', contact: '9988776655' },
  // Delivered
  { id: 'BO-2010', distributorId: 'D001', distributorName: 'Farm Connect Distributors', items: [{ product: 'Broiler Chicks', qty: 10000, price: 32 }], totalValue: 320000, status: 'Delivered', date: '2026-03-17', contact: '9876543210' },
  { id: 'BO-2011', distributorId: 'D002', distributorName: 'Ravi Agro Distributors', items: [{ product: 'Starter Feed', qty: 250, price: 1000 }], totalValue: 250000, status: 'Delivered', date: '2026-03-16', contact: '9123456780' },
  { id: 'BO-2012', distributorId: 'D003', distributorName: 'City Hatcheries Pvt Ltd', items: [{ product: 'Premium Feed', qty: 200, price: 500 }, { product: 'Vaccine Pack', qty: 50, price: 250 }], totalValue: 112500, status: 'Delivered', date: '2026-03-15', contact: '9988776655' },
];

// --- TRANSACTIONS (Distributor Ledger) ---
export const TRANSACTIONS = [
  { id: 'TXN-001', date: '2026-03-25', description: 'Farmer Order #FO-1001 — Ramu Kaka', credit: 32500, debit: 0, balance: 1245000, type: 'sale' },
  { id: 'TXN-002', date: '2026-03-24', description: 'Farmer Order #FO-1002 — Suresh Patil', credit: 10000, debit: 0, balance: 1212500, type: 'sale' },
  { id: 'TXN-003', date: '2026-03-24', description: 'Payment to AgriPoultry Corp — NEFT', credit: 0, debit: 200000, balance: 1202500, type: 'payment' },
  { id: 'TXN-004', date: '2026-03-23', description: 'Farmer Order #FO-1003 — Ganesh Jadhav', credit: 36000, debit: 0, balance: 1402500, type: 'sale' },
  { id: 'TXN-005', date: '2026-03-22', description: 'Bulk Order #BO-2004 — Feed supplies', credit: 0, debit: 260000, balance: 1366500, type: 'purchase' },
  { id: 'TXN-006', date: '2026-03-22', description: 'Farmer Order #FO-1005 — Rajesh Deshmukh', credit: 37500, debit: 0, balance: 1626500, type: 'sale' },
  { id: 'TXN-007', date: '2026-03-21', description: 'Farmer Order #FO-1006 — Anil More', credit: 3200, debit: 0, balance: 1589000, type: 'sale' },
  { id: 'TXN-008', date: '2026-03-20', description: 'Farmer Order #FO-1007 — Vijay Kulkarni', credit: 26000, debit: 0, balance: 1585800, type: 'sale' },
  { id: 'TXN-009', date: '2026-03-20', description: 'Payment to AgriPoultry Corp — UPI', credit: 0, debit: 150000, balance: 1559800, type: 'payment' },
  { id: 'TXN-010', date: '2026-03-19', description: 'Farmer Order #FO-1008 — Manoj Gaikwad', credit: 72000, debit: 0, balance: 1709800, type: 'sale' },
  { id: 'TXN-011', date: '2026-03-18', description: 'Farmer Order #FO-1009 — Deepak Nikam', credit: 15000, debit: 0, balance: 1637800, type: 'sale' },
  { id: 'TXN-012', date: '2026-03-17', description: 'Farmer Order #FO-1010 — Sanjay Bhosale', credit: 22500, debit: 0, balance: 1622800, type: 'sale' },
  { id: 'TXN-013', date: '2026-03-17', description: 'Payment to AgriPoultry Corp — Cash', credit: 0, debit: 100000, balance: 1600300, type: 'payment' },
  { id: 'TXN-014', date: '2026-03-16', description: 'Farmer Order #FO-1011 — Kiran Chavan', credit: 40000, debit: 0, balance: 1700300, type: 'sale' },
  { id: 'TXN-015', date: '2026-03-15', description: 'Bulk Order #BO-2007 — Premium Feed', credit: 0, debit: 150000, balance: 1660300, type: 'purchase' },
  { id: 'TXN-016', date: '2026-03-14', description: 'Commission bonus — March target', credit: 25000, debit: 0, balance: 1810300, type: 'bonus' },
  { id: 'TXN-017', date: '2026-03-13', description: 'Payment to AgriPoultry Corp — NEFT', credit: 0, debit: 300000, balance: 1785300, type: 'payment' },
  { id: 'TXN-018', date: '2026-03-12', description: 'Transport charges — Route A', credit: 0, debit: 12000, balance: 1485300, type: 'expense' },
  { id: 'TXN-019', date: '2026-03-11', description: 'Farmer Orders batch — 5 orders', credit: 85000, debit: 0, balance: 1497300, type: 'sale' },
  { id: 'TXN-020', date: '2026-03-10', description: 'Payment to AgriPoultry Corp — UPI', credit: 0, debit: 250000, balance: 1412300, type: 'payment' },
];

// --- NOTIFICATIONS ---
export const NOTIFICATIONS = [
  { id: 'N001', title: 'New Order Placed', message: 'Ramu Kaka placed order #FO-1001 for Premium Feed', time: '2 mins ago', read: false, type: 'order' },
  { id: 'N002', title: 'Payment Received', message: 'Payment of ₹200,000 received via NEFT', time: '15 mins ago', read: false, type: 'payment' },
  { id: 'N003', title: 'Order Status Update', message: 'Bulk order #BO-2004 moved to Processing', time: '1 hour ago', read: false, type: 'status' },
  { id: 'N004', title: 'Low Stock Alert', message: 'Broiler Chicks stock is running low', time: '2 hours ago', read: true, type: 'alert' },
  { id: 'N005', title: 'New Order Placed', message: 'Suresh Patil placed order #FO-1002 for Layer Chicks', time: '3 hours ago', read: true, type: 'order' },
  { id: 'N006', title: 'Payment Due Reminder', message: 'Outstanding payment of ₹450K due to AgriPoultry Corp', time: '5 hours ago', read: true, type: 'alert' },
  { id: 'N007', title: 'Order Delivered', message: 'Bulk order #BO-2010 has been delivered', time: '8 hours ago', read: true, type: 'status' },
  { id: 'N008', title: 'New Farmer Registered', message: 'Mahesh Yadav added as new farmer', time: '1 day ago', read: true, type: 'system' },
  { id: 'N009', title: 'Monthly Report Ready', message: 'March 2026 financial report is now available', time: '1 day ago', read: true, type: 'system' },
  { id: 'N010', title: 'Order Cancelled', message: 'Prakash Shinde cancelled order #FO-1004', time: '2 days ago', read: true, type: 'order' },
  { id: 'N011', title: 'Price Update', message: 'Broiler Chicks base price updated to ₹32/unit', time: '2 days ago', read: true, type: 'system' },
  { id: 'N012', title: 'Payment Received', message: 'City Hatcheries paid ₹112,500 via NEFT', time: '3 days ago', read: true, type: 'payment' },
  { id: 'N013', title: 'Bulk Order Shipped', message: 'Order #BO-2007 shipped via Logistics Partner A', time: '3 days ago', read: true, type: 'status' },
  { id: 'N014', title: 'System Maintenance', message: 'Scheduled maintenance on March 28, 2-4 AM', time: '4 days ago', read: true, type: 'system' },
  { id: 'N015', title: 'New Distributor', message: 'Valley Supplies has been onboarded', time: '5 days ago', read: true, type: 'system' },
];

// --- LIVE FEED EVENTS (Company Dashboard) ---
export const LIVE_FEED_EVENTS = [
  { id: 'LF01', message: 'Agro Distributors Ltd placed an order for 5000 Chicks', time: '2 mins ago', type: 'order' },
  { id: 'LF02', message: 'City Hatcheries order #BO-2002 updated to Processing', time: '15 mins ago', type: 'status' },
  { id: 'LF03', message: 'Payment of ₹220,000 received from Farm Connect', time: '30 mins ago', type: 'payment' },
  { id: 'LF04', message: 'Driver Ramesh dispatched for Route A shipments', time: '45 mins ago', type: 'dispatch' },
  { id: 'LF05', message: 'New Distributor registered: Valley Supplies', time: '1 hour ago', type: 'system' },
  { id: 'LF06', message: 'Ravi Agro Distributors placed order for 2000 Starter Feed bags', time: '1.5 hours ago', type: 'order' },
  { id: 'LF07', message: 'Order #BO-2010 delivered to Farm Connect Distributors', time: '2 hours ago', type: 'status' },
  { id: 'LF08', message: 'Payment of ₹320,000 received from Ravi Agro', time: '2.5 hours ago', type: 'payment' },
  { id: 'LF09', message: 'Premium Feed stock replenished — 500 bags added', time: '3 hours ago', type: 'system' },
  { id: 'LF10', message: 'Driver Sunil dispatched for Route B shipments', time: '3.5 hours ago', type: 'dispatch' },
  { id: 'LF11', message: 'City Hatcheries placed order for 3000 Layer Chicks', time: '4 hours ago', type: 'order' },
  { id: 'LF12', message: 'Vaccine Pack stock running low — 45 packs remaining', time: '5 hours ago', type: 'system' },
];

// --- DISTRIBUTORS (for Company portal) ---
export const DISTRIBUTORS = [
  { id: 'D001', name: 'Farm Connect Distributors', contact: 'Demo Distributor', phone: '9876543210', email: 'demo@farmconnect.com', region: 'Kolhapur', totalOrdered: 5200000, totalPaid: 3800000, outstanding: 1400000, creditLimit: 2000000 },
  { id: 'D002', name: 'Ravi Agro Distributors', contact: 'Ravi Supplies', phone: '9123456780', email: 'ravi@agro.com', region: 'Pune', totalOrdered: 4100000, totalPaid: 3500000, outstanding: 600000, creditLimit: 1500000 },
  { id: 'D003', name: 'City Hatcheries Pvt Ltd', contact: 'City Hatcheries', phone: '9988776655', email: 'city@hatch.com', region: 'Mumbai', totalOrdered: 3800000, totalPaid: 3200000, outstanding: 600000, creditLimit: 1800000 },
  { id: 'D004', name: 'Valley Farm Supplies', contact: 'Amit Sharma', phone: '9876540004', email: 'amit@valley.com', region: 'Nashik', totalOrdered: 2900000, totalPaid: 2700000, outstanding: 200000, creditLimit: 1200000 },
  { id: 'D005', name: 'Green Agro Networks', contact: 'Sunil Patil', phone: '9876540005', email: 'sunil@greenagro.com', region: 'Sangli', totalOrdered: 1800000, totalPaid: 1600000, outstanding: 200000, creditLimit: 1000000 },
];

// --- INVOICES ---
export const INVOICES = [
  { id: 'INV-001', date: '2026-03-25', amount: 105000, status: 'Pending', orderId: 'BO-2001' },
  { id: 'INV-002', date: '2026-03-23', amount: 260000, status: 'Paid', orderId: 'BO-2004' },
  { id: 'INV-003', date: '2026-03-20', amount: 150000, status: 'Paid', orderId: 'BO-2007' },
  { id: 'INV-004', date: '2026-03-17', amount: 320000, status: 'Paid', orderId: 'BO-2010' },
  { id: 'INV-005', date: '2026-03-14', amount: 85000, status: 'Overdue', orderId: 'BO-2002' },
  { id: 'INV-006', date: '2026-03-12', amount: 210000, status: 'Paid', orderId: 'BO-2009' },
];

// --- CHART DATA ---
export const WEEKLY_ACTIVITY = [
  { name: 'Mon', orders: 12, revenue: 45000 },
  { name: 'Tue', orders: 19, revenue: 72000 },
  { name: 'Wed', orders: 15, revenue: 55000 },
  { name: 'Thu', orders: 25, revenue: 95000 },
  { name: 'Fri', orders: 22, revenue: 81000 },
  { name: 'Sat', orders: 30, revenue: 112000 },
  { name: 'Sun', orders: 28, revenue: 105000 },
];

export const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 6200000 },
  { month: 'Nov', revenue: 7100000 },
  { month: 'Dec', revenue: 6800000 },
  { month: 'Jan', revenue: 7800000 },
  { month: 'Feb', revenue: 8200000 },
  { month: 'Mar', revenue: 9100000 },
];

export const MONTHLY_PROFIT = [
  { month: 'Oct', profit: 1800000, cost: 4400000 },
  { month: 'Nov', profit: 2100000, cost: 5000000 },
  { month: 'Dec', profit: 1900000, cost: 4900000 },
  { month: 'Jan', profit: 2300000, cost: 5500000 },
  { month: 'Feb', profit: 2500000, cost: 5700000 },
  { month: 'Mar', profit: 2800000, cost: 6300000 },
];

export const TOP_DISTRIBUTORS = [
  { name: 'Farm Connect', volume: 520 },
  { name: 'Ravi Agro', volume: 410 },
  { name: 'City Hatcheries', volume: 380 },
  { name: 'Valley Supplies', volume: 290 },
  { name: 'Green Agro', volume: 180 },
];

// --- COMPANY DISTRIBUTOR TRANSACTIONS ---
export const COMPANY_TRANSACTIONS = [
  { id: 'CT-001', date: '2026-03-25', orderId: 'BO-2001', orderAmount: 105000, amountPaid: 0, paymentMode: '-', balanceDue: 105000, status: 'Unpaid', distributorId: 'D001' },
  { id: 'CT-002', date: '2026-03-23', orderId: 'BO-2004', orderAmount: 260000, amountPaid: 260000, paymentMode: 'NEFT', balanceDue: 0, status: 'Paid', distributorId: 'D001' },
  { id: 'CT-003', date: '2026-03-22', orderId: 'BO-2005', orderAmount: 214000, amountPaid: 100000, paymentMode: 'UPI', balanceDue: 114000, status: 'Partial', distributorId: 'D002' },
  { id: 'CT-004', date: '2026-03-21', orderId: 'BO-2006', orderAmount: 25000, amountPaid: 25000, paymentMode: 'Cash', balanceDue: 0, status: 'Paid', distributorId: 'D003' },
  { id: 'CT-005', date: '2026-03-20', orderId: 'BO-2007', orderAmount: 150000, amountPaid: 150000, paymentMode: 'NEFT', balanceDue: 0, status: 'Paid', distributorId: 'D001' },
  { id: 'CT-006', date: '2026-03-19', orderId: 'BO-2008', orderAmount: 160000, amountPaid: 80000, paymentMode: 'UPI', balanceDue: 80000, status: 'Partial', distributorId: 'D002' },
  { id: 'CT-007', date: '2026-03-18', orderId: 'BO-2009', orderAmount: 210000, amountPaid: 210000, paymentMode: 'NEFT', balanceDue: 0, status: 'Paid', distributorId: 'D003' },
  { id: 'CT-008', date: '2026-03-17', orderId: 'BO-2010', orderAmount: 320000, amountPaid: 320000, paymentMode: 'Cash', balanceDue: 0, status: 'Paid', distributorId: 'D001' },
];

// --- FARMER PORTAL ORDERS (Farmer-facing orders) ---
export const FARMER_PORTAL_ORDERS = [
  { id: "FO-3001", farmerId: "F001", product: "Premium Feed", qty: 50, unitPrice: 500, amount: 25000, date: "2026-03-20", status: "Pending", notes: "Please deliver before month end" },
  { id: "FO-3002", farmerId: "F001", product: "Layer Chicks", qty: 200, unitPrice: 40, amount: 8000, date: "2026-03-10", status: "Fulfilled", deliveredDate: "2026-03-14" },
  { id: "FO-3003", farmerId: "F001", product: "Starter Feed", qty: 30, unitPrice: 1000, amount: 30000, date: "2026-02-28", status: "Shipped" },
  { id: "FO-3004", farmerId: "F001", product: "Broiler Chicks", qty: 100, unitPrice: 32, amount: 3200, date: "2026-02-15", status: "Fulfilled" },
  { id: "FO-3005", farmerId: "F001", product: "Finisher Feed", qty: 20, unitPrice: 1300, amount: 26000, date: "2026-01-30", status: "Fulfilled" },
  { id: "FO-3006", farmerId: "F001", product: "Vaccine Pack", qty: 5, unitPrice: 250, amount: 1250, date: "2026-01-10", status: "Cancelled" },
  // Example for F002 & F003
  { id: "FO-3007", farmerId: "F002", product: "Starter Feed", qty: 10, unitPrice: 1000, amount: 10000, date: "2026-03-25", status: "Pending" },
  { id: "FO-3008", farmerId: "F002", product: "Layer Chicks", qty: 100, unitPrice: 40, amount: 4000, date: "2026-03-15", status: "Fulfilled", deliveredDate: "2026-03-18" },
  { id: "FO-3009", farmerId: "F003", product: "Broiler Chicks", qty: 50, unitPrice: 32, amount: 1600, date: "2026-03-22", status: "Pending" },
];

// --- PRODUCTS FOR FARMERS (Displaying distributor prices) ---
export const PRODUCTS_FOR_FARMERS = [
  { id: 'p1', name: 'Starter Feed', category: 'Feed', unit: 'bags', unitPrice: 1200, emoji: '🌾', stock: 'In Stock', description: 'Nutritious starter feed for young chicks (0-4 weeks)' },
  { id: 'p2', name: 'Finisher Feed', category: 'Feed', unit: 'bags', unitPrice: 1500, emoji: '🌾', stock: 'Low Stock', description: 'High-protein finisher feed for market-ready birds' },
  { id: 'p3', name: 'Broiler Chicks', category: 'Chicks', unit: 'chicks', unitPrice: 40, emoji: '🐣', stock: 'Low Stock', description: 'Day-old broiler chicks, vaccinated and healthy' },
  { id: 'p4', name: 'Layer Chicks', category: 'Chicks', unit: 'chicks', unitPrice: 50, emoji: '🐥', stock: 'In Stock', description: 'Day-old layer chicks for egg production' },
  { id: 'p5', name: 'Premium Feed', category: 'Feed', unit: 'bags', unitPrice: 650, emoji: '🌿', stock: 'In Stock', description: 'Organic premium feed blend with added minerals' },
  { id: 'p6', name: 'Vaccine Pack', category: 'Healthcare', unit: 'packs', unitPrice: 320, emoji: '💉', stock: 'In Stock', description: 'Complete vaccination kit for poultry flocks' },
];
