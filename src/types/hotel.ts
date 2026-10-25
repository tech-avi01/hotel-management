export type UserRole = 'customer' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export type RoomType = 'Single' | 'Double' | 'Deluxe' | 'Suite';
export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
  status: RoomStatus;
  description: string;
  floor: number;
  sizeSqFt?: number;
}

export type BookingStatus = 'Confirmed' | 'Checked-in' | 'Checked-out' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  roomNumber: string;
  roomType: RoomType;
  pricePerNight: number;
  totalAmount: number;
  taxAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  todaysCheckIns: number;
  todaysCheckOuts: number;
  totalBookings: number;
  totalRevenue: number;
  occupancyRate: number;
}
