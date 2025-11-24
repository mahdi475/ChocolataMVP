import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
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
  const { handleRegister } = useAuth();
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
    const { error } = await handleRegister({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
        },
      },
    });

    if (error) {
      onError?.(error.message);
    } else {
      onSuccess?.();
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

