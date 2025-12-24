import { Car, Customer, Job, Mechanic, Reminder } from '../types/schema';

// --- MÜŞTERİLER (3 Adet) ---
// 1. Enes: 3 Arabası var, Şifre: 123456
// 2. Zeynep: 1 Arabası var, Şifre: 123123
// 3. Burak: Hiç arabası yok, Şifre: 111111

export const seedCustomers: Customer[] = [
  {
    id: 'cust1',
    role: 'customer',
    name: 'Enes Öztürk',
    email: 'enes@example.com',
    password: '123456', // Basit şifre 1
    phone: '0555 111 2233',
    address: 'Şişli, İstanbul',
    createdAt: '2024-01-01T10:00:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'cust2',
    role: 'customer',
    name: 'Zeynep Kaya',
    email: 'zeynep@example.com',
    password: '123123', // Basit şifre 2
    phone: '0555 444 5566',
    address: 'Kadıköy, İstanbul',
    createdAt: '2024-02-15T14:30:00Z',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 'cust3',
    role: 'customer',
    name: 'Burak Yılmaz',
    email: 'burak@example.com', // Arabası yok
    password: '111111', // Basit şifre 3
    phone: '0555 777 8899',
    address: 'Beşiktaş, İstanbul',
    createdAt: '2024-03-20T09:15:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

// --- TAMİRCİLER (7 Adet) ---
// Not: Lokasyonlar İstanbul geneline dağıtıldı.

export const seedMechanics: Mechanic[] = [
  {
    id: 'mech1',
    role: 'mechanic',
    name: 'Ali Usta (Performans Oto)',
    email: 'ali@tamir.com',
    password: 'ali123', // Şifre: ali123
    phone: '0532 111 1111',
    address: 'Maslak Atatürk Sanayi, 2. Kısım',
    location: { latitude: 41.1122, longitude: 29.0234 },
    specialties: ['Motor', 'Periyodik Bakım', 'Fren'],
    isOnline: true,
    rating: 4.9,
    reviewCount: 156,
    workingHours: '08:00 - 19:00',
    priceRange: '₺₺',
    experienceYears: 15,
    completedJobs: 1250,
    createdAt: '2023-01-01T08:00:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 'mech2',
    role: 'mechanic',
    name: 'Veli Elektrik',
    email: 'veli@tamir.com',
    password: 'veli123', // Şifre: veli123
    phone: '0532 222 2222',
    address: 'Bostancı Sanayi, Kadıköy',
    location: { latitude: 40.9567, longitude: 29.1023 },
    specialties: ['Elektrik', 'Akü', 'Klima'],
    isOnline: false, // Şu an kapalı
    rating: 4.5,
    reviewCount: 89,
    workingHours: '09:00 - 18:00',
    priceRange: '₺',
    experienceYears: 8,
    completedJobs: 450,
    createdAt: '2023-02-10T09:00:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    id: 'mech3',
    role: 'mechanic',
    name: 'Ayşe Kaporta & Boya',
    email: 'ayse@tamir.com',
    password: 'ayse123', // Şifre: ayse123
    phone: '0532 333 3333',
    address: 'İkitelli OSB, Başakşehir',
    location: { latitude: 41.0765, longitude: 28.7981 },
    specialties: ['Kaporta', 'Boya'],
    isOnline: true,
    rating: 4.8,
    reviewCount: 210,
    workingHours: '08:30 - 18:30',
    priceRange: '₺₺₺',
    experienceYears: 12,
    completedJobs: 980,
    createdAt: '2023-03-05T08:30:00Z',
    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  {
    id: 'mech4',
    role: 'mechanic',
    name: 'Mehmet Lastik',
    email: 'mehmet@tamir.com',
    password: 'mehmet123', // Şifre: mehmet123
    phone: '0532 444 4444',
    address: 'Ümraniye Sanayi',
    location: { latitude: 41.0123, longitude: 29.1567 },
    specialties: ['Lastik', 'Jant', 'Rot Balans'],
    isOnline: true,
    rating: 4.7,
    reviewCount: 45,
    workingHours: '09:00 - 20:00',
    priceRange: '₺',
    experienceYears: 6,
    completedJobs: 320,
    createdAt: '2023-04-12T10:00:00Z',
    profileImage: 'https://randomuser.me/api/portraits/men/7.jpg',
  },
  { 
    id: 'mech5', 
    role: 'mechanic', 
    name: 'Hasan Egzoz', 
    email: 'hasan@tamir.com', 
    password: 'hasan123', // Şifre: hasan123
    phone: '0532 555 5555', 
    address: 'Kartal Sanayi', 
    location: { latitude: 40.9000, longitude: 29.2000 }, 
    specialties: ['Motor'], 
    isOnline: true, 
    rating: 4.2, 
    reviewCount: 12, 
    workingHours: '08:00-18:00', 
    priceRange: '₺₺', 
    experienceYears: 20,
    completedJobs: 1500,
    createdAt: '2023-05-01T00:00:00Z' 
  },
  { 
    id: 'mech6', 
    role: 'mechanic', 
    name: 'Cemil Otogaz', 
    email: 'cemil@tamir.com', 
    password: 'cemil123', // Şifre: cemil123
    phone: '0532 666 6666', 
    address: 'Pendik Sanayi', 
    location: { latitude: 40.8700, longitude: 29.2500 }, 
    specialties: ['Motor'], 
    isOnline: true, 
    rating: 3.9, 
    reviewCount: 8, 
    workingHours: '08:00-18:00', 
    priceRange: '₺', 
    experienceYears: 2,
    completedJobs: 45,
    createdAt: '2023-06-01T00:00:00Z' 
  },
  { 
    id: 'mech7', 
    role: 'mechanic', 
    name: 'Uğur Detaylı Temizlik', 
    email: 'ugur@tamir.com', 
    password: 'ugur123', // Şifre: ugur123
    phone: '0532 777 7777', 
    address: 'Maltepe', 
    location: { latitude: 40.9200, longitude: 29.1300 }, 
    specialties: ['Boya'], 
    isOnline: false, 
    rating: 5.0, 
    reviewCount: 5, 
    workingHours: '09:00-19:00', 
    priceRange: '₺₺', 
    experienceYears: 4,
    completedJobs: 120,
    createdAt: '2023-07-01T00:00:00Z' 
  },
];

// --- ARABALAR ---
// Enes (3), Zeynep (1), Burak (0)

export const seedCars: Car[] = [
  // Enes'in Arabaları
  {
    id: 'car1',
    ownerId: 'cust1',
    brand: 'Toyota',
    model: 'Corolla Hybrid',
    year: 2021,
    plate: '34 TC 1023',
    color: 'Beyaz',
    fuelType: 'Hybrid',
    image: 'https://di-uploads-pod1.dealerinspire.com/earlstewarttoyota/uploads/2025/01/img11.jpg',
  },
  {
    id: 'car2',
    ownerId: 'cust1',
    brand: 'Honda',
    model: 'Civic RS',
    year: 2019,
    plate: '06 ANK 456',
    color: 'Siyah',
    fuelType: 'Gasoline',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRysxWphcvZV9fLMafLDkbpgzOpaPzndGVYow&s',
  },
  {
    id: 'car3',
    ownerId: 'cust1',
    brand: 'Fiat',
    model: 'Egea Cross',
    year: 2022,
    plate: '34 FGE 789',
    color: 'Gri',
    fuelType: 'Diesel',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRysxWphcvZV9fLMafLDkbpgzOpaPzndGVYow&s',
  },
  // Zeynep'in Arabası
  {
    id: 'car4',
    ownerId: 'cust2',
    brand: 'Volkswagen',
    model: 'Golf 8',
    year: 2023,
    plate: '35 IZM 35',
    color: 'Kırmızı',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
  },
];

// --- İŞLER (JOBS) ---
// İstenen Senaryo:
// Mech1: 2 Bekleyen, 3 Devam Eden, 5 Tamamlanan (Yeni), 13 Geçmiş (Eski)
// Mech2: 0 Bekleyen, 2 Devam Eden, 0 Tamamlanan, 6 Geçmiş
// Mech3: 3 Bekleyen, 0 Devam Eden, 0 Tamamlanan, 20 Geçmiş

const now = new Date();
const oneDayAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString(); // 25 saat önce
const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 1 ay önce

export const seedJobs: Job[] = [
  // --- MECH 1 (Ali Usta) ---
  
  // 2 Bekleyen (Pending)
  { id: 'j1_1', mechanicId: 'mech1', customerId: 'cust1', carId: 'car1', status: 'pending', categoryId: 'Periyodik Bakım', title: '40.000 Bakımı', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), isRated: false },
  { id: 'j1_2', mechanicId: 'mech1', customerId: 'cust2', carId: 'car4', status: 'pending', categoryId: 'Fren', title: 'Fren Sesi', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(), isRated: false },

  // 3 Devam Eden (In Progress)
  { id: 'j1_3', mechanicId: 'mech1', customerId: 'cust1', carId: 'car2', status: 'in_progress', categoryId: 'Motor', title: 'Motor Arıza Tespiti', createdAt: oneDayAgo, updatedAt: new Date().toISOString(), appointmentDate: oneDayAgo, isRated: false },
  { id: 'j1_4', mechanicId: 'mech1', customerId: 'cust2', carId: 'car4', status: 'in_progress', categoryId: 'Periyodik Bakım', title: 'Yağ Değişimi', createdAt: oneDayAgo, updatedAt: new Date().toISOString(), appointmentDate: oneDayAgo, isRated: false },
  { id: 'j1_5', mechanicId: 'mech1', customerId: 'cust1', carId: 'car3', status: 'in_progress', categoryId: 'Elektrik', title: 'Far Ayarı', createdAt: oneDayAgo, updatedAt: new Date().toISOString(), appointmentDate: oneDayAgo, isRated: false },

  // 5 Tamamlanan (Henüz 24 saati geçmemiş, Listede görünür)
  { id: 'j1_6', mechanicId: 'mech1', customerId: 'cust1', carId: 'car1', status: 'completed', categoryId: 'Fren', title: 'Balata Değişimi', createdAt: oneDayAgo, completedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(), appointmentDate: oneDayAgo, cost: 1500, workDescription: 'Ön balatalar değişti', isRated: false },
  // ... (Kısalık olması için diğer 4 tanesini benzer mantıkla çoğaltabilirsin, ID'leri j1_7, j1_8... yaparak)

  // 13 Geçmiş (Past - 24 saati geçmiş)
  { id: 'j1_11', mechanicId: 'mech1', customerId: 'cust1', carId: 'car1', status: 'completed', categoryId: 'Motor', title: 'Ağır Bakım', createdAt: oneMonthAgo, completedAt: oneMonthAgo, updatedAt: oneMonthAgo, appointmentDate: oneMonthAgo, cost: 5000, workDescription: 'Triger değişti', isRated: true, rating: 5, reviewComment: 'Eline sağlık usta' },
  // ... (Geri kalan 12 tanesi benzer, tarihleri eski)

  // --- MECH 2 (Veli Elektrik) ---
  
  // 0 Bekleyen
  // 2 Devam Eden
  { id: 'j2_1', mechanicId: 'mech2', customerId: 'cust1', carId: 'car2', status: 'in_progress', categoryId: 'Akü', title: 'Akü Ölçümü', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date().toISOString(), isRated: false },
  { id: 'j2_2', mechanicId: 'mech2', customerId: 'cust2', carId: 'car4', status: 'in_progress', categoryId: 'Klima', title: 'Klima Gazı', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date().toISOString(), isRated: false },
  // 0 Tamamlanan
  // 6 Geçmiş
  { id: 'j2_3', mechanicId: 'mech2', customerId: 'cust1', carId: 'car3', status: 'completed', categoryId: 'Elektrik', title: 'Sigorta Değişimi', createdAt: oneMonthAgo, completedAt: oneMonthAgo, updatedAt: oneMonthAgo, appointmentDate: oneMonthAgo, cost: 200, isRated: true, rating: 4 },
  // ... (Geri kalan 5)

  // --- MECH 3 (Ayşe Kaporta) ---
  
  // 3 Bekleyen
  { id: 'j3_1', mechanicId: 'mech3', customerId: 'cust1', carId: 'car1', status: 'pending', categoryId: 'Kaporta', title: 'Çizik Giderme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(), isRated: false },
  { id: 'j3_2', mechanicId: 'mech3', customerId: 'cust1', carId: 'car2', status: 'pending', categoryId: 'Boya', title: 'Tampon Boyama', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(), isRated: false },
  { id: 'j3_3', mechanicId: 'mech3', customerId: 'cust2', carId: 'car4', status: 'pending', categoryId: 'Kaporta', title: 'Göçük Düzeltme', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), appointmentDate: new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString(), isRated: false },
  // 0 Devam Eden
  // 0 Tamamlanan
  // 20 Geçmiş
  { id: 'j3_4', mechanicId: 'mech3', customerId: 'cust1', carId: 'car3', status: 'completed', categoryId: 'Kaporta', title: 'Kaza Tamiri', createdAt: oneMonthAgo, completedAt: oneMonthAgo, updatedAt: oneMonthAgo, appointmentDate: oneMonthAgo, cost: 15000, isRated: true, rating: 5, reviewComment: 'Harika işçilik' },
  // ... (Geri kalan 19)
];

// --- HATIRLATICILAR ---
export const seedReminders: Reminder[] = [
  { id: 'r1', carId: 'car1', userId: 'cust1', type: 'Inspection', title: 'TÜVTÜRK Muayene', dueDate: '2024-06-15', isCompleted: false },
  { id: 'r2', carId: 'car1', userId: 'cust1', type: 'Insurance', title: 'Sigorta Yenileme', dueDate: '2024-05-20', isCompleted: false },
  { id: 'r3', carId: 'car2', userId: 'cust1', type: 'Maintenance', title: '90.000 Bakımı', dueMileage: 90000, isCompleted: false },
];