import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Scissors,
  User,
  Store,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  Check,
} from 'lucide-react';

export const AuthPages: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    loginWithCredentials,
    registerUser,
  } = useApp();

  const isRegister = currentView === 'customer-register' || currentView === 'tailor-register';

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [registerRole, setRegisterRole] = useState<'customer' | 'tailor'>(
    currentView === 'tailor-register' ? 'tailor' : 'customer'
  );
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('Pudukkottai');
  const [regShopName, setRegShopName] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    const result = await loginWithCredentials(loginIdentifier, loginPassword);
    setIsSubmitting(false);
    if (!result.success) {
      setLoginError(result.message || 'Invalid credentials. Please check your details.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    const result = await registerUser({
      role: registerRole,
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      city: regCity,
      shopName: registerRole === 'tailor' ? regShopName : undefined,
    });
    setIsSubmitting(false);
    if (!result.success) setLoginError(result.message || 'Unable to create account.');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 ring-1 ring-amber-200/50 mb-1">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {isRegister ? 'Create Your Account' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
            {isRegister
              ? 'Select your role to get started with custom bespoke tailoring'
              : 'Enter your credentials to be redirected to your active dashboard'}
          </p>
        </div>

        {/* ================= LOGIN VIEW ================= */}
        {!isRegister && (
          <>
            {/* Error banner */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {loginError}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter email or phone..."
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{isSubmitting ? 'Signing in…' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('customer-register')}
                className="font-bold text-amber-800 hover:underline"
              >
                Create an account
              </button>
            </div>
          </>
        )}

        {/* ================= REGISTER VIEW ================= */}
        {isRegister && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            {/* Step 1: Select Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                1. Select Account Type:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegisterRole('customer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    registerRole === 'customer'
                      ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <User className={`w-5 h-5 ${registerRole === 'customer' ? 'text-amber-800' : 'text-stone-500'}`} />
                    {registerRole === 'customer' && <Check className="w-4 h-4 text-amber-800" />}
                  </div>
                  <p className="text-xs font-bold text-stone-900">Customer</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Order custom stitching & alterations</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegisterRole('tailor')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    registerRole === 'tailor'
                      ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Store className={`w-5 h-5 ${registerRole === 'tailor' ? 'text-emerald-800' : 'text-stone-500'}`} />
                    {registerRole === 'tailor' && <Check className="w-4 h-4 text-emerald-800" />}
                  </div>
                  <p className="text-xs font-bold text-stone-900">Master Tailor</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Manage workshop, orders & quotes</p>
                </button>
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="space-y-3.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                2. Enter Your Information:
              </label>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Kavitha Raman"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                  required
                />
              </div>

              {registerRole === 'tailor' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Workshop / Boutique Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={regShopName}
                      onChange={(e) => setRegShopName(e.target.value)}
                      placeholder="e.g. Raman Bespoke Studio"
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-emerald-800"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Mobile Number</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98401 00000"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">City / Town</label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Pudukkottai"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-800"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>
                {isSubmitting ? 'Creating account…' : registerRole === 'tailor' ? 'Complete Tailor Registration' : 'Complete Customer Sign Up'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('customer-login')}
                className="font-bold text-amber-800 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
