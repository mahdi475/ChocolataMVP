export interface ShippingPackagingInfo {
  shipsFromCountry?: string;
  shipsFromCity?: string;
  deliveryEstimate?: string;
  shippingEstimate?: string;
  domesticShipping?: boolean;
  euShipping?: boolean;
  heatProtection?: boolean;
  giftPackaging?: boolean;
  summerShipping?: boolean;
  ecoPackaging?: boolean;
}

export const DEFAULT_SHIPPING_PACKAGING: Required<
  Omit<ShippingPackagingInfo, 'shipsFromCountry' | 'shipsFromCity' | 'shippingEstimate'>
> & { shippingEstimate?: string } = {
  deliveryEstimate: '2-5',
  domesticShipping: true,
  euShipping: true,
  heatProtection: true,
  giftPackaging: true,
  summerShipping: true,
  ecoPackaging: true,
};

export const getShippingPackaging = (
  source?: ShippingPackagingInfo | null,
  fallback?: Pick<ShippingPackagingInfo, 'shipsFromCountry' | 'shipsFromCity' | 'shippingEstimate'>
): ShippingPackagingInfo => ({
  ...DEFAULT_SHIPPING_PACKAGING,
  ...fallback,
  ...(source || {}),
});
