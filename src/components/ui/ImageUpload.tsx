import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  existingImage?: string;
  maxSize?: number; // in MB
}

const ImageUpload = ({ 
  onImageUpload, 
  existingImage, 
  maxSize = 5 
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(existingImage || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Reset error
    setError(null);

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Bilden är för stor. Max storlek är ${maxSize}MB.`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Endast bildfiler är tillåtna.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set uploading state
    setUploading(true);

    try {
      // Call parent callback with the file
      await onImageUpload(file);
      console.log('✅ Bild uppladdad framgångsrikt');
    } catch (error) {
      console.error('❌ Fel vid bilduppladdning:', error);
      setError('Kunde inte ladda upp bilden. Försök igen.');
      setPreview(existingImage || null);
    } finally {
      setUploading(false);
    }
  }, [onImageUpload, maxSize, existingImage]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    setError(null);
    // You might want to call a callback here to notify parent
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Produktbild</label>
      
      {preview ? (
        <div className={styles.previewContainer}>
          <img 
            src={preview} 
            alt="Produktbild förhandsvisning" 
            className={styles.preview}
          />
          <div className={styles.previewOverlay}>
            <button
              type="button"
              onClick={removeImage}
              className={styles.removeButton}
              title="Ta bort bild"
            >
              ✕
            </button>
            <div 
              {...getRootProps()} 
              className={styles.changeButton}
            >
              <input {...getInputProps()} />
              📷 Byt bild
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
              <p>Laddar upp bild...</p>
            </div>
          ) : isDragActive ? (
            <div className={styles.dragMessage}>
              <p>📤 Släpp bilden här</p>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.icon}>📷</div>
              <p className={styles.primaryText}>
                Dra och släpp en bild här
              </p>
              <p className={styles.secondaryText}>
                eller klicka för att välja en fil
              </p>
              <p className={styles.hint}>
                PNG, JPG, WEBP upp till {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;