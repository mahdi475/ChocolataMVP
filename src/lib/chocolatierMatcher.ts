import { CHOCOLATIERS } from '../data/chocolatiers';
import type { Product } from '../components/cards/ProductCard';

const normalize = (value?: string | null) =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export const getChocolatierProfilePath = (slug: string) => `/chocolatiers/${slug}`;

export const findChocolatierMatch = (...values: Array<string | null | undefined>) => {
  const candidates = values.filter(Boolean) as string[];
  if (candidates.length === 0) return undefined;

  for (const value of candidates) {
    const exact = CHOCOLATIERS.find(
      (chocolatier) => chocolatier.name === value || chocolatier.slug === value
    );
    if (exact) return exact;
  }

  const normalizedCandidates = candidates.map(normalize).filter(Boolean);

  for (const candidate of normalizedCandidates) {
    const normalized = CHOCOLATIERS.find((chocolatier) => {
      const normalizedName = normalize(chocolatier.name);
      const normalizedSlug = normalize(chocolatier.slug);

      return (
        normalizedName === candidate ||
        normalizedSlug === candidate ||
        normalizedName.includes(candidate) ||
        candidate.includes(normalizedName) ||
        normalizedSlug.includes(candidate) ||
        candidate.includes(normalizedSlug)
      );
    });

    if (normalized) return normalized;
  }

  return undefined;
};

export const findChocolatierForProduct = (product: Product) =>
  findChocolatierMatch(
    product.maker_name,
    product.maker_slug,
    product.maker_id,
    product.seller_id
  );

