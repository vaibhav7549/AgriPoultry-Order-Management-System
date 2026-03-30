import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, ClipboardList, User, Settings, LogOut, Leaf, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function FarmerSidebar({ sidebarOpen, mobile = false, setMobileMenuOpen }) {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  const links = [
    { name: 'Dashboard', path: '/farmer/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Place Order', path: '/farmer/place-order', icon: <ShoppingCart size={20} /> },
    { name: 'My Orders', path: '/farmer/my-orders', icon: <ClipboardList size={20} /> },
    { name: 'My Profile', path: '/farmer/profile', icon: <User size={20} /> },
    { name: 'Settings', path: '/farmer/settings', icon: <Settings size={20} /> },
  ];

  return (
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
          {(sidebarOpen || mobile) && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </>
  );
}
