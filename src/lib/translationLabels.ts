import type { TFunction } from 'i18next';

const normalizeLabel = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

export const labelKey = (group: string, value: string) => `labels.${group}.${normalizeLabel(value)}`;

export const translateLabel = (t: TFunction, group: string, value?: string | null) => {
  if (!value) return '';
  const key = labelKey(group, value);
  return t(key, { defaultValue: value });
};

export const translateLabels = (t: TFunction, group: string, values: string[]) =>
  values.map((value) => translateLabel(t, group, value));

export const translateCountry = (t: TFunction, country?: string | null) =>
  translateLabel(t, 'countries', country);

export const formatLocalizedLocation = (
  t: TFunction,
  city?: string | null,
  country?: string | null
) => [city, translateCountry(t, country)].filter(Boolean).join(', ');
