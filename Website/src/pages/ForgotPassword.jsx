import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
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
    const user = users.find(u => u.phone === identifier || u.email === identifier);
    if (!user) { setError('No account found with this phone/email'); return; }
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
      setError('Invalid OTP. Try 123456.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Min 8 characters required'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    const result = resetPassword(identifier, password);
    if (result.success) {
      addToast('Password reset successful!', 'success');
      setTimeout(() => navigate('/login'), 2000);
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
    const colors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
    return { score: s, color: colors[s - 1] || 'bg-gray-200' };
  };
  const strength = getStrength();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6 text-green-600 dark:text-green-400">
            <Leaf size={28} />
            <span className="text-xl font-heading font-bold">AgriPoultry</span>
          </div>

          {/* Step 0: Enter Phone/Email */}
          {step === 0 && (
            <>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1 text-center">Forgot Password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">Enter your registered phone number or email</p>
              <div className="space-y-4">
                <input
                  type="text" value={identifier} onChange={e => { setIdentifier(e.target.value); setError(''); }}
                  className={`input-base ${error ? 'border-red-500' : ''}`}
                  placeholder="Phone number or email"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button onClick={handleSendOTP} className="w-full btn-primary py-2.5" disabled={!identifier.trim()}>Send OTP</button>
              </div>
            </>
          )}

          {/* Step 1: Enter OTP */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1 text-center">Verify OTP</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">OTP sent to {maskedContact}</p>
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOTPChange(i, e.target.value)}
                    onKeyDown={e => handleOTPKeyDown(i, e)}
                    className={`w-11 h-12 text-center text-lg font-bold rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all`}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
              <button onClick={handleVerifyOTP} className="w-full btn-primary py-2.5 mb-3" disabled={otp.join('').length !== 6}>Verify OTP</button>
              <p className="text-center text-sm text-gray-500">
                {countdown > 0 ? `Resend in ${countdown}s` : (
                  <button onClick={() => { setCountdown(45); addToast(`OTP resent to ${maskedContact}`, 'success'); }} className="text-green-600 font-medium hover:underline">Resend OTP</button>
                )}
              </p>
            </>
          )}

          {/* Step 2: New Password */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1 text-center">Reset Password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">Enter your new password</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} className={`input-base pr-10 ${error ? 'border-red-500' : ''}`} placeholder="New password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="flex gap-1 h-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                )}
                <input type="password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} className={`input-base ${error ? 'border-red-500' : ''}`} placeholder="Confirm new password" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full btn-primary py-2.5">Reset Password</button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
