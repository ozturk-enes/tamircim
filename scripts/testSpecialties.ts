
import { specialList, mechanics } from '../constants/mockData';
import { MechanicSpecialty } from '../types/schema';

console.log('Testing specialList and mechanics specialties...');

// Test 1: Verify specialList contains all MechanicSpecialty values (can't easily check exhaustiveness at runtime without a list of all types, but we can check the other way around if we had one)
// For now, we assume specialList IS the source of truth.

// Test 2: Verify all mechanics have valid specialties
let allValid = true;
mechanics.forEach(m => {
  m.specialties.forEach(s => {
    if (!specialList.includes(s)) {
      console.error(`Invalid specialty found for mechanic ${m.name}: ${s}`);
      allValid = false;
    }
  });
});

if (allValid) {
  console.log('All mechanics have valid specialties.');
} else {
  console.error('Some mechanics have invalid specialties.');
  process.exit(1);
}

// Test 3: Verify specialList items are strings (basic sanity)
if (specialList.every(s => typeof s === 'string')) {
  console.log('specialList structure is valid.');
} else {
  console.error('specialList contains non-string values.');
  process.exit(1);
}

console.log('Tests completed.');
