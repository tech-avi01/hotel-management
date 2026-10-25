import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { CollegeDocsModal } from './components/CollegeDocsModal';
import { ProfessorGuideModal } from './components/ProfessorGuideModal';
import { storage } from './services/storageService';
import {
  GraduationCap,
  Sparkles,
  Hotel,
  Shield,
  Heart,
  Database,
  Flame,
  CheckCircle2,
  Share2
} from 'lucide-react';

function MainApp() {
  const { isAdmin, currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<'rooms' | 'my-bookings' | 'admin' | 'profile'>('rooms');
  const [isCollegeHubOpen, setIsCollegeHubOpen] = useState<boolean>(false);
  const [isProfessorGuideOpen, setIsProfessorGuideOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [resetTick, setResetTick] = useState<number>(0);

  const handleResetData = () => {
    if (window.confirm('Reset all rooms, bookings, and test users to initial college seed data?')) {
      storage.resetToDefaults();
      setResetTick((prev) => prev + 1);
      alert('Database restored to 10 sample rooms and default bookings.');
    }
  };

  return (
    <div key={resetTick} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCollegeHub={() => setIsCollegeHubOpen(true)}
        openProfessorGuide={() => setIsProfessorGuideOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Router */}
      <div className="flex-1">
        {currentTab === 'admin' ? (
          <AdminPortal onBackToRooms={() => setCurrentTab('rooms')} />
        ) : (
          <CustomerPortal
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </div>

      {/* Floating Buttons: College Viva & Professor Guide */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          onClick={() => setIsCollegeHubOpen(true)}
          className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-3 rounded-full shadow-2xl border border-purple-400/40 flex items-center gap-2.5 transition-all transform hover:scale-105 group"
          title="Open College Project Report & Viva Q&A"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-purple-200" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
              College Viva & Docs <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">10 Q&A</span>
            </p>
            <p className="text-[10px] text-purple-200">Architecture & Rules</p>
          </div>
        </button>

        <button
          onClick={() => setIsProfessorGuideOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 px-4 py-3 rounded-full shadow-2xl border border-amber-300/60 flex items-center gap-2.5 transition-all transform hover:scale-105 font-bold"
          title="Generate Shareable Website URL & View Professor Guide"
        >
          <div className="w-7 h-7 rounded-full bg-slate-950/20 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-slate-950" />
          </div>
          <div className="text-left">
            <p className="text-xs font-black leading-tight flex items-center gap-1.5">
              Professor Guide & URL <span>🔗</span>
            </p>
            <p className="text-[10px] text-slate-900 font-semibold">Copy Link & QR Code</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-white text-sm">Grand Stay Hotel Management System</p>
              <p className="text-[11px] text-slate-500">
                B.Tech Information Technology (2nd Year) Academic Project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Firebase Free Spark Plan
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-400" /> Cloud Firestore NoSQL
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Role-Based Access (Admin & Guest)
            </span>
          </div>

          <div className="flex items-center gap-4 text-right">
            <button
              onClick={() => setIsProfessorGuideOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline text-xs"
            >
              Get Shareable URL for Professor →
            </button>
            <button
              onClick={() => setIsCollegeHubOpen(true)}
              className="text-purple-400 hover:text-purple-300 font-semibold underline text-xs"
            >
              Viva & Report →
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <CollegeDocsModal
        isOpen={isCollegeHubOpen}
        onClose={() => setIsCollegeHubOpen(false)}
      />

      <ProfessorGuideModal
        isOpen={isProfessorGuideOpen}
        onClose={() => setIsProfessorGuideOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
