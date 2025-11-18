import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabaseClient';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './ProductForm.module.css';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormValues extends ProductFormData {
  id?: string;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ProductForm = ({ initialValues, onSuccess, onError }: ProductFormProps) => {
  const { t } = useTranslation('products');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const productData = {
        ...data,
        seller_id: user.id,
        image_url: data.image_url || null,
      };

      if (initialValues?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialValues.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
      }

      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message || 'Failed to save product');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <Input
        {...register('name')}
        label={t('form.name')}
        error={errors.name?.message}
        data-testid="product-name"
      />
      <Input
        {...register('description')}
        label={t('form.description')}
        error={errors.description?.message}
        data-testid="product-description"
      />
      <div className={styles.row}>
        <Input
          {...register('price', { valueAsNumber: true })}
          type="number"
          step="0.01"
          label={t('form.price')}
          error={errors.price?.message}
          data-testid="product-price"
        />
        <Input
          {...register('stock', { valueAsNumber: true })}
          type="number"
          label={t('form.stock')}
          error={errors.stock?.message}
          data-testid="product-stock"
        />
      </div>
      <Input
        {...register('category')}
        label={t('form.category')}
        error={errors.category?.message}
        data-testid="product-category"
      />
      <Input
        {...register('image_url')}
        type="url"
        label={t('form.imageUrl')}
        error={errors.image_url?.message}
        helperText={t('form.imageUrlHelper')}
        data-testid="product-image-url"
      />
      <Button type="submit" isLoading={isSubmitting} className={styles.submitButton} data-testid="product-submit">
        {initialValues?.id ? t('form.update') : t('form.create')}
      </Button>
    </form>
  );
};

export default ProductForm;

