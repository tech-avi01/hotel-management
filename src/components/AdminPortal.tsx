import React, { useState } from 'react';
import { Room, Booking, User, RoomType, RoomStatus, BookingStatus } from '../types/hotel';
import { storage } from '../services/storageService';
import { InvoiceModal } from './InvoiceModal';
import {
  BedDouble,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  Hotel,
  ArrowUpRight,
  Eye
} from 'lucide-react';

interface AdminPortalProps {
  onBackToRooms: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToRooms }) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'dashboard' | 'rooms' | 'bookings' | 'guests'>('dashboard');

  // Reactively fetch stats and lists
  const stats = storage.getDashboardStats();
  const rooms = storage.getRooms();
  const bookings = storage.getAllBookings();
  const guests = storage.getUsers().filter((u) => u.role === 'customer');

  // Search/filter states for tables
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [bookingSearchTerm, setBookingSearchTerm] = useState<string>('');
  const [roomSearchTerm, setRoomSearchTerm] = useState<string>('');

  // Selected for Invoice modal
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

  // Room Add / Edit Modal state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form fields for room
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [roomType, setRoomType] = useState<RoomType>('Double');
  const [roomPrice, setRoomPrice] = useState<number>(120);
  const [roomCapacity, setRoomCapacity] = useState<number>(2);
  const [roomFloor, setRoomFloor] = useState<number>(1);
  const [roomSize, setRoomSize] = useState<number>(350);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('Available');
  const [roomAmenities, setRoomAmenities] = useState<string>('High-Speed Wi-Fi, AC, Smart TV');
  const [roomImageUrl, setRoomImageUrl] = useState<string>('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80');
  const [roomDescription, setRoomDescription] = useState<string>('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openAddRoomModal = () => {
    setEditingRoom(null);
    setRoomNumber(String(rooms.length + 101));
    setRoomType('Double');
    setRoomPrice(150);
    setRoomCapacity(2);
    setRoomFloor(2);
    setRoomSize(380);
    setRoomStatus('Available');
    setRoomAmenities('High-Speed Wi-Fi, AC, Mini Bar, Smart TV');
    setRoomImageUrl('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80');
    setRoomDescription('Elegantly styled luxury accommodation with city vista and premier appointments.');
    setIsRoomModalOpen(true);
  };

  const openEditRoomModal = (room: Room) => {
    setEditingRoom(room);
    setRoomNumber(room.roomNumber);
    setRoomType(room.type);
    setRoomPrice(room.pricePerNight);
    setRoomCapacity(room.capacity);
    setRoomFloor(room.floor);
    setRoomSize(room.sizeSqFt || 350);
    setRoomStatus(room.status);
    setRoomAmenities(room.amenities.join(', '));
    setRoomImageUrl(room.imageUrl);
    setRoomDescription(room.description);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArr = roomAmenities.split(',').map((s) => s.trim()).filter(Boolean);

    try {
      if (editingRoom) {
        storage.updateRoom(editingRoom.id, {
          roomNumber,
          type: roomType,
          pricePerNight: Number(roomPrice),
          capacity: Number(roomCapacity),
          floor: Number(roomFloor),
          sizeSqFt: Number(roomSize),
          status: roomStatus,
          amenities: amenitiesArr,
          imageUrl: roomImageUrl,
          description: roomDescription
        });
        showToast(`Room #${roomNumber} updated successfully.`);
      } else {
        storage.addRoom({
          roomNumber,
          type: roomType,
          pricePerNight: Number(roomPrice),
          capacity: Number(roomCapacity),
          floor: Number(roomFloor),
          sizeSqFt: Number(roomSize),
          status: roomStatus,
          amenities: amenitiesArr,
          imageUrl: roomImageUrl,
          description: roomDescription
        });
        showToast(`New room #${roomNumber} registered successfully.`);
      }
      setIsRoomModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Error saving room');
    }
  };

  const handleDeleteRoom = (roomId: string, roomNum: string) => {
    if (window.confirm(`Are you sure you want to permanently delete Room #${roomNum}?`)) {
      try {
        storage.deleteRoom(roomId);
        showToast(`Room #${roomNum} deleted.`);
      } catch (err: any) {
        alert(err.message || 'Error deleting room');
      }
    }
  };

  const handleToggleMaintenance = (room: Room) => {
    const newStatus: RoomStatus = room.status === 'Maintenance' ? 'Available' : 'Maintenance';
    storage.updateRoom(room.id, { status: newStatus });
    showToast(`Room #${room.roomNumber} status changed to ${newStatus}.`);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    storage.updateBookingStatus(bookingId, status);
    showToast(`Booking ${bookingId.toUpperCase()} status updated to ${status}.`);
  };

  // Filtered Bookings for management table
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'All' && b.status !== bookingFilterStatus) return false;
    if (bookingSearchTerm.trim()) {
      const q = bookingSearchTerm.toLowerCase();
      const matchName = b.guestName.toLowerCase().includes(q);
      const matchRoom = b.roomNumber.includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      if (!matchName && !matchRoom && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/80 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <section className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3" /> System Administrator
              </span>
              <span className="text-xs text-slate-400">Grand Stay PMS Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white mt-1">
              Hotel Operations & Management
            </h1>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveAdminSubTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Overview Dashboard
            </button>
            <button
              onClick={() => setActiveAdminSubTab('rooms')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'rooms'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BedDouble className="w-4 h-4" /> Rooms Inventory ({rooms.length})
            </button>
            <button
              onClick={() => setActiveAdminSubTab('bookings')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'bookings'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <CalendarCheck className="w-4 h-4" /> All Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveAdminSubTab('guests')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeAdminSubTab === 'guests'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Guest Directory ({guests.length})
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* --- SUBTAB 1: DASHBOARD METRICS --- */}
        {activeAdminSubTab === 'dashboard' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Total Rooms */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Total Rooms</span>
                  <BedDouble className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">{stats.totalRooms}</span>
                  <span className="text-[11px] text-slate-500">inventory</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Across 5 Hotel Floors
                </div>
              </div>

              {/* Available Rooms */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-medium text-slate-400">Available</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-emerald-400">{stats.availableRooms}</span>
                  <span className="text-[11px] text-slate-500">ready</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-400/80">
                  Ready for instant booking
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Occupancy</span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-blue-400">{stats.occupancyRate}%</span>
                  <span className="text-[11px] text-slate-500">rate</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  {stats.occupiedRooms} room(s) occupied
                </div>
              </div>

              {/* Today's Check-ins */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Today Check-In</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-amber-400">{stats.todaysCheckIns}</span>
                  <span className="text-[11px] text-slate-500">expected</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Arrivals schedule
                </div>
              </div>

              {/* Today's Check-outs */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Today Check-Out</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-purple-400">{stats.todaysCheckOuts}</span>
                  <span className="text-[11px] text-slate-500">departures</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Departures schedule
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-slate-900 to-amber-950/20">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-medium text-slate-300">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-amber-400">${stats.totalRevenue}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  From {stats.totalBookings} total bookings
                </div>
              </div>

            </div>

            {/* Quick Action & Today's Schedule Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Bookings Feed */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-amber-400" /> Recent Reservation Stream
                  </h3>
                  <button
                    onClick={() => setActiveAdminSubTab('bookings')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {bookings.slice(0, 5).map((bk) => (
                    <div
                      key={bk.id}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-white">
                          #{bk.roomNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{bk.guestName}</p>
                          <p className="text-slate-400 text-[11px]">
                            {bk.checkIn} to {bk.checkOut} ({bk.nights} nights)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-amber-400">${bk.totalAmount}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            bk.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : bk.status === 'Checked-in'
                              ? 'bg-blue-500/20 text-blue-400'
                              : bk.status === 'Cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {bk.status}
                        </span>
                        <button
                          onClick={() => setInvoiceBooking(bk)}
                          title="Generate Folio / Bill"
                          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance & Quick Tools */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" /> Operational Controls
                </h3>

                <button
                  onClick={openAddRoomModal}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" /> Add New Room Inventory
                </button>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Rooms Under Maintenance:</span>
                    <strong className="text-amber-400">{stats.maintenanceRooms}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Active In-House Guests:</span>
                    <strong className="text-white">{stats.occupiedRooms}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Registered Database Users:</span>
                    <strong className="text-white">{storage.getUsers().length}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                  <p className="font-semibold flex items-center gap-1.5 mb-1 text-amber-300">
                    <Shield className="w-3.5 h-3.5" /> Admin Role Guard
                  </p>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Access is restricted in Firestore by checking <code>users/{'{uid}'}.role == &quot;admin&quot;</code>.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- SUBTAB 2: ROOM MANAGEMENT --- */}
        {activeAdminSubTab === 'rooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">Room Inventory Management</h2>
                <p className="text-xs text-slate-400">
                  Add, edit, remove rooms, or toggle maintenance status.
                </p>
              </div>
              <button
                onClick={openAddRoomModal}
                className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add New Room
              </button>
            </div>

            {/* Rooms Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Room #</th>
                      <th className="py-3 px-4">Photo & Class</th>
                      <th className="py-3 px-4">Floor / Capacity</th>
                      <th className="py-3 px-4">Tariff / Night</th>
                      <th className="py-3 px-4">Operational Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm">
                          #{room.roomNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={room.imageUrl}
                              alt={room.type}
                              className="w-12 h-10 object-cover rounded-md"
                            />
                            <div>
                              <p className="font-semibold text-white">{room.type} Suite</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{room.amenities.slice(0, 3).join(', ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-white">Floor {room.floor}</p>
                          <p className="text-slate-400 text-[11px]">{room.capacity} Persons ({room.sizeSqFt || 350} sq.ft)</p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          ${room.pricePerNight}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${
                              room.status === 'Available'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {room.status === 'Available' ? <CheckCircle className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                            {room.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleMaintenance(room)}
                              title={room.status === 'Maintenance' ? 'Mark Available' : 'Mark Under Maintenance'}
                              className={`p-1.5 rounded transition-colors ${
                                room.status === 'Maintenance'
                                  ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                                  : 'bg-slate-800 text-slate-400 hover:text-amber-400'
                              }`}
                            >
                              <Wrench className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditRoomModal(room)}
                              title="Edit Room"
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                              title="Delete Room"
                              className="p-1.5 rounded bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SUBTAB 3: BOOKINGS MANAGEMENT --- */}
        {activeAdminSubTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">Guest Bookings Master</h2>
                <p className="text-xs text-slate-400">
                  Update reservation status (Check-in, Check-out, Cancel) and generate tax folios.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by guest, room, ID..."
                    value={bookingSearchTerm}
                    onChange={(e) => setBookingSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => setBookingFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-in">Checked-in</option>
                  <option value="Checked-out">Checked-out</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Booking ID</th>
                      <th className="py-3 px-4">Guest Details</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Stay Dates</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status & Quick Change</th>
                      <th className="py-3 px-4 text-right">Folio Bill</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {bk.id.toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{bk.guestName}</p>
                          <p className="text-[11px] text-slate-400">{bk.guestPhone}</p>
                          <p className="text-[10px] text-slate-500">{bk.guestEmail}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white">Room #{bk.roomNumber}</span>
                          <span className="text-[11px] text-slate-400 block">{bk.roomType}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-white">{bk.checkIn} to {bk.checkOut}</p>
                          <p className="text-[11px] text-slate-400">{bk.nights} night(s) • {bk.guestsCount} guest(s)</p>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-400">
                          ${bk.totalAmount}
                          <span className="text-[10px] text-slate-500 block">({bk.paymentStatus})</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <select
                              value={bk.status}
                              onChange={(e) => handleUpdateBookingStatus(bk.id, e.target.value as BookingStatus)}
                              className={`px-2.5 py-1 rounded text-xs font-semibold focus:outline-none ${
                                bk.status === 'Confirmed'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                  : bk.status === 'Checked-in'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                                  : bk.status === 'Cancelled'
                                  ? 'bg-red-950 text-red-400 border border-red-500/40'
                                  : 'bg-slate-800 text-slate-300 border border-slate-700'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Checked-in">Checked-in</option>
                              <option value="Checked-out">Checked-out</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setInvoiceBooking(bk)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-white font-medium inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Bill</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SUBTAB 4: GUEST DIRECTORY --- */}
        {activeAdminSubTab === 'guests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Registered Guest Directory</h2>
              <p className="text-xs text-slate-400">
                View customer profiles, contact numbers, and total booking history records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.map((guest) => {
                const guestBookings = bookings.filter((b) => b.userId === guest.uid);
                const totalSpent = guestBookings
                  .filter((b) => b.status !== 'Cancelled')
                  .reduce((sum, b) => sum + b.totalAmount, 0);

                return (
                  <div
                    key={guest.uid}
                    className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                        {guest.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{guest.name}</h4>
                        <p className="text-xs text-slate-400">{guest.email}</p>
                        <p className="text-xs text-slate-500">{guest.phone}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Bookings</span>
                        <strong className="text-white text-sm">{guestBookings.length}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Lifetime Spend</span>
                        <strong className="text-amber-400 text-sm">${totalSpent}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Joined: {new Date(guest.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono text-slate-400">UID: {guest.uid.slice(0, 8)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* --- ADD / EDIT ROOM MODAL --- */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room Inventory'}
              </h3>
              <button
                onClick={() => setIsRoomModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Number</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as RoomType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price / Night ($)</label>
                  <input
                    type="number"
                    value={roomPrice}
                    onChange={(e) => setRoomPrice(Number(e.target.value))}
                    required
                    min={30}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    value={roomCapacity}
                    onChange={(e) => setRoomCapacity(Number(e.target.value))}
                    required
                    min={1}
                    max={10}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor</label>
                  <input
                    type="number"
                    value={roomFloor}
                    onChange={(e) => setRoomFloor(Number(e.target.value))}
                    required
                    min={1}
                    max={20}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operational Status</label>
                <select
                  value={roomStatus}
                  onChange={(e) => setRoomStatus(e.target.value as RoomStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={roomAmenities}
                  onChange={(e) => setRoomAmenities(e.target.value)}
                  placeholder="Wi-Fi, AC, Jacuzzi, Balcony"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={roomImageUrl}
                  onChange={(e) => setRoomImageUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- INVOICE MODAL --- */}
      {invoiceBooking && (
        <InvoiceModal
          booking={invoiceBooking}
          onClose={() => setInvoiceBooking(null)}
        />
      )}

    </div>
  );
};
