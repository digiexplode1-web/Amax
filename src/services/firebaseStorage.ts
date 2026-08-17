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

export function compressDataUrl(
  dataUrl: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve(dataUrl);
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
  });
}

export function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        // If image loading fails, fallback to raw reader result
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (err) => reject(err);
  });
}

export function fileToBase64(file: File): Promise<string> {
  return compressImage(file, 800, 800, 0.75);
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

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    return await new Promise<UploadResult>((resolve, reject) => {
      let isDone = false;

      // 3 second timeout for slow/blocked Firebase Storage
      const timeoutId = setTimeout(async () => {
        if (!isDone) {
          isDone = true;
          console.warn("Firebase Storage upload timed out, falling back to Base64 Data URL.");
          try {
            uploadTask.cancel();
          } catch (e) {
            /* ignore cancel error */
          }
          if (onProgress) onProgress(100);
          const base64Url = await fileToBase64(file);
          resolve({
            url: base64Url,
            storagePath: `base64/${Date.now()}-${safeName}`,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          });
        }
      }, 3000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (isDone) return;
          const progress = snapshot.totalBytes > 0 
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
            : 0;
          if (onProgress) {
            onProgress(progress);
          }
        },
        async (error) => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timeoutId);
          console.warn("Firebase Storage upload failed, falling back to Base64 Data URL:", error);
          if (onProgress) onProgress(100);
          try {
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: `base64/${Date.now()}-${safeName}`,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          } catch (bErr) {
            reject(new Error(`Image read failed: ${error.message}`));
          }
        },
        async () => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timeoutId);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storagePath,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          } catch (err: any) {
            console.warn("Failed to get Firebase download URL, falling back to Base64:", err);
            if (onProgress) onProgress(100);
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: `base64/${Date.now()}-${safeName}`,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn("Firebase Storage reference error, falling back to Base64:", err);
    if (onProgress) onProgress(100);
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      storagePath: `base64/${Date.now()}-${safeName}`,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    };
  }
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

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    return await new Promise<UploadResult>((resolve, reject) => {
      let isDone = false;

      const timeoutId = setTimeout(async () => {
        if (!isDone) {
          isDone = true;
          console.warn("Firebase Storage upload timed out, falling back to Base64 Data URL.");
          try {
            uploadTask.cancel();
          } catch (e) {}
          if (onProgress) onProgress(100);
          const base64Url = await fileToBase64(file);
          resolve({
            url: base64Url,
            storagePath: `base64/${uniqueFileName}`,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          });
        }
      }, 3000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (isDone) return;
          const progress = snapshot.totalBytes > 0 
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) 
            : 0;
          if (onProgress) {
            onProgress(progress);
          }
        },
        async (error) => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timeoutId);
          console.warn("Firebase Storage upload failed, falling back to Base64 Data URL:", error);
          if (onProgress) onProgress(100);
          try {
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: `base64/${uniqueFileName}`,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          } catch (bErr) {
            reject(new Error(`Image read failed: ${error.message}`));
          }
        },
        async () => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timeoutId);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storagePath,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          } catch (err: any) {
            if (onProgress) onProgress(100);
            const base64Url = await fileToBase64(file);
            resolve({
              url: base64Url,
              storagePath: `base64/${uniqueFileName}`,
              fileName: file.name,
              contentType: file.type,
              size: file.size,
            });
          }
        }
      );
    });
  } catch (err) {
    if (onProgress) onProgress(100);
    const base64Url = await fileToBase64(file);
    return {
      url: base64Url,
      storagePath: `base64/${uniqueFileName}`,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    };
  }
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
