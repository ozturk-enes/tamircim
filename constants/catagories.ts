import { ServiceCategory } from '../types/schema';

export const CATEGORIES: { id: ServiceCategory; label: string; icon: string }[] = [
  { id: 'Motor', label: 'Motor', icon: 'engine' },
  { id: 'Fren', label: 'Fren', icon: 'car-brake-abs' },
  { id: 'Elektrik', label: 'Elektrik', icon: 'lightning-bolt' },
  { id: 'Kaporta', label: 'Kaporta', icon: 'car-door' },
  { id: 'Lastik', label: 'Lastik', icon: 'car-tire-alert' },
  { id: 'Klima', label: 'Klima', icon: 'air-conditioner' },
  { id: 'Periyodik Bakım', label: 'Periyodik Bakım', icon: 'calendar-clock' },
  { id: 'Akü', label: 'Akü', icon: 'car-battery' },
  { id: 'Boya', label: 'Boya', icon: 'format-paint' },
  { id: 'Jant', label: 'Jant', icon: 'tire' },
  { id: 'Rot Balans', label: 'Rot Balans', icon: 'align-horizontal-center' },
];