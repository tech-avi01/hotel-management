import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  Copy,
  Check,
  Download,
  BookOpen,
  FileCode,
  ShieldCheck,
  Database,
  HelpCircle,
  FolderTree,
  Terminal,
  ExternalLink,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { INITIAL_ROOMS } from '../data/seedData';

interface CollegeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeDocsModal: React.FC<CollegeDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'abstract' | 'schema' | 'rules' | 'files' | 'guide' | 'viva' | 'json'>('abstract');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const FIRESTORE_RULES_CODE = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions for security and authentication
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Default deny all access
    match /{document=**} {
      allow read, write: if false;
    }

    // 1. Users collection: guests can read/update own record; admins can read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) || isAdmin();
      allow delete: if isAdmin();
    }

    // 2. Rooms collection: Anyone can read available rooms; only Admin can create/update/delete
    match /rooms/{roomId} {
      allow read: if true; // Public catalog access
      allow write: if isAdmin();
    }

    // 3. Bookings collection:
    // - Customers can create bookings and read/cancel their own bookings
    // - Admins can read, update (check-in/out), and manage all bookings
    match /bookings/{bookingId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      
      allow create: if isSignedIn() 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.checkIn is string
        && request.resource.data.checkOut is string
        && request.resource.data.nights > 0;

      allow update: if (
        // Customer can only cancel their own booking
        (isSignedIn() && resource.data.userId == request.auth.uid && 
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'paymentStatus']))
        || isAdmin()
      );

      allow delete: if isAdmin();
    }

    // 4. Reviews collection: Publicly readable; signed-in users can add
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
    }
  }
}`;

  const OVERLAPPING_LOGIC_CODE = `/**
 * College Viva Question: "How does the system prevent double-booking for overlapping dates?"
 * 
 * Mathematical Formulation:
 * Let Requested Stay = [R_checkIn, R_checkOut]
 * Let Existing Booking = [B_checkIn, B_checkOut]
 * 
 * Two time intervals overlap IF AND ONLY IF:
 * (R_checkIn < B_checkOut) && (R_checkOut > B_checkIn)
 * 
 * Inverse (Non-overlapping condition):
 * Requested check-out is on/before existing check-in: (R_checkOut <= B_checkIn)
 * OR requested check-in is on/after existing check-out: (R_checkIn >= B_checkOut)
 */

