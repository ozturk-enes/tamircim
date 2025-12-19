export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImage?: string;
  createdAt: string;
  role: 'customer' | 'mechanic';
}

export interface Customer extends UserBase {
  role: 'customer';
  address?: string;
  ownedCarIds: string[];
}

export type MechanicSpecialty = 'Motor' | 'Fren' | 'Elektrik' | 'Kaporta' | 'Lastik' | 'Klima' | 'Periyodik Bakım' | 'Akü' | 'Boya' | 'Jant' | 'Rot Balans';

export interface Mechanic extends UserBase {
  role: 'mechanic';
  address: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  workingHours: string;
  priceRange?: string;
  specialties: MechanicSpecialty[];
  location: { latitude: number; longitude: number; };
}

export interface Car {
  id: string;
  ownerId: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
  fuelType?: 'Gasoline' | 'Diesel' | 'LPG' | 'Electric' | 'Hybrid';
  currentMileage?: number;
  image?: any; // require() paths için any veya string
}

export interface ServiceRecord {
  id: string;
  carId: string;
  mechanicId: string;
  mechanicName: string;
  date: string;
  title: string; // Eskiden title olarak geçiyordu
  description: string;
  cost: number;
  workDetails?: string;
  completedAt?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
}

export interface Reminder {
  id: string;
  carId: string;
  title: string;
  dueDate?: string;
  dueMileage?: number;
  isCompleted: boolean;
}
