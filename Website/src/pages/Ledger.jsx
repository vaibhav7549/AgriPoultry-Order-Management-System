import React from 'react';
import { Construction } from 'lucide-react';

export default function Ledger() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
        <Construction size={48} className="text-primary-600 dark:text-primary-400" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Ledger Details</h1>
      <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto">
        This module is currently under construction and is slated for the upcoming Phase 2 release of the AgriPoultry Order Management System.
      </p>
    </div>
  );
}
