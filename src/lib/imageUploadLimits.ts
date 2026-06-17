export const IMAGE_MAX_SIZE_MB = 20;
export const IMAGE_MAX_SIZE_BYTES = IMAGE_MAX_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const isAcceptedImageType = (file: File) => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
export const isAcceptedImageSize = (file: File) => file.size <= IMAGE_MAX_SIZE_BYTES;
