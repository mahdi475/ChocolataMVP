import { CHOCOLATIERS } from '../data/chocolatiers';

export const LAUNCH_COUNTRIES = [
  'Austria',
  'Belgium',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Italy',
  'Netherlands',
  'Norway',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
];

export const MARKETPLACE_COUNTRIES = Array.from(
  new Set([...CHOCOLATIERS.map((chocolatier) => chocolatier.country), ...LAUNCH_COUNTRIES])
).sort((a, b) => a.localeCompare(b));

export const countrySelectOptions = (placeholder = 'Select a country...') => [
  { value: '', label: placeholder },
  ...MARKETPLACE_COUNTRIES.map((country) => ({ value: country, label: country })),
];