function isRoomAvailable(roomId, requestedCheckIn, requestedCheckOut, existingBookings) {
  const reqStart = new Date(requestedCheckIn).getTime();
  const reqEnd = new Date(requestedCheckOut).getTime();

  // Validate date chronology
  if (reqEnd <= reqStart) return false;

  for (const booking of existingBookings) {
    // Only check bookings for this room that are active
    if (booking.roomId === roomId && (booking.status === 'Confirmed' || booking.status === 'Checked-in')) {
      const bookedStart = new Date(booking.checkIn).getTime();
      const bookedEnd = new Date(booking.checkOut).getTime();

      // Interval overlap check
      if (reqStart < bookedEnd && reqEnd > bookedStart) {
        return false; // Collision detected! Room is occupied.
      }
    }
  }

  return true; // Room is free for the entire requested duration
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded border border-purple-500/30">
                  B.Tech IT (2nd Year) College Submission Pack
                </span>
                <span className="text-xs text-slate-400">Grand Stay PMS</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white mt-0.5">
                Project Documentation, Architecture, Vanilla Code & Viva Guide
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-semibold scrollbar-none">
          {[
            { id: 'abstract', label: '1. Abstract & Architecture', icon: BookOpen },
            { id: 'schema', label: '2. Firestore Schema & ERD', icon: Database },
            { id: 'rules', label: '3. Security Rules & Double-Booking', icon: ShieldCheck },
            { id: 'files', label: '4. Vanilla Folder Tree & Codes', icon: FolderTree },
            { id: 'guide', label: '5. Step-by-Step Setup Guide', icon: Terminal },
            { id: 'viva', label: '6. 10 Viva Questions & Answers', icon: HelpCircle },
            { id: 'json', label: '7. 10 Rooms Seed JSON', icon: FileCode }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 px-3.5 border-b-2 whitespace-nowrap flex items-center gap-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-purple-400 text-purple-300 bg-purple-950/30 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm">
          
          {/* TAB 1: ABSTRACT & ARCHITECTURE */}
          {activeTab === 'abstract' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Project Abstract
                </h3>
                <p className="leading-relaxed text-slate-300 text-xs">
                  The <strong>Grand Stay Hotel Management System</strong> is a cloud-native, responsive web application engineered to streamline hotel reservation workflows, guest relationship management, and front-desk administrative operations. Built for the modern hospitality industry, the platform enables guests to browse room catalogs, filter by date-range and amenities, execute bookings with rigorous double-booking prevention, and access printable GST tax folios. On the administrative side, managers obtain a real-time analytics dashboard displaying room occupancy, daily check-in/check-out schedules, total revenue figures, and dynamic inventory CRUD controls.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Problem Statement</h4>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2">
                  <p>
                    Traditional hotel reservation systems rely on manual register entries or fragmented desktop spreadsheets, causing frequent double-booking conflicts, billing discrepancies, and slow check-in queues. Furthermore, small-to-medium hospitality establishments often lack affordable cloud backends that provide instant multi-device synchronization without expensive server infrastructure.
                  </p>
                  <p>
                    <strong>Solution:</strong> A zero-server-maintenance system leveraging Google Firebase Free Spark Tier (Firestore NoSQL + Firebase Authentication), offering sub-second real-time synchronization, mathematical date-interval availability verification, role-based access control (RBAC), and automated invoice generation.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">System Architecture (3-Tier Layered Design)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] font-bold uppercase text-amber-400">Presentation Layer</span>
                    <h5 className="font-semibold text-white mt-1 text-sm">Client Web UI</h5>
                    <p className="text-slate-400 text-xs mt-1">
                      HTML5, Responsive CSS3 / Tailwind, Vanilla JS (ES6 Modules). Features customer portal, room search, invoice modal with print engine, and responsive admin dashboard.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] font-bold uppercase text-blue-400">Application Logic</span>
                    <h5 className="font-semibold text-white mt-1 text-sm">Controller & Auth Service</h5>
                    <p className="text-slate-400 text-xs mt-1">
                      Firebase Authentication Modular SDK v9+ (Email/Password), client-side route guards, date interval intersection logic, price-night multiplication, and GST tax computation.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[11px] font-bold uppercase text-emerald-400">Data Persistence</span>
                    <h5 className="font-semibold text-white mt-1 text-sm">Cloud Firestore (NoSQL)</h5>
                    <p className="text-slate-400 text-xs mt-1">
                      Document-oriented collections (<code>users</code>, <code>rooms</code>, <code>bookings</code>, <code>reviews</code>) governed by granular declarative Firestore Security Rules.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Future Scope</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
                  <li>Integration with live Payment Gateways (Razorpay / Stripe) for automated UPI/card processing.</li>
                  <li>SMS and WhatsApp reservation alerts via Twilio API.</li>
                  <li>Housekeeping and maintenance ticket management app with staff dispatch.</li>
                  <li>Dynamic seasonal pricing algorithms based on occupancy trends and peak holiday demand.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA & ERD */}
          {activeTab === 'schema' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white font-serif">Firestore Collections & Schemas</h3>
                <span className="text-xs text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded border border-purple-500/30">
                  NoSQL Document Database
                </span>
              </div>

              {/* Collections Grid */}
              <div className="space-y-4">
                
                {/* 1. Users */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-mono text-sm font-bold text-amber-400">Collection: users/{'{uid}'}</h4>
                    <span className="text-xs text-slate-400">Primary Key: Firebase Auth UID</span>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "uid": "usr-8812904",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "+91 91234 56789",
  "role": "customer", // "customer" | "admin"
  "createdAt": "2026-03-01T09:15:00Z"
}`}
                  </pre>
                </div>

                {/* 2. Rooms */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-mono text-sm font-bold text-blue-400">Collection: rooms/{'{roomId}'}</h4>
                    <span className="text-xs text-slate-400">Primary Key: Auto-ID or room number</span>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "roomNumber": "301",
  "type": "Deluxe", // "Single" | "Double" | "Deluxe" | "Suite"
  "pricePerNight": 210,
  "capacity": 3,
  "floor": 3,
  "sizeSqFt": 520,
  "amenities": ["High-Speed Wi-Fi", "Private Jacuzzi", "Ocean View", "Complimentary Breakfast"],
  "imageUrl": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  "status": "Available", // "Available" | "Occupied" | "Maintenance"
  "description": "Indulgent deluxe room featuring a deep soaking jacuzzi tub and scenic coastal sunsets."
}`}
                  </pre>
                </div>

                {/* 3. Bookings */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-mono text-sm font-bold text-emerald-400">Collection: bookings/{'{bookingId}'}</h4>
                    <span className="text-xs text-slate-400">Foreign Keys: userId, roomId</span>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`{
  "userId": "usr-8812904",
  "roomId": "room-301",
  "roomNumber": "301",
  "roomType": "Deluxe",
  "guestName": "Rahul Sharma",
  "guestEmail": "rahul.sharma@example.com",
  "guestPhone": "+91 91234 56789",
  "checkIn": "2026-11-10",
  "checkOut": "2026-11-14",
  "nights": 4,
  "guestsCount": 2,
  "pricePerNight": 210,
  "totalAmount": 940.80, // (4 * 210) + 12% tax
  "taxAmount": 100.80,
  "status": "Confirmed", // "Confirmed" | "Checked-in" | "Checked-out" | "Cancelled"
  "paymentStatus": "Paid", // "Paid" | "Pending" | "Refunded"
  "specialRequests": "High floor, late arrival anticipated",
  "createdAt": "2026-10-25T05:50:00Z"
}`}
                  </pre>
                </div>

              </div>

              {/* Entity Relationships Table */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Entity Relationship Description</h4>
                <div className="border border-slate-700 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800 text-slate-300 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Parent Entity</th>
                        <th className="py-2.5 px-3">Relationship</th>
                        <th className="py-2.5 px-3">Child Entity</th>
                        <th className="py-2.5 px-3">Foreign Key Reference</th>
                        <th className="py-2.5 px-3">Cardinality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900 text-slate-300">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">users</td>
                        <td className="py-2.5 px-3">Makes / Owns</td>
                        <td className="py-2.5 px-3 text-emerald-400">bookings</td>
                        <td className="py-2.5 px-3 font-mono">bookings.userId</td>
                        <td className="py-2.5 px-3">1 to Many (1:N)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">rooms</td>
                        <td className="py-2.5 px-3">Reserved in</td>
                        <td className="py-2.5 px-3 text-emerald-400">bookings</td>
                        <td className="py-2.5 px-3 font-mono">bookings.roomId</td>
                        <td className="py-2.5 px-3">1 to Many (1:N)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-white">users</td>
                        <td className="py-2.5 px-3">Writes</td>
                        <td className="py-2.5 px-3 text-purple-400">reviews</td>
                        <td className="py-2.5 px-3 font-mono">reviews.userId</td>
                        <td className="py-2.5 px-3">1 to Many (1:N)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Firestore Indexes */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                <h4 className="font-bold text-white mb-1">Required Firestore Composite Indexes</h4>
                <p className="text-slate-400 mb-2">
                  Firestore automatically creates single-field indexes. For compound queries:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 font-mono text-[11px]">
                  <li><code>bookings</code> collection: <code>roomId (Ascending) + status (Ascending) + checkIn (Ascending)</code></li>
                  <li><code>bookings</code> collection: <code>userId (Ascending) + createdAt (Descending)</code></li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: RULES & LOGIC */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Overlapping Dates Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold text-white font-serif">
                    Double-Booking Prevention Algorithm
                  </h3>
                  <button
                    onClick={() => copyToClipboard(OVERLAPPING_LOGIC_CODE, 'overlap')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'overlap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Algorithm
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
                  {OVERLAPPING_LOGIC_CODE}
                </pre>
              </div>

              {/* Firestore Rules */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif">
                      Complete Firestore Security Rules (firestore.rules)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Enforces Role-Based Access Control (RBAC): Only admins can manage rooms; users can only touch their own bookings.
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(FIRESTORE_RULES_CODE, 'rules')}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs flex items-center gap-1 font-mono"
                  >
                    {copiedKey === 'rules' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy firestore.rules
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto max-h-96">
                  {FIRESTORE_RULES_CODE}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: FOLDER TREE & FILES */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-serif mb-1">
                  Complete Project Folder Structure (Vanilla HTML/CSS/JS + Firebase)
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  This matches the standard B.Tech college project folder organization.
                </p>
                <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-amber-400">
{`hotel-management-system/
├── index.html                # Landing page & featured suites
├── login.html                # User login / signup / forgot password
├── rooms.html                # Room search, filters, and availability
├── booking.html              # Room booking form with date validation
├── my-bookings.html          # Guest booking history & cancel stay
├── invoice.html              # Printable guest folio / tax invoice
├── admin/
│   └── dashboard.html        # Admin operations dashboard, room CRUD, & guests
├── css/
│   └── style.css             # Unified modern responsive styling
├── js/
│   ├── firebase-config.js    # Firebase App & Firestore initialization
│   ├── auth.js               # Auth state listeners, login, register, role checks
│   ├── rooms.js              # Room fetching, filtering & availability check
│   ├── bookings.js           # Double-booking guard, calculation & create booking
│   └── admin.js              # Admin KPIs, room CRUD & booking status updates
├── firestore.rules           # Security rules for Firestore database
├── firebase.json             # Firebase Hosting and Firestore deployment config
└── README.md                 # Project abstract, setup instructions, & team credits`}
                </pre>
              </div>

              {/* Sample Vanilla JS code snippets */}
              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm">Key Vanilla JS Implementation Files</h4>

                {/* js/firebase-config.js */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                  <p className="font-mono text-xs font-bold text-amber-400 mb-2">📁 js/firebase-config.js</p>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`// Modular Firebase SDK v9+ via CDN imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Replace with your Firebase console project credentials
const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);`}
                  </pre>
                </div>

                {/* js/auth.js */}
                <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
                  <p className="font-mono text-xs font-bold text-blue-400 mb-2">📁 js/auth.js (Role-Based Route Guard)</p>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto">
{`import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Check if current user is admin, otherwise redirect
export async function requireAdminGuard() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "../login.html";
      return;
    }
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists() || userSnap.data().role !== "admin") {
      alert("Access Denied: Admin privileges required.");
      window.location.href = "../index.html";
    }
  });
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STEP-BY-STEP SETUP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white font-serif">
                Beginner-Friendly Setup & Deployment Guide (Free Spark Plan)
              </h3>

              <div className="space-y-4">
                
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-white">Create Firebase Project</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-8">
                    1. Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">console.firebase.google.com</a>.<br />
                    2. Click <strong>Add Project</strong>, name it (e.g. <code>grand-stay-hms</code>), disable Google Analytics (optional for college demo), and click Create.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-white">Enable Firestore Database & Authentication</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-8">
                    1. In the left sidebar, click <strong>Build → Authentication</strong>. Click <em>Get Started</em>, enable <strong>Email/Password</strong>, and save.<br />
                    2. Click <strong>Build → Firestore Database</strong>. Click <em>Create Database</em>, choose <strong>Test mode</strong> (or Production with our rules from Tab 3), and select your nearest region.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-white">Register Web App & Copy Config</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-8">
                    1. In Project Overview, click the <strong>&lt;/&gt; (Web)</strong> icon.<br />
                    2. App nickname: <code>hotel-web-app</code>. Click Register.<br />
                    3. Copy the <code>firebaseConfig</code> object and paste it into <code>js/firebase-config.js</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-white">Create First Admin User</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-8">
                    1. Sign up a new user via your app (e.g., <code>admin@grandstay.com</code>).<br />
                    2. Open Firebase Console → Firestore → open the <code>users</code> collection → find this user document.<br />
                    3. Edit the <code>role</code> field from <code>&quot;customer&quot;</code> to <code>&quot;admin&quot;</code>. Now this user has full admin dashboard privileges!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">5</span>
                    <h4 className="font-bold text-white">Install Firebase CLI & Deploy to Free Hosting</h4>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-lg text-xs font-mono text-slate-300 ml-8 overflow-x-auto">
{`# 1. Install Firebase CLI globally
npm install -g firebase-tools

# 2. Login to your Google account
firebase login

# 3. Initialize project in your folder
firebase init
# Select: Firestore and Hosting
# Use an existing project -> select your project
# Public directory -> . (or dist/ if built)
# Configure as single-page app? -> Yes

# 4. Deploy your website and rules live to the world
firebase deploy`}
                  </pre>
                </div>

                {/* Common Errors */}
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 space-y-2 text-xs">
                  <h4 className="font-bold text-red-300">Common Errors & Quick Fixes</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>
                      <strong>&quot;Missing or insufficient permissions&quot;:</strong> Your Firestore rules in <code>firestore.rules</code> are blocking the operation. Ensure the user is logged in, or deploy the rules provided in Tab 3.
                    </li>
                    <li>
                      <strong>&quot;auth/email-already-in-use&quot;:</strong> User already registered. Use Sign In instead of Sign Up, or use Forgot Password.
                    </li>
                    <li>
                      <strong>&quot;The query requires an index&quot;:</strong> Firebase gives a clickable URL in the browser console. Click that link to create the composite index in 1 minute.
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: 10 VIVA QUESTIONS & ANSWERS */}
          {activeTab === 'viva' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-white font-serif">
                  10 Likely College Viva Questions with Answers
                </h3>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded border border-purple-500/30 font-semibold">
                  B.Tech IT 2nd Year
                </span>
              </div>

              {[
                {
                  q: 'Q1: Why did you choose Google Cloud Firestore (NoSQL) instead of MySQL / Relational Database?',
                  a: 'Firestore offers three major advantages for this project: (1) Free Spark tier with zero server maintenance, (2) Real-time listener synchronization (onSnapshot) so multiple users see room occupancy instantly without refreshing, and (3) Flexible JSON document schema where room amenities array and booking metadata can be stored hierarchically without multiple complex JOIN tables.'
                },
                {
                  q: 'Q2: How does the system mathematically prevent double-booking for the same room?',
                  a: 'Double-booking is prevented using the interval intersection test: two date intervals [R1, R2] and [B1, B2] overlap if and only if (R1 < B2) && (R2 > B1). Before confirming any reservation, the system queries all active bookings (status == "Confirmed" or "Checked-in") for that roomId and checks if the requested dates overlap. If an overlap is detected, the transaction is rejected.'
                },
                {
                  q: 'Q3: How is Role-Based Access Control (RBAC) enforced between Customers and Admins?',
                  a: 'Roles are stored in Firestore under users/{uid}.role = "admin" or "customer". On the frontend, JavaScript route guards inspect this field before loading the admin portal. On the database layer, Firestore Security Rules evaluate `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"` before allowing room mutations or viewing other guests\' data.'
                },
                {
                  q: 'Q4: What is the purpose of the nights and price calculation logic?',
                  a: 'The stay duration is calculated by subtracting check-in timestamp from check-out timestamp, converting milliseconds to days: Math.ceil(diffMs / (1000 * 60 * 60 * 24)). Total amount = (nights * pricePerNight) + 12% GST hospitality tax. This prevents manual calculation errors.'
                },
                {
                  q: 'Q5: What are the primary entities in your database and how are they related?',
                  a: 'There are four primary entities: users, rooms, bookings, and reviews. A user can make multiple bookings (1:N relationship via userId). A room can have multiple historical bookings (1:N relationship via roomId). The bookings document serves as the associative record linking guests and rooms.'
                },
                {
                  q: 'Q6: What happens when a guest cancels a booking?',
                  a: 'The booking status is updated to "Cancelled" and paymentStatus to "Refunded". The booking document is retained in the database for auditing and historical revenue reporting, but it no longer blocks the room\'s availability for those dates since only "Confirmed" and "Checked-in" statuses block dates.'
                },
                {
                  q: 'Q7: Explain the security in your firestore.rules file.',
                  a: 'The rules enforce default-deny (`match /{document=**} { allow read, write: if false; }`). For the rooms collection, read is public so visitors can browse, but write requires isAdmin(). For bookings, create requires isSignedIn() and ensures the creator UID matches auth.uid. Customers can only read and cancel their own bookings.'
                },
                {
                  q: 'Q8: How does the printable invoice feature work?',
                  a: 'The invoice modal formats the booking into an official tax folio complete with GSTIN, itemized nightly charges, tax breakdown, and hotel header. A print CSS stylesheet (`@media print`) hides all background navigation bars and buttons, triggering `window.print()` so the guest or receptionist can print or save as PDF directly.'
                },
                {
                  q: 'Q9: How do you handle room maintenance in the system?',
                  a: 'Rooms have an operational status attribute ("Available" or "Maintenance"). When a manager marks a room under maintenance, its status updates in Firestore, and the availability search algorithm immediately excludes it from the customer search catalog.'
                },
                {
                  q: 'Q10: If 1,000 users try to book at the exact same second, how does Firestore ensure consistency?',
                  a: 'Firestore supports atomic Cloud Transactions (`runTransaction`). In a transaction, Firestore reads the room\'s current bookings, verifies that no other client has committed an overlapping booking in the interim, and commits the write. If another booking was written first, the transaction automatically retries or safely aborts.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
                  <h4 className="font-bold text-amber-300 text-xs sm:text-sm">{item.q}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: 10 ROOMS SEED JSON */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    10 Sample Hotel Rooms Seed JSON
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ready to copy or import directly into your Firebase Firestore <code>rooms</code> collection.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(INITIAL_ROOMS, null, 2), 'seedJson')}
                  className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  {copiedKey === 'seedJson' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy JSON Array
                </button>
              </div>

              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-400 max-h-[450px] overflow-y-auto">
                {JSON.stringify(INITIAL_ROOMS, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Prepared for B.Tech Information Technology Academic Project Submission</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
