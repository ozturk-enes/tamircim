import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mockJobs, mockUsers } from '../constants/mockData';
import { Customer, Job, Mechanic } from '../types';

interface DataState {
  customers: Customer[];
  mechanics: Mechanic[];
  jobs: Job[];
  
  // Actions
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  
  addMechanic: (mechanic: Mechanic) => void;
  updateMechanic: (id: string, updates: Partial<Mechanic>) => void;
  
  addJob: (job: Job) => void;
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  completeJob: (jobId: string, paymentAmount: number, workDetails: string) => void;
  
  rateMechanic: (mechanicId: string, rating: number, comment?: string) => void;
}

// Initial State from Mock Data
// We need to ensure we map the mock data correctly.
// mockUsers.mechanics seems to be the source for mechanics.
// mockUsers.customers seems to be the source for customers.

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      customers: mockUsers.customers as unknown as Customer[],
      mechanics: mockUsers.mechanics.map(m => ({
        ...m,
        // Ensure all required fields are present if mock data is missing some
        rating: m.rating || 0,
        reviewCount: m.reviewCount || 0,
        // Enhanced data populated once
        distance: (Math.random() * 10 + 0.5).toFixed(1),
        completedJobs: Math.floor(Math.random() * 100 + 20),
        responseTime: Math.floor(Math.random() * 30 + 5),
        serviceTitle: (m.specialties && m.specialties.length > 0 ? m.specialties[0] : 'Genel') + " Uzmanı",
        experience: (Math.floor(Math.random() * 15 + 2)) + " yıl",
        averageResponseTime: (Math.floor(Math.random() * 60 + 15)) + " dk",
      })) as unknown as Mechanic[],
      jobs: mockJobs as unknown as Job[],
      messages: [
        {
            id: "1",
            senderId: "cust1",
            receiverId: "mech1",
            senderName: "Mehmet Demir",
            content: "Merhaba, aracımın motor arızası için ne zaman bakabilirsiniz?",
            timestamp: "14:30",
            isRead: false,
            senderType: 'customer',
            carPlate: "34 ABC 123",
        },
        {
            id: "2",
            senderId: "cust2",
            receiverId: "mech1",
            senderName: "Ayşe Kaya",
            content: "Fren balata işi ne kadar sürer?",
            timestamp: "13:15",
            isRead: true,
            senderType: 'customer',
            carPlate: "06 XYZ 789",
        }
      ] as Message[],
      offers: [
        {
            id: "1",
            customerId: "cust3",
            customerName: "Fatma Çelik",
            carInfo: "2017 Ford Focus - 34 DEF 456",
            problem: "Transmisyon arızası",
            offeredPrice: "₺600",
            location: "Üsküdar, İstanbul",
            distance: "2.3 km",
            urgency: "high",
            time: "10 dk önce",
            status: 'pending'
        }
      ] as Offer[],
      reminders: [] as Reminder[],

      addCustomer: (customer) => set((state) => ({ 
        customers: [...state.customers, customer] 
      })),

      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map((c) => c.id === id ? { ...c, ...updates } : c)
      })),

      addMechanic: (mechanic) => set((state) => ({
        mechanics: [...state.mechanics, mechanic]
      })),

      updateMechanic: (id, updates) => set((state) => ({
        mechanics: state.mechanics.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),

      addJob: (job) => set((state) => ({
        jobs: [...state.jobs, job]
      })),

      updateJobStatus: (jobId, status) => set((state) => ({
        jobs: state.jobs.map((j) => j.id === jobId ? { ...j, status } : j)
      })),

      rateMechanic: (mechanicId, rating) => set((state) => {
        const mechanic = state.mechanics.find((m) => m.id === mechanicId);
        if (!mechanic) return state;

        const currentTotalScore = mechanic.rating * mechanic.reviewCount;
        const newReviewCount = mechanic.reviewCount + 1;
        const newRating = (currentTotalScore + rating) / newReviewCount;

        // Round to 1 decimal place
        const roundedRating = Math.round(newRating * 10) / 10;

        return {
          mechanics: state.mechanics.map((m) => 
            m.id === mechanicId 
              ? { ...m, rating: roundedRating, reviewCount: newReviewCount } 
              : m
          )
        };
      }),
    }),
    {
      name: 'data-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
