import { test, expect } from '@playwright/test';
import { loginAsRole } from '../../utils/auth';

test.describe('Buyer Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'buyer');
  });

  test('should add product to cart and complete checkout', async ({ page }) => {
    // Navigate to catalog
    await page.goto('/catalog');
    await expect(page.getByText('Product Catalog')).toBeVisible();

    // Add first product to cart
    const firstProduct = page.getByTestId(/add-to-cart-/).first();
    await firstProduct.click();

    // Go to cart
    await page.goto('/cart');
    await expect(page.getByText('Your Cart')).toBeVisible();

    // Verify product in cart
    await expect(page.getByTestId(/remove-/)).toBeVisible();

    // Proceed to checkout
    await page.getByTestId('proceed-to-checkout').click();
    await expect(page.getByText('Checkout')).toBeVisible();

    // Fill checkout form
    await page.getByTestId('checkout-fullName').fill('Test Buyer');
    await page.getByTestId('checkout-email').fill('buyer@test.com');
    await page.getByTestId('checkout-address').fill('123 Test Street');
    await page.getByTestId('checkout-city').fill('Stockholm');
    await page.getByTestId('checkout-postalCode').fill('12345');
    await page.getByTestId('checkout-country').fill('Sweden');

    // Submit order
    await page.getByTestId('checkout-submit').click();

    // Verify order confirmation (adjust based on your confirmation page)
    await expect(page).toHaveURL(/\/checkout\/confirmation\//);
  });
});

