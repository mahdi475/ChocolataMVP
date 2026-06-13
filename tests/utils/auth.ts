import { Page } from '@playwright/test';
import { supabase } from '../../src/lib/supabaseClient';

/**
 * Helper to login a user via Supabase auth
 * @param page - Playwright page instance
 * @param email - User email
 * @param password - User password
 */
export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await page.waitForURL('/catalog', { timeout: 5000 });
}

/**
 * Helper to login as a specific role
 * @param page - Playwright page instance
 * @param role - 'buyer' | 'seller' | 'admin'
 */
export async function loginAsRole(page: Page, role: 'buyer' | 'seller' | 'admin') {
  const testUsers = {
    buyer: { email: 'buyer@test.com', password: 'test123456' },
    seller: { email: 'seller@test.com', password: 'test123456' },
    admin: { email: 'admin@test.com', password: 'test123456' },
  };

  const user = testUsers[role];
  await loginUser(page, user.email, user.password);
}

/**
 * Helper to register a new user
 * @param page - Playwright page instance
 * @param email - User email
 * @param password - User password
 * @param fullName - User full name
 * @param role - 'buyer' | 'seller'
 */
export async function registerUser(
  page: Page,
  email: string,
  password: string,
  fullName: string,
  role: 'buyer' | 'seller' = 'buyer',
) {
  await page.goto('/register');
  await page.getByTestId('register-fullName').fill(fullName);
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill(password);
  await page.getByTestId('register-confirmPassword').fill(password);
  await page.getByTestId(`register-role-${role}`).check();
  await page.getByTestId('register-submit').click();
}

