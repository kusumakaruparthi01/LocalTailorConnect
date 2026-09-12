import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Scissors,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { currentView, setCurrentView, setRole, addToast } = useApp();

  const isRegister = currentView === 'customer-register' || currentView === 'tailor-register';
  const defaultRole: UserRole = currentView.includes('tailor') ? 'tailor' : 'customer';

  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('Pudukkottai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(selectedRole);

    if (selectedRole === 'tailor') {
      addToast(
        'success',
        isRegister ? 'Shop Registered!' : 'Welcome Master Tailor!',
        'Your workshop portal is now active.'
      );
      setCurrentView('tailor-dashboard');
    } else {
      addToast(
        'success',
        isRegister ? 'Account Created!' : 'Welcome Back!',
        'Find tailors or track your ongoing garments.'
      );
      setCurrentView('customer-dashboard');
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setRole(role);
    if (role === 'admin') {
      addToast('info', 'Admin Access Granted', 'Switched to SuperAdmin overview.');
      setCurrentView('admin-dashboard');
    } else if (role === 'tailor') {
      addToast('success', 'Tailor Login', 'Signed in as Lakshmi Stitching Studio.');
      setCurrentView('tailor-dashboard');
    } else {
      addToast('success', 'Customer Login', 'Signed in as Ananya Sharma.');
      setCurrentView('customer-dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 mb-2">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            {isRegister ? 'Create Your Account' : 'Welcome to Local Tailor Connect'}
          </h1>
          <p className="text-xs text-stone-500">
            {isRegister
              ? 'Join thousands getting perfect bespoke fits'
              : 'Sign in to access your measurements and orders'}
          </p>
        </div>

        {/* Quick Demo Switcher Card */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block text-center">
            One-Click Instant Demo Login:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
            <button
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-stone-800 text-center shadow-2xs"
            >
              Customer
            </button>
            <button
              onClick={() => handleQuickDemo('tailor')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-amber-900 text-center shadow-2xs font-bold"
            >
              Master Tailor
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-blue-900 text-center shadow-2xs font-bold"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'customer'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('tailor')}
            className={`py-2 rounded-lg transition-all ${
              selectedRole === 'tailor'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            I am a Tailor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Sharma or Lakshmi R."
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                required
              />
            </div>
          )}

          {selectedRole === 'tailor' && isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Boutique / Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Lakshmi Stitching Studio"
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-stone-300 rounded-l-xl bg-stone-50 text-stone-500 text-xs font-medium">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98421 90812"
                className="w-full text-xs p-2.5 border border-stone-300 rounded-r-xl focus:outline-none focus:border-amber-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Password / OTP</label>
            <input
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>
              {isRegister
                ? selectedRole === 'tailor'
                  ? 'Register Tailor Workshop'
                  : 'Create Customer Account'
                : 'Sign In'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign In / Register */}
        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setCurrentView('customer-login')}
                className="font-bold text-amber-800 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Local Tailor Connect?{' '}
              <button
                onClick={() => setCurrentView('customer-register')}
                className="font-bold text-amber-800 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
