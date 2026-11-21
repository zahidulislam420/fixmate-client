'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { getAuthToken, setAuthToken, apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>, newToken?: string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Restore session on initial load
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = getAuthToken();
        const storedUser = localStorage.getItem('fixmate_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }

          // Fetch fresh user profile from server
          try {
            const res = await apiFetch<{ success: boolean; user: User }>('/auth/me');
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('fixmate_user', JSON.stringify(res.user));
            }
          } catch (err) {
            // Token might be invalid/expired
            console.warn('Failed to verify stored token:', err);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);
    localStorage.setItem('fixmate_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('fixmate_user');
    toast.success('Signed out successfully');
    router.push('/sign-in');
  }, [router]);

  const updateUser = useCallback((updatedFields: Partial<User>, newToken?: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('fixmate_user', JSON.stringify(merged));
      return merged;
    });

    if (newToken) {
      setToken(newToken);
      setAuthToken(newToken);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch<{ success: boolean; user: User }>('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('fixmate_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
