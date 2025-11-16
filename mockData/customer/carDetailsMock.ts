import { ApiResponse, Car, CarPart, Reminder, RepairHistory } from '../types';

// Extended car details interface for car details page
export interface CarDetailsData extends Car {
  repairHistory: RepairHistory[];
  changedParts: CarPart[];
  reminders: Reminder[];
  messages: CarMessage[];
  quickActions: CarQuickAction[];
  statistics: CarStatistics;
}

export interface CarMessage {
  id: string;
  sender: string;
  message: string;
  date: string;
  type: 'reminder' | 'system' | 'service' | 'mechanic';
  isRead?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface CarQuickAction {
  id: string;
  title: string;
  icon: string;
  action: string;
  color: string;
}

export interface CarStatistics {
  totalRepairs: number;
  totalCost: number;
  averageCost: number;
  lastServiceDays: number;
  nextServiceDays: number;
  partsChanged: number;
  activeReminders: number;
}

// Mock car details data
export const mockCarDetailsData: CarDetailsData = {
  id: '1',
  customerId: '1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plate: '34 ABC 123',
  color: 'Beyaz',
  fuelType: 'Benzin',
  mileage: 45000,
  lastService: '2024-01-15',
  nextService: '2024-07-15',
  image: '🚗',
  vin: 'JTDKN3DU5L0123456',
  engineNumber: 'ABC123456',
  registrationDate: '2020-03-15',
  specifications: {
    engine: '1.6L 4 Silindir',
    power: '132 HP',
    transmission: 'CVT Otomatik',
    fuelCapacity: '50 L',
    fuelConsumption: '6.2 L/100km',
    maxSpeed: '180 km/h',
    acceleration: '10.2 sn (0-100)',
    weight: '1320 kg',
    dimensions: '4630x1780x1435 mm',
    driveType: 'Önden Çekiş',
    wheelSize: '205/55 R16',
    emissionStandard: 'Euro 6'
  },
  insuranceInfo: {
    company: 'Axa Sigorta',
    policyNumber: 'AXA-2024-123456',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    type: 'Kasko',
    coverage: 'Tam Kasko'
  },
  registrationInfo: {
    registrationNumber: '34ABC123',
    registrationDate: '2020-03-15',
    inspectionDate: '2024-03-15',
    nextInspectionDate: '2025-03-15',
    registrationCity: 'İstanbul'
  },
  repairHistory: [
    {
      id: '1',
      carId: '1',
      date: '2024-01-15',
      type: 'Periyodik Bakım',
      mechanicId: '1',
      mechanicName: 'Mehmet Usta',
      cost: 450,
      description: 'Motor yağı değişimi, filtre değişimi, genel kontrol',
      parts: ['Motor Yağı', 'Yağ Filtresi', 'Hava Filtresi'],
      mileage: 45000,
      workDuration: 2,
      warranty: 6,
      status: 'completed',
      notes: 'Araç genel durumu iyi, bir sonraki bakım 6 ay sonra öneriliyor.'
    },
    {
      id: '2',
      carId: '1',
      date: '2023-10-20',
      type: 'Fren Sistemi',
      mechanicId: '2',
      mechanicName: 'Ali Tamirci',
      cost: 320,
      description: 'Ön fren balata değişimi',
      parts: ['Fren Balata Takımı'],
      mileage: 42000,
      workDuration: 1.5,
      warranty: 12,
      status: 'completed',
      notes: 'Fren diskleri kontrol edildi, iyi durumda.'
    },
    {
      id: '3',
      carId: '1',
      date: '2023-07-10',
      type: 'Lastik Değişimi',
      mechanicId: '3',
      mechanicName: 'Veli Oto',
      cost: 800,
      description: '4 adet lastik değişimi',
      parts: ['Lastik x4'],
      mileage: 40000,
      workDuration: 1,
      warranty: 24,
      status: 'completed',
      notes: 'Yaz lastiği takıldı, balans ayarı yapıldı.'
    },
    {
      id: '4',
      carId: '1',
      date: '2023-04-05',
      type: 'Klima Servisi',
      mechanicId: '1',
      mechanicName: 'Mehmet Usta',
      cost: 250,
      description: 'Klima gazı dolumu ve sistem temizliği',
      parts: ['Klima Gazı', 'Klima Filtresi'],
      mileage: 38000,
      workDuration: 1,
      warranty: 6,
      status: 'completed',
      notes: 'Klima sistemi test edildi, soğutma performansı normal.'
    }
  ],
  changedParts: [
    {
      id: '1',
      carId: '1',
      name: 'Motor Yağı',
      changeDate: '2024-01-15',
      nextChangeDate: '2024-07-15',
      mileage: 45000,
      nextChangeMileage: 50000,
      status: 'good',
      brand: 'Castrol',
      partNumber: 'GTX-5W30',
      warranty: 6,
      cost: 120
    },
    {
      id: '2',
      carId: '1',
      name: 'Fren Balata',
      changeDate: '2023-10-20',
      nextChangeDate: '2024-10-20',
      mileage: 42000,
      nextChangeMileage: 60000,
      status: 'good',
      brand: 'Bosch',
      partNumber: 'BP1234',
      warranty: 12,
      cost: 180
    },
    {
      id: '3',
      carId: '1',
      name: 'Lastik',
      changeDate: '2023-07-10',
      nextChangeDate: '2025-07-10',
      mileage: 40000,
      nextChangeMileage: 80000,
      status: 'good',
      brand: 'Michelin',
      partNumber: 'ENERGY-205/55R16',
      warranty: 24,
      cost: 800
    },
    {
      id: '4',
      carId: '1',
      name: 'Akü',
      changeDate: '2022-05-15',
      nextChangeDate: '2025-05-15',
      mileage: 35000,
      nextChangeMileage: 70000,
      status: 'warning',
      brand: 'Varta',
      partNumber: 'BLUE-60AH',
      warranty: 36,
      cost: 350
    }
  ],
  reminders: [
    {
      id: '1',
      carId: '1',
      title: 'Periyodik Bakım',
      dueDate: '2024-07-15',
      dueMileage: 50000,
      type: 'service',
      priority: 'medium',
      description: 'Motor yağı ve filtre değişimi zamanı',
      isCompleted: false,
      createdDate: '2024-01-15',
      reminderDays: 7
    },
    {
      id: '2',
      carId: '1',
      title: 'Muayene Yenileme',
      dueDate: '2024-12-20',
      dueMileage: null,
      type: 'inspection',
      priority: 'high',
      description: 'Araç muayene tarihi yaklaşıyor',
      isCompleted: false,
      createdDate: '2024-01-01',
      reminderDays: 30
    },
    {
      id: '3',
      carId: '1',
      title: 'Kasko Yenileme',
      dueDate: '2024-08-10',
      dueMileage: null,
      type: 'insurance',
      priority: 'high',
      description: 'Kasko poliçesi yenileme zamanı',
      isCompleted: false,
      createdDate: '2024-01-01',
      reminderDays: 30
    },
    {
      id: '4',
      carId: '1',
      title: 'Klima Gazı Kontrolü',
      dueDate: '2024-06-01',
      dueMileage: 48000,
      type: 'maintenance',
      priority: 'low',
      description: 'Yaz öncesi klima sistemi kontrolü',
      isCompleted: false,
      createdDate: '2024-04-01',
      reminderDays: 7
    }
  ],
  messages: [
    {
      id: '1',
      sender: 'Mehmet Usta',
      message: 'Aracınızın periyodik bakım zamanı yaklaşıyor. Randevu almak için bize ulaşabilirsiniz.',
      date: '2024-01-20',
      type: 'reminder',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '2',
      sender: 'Sistem',
      message: 'Muayene tarihiniz 6 ay sonra sona eriyor. Unutmayın!',
      date: '2024-01-18',
      type: 'system',
      isRead: true,
      priority: 'high'
    },
    {
      id: '3',
      sender: 'Ali Tamirci',
      message: 'Fren balata değişimi başarıyla tamamlandı. İyi yolculuklar!',
      date: '2023-10-20',
      type: 'service',
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      sender: 'Veli Oto',
      message: 'Lastik değişimi tamamlandı. Balans ayarı da yapıldı.',
      date: '2023-07-10',
      type: 'service',
      isRead: true,
      priority: 'low'
    }
  ],
  quickActions: [
    {
      id: '1',
      title: 'Tamirci Bul',
      icon: 'construct',
      action: 'find_mechanic',
      color: '#007bff'
    },
    {
      id: '2',
      title: 'Randevu Al',
      icon: 'calendar',
      action: 'book_appointment',
      color: '#28a745'
    },
    {
      id: '3',
      title: 'Geçmiş Görüntüle',
      icon: 'time',
      action: 'view_history',
      color: '#ffc107'
    },
    {
      id: '4',
      title: 'Mesaj Gönder',
      icon: 'chatbubbles',
      action: 'send_message',
      color: '#17a2b8'
    }
  ],
  statistics: {
    totalRepairs: 4,
    totalCost: 1820,
    averageCost: 455,
    lastServiceDays: 15,
    nextServiceDays: 165,
    partsChanged: 4,
    activeReminders: 4
  }
};

// API response functions
export const getCarDetailsById = (carId: string): ApiResponse<CarDetailsData> => {
  // In a real app, this would fetch from API
  if (carId === '1') {
    return {
      success: true,
      data: mockCarDetailsData,
      message: 'Car details retrieved successfully',
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    success: false,
    data: null,
    message: 'Car not found',
    timestamp: new Date().toISOString()
  };
};

export const getCarRepairHistory = (carId: string): ApiResponse<RepairHistory[]> => {
  return {
    success: true,
    data: mockCarDetailsData.repairHistory,
    message: 'Repair history retrieved successfully',
    timestamp: new Date().toISOString()
  };
};

export const getCarReminders = (carId: string): ApiResponse<Reminder[]> => {
  return {
    success: true,
    data: mockCarDetailsData.reminders,
    message: 'Car reminders retrieved successfully',
    timestamp: new Date().toISOString()
  };
};

export const getCarMessages = (carId: string): ApiResponse<CarMessage[]> => {
  return {
    success: true,
    data: mockCarDetailsData.messages,
    message: 'Car messages retrieved successfully',
    timestamp: new Date().toISOString()
  };
};

// Helper functions
export const getActiveRemindersCount = (carId: string): number => {
  return mockCarDetailsData.reminders.filter(reminder => !reminder.isCompleted).length;
};

export const getUnreadMessagesCount = (carId: string): number => {
  return mockCarDetailsData.messages.filter(message => !message.isRead).length;
};

export const getNextServiceInfo = (carId: string) => {
  const car = mockCarDetailsData;
  const nextServiceDate = new Date(car.nextService);
  const today = new Date();
  const daysUntilService = Math.ceil((nextServiceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    date: car.nextService,
    daysRemaining: daysUntilService,
    isOverdue: daysUntilService < 0
  };
};

export const getPartStatusColor = (status: string): string => {
  switch (status) {
    case 'good':
      return '#28a745';
    case 'warning':
      return '#ffc107';
    case 'critical':
      return '#dc3545';
    default:
      return '#6c757d';
  }
};

export const getReminderPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return '#dc3545';
    case 'medium':
      return '#ffc107';
    case 'low':
      return '#28a745';
    default:
      return '#6c757d';
  }
};