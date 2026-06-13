import { supabase } from '../../src/lib/supabaseClient';

/**
 * Seed test data into Supabase tables
 * @param tables - Array of table names to seed
 */
export async function seedTestData(tables: string[] = []) {
  // This is a placeholder - implement based on your test data needs
  // Example: Insert test users, products, etc.
  console.log('Seeding test data for tables:', tables);
}

/**
 * Reset/clean test data from Supabase tables
 * @param tables - Array of table names to clean
 */
export async function resetTestData(tables: string[] = []) {
  // This is a placeholder - implement based on your test cleanup needs
  // Example: Delete test users, products, etc.
  console.log('Resetting test data for tables:', tables);
}

/**
 * Create a test user in Supabase
 * @param email - User email
 * @param password - User password
 * @param role - User role
 * @returns User ID
 */
export async function createTestUser(
  email: string,
  password: string,
  role: 'buyer' | 'seller' | 'admin' = 'buyer',
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    email,
    role,
    full_name: email.split('@')[0],
  });

  if (userError) throw userError;

  return authData.user.id;
}

/**
 * Delete a test user from Supabase
 * @param userId - User ID to delete
 */
export async function deleteTestUser(userId: string) {
  await supabase.from('users').delete().eq('id', userId);
  // Note: Auth user deletion may require admin API
}

