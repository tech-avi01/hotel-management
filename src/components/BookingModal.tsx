import React, { useState, useEffect } from 'react';
import { Room, Booking } from '../types/hotel';
import { storage } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  room,
  onClose,
  onBookingSuccess,
  initialCheckIn,
  initialCheckOut
}) => {
  const { currentUser } = useAuth();

  // Helper to format date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState<string>(initialCheckIn || todayStr);
  const [checkOut, setCheckOut] = useState<string>(initialCheckOut || tomorrowStr);
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>(currentUser?.name || '');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser?.email || '');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser?.phone || '');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [nights, setNights] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync current user fields
  useEffect(() => {
    if (currentUser) {
      if (!guestName) setGuestName(currentUser.name);
      if (!guestEmail) setGuestEmail(currentUser.email);
      if (!guestPhone) setGuestPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Recalculate nights and verify date availability whenever dates or room changes
  useEffect(() => {
    if (!room || !checkIn || !checkOut) return;

    setErrorMessage('');
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      setErrorMessage('Check-out date must be strictly after Check-in date.');
      setIsAvailable(false);
      setNights(0);
      return;
    }

    const diffMs = end.getTime() - start.getTime();
    const calculatedNights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    setNights(calculatedNights);

    const available = storage.isRoomAvailable(room.id, checkIn, checkOut);
    setIsAvailable(available);
    if (!available) {
      setErrorMessage(`Room #${room.roomNumber} has existing overlapping bookings for these dates. Please choose different dates.`);
    }
  }, [room, checkIn, checkOut]);

  if (!room) return null;

  const basePrice = nights * room.pricePerNight;
  const taxAmount = Number((basePrice * 0.12).toFixed(2));
  const totalAmount = Number((basePrice + taxAmount).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage('Please sign in to confirm a booking.');
      return;
    }

    if (!isAvailable) {
      setErrorMessage('This room is unavailable for the selected dates.');
      return;
    }

    if (guestsCount > room.capacity) {
      setErrorMessage(`This room accommodates a maximum of ${room.capacity} guest(s).`);
      return;
    }

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMessage('Please provide complete guest details (Name, Email, and Phone).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = storage.createBooking({
        userId: currentUser.uid,
        roomId: room.id,
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        guestsCount,
        specialRequests
      });

      onBookingSuccess(newBooking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Reserve Room #{room.roomNumber}
              </span>
              <span className="text-xs text-slate-400">{room.type} Suite</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white mt-1">
              Confirm Your Stay Reservation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Room Summary Card */}
          <div className="flex flex-col sm:flex-row gap-4 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <img
              src={room.imageUrl}
              alt={room.type}
              className="w-full sm:w-32 h-24 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1 text-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-base">
                  {room.type} Room • Floor {room.floor}
                </h4>
                <div className="text-right">
                  <span className="text-amber-400 font-bold text-lg">${room.pricePerNight}</span>
                  <span className="text-xs text-slate-400"> / night</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs mt-1 line-clamp-1">{room.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-400" /> Max {room.capacity} Guests
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  {room.sizeSqFt || 350} sq.ft
                </span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Dates Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-in Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check-out Date
                </label>
                <input
                  type="date"
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Availability Status Banner */}
            {isAvailable ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Available!</strong> No overlapping bookings detected for {nights} night(s).
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage || 'Room is unavailable for these specific dates.'}</span>
              </div>
            )}

            {/* Guest Information */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" /> Guest Details
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="Guest primary name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Guests Count</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  >
                    {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    placeholder="For booking confirmation & invoice"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Special Requests (Optional)</label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Early check-in, quiet floor, extra pillows"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-slate-800 pt-4">
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>
                    Rate ({nights} night{nights > 1 ? 's' : ''} × ${room.pricePerNight})
                  </span>
                  <span className="text-white font-medium">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>State Hospitality Tax & GST (12%)</span>
                  <span className="text-white font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Estimated Amount</span>
                  <span className="text-amber-400 text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && !isAvailable && (
              <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-500/20">
                {errorMessage}
              </p>
            )}

            {/* Submit / Cancel buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isAvailable || isSubmitting || nights < 1}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? 'Confirming...' : `Confirm & Book ($${totalAmount.toFixed(2)})`}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
