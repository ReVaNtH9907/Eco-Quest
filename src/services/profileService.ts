/**
 * Profile & Avatar Management Service
 * Validates file types and sizes, handles local storage encoding,
 * prepared for future Supabase storage bucket integration.
 */

export const MAX_AVATAR_BYTES = 2.5 * 1024 * 1024; // 2.5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface AvatarValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAvatarFile(file: File): AvatarValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.'
    };
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 2.5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Encodes a local image file into a base64 Data URL.
 * In a future Supabase integration, this function will upload to supabase.storage.from('avatars').
 */
export function processAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
