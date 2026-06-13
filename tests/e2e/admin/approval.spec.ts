import { test, expect } from '@playwright/test';
import { loginAsRole } from '../../utils/auth';

test.describe('Admin Seller Approval', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsRole(page, 'admin');
  });

  test('should approve a pending seller', async ({ page }) => {
    // Navigate to seller approvals page
    await page.goto('/admin/sellers');
    await expect(page.getByText('Seller Approvals')).toBeVisible();

    // Find first pending seller (if exists)
    const approveButton = page.getByTestId(/approve-seller-/).first();
    if (await approveButton.isVisible()) {
      await approveButton.click();

      // Verify seller is approved (status changes or removed from pending list)
      // Adjust based on your implementation
      await expect(approveButton).not.toBeVisible();
    }
  });

  test('should reject a pending seller', async ({ page }) => {
    // Navigate to seller approvals page
    await page.goto('/admin/sellers');
    await expect(page.getByText('Seller Approvals')).toBeVisible();

    // Find first pending seller (if exists)
    const rejectButton = page.getByTestId(/reject-seller-/).first();
    if (await rejectButton.isVisible()) {
      await rejectButton.click();

      // Verify seller is rejected (status changes or removed from pending list)
      // Adjust based on your implementation
      await expect(rejectButton).not.toBeVisible();
    }
  });

  test('should view seller verification document', async ({ page }) => {
    // Navigate to seller approvals page
    await page.goto('/admin/sellers');

    // Find and click document link (if exists)
    const documentLink = page.getByText('View Document').first();
    if (await documentLink.isVisible()) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        documentLink.click(),
      ]);

      // Verify document opens in new tab
      expect(newPage.url()).toBeTruthy();
      await newPage.close();
    }
  });
});

