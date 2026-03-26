import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Layout
import DashboardLayout from './components/DashboardLayout';

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
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
