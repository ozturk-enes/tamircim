import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Mechanic } from '../types';
import { mockCustomers, mockUsers } from '../constants/mockData';

interface AuthState {
  user: Customer | Mechanic | null;
  userType: 'customer' | 'mechanic' | null;
  isAuthenticated: boolean;
  login: (email: string, type: 'customer' | 'mechanic') => boolean;
  register: (user: Customer | Mechanic, type: 'customer' | 'mechanic') => void;
  logout: () => void;
  updateUser: (user: Partial<Customer | Mechanic>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userType: null,
      isAuthenticated: false,

      login: (email, type) => {
        // In a real app, we would validate password too.
        // For now, we check against mock data + stored users would be in dataStore but auth usually handles session.
        // Since the requirement says "verify user", we'll check against our "database" which is dataStore for registered users.
        // But to keep it simple and consistent with the requirement "mockData structure to persistent global state",
        // we will assume the dataStore holds the "database" of users.
        // HOWEVER, authStore usually handles the *current session*.
        
        // We need to access the list of users. 
        // Ideally, user lists should be in dataStore. 
        // But to avoid circular dependencies or complexity, let's assume we fetch from dataStore here or just keep session here.
        // Let's rely on dataStore for the "Database" of users. 
        // But I haven't created dataStore yet. 
        // I'll assume useDataStore will be available or I'll just check mockData for now for the initial login 
        // and then any new registered users should be handled.
        
        // Actually, the requirement says: "register function should really add new user to store".
        // So we should probably keep the list of users in dataStore? 
        // Or keep them in authStore? 
        // Usually authStore just keeps the *current* user. DataStore keeps *all* entities.
        
        // Let's implement login by checking against dataStore.
        // Since I can't import dataStore yet (it's not created), I will defer the logic slightly or use a cleaner approach.
        // For now, I'll put the "database" of users in dataStore. 
        // `login` will need to look up the user.
        
        // Wait, if I put all users in dataStore, authStore needs to access it.
        // I'll implement `login` to take the user object directly for now? 
        // No, login takes email.
        
        // Let's make `login` accept the user object found by the caller? 
        // No, that's bad DX.
        
        // Let's assume we import `useDataStore` inside the function to avoid circular dependency at module level.
        const { customers, mechanics } = require('./dataStore').useDataStore.getState();
        
        let foundUser = null;
        if (type === 'customer') {
          foundUser = customers.find((u: Customer) => u.email === email);
        } else {
          foundUser = mechanics.find((u: Mechanic) => u.email === email);
        }

        if (foundUser) {
          set({ user: foundUser, userType: type, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: (user, type) => {
        // Add to dataStore
        const { addCustomer, addMechanic } = require('./dataStore').useDataStore.getState();
        
        if (type === 'customer') {
          addCustomer(user as Customer);
        } else {
          addMechanic(user as Mechanic);
        }
        
        // Auto login
        set({ user, userType: type, isAuthenticated: true });
      },

      logout: () => set({ user: null, userType: null, isAuthenticated: false }),

      updateUser: (updates) => {
        set((state) => {
            if (!state.user) return state;
            return { user: { ...state.user, ...updates } };
        });
        // Also update in dataStore
        const { user, userType } = get();
        if (user && userType) {
             const { updateCustomer, updateMechanic } = require('./dataStore').useDataStore.getState();
             if (userType === 'customer') {
                 updateCustomer(user.id, updates);
             } else {
                 updateMechanic(user.id, updates);
             }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
