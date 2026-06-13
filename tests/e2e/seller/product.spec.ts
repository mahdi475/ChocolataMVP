import { test, expect } from '@playwright/test';
import { loginAsRole } from '../../utils/auth';

test.describe('Seller Product Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'seller');
  });

  test('should create a new product', async ({ page }) => {
    // Navigate to products page
    await page.goto('/seller/products');
    await expect(page.getByText('My Products')).toBeVisible();

    // Click create product button
    await page.getByTestId('create-product-button').click();
    await expect(page).toHaveURL('/seller/products/new');

    // Fill product form
    await page.getByTestId('product-name').fill('Test Chocolate Bar');
    await page.getByTestId('product-description').fill('A delicious test chocolate bar');
    await page.getByTestId('product-price').fill('99.99');
    await page.getByTestId('product-stock').fill('100');
    await page.getByTestId('product-category').fill('Dark Chocolate');
    await page.getByTestId('product-image-url').fill('https://example.com/chocolate.jpg');

    // Submit form
    await page.getByTestId('product-submit').click();

    // Verify redirect to products list
    await expect(page).toHaveURL('/seller/products');
    await expect(page.getByText('Test Chocolate Bar')).toBeVisible();
  });

  test('should edit an existing product', async ({ page }) => {
    // Navigate to products page
    await page.goto('/seller/products');

    // Click edit on first product (if exists)
    const editButton = page.getByRole('link', { name: 'Edit' }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page).toHaveURL(/\/seller\/products\/.*\/edit/);

      // Update product name
      await page.getByTestId('product-name').fill('Updated Product Name');
      await page.getByTestId('product-submit').click();

      // Verify update
      await expect(page).toHaveURL('/seller/products');
      await expect(page.getByText('Updated Product Name')).toBeVisible();
    }
  });

  test('should delete a product', async ({ page }) => {
    // Navigate to products page
    await page.goto('/seller/products');

    // Click delete on first product (if exists)
    const deleteButton = page.getByTestId(/delete-product-/).first();
    if (await deleteButton.isVisible()) {
      // Handle confirmation dialog
      page.on('dialog', (dialog) => dialog.accept());
      await deleteButton.click();

      // Verify product is removed (adjust based on your implementation)
      await expect(deleteButton).not.toBeVisible();
    }
  });
});

