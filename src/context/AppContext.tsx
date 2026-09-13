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
  AuthUser,
} from '../types';
import { api, jsonBody } from '../lib/api';
import { authClient } from '../lib/auth-client';

export type AppView =
  | 'home'
  | 'find-tailors'
  | 'tailor-profile'
  | 'smart-match'
  | 'customer-dashboard'
  | 'tailor-dashboard'
  | 'admin-dashboard'
  | 'profile-settings'
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
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  registeredUsers: AuthUser[];
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  registerUser: (userData: {
    role: 'customer' | 'tailor';
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    shopName?: string;
  }) => Promise<{ success: boolean; role: UserRole; message?: string }>;
  updateProfile: (details: {
    name: string;
    phone: string;
    city: string;
    shopName?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  navigateToDashboard: () => void;
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

  // Active tailor context
  tailorProfile: Tailor;
  setTailorProfile: (tailor: Tailor) => void;

  // Actions
  addMeasurementProfile: (profile: Omit<MeasurementProfile, 'id' | 'customerId' | 'updatedAt'>) => void;
  updateMeasurementProfile: (id: string, updates: Partial<MeasurementProfile>) => void;
  deleteMeasurementProfile: (id: string) => void;
  createOrderRequest: (orderData: Partial<Order>) => Promise<string>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  sendQuotation: (quotationOrOrderId: any, possibleQuoteData?: any) => void;
  respondToQuotation: (orderId: string, accept: boolean) => void;
  completePayment: (orderId: string, method: string) => void;
  markOrderAsPaid: (orderId: string) => void;
  bookAppointment: (apt: any) => void;
  sendMessage: (
    textOrPayload: string | { text: string; orderId?: string; senderId?: string; senderName?: string; senderRole?: 'customer' | 'tailor'; recipientId?: string; attachmentUrl?: string },
    orderId?: string,
    attachmentUrl?: string
  ) => void;
  submitReview: (tailorId: string, rating: number, comment: string, garmentType: string, breakdown: any) => void;
  addReview: (
    tailorId: string,
    reviewData: {
      customerName?: string;
      rating: number;
      comment: string;
      garmentType?: string;
      date?: string;
      breakdown?: any;
    }
  ) => void;
  toggleSavedTailor: (tailorId: string) => void;
  verifyTailor: (tailorId: string, isVerified: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  reorderPreviousOrder: (prevOrder: Order) => Promise<string>;

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

const EMPTY_CUSTOMER: CustomerUser = {
  id: '',
  name: '',
  email: '',
  phone: '',
  city: '',
  avatar: '',
  savedTailorIds: [],
};

const EMPTY_TAILOR: Tailor = {
  id: '',
  name: '',
  shopName: 'Your workshop',
  tagline: '',
  avatar: '',
  coverImage: '',
  rating: 0,
  reviewCount: 0,
  distanceKm: 0,
  experienceYears: 0,
  address: '',
  city: '',
  pincode: '',
  startingPrice: 0,
  availableToday: false,
  homePickup: false,
  deliveryAvailable: false,
  phone: '',
  email: '',
  workingHours: '',
  isVerified: false,
  specializations: [],
  services: [],
  about: '',
  portfolio: [],
  reviews: [],
  coordinates: { lat: 0, lng: 0 },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const registeredUsers: AuthUser[] = [];
  const [role, setRoleState] = useState<UserRole>('guest');

  const isAuthenticated = currentUser !== null && currentUser.role !== 'guest';

  const [currentView, setCurrentViewState] = useState<AppView>('home');
  const [customer, setCustomer] = useState<CustomerUser>(EMPTY_CUSTOMER);
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedTailorId, setSelectedTailorId] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [ownTailorId, setOwnTailorId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Pudukkottai');
  const [pincode, setPincode] = useState<string>('622001');

  const tailorProfile =
    tailors.find((t) => t.id === (role === 'tailor' ? ownTailorId : selectedTailorId)) ||
    EMPTY_TAILOR;
  const setTailorProfile = (t: Tailor) => {
    setSelectedTailorId(t.id);
  };

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

  const loadPublicTailors = async () => {
    const data = await api<{ tailors: Tailor[] }>('/tailors');
    setTailors(data.tailors);
    if (!selectedTailorId && data.tailors[0]) setSelectedTailorId(data.tailors[0].id);
  };

  const loadBootstrap = async () => {
    const data = await api<any>('/bootstrap');
    setCurrentUser(data.currentUser);
    setRoleState(data.currentUser.role);
    if (data.currentUser.city) setSelectedCity(data.currentUser.city);
    if (data.customer) setCustomer(data.customer);
    setTailors(data.tailors);
    setOrders(data.orders);
    setMeasurementProfiles(data.measurementProfiles);
    setAppointments(data.appointments);
    setMessages(data.messages);
    setNotifications(data.notifications);
    if (data.tailorProfile) setOwnTailorId(data.tailorProfile.id);
    if (!selectedTailorId && data.tailors[0]) setSelectedTailorId(data.tailors[0].id);
    return data.currentUser as AuthUser;
  };

  useEffect(() => {
    authClient.getSession({ query: {} }).then(({ data }) => {
      if (data?.user) loadBootstrap().catch(() => logout(false));
      else loadPublicTailors().catch(console.error);
    });
    // Legacy browser data is untrusted and must not survive the secure migration.
    Object.keys(localStorage).filter((key) => key.startsWith('ltc_')).forEach((key) => localStorage.removeItem(key));
  }, []);

  const loginWithCredentials = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email: email.trim().toLowerCase(), password });
    if (result.error) return { success: false, message: result.error.message || 'Unable to sign in.' };
    try {
      const user = await loadBootstrap();
      setCurrentViewState(user.role === 'tailor' ? 'tailor-dashboard' : user.role === 'admin' ? 'admin-dashboard' : 'customer-dashboard');
      addToast('success', 'Welcome Back!', `Signed in as ${user.name}`);
      return { success: true, role: user.role };
    } catch {
      await authClient.signOut({});
      return { success: false, message: 'Account profile is not provisioned.' };
    }
  };

  const registerUser = async (userData: {
    role: 'customer' | 'tailor';
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    shopName?: string;
  }) => {
    const result = await authClient.signUp.email({
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      accountType: userData.role,
      phone: userData.phone.trim(),
      city: userData.city.trim(),
      shopName: userData.role === 'tailor' ? userData.shopName?.trim() : undefined,
    } as any);
    if (result.error) {
      return { success: false, role: userData.role, message: result.error.message || 'Unable to create account.' };
    }
    const user = await loadBootstrap();
    setCurrentViewState(user.role === 'tailor' ? 'tailor-dashboard' : 'customer-dashboard');
    addToast('success', 'Account Created!', `Welcome, ${userData.shopName || userData.name}!`);
    return { success: true, role: userData.role };
  };

  const logout = async (showToast = true) => {
    await authClient.signOut({}).catch(() => undefined);
    setCurrentUser(null);
    setRoleState('guest');
    setOrders([]);
    setMeasurementProfiles([]);
    setAppointments([]);
    setMessages([]);
    setNotifications([]);
    setOwnTailorId('');
    setCurrentViewState('home');
    await loadPublicTailors().catch(console.error);
    if (showToast) addToast('info', 'Signed Out', 'You have been safely signed out.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = async (details: {
    name: string;
    phone: string;
    city: string;
    shopName?: string;
  }) => {
    try {
      await api('/profile', { method: 'PATCH', body: jsonBody(details) });
      await loadBootstrap();
      addToast('success', 'Profile Updated', 'Your account details were saved.');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update profile.';
      addToast('warning', 'Update Failed', message);
      return { success: false, message };
    }
  };

  const setRole = (newRole: UserRole) => {
    if (newRole === 'guest') {
      void logout();
    } else if (currentUser?.role === newRole) {
      navigateToDashboard();
    } else {
      setCurrentViewState(newRole === 'tailor' ? 'tailor-login' : 'customer-login');
    }
  };

  const navigateToDashboard = () => {
    if (!currentUser || currentUser.role === 'guest') {
      setCurrentViewState('customer-login');
      addToast('info', 'Sign In Required', 'Please sign in to access your dashboard.');
    } else if (currentUser.role === 'customer') {
      setCurrentViewState('customer-dashboard');
    } else if (currentUser.role === 'tailor') {
      setCurrentViewState('tailor-dashboard');
    } else if (currentUser.role === 'admin') {
      setCurrentViewState('admin-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setCurrentView = (view: AppView) => {
    const customerDiscoveryViews: AppView[] = ['find-tailors', 'smart-match', 'tailor-profile'];
    if (
      currentUser &&
      currentUser.role !== 'customer' &&
      customerDiscoveryViews.includes(view)
    ) {
      addToast('info', 'Customer Feature', 'Tailor discovery is available from customer accounts.');
      navigateToDashboard();
      return;
    }
    setCurrentViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Measurement Profile Actions
  const addMeasurementProfile = (profile: Omit<MeasurementProfile, 'id' | 'customerId' | 'updatedAt'>) => {
    void api('/measurements', { method: 'POST', body: jsonBody(profile) })
      .then(loadBootstrap)
      .then(() => addToast('success', 'Profile Created', `"${profile.profileName}" saved to your measurements.`))
      .catch((error) => addToast('warning', 'Unable to save', error.message));
  };

  const updateMeasurementProfile = (id: string, updates: Partial<MeasurementProfile>) => {
    void api(`/measurements/${id}`, { method: 'PATCH', body: jsonBody(updates) })
      .then(loadBootstrap)
      .then(() => addToast('success', 'Measurements Updated', 'Your digital measurements were successfully updated.'))
      .catch((error) => addToast('warning', 'Unable to update', error.message));
  };

  const deleteMeasurementProfile = (id: string) => {
    void api(`/measurements/${id}`, { method: 'DELETE' })
      .then(loadBootstrap)
      .then(() => addToast('info', 'Profile Deleted', 'The measurement profile was removed.'))
      .catch((error) => addToast('warning', 'Unable to delete', error.message));
  };

  // Order Actions
  const createOrderRequest = async (orderData: Partial<Order>): Promise<string> => {
    const targetTailor = tailors.find((t) => t.id === orderData.tailorId);
    if (!targetTailor) throw new Error('Please select a valid tailor');
    const result = await api<{ order: Order }>('/orders', {
      method: 'POST',
      body: jsonBody({
        tailorId: targetTailor.id,
        serviceType: orderData.serviceType || 'New Clothing',
        garmentType: orderData.garmentType || 'Custom garment',
        requirements: orderData.requirements || '',
        referenceImages: orderData.referenceImages || [],
        measurementProfileName: orderData.measurementProfileName || '',
        measurements: orderData.measurements || {},
        deliveryOption: orderData.deliveryOption || 'Customer pickup',
        deliveryAddress: orderData.deliveryAddress,
        estimatedCompletion: orderData.estimatedCompletion || '',
      }),
    });
    await loadBootstrap();
    addToast('success', 'Request Submitted', `Your request was sent to ${targetTailor.shopName}.`);
    return result.order.id;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    void api(`/orders/${orderId}/status`, { method: 'PATCH', body: jsonBody({ status: newStatus, note }) })
      .then(loadBootstrap)
      .then(() => addToast('info', 'Status Updated', `Order marked as ${newStatus}`))
      .catch((error) => addToast('warning', 'Unable to update', error.message));
  };

  const sendQuotation = (quotationOrOrderId: any, possibleQuoteData?: any) => {
    const orderId = typeof quotationOrOrderId === 'string' ? quotationOrOrderId : quotationOrOrderId.orderId;
    const quote = possibleQuoteData || quotationOrOrderId;
    const items = (quote.items || []).map((item: any) => ({
      title: item.title || item.description || 'Tailoring service',
      amount: item.amount ?? item.price ?? 0,
    }));
    void api(`/orders/${orderId}/quotation`, {
      method: 'POST',
      body: jsonBody({ serviceName: quote.serviceName || 'Custom tailoring', notes: quote.notes || quote.validUntil, items }),
    }).then(loadBootstrap)
      .then(() => addToast('success', 'Quotation Sent', 'The customer can now review your quotation.'))
      .catch((error) => addToast('warning', 'Unable to send quotation', error.message));
  };

  const respondToQuotation = (orderId: string, accept: boolean) => {
    void api(`/orders/${orderId}/quotation`, { method: 'PATCH', body: jsonBody({ accept }) })
      .then(loadBootstrap)
      .then(() => addToast(accept ? 'success' : 'warning', accept ? 'Quote Accepted' : 'Quote Declined', 'Your response was saved.'))
      .catch((error) => addToast('warning', 'Unable to respond', error.message));
  };

  const completePayment = (orderId: string, method: string) => {
    addToast('warning', 'Payment unavailable', `No payment provider is configured; order ${orderId} was not marked paid via ${method}.`);
  };

  const markOrderAsPaid = (orderId: string) => {
    completePayment(orderId, 'Online Escrow (UPI / NetBanking)');
  };

  const bookAppointment = (apt: any) => {
    const targetTailor = tailors.find((t) => t.id === apt.tailorId);
    if (!targetTailor) {
      addToast('warning', 'Unable to book', 'Please select a valid tailor.');
      return;
    }
    void api('/appointments', {
      method: 'POST',
      body: jsonBody({
        tailorId: targetTailor.id,
        orderId: apt.orderId,
        type: apt.type || apt.appointmentType || 'Consultation',
        date: apt.date,
        timeSlot: apt.timeSlot,
        address: apt.address || targetTailor.address,
        notes: apt.notes,
      }),
    }).then(loadBootstrap)
      .then(() => addToast('success', 'Appointment Booked', `Confirmed for ${apt.date} at ${apt.timeSlot}`))
      .catch((error) => addToast('warning', 'Unable to book', error.message));
  };

  const sendMessage = (
    textOrPayload: string | { text: string; orderId?: string; senderId?: string; senderName?: string; senderRole?: 'customer' | 'tailor'; recipientId?: string; attachmentUrl?: string },
    orderId?: string,
    attachmentUrl?: string
  ) => {
    const payload = typeof textOrPayload === 'string'
      ? { text: textOrPayload, orderId, attachmentUrl }
      : textOrPayload;
    const targetOrderId = payload.orderId || selectedOrderId;
    if (!targetOrderId) {
      addToast('warning', 'Select an order', 'Messages must belong to an order.');
      return;
    }
    void api(`/orders/${targetOrderId}/messages`, {
      method: 'POST',
      body: jsonBody({ text: payload.text, attachmentUrl: payload.attachmentUrl }),
    }).then(loadBootstrap)
      .catch((error) => addToast('warning', 'Unable to send message', error.message));
  };

  const submitReview = (
    tailorId: string,
    rating: number,
    comment: string,
    garmentType: string,
    breakdown: any
  ) => {
    void api('/reviews', {
      method: 'POST',
      body: jsonBody({ tailorId, rating, comment, garmentType, breakdown }),
    }).then(loadBootstrap)
      .then(() => addToast('success', 'Review Submitted', 'Thank you for reviewing your tailor!'))
      .catch((error) => addToast('warning', 'Unable to submit review', error.message));
  };

  const addReview = (
    tailorId: string,
    reviewData: {
      customerName?: string;
      rating: number;
      comment: string;
      garmentType?: string;
      date?: string;
      breakdown?: any;
    }
  ) => {
    submitReview(
      tailorId,
      reviewData.rating,
      reviewData.comment,
      reviewData.garmentType || 'Custom Garment',
      reviewData.breakdown || {
        stitchingQuality: 5,
        fitting: 5,
        deliveryTime: 5,
        communication: 5,
        valueForMoney: 5,
      }
    );
  };

  const toggleSavedTailor = (tailorId: string) => {
    void api(`/favorites/${tailorId}`, { method: 'POST' })
      .then(loadBootstrap)
      .then(() => addToast('info', 'Favorites Updated', 'Your favorites were saved.'))
      .catch((error) => addToast('warning', 'Unable to update favorites', error.message));
  };

  const verifyTailor = (tailorId: string, isVerified: boolean) => {
    void api(`/admin/tailors/${tailorId}`, {
      method: 'PATCH',
      body: jsonBody({ status: isVerified ? 'verified' : 'rejected' }),
    }).then(loadBootstrap)
      .then(() => addToast('info', 'Verification Updated', `Tailor is now ${isVerified ? 'verified' : 'rejected'}.`))
      .catch((error) => addToast('warning', 'Unable to verify tailor', error.message));
  };

  const markNotificationAsRead = (id: string) => {
    void api(`/notifications/${id}`, { method: 'PATCH' })
      .then(loadBootstrap)
      .catch((error) => addToast('warning', 'Unable to update notification', error.message));
  };

  const reorderPreviousOrder = async (prevOrder: Order): Promise<string> => {
    return createOrderRequest({
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
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isAuthenticated,
        registeredUsers,
        loginWithCredentials,
        registerUser,
        updateProfile,
        logout,
        navigateToDashboard,
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
        markOrderAsPaid,
        bookAppointment,
        sendMessage,
        submitReview,
        addReview,
        toggleSavedTailor,
        verifyTailor,
        tailorProfile,
        setTailorProfile,
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
