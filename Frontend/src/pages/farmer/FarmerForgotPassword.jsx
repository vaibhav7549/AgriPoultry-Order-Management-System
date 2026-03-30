import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

export default function FarmerForgotPassword() {
  const [step, setStep] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [maskedContact, setMaskedContact] = useState('');
  const otpRefs = useRef([]);

  const { resetPassword, users } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOTP = () => {
    setError('');
    // Check against farmer dummy users
    const user = users.find(u => (u.phone === identifier || u.email === identifier) && u.role === 'farmer');
    if (!user) { setError('No account found with this phone number'); return; }
    const masked = user.phone ? `****${user.phone.slice(-4)}` : user.email;
    setMaskedContact(masked);
    setCountdown(45);
    setStep(1);
    addToast(`OTP sent to ${masked}`, 'success');
  };

  const handleOTPChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    setError('');
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOTPKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleVerifyOTP = () => {
    const enteredOTP = otp.join('');
    if (enteredOTP === '123456') {
      setStep(2);
      setError('');
    } else {
      setError('Invalid OTP. Try again.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Min 8 characters required'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    const result = resetPassword(identifier, password);
    if (result.success) {
      setStep(3); // success view
    } else {
      setError(result.error);
    }
  };

  const getStrength = () => {
    if (!password) return { score: 0 };
    let s = 0;
    if (password.length >= 8) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[!@#$%^&*]/.test(password)) s++;
    if (password.length >= 12) s++;
    const colors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];
    return { score: s, color: colors[s - 1] || 'bg-gray-200' };
  };
  const strength = getStrength();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] mx-auto">
        
        <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline inline-flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {step === 3 ? (
          <div className="bg-green-600 text-white p-8 rounded-2xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-3">Password Reset Successfully! ✓</h2>
            <p className="text-green-100 mb-8">You can now log in with your new password.</p>
            <Link to="/login" className="bg-white text-green-600 hover:bg-green-50 px-4 py-3 rounded-lg font-medium block transition-colors">
              Go to Login &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6 text-green-600 dark:text-green-400">
              <Leaf size={28} />
              <span className="text-xl font-heading font-bold">AgriPoultry</span>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 0: Enter Phone */}
              {step === 0 && (
                <motion.div key="step-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">Reset Password</h2>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter your registered phone number</label>
                    <input
                      type="tel" value={identifier} onChange={e => { setIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                      className={`input-base ${error ? 'border-red-500' : ''}`}
                      placeholder="10-digit phone number"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button onClick={handleSendOTP} className="w-full btn-primary py-2.5" disabled={identifier.length !== 10}>Send OTP &rarr;</button>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Enter OTP */}
              {step === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">Verify OTP</h2>
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-6 text-center font-medium">OTP sent to {maskedContact}</div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">Enter the 6-digit OTP</label>
                  <div className="flex justify-center gap-2 mb-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i} ref={el => otpRefs.current[i] = el}
                        type="text" maxLength={1} value={digit}
                        onChange={e => handleOTPChange(i, e.target.value)}
                        onKeyDown={e => handleOTPKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all`}
                      />
                    ))}
                  </div>
                  {error && (
                    <motion.p animate={{ x: [0, -8, 8, -8, 8, 0] }} transition={{ duration: 0.4 }} className="text-red-500 text-sm text-center mb-3">{error}</motion.p>
                  )}
                  <button onClick={handleVerifyOTP} className="w-full btn-primary py-2.5 mb-3 mt-4" disabled={otp.join('').length !== 6}>Verify OTP &rarr;</button>
                  <p className="text-center text-sm text-gray-500">
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : (
                      <button onClick={() => { setCountdown(45); addToast(`OTP resent to ${maskedContact}`, 'success'); }} className="text-green-600 font-medium hover:underline">Resend OTP</button>
                    )}
                  </p>
                </motion.div>
              )}

              {/* Step 2: New Password */}
              {step === 2 && (
                <motion.div key="step-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">Reset Password</h2>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Create your new password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className={`input-base pr-10 ${error ? 'border-red-500' : ''}`} placeholder="New password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && (
                      <div className="flex gap-1 h-1.5 mt-2">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                      </div>
                    )}
                    <div className="relative mt-4">
                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} className={`input-base pr-10 ${error ? 'border-red-500' : ''}`} placeholder="Confirm new password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <button type="submit" className="w-full btn-primary py-2.5 mt-6">Reset Password</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
