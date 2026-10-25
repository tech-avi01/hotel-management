import { Room, User, Booking } from '../types/hotel';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    roomNumber: '101',
    type: 'Single',
    pricePerNight: 85,
    capacity: 1,
    floor: 1,
    sizeSqFt: 240,
    amenities: ['High-Speed Wi-Fi', 'AC & Heating', 'Smart TV', 'Work Desk', 'Ensuite Bath'],
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Cozy, modern single room designed for solo travelers and business professionals. Features high-speed fiber Wi-Fi and ergonomic workstation.'
  },
  {
    id: 'room-102',
    roomNumber: '102',
    type: 'Single',
    pricePerNight: 90,
    capacity: 1,
    floor: 1,
    sizeSqFt: 260,
    amenities: ['High-Speed Wi-Fi', 'AC & Heating', 'Smart TV', 'Balcony', 'Coffee Maker'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Bright garden-facing single room with a private balcony, queen-single hybrid mattress, and artisan coffee station.'
  },
  {
    id: 'room-201',
    roomNumber: '201',
    type: 'Double',
    pricePerNight: 135,
    capacity: 2,
    floor: 2,
    sizeSqFt: 380,
    amenities: ['King Size Bed', 'City View', 'High-Speed Wi-Fi', 'Mini Bar', 'Smart TV', 'Rain Shower'],
    imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Spacious double bed retreat with skyline panoramic views, plush premium linens, mini refrigerator, and rainfall shower.'
  },
  {
    id: 'room-202',
    roomNumber: '202',
    type: 'Double',
    pricePerNight: 140,
    capacity: 2,
    floor: 2,
    sizeSqFt: 400,
    amenities: ['Twin Queen Beds', 'High-Speed Wi-Fi', 'AC & Heating', 'Safe Locker', 'Tea/Coffee Bar'],
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Ideal double room accommodating colleagues or travel pairs, equipped with dual plush queen beds and soundproof windows.'
  },
  {
    id: 'room-301',
    roomNumber: '301',
    type: 'Deluxe',
    pricePerNight: 210,
    capacity: 3,
    floor: 3,
    sizeSqFt: 520,
    amenities: ['King Bed + Sofa', 'Private Jacuzzi', 'Ocean View', 'Complimentary Breakfast', 'Mini Bar', 'Espresso Machine'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Indulgent deluxe room featuring a deep soaking jacuzzi tub, scenic coastal sunsets, and complimentary chef-crafted gourmet breakfast.'
  },
  {
    id: 'room-302',
    roomNumber: '302',
    type: 'Deluxe',
    pricePerNight: 225,
    capacity: 3,
    floor: 3,
    sizeSqFt: 550,
    amenities: ['King Bed', 'Wrap-around Balcony', 'Harman Kardon Sound', 'Mini Bar', 'Bathtub', '24/7 Room Service'],
    imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Corner deluxe suite offering panoramic city and pool vistas, premium sound system, and dedicated butler service on demand.'
  },
  {
    id: 'room-401',
    roomNumber: '401',
    type: 'Suite',
    pricePerNight: 350,
    capacity: 4,
    floor: 4,
    sizeSqFt: 780,
    amenities: ['Master Bedroom', 'Living Room', 'Dining Area', 'Kitchenette', 'Dual Jacuzzi', 'Executive Lounge Access'],
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Prestigious executive suite featuring a separate living salon, dining table for 4, personal kitchenette, and VIP lounge privileges.'
  },
  {
    id: 'room-402',
    roomNumber: '402',
    type: 'Suite',
    pricePerNight: 480,
    capacity: 5,
    floor: 4,
    sizeSqFt: 950,
    amenities: ['Presidential Grand Salon', 'Private Terrace & Plunge Pool', 'Fireplace', 'Wine Cellar', 'Butler Service', 'VIP Airport Transfer'],
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'The Presidential Royal Suite. The pinnacle of opulence with private rooftop terrace plunge pool, curated wine selection, and airport limousine.'
  },
  {
    id: 'room-501',
    roomNumber: '501',
    type: 'Double',
    pricePerNight: 155,
    capacity: 2,
    floor: 5,
    sizeSqFt: 420,
    amenities: ['Penthouse Level', 'High-Speed Wi-Fi', 'Smart Lighting', 'Rain Shower', 'Espresso Machine'],
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    status: 'Maintenance',
    description: 'Penthouse-level double room currently undergoing seasonal interior refitting and tech system upgrades.'
  },
  {
    id: 'room-502',
    roomNumber: '502',
    type: 'Deluxe',
    pricePerNight: 240,
    capacity: 3,
    floor: 5,
    sizeSqFt: 580,
    amenities: ['Sky Garden View', 'King Bed', 'Soaking Tub', 'Pillow Menu', 'Cocktail Bar'],
    imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Skyline deluxe retreat with access to our 5th-floor zen rooftop garden and customizable therapeutic pillow menu.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    uid: 'admin-001',
    name: 'Admin Supervisor (Grand Stay)',
    email: 'admin@grandstay.com',
    phone: '+91 98765 43210',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    uid: 'user-001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 91234 56789',
    role: 'customer',
    createdAt: '2026-02-15T14:30:00Z'
  },
  {
    uid: 'user-002',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 99887 76655',
    role: 'customer',
    createdAt: '2026-03-01T09:15:00Z'
  }
];

// Helper to get formatted dates relative to today
const getRelativeDate = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    userId: 'user-001',
    roomId: 'room-201',
    guestName: 'Rahul Sharma',
    guestEmail: 'rahul.sharma@example.com',
    guestPhone: '+91 91234 56789',
    checkIn: getRelativeDate(-2),
    checkOut: getRelativeDate(2),
    nights: 4,
    guestsCount: 2,
    roomNumber: '201',
    roomType: 'Double',
    pricePerNight: 135,
    totalAmount: 540,
    taxAmount: 64.8,
    status: 'Checked-in',
    paymentStatus: 'Paid',
    specialRequests: 'High floor, late arrival anticipated',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'bk-1002',
    userId: 'user-002',
    roomId: 'room-301',
    guestName: 'Priya Verma',
    guestEmail: 'priya.verma@example.com',
    guestPhone: '+91 99887 76655',
    checkIn: getRelativeDate(3),
    checkOut: getRelativeDate(6),
    nights: 3,
    guestsCount: 2,
    roomNumber: '301',
    roomType: 'Deluxe',
    pricePerNight: 210,
    totalAmount: 630,
    taxAmount: 75.6,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    specialRequests: 'Anniversary celebration setup requested',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'bk-1003',
    userId: 'user-001',
    roomId: 'room-101',
    guestName: 'Rahul Sharma',
    guestEmail: 'rahul.sharma@example.com',
    guestPhone: '+91 91234 56789',
    checkIn: getRelativeDate(-10),
    checkOut: getRelativeDate(-7),
    nights: 3,
    guestsCount: 1,
    roomNumber: '101',
    roomType: 'Single',
    pricePerNight: 85,
    totalAmount: 255,
    taxAmount: 30.6,
    status: 'Checked-out',
    paymentStatus: 'Paid',
    specialRequests: 'Quiet room near elevator',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'bk-1004',
    userId: 'user-002',
    roomId: 'room-401',
    guestName: 'Priya Verma',
    guestEmail: 'priya.verma@example.com',
    guestPhone: '+91 99887 76655',
    checkIn: getRelativeDate(-15),
    checkOut: getRelativeDate(-12),
    nights: 3,
    guestsCount: 3,
    roomNumber: '401',
    roomType: 'Suite',
    pricePerNight: 350,
    totalAmount: 1050,
    taxAmount: 126.0,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    specialRequests: 'Cancelled due to travel rescheduling',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];
