import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, UserCircle, Store, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { useNavigate } from 'react-router-dom';

const roles = ['Distributor', 'Company'];

export default function Login() {
  const [role, setRole] = useState('Distributor');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [exiting, setExiting] = useState(false);
  const login = useStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      setExiting(true);
      setTimeout(() => {
        login({ name: role === 'Distributor' ? 'Demo Distributor' : 'AgriPoultry Corp', role: role.toLowerCase() });
        navigate('/dashboard');
      }, 500); // Wait for exit animation
    }, 1500);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-gray-900"
        >
          {/* Left Side - Visual */}
          <div className="md:w-1/2 w-full bg-primary-600 dark:bg-primary-500 relative overflow-hidden flex flex-col justify-center items-center text-white p-12">
            {/* Abstract Background SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <path d="M400,0 C620.9139,0 800,179.0861 800,400 C800,620.9139 620.9139,800 400,800 C179.0861,800 0,620.9139 0,400 C0,179.0861 179.0861,0 400,0 Z" fill="currentColor" />
              <path d="M100,400 C100,565.6854 234.3146,700 400,700 C565.6854,700 700,565.6854 700,400 C700,234.3146 565.6854,100 400,100 C234.3146,100 100,234.3146 100,400 Z" fill="rgba(255,255,255,0.1)" />
            </svg>

            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Leaf size={48} className="text-secondary-400" />
                <h1 className="text-5xl font-bold tracking-tight">AgriPoultry</h1>
              </div>
              <p className="text-lg text-primary-100 max-w-md mx-auto">
                The smart supply chain order management system connecting farmers, distributors, and the core company.
              </p>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12 relative">
            <div className="w-full max-w-md glassmorphism p-8 rounded-2xl shadow-xl z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                <p className="text-slate-500 dark:text-gray-400">Please enter your credentials to access your portal</p>
              </div>

              {/* Role Toggle */}
              <div className="flex p-1 bg-slate-100 dark:bg-gray-700/50 rounded-full mb-8 relative">
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-colors relative z-10 ${role === r ? 'text-primary-600 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'}`}
                  >
                    {r === 'Distributor' ? <UserCircle size={18} /> : <Store size={18} />}
                    {r}
                    {role === r && (
                      <motion.div
                        layoutId="activeRole"
                        className="absolute inset-0 bg-white dark:bg-primary-500 shadow-sm rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Floating Label Input - Username */}
                <div className="relative">
                  <input 
                    type="text" 
                    id="username"
                    required
                    className="block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-slate-200 dark:border-gray-600 appearance-none dark:text-white dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 peer transition-colors"
                    placeholder=" "
                  />
                  <label htmlFor="username" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-primary-500 dark:peer-focus:text-primary-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Username or Phone</label>
                </div>

                {/* Floating Label Input - Password */}
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    className="block px-4 pb-2.5 pt-6 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-slate-200 dark:border-gray-600 appearance-none dark:text-white dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 peer transition-colors"
                    placeholder=" "
                  />
                  <label htmlFor="password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-primary-500 dark:peer-focus:text-primary-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-gray-600 rounded bg-transparent peer-checked:bg-primary-500 peer-checked:border-primary-500 transition-colors flex items-center justify-center">
                         <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-gray-300 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-3 flex items-center justify-center h-12 text-lg"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : 'Log In'}
                </button>
              </form>
            </div>
            
            {/* Dark Mode Decor */}
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 dark:text-gray-600">
              AgriPoultry OS v2.0
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
