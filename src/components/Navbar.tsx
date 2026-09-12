import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  MapPin,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Store,
  Check,
  Calendar,
  Package,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    currentView,
    setCurrentView,
    customer,
    notifications,
    markNotificationAsRead,
    selectedCity,
    setSelectedCity,
    pincode,
    setPincode,
    setSelectedOrderId,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const cities = [
    { city: 'Pudukkottai', pincode: '622001', state: 'Tamil Nadu' },
    { city: 'Trichy', pincode: '620018', state: 'Tamil Nadu' },
    { city: 'Madurai', pincode: '625016', state: 'Tamil Nadu' },
    { city: 'Chennai', pincode: '600017', state: 'Tamil Nadu' },
    { city: 'Coimbatore', pincode: '641002', state: 'Tamil Nadu' },
  ];

  const handleCitySelect = (c: { city: string; pincode: string }) => {
    setSelectedCity(c.city);
    setPincode(c.pincode);
    setLocationDropdownOpen(false);
  };

  const handleNotificationClick = (notifId: string, orderId?: string) => {
    markNotificationAsRead(notifId);
    setNotificationsOpen(false);
    if (orderId) {
      setSelectedOrderId(orderId);
      setCurrentView('track-order');
    } else {
      if (role === 'customer') setCurrentView('customer-dashboard');
      else setCurrentView('tailor-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Demo Switcher Bar */}
      <div className="bg-stone-950 text-stone-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between border-b border-amber-900/30 shadow-inner">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-semibold text-stone-200 tracking-wide">Live Prototype Mode:</span>
          <span className="hidden sm:inline text-stone-400 text-[11px]">Switch perspectives instantly to test real workflows</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setRole('customer')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'customer'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm ring-1 ring-amber-400/50'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${role === 'customer' ? 'bg-white' : 'bg-stone-600'}`}></span>
            Customer (Priya)
          </button>
          <button
            onClick={() => setRole('tailor')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'tailor'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${role === 'tailor' ? 'bg-white' : 'bg-stone-600'}`}></span>
            Tailor (Lakshmi)
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              role === 'admin'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-sm ring-1 ring-indigo-400/50'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-white' : 'bg-stone-600'}`}></span>
            Admin (Rajesh)
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md shadow-amber-950/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight leading-none group-hover:text-amber-800 transition-colors">
                Local Tailor Connect
              </div>
              <span className="text-[11px] font-medium text-stone-500 tracking-wide block mt-0.5">
                Your perfect fit, just around the corner
              </span>
            </div>
          </button>

          {/* Location Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/80 hover:bg-stone-100 text-xs font-medium text-stone-700 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>{selectedCity}</span>
              <span className="text-stone-400 text-[11px]">({pincode})</span>
              <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-stone-100">
                  <p className="text-xs font-semibold text-stone-800">Select City or Pincode</p>
                  <p className="text-[11px] text-stone-500">Discover trusted tailors nearby</p>
                  <div className="mt-2 flex gap-1">
                    <input
                      type="text"
                      placeholder="Enter pincode..."
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 border border-stone-200 rounded-md focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="py-1">
                  {cities.map((c) => (
                    <button
                      key={c.city}
                      onClick={() => handleCitySelect(c)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-900 rounded-lg transition-colors text-left"
                    >
                      <div>
                        <span className="font-semibold">{c.city}</span>
                        <span className="text-stone-400 ml-1.5">({c.pincode})</span>
                      </div>
                      {selectedCity === c.city && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => setCurrentView('home')}
            className={`hover:text-amber-800 transition-colors ${
              currentView === 'home' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('find-tailors')}
            className={`hover:text-amber-800 transition-colors ${
              currentView === 'find-tailors' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            Find Tailors
          </button>
          <button
            onClick={() => setCurrentView('smart-match')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200/70 hover:bg-amber-100 transition-all`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Find Best Match
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-amber-800 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              setTimeout(() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-amber-800 transition-colors"
          >
            Services
          </button>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Notifications
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach((n) => markNotificationAsRead(n.id));
                      }}
                      className="text-[11px] text-amber-700 font-semibold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.orderId)}
                      className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex gap-3 items-start ${
                        !notif.isRead ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                        {notif.type === 'order' && <Package className="w-4 h-4" />}
                        {notif.type === 'quote' && <Sparkles className="w-4 h-4" />}
                        {notif.type === 'appointment' && <Calendar className="w-4 h-4" />}
                        {notif.type !== 'order' && notif.type !== 'quote' && notif.type !== 'appointment' && (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                        {notif.orderId && (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded">
                            Order #{notif.orderId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Dashboard link based on role */}
          {role === 'customer' && (
            <button
              onClick={() => setCurrentView('customer-dashboard')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentView === 'customer-dashboard'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-amber-700 hover:text-amber-800'
              }`}
            >
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Priya's Dashboard</span>
            </button>
          )}

          {role === 'tailor' && (
            <button
              onClick={() => setCurrentView('tailor-dashboard')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentView === 'tailor-dashboard'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-amber-700 hover:text-amber-800'
              }`}
            >
              <Store className="w-4 h-4 text-amber-700" />
              <span>Tailor Workspace</span>
            </button>
          )}

          {role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin-dashboard')}
              className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                currentView === 'admin-dashboard'
                  ? 'bg-amber-800 text-white border-amber-800'
                  : 'bg-white border-stone-200 text-stone-800 hover:border-amber-700 hover:text-amber-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Get Started / Find a Tailor CTA */}
          <button
            onClick={() => setCurrentView('find-tailors')}
            className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            Find Tailor
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-xs font-semibold text-stone-700 mb-1">Your Selected Location:</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-900">
                {selectedCity} ({pincode})
              </span>
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="text-xs text-amber-800 font-semibold"
              >
                Change
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('find-tailors');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              Find Tailors
            </button>
            <button
              onClick={() => {
                setCurrentView('smart-match');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-amber-800 hover:bg-amber-50 rounded-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              Smart Tailor Matching
            </button>
            <button
              onClick={() => {
                setCurrentView('customer-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              Customer Dashboard (Priya)
            </button>
            <button
              onClick={() => {
                setCurrentView('tailor-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              Tailor Dashboard (Lakshmi)
            </button>
            <button
              onClick={() => {
                setCurrentView('admin-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 rounded-lg"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
