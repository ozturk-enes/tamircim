import { Car, Customer, Mechanic, MechanicSpecialty, Reminder, ServiceRecord } from '../types/schema';

export const specialList: MechanicSpecialty[] = [
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
];

// Mechanics
export const mechanics: Mechanic[] = [
  {
    id: 'm1',
    role: 'mechanic',
    email: 'ali.usta@example.com',
    name: 'Ali Yılmaz',
    phone: '0532 111 2233',
    createdAt: '2023-01-01',
    address: 'Atatürk Sanayi Sitesi, 1. Kısım, Maslak, İstanbul',
    rating: 4.8,
    reviewCount: 120,
    isOnline: true,
    workingHours: '08:00 - 19:00',
    priceRange: '₺₺',
    specialties: ['Motor', 'Periyodik Bakım', 'Fren'],
    location: { latitude: 41.1122, longitude: 29.0234 },
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'm2',
    role: 'mechanic',
    email: 'veli.elektrik@example.com',
    name: 'Veli Demir',
    phone: '0533 444 5566',
    createdAt: '2023-02-15',
    address: 'Bostancı Oto Sanayi, D Blok No:12, Kadıköy, İstanbul',
    rating: 4.5,
    reviewCount: 85,
    isOnline: false,
    workingHours: '09:00 - 18:00',
    priceRange: '₺',
    specialties: ['Elektrik', 'Klima', 'Akü'],
    location: { latitude: 40.9567, longitude: 29.1023 },
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 'm3',
    role: 'mechanic',
    email: 'ayse.kaporta@example.com',
    name: 'Ayşe Çelik',
    phone: '0535 777 8899',
    createdAt: '2023-05-20',
    address: 'İkitelli OSB, Dolapdere Sanayi Sitesi, Başakşehir, İstanbul',
    rating: 4.9,
    reviewCount: 210,
    isOnline: true,
    workingHours: '08:30 - 18:30',
    priceRange: '₺₺₺',
    specialties: ['Kaporta', 'Boya'],
    location: { latitude: 41.0765, longitude: 28.7981 },
    profileImage: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 'm4',
    role: 'mechanic',
    email: 'mehmet.lastik@example.com',
    name: 'Mehmet Öz',
    phone: '0542 333 2211',
    createdAt: '2023-08-10',
    address: 'Ümraniye Sanayi Sitesi, C Blok, Ümraniye, İstanbul',
    rating: 4.6,
    reviewCount: 55,
    isOnline: true,
    workingHours: '09:00 - 20:00',
    priceRange: '₺₺',
    specialties: ['Lastik', 'Jant', 'Rot Balans'],
    location: { latitude: 41.0123, longitude: 29.1567 },
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

// Customer
export const customers: Customer[] = [
  {
    id: 'u1',
    role: 'customer',
    email: 'enes.ozturk@example.com',
    name: 'Enes Öztürk',
    phone: '0555 999 8877',
    createdAt: '2024-01-01',
    address: 'Şişli, Merkez Mh., İstanbul',
    ownedCarIds: ['c1', 'c2', 'c3'],
    profileImage: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
  {
    id: 'u2',
    role: 'customer',
    email: 'zeynep.kaya@example.com',
    name: 'Zeynep Kaya',
    phone: '0544 222 3344',
    createdAt: '2024-03-15',
    address: 'Kadıköy, Moda, İstanbul',
    ownedCarIds: ['c4'],
    profileImage: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
];

// Cars
export const cars: Car[] = [
  // Enes'in araçları
  {
    id: 'c1',
    ownerId: 'u1',
    brand: 'Toyota',
    model: 'Corolla Hybrid',
    year: 2021,
    plate: '34 TC 1023',
    color: 'İnci Beyazı',
    fuelType: 'Hybrid',
    currentMileage: 45000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'c2',
    ownerId: 'u1',
    brand: 'Honda',
    model: 'Civic RS',
    year: 2019,
    plate: '06 ANK 456',
    color: 'Kozmik Siyah',
    fuelType: 'Gasoline',
    currentMileage: 82000,
    image: 'https://images.unsplash.com/photo-1606152421811-aa9116366124?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'c3',
    ownerId: 'u1',
    brand: 'Fiat',
    model: 'Egea Cross',
    year: 2022,
    plate: '34 FGE 789',
    color: 'Kurşun Gri',
    fuelType: 'Diesel',
    currentMileage: 25000,
    image: 'https://images.unsplash.com/photo-1629896841525-2c8c36643666?q=80&w=1000&auto=format&fit=crop', // Generic car image
  },
  // Zeynep'in aracı
  {
    id: 'c4',
    ownerId: 'u2',
    brand: 'Volkswagen',
    model: 'Golf 8',
    year: 2023,
    plate: '35 IZM 35',
    color: 'Mercan Kırmızı',
    fuelType: 'Gasoline',
    currentMileage: 12000,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop',
  },
];

// Service Records
export const serviceRecords: ServiceRecord[] = [
  // c1 (Toyota Corolla) - Ali Usta & Mehmet Öz
  {
    id: 's1',
    carId: 'c1',
    mechanicId: 'm1',
    mechanicName: 'Ali Yılmaz',
    date: '2023-11-15',
    title: 'Periyodik Bakım (40.000)',
    description: 'Motor yağı (0W-20), yağ filtresi, hava filtresi ve polen filtresi değişti. Genel kontroller yapıldı.',
    cost: 4500,
    status: 'completed',
  },
  {
    id: 's2',
    carId: 'c1',
    mechanicId: 'm1',
    mechanicName: 'Ali Yılmaz',
    date: '2023-05-10',
    title: 'Fren Sistemi Kontrolü',
    description: 'Ön fren balataları kontrol edildi, temizlendi. Değişime gerek görülmedi.',
    cost: 500,
    status: 'completed',
  },
  // c2 (Honda Civic) - Veli Demir & Mehmet Öz
  {
    id: 's3',
    carId: 'c2',
    mechanicId: 'm2',
    mechanicName: 'Veli Demir',
    date: '2024-01-20',
    title: 'Akü Değişimi',
    description: 'Eski akü ömrünü tamamlamıştı. 60Ah Mutlu Akü takıldı.',
    cost: 3200,
    status: 'completed',
  },
  {
    id: 's4',
    carId: 'c2',
    mechanicId: 'm2',
    mechanicName: 'Veli Demir',
    date: '2023-08-20',
    title: 'Klima Gazı Dolumu',
    description: 'Klima soğutma performansı düşüktü. Kaçak testi yapıldı, gaz basıldı.',
    cost: 1500,
    status: 'completed',
  },
  {
    id: 's5',
    carId: 'c2',
    mechanicId: 'm4',
    mechanicName: 'Mehmet Öz',
    date: '2023-11-01',
    title: 'Kış Lastiği Değişimi',
    description: 'Yazlık lastikler söküldü, kışlıklar takıldı. Balans ayarı yapıldı.',
    cost: 800,
    status: 'completed',
  },
  // c3 (Fiat Egea) - Ayşe Çelik
  {
    id: 's6',
    carId: 'c3',
    mechanicId: 'm3',
    mechanicName: 'Ayşe Çelik',
    date: '2023-12-05',
    title: 'Tampon Boyama',
    description: 'Arka tamponda sürtme kaynaklı çizikler lokal boya ile giderildi.',
    cost: 2500,
    status: 'completed',
  },
  // c4 (Golf)
  {
    id: 's7',
    carId: 'c4',
    mechanicId: 'm1',
    mechanicName: 'Ali Yılmaz',
    date: '2024-02-28',
    title: 'Yıllık Bakım (15.000)',
    description: 'İlk yıl bakımı yapıldı. Yağ ve filtreler orijinal parça ile değişti.',
    cost: 6000,
    status: 'completed',
  },
];

// Reminders
export const reminders: Reminder[] = [
  // c1 Reminders
  {
    id: 'r1',
    carId: 'c1',
    title: 'TÜVTÜRK Muayene',
    dueDate: '2024-06-15',
    isCompleted: false,
  },
  {
    id: 'r2',
    carId: 'c1',
    title: 'Trafik Sigortası',
    dueDate: '2024-05-20',
    isCompleted: false,
  },
  // c2 Reminders
  {
    id: 'r3',
    carId: 'c2',
    title: 'Periyodik Bakım',
    dueMileage: 90000,
    isCompleted: false,
  },
  {
    id: 'r4',
    carId: 'c2',
    title: 'Kasko Yenileme',
    dueDate: '2024-09-01',
    isCompleted: false,
  },
  // c3 Reminders
  {
    id: 'r5',
    carId: 'c3',
    title: 'Lastik Değişimi (Yaz)',
    dueDate: '2024-04-15',
    isCompleted: false,
  },
];

export const mockMessages = [
  {
    id: 'msg1',
    customerName: 'Ahmet Yılmaz',
    time: '10:30',
    carPlate: '34 ABC 123',
    message: 'Aracımın frenlerinden ses geliyor, ne zaman bakabilirsiniz?',
    isRead: false,
  },
  {
    id: 'msg2',
    customerName: 'Mehmet Demir',
    time: 'Dün',
    carPlate: '06 DEF 456',
    message: 'Periyodik bakım için fiyat alabilir miyim?',
    isRead: true,
  },
];

export const mockOffers = [
  {
    id: 'off1',
    customerName: 'Ayşe Kaya',
    time: '1 saat önce',
    carInfo: 'Toyota Corolla 2020',
    problem: 'Motor arıza lambası yanıyor',
    offeredPrice: '₺1500 - ₺2000',
    location: 'Şişli, İstanbul',
    distance: '2.5 km',
  },
  {
    id: 'off2',
    customerName: 'Fatma Çelik',
    time: '2 saat önce',
    carInfo: 'Honda Civic 2018',
    problem: 'Klima soğutmuyor',
    offeredPrice: '₺1000',
    location: 'Beşiktaş, İstanbul',
    distance: '4.1 km',
  },
];
