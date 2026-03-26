import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl mb-6">🌾</div>
      <h1 className="text-6xl font-heading font-bold text-green-700 dark:text-green-400 mb-4">404</h1>
      <h2 className="text-2xl font-heading font-bold text-gray-800 dark:text-white mb-2">Lost in the fields</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base">
        <Home size={18} /> Go to Dashboard
      </Link>
      <div className="flex items-center gap-2 mt-8 text-green-600 dark:text-green-400 opacity-60">
        <Leaf size={16} />
        <span className="text-sm font-medium">AgriPoultry OS</span>
      </div>
    </div>
  );
}
