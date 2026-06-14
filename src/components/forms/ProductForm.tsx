import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { PRODUCT_TAG_OPTIONS, uniqueProductTags } from '../../lib/productTags';
import { addNotification } from '../../store/slices/notificationSlice';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import ImageUpload from '../ui/ImageUpload';
import styles from './ProductForm.module.css';

const COUNTRIES = [
  { value: '', label: 'Select a country...' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'France', label: 'France' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Germany', label: 'Germany' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'USA', label: 'United States' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Madagascar', label: 'Madagascar' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Dominican Republic', label: 'Dominican Republic' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Other', label: 'Other' },
];

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  country: z.string().optional(),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  tags: z.array(z.string()).optional(),
  // Removed image_url from schema since we handle file upload separately
});

type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormValues extends ProductFormData {
  id?: string;
  image_url?: string | null;
  tags?: string[];
  badges?: string[];
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const ProductForm = ({ initialValues, onSuccess, onError }: ProductFormProps) => {
  const { t } = useTranslation('products');
  const dispatch = useDispatch();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    initialValues?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    uniqueProductTags(initialValues?.tags || initialValues?.badges || [])
  );
  const [tagSearch, setTagSearch] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...initialValues,
      country: initialValues?.country || '',
      tags: initialValues?.tags || initialValues?.badges || [],
    },
  });

  const filteredTags = PRODUCT_TAG_OPTIONS.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : uniqueProductTags([...current, tag])
    );
  };

  const addTypedTag = () => {
    const nextTag = tagSearch.trim();
    if (!nextTag) return;
    setSelectedTags((current) => uniqueProductTags([...current, nextTag]));
    setTagSearch('');
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    
    // Create a temporary preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImageUrl(previewUrl);
    
    console.log('📷 Bild vald för uppladdning:', file.name, file.size);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let finalImageUrl = uploadedImageUrl;

      // Upload image to Supabase Storage if a new file was selected
      if (imageFile) {
        console.log('📤 Uploading image to Supabase Storage...');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          throw new Error('Image upload failed. Please try again.');
        }

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        if (!urlData.publicUrl) {
          throw new Error('Could not retrieve public URL for the uploaded image.');
        }

        finalImageUrl = urlData.publicUrl;
        console.log('✅ Image uploaded successfully:', finalImageUrl);
      }

      const productData = {
        ...data,
        tags: selectedTags,
        badges: selectedTags,
        seller_id: user.id,
        image_url: finalImageUrl,
        country: data.country && data.country.trim() !== '' ? data.country : null,
      };

      if (initialValues?.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialValues.id);
        if (error) throw error;
        dispatch(addNotification({
          type: 'success',
          message: 'Product updated successfully!',
        }));
      } else {
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        dispatch(addNotification({
          type: 'success',
          message: 'Product created successfully!',
        }));
      }

      onSuccess?.();
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error.message || 'Failed to save product',
      }));
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
      <div className={styles.row}>
        <Input
          {...register('category')}
          label={t('form.category')}
          error={errors.category?.message}
          data-testid="product-category"
        />
        <Select
          {...register('country')}
          label={t('form.country', 'Country')}
          error={errors.country?.message}
          options={COUNTRIES}
          data-testid="product-country"
        />
      </div>
      <section className={styles.tagSection}>
        <div className={styles.tagHeader}>
          <div>
            <h3>Categories and tags</h3>
            <p>Choose the words customers use when filtering and discovering chocolate.</p>
          </div>
          <span>{selectedTags.length} selected</span>
        </div>
        <div className={styles.tagInputRow}>
          <Input
            label="Search or add tag"
            value={tagSearch}
            onChange={(event) => setTagSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTypedTag();
              }
            }}
            helperText="Press Enter or click Add to create a custom tag."
          />
          <Button type="button" variant="outline" onClick={addTypedTag}>
            Add
          </Button>
        </div>
        <div className={styles.selectedTags}>
          {selectedTags.length === 0 ? (
            <p>No tags selected yet.</p>
          ) : (
            selectedTags.map((tag) => (
              <button type="button" key={tag} className={styles.selectedTag} onClick={() => toggleTag(tag)}>
                {tag} x
              </button>
            ))
          )}
        </div>
        <div className={styles.tagCloud}>
          {filteredTags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`${styles.tagChip} ${selectedTags.includes(tag) ? styles.tagChipActive : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
      <ImageUpload
        onImageUpload={handleImageUpload}
        existingImage={uploadedImageUrl || undefined}
        maxSize={5}
      />
      <Button type="submit" isLoading={isSubmitting} className={styles.submitButton} data-testid="product-submit">
        {initialValues?.id ? t('form.update') : t('form.create')}
      </Button>
    </form>
  );
};

export default ProductForm;

