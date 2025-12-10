// Payment processing utilities
// Note: This is a mock implementation. For production, integrate with Stripe/PayPal/Klarna

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Mock payment processing function
 * In production, this would integrate with Stripe, PayPal, or Klarna APIs
 */
export async function processPayment(
  amount: number,
  currency: string = 'SEK',
  paymentMethod: 'card' | 'klarna' | 'paypal',
  paymentData?: Record<string, any>
): Promise<PaymentResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock payment processing - in production, this would call actual payment APIs
  // For Stripe: use Stripe.js and Stripe API
  // For PayPal: use PayPal SDK
  // For Klarna: use Klarna API

  // Simulate 95% success rate for testing
  const success = Math.random() > 0.05;

  if (success) {
    // Generate mock transaction ID
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      success: true,
      transactionId,
    };
  } else {
    return {
      success: false,
      error: 'Payment processing failed. Please try again or use a different payment method.',
    };
  }
}

/**
 * Calculate shipping cost based on country and order total
 */
export function calculateShippingCost(country: string, orderTotal: number): number {
  // Free shipping for orders over 500 SEK
  if (orderTotal >= 500) {
    return 0;
  }

  // Shipping costs by country (in SEK)
  const shippingRates: Record<string, number> = {
    SE: 49, // Sweden
    NO: 79, // Norway
    DK: 79, // Denmark
    FI: 79, // Finland
    DE: 99, // Germany
    // Default for other countries
  };

  return shippingRates[country.toUpperCase()] || 149;
}

/**
 * Calculate tax amount (VAT) based on country
 * Sweden VAT is 25% (MOMS)
 */
export function calculateTax(subtotal: number, shipping: number, country: string): number {
  // Sweden VAT rate
  const vatRate = country.toUpperCase() === 'SE' ? 0.25 : 0;
  
  // Tax is calculated on subtotal + shipping
  return (subtotal + shipping) * vatRate;
}

/**
 * Calculate estimated delivery date
 */
export function calculateEstimatedDeliveryDate(country: string): Date {
  const today = new Date();
  const deliveryDays: Record<string, number> = {
    SE: 2, // Sweden: 2 business days
    NO: 3, // Norway: 3 business days
    DK: 3, // Denmark: 3 business days
    FI: 3, // Finland: 3 business days
    DE: 5, // Germany: 5 business days
  };

  const days = deliveryDays[country.toUpperCase()] || 7;
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + days);

  // Skip weekends (simple implementation)
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return deliveryDate;
}

