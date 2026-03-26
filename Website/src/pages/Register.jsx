import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, UserCircle, Building2, ChevronRight, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

const STEPS = ['Personal', 'Business', 'Security'];
const REGIONS = ['Kolhapur', 'Pune', 'Mumbai', 'Nashik', 'Sangli', 'Aurangabad'];
const DEPARTMENTS = ['Operations', 'Sales', 'Logistics', 'Finance'];

export default function Register() {
  const [role, setRole] = useState('distributor');
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', username: '',
    company: '', address: '', gstin: '', region: 'Kolhapur', department: 'Operations',
    password: '', confirmPassword: '', agreeTerms: false,
  });

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // Auto-suggest username from name
  const handleNameChange = (val) => {
    set('name', val);
    const suggested = val.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    if (!form.username || form.username === form.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')) {
      set('username', suggested);
    }
  };

  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: 'bg-gray-200' };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[!@#$%^&*]/.test(pw)) s++;
    if (pw.length >= 12) s++;
    const levels = [
      { label: 'Weak', color: 'bg-red-500' },
      { label: 'Fair', color: 'bg-amber-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score: s, ...(levels[s - 1] || levels[0]) };
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
      if (!form.username.trim()) e.username = 'Username is required';
    } else if (step === 1) {
      if (!form.company.trim()) e.company = 'Company name required';
      if (!form.address.trim()) e.address = 'Address required';
      if (form.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin)) e.gstin = 'Invalid GSTIN format';
    } else if (step === 2) {
      if (!form.password || form.password.length < 8) e.password = 'Min 8 characters required';
      else if (!/[0-9]/.test(form.password)) e.password = 'Must contain a number';
      else if (!/[!@#$%^&*]/.test(form.password)) e.password = 'Must contain a special character';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
      if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep()) setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const result = register({
      name: form.name, phone: form.phone, email: form.email, username: form.username,
      company: form.company, address: form.address, gstin: form.gstin,
      region: role === 'distributor' ? form.region : undefined,
      department: role === 'company' ? form.department : undefined,
      password: form.password, role,
    });

    if (result.success) {
      addToast('Account created! Redirecting to login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      addToast(result.error, 'error');
    }
  };

  const strength = getPasswordStrength(form.password);

  const FieldError = ({ field }) => errors[field] ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-gray-900">
      {/* Left Side */}
      <div className="md:w-1/2 w-full bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 relative overflow-hidden flex flex-col justify-center items-center text-white p-12 min-h-[200px]">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 800" className="w-full h-full" fill="currentColor">
            <circle cx="650" cy="150" r="350" />
            <circle cx="150" cy="650" r="250" opacity="0.5" />
          </svg>
        </div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Leaf size={48} className="text-amber-300" />
            <h1 className="text-5xl font-heading font-bold tracking-tight">AgriPoultry</h1>
          </div>
          <p className="text-lg text-green-100 max-w-md mx-auto">Join our smart supply chain network today.</p>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fill in details to get started</p>

            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-6 relative">
              {['distributor', 'company'].map(r => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all relative z-10 ${role === r ? 'text-white' : 'text-gray-500'}`}>
                  {r === 'distributor' ? <UserCircle size={16} /> : <Building2 size={16} />}
                  {r === 'distributor' ? 'Distributor' : 'Company'}
                  {role === r && <motion.div layoutId="activeRoleReg" className="absolute inset-0 bg-green-600 rounded-full -z-10" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                </button>
              ))}
            </div>

            {/* Step Progress */}
            <div className="flex items-center mb-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < step ? 'bg-green-600 border-green-600 text-white' : i === step ? 'border-green-600 text-green-600' : 'border-gray-300 dark:border-gray-600 text-gray-400'}`}>
                      {i < step ? <Check size={14} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${i <= step ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)} className={`input-base ${errors.name ? 'border-red-500' : ''}`} placeholder="Your full name" />
                    <FieldError field="name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} className={`input-base ${errors.phone ? 'border-red-500' : ''}`} placeholder="10-digit mobile" />
                    <FieldError field="phone" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={`input-base ${errors.email ? 'border-red-500' : ''}`} placeholder="you@email.com" />
                    <FieldError field="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <input type="text" value={form.username} onChange={e => set('username', e.target.value)} className={`input-base ${errors.username ? 'border-red-500' : ''}`} placeholder="Choose a username" />
                    <FieldError field="username" />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company / Business Name</label>
                    <input type="text" value={form.company} onChange={e => set('company', e.target.value)} className={`input-base ${errors.company ? 'border-red-500' : ''}`} placeholder="Business name" />
                    <FieldError field="company" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Address</label>
                    <textarea value={form.address} onChange={e => set('address', e.target.value)} className={`input-base resize-none ${errors.address ? 'border-red-500' : ''}`} rows={3} placeholder="Full address" />
                    <FieldError field="address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GSTIN <span className="text-gray-400">(optional)</span></label>
                    <input type="text" value={form.gstin} onChange={e => set('gstin', e.target.value.toUpperCase())} className={`input-base ${errors.gstin ? 'border-red-500' : ''}`} placeholder="22AAAAA0000A1Z5" maxLength={15} />
                    <FieldError field="gstin" />
                  </div>
                  {role === 'distributor' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Region</label>
                      <select value={form.region} onChange={e => set('region', e.target.value)} className="input-base">
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                      <select value={form.department} onChange={e => set('department', e.target.value)} className="input-base">
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className={`input-base pr-10 ${errors.password ? 'border-red-500' : ''}`} placeholder="Min 8 chars, 1 number, 1 special" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <FieldError field="password" />
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 h-1.5">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                          ))}
                        </div>
                        <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                    <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className={`input-base ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="Re-enter password" />
                    <FieldError field="confirmPassword" />
                  </div>
                  <label className={`flex items-start gap-2 cursor-pointer ${errors.agreeTerms ? 'text-red-500' : ''}`}>
                    <input type="checkbox" checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">I agree to the <span className="text-green-600 dark:text-green-400 font-medium">Terms of Service</span> and <span className="text-green-600 dark:text-green-400 font-medium">Privacy Policy</span></span>
                  </label>
                  <FieldError field="agreeTerms" />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-2">
                {step > 0 && (
                  <button type="button" onClick={handleBack} className="btn-outline flex items-center gap-1 flex-1">
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                {step < 2 ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-1 flex-1 justify-center">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="submit" className="btn-primary flex-1 py-2.5">Create Account</button>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Already have an account? <Link to="/login" className="font-medium text-green-600 dark:text-green-400 hover:underline">Log In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
