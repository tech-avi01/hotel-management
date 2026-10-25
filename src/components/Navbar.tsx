import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Hotel,
  Shield,
  User as UserIcon,
  LogOut,
  CalendarCheck,
  GraduationCap,
  Sparkles,
  RefreshCw,
  BedDouble,
  SlidersHorizontal,
  Share2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'rooms' | 'my-bookings' | 'admin' | 'profile';
  setCurrentTab: (tab: 'rooms' | 'my-bookings' | 'admin' | 'profile') => void;
  openCollegeHub: () => void;
  openProfessorGuide: () => void;
  openAuthModal: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCollegeHub,
  openProfessorGuide,
  openAuthModal,
  onResetData
}) => {
  const { currentUser, isAdmin, logout, quickLoginAs } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & College Project Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('rooms')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-600/30 text-slate-950 font-bold">
              <Hotel className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-serif font-bold tracking-tight text-white">Grand Stay</span>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Resort & Spa
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span>College Project</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300">B.Tech IT 2nd Year</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('rooms')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'rooms'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              Rooms & Suites
            </button>

            {currentUser && (
              <button
                onClick={() => setCurrentTab('my-bookings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  currentTab === 'my-bookings'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                My Bookings
              </button>
            )}

            {/* Admin Console Tab - Always highlighted for demo ease */}
            <button
              onClick={() => {
                if (!isAdmin) {
                  quickLoginAs('admin');
                }
                setCurrentTab('admin');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-amber-300 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/60'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* College Project Submission & Viva Pack Button */}
            <button
              onClick={openCollegeHub}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-purple-200 bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/80 transition-all flex items-center gap-2 ml-1"
            >
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Viva & Project Hub</span>
              <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.2 rounded font-bold">10 Q&A</span>
            </button>

            {/* Professor & Evaluator Guide Button */}
            <button
              onClick={openProfessorGuide}
              className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-amber-200 bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900/90 transition-all flex items-center gap-2 ml-1 shadow-md shadow-amber-500/10 animate-pulse hover:animate-none"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Professor Guide & URL</span>
            </button>
          </nav>

          {/* Quick Role & User Actions */}
          <div className="flex items-center gap-2.5">
            {/* 1-Click Role Switcher for examiner viva demo */}
            <div className="hidden lg:flex items-center bg-slate-800/90 border border-slate-700 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 font-medium">Switch Role:</span>
              <button
                onClick={() => {
                  quickLoginAs('customer');
                  setCurrentTab('rooms');
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  !isAdmin
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  quickLoginAs('admin');
                  setCurrentTab('admin');
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  isAdmin
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-white truncate max-w-[100px]">{currentUser.name}</p>
                    <p className="text-[10px] text-amber-400 capitalize">{currentUser.role}</p>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 border border-slate-700 text-slate-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-md flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Sign In / Register
              </button>
            )}

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              title="Reset Sample Data to Original 10 Rooms"
              className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab('rooms')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'rooms' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <BedDouble className="w-4 h-4" />
            <span>Rooms</span>
          </button>
          <button
            onClick={() => setCurrentTab('my-bookings')}
            className={`flex flex-col items-center gap-1 ${currentTab === 'my-bookings' ? 'text-amber-400' : 'text-slate-400'}`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Bookings</span>
          </button>
          <button
            onClick={() => {
              if (!isAdmin) quickLoginAs('admin');
              setCurrentTab('admin');
            }}
            className={`flex flex-col items-center gap-1 ${currentTab === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
          <button
            onClick={openCollegeHub}
            className="flex flex-col items-center gap-1 text-purple-300"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Viva</span>
          </button>
          <button
            onClick={openProfessorGuide}
            className="flex flex-col items-center gap-1 text-amber-300 font-bold"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Prof Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
