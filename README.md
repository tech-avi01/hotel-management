# Grand Stay - Hotel Management System (HMS)
**B.Tech Information Technology (2nd Year Academic Project)**

A comprehensive, cloud-native Hotel Management System built with **HTML5, CSS3/Tailwind, JavaScript/TypeScript, and Google Firebase Free Spark Tier (Firestore NoSQL + Firebase Authentication)**.

---

## 🌟 Key Features

### Customer / Guest Portal
- **Authentication**: Sign up, login, logout, password reset simulation, and role preservation.
- **Room Browsing**: 10 handpicked luxury rooms across Single, Double, Deluxe, and Executive Suite classes.
- **Search & Filter**: Real-time filtering by check-in/out dates, room type, guest count, price slider, and amenities (Jacuzzi, Balcony, Wi-Fi, Breakfast).
- **Overlapping Dates Double-Booking Prevention**: Mathematical interval intersection test `(R_start < B_end && R_end > B_start)` prevents double-booking.
- **Stay Tariff Calculation**: Automated calculation: `Total = (Nights × Price Per Night) + 12% GST/Tax`.
- **My Bookings**: Full reservation history with status pills (`Confirmed`, `Checked-in`, `Checked-out`, `Cancelled`) and cancellation option.
- **Printable Tax Invoice**: Official guest folio with hotel header, GSTIN, booking reference, itemized charges, and `@media print` layout.

### Admin & Reception Portal
- **Real-Time KPIs**: Total Rooms, Available Rooms, Occupancy Rate %, Today's Check-ins, Today's Check-outs, Total Revenue.
- **Room Management (CRUD)**: Add room, edit room tariff/amenities/images, delete room, toggle Available vs Maintenance.
- **Bookings Master**: Filter bookings by status, search by guest/room, and transition statuses (Check-in, Check-out, Cancel).
- **Guest Directory**: Directory of all registered guests with total booking frequency and lifetime spend.

---

## 🗄️ Firestore Database Design

### Collections
1. `users`: `{ uid, name, email, phone, role: 'customer' | 'admin', createdAt }`
2. `rooms`: `{ roomNumber, type, pricePerNight, capacity, floor, sizeSqFt, amenities: [], imageUrl, status: 'Available' | 'Maintenance', description }`
3. `bookings`: `{ userId, roomId, roomNumber, roomType, guestName, guestEmail, guestPhone, checkIn, checkOut, nights, guestsCount, pricePerNight, totalAmount, taxAmount, status, paymentStatus, createdAt }`
4. `reviews`: `{ userId, userName, roomId, rating, comment, createdAt }`

---

## 🔒 Security & Route Guards
- `firestore.rules`: Public read on rooms; write restricted to `isAdmin()`. Bookings can only be created by signed-in users and read/cancelled by their creator or admin.
- Client-side route guards verify user roles before granting access to the administrative console.

---

## 🎓 10 Likely College Viva Questions & Answers
Available in the in-app **Viva & Project Hub** (click the purple button in the top navigation or bottom-left corner).
