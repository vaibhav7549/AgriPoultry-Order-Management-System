import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useStore } from './lib/store';

// Data Hydrator — fetches all backend data when user logs in
function DataHydrator() {
  const { currentUser } = useAuth();
  const store = useStore();

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.id;
    const dbId = currentUser.userId;

    const refresh = () => {
      if (currentUser.role === 'distributor') {
        store.fetchFarmerOrders({ distributorId: dbId });
        store.fetchBulkOrders(userId);
        store.fetchPurchases({ distributorId: dbId });
        store.fetchLedgerEntries(dbId);
        store.fetchInvoices();
      } else if (currentUser.role === 'company') {
        store.fetchBulkOrders();
        store.fetchPurchases({ companyId: dbId });
        store.fetchInvoices();
      } else if (currentUser.role === 'farmer') {
        store.fetchFarmerOrders({ farmerId: dbId });
      }
    };

    // Initial load
    if (currentUser.role === 'distributor') {
      store.fetchFarmerOrders({ distributorId: dbId });
      store.fetchFarmers(dbId);
      store.fetchProducts();
      store.fetchBulkOrders(userId);
      store.fetchTransactions(userId);
      store.fetchNotifications(userId);
      store.fetchPurchases({ distributorId: dbId });
      store.fetchLedgerEntries(dbId);
      store.fetchInvoices();
    } else if (currentUser.role === 'company') {
      store.fetchBulkOrders();
      store.fetchProducts();
      store.fetchNotifications(userId);
      store.fetchPurchases({ companyId: dbId });
      store.fetchInvoices();
    } else if (currentUser.role === 'farmer') {
      store.fetchFarmerOrders({ farmerId: dbId });
      store.fetchProducts();
      store.fetchNotifications(userId);
    }

    // Periodic refresh (live dashboards)
    const interval = setInterval(refresh, 7000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  return null;
}

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Farmer Portal Sub-layout & Pages
import FarmerLayout from './components/farmer/FarmerLayout';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerPlaceOrder from './pages/farmer/FarmerPlaceOrder';
import FarmerMyOrders from './pages/farmer/FarmerMyOrders';
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmerSettings from './pages/farmer/FarmerSettings';
import FarmerRegister from './pages/farmer/FarmerRegister';
import FarmerForgotPassword from './pages/farmer/FarmerForgotPassword';

// Dashboards
import DistributorDashboard from './pages/DistributorDashboard';
import CompanyDashboard from './pages/CompanyDashboard';

// Distributor Pages
import FarmerOrders from './pages/FarmerOrders';
import BulkOrdering from './pages/BulkOrdering';
import Ledger from './pages/Ledger';

// Company Pages
import KanbanFulfillment from './pages/KanbanFulfillment';
import ProductMaster from './pages/ProductMaster';
import DistributorLedger from './pages/DistributorLedger';

// Shared Pages
import Settings from './pages/Settings';

// Protected Route Wrapper — uses AuthContext
const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

// Dashboard Route — renders role-specific dashboard
function DashboardRoute() {
  const { currentUser } = useAuth();
  return currentUser?.role === 'distributor' ? <DistributorDashboard /> : <CompanyDashboard />;
}

function App() {
  return (
    <>
    <DataHydrator />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/farmer/register" element={<FarmerRegister />} />
      <Route path="/farmer/forgot-password" element={<FarmerForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Dynamic Dashboard */}
          <Route path="/dashboard" element={<DashboardRoute />} />

          {/* Shared */}
          <Route path="/settings" element={<Settings />} />

          {/* Distributor-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['distributor']} />}>
            <Route path="/farmer-orders" element={<FarmerOrders />} />
            <Route path="/bulk-ordering" element={<BulkOrdering />} />
            <Route path="/ledger" element={<Ledger />} />
          </Route>

          {/* Company-only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/kanban-fulfillment" element={<KanbanFulfillment />} />
            <Route path="/product-master" element={<ProductMaster />} />
            <Route path="/distributor-ledger" element={<DistributorLedger />} />
          </Route>
        </Route>
      </Route>

      {/* Farmer Portal Routes */}
      <Route path="/farmer" element={<ProtectedRoute allowedRoles={['farmer']} />}>
        <Route element={<FarmerLayout />}>
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="place-order" element={<FarmerPlaceOrder />} />
          <Route path="my-orders" element={<FarmerMyOrders />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="settings" element={<FarmerSettings />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
