export const PRODUCT_TAG_OPTIONS = [
  'Chocolate Bars',
  'Pralines & Bonbons',
  'Truffles',
  'Gift Boxes',
  'Corporate Gifts',
  'Bean-to-Bar',
  'Dark Chocolate',
  'Milk Chocolate',
  'White Chocolate',
  'Ruby Chocolate',
  'Single-Origin',
  'Vegan',
  'Organic',
  'Sugar-Free',
  'Gluten-Free',
  'Dairy-Free',
  'Hazelnut',
  'Caramel',
  'Pistachio',
  'Orange',
  'Coffee',
  'Raspberry',
  'Sea Salt',
  'Champagne',
  'Handmade',
  'Small Batch',
  'Award-Winning',
  'Limited Edition',
  'Sustainable',
  'Seasonal Collection',
];

export const normalizeProductTag = (tag: string) => tag.trim().replace(/\s+/g, ' ');

export const uniqueProductTags = (tags: string[]) =>
  Array.from(new Set(tags.map(normalizeProductTag).filter(Boolean)));
