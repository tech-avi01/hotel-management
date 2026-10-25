import { Room, Booking, User, DashboardStats, BookingStatus, PaymentStatus } from '../types/hotel';
import { INITIAL_ROOMS, INITIAL_USERS, INITIAL_BOOKINGS } from '../data/seedData';

const STORAGE_KEYS = {
  ROOMS: 'hotel_hms_rooms_v1',
  USERS: 'hotel_hms_users_v1',
  BOOKINGS: 'hotel_hms_bookings_v1',
  CURRENT_USER: 'hotel_hms_curr_user_v1',
};

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Local persistence write error:', e);
    }
  }

  constructor() {
    this.initializeIfEmpty();
  }

  public initializeIfEmpty(): void {
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
      this.set(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.set(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    }
  }

  public resetToDefaults(): void {
    this.set(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.set(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  // --- ROOMS MANAGEMENT (Firestore `rooms` collection) ---
  public getRooms(): Room[] {
    this.initializeIfEmpty();
    return this.get<Room[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  }

  public getRoomById(id: string): Room | undefined {
    return this.getRooms().find((r) => r.id === id);
  }

  public addRoom(roomData: Omit<Room, 'id'>): Room {
    const rooms = this.getRooms();
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    rooms.unshift(newRoom);
    this.set(STORAGE_KEYS.ROOMS, rooms);
    return newRoom;
  }

  public updateRoom(id: string, updates: Partial<Room>): Room {
    const rooms = this.getRooms();
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Room not found');
    const updated = { ...rooms[index], ...updates };
    rooms[index] = updated;
    this.set(STORAGE_KEYS.ROOMS, rooms);
    return updated;
  }

  public deleteRoom(id: string): void {
    // Check if room has active bookings
    const activeBookings = this.getAllBookings().filter(
      (b) => b.roomId === id && (b.status === 'Confirmed' || b.status === 'Checked-in')
    );
    if (activeBookings.length > 0) {
      throw new Error(`Cannot delete room #${id}: It has ${activeBookings.length} active or confirmed booking(s).`);
    }
    const rooms = this.getRooms().filter((r) => r.id !== id);
    this.set(STORAGE_KEYS.ROOMS, rooms);
  }

  /**
   * CRITICAL OVERLAPPING DATE CHECK LOGIC (Asked in college project & viva):
   * Two date ranges [A_start, A_end] and [B_start, B_end] overlap IF AND ONLY IF:
   * (A_start < B_end) AND (A_end > B_start)
   * 
   * A room is unavailable if:
   * 1. Room is marked as 'Maintenance'
   * 2. Any active booking (Confirmed or Checked-in) overlaps with requested [checkIn, checkOut]
   */
  public isRoomAvailable(roomId: string, checkIn: string, checkOut: string, excludeBookingId?: string): boolean {
    const room = this.getRoomById(roomId);
    if (!room || room.status === 'Maintenance') {
      return false;
    }

    const requestedIn = new Date(checkIn).getTime();
    const requestedOut = new Date(checkOut).getTime();

    if (isNaN(requestedIn) || isNaN(requestedOut) || requestedIn >= requestedOut) {
      return false;
    }

    const bookings = this.getAllBookings();
    const overlapping = bookings.some((b) => {
      if (b.roomId !== roomId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      // Only active bookings block availability
      if (b.status !== 'Confirmed' && b.status !== 'Checked-in') return false;

      const bookedIn = new Date(b.checkIn).getTime();
      const bookedOut = new Date(b.checkOut).getTime();

      // Standard interval overlap condition
      return requestedIn < bookedOut && requestedOut > bookedIn;
    });

    return !overlapping;
  }

  public getAvailableRooms(checkIn?: string, checkOut?: string): Room[] {
    const allRooms = this.getRooms();
    if (!checkIn || !checkOut) {
      return allRooms.filter((r) => r.status !== 'Maintenance');
    }
    return allRooms.filter((r) => this.isRoomAvailable(r.id, checkIn, checkOut));
  }

  // --- BOOKINGS MANAGEMENT (Firestore `bookings` collection) ---
  public getAllBookings(): Booking[] {
    this.initializeIfEmpty();
    return this.get<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  public getUserBookings(userId: string): Booking[] {
    return this.getAllBookings()
      .filter((b) => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getAllBookings().find((b) => b.id === id);
  }

  public createBooking(data: {
    userId: string;
    roomId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    checkIn: string;
    checkOut: string;
    guestsCount: number;
    specialRequests?: string;
  }): Booking {
    const room = this.getRoomById(data.roomId);
    if (!room) throw new Error('Selected room does not exist.');
    if (room.status === 'Maintenance') throw new Error('This room is currently under maintenance.');

    // Prevent Double-Booking: Verify availability
    const available = this.isRoomAvailable(data.roomId, data.checkIn, data.checkOut);
    if (!available) {
      throw new Error(`Room #${room.roomNumber} is already booked or unavailable for selected dates.`);
    }

    // Calculate nights
    const start = new Date(data.checkIn);
    const end = new Date(data.checkOut);
    const diffTime = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const baseAmount = nights * room.pricePerNight;
    const taxAmount = Number((baseAmount * 0.12).toFixed(2)); // 12% Hotel GST/Tax
    const totalAmount = Number((baseAmount + taxAmount).toFixed(2));

    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      userId: data.userId,
      roomId: data.roomId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      guestsCount: data.guestsCount,
      roomNumber: room.roomNumber,
      roomType: room.type,
      pricePerNight: room.pricePerNight,
      totalAmount,
      taxAmount,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      specialRequests: data.specialRequests || '',
      createdAt: new Date().toISOString()
    };

    const bookings = this.getAllBookings();
    bookings.unshift(newBooking);
    this.set(STORAGE_KEYS.BOOKINGS, bookings);

    return newBooking;
  }

  public cancelBooking(bookingId: string, currentUserId: string, isAdmin = false): Booking {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = bookings[index];
    if (!isAdmin && booking.userId !== currentUserId) {
      throw new Error('Access denied: You can only cancel your own bookings.');
    }

    if (booking.status === 'Cancelled') {
      throw new Error('Booking is already cancelled.');
    }

    if (booking.status === 'Checked-out') {
      throw new Error('Completed bookings cannot be cancelled.');
    }

    const updated: Booking = {
      ...booking,
      status: 'Cancelled',
      paymentStatus: 'Refunded'
    };
    bookings[index] = updated;
    this.set(STORAGE_KEYS.BOOKINGS, bookings);
    return updated;
  }

  public updateBookingStatus(bookingId: string, status: BookingStatus, paymentStatus?: PaymentStatus): Booking {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const updated: Booking = {
      ...bookings[index],
      status,
      ...(paymentStatus ? { paymentStatus } : {})
    };
    bookings[index] = updated;
    this.set(STORAGE_KEYS.BOOKINGS, bookings);
    return updated;
  }

  // --- USERS MANAGEMENT (Firestore `users` collection) ---
  public getUsers(): User[] {
    this.initializeIfEmpty();
    return this.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  public getUserById(uid: string): User | undefined {
    return this.getUsers().find((u) => u.uid === uid);
  }

  public addUser(user: User): void {
    const users = this.getUsers();
    if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      users.push(user);
      this.set(STORAGE_KEYS.USERS, users);
    }
  }

  // --- ADMIN DASHBOARD STATS ---
  public getDashboardStats(): DashboardStats {
    const rooms = this.getRooms();
    const bookings = this.getAllBookings();

    const todayStr = new Date().toISOString().split('T')[0];

    const totalRooms = rooms.length;
    const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;

    // Check which rooms are currently occupied today
    const currentlyOccupiedRoomIds = new Set(
      bookings
        .filter((b) => {
          if (b.status !== 'Checked-in' && b.status !== 'Confirmed') return false;
          return b.checkIn <= todayStr && b.checkOut > todayStr;
        })
        .map((b) => b.roomId)
    );

    const occupiedRooms = currentlyOccupiedRoomIds.size;
    const availableRooms = Math.max(0, totalRooms - occupiedRooms - maintenanceRooms);

    const todaysCheckIns = bookings.filter(
      (b) => b.checkIn === todayStr && (b.status === 'Confirmed' || b.status === 'Checked-in')
    ).length;

    const todaysCheckOuts = bookings.filter(
      (b) => b.checkOut === todayStr && (b.status === 'Checked-in' || b.status === 'Checked-out')
    ).length;

    const activeOrCompletedBookings = bookings.filter((b) => b.status !== 'Cancelled');
    const totalRevenue = activeOrCompletedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      todaysCheckIns,
      todaysCheckOuts,
      totalBookings: bookings.length,
      totalRevenue: Math.round(totalRevenue),
      occupancyRate
    };
  }
}

export const storage = new StorageService();
