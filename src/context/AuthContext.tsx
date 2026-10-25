import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/hotel';
import { storage } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string, phone: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickLoginAs: (role: UserRole) => void;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (name: string, phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_SESSION_KEY = 'hotel_hms_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify user still exists in database
        const found = storage.getUserById(parsed.uid);
        if (found) {
          setCurrentUser(found);
        } else {
          setCurrentUser(parsed);
        }
      } else {
        // Default to guest demo for immediate explore experience
        const defaultGuest = storage.getUsers().find((u) => u.role === 'customer');
        if (defaultGuest) {
          setCurrentUser(defaultGuest);
          localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(defaultGuest));
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _pass: string): Promise<{ success: boolean; message?: string }> => {
    const users = storage.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'No registered user found with this email address.' };
    }
    setCurrentUser(user);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    _pass: string,
    phone: string,
    role: UserRole = 'customer'
  ): Promise<{ success: boolean; message?: string }> => {
    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      uid: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      createdAt: new Date().toISOString()
    };

    storage.addUser(newUser);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };

  const quickLoginAs = (role: UserRole) => {
    const users = storage.getUsers();
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(targetUser));
    }
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    const users = storage.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      return { success: false, message: 'Email address not found in system records.' };
    }
    return {
      success: true,
      message: `Password reset link has been dispatched to ${email}. (In Firebase, sendPasswordResetEmail() is triggered)`
    };
  };

  const updateProfile = async (name: string, phone: string): Promise<boolean> => {
    if (!currentUser) return false;
    const users = storage.getUsers();
    const idx = users.findIndex((u) => u.uid === currentUser.uid);
    if (idx !== -1) {
      const updated = { ...users[idx], name, phone };
      users[idx] = updated;
      localStorage.setItem('hotel_hms_users_v1', JSON.stringify(users));
      setCurrentUser(updated);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updated));
      return true;
    }
    return false;
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        quickLoginAs,
        sendPasswordReset,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
