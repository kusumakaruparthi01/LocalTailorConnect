import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldAlert, LogIn, ArrowRight, Home } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  roleTitle: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  roleTitle,
  children,
}) => {
  const { role, currentUser, isAuthenticated, navigateToDashboard, setCurrentView } = useApp();

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  // If user is guest/not logged in
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              Authentication Required
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">
              Sign In to Continue
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
              Please log in to your account to view the {roleTitle}.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => setCurrentView('customer-login')}
              className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Credentials</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in with a different role
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
            Access Restricted
          </span>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2">
            {roleTitle} Only
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            You are signed in as <strong className="text-stone-800 font-semibold">{currentUser.name}</strong> ({currentUser.role}). This section requires {roleTitle} credentials.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => navigateToDashboard()}
            className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Open My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('customer-login')}
            className="w-full py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium"
          >
            Switch Account / Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
