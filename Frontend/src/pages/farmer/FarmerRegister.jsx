import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, ChevronRight, ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { DISTRIBUTORS } from '../../data/mockData';

const STEPS = ['Personal', 'Farm', 'Security'];
const DISTRICTS = ['Kolhapur', 'Pune', 'Sangli', 'Satara', 'Solapur', 'Nashik', 'Aurangabad', 'Mumbai', 'Nagpur', 'Thane'];
const FARM_SIZES = ['Less than 1 acre', '1-5 acres', '5-10 acres', 'More than 10 acres'];
const PRODUCT_INTERESTS = ['Feed', 'Layer Chicks', 'Broiler Chicks', 'Vaccines'];

export default function FarmerRegister() {
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({
    name: '', phone: '', email: '', dob: '', username: '',
    village: '', taluka: '', district: 'Kolhapur', state: 'Maharashtra',
    farmSize: 'Less than 1 acre', interests: [], assignedDistributorId: 'D001',
    password: '', confirmPassword: '', agreeTerms: false, agreeWhatsApp: false,
  });

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const toggleInterest = (interest) => {
    setForm(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
    setErrors(prev => ({ ...prev, interests: '' }));
  };

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
      { label: 'Good', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score: s, ...(levels[s - 1] || levels[0]) };
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
      if (!form.username.trim()) e.username = 'Username is required';
    } else if (step === 1) {
      if (!form.village.trim()) e.village = 'Village name required';
      if (!form.taluka.trim()) e.taluka = 'Taluka required';
    } else if (step === 2) {
      if (!form.password || form.password.length < 8) e.password = 'Min 8 characters required';
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

    const assignedDist = DISTRIBUTORS.find(d => d.id === form.assignedDistributorId);

    const result = register({
      role: 'farmer',
      name: form.name, phone: form.phone, email: form.email, 
      dob: form.dob, username: form.username,
      village: form.village, taluka: form.taluka, district: form.district, state: form.state,
      farmSize: form.farmSize,
      interests: form.interests,
      assignedDistributorId: form.assignedDistributorId,
      assignedDistributorName: assignedDist ? assignedDist.name : 'Unknown Distributor',
      password: form.password,
      totalOrders: 0, activeOrders: 0
    });

    if (result.success) {
      if (result.username) {
        addToast(`Account created. Your username: ${result.username}`, 'success');
      }
      setIsSuccess(true);
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
            <Sprout size={48} className="text-amber-300" />
            <h1 className="text-5xl font-heading font-bold tracking-tight">AgriPoultry</h1>
          </div>
          <p className="text-lg text-green-100 max-w-md mx-auto">Join thousands of farmers already ordering smarter with AgriPoultry.</p>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            {isSuccess ? (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">Registration Successful! 🌾</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Your account has been created. You can now log in using your phone number and password.</p>
                <Link to="/login" className="btn-primary w-full py-3 inline-flex justify-center flex-1">
                  Go to Login &rarr;
                </Link>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">Farmer Registration</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Create your farmer account</p>

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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                        <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)} className={`input-base ${errors.name ? 'border-red-500' : ''}`} placeholder="Your full name" />
                        <FieldError field="name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                        <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} className={`input-base ${errors.phone ? 'border-red-500' : ''}`} placeholder="10-digit mobile number" />
                        <FieldError field="phone" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-gray-400">(optional)</span></label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={`input-base ${errors.email ? 'border-red-500' : ''}`} placeholder="you@email.com" />
                        <FieldError field="email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth <span className="text-gray-400">(optional)</span></label>
                        <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} className="input-base text-gray-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                        <input type="text" value={form.username} readOnly className={`input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed ${errors.username ? 'border-red-500' : ''}`} placeholder="Auto-generated username" />
                        <FieldError field="username" />
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Village Name *</label>
                          <input type="text" value={form.village} onChange={e => set('village', e.target.value)} className={`input-base ${errors.village ? 'border-red-500' : ''}`} placeholder="E.g. Shirol" />
                          <FieldError field="village" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taluka *</label>
                          <input type="text" value={form.taluka} onChange={e => set('taluka', e.target.value)} className={`input-base ${errors.taluka ? 'border-red-500' : ''}`} placeholder="E.g. Shirol" />
                          <FieldError field="taluka" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District *</label>
                          <select value={form.district} onChange={e => set('district', e.target.value)} className="input-base">
                            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                          <input type="text" value={form.state} readOnly className="input-base bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Farm Size <span className="text-gray-400">(optional)</span></label>
                        <select value={form.farmSize} onChange={e => set('farmSize', e.target.value)} className="input-base">
                          {FARM_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Product Interest</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {PRODUCT_INTERESTS.map(interest => (
                            <button
                              key={interest} type="button" onClick={() => toggleInterest(interest)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.interests.includes(interest) ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-white border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'}`}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select your distributor / आपला वितरक निवडा *</label>
                        <select value={form.assignedDistributorId} onChange={e => set('assignedDistributorId', e.target.value)} className="input-base">
                          {DISTRIBUTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                        <div className="relative">
                          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className={`input-base pr-10 ${errors.password ? 'border-red-500' : ''}`} placeholder="Min 8 chars" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password *</label>
                        <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} className={`input-base ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="Re-enter password" />
                        <FieldError field="confirmPassword" />
                      </div>
                      <label className={`flex items-start gap-2 cursor-pointer mt-4 ${errors.agreeTerms ? 'text-red-500' : ''}`}>
                        <input type="checkbox" checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">I agree to the Terms & Conditions</span>
                      </label>
                      <FieldError field="agreeTerms" />
                      <label className="flex items-start gap-2 cursor-pointer mt-2">
                        <input type="checkbox" checked={form.agreeWhatsApp} onChange={e => set('agreeWhatsApp', e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                        <span className="text-sm text-amber-700 dark:text-amber-500 font-medium">I agree to receive WhatsApp notifications via AgriPoultry</span>
                      </label>
                    </>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-2">
                    {step > 0 && (
                      <button type="button" onClick={handleBack} className="btn-outline flex items-center gap-1 flex-1 justify-center">
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

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 md:mb-0 mb-4">
                  Already have an account? <Link to="/login" className="font-medium text-green-600 dark:text-green-400 hover:underline">Log In</Link>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
