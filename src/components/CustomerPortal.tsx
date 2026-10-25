import React, { useState, useMemo } from 'react';
import { Room, Booking, RoomType } from '../types/hotel';
import { storage } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { BookingModal } from './BookingModal';
import { InvoiceModal } from './InvoiceModal';
import {
  Search,
  Calendar,
  Users,
  DollarSign,
  Filter,
  CheckCircle2,
  XCircle,
  Wifi,
  Sparkles,
  BedDouble,
  Coffee,
  Waves,
  ShieldCheck,
  Printer,
  ChevronRight,
  Info,
  Clock,
  UserCheck
} from 'lucide-react';

interface CustomerPortalProps {
  currentTab: 'rooms' | 'my-bookings' | 'profile';
  setCurrentTab: (tab: 'rooms' | 'my-bookings' | 'admin' | 'profile') => void;
  openAuthModal: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal
}) => {
  const { currentUser, updateProfile } = useAuth();

  // Search & Filter state
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 2);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [searchCheckIn, setSearchCheckIn] = useState<string>(todayStr);
  const [searchCheckOut, setSearchCheckOut] = useState<string>(tomorrowStr);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [minCapacity, setMinCapacity] = useState<number>(1);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');

  // Modal states
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [previewRoom, setPreviewRoom] = useState<Room | null>(null);

  // Success toast state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Profile edit states
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileMessage, setProfileMessage] = useState('');

  // Fetch rooms & bookings reactively
  const allRooms = storage.getRooms();
  const userBookings = currentUser ? storage.getUserBookings(currentUser.uid) : [];

  // Filtered rooms logic
  const filteredRooms = useMemo(() => {
    return allRooms.filter((room) => {
      // Don't show under maintenance
      if (room.status === 'Maintenance') return false;

      // Type filter
      if (selectedType !== 'All' && room.type !== selectedType) return false;

      // Price filter
      if (room.pricePerNight > maxPrice) return false;

      // Capacity filter
      if (room.capacity < minCapacity) return false;

      // Amenity filter
      if (selectedAmenity !== 'All') {
        const hasAmenity = room.amenities.some((a) =>
          a.toLowerCase().includes(selectedAmenity.toLowerCase())
        );
        if (!hasAmenity) return false;
      }

      return true;
    });
  }, [allRooms, selectedType, maxPrice, minCapacity, selectedAmenity]);

  const handleBookingSuccess = (newBooking: Booking) => {
    setSelectedRoomForBooking(null);
    setSuccessToast(`Reservation confirmed for Room #${newBooking.roomNumber}! Check "My Bookings" to view.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!currentUser) return;
    if (window.confirm('Are you sure you want to cancel this booking? Refund will be processed.')) {
      try {
        storage.cancelBooking(bookingId, currentUser.uid, false);
        setSuccessToast('Booking cancelled successfully.');
        setTimeout(() => setSuccessToast(null), 4000);
      } catch (err: any) {
        alert(err.message || 'Error cancelling booking');
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile(profileName, profilePhone);
    if (ok) {
      setProfileMessage('Profile updated successfully!');
      setTimeout(() => setProfileMessage(''), 3000);
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'Checked-in':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Checked-in
          </span>
        );
      case 'Checked-out':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-600 flex items-center gap-1">
            Checked-out
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-sm font-medium">{successToast}</p>
        </div>
      )}

      {/* --- TAB 1: ROOMS & SUITES BROWSER --- */}
      {currentTab === 'rooms' && (
        <div>
          {/* Hero Header */}
          <section className="relative py-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800">
            <div className="max-w-7xl mx-auto relative z-10 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Luxury Coastal Escape & Hospitality
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
                Sanctuary of Comfort, Elegance & Modern Luxury
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Explore handpicked boutique rooms and suites with panoramic vistas, 24/7 personalized service, and transparent instant booking.
              </p>

              {/* Quick Search & Availability Filter Card */}
              <div className="mt-8 max-w-5xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Check-In */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-in Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={searchCheckIn}
                      onChange={(e) => setSearchCheckIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Check-Out */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-out Date
                    </label>
                    <input
                      type="date"
                      min={searchCheckIn || todayStr}
                      value={searchCheckOut}
                      onChange={(e) => setSearchCheckOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Room Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-amber-400" /> Room Class
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Categories ({allRooms.length})</option>
                      <option value="Single">Single Room</option>
                      <option value="Double">Double Room</option>
                      <option value="Deluxe">Deluxe Room</option>
                      <option value="Suite">Executive Suite</option>
                    </select>
                  </div>

                  {/* Min Guests */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Guests
                    </label>
                    <select
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value={1}>1+ Guest</option>
                      <option value={2}>2+ Guests</option>
                      <option value={3}>3+ Guests</option>
                      <option value={4}>4+ Guests</option>
                    </select>
                  </div>

                </div>

                {/* Sub-filters: Price Range & Amenities */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  
                  {/* Price Slider */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-slate-400 whitespace-nowrap">
                      Max Price: <strong className="text-amber-400 font-bold">${maxPrice}</strong>/night
                    </span>
                    <input
                      type="range"
                      min={80}
                      max={500}
                      step={10}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-36 accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Amenity Filter pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500 mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Amenity:
                    </span>
                    {['All', 'Wi-Fi', 'Jacuzzi', 'Balcony', 'Breakfast', 'View'].map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() => setSelectedAmenity(amenity)}
                        className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                          selectedAmenity === amenity
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>

                  <div className="text-slate-400 text-xs">
                    Showing <strong className="text-white">{filteredRooms.length}</strong> room(s)
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* Room Grid */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <BedDouble className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">No rooms match your filter criteria</h3>
                <p className="text-sm text-slate-400 mt-1">Try adjusting the price slider, room type, or dates.</p>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setMaxPrice(500);
                    setMinCapacity(1);
                    setSelectedAmenity('All');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => {
                  // Check availability specifically for the chosen search dates
                  const isAvailableForSelectedDates = storage.isRoomAvailable(
                    room.id,
                    searchCheckIn,
                    searchCheckOut
                  );

                  return (
                    <div
                      key={room.id}
                      className="group bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-xl flex flex-col"
                    >
                      {/* Image Thumbnail with Badges */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={room.imageUrl}
                          alt={room.type}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                            Room #{room.roomNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900/80 backdrop-blur-md text-slate-300">
                            Floor {room.floor}
                          </span>
                        </div>

                        {/* Date Availability Indicator */}
                        <div className="absolute bottom-3 left-3">
                          {isAvailableForSelectedDates ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Available for Selected Dates
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-950/80 border border-red-500/40 text-red-300 backdrop-blur-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                              Booked on These Dates
                            </span>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-sm shadow-lg">
                          ${room.pricePerNight}
                          <span className="text-[10px] font-normal"> / night</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                              {room.type} Suite
                            </h3>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-amber-400" /> Max {room.capacity}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                            {room.description}
                          </p>

                          {/* Amenities list */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50"
                              >
                                {amenity}
                              </span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                +{room.amenities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                          <button
                            onClick={() => setPreviewRoom(room)}
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              if (!currentUser) {
                                openAuthModal();
                                return;
                              }
                              setSelectedRoomForBooking(room);
                            }}
                            className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            Book Room
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      )}

      {/* --- TAB 2: MY BOOKINGS --- */}
      {currentTab === 'my-bookings' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Guest Folio
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                My Room Bookings & History
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage your reservations, view room details, cancel stays, or print tax receipts.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('rooms')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <BedDouble className="w-4 h-4 text-amber-400" /> Book Another Room
            </button>
          </div>

          {!currentUser ? (
            <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800">
              <UserCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Sign In to View Your Bookings</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Access your past and upcoming reservations with your guest account.
              </p>
              <button
                onClick={openAuthModal}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Sign In / Register
              </button>
            </div>
          ) : userBookings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                You have not booked any rooms yet. Check our available suites and plan your stay!
              </p>
              <button
                onClick={() => setCurrentTab('rooms')}
                className="px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Browse Available Rooms
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {bk.id.toUpperCase()}
                      </span>
                      {getStatusBadge(bk.status)}
                      <span className="text-xs text-slate-400">
                        Booked on {new Date(bk.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-white">
                      Room #{bk.roomNumber} • {bk.roomType} Suite
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                      <div>
                        <span className="block text-slate-500 text-[11px]">Check-In</span>
                        <strong className="text-slate-200">{bk.checkIn}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[11px]">Check-Out</span>
                        <strong className="text-slate-200">{bk.checkOut}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[11px]">Duration</span>
                        <strong className="text-slate-200">
                          {bk.nights} Night{bk.nights > 1 ? 's' : ''} ({bk.guestsCount} Guest{bk.guestsCount > 1 ? 's' : ''})
                        </strong>
                      </div>
                      <div>
                        <span className="block text-slate-500 text-[11px]">Total Paid</span>
                        <strong className="text-amber-400 font-bold">${bk.totalAmount}</strong>
                      </div>
                    </div>

                    {bk.specialRequests && (
                      <p className="text-xs text-slate-500 italic">
                        Note: &quot;{bk.specialRequests}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    <button
                      onClick={() => setSelectedBookingForInvoice(bk)}
                      className="flex-1 md:w-36 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      View Invoice
                    </button>

                    {bk.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(bk.id)}
                        className="flex-1 md:w-36 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-medium transition-colors"
                      >
                        Cancel Stay
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 3: PROFILE --- */}
      {currentTab === 'profile' && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg">
                {currentUser?.name?.charAt(0) || 'G'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{currentUser?.name || 'Guest User'}</h3>
                <p className="text-xs text-slate-400">{currentUser?.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Role: {currentUser?.role}
                  </span>
                  <span className="text-xs text-slate-500">
                    UID: {currentUser?.uid.slice(0, 10)}...
                  </span>
                </div>
              </div>
            </div>

            {profileMessage && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs">
                {profileMessage}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address (Identity Document)
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 text-sm cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Email is locked to your Firestore user UID.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- QUICK ROOM DETAIL PREVIEW MODAL --- */}
      {previewRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-64">
              <img
                src={previewRoom.imageUrl}
                alt={previewRoom.type}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setPreviewRoom(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/80 text-white rounded-lg hover:bg-slate-900"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-amber-400 text-xs font-bold">
                Room #{previewRoom.roomNumber} • Floor {previewRoom.floor}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold font-serif text-white">
                    {previewRoom.type} Suite
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Accommodates {previewRoom.capacity} Guest(s) • {previewRoom.sizeSqFt || 400} Sq. Ft.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-amber-400">${previewRoom.pricePerNight}</span>
                  <span className="text-xs text-slate-400 block">per night</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{previewRoom.description}</p>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Included Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {previewRoom.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewRoom(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const target = previewRoom;
                    setPreviewRoom(null);
                    if (!currentUser) {
                      openAuthModal();
                    } else {
                      setSelectedRoomForBooking(target);
                    }
                  }}
                  className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Book This Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOKING MODAL --- */}
      {selectedRoomForBooking && (
        <BookingModal
          room={selectedRoomForBooking}
          initialCheckIn={searchCheckIn}
          initialCheckOut={searchCheckOut}
          onClose={() => setSelectedRoomForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* --- INVOICE FOLIO MODAL --- */}
      {selectedBookingForInvoice && (
        <InvoiceModal
          booking={selectedBookingForInvoice}
          onClose={() => setSelectedBookingForInvoice(null)}
        />
      )}

    </div>
  );
};
