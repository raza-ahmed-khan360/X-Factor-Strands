import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sorts product variants in ascending order (small size/price first).
 * e.g. "50mg" comes before "100mg", "$30" comes before "$50".
 */
export function sortVariants<T extends { size?: string; price?: number }>(variants: T[]): T[] {
  if (!Array.isArray(variants) || variants.length <= 1) return variants;

  return [...variants].sort((a, b) => {
    const parseNumeric = (str?: string) => {
      if (!str) return 0;
      const match = str.match(/([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const valA = parseNumeric(a.size);
    const valB = parseNumeric(b.size);

    // Primary sort by numeric size if available in both
    if (valA > 0 && valB > 0 && valA !== valB) {
      return valA - valB;
    }

    // Secondary sort by price ascending
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    if (priceA !== priceB) {
      return priceA - priceB;
    }

    // Fallback alphabetical sort by size string
    return (a.size || '').localeCompare(b.size || '');
  });
}
