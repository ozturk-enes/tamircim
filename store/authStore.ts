import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Mechanic } from '@/types/schema';

interface AuthState {
  user: Customer | Mechanic | null;
  isAuthenticated: boolean;
  userType: 'customer' | 'mechanic' | null;
  
  login: (user: Customer | Mechanic, type: 'customer' | 'mechanic') => void;
  logout: () => void;
  updateUser: (updates: Partial<Customer | Mechanic>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      userType: null,

      login: (user, type) => {
        set({ user, userType: type, isAuthenticated: true });
      },

      logout: () => set({ user: null, userType: null, isAuthenticated: false }),

      // GÜNCELLENEN KISIM:
      updateUser: (updates) => {
        set((state) => {
          // Eğer kullanıcı yoksa hiçbir şey yapma
          if (!state.user) return {}; 

          // TypeScript'e bu birleşimin güvenli olduğunu 'as' ile söylüyoruz
          const updatedUser = { ...state.user, ...updates } as Customer | Mechanic;

          return { user: updatedUser };
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);