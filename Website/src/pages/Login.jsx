import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, UserCircle, Building2, Eye, EyeOff, Loader2, Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const roles = ['farmer', 'distributor', 'company'];

export default function Login() {
  const location = useLocation();
  const [role, setRole] = useState(location.state?.defaultRole || 'farmer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(identifier.trim(), password, role);
      setLoading(false);
      if (result.success) {
        addToast(`Welcome back, ${result.user.name}!`, 'success');
        if (role === 'farmer') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-gray-900">
      {/* Left Side */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 relative overflow-hidden flex flex-col justify-center items-center text-white p-12 min-h-[240px]">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 800" className="w-full h-full" fill="currentColor">
            <circle cx="650" cy="150" r="350" />
            <circle cx="150" cy="650" r="250" opacity="0.5" />
          </svg>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Leaf size={48} className="text-amber-300" />
            <h1 className="text-5xl font-heading font-bold tracking-tight">AgriPoultry</h1>
          </div>
          {role === 'farmer' ? (
            <div className="flex flex-col items-center gap-3">
              <span className="px-3 py-1 bg-amber-500 text-amber-50 text-xs font-bold uppercase tracking-wider rounded-full">Farmer Portal</span>
              <p className="text-lg text-green-100 max-w-md mx-auto">
                Order feed and chicks for your farm directly from your distributor.
              </p>
            </div>
          ) : (
            <p className="text-lg text-green-100 max-w-md mx-auto">
              The smart supply chain order management system connecting farmers, distributors, and the core company.
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400">Please enter your credentials to access your portal</p>
            </div>

            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-8 relative">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setRole(r); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200 relative z-10 ${role === r ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                >
                  {r === 'distributor' ? <UserCircle size={18} /> : r === 'company' ? <Building2 size={18} /> : <Wheat size={18} />}
                  {r === 'distributor' ? 'Distributor' : r === 'company' ? 'Company' : 'Farmer'}
                  {role === r && (
                    <motion.div
                      layoutId="activeRoleLogin"
                      className="absolute inset-0 bg-green-600 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username/Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username or Phone</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                  className={`input-base ${error && !identifier.trim() ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g. demo_distributor or 9876543210"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className={`input-base pr-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm mt-1.5">{error}</motion.p>
                )}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link to={role === 'farmer' ? "/farmer/forgot-password" : "/forgot-password"} className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center text-base"
              >
                {loading ? <Loader2 size={22} className="animate-spin" /> : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to={role === 'farmer' ? "/farmer/register" : "/register"} className="font-medium text-green-600 dark:text-green-400 hover:underline">
                {role === 'farmer' ? "Register as Farmer" : "Create Account"}
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-4">AgriPoultry OS v2.0</p>
        </motion.div>
      </div>
    </div>
  );
}
