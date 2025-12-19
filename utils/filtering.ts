import type { Mechanic } from '@/types/schema';

export function filterMechanics(
  mechanics: Mechanic[],
  query: string,
  category: string
): Mechanic[] {
  const q = query.trim().toLowerCase();
  return mechanics.filter((mechanic) => {
    const matchesSearch =
      q.length === 0 ||
      mechanic.name.toLowerCase().includes(q) ||
      mechanic.specialties.some((spec) => spec.toLowerCase().includes(q)) ||
      mechanic.location.address.toLowerCase().includes(q);

    const matchesCategory =
      category === 'Tümü' || mechanic.specialties.includes(category);

    return matchesSearch && matchesCategory;
  });
}
