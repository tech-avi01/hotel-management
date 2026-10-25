import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/hotel';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Hotel
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, sendPasswordReset, quickLoginAs } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.message || 'Login failed.');
        }
      } else if (mode === 'signup') {
        if (!name || !email || !phone || !password) {
          setErrorMessage('Please fill in all fields.');
          setIsSubmitting(false);
          return;
        }
        const res = await signup(name, email, password, phone, role);
        if (res.success) {
          setSuccessMessage('Account registered successfully! Welcome to Grand Stay.');
          setTimeout(() => onClose(), 1200);
        } else {
          setErrorMessage(res.message || 'Sign up failed.');
        }
      } else if (mode === 'forgot') {
        if (!email) {
          setErrorMessage('Please enter your email.');
          setIsSubmitting(false);
          return;
        }
        const res = await sendPasswordReset(email);
        if (res.success) {
          setSuccessMessage(res.message);
        } else {
          setErrorMessage(res.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-lg text-white">
              {mode === 'signin' && 'Sign In to Grand Stay'}
              {mode === 'signup' && 'Create Guest / Staff Account'}
              {mode === 'forgot' && 'Reset Account Password'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Fast Login Shortcuts (Examiner Friendly) */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Demo Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                quickLoginAs('customer');
                onClose();
              }}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-left transition-colors flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                G
              </div>
              <div>
                <p className="font-bold text-white text-[11px]">Rahul (Guest)</p>
                <p className="text-[9px] text-slate-400">customer role</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                quickLoginAs('admin');
                onClose();
              }}
              className="px-3 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-left transition-colors flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <p className="font-bold text-white text-[11px]">Manager (Admin)</p>
                <p className="text-[9px] text-amber-300">full privileges</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mode === 'signin'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mode === 'signup'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setMode('forgot');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition-colors ${
              mode === 'forgot'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="customer">Customer (Guest)</option>
                  <option value="admin">Administrator / Manager</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4" />
            {mode === 'signin' && (isSubmitting ? 'Verifying...' : 'Sign In')}
            {mode === 'signup' && (isSubmitting ? 'Creating...' : 'Register Account')}
            {mode === 'forgot' && (isSubmitting ? 'Dispatching...' : 'Send Reset Link')}
          </button>
        </form>

      </div>
    </div>
  );
};
