import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Bell, LogOut, Menu, X, 
  LayoutDashboard, Users, ShoppingCart, FileText, 
  Package, DollarSign
} from 'lucide-react';

export default function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (user?.role === 'distributor') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Farmer Orders', path: '/farmer-orders', icon: <Users size={20} /> },
        { name: 'Bulk Orders', path: '/bulk-ordering', icon: <ShoppingCart size={20} /> },
        { name: 'Ledger', path: '/ledger', icon: <FileText size={20} /> },
      ];
    }
    return [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { name: 'Order Fulfillment', path: '/kanban-fulfillment', icon: <Package size={20} /> },
      { name: 'Product Master', path: '/product-master', icon: <DollarSign size={20} /> },
      { name: 'Distributor Ledger', path: '/distributor-ledger', icon: <FileText size={20} /> },
    ];
  };

  const links = getLinks();
  const currentPathName = links.find(l => l.path === location.pathname)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex transition-colors duration-300">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
        className="bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 flex flex-col z-20 shrink-0 shadow-sm"
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-gray-700 px-4">
          <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 font-bold text-xl w-full">
            <div className="shrink-0 bg-primary-100 dark:bg-primary-900/50 p-1.5 rounded-lg flex items-center justify-center">
              <Package size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  AgriPoultry
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-custom">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700/50'}`}
                title={!sidebarOpen ? link.name : undefined}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNavTab"
                    className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-md" 
                  />
                )}
                <div className={`shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 group-hover:text-primary-500 dark:text-gray-500 dark:group-hover:text-primary-400'} transition-colors`}>
                  {link.icon}
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-gray-700">
           <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-slate-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 group ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} className="shrink-0 transition-transform group-hover:-translate-x-1" />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-slate-500 dark:text-gray-400">AgriPoultry</span>
              <span className="text-slate-300 dark:text-gray-600">/</span>
              <span className="font-medium text-slate-900 dark:text-white">{currentPathName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-yellow-400 hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group"
              aria-label="Toggle Dark Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} fill="currentColor" className="text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Notification Bell */}
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white dark:border-gray-800"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-gray-700">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user?.name}</span>
                <span className="text-xs text-slate-500 dark:text-gray-400 capitalize">{user?.role}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300 border-2 border-primary-200 dark:border-primary-800 shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto scrollbar-custom bg-slate-50/50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
