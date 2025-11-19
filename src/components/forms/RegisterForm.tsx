import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './RegisterForm.module.css';

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['buyer', 'seller']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const RegisterForm = ({ onSuccess, onError }: RegisterFormProps) => {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'buyer',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('🔍 Starting registration process...');
      console.log('📝 Registration data:', { 
        email: data.email, 
        fullName: data.fullName, 
        role: data.role 
      });
      
      // Step 1: Create auth user
      console.log('🔐 Creating Supabase auth user...');
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          },
        },
      });

      if (authError) {
        console.error('❌ Auth registration failed:', authError.message);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data received from Supabase auth');
      }

      console.log('✅ Auth user created:', authData.user.id);

      // Step 2: The database trigger should automatically create the user record
      // Wait a moment for the trigger to execute, then verify
      console.log('⏳ Waiting for database trigger to create user record...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try to verify user was created (this might fail due to RLS if session not established)
      // If trigger is set up, user should exist. If not, we'll get an error on manual insert
      console.log('💾 Attempting to create/verify user record...');
      
      // Ensure we have a session before insert (needed for RLS policies)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('⏳ Session not yet established, waiting...');
        // Wait a bit more for session to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Try to insert user record
      // If trigger already created it, we'll get a duplicate key error (which is fine)
      // If trigger didn't create it, this will create it (if RLS allows)
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: data.role,
        });

      if (userError) {
        // If it's a duplicate key error, the trigger already created it (success!)
        if (userError.code === '23505' || userError.message.includes('duplicate key') || userError.message.includes('already exists')) {
          console.log('✅ User record already exists (created by database trigger)');
        } else if (userError.message.includes('relation "public.users" does not exist')) {
          throw new Error('Database tables not set up. Please run supabase-setup.sql in Supabase SQL editor.');
        } else if (userError.message.includes('new row violates row-level security policy') || userError.message.includes('RLS')) {
          throw new Error('Database trigger not set up or RLS policy blocking insert. Please run fix-users-policy-v2.sql in Supabase SQL editor to set up the automatic user creation trigger.');
        } else {
          console.error('❌ Failed to create user record:', userError);
          throw new Error(`Failed to create user profile: ${userError.message}`);
        }
      } else {
        console.log('✅ User record created successfully');
      }

      console.log('✅ Registration completely successful!', {
        email: authData.user.email,
        role: data.role,
        userId: authData.user.id
      });
      
      // Registration successful
      onSuccess?.();
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      
      // Show user-friendly error messages
      if (errorMessage.includes('Database tables not set up')) {
        onError?.('Database not set up. Please run the SQL setup in Supabase first.');
      } else if (errorMessage.includes('User already registered')) {
        onError?.('This email is already registered. Try logging in instead.');
      } else if (errorMessage.includes('Invalid email')) {
        onError?.('Please enter a valid email address.');
      } else if (errorMessage.includes('Password should be at least')) {
        onError?.('Password must be at least 6 characters long.');
      } else {
        onError?.(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <Input
        {...register('fullName')}
        label={t('register.fullName')}
        error={errors.fullName?.message}
        autoComplete="name"
        data-testid="register-fullName"
      />
      <Input
        {...register('email')}
        type="email"
        label={t('register.email')}
        error={errors.email?.message}
        autoComplete="email"
        data-testid="register-email"
      />
      <Input
        {...register('password')}
        type="password"
        label={t('register.password')}
        error={errors.password?.message}
        autoComplete="new-password"
        data-testid="register-password"
      />
      <Input
        {...register('confirmPassword')}
        type="password"
        label={t('register.confirmPassword')}
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
        data-testid="register-confirmPassword"
      />
      <div className={styles.roleGroup}>
        <label className={styles.roleLabel}>{t('register.role')}</label>
        <div className={styles.roleOptions}>
          <label className={styles.radioLabel}>
            <input
              {...register('role')}
              type="radio"
              value="buyer"
              className={styles.radio}
              data-testid="register-role-buyer"
            />
            {t('register.roleBuyer')}
          </label>
          <label className={styles.radioLabel}>
            <input
              {...register('role')}
              type="radio"
              value="seller"
              className={styles.radio}
              data-testid="register-role-seller"
            />
            {t('register.roleSeller')}
          </label>
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} className={styles.submitButton} data-testid="register-submit">
        {t('register.submit')}
      </Button>
    </form>
  );
};

export default RegisterForm;

