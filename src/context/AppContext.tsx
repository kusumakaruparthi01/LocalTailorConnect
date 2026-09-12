import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Tailor,
  CustomerUser,
  MeasurementProfile,
  Order,
  Appointment,
  ChatMessage,
  AppNotification,
  Quotation,
  OrderStatus,
} from '../types';
import {
  INITIAL_CUSTOMER,
  INITIAL_MEASUREMENT_PROFILES,
  INITIAL_TAILORS,
  INITIAL_ORDERS,
  INITIAL_APPOINTMENTS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type AppView =
  | 'home'
  | 'find-tailors'
  | 'tailor-profile'
  | 'smart-match'
  | 'customer-dashboard'
  | 'tailor-dashboard'
  | 'admin-dashboard'
  | 'track-order'
  | 'customer-login'
  | 'customer-register'
  | 'tailor-login'
  | 'tailor-register'
  | 'payment';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  customer: CustomerUser;
  tailors: Tailor[];
  orders: Order[];
  measurementProfiles: MeasurementProfile[];
  appointments: Appointment[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  selectedTailorId: string;
  setSelectedTailorId: (id: string) => void;
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  pincode: string;
  setPincode: (pin: string) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Actions
  addMeasurementProfile: (profile: Omit<MeasurementProfile, 'id' | 'customerId' | 'updatedAt'>) => void;
  updateMeasurementProfile: (id: string, updates: Partial<MeasurementProfile>) => void;
  deleteMeasurementProfile: (id: string) => void;
  createOrderRequest: (orderData: Partial<Order>) => string;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  sendQuotation: (quotation: Omit<Quotation, 'id' | 'sentDate'>) => void;
  respondToQuotation: (orderId: string, accept: boolean) => void;
  completePayment: (orderId: string, method: string) => void;
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  sendMessage: (text: string, orderId?: string, attachmentUrl?: string) => void;
  submitReview: (tailorId: string, rating: number, comment: string, garmentType: string, breakdown: any) => void;
  toggleSavedTailor: (tailorId: string) => void;
  verifyTailor: (tailorId: string, isVerified: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  reorderPreviousOrder: (prevOrder: Order) => string;

  // Modal controls
  isCustomRequestOpen: boolean;
  setIsCustomRequestOpen: (open: boolean) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  isQuotationModalOpen: boolean;
  setIsQuotationModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe LocalStorage loaders
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('ltc_role') as UserRole) || 'customer';
  });

  const [currentView, setCurrentViewState] = useState<AppView>(() => {
    return (localStorage.getItem('ltc_view') as AppView) || 'home';
  });

  const [customer, setCustomer] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('ltc_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [tailors, setTailors] = useState<Tailor[]>(() => {
    const saved = localStorage.getItem('ltc_tailors');
    return saved ? JSON.parse(saved) : INITIAL_TAILORS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ltc_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementProfile[]>(() => {
    const saved = localStorage.getItem('ltc_measurements');
    return saved ? JSON.parse(saved) : INITIAL_MEASUREMENT_PROFILES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ltc_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('ltc_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ltc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedTailorId, setSelectedTailorId] = useState<string>('tailor_01');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('LTC-10482');
  const [selectedCity, setSelectedCity] = useState<string>('Pudukkottai');
  const [pincode, setPincode] = useState<string>('622001');

  // Modals
  const [isCustomRequestOpen, setIsCustomRequestOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ltc_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('ltc_view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('ltc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ltc_tailors', JSON.stringify(tailors));
  }, [tailors]);

  useEffect(() => {
    localStorage.setItem('ltc_measurements', JSON.stringify(measurementProfiles));
  }, [measurementProfiles]);

  useEffect(() => {
    localStorage.setItem('ltc_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('ltc_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ltc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ltc_customer', JSON.stringify(customer));
  }, [customer]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'customer') {
      setCurrentViewState('customer-dashboard');
      addToast('info', 'Switched View', 'Now viewing as Customer (Priya Sharma)');
    } else if (newRole === 'tailor') {
      setCurrentViewState('tailor-dashboard');
      addToast('info', 'Switched View', 'Now viewing as Tailor (Lakshmi Stitching Studio)');
    } else if (newRole === 'admin') {
      setCurrentViewState('admin-dashboard');
      addToast('info', 'Switched View', 'Now viewing as Platform Admin');
    }
  };

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Measurement Profile Actions
  const addMeasurementProfile = (profile: Omit<MeasurementProfile, 'id' | 'customerId' | 'updatedAt'>) => {
    const newProfile: MeasurementProfile = {
      ...profile,
      id: 'mp_' + Date.now(),
      customerId: customer.id,
      updatedAt: 'Just now',
    };
    setMeasurementProfiles((prev) => [newProfile, ...prev]);
    addToast('success', 'Profile Created', `"${newProfile.profileName}" saved to your measurements.`);
  };

  const updateMeasurementProfile = (id: string, updates: Partial<MeasurementProfile>) => {
    setMeasurementProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: 'Just now' } : p))
    );
    addToast('success', 'Measurements Updated', 'Your digital measurements were successfully updated.');
  };

  const deleteMeasurementProfile = (id: string) => {
    setMeasurementProfiles((prev) => prev.filter((p) => p.id !== id));
    addToast('info', 'Profile Deleted', 'The measurement profile was removed.');
  };

  // Order Actions
  const createOrderRequest = (orderData: Partial<Order>): string => {
    const newOrderId = 'LTC-' + (10500 + Math.floor(Math.random() * 900));
    const targetTailor = tailors.find((t) => t.id === orderData.tailorId) || tailors[0];

    const newOrder: Order = {
      id: newOrderId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      tailorId: targetTailor.id,
      tailorName: targetTailor.name,
      tailorShop: targetTailor.shopName,
      tailorPhone: targetTailor.phone,
      serviceType: orderData.serviceType || 'New Clothing',
      garmentType: orderData.garmentType || 'Blouse',
      requirements: orderData.requirements || 'Standard tailored fit',
      referenceImages: orderData.referenceImages || [],
      measurementProfileName: orderData.measurementProfileName || 'My Standard Measurements',
      measurements: orderData.measurements || {},
      deliveryOption: orderData.deliveryOption || 'Home delivery',
      deliveryAddress: orderData.deliveryAddress || 'West Main Street, Pudukkottai',
      status: 'Request Received',
      estimatedCompletion: orderData.estimatedCompletion || '18 September 2026',
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: orderData.totalAmount || targetTailor.startingPrice,
      paymentStatus: 'Pending',
      timeline: [
        {
          status: 'Request Received',
          timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          note: 'Customer submitted custom service request.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send push notification to customer & tailor
    const newNotification: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: customer.id,
      title: 'Order Request Sent',
      message: `Your request #${newOrderId} was submitted to ${targetTailor.shopName}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'order',
      orderId: newOrderId,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    addToast('success', 'Request Submitted', `Order #${newOrderId} sent to ${targetTailor.shopName}!`);
    return newOrderId;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const timeNow = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [...ord.timeline];
          const existingIndex = updatedTimeline.findIndex((t) => t.status === newStatus);

          if (existingIndex >= 0) {
            updatedTimeline[existingIndex] = {
              ...updatedTimeline[existingIndex],
              completed: true,
              timestamp: timeNow,
              note: note || updatedTimeline[existingIndex].note,
            };
          } else {
            updatedTimeline.push({
              status: newStatus,
              timestamp: timeNow,
              completed: true,
              note: note || `Order transitioned to ${newStatus}.`,
            });
          }

          return {
            ...ord,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    // Create realistic customer notification
    const orderObj = orders.find((o) => o.id === orderId);
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: customer.id,
      title: 'Order Update',
      message: `Order #${orderId} (${orderObj?.garmentType || 'Garment'}) has moved to: ${newStatus}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'order',
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('info', 'Status Updated', `Order #${orderId} marked as ${newStatus}`);
  };

  const sendQuotation = (quoteData: Omit<Quotation, 'id' | 'sentDate'>) => {
    const quoteId = 'QT-' + (2000 + Math.floor(Math.random() * 900));
    const nowStr = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newQuotation: Quotation = {
      ...quoteData,
      id: quoteId,
      sentDate: nowStr,
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === quoteData.orderId) {
          return {
            ...ord,
            totalAmount: newQuotation.totalAmount,
            quotation: newQuotation,
            status: ord.status === 'Request Received' ? 'Quote Sent' : ord.status,
          };
        }
        return ord;
      })
    );

    // Customer Notification
    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: customer.id,
      title: 'Quotation Received',
      message: `${quoteData.serviceName}: Quotation #${quoteId} for ₹${newQuotation.totalAmount} has been sent.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'quote',
      orderId: quoteData.orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('success', 'Quotation Sent', `Quotation #${quoteId} for ₹${newQuotation.totalAmount} dispatched.`);
  };

  const respondToQuotation = (orderId: string, accept: boolean) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId && ord.quotation) {
          return {
            ...ord,
            quotation: {
              ...ord.quotation,
              status: accept ? 'Accepted' : 'Declined',
            },
            status: accept && ord.status === 'Quote Sent' ? 'Measurement Confirmed' : ord.status,
          };
        }
        return ord;
      })
    );

    addToast(
      accept ? 'success' : 'warning',
      accept ? 'Quote Accepted' : 'Quote Declined',
      accept
        ? 'You accepted the quote. Tailor has been notified to proceed with cutting.'
        : 'Quotation declined. Tailor can send a revised estimate.'
    );
  };

  const completePayment = (orderId: string, method: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            paymentStatus: 'Paid',
            paymentMethod: method,
          };
        }
        return ord;
      })
    );

    addToast('success', 'Payment Successful', `Payment of order #${orderId} completed via ${method}.`);
  };

  const bookAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: 'apt_' + Date.now(),
      status: 'Upcoming',
    };
    setAppointments((prev) => [newApt, ...prev]);

    const notif: AppNotification = {
      id: 'notif_' + Date.now(),
      userId: customer.id,
      title: 'Appointment Confirmed',
      message: `Your ${apt.type} appointment on ${apt.date} at ${apt.timeSlot} with ${apt.tailorShop} is scheduled.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'appointment',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('success', 'Appointment Booked', `Confirmed for ${apt.date} at ${apt.timeSlot}`);
  };

  const sendMessage = (text: string, orderId?: string, attachmentUrl?: string) => {
    const senderRole = role === 'tailor' ? 'tailor' : 'customer';
    const senderName = role === 'tailor' ? 'Lakshmi R. (Tailor)' : customer.name;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      orderId: orderId || selectedOrderId,
      senderId: role === 'tailor' ? 'tailor_01' : customer.id,
      senderRole,
      senderName,
      text,
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      attachmentUrl,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated instant reply if customer is messaging and tailor is offline
    if (role === 'customer') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: 'msg_reply_' + Date.now(),
          orderId: orderId || selectedOrderId,
          senderId: 'tailor_01',
          senderRole: 'tailor',
          senderName: 'Lakshmi R. (Tailor)',
          text: 'Got your message! I will make sure the changes are included during our evening stitching batch.',
          timestamp: 'Just now',
          isRead: false,
        };
        setMessages((prev) => [...prev, autoReply]);
        addToast('info', 'New Message', 'Lakshmi Stitching Studio replied to your message.');
      }, 1400);
    }
  };

  const submitReview = (
    tailorId: string,
    rating: number,
    comment: string,
    garmentType: string,
    breakdown: any
  ) => {
    const newRev = {
      id: 'rev_' + Date.now(),
      customerName: customer.name,
      rating,
      date: 'Today',
      comment,
      garmentType,
      breakdown,
    };

    setTailors((prev) =>
      prev.map((t) => {
        if (t.id === tailorId) {
          const newReviews = [newRev, ...t.reviews];
          const avgRating = (
            newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length
          ).toFixed(1);
          return {
            ...t,
            reviews: newReviews,
            rating: parseFloat(avgRating),
            reviewCount: t.reviewCount + 1,
          };
        }
        return t;
      })
    );

    addToast('success', 'Review Submitted', 'Thank you for rating and reviewing your tailor!');
  };

  const toggleSavedTailor = (tailorId: string) => {
    setCustomer((prev) => {
      const exists = prev.savedTailorIds.includes(tailorId);
      const updated = exists
        ? prev.savedTailorIds.filter((id) => id !== tailorId)
        : [...prev.savedTailorIds, tailorId];

      addToast(
        'info',
        exists ? 'Tailor Removed' : 'Tailor Saved',
        exists ? 'Removed from your favorites.' : 'Saved to your favorite tailors!'
      );
      return { ...prev, savedTailorIds: updated };
    });
  };

  const verifyTailor = (tailorId: string, isVerified: boolean) => {
    setTailors((prev) =>
      prev.map((t) => (t.id === tailorId ? { ...t, isVerified } : t))
    );
    addToast('info', 'Verification Updated', `Tailor verification status changed to: ${isVerified ? 'Verified' : 'Pending'}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const reorderPreviousOrder = (prevOrder: Order): string => {
    const newId = createOrderRequest({
      tailorId: prevOrder.tailorId,
      serviceType: prevOrder.serviceType,
      garmentType: prevOrder.garmentType,
      requirements: `[Reorder from #${prevOrder.id}] ` + prevOrder.requirements,
      referenceImages: prevOrder.referenceImages,
      measurementProfileName: prevOrder.measurementProfileName,
      measurements: prevOrder.measurements,
      deliveryOption: prevOrder.deliveryOption,
      totalAmount: prevOrder.totalAmount,
    });
    return newId;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentView,
        setCurrentView,
        customer,
        tailors,
        orders,
        measurementProfiles,
        appointments,
        messages,
        notifications,
        selectedTailorId,
        setSelectedTailorId,
        selectedOrderId,
        setSelectedOrderId,
        selectedCity,
        setSelectedCity,
        pincode,
        setPincode,
        toasts,
        addToast,
        removeToast,
        addMeasurementProfile,
        updateMeasurementProfile,
        deleteMeasurementProfile,
        createOrderRequest,
        updateOrderStatus,
        sendQuotation,
        respondToQuotation,
        completePayment,
        bookAppointment,
        sendMessage,
        submitReview,
        toggleSavedTailor,
        verifyTailor,
        markNotificationAsRead,
        reorderPreviousOrder,
        isCustomRequestOpen,
        setIsCustomRequestOpen,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        isQuotationModalOpen,
        setIsQuotationModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
