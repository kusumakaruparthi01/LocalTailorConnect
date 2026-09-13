export type UserRole = 'customer' | 'tailor' | 'admin' | 'guest';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Women' | 'Men' | 'Kids' | 'Alteration' | 'Bridal' | 'Custom';
  startingPrice: number;
  estimatedTime: string; // e.g. "3–4 days"
  description?: string;
}

export interface TailorReview {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  garmentType: string;
  breakdown: {
    stitchingQuality: number;
    fitting: number;
    deliveryTime: number;
    communication: number;
    valueForMoney: number;
  };
}

export interface Tailor {
  id: string;
  name: string;
  shopName: string;
  tagline: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  experienceYears: number;
  address: string;
  city: string;
  pincode: string;
  startingPrice: number;
  availableToday: boolean;
  homePickup: boolean;
  deliveryAvailable: boolean;
  phone: string;
  email: string;
  workingHours: string;
  isVerified: boolean;
  specializations: string[];
  services: ServiceItem[];
  about: string;
  portfolio: {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
  }[];
  reviews: TailorReview[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MeasurementValues {
  bust?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  sleeveLength?: number;
  blouseLength?: number;
  armHole?: number;
  frontNeckDepth?: number;
  backNeckDepth?: number;
  chest?: number;
  collar?: number;
  shirtLength?: number;
  pantLength?: number;
  inseam?: number;
  thigh?: number;
  bottomOpening?: number;
  notes?: string;
}

export interface MeasurementProfile {
  id: string;
  customerId: string;
  profileName: string; // e.g. "My Standard Measurements", "Office Wear", "Traditional Wear"
  garmentCategory: 'Women' | 'Men' | 'General';
  isDefault?: boolean;
  updatedAt: string;
  measurements: MeasurementValues;
}

export type OrderStatus =
  | 'Request Received'
  | 'Measurement Confirmed'
  | 'Quote Sent'
  | 'Cutting'
  | 'Stitching'
  | 'Alteration'
  | 'Ready'
  | 'Completed'
  | 'Cancelled';

export interface TimelineEvent {
  status: OrderStatus;
  timestamp: string;
  completed: boolean;
  note?: string;
}

export interface QuotationItem {
  id: string;
  title: string;
  description?: string;
  amount: number;
  price?: number;
}

export interface Quotation {
  id: string; // e.g. "QT-2045"
  orderId: string;
  customerName: string;
  serviceName: string;
  items: QuotationItem[];
  totalAmount: number;
  status: 'Pending' | 'Accepted' | 'Declined';
  sentDate: string;
  validUntil?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  tailorId: string;
  tailorName: string;
  tailorShop: string;
  tailorPhone: string;
  serviceType: 'New Clothing' | 'Alteration' | 'Repair' | 'Custom Design';
  garmentType: string; // e.g. "Blouse", "Saree", "Shirt"
  requirements: string;
  referenceImages: string[];
  measurementProfileName: string;
  measurements: MeasurementValues;
  deliveryOption: 'Pickup from tailor' | 'Home delivery' | 'Customer pickup';
  deliveryAddress?: string;
  status: OrderStatus;
  estimatedCompletion: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Cash on Delivery';
  paymentMethod?: string;
  quotation?: Quotation;
  timeline: TimelineEvent[];
  customerRating?: {
    rating: number;
    review: string;
    createdAt: string;
  };
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  tailorId: string;
  tailorShop: string;
  type: 'Measurement' | 'Consultation' | 'Fitting' | 'Pickup' | string;
  appointmentType?: string;
  date: string;
  timeSlot: string;
  address: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  senderId: string;
  senderRole: 'customer' | 'tailor';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentUrl?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'quote' | 'appointment' | 'system' | 'message';
  orderId?: string;
  actionRoute?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  savedTailorIds: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  city?: string;
  shopName?: string;
  password?: string;
}

