import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import { countrySelectOptions } from '../../lib/marketplaceCountries';
import { PRODUCT_TAG_OPTIONS, uniqueProductTags } from '../../lib/productTags';
import { DEMO_SELLER_PROFILE_SLUG, loadSellerStoreProfile } from '../../lib/sellerProfile';
import { addNotification } from '../../store/slices/notificationSlice';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import ImageUpload from '../ui/ImageUpload';
import styles from './ProductForm.module.css';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  country: z.string().optional(),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['published', 'draft']).default('published'),
  // Removed image_url from schema since we handle file upload separately
});

type ProductFormData = z.infer<typeof productSchema>;

export interface ProductFormValues extends ProductFormData {
  id?: string;
  image_url?: string | null;
  gallery_images?: string[];
  tags?: string[];
  badges?: string[];
  status: 'draft' | 'published';
  is_active?: boolean;
}

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSuccess?: (productId?: string) => void;
  onError?: (error: string) => void;
}

const ProductForm = ({ initialValues, onSuccess, onError }: ProductFormProps) => {
  const { t } = useTranslation(['products', 'ui']);
  const dispatch = useDispatch();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    initialValues?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialValues?.gallery_images || []);
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
      status: initialValues?.status || (initialValues?.is_active === false ? 'draft' : 'published'),
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
    
    const reader = new FileReader();
    reader.onload = () => setUploadedImageUrl(reader.result as string);
    reader.readAsDataURL(file);
    
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
          if (!finalImageUrl?.startsWith('data:image/')) {
            throw new Error('Image upload failed. Please try again.');
          }
        }

        if (!uploadError) {
          const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        if (!urlData.publicUrl) {
          throw new Error('Could not retrieve public URL for the uploaded image.');
        }

        finalImageUrl = urlData.publicUrl;
        console.log('✅ Image uploaded successfully:', finalImageUrl);
      }

      }

      const productData = {
        ...data,
        tags: selectedTags,
        badges: selectedTags,
        seller_id: user.id,
        maker_id: DEMO_SELLER_PROFILE_SLUG,
        maker_slug: DEMO_SELLER_PROFILE_SLUG,
        maker_name: loadSellerStoreProfile().storeName,
        image_url: finalImageUrl,
        gallery_images: galleryImages,
        country: data.country && data.country.trim() !== '' ? data.country : null,
        is_active: data.status === 'published',
        status: data.status,
      };
      let savedProductId = initialValues?.id;

      if (initialValues?.id) {
        const { data: updated, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', initialValues.id);
        if (error) throw error;
        savedProductId = (updated as { id?: string } | null)?.id || initialValues.id;
        dispatch(addNotification({
          type: 'success',
          message: 'Product updated successfully!',
        }));
      } else {
        const { data: inserted, error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        savedProductId = (inserted as { id?: string } | null)?.id;
        dispatch(addNotification({
          type: 'success',
          message: 'Product created successfully!',
        }));
      }

      onSuccess?.(savedProductId);
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
          options={countrySelectOptions()}
          data-testid="product-country"
        />
      </div>
      <section className={styles.statusSection}>
        <div>
          <h3>{t('ui:sellerProductForm.visibility')}</h3>
          <p>{t('ui:sellerProductForm.visibilityHelper')}</p>
        </div>
        <Select
          {...register('status')}
          label={t('ui:sellerProductForm.productStatus')}
          options={[
            { value: 'published', label: t('ui:sellerProductForm.publishProduct') },
            { value: 'draft', label: t('ui:sellerProductForm.saveAsDraft') },
          ]}
          data-testid="product-status"
        />
      </section>
      <section className={styles.tagSection}>
        <div className={styles.tagHeader}>
          <div>
            <h3>{t('ui:sellerProductForm.categoriesAndTags')}</h3>
            <p>{t('ui:sellerProductForm.categoriesAndTagsHelper')}</p>
          </div>
          <span>{t('ui:sellerProductForm.selectedCount', { count: selectedTags.length })}</span>
        </div>
        <div className={styles.tagInputRow}>
          <Input
            label={t('ui:sellerProductForm.searchOrAddTag')}
            value={tagSearch}
            onChange={(event) => setTagSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTypedTag();
              }
            }}
            helperText={t('ui:sellerProductForm.tagHelper')}
          />
          <Button type="button" variant="outline" onClick={addTypedTag}>
            {t('ui:sellerProductForm.addTag')}
          </Button>
        </div>
        <div className={styles.selectedTags}>
          {selectedTags.length === 0 ? (
            <p>{t('ui:sellerProductForm.noTagsSelected')}</p>
          ) : (
            selectedTags.map((tag) => (
              <button type="button" key={tag} className={styles.selectedTag} onClick={() => toggleTag(tag)}>
                {tag} {t('ui:sellerProductForm.removeTagSuffix')}
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
        onImageRemove={() => {
          setImageFile(null);
          setUploadedImageUrl(null);
        }}
        existingImage={uploadedImageUrl || undefined}
        maxSize={5}
      />
      <section className={styles.gallerySection}>
        <div className={styles.tagHeader}>
          <div>
            <h3>{t('ui:sellerProductForm.productGallery')}</h3>
            <p>{t('ui:sellerProductForm.productGalleryHelper')}</p>
          </div>
          <span>{t('ui:sellerProductForm.imageCount', { count: galleryImages.length })}</span>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          className={styles.fileInput}
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            files.forEach((file) => {
              if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
              const reader = new FileReader();
              reader.onload = () => setGalleryImages((current) => [...current, reader.result as string]);
              reader.readAsDataURL(file);
            });
            event.currentTarget.value = '';
          }}
        />
        <div className={styles.galleryGrid}>
          {galleryImages.map((image, index) => (
            <div key={`${image}-${index}`} className={styles.galleryItem}>
              <img src={image} alt={t('ui:sellerProductForm.productGalleryAlt', { number: index + 1 })} />
              <button type="button" onClick={() => setGalleryImages((current) => current.filter((_, i) => i !== index))}>
                {t('ui:sellerProductForm.removeImage')}
              </button>
            </div>
          ))}
        </div>
      </section>
      <Button type="submit" isLoading={isSubmitting} className={styles.submitButton} data-testid="product-submit">
        {initialValues?.id ? t('form.update') : t('form.create')}
      </Button>
    </form>
  );
};

export default ProductForm;

