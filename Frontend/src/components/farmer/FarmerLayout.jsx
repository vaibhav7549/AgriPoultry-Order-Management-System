import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FarmerSidebar from './FarmerSidebar';
import FarmerTopbar from './FarmerTopbar';

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 shadow-sm transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-[72px]'}`}>
        <FarmerSidebar sidebarOpen={sidebarOpen} setMobileMenuOpen={setMobileMenuOpen} />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-50 flex flex-col md:hidden shadow-2xl">
              <FarmerSidebar sidebarOpen={true} mobile={true} setMobileMenuOpen={setMobileMenuOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <FarmerTopbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto scrollbar-custom bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
