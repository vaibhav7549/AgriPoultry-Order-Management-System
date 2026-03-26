import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Shield, Bell, Palette, Save, Eye, EyeOff, Monitor, Moon, Sun, Smartphone, Globe, UserPlus } from 'lucide-react';

const TABS = [
  { key: 'profile', label: 'Profile', icon: <User size={16} /> },
  { key: 'security', label: 'Security', icon: <Shield size={16} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
  { key: 'appearance', label: 'Appearance', icon: <Palette size={16} /> },
];

export default function Settings() {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({
    name: currentUser?.name || '', phone: currentUser?.phone || '', email: currentUser?.email || '',
    company: currentUser?.company || '', address: currentUser?.address || '', region: currentUser?.region || '',
    gstin: currentUser?.gstin || '',
  });

  // Security state
  const [passwords, setPasswords] = useState({ current: '', new_: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    newFarmerOrder: true, bulkOrderStatus: true, paymentDue: true, monthlyReport: true, promotional: false,
  });

  // Appearance
  const [themeChoice, setThemeChoice] = useState(isDark ? 'dark' : 'light');
  const [language, setLanguage] = useState('English');

  const handleSaveProfile = () => {
    updateProfile(profile);
    addToast('Profile updated successfully', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new_.length < 8) { addToast('Password must be at least 8 characters', 'error'); return; }
    if (passwords.new_ !== passwords.confirm) { addToast('Passwords do not match', 'error'); return; }
    addToast('Password changed successfully', 'success');
    setPasswords({ current: '', new_: '', confirm: '' });
  };

  const handleApplyTheme = () => {
    if (themeChoice === 'dark' && !isDark) toggleTheme();
    if (themeChoice === 'light' && isDark) toggleTheme();
    addToast('Appearance settings applied', 'success');
  };

  const Toggle = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full transition-all relative ${checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your account and preferences</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sub-nav */}
        <div className="md:w-48 shrink-0">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === t.key ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card-static p-6 space-y-5">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl font-bold text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800">{currentUser?.avatar || 'U'}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{currentUser?.role} · ID: {currentUser?.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input-base text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="input-base text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="input-base text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                  <input type="text" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} className="input-base text-sm" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <textarea value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} className="input-base text-sm resize-none" rows={2} /></div>
              {currentUser?.role === 'distributor' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                    <input type="text" value={profile.region} onChange={e => setProfile(p => ({ ...p, region: e.target.value }))} className="input-base text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GSTIN</label>
                    <input type="text" value={profile.gstin} onChange={e => setProfile(p => ({ ...p, gstin: e.target.value }))} className="input-base text-sm" /></div>
                </div>
              )}
              {currentUser?.role === 'company' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CIN</label><input type="text" className="input-base text-sm" placeholder="U74999MH2020PTC123456" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Support Email</label><input type="email" className="input-base text-sm" defaultValue="support@agripoultry.com" /></div>
                </div>
              )}
              <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2 text-sm"><Save size={16} /> Save Changes</button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card-static p-6">
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} className="input-base text-sm pr-10" placeholder="Current password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <input type="password" value={passwords.new_} onChange={e => setPasswords(p => ({ ...p, new_: e.target.value }))} className="input-base text-sm" placeholder="New password" />
                  <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} className="input-base text-sm" placeholder="Confirm new password" />
                  <button type="submit" className="btn-primary text-sm">Update Password</button>
                </form>
              </div>
              <div className="card-static p-6">
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'Kolhapur', status: 'Active now' },
                    { device: 'Mobile App', location: 'Pune', status: '2 days ago' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone size={18} className="text-gray-500" />
                        <div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.device} · {s.location}</p><p className="text-xs text-gray-500">{s.status}</p></div>
                      </div>
                      {i > 0 && <button className="text-xs text-red-600 font-medium hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-static p-6">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-heading font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3><p className="text-xs text-gray-500 mt-1">Add an extra layer of security</p></div>
                  <Toggle checked={false} onChange={() => addToast('2FA toggle UI only', 'warning')} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card-static p-6 space-y-4">
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
              {[
                { key: 'newFarmerOrder', label: 'New Farmer Order' },
                { key: 'bulkOrderStatus', label: 'Bulk Order Status Update' },
                { key: 'paymentDue', label: 'Payment Due Reminder' },
                { key: 'monthlyReport', label: 'Monthly Report' },
                { key: 'promotional', label: 'Promotional Updates' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <Toggle checked={notifPrefs[item.key]} onChange={v => setNotifPrefs(p => ({ ...p, [item.key]: v }))} />
                </div>
              ))}
              <button onClick={() => addToast('Preferences saved', 'success')} className="btn-primary text-sm mt-2"><Save size={16} className="inline mr-1" /> Save Preferences</button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card-static p-6 space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'light', label: 'Light', icon: <Sun size={20} />, bg: 'bg-white border-gray-200' },
                    { key: 'dark', label: 'Dark', icon: <Moon size={20} />, bg: 'bg-gray-800 border-gray-600 text-white' },
                    { key: 'system', label: 'System', icon: <Monitor size={20} />, bg: 'bg-gradient-to-r from-white to-gray-800 border-gray-300' },
                  ].map(t => (
                    <button key={t.key} onClick={() => setThemeChoice(t.key)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${themeChoice === t.key ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div className={`w-12 h-8 rounded-lg ${t.bg} flex items-center justify-center`}>{t.icon}</div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-3">Language</h3>
                <div className="flex gap-3">
                  {['English', 'Hindi', 'Marathi'].map(l => (
                    <button key={l} onClick={() => setLanguage(l)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${language === l ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-1">Currency Display</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1"><Globe size={14} /> ₹ INR (Indian Rupee)</p>
              </div>
              <button onClick={handleApplyTheme} className="btn-primary text-sm">Apply</button>
            </div>
          )}

          {/* Company-specific: User Management */}
          {activeTab === 'profile' && currentUser?.role === 'company' && (
            <div className="card-static p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white">User Management</h3>
                <button className="btn-outline text-sm flex items-center gap-1"><UserPlus size={14} /> Invite User</button>
              </div>
              <table className="w-full text-left">
                <thead><tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="py-2 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="py-2 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="py-2 text-xs font-semibold text-gray-500 uppercase">Role</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {[
                    { name: 'AgriPoultry Corp', email: 'admin@agripoultry.com', role: 'Admin' },
                    { name: 'Poultry Manager', email: 'manager@agripoultry.com', role: 'Manager' },
                  ].map((u, i) => (
                    <tr key={i}><td className="py-2 text-sm font-medium text-gray-800 dark:text-gray-200">{u.name}</td><td className="py-2 text-sm text-gray-500">{u.email}</td><td className="py-2"><span className="badge badge-processing">{u.role}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
