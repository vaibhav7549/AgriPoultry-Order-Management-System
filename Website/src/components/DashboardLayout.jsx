import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useStore } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Bell, LogOut, Menu, X, Search,
  LayoutDashboard, Users, ShoppingCart, FileText,
  Package, DollarSign, Settings, Leaf, ChevronDown,
  User, Command
} from 'lucide-react';
import { FARMERS, PRODUCTS as PRODUCT_DATA, DISTRIBUTORS } from '../data/mockData';

export default function DashboardLayout() {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const notifications = useStore(s => s.notifications);
  const markNotificationRead = useStore(s => s.markNotificationRead);
  const markAllNotificationsRead = useStore(s => s.markAllNotificationsRead);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') setShowSearch(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const getLinks = () => {
    if (currentUser?.role === 'distributor') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Farmer Orders', path: '/farmer-orders', icon: <Users size={20} /> },
        { name: 'Bulk Orders', path: '/bulk-ordering', icon: <ShoppingCart size={20} /> },
        { name: 'Ledger', path: '/ledger', icon: <FileText size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
      ];
    }
    return [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
      { name: 'Order Fulfillment', path: '/kanban-fulfillment', icon: <Package size={20} /> },
      { name: 'Product Master', path: '/product-master', icon: <DollarSign size={20} /> },
      { name: 'Distributor Ledger', path: '/distributor-ledger', icon: <FileText size={20} /> },
      { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];
  };

  const links = getLinks();
  const currentPathName = links.find(l => l.path === location.pathname)?.name || 'Dashboard';

  // Search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    const farmerOrders = useStore.getState().farmerOrders || [];
    farmerOrders.filter(o => o.id.toLowerCase().includes(q) || o.farmerName.toLowerCase().includes(q)).slice(0, 3)
      .forEach(o => results.push({ type: 'Order', label: `${o.id} — ${o.farmerName}`, path: '/farmer-orders' }));
    FARMERS.filter(f => f.name.toLowerCase().includes(q) || f.phone.includes(q)).slice(0, 3)
      .forEach(f => results.push({ type: 'Farmer', label: `${f.name} — ${f.phone}`, path: '/farmer-orders' }));
    PRODUCT_DATA.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3)
      .forEach(p => results.push({ type: 'Product', label: p.name, path: '/product-master' }));
    DISTRIBUTORS.filter(d => d.name.toLowerCase().includes(q)).slice(0, 3)
      .forEach(d => results.push({ type: 'Distributor', label: d.name, path: '/distributor-ledger' }));
    return results;
  };

  const notifDotColor = (type) => {
    if (type === 'order') return 'bg-amber-400';
    if (type === 'payment') return 'bg-green-500';
    if (type === 'status') return 'bg-blue-400';
    if (type === 'alert') return 'bg-red-500';
    return 'bg-gray-400';
  };

  // Sidebar content
  const SidebarContent = ({ mobile = false }) => (
    <>
      <div className={`h-16 flex items-center border-b border-gray-200 dark:border-gray-700 px-4 ${mobile ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-2.5 text-green-600 dark:text-green-400 font-bold text-lg">
          <div className="bg-green-50 dark:bg-green-900/50 p-1.5 rounded-lg"><Leaf size={22} /></div>
          {(sidebarOpen || mobile) && <span className="font-heading whitespace-nowrap">AgriPoultry</span>}
        </div>
        {mobile && <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-500"><X size={20} /></button>}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-custom">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <NavLink
              key={link.path} to={link.path}
              onClick={() => mobile && setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
              {isActive && <div className="absolute left-0 w-1 h-7 bg-green-600 rounded-r-md" />}
              <span className={isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>{link.icon}</span>
              {(sidebarOpen || mobile) && <span className="whitespace-nowrap text-sm">{link.name}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200 ${!sidebarOpen && !mobile ? 'justify-center' : ''}`}>
          <LogOut size={20} />
          {(sidebarOpen || mobile) && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 shadow-sm transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-[72px]'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 flex flex-col md:hidden shadow-2xl">
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => { if (window.innerWidth < 768) setMobileMenuOpen(true); else setSidebarOpen(!sidebarOpen); }}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="text-gray-400 dark:text-gray-500">AgriPoultry</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="font-semibold text-gray-900 dark:text-white">{currentPathName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search trigger */}
            <button onClick={() => setShowSearch(true)} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Search size={15} /> <span>Search...</span>
              <kbd className="ml-2 px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded text-xs font-mono border border-gray-200 dark:border-gray-500">⌘K</kbd>
            </button>

            {/* Theme */}
            <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">{unreadCount}</span>}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
                      <button onClick={() => { markAllNotificationsRead(); }} className="text-xs text-green-600 dark:text-green-400 font-medium hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-custom">
                      {notifications.slice(0, 10).map(n => (
                        <div key={n.id} onClick={() => markNotificationRead(n.id)}
                          className={`p-3 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700/50 ${!n.read ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notifDotColor(n.type)}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700 ml-1">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{currentUser?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center font-bold text-green-700 dark:text-green-300 text-sm border-2 border-green-200 dark:border-green-800">
                  {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setShowProfile(false); navigate('/settings'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <User size={16} /> View Profile
                      </button>
                      <button onClick={() => { setShowProfile(false); navigate('/settings'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <Settings size={16} /> Settings
                      </button>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                      <button onClick={() => { setShowProfile(false); handleLogout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-custom bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setShowSearch(false)}>
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <Search size={20} className="text-gray-400" />
                <input ref={searchRef} autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-gray-900 dark:text-white outline-none text-base placeholder-gray-400" placeholder="Search orders, farmers, products..." />
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 border border-gray-200 dark:border-gray-600">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {searchQuery.trim() ? (
                  getSearchResults().length > 0 ? getSearchResults().map((r, i) => (
                    <button key={i} onClick={() => { navigate(r.path); setShowSearch(false); setSearchQuery(''); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-left transition-colors">
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">{r.type}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{r.label}</span>
                    </button>
                  )) : (
                    <p className="text-center text-gray-400 py-8 text-sm">No results found</p>
                  )
                ) : (
                  <p className="text-center text-gray-400 py-8 text-sm">Type to search across orders, farmers, products, and distributors</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
