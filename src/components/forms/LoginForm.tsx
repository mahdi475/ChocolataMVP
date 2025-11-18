import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './LoginForm.module.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { t } = useTranslation('auth');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <Input
        {...register('email')}
        type="email"
        label={t('login.email')}
        error={errors.email?.message}
        autoComplete="email"
        data-testid="login-email"
      />
      <Input
        {...register('password')}
        type="password"
        label={t('login.password')}
        error={errors.password?.message}
        autoComplete="current-password"
        data-testid="login-password"
      />
      <Button type="submit" isLoading={isSubmitting} className={styles.submitButton} data-testid="login-submit">
        {t('login.submit')}
      </Button>
    </form>
  );
};

export default LoginForm;

