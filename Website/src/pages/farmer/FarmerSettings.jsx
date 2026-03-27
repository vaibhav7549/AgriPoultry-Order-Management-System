import React, { useState } from 'react';
import { Bell, Globe, Phone, ShieldAlert, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';

export default function FarmerSettings() {
  const { addToast } = useToast();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    smsNotifications: true,
    whatsappUpdates: true,
    language: 'English',
    dataSharing: false
  });

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const saveSettings = () => {
    addToast('Preferences saved successfully', 'success');
  };

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div className="pr-4">
        <p className="font-medium text-gray-900 dark:text-white text-sm">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${checked ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your app preferences and notifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><Bell size={20} /></div>
            <h2 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Notifications</h2>
          </div>
          <div className="mt-2">
            <Toggle label="Push Notifications" desc="Receive alerts on your device for order updates." checked={settings.pushNotifications} onChange={() => handleToggle('pushNotifications')} />
            <Toggle label="SMS Alerts" desc="Get text messages for delivery tracking." checked={settings.smsNotifications} onChange={() => handleToggle('smsNotifications')} />
            <Toggle label="WhatsApp Updates" desc="Receive invoices and updates on WhatsApp." checked={settings.whatsappUpdates} onChange={() => handleToggle('whatsappUpdates')} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-static p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><Globe size={20} /></div>
            <h2 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Preferences</h2>
          </div>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select value={settings.language} onChange={e => setSettings(s => ({ ...s, language: e.target.value }))} className="input-base">
                <option value="English">English</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>
            <div className="pt-2">
              <Toggle label="Analytics Sharing" desc="Share anonymous usage data to help us improve." checked={settings.dataSharing} onChange={() => handleToggle('dataSharing')} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-static p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400"><ShieldAlert size={20} /></div>
            <h2 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Danger Zone</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">These actions are permanent and cannot be undone. Proceed with caution.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors">
              Deactivate Account
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm">
              Delete Account Permanently
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={saveSettings} className="btn-primary py-2.5 px-6 min-w-[150px]">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
