import { cars, customers, mechanics, reminders, serviceRecords } from '../constants/mockData';
import { Car, Customer, Mechanic, Reminder, ServiceRecord } from '../types/schema';

// --- Customer Services ---

export const getMyCars = (customerId: string): Car[] => {
  return cars.filter(car => car.ownerId === customerId);
};

export const getCarFullDetails = (carId: string): { car: Car | undefined, history: ServiceRecord[], reminders: Reminder[] } => {
  const car = cars.find(c => c.id === carId);
  
  const history = serviceRecords
    .filter(r => r.carId === carId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Newest first
  
  const carReminders = reminders.filter(r => r.carId === carId);

  return {
    car,
    history,
    reminders: carReminders,
  };
};

export const getCustomerProfile = (customerId: string): Customer | undefined => {
  return customers.find(c => c.id === customerId);
};

// --- Mechanic Services ---

export const getAllMechanics = (): Mechanic[] => {
  return mechanics;
};

export const getMechanicById = (mechanicId: string): Mechanic | undefined => {
  return mechanics.find(m => m.id === mechanicId);
};

export const getOnlineMechanics = (): Mechanic[] => {
  return mechanics.filter(m => m.isOnline);
};

export const filterMechanicsBySpecialty = (specialty: string): Mechanic[] => {
  return mechanics.filter(m => m.specialties.includes(specialty as any));
};

// --- Job/Service Services ---

export const getServicesByMechanic = (mechanicId: string): ServiceRecord[] => {
    return serviceRecords
        .filter(s => s.mechanicId === mechanicId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
