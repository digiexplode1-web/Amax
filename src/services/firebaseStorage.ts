import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadResult {
  url: string;
  storagePath: string;
  fileName: string;
  contentType: string;
  size: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type (${file.type || 'unknown'}). Please upload JPEG, PNG, WEBP, or GIF images.` 
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `Image is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.` 
    };
  }
  return { valid: true };
}

export async function uploadProductImage(
  file: File,
  productId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `products/${productId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise<UploadResult>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
          : 0;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("PRODUCT IMAGE UPLOAD ERROR:", error);
        reject(new Error(`Firebase Storage upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            storagePath,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          });
        } catch (err: any) {
          console.error("Failed to get download URL:", err);
          reject(new Error(`Failed to get download URL: ${err.message}`));
        }
      }
    );
  });
}

export async function uploadImage(
  file: File,
  pathPrefix: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`;
  const cleanPrefix = pathPrefix.replace(/\/$/, '');
  const storagePath = `${cleanPrefix}/${uniqueFileName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise<UploadResult>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 
          ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
          : 0;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error("STORAGE UPLOAD ERROR:", error);
        reject(new Error(`Firebase Storage upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadUrl,
            storagePath,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          });
        } catch (err: any) {
          reject(new Error(`Failed to get image download URL: ${err.message}`));
        }
      }
    );
  });
}

export async function deleteImage(storagePath: string): Promise<void> {
  if (!storagePath) return;
  
  if (storagePath.startsWith('base64/')) return;

  try {
    let path = storagePath;
    if (storagePath.includes('firebasestorage.googleapis.com')) {
      const decoded = decodeURIComponent(storagePath);
      const match = decoded.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        path = match[1];
      }
    }
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Could not delete file from Storage (may already be removed):', err);
  }
}
