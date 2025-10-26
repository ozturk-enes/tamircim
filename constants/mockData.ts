// Mock data for tamircim app

export interface Customer {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar?: string;
  cars: Car[];
}

export interface Mechanic {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  priceRange: string;
  workingHours: string;
  isOnline: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  image?: string;
}

export interface Job {
  id: string;
  customerId: string;
  mechanicId: string;
  carId: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected';
  createdAt: string;
  estimatedPrice: number;
  actualPrice?: number;
  completedAt?: string;
  customerName?: string;
  mechanicName?: string;
  carInfo?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderName: string;
  senderType: 'customer' | 'mechanic';
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'musteri@test.com',
    password: '123456',
    name: 'Ahmet Yılmaz',
    phone: '+90 555 123 4567',
    avatar: require('../assets/images/favicon.png'),
    cars: [
      {
        id: '1',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        plate: '34 ABC 123',
        color: 'Beyaz',
        image: require('../assets/images/favicon.png')
      },
      {
        id: '2',
        brand: 'BMW',
        model: '320i',
        year: 2019,
        plate: '34 XYZ 789',
        color: 'Siyah',
        image: require('../assets/images/favicon.png')
      }
    ]
  },
  {
    id: '2',
    email: 'ali@test.com',
    password: '123456',
    name: 'Ali Kaya',
    phone: '+90 555 234 5678',
    avatar: require('../assets/images/favicon.png'),
    cars: [
      {
        id: '3',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2021,
        plate: '06 DEF 456',
        color: 'Kırmızı',
        image: require('../assets/images/favicon.png')
      }
    ]
  }
];

export const mockMechanics: Mechanic[] = [
  {
    id: '1',
    email: 'tamirci@test.com',
    password: '123456',
    name: 'Mehmet Demir',
    phone: '+90 555 987 6543',
    avatar: require('../assets/images/favicon.png'),
    specialties: ['Motor', 'Fren', 'Elektrik'],
    rating: 4.8,
    reviewCount: 127,
    priceRange: '200-800 TL',
    workingHours: '08:00 - 18:00',
    isOnline: true,
    location: {
      latitude: 41.0082,
      longitude: 28.9784,
      address: 'Kadıköy, İstanbul'
    }
  },
  {
    id: '2',
    email: 'hasan@test.com',
    password: '123456',
    name: 'Hasan Özkan',
    phone: '+90 555 876 5432',
    avatar: require('../assets/images/favicon.png'),
    specialties: ['Kaportaj', 'Boya', 'Cam'],
    rating: 4.6,
    reviewCount: 89,
    priceRange: '300-1200 TL',
    workingHours: '09:00 - 17:00',
    isOnline: false,
    location: {
      latitude: 41.0122,
      longitude: 28.9744,
      address: 'Beşiktaş, İstanbul'
    }
  },
  {
    id: '3',
    email: 'emre@test.com',
    password: '123456',
    name: 'Emre Şahin',
    phone: '+90 555 765 4321',
    avatar: require('../assets/images/favicon.png'),
    specialties: ['Klima', 'Elektrik', 'Elektronik'],
    rating: 4.9,
    reviewCount: 203,
    priceRange: '150-600 TL',
    workingHours: '07:00 - 19:00',
    isOnline: true,
    location: {
      latitude: 41.0142,
      longitude: 28.9804,
      address: 'Şişli, İstanbul'
    }
  }
];

export const mockJobs: Job[] = [
  {
    id: '1',
    customerId: '1',
    mechanicId: '1',
    carId: '1',
    title: 'Fren Balata Değişimi',
    description: 'Ön fren balataları aşınmış, değiştirilmesi gerekiyor.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedPrice: 500,
    customerName: 'Ahmet Yılmaz',
    mechanicName: 'Mehmet Demir',
    carInfo: 'Toyota Corolla 2020'
  },
  {
    id: '2',
    customerId: '2',
    mechanicId: '2',
    carId: '3',
    title: 'Kaportaj Tamiri',
    description: 'Sol arka kapıda çizik ve ezik var.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    estimatedPrice: 800,
    customerName: 'Ali Kaya',
    mechanicName: 'Hasan Özkan',
    carInfo: 'Volkswagen Golf 2021'
  },
  {
    id: '3',
    customerId: '1',
    mechanicId: '3',
    carId: '2',
    title: 'Klima Servisi',
    description: 'Klima soğutmuyor, gaz dolumu gerekebilir.',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    estimatedPrice: 300,
    actualPrice: 250,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    customerName: 'Ahmet Yılmaz',
    mechanicName: 'Emre Şahin',
    carInfo: 'BMW 320i 2019'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '1',
    content: 'Merhaba, fren balata değişimi için ne zaman müsaitsiniz?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    senderName: 'Ahmet Yılmaz',
    senderType: 'customer'
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '1',
    content: 'Yarın saat 14:00\'da müsaitim. Uygun mu?',
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    isRead: true,
    senderName: 'Mehmet Demir',
    senderType: 'mechanic'
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '2',
    content: 'Kaportaj tamiri için fiyat teklifi alabilir miyim?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
    senderName: 'Ali Kaya',
    senderType: 'customer'
  }
];

export const mockUsers = {
  customers: mockCustomers,
  mechanics: mockMechanics
};

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getMechanicById = (id: string): Mechanic | undefined => {
  return mockMechanics.find(mechanic => mechanic.id === id);
};

export const getJobsByCustomerId = (customerId: string): Job[] => {
  return mockJobs.filter(job => job.customerId === customerId);
};

export const getJobsByMechanicId = (mechanicId: string): Job[] => {
  return mockJobs.filter(job => job.mechanicId === mechanicId);
};

export const getMessagesBetweenUsers = (userId1: string, userId2: string): Message[] => {
  return mockMessages.filter(message => 
    (message.senderId === userId1 && message.receiverId === userId2) ||
    (message.senderId === userId2 && message.receiverId === userId1)
  );
};