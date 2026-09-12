import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string; user?: User };
  register: (
    name: string,
    email: string,
    password: string,
    company?: string
  ) => { success: boolean; error?: string; user?: User };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  adminAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  adminDeleteUser: (userId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'saas_platform_users_v1';
const CURRENT_USER_KEY = 'saas_platform_current_user_v1';

export const ADMIN_CREDENTIALS = {
  email: 'admin@saasplatform.com',
  password: 'admin123',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed: User[] = JSON.parse(stored);
        // Ensure the protected admin account is always present
        const hasAdmin = parsed.some(u => u.role === 'admin' && u.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase());
        if (!hasAdmin) {
          const adminAccount = INITIAL_USERS.find(u => u.role === 'admin') || {
            id: 'usr_admin_1',
            name: 'Sarah Jenkins',
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            company: 'SaaS Platform Core Operations',
            createdAt: '2025-11-01T08:00:00Z',
          };
          return [adminAccount, ...parsed];
        }
        return parsed;
      }
    } catch {
      // Fallback if corrupt
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    // No automatic logged-in user: prompt user to register or log in
    return null;
  });

  // Persist users
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage', e);
    }
  }, [users]);

  // Persist current user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Error saving currentUser to localStorage', e);
    }
  }, [currentUser]);

  const login = (email: string, password: string) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    if (!trimmedPassword) {
      return { success: false, error: 'Password is required.' };
    }

    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      return {
        success: false,
        error: 'No account found with this email. Please check your credentials or create an account.',
      };
    }

    if (foundUser.password !== trimmedPassword) {
      return { success: false, error: 'Invalid password. Please check your password and try again.' };
    }

    setCurrentUser(foundUser);
    return { success: true, user: foundUser };
  };

  const register = (name: string, email: string, password: string, company?: string) => {
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedName) {
      return { success: false, error: 'Full name is required.' };
    }

    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!trimmedPassword) {
      return { success: false, error: 'Password is required.' };
    }

    if (trimmedPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Prevent registering with reserved admin email
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: 'This email is reserved for the protected administrator account. Please log in instead.',
      };
    }

    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    // New registered users strictly receive the 'user' (customer) role
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: 'user', // Customer role strictly enforced
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}&backgroundColor=2563eb`,
      company: company?.trim() || 'Personal Workspace',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const adminAddUser = (data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...data,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatar:
        data.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=0284c7`,
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const adminDeleteUser = (userId: string) => {
    // Prevent deleting the main admin account
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.role === 'admin' && targetUser.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) {
      alert('The primary protected administrator account cannot be deleted.');
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...data } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, ...data } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        adminAddUser,
        adminDeleteUser,
        adminUpdateUser,
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
