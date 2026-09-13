import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { LandingPage } from './components/LandingPage';
import { FindTailorsPage } from './components/FindTailorsPage';
import { TailorProfilePage } from './components/TailorProfilePage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { TailorDashboard } from './components/TailorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SmartMatcherPage } from './components/SmartMatcherPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { PaymentPage } from './components/PaymentPage';
import { AuthPages } from './components/AuthPages';
import { CustomServiceRequestModal } from './components/CustomServiceRequestModal';
import { AppointmentBookingModal } from './components/AppointmentBookingModal';
import { ReviewModal } from './components/ReviewModal';
import { QuotationModal } from './components/QuotationModal';

import { RoleGuard } from './components/RoleGuard';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'find-tailors' && <FindTailorsPage />}
        {currentView === 'tailor-profile' && <TailorProfilePage />}
        {currentView === 'smart-match' && <SmartMatcherPage />}
        {currentView === 'customer-dashboard' && (
          <RoleGuard allowedRoles={['customer']} roleTitle="Customer Account">
            <CustomerDashboard />
          </RoleGuard>
        )}
        {currentView === 'tailor-dashboard' && (
          <RoleGuard allowedRoles={['tailor']} roleTitle="Master Tailor Workshop">
            <TailorDashboard />
          </RoleGuard>
        )}
        {currentView === 'admin-dashboard' && (
          <RoleGuard allowedRoles={['admin']} roleTitle="Platform Administrator">
            <AdminDashboard />
          </RoleGuard>
        )}
        {currentView === 'track-order' && <OrderTrackingPage />}
        {currentView === 'payment' && <PaymentPage />}
        {(currentView === 'customer-login' ||
          currentView === 'customer-register' ||
          currentView === 'tailor-login' ||
          currentView === 'tailor-register') && <AuthPages />}
      </main>

      <Footer />

      {/* Global Modals */}
      <CustomServiceRequestModal />
      <AppointmentBookingModal />
      <ReviewModal />
      <QuotationModal />

      {/* Toast Notification Layer */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
