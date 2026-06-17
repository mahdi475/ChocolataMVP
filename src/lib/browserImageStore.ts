const DB_NAME = 'chocolata-image-store';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const IMAGE_URL_PREFIX = 'chocolata-image://';
const MAX_IMAGE_DIMENSION = 1800;
const IMAGE_QUALITY = 0.82;

export class BrowserImageStoreError extends Error {
  code: 'storage-limit' | 'unsupported' | 'save-failed' | 'not-found';

  constructor(code: BrowserImageStoreError['code'], message: string) {
    super(message);
    this.name = 'BrowserImageStoreError';
    this.code = code;
  }
}

export const isBrowserStoredImageUrl = (src?: string | null) =>
  Boolean(src?.startsWith(IMAGE_URL_PREFIX));

const imageIdFromUrl = (src: string) => src.replace(IMAGE_URL_PREFIX, '');

const createImageUrl = (id: string) => `${IMAGE_URL_PREFIX}${id}`;

const openImageDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new BrowserImageStoreError('unsupported', 'IndexedDB is not available.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onerror = () => reject(request.error || new Error('Unable to open image store.'));
    request.onsuccess = () => resolve(request.result);
  });

const runImageStoreTransaction = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
) => {
  const db = await openImageDb();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = action(store);

    request.onerror = () => reject(request.error || new Error('Image store request failed.'));
    request.onsuccess = () => resolve(request.result);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error('Image store transaction failed.'));
    };
  });
};

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to read image file.'));
    };
    image.src = objectUrl;
  });

export const compressImageFile = async (file: File): Promise<Blob> => {
  const image = await loadImageElement(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new BrowserImageStoreError('unsupported', 'Canvas image processing is not available.');
  }

  context.drawImage(image, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        reject(new BrowserImageStoreError('save-failed', 'Unable to optimize image.'));
      },
      file.type === 'image/png' ? 'image/png' : 'image/webp',
      IMAGE_QUALITY,
    );
  });
};

const isQuotaError = (error: unknown) =>
  error instanceof DOMException && (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
  );

export const saveBrowserImage = async (file: File) => {
  const blob = await compressImageFile(file);
  const id = `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;

  try {
    await runImageStoreTransaction('readwrite', (store) =>
      store.put({
        id,
        blob,
        type: blob.type,
        name: file.name,
        size: blob.size,
        createdAt: new Date().toISOString(),
      }),
    );
  } catch (error) {
    if (isQuotaError(error)) {
      throw new BrowserImageStoreError('storage-limit', 'Browser image storage limit reached.');
    }
    throw new BrowserImageStoreError('save-failed', 'Unable to save image.');
  }

  return createImageUrl(id);
};

export const resolveBrowserImageUrl = async (src?: string | null) => {
  if (!src || !isBrowserStoredImageUrl(src)) return src || '';

  const id = imageIdFromUrl(src);
  const record = await runImageStoreTransaction<{
    id: string;
    blob: Blob;
  } | undefined>('readonly', (store) => store.get(id));

  if (!record?.blob) {
    throw new BrowserImageStoreError('not-found', 'Stored image was not found.');
  }

  return URL.createObjectURL(record.blob);
};

export const deleteBrowserImage = async (src?: string | null) => {
  if (!src || !isBrowserStoredImageUrl(src)) return;
  await runImageStoreTransaction('readwrite', (store) => store.delete(imageIdFromUrl(src)));
};

export const isInlineImageData = (src?: string | null) =>
  Boolean(src?.startsWith('data:image/'));

