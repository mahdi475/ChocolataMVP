import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import {
  IMAGE_MAX_SIZE_MB,
  isAcceptedImageSize,
  isAcceptedImageType,
} from '../../lib/imageUploadLimits';
import StoredImage from './StoredImage';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
  existingImage?: string;
  maxSize?: number;
}

const ImageUpload = ({
  onImageUpload,
  onImageRemove,
  existingImage,
  maxSize = IMAGE_MAX_SIZE_MB,
}: ImageUploadProps) => {
  const { t } = useTranslation('ui');
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(existingImage || null);
  }, [existingImage]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);

    if (!isAcceptedImageSize(file)) {
      setError(t('imageUpload.fileTooLarge', { size: maxSize }));
      return;
    }

    if (!isAcceptedImageType(file)) {
      setError(t('imageUpload.invalidType'));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setUploading(true);
    try {
      await onImageUpload(file);
    } catch (uploadError) {
      console.error('Image upload failed:', uploadError);
      setError(uploadError instanceof Error ? uploadError.message : t('imageUpload.uploadFailed'));
      setPreview(existingImage || null);
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploading(false);
    }
  }, [existingImage, maxSize, onImageUpload, t]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onImageRemove?.();
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('imageUpload.productImage')}</label>

      {preview ? (
        <div className={styles.previewContainer}>
          <StoredImage
            src={preview}
            alt={t('imageUpload.previewAlt')}
            className={styles.preview}
          />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              onClick={removeImage}
              className={styles.removeButton}
              title={t('imageUpload.removeImage')}
            >
              x
            </button>
            <div {...getRootProps()} className={styles.changeButton}>
              <input {...getInputProps()} />
              {t('imageUpload.replaceImage')}
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${
            isDragActive ? styles.dragActive : ''
          } ${isDragReject ? styles.dragReject : ''}`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className={styles.uploading}>
              <div className={styles.spinner}></div>
              <p>{t('imageUpload.uploading')}</p>
            </div>
          ) : isDragActive ? (
            <div className={styles.dragMessage}>
              <p>{t('imageUpload.dropHere')}</p>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.icon}>+</div>
              <p className={styles.primaryText}>{t('imageUpload.dragDrop')}</p>
              <p className={styles.secondaryText}>{t('imageUpload.clickToChoose')}</p>
              <p className={styles.hint}>{t('imageUpload.hint', { size: maxSize })}</p>
            </div>
          )}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default ImageUpload;
