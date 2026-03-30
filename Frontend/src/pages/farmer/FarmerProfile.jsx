import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../lib/store';
import { User, MapPin, Lock, Save, Camera, History, Package, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';

export default function FarmerProfile() {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { farmerOrders } = useStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showSecurityPassword, setShowSecurityPassword] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '', phone: '', email: '', dob: '', username: '',
    village: '', taluka: '', district: '', state: 'Maharashtra', farmSize: 'Less than 1 acre', assignedDistributorName: ''
  });

  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({ ...prev, ...currentUser }));
    }
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentUser?.userId) return;

    if (activeTab === 'security') {
      if (security.newPassword.length < 8) {
        addToast('Password must be at least 8 characters', 'error');
        return;
      }
      if (security.newPassword !== security.confirmPassword) {
        addToast('Passwords do not match', 'error');
        return;
      }

      setSaving(true);
      api.patch(`/users/${currentUser.userId}/change-password`, {
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      }).then(() => {
        addToast('Password changed successfully', 'success');
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }).catch(() => {
        addToast('Current password is incorrect', 'error');
      }).finally(() => setSaving(false));
      return;
    }

    setSaving(true);
    updateProfile(form);
    setTimeout(() => {
      setSaving(false);
      addToast('Profile updated successfully', 'success');
    }, 800);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'farm', label: 'Farm Details', icon: <MapPin size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'history', label: 'Order History', icon: <History size={18} /> }
  ];

  if (loading) return <div className="space-y-4"><div className="h-40 skeleton" /><div className="h-96 skeleton" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and farm details.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="card-static p-4 flex flex-col items-center mb-4">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-3xl font-bold text-green-700 dark:text-green-400 border-4 border-white dark:border-gray-800 shadow-sm">
                {form.name?.charAt(0) || 'F'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-100 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:text-green-600 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">{form.name}</h2>
            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-2 py-0.5 rounded-full font-medium mt-1 uppercase tracking-wide">{currentUser?.role || 'Farmer'}</span>
          </div>

          <div className="card-static overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-l-4 border-green-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="card-static p-6">
            <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-700 mb-6">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>

            <form onSubmit={handleSave} className="space-y-5">
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input type="text" value={form.username} disabled className="input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
                    <input type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" value={form.dob || ''} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} className="input-base text-gray-500" />
                  </div>
                </div>
              )}

              {activeTab === 'farm' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village</label>
                    <input type="text" value={form.village || ''} onChange={e => setForm(f => ({ ...f, village: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taluka</label>
                    <input type="text" value={form.taluka || ''} onChange={e => setForm(f => ({ ...f, taluka: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                    <input type="text" value={form.district || ''} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                    <input type="text" value={form.state || 'Maharashtra'} disabled className="input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Size</label>
                    <select value={form.farmSize || ''} onChange={e => setForm(f => ({ ...f, farmSize: e.target.value }))} className="input-base">
                      <option value="Less than 1 acre">Less than 1 acre</option>
                      <option value="1-5 acres">1-5 acres</option>
                      <option value="5-10 acres">5-10 acres</option>
                      <option value="More than 10 acres">More than 10 acres</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Distributor</label>
                    <input type="text" value={form.assignedDistributorName || 'None'} disabled className="input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-green-700 dark:text-green-400 font-semibold" />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showSecurityPassword ? 'text' : 'password'}
                        value={security.currentPassword}
                        onChange={e => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
                        placeholder="••••••••"
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showSecurityPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSecurityPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showSecurityPassword ? 'text' : 'password'}
                        value={security.newPassword}
                        onChange={e => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
                        placeholder="New password"
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showSecurityPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSecurityPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showSecurityPassword ? 'text' : 'password'}
                        value={security.confirmPassword}
                        onChange={e => setSecurity(s => ({ ...s, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        className="input-base pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecurityPassword(!showSecurityPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={showSecurityPassword ? 'Hide password' : 'Show password'}
                      >
                        {showSecurityPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="button" className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline">Forgot your password?</button>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders Activity</h3>
                  <div className="relative border-l-2 border-green-200 dark:border-green-900/50 pl-5 space-y-6 ml-2">
                    {farmerOrders?.slice(0, 5).map(order => (
                      <div key={order.id} className="relative">
                        <div className="absolute -left-[29px] w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 border-4 border-white dark:border-gray-800 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Package size={10} />
                        </div>
                        <div className="card-static p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Order {order.id}</h4>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {order.items?.map((item, idx) => (
                              <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
                                {item.qty}x {item.product}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700/50 pt-3">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">₹{order.totalValue?.toLocaleString()}</span>
                            <span className={`text-xs font-semibold ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'Cancelled' ? 'text-red-500' : 'text-blue-500'}`}>{order.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!farmerOrders?.length && (
                      <p className="text-gray-500 text-sm">No recent orders found.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6 flex items-center justify-center gap-2 min-w-[140px] shadow-md shadow-green-500/20">
                  {saving ? <div className="spinner w-4 h-4 border-2"></div> : <><Save size={18} /> {activeTab === 'security' ? 'Update Password' : 'Save Changes'}</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
