import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// Not: Dosya adını 'seeData.ts' yaptıysan bu şekilde kalmalı, 'seedData.ts' ise 'd' harfini eklemeyi unutma.
import { seedCars, seedCustomers, seedJobs, seedMechanics, seedReminders } from '@/constants/seeData';
import { Car, Customer, Job, Mechanic, Reminder } from '@/types/schema';

interface DataState {
  // --- STATE (Veriler) ---
  customers: Customer[];
  mechanics: Mechanic[];
  cars: Car[];
  jobs: Job[];
  reminders: Reminder[];
  
  // --- ACTIONS (İşlemler) ---
  
  // Ekleme İşlemleri
  addCustomer: (customer: Customer) => void;
  addMechanic: (mechanic: Mechanic) => void;
  addCar: (car: Car) => void;
  addJob: (job: Job) => void;
  
  // Güncelleme İşlemleri (EKLENEN KISIMLAR)
  updateJobStatus: (jobId: string, status: Job['status']) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void; // Profil güncellemesi için gerekli
  updateMechanic: (id: string, updates: Partial<Mechanic>) => void; // Tamirci profili için gerekli
  
  // Araç ve Hatırlatıcı İşlemleri
  removeCar: (carId: string) => void;
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (reminderId: string) => void;
  
  // Değerlendirme
  rateJob: (jobId: string, rating: number, comment?: string) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // BAŞLANGIÇ VERİLERİ (SEED DATA)
      customers: seedCustomers,
      mechanics: seedMechanics,
      cars: seedCars,
      jobs: seedJobs,
      reminders: seedReminders,

      // --- EKLEME FONKSİYONLARI ---
      addCustomer: (customer) => set((state) => ({ 
        customers: [...state.customers, customer] 
      })),

      addMechanic: (mechanic) => set((state) => ({ 
        mechanics: [...state.mechanics, mechanic] 
      })),

      addCar: (car) => set((state) => ({ 
        cars: [...state.cars, car] 
      })),

      addJob: (job) => set((state) => ({ 
        jobs: [...state.jobs, job] 
      })),
      
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, reminder]
      })),

      // --- GÜNCELLEME FONKSİYONLARI ---
      
      updateJobStatus: (jobId, status) => set((state) => ({
        jobs: state.jobs.map((j) => j.id === jobId ? { ...j, status } : j)
      })),

      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map((c) => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),

      updateMechanic: (id, updates) => set((state) => ({
        mechanics: state.mechanics.map((m) => 
          m.id === id ? { ...m, ...updates } : m
        )
      })),

      // --- YENİ EKLENENLER ---
      
      removeCar: (carId) => set((state) => ({
        cars: state.cars.filter((c) => c.id !== carId),
        // Araca bağlı işleri ve hatırlatıcıları da temizlemek iyi olur ama MVP için zorunlu değil, 
        // ancak tutarlılık için filtreleyelim:
        jobs: state.jobs.filter((j) => j.carId !== carId),
        reminders: state.reminders.filter((r) => r.carId !== carId)
      })),

      toggleReminder: (reminderId) => set((state) => ({
        reminders: state.reminders.map((r) => 
          r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r
        )
      })),

      rateJob: (jobId, rating, comment) => set((state) => {
        // 1. İşi güncelle
        const updatedJobs = state.jobs.map((j) => 
          j.id === jobId 
            ? { ...j, isRated: true, rating, reviewComment: comment } 
            : j
        );
        
        // 2. Tamirciyi bul ve puanını güncelle
        const job = state.jobs.find((j) => j.id === jobId);
        let updatedMechanics = state.mechanics;
        
        if (job) {
          updatedMechanics = state.mechanics.map((m) => {
            if (m.id === job.mechanicId) {
              const newReviewCount = m.reviewCount + 1;
              // Basit ortalama hesaplama: ((EskiOrt * EskiSayı) + YeniPuan) / YeniSayı
              const newRating = ((m.rating * m.reviewCount) + rating) / newReviewCount;
              return {
                ...m,
                reviewCount: newReviewCount,
                rating: parseFloat(newRating.toFixed(1))
              };
            }
            return m;
          });
        }

        return {
          jobs: updatedJobs,
          mechanics: updatedMechanics
        };
      }),

    }),
    {
      name: 'tamircim-storage-v2', // Versiyon değiştirdiğinde cache temizlenir
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);