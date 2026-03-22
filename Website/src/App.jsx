import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DistributorDashboard from './pages/DistributorDashboard';
import FarmerOrders from './pages/FarmerOrders';
import BulkOrdering from './pages/BulkOrdering';
import CompanyDashboard from './pages/CompanyDashboard';
import KanbanFulfillment from './pages/KanbanFulfillment';
import ProductMaster from './pages/ProductMaster';
import Ledger from './pages/Ledger';
import { useStore } from './lib/store';

// Protected Route Wrapper
const ProtectedRoute = ({ allowedRoles }) => {
  const user = useStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

function App() {
  const user = useStore(state => state.user);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Dynamic Dashboard routing based on role */}
          <Route path="/dashboard" element={
            user?.role === 'distributor' ? <DistributorDashboard /> : <CompanyDashboard />
          } />

          {/* Distributor Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={['distributor']} />}>
            <Route path="/farmer-orders" element={<FarmerOrders />} />
            <Route path="/bulk-ordering" element={<BulkOrdering />} />
            <Route path="/ledger" element={<Ledger />} />
          </Route>

          {/* Company Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route path="/kanban-fulfillment" element={<KanbanFulfillment />} />
            <Route path="/product-master" element={<ProductMaster />} />
            <Route path="/distributor-ledger" element={<Ledger />} />
          </Route>
          
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
