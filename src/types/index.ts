export type UserRole = 'customer' | 'technician' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  area?: string;
  bio?: string;
  createdAt?: string;
}

export type ServiceCategory =
  | 'Smartphone'
  | 'Laptop & PC'
  | 'AC'
  | 'Refrigerator'
  | 'TV'
  | 'Washing Machine'
  | 'Electrical';

export type ServiceMode = 'Home Visit' | 'Shop Drop-off';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Service {
  _id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  technician?: {
    name: string;
    email: string;
    image?: string;
    area?: string;
    bio?: string;
  };
}

export type BookingStatus =
  | 'requested'
  | 'accepted'
  | 'rejected'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid';

export interface StatusHistoryItem {
  status: BookingStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: ServiceCategory;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: PaymentStatus;
  statusHistory?: StatusHistoryItem[];
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: 'paid';
  paidAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
