import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Scissors,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  User,
  ChevronDown,
  Settings,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    logout,
    navigateToDashboard,
    currentView,
    setCurrentView,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userInitial = currentUser?.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          aria-label="Local Tailor Connect Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 flex items-center justify-center text-white shadow-sm ring-1 ring-amber-500/20 group-hover:scale-105 transition-all">
            <Scissors className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="font-sans font-bold text-base sm:text-lg tracking-wider text-stone-900 uppercase block leading-none">
              LOCAL TAILOR CONNECT
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-stone-400 mt-1 block">
              Bespoke & Alterations
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-sm font-medium text-stone-600">
          <button
            onClick={() => setCurrentView('home')}
            className={`hover:text-stone-950 transition-colors ${
              currentView === 'home' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('find-tailors')}
            className={`hover:text-stone-950 transition-colors ${
              currentView === 'find-tailors' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            Find Tailors
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              setTimeout(() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-stone-950 transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => {
              setCurrentView('home');
              setTimeout(() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-stone-950 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => setCurrentView('smart-match')}
            className={`hover:text-stone-950 transition-colors flex items-center gap-1.5 ${
              currentView === 'smart-match' ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Smart Match</span>
          </button>
        </nav>

        {/* Right Authentication & Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-3 shadow-xs hover:border-amber-300 hover:bg-amber-50/40 transition-colors"
                aria-expanded={profileMenuOpen}
                aria-label="Open account menu"
              >
                <span className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center text-sm font-bold">
                  {userInitial}
                </span>
                <span className="hidden sm:block text-left leading-tight max-w-36">
                  <span className="block text-xs font-bold text-stone-900 truncate">{currentUser.name}</span>
                  <span className="block text-[10px] text-stone-500 capitalize">{currentUser.role}</span>
                </span>
                <ChevronDown className={`hidden sm:block w-4 h-4 text-stone-500 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-stone-900/10">
                  <div className="px-3 py-3 border-b border-stone-100 mb-1">
                    <p className="text-sm font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigateToDashboard();
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-800" />
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentView('profile-settings');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    <Settings className="w-4 h-4 text-stone-500" />
                    Edit profile
                  </button>
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        void logout();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => setCurrentView('customer-login')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-800 text-amber-800 hover:bg-amber-50 text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>

              <button
                onClick={() => setCurrentView('customer-register')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-700">
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-800"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('find-tailors');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-800"
            >
              Find Tailors
            </button>
            <button
              onClick={() => {
                setCurrentView('smart-match');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 hover:text-amber-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart Match</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-2 hover:text-amber-800"
            >
              Services
            </button>
            <button
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-left py-2 hover:text-amber-800"
            >
              How It Works
            </button>
          </nav>

          <div className="border-t border-stone-100 pt-3">
            {isAuthenticated && currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-1 pb-2">
                  <span className="w-10 h-10 rounded-full bg-amber-800 text-white flex items-center justify-center text-sm font-bold">
                    {userInitial}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigateToDashboard();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-800 text-white font-semibold text-xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('profile-settings');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    void logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-stone-200 text-stone-700 font-medium text-xs hover:bg-stone-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentView('customer-login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg border border-amber-800 text-amber-800 font-semibold text-xs text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setCurrentView('customer-register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg bg-amber-800 text-white font-semibold text-xs text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
