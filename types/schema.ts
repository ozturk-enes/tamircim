export type UserRole = 'customer' | 'mechanic';
export type JobStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

// Kategori listesi (UI'da kullanılacak sabitler)
export const SERVICE_CATEGORIES = [
  'Motor',
  'Fren',
  'Elektrik',
  'Kaporta',
  'Lastik',
  'Klima',
  'Periyodik Bakım',
  'Akü',
  'Boya',
  'Jant',
  'Rot Balans'
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// 1. KULLANICI TEMEL YAPISI
export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  createdAt: string; // ISO String
  role: UserRole;
  password?: string; // MVP'de mock login için gerekli
  pushToken?: string; 
}

// 2. MÜŞTERİ
export interface Customer extends UserBase {
  role: 'customer';
  address: string;
  // İleride müşteri konumu gerekirse buraya eklenebilir
}

// 3. TAMİRCİ
export interface Mechanic extends UserBase {
  role: 'mechanic';
  address: string;
  location: { 
    latitude: number; 
    longitude: number; 
  };
  // String array yaptık çünkü "Diğer" seçeneği ile custom veri gelebilir
  specialties: string[]; 
  isOnline: boolean;
  rating: number;      
  reviewCount: number; 
  workingHours: string;
  experienceYears: number; // Added field
  completedJobs: number;   // Added field
  bio?: string;        
  priceRange?: '₺' | '₺₺' | '₺₺₺'; 
}

// 4. ARAÇ (CAR)
export interface Car {
  id: string;
  ownerId: string; 
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  fuelType: 'Gasoline' | 'Diesel' | 'LPG' | 'Electric' | 'Hybrid';
  currentMileage?: number; 
  image?: string; 
  photoUrl?: string; 
  photoMetadata?: {
    size: number;
    type: string;
    lastModified?: number;
  };
}

// 5. İŞ / RANDEVU
export interface Job {
  id: string;
  customerId: string;
  mechanicId: string;
  carId: string;
  
  // İş Detayları
  // Burayı da string yaptık çünkü custom kategori olabilir
  categoryId: string; 
  title: string;               
  customerNote?: string;       
  
  // Durum Yönetimi
  status: JobStatus;
  
  // Zamanlamalar
  createdAt: string;       
  updatedAt: string;       
  appointmentDate: string; 
  completedAt?: string;    
  
  // Tamirci Tarafından Girilenler
  cost?: number;           
  workDescription?: string; 
  
  // Değerlendirme
  isRated: boolean;        
  rating?: number;         
  reviewComment?: string;  
}

// 6. HATIRLATICI
export interface Reminder {
  id: string;
  carId: string;     
  userId: string;    
  type: 'Maintenance' | 'Insurance' | 'Inspection' | 'Tire' | 'Other';
  title: string;
  dueDate?: string;  
  dueMileage?: number; 
  isCompleted: boolean;
}
