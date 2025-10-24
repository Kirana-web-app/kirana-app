export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  outputFormat?: "image/jpeg" | "image/webp" | "image/png";
  maxSizeKB?: number; // Maximum size in KB
}

export interface CompressionResult {
  compressedImage: string; // base64 string
  originalSize: number; // in bytes
  compressedSize: number; // in bytes
  compressionRatio: number; // percentage
}

/**
 * Compresses an image file to a very small size suitable for Firestore storage
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compression result
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const {
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.6,
    outputFormat = "image/jpeg",
    maxSizeKB = 50, // 50KB max for Firestore
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    if (!ctx) {
      reject(new Error("Unable to get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress the image
      ctx.drawImage(img, 0, 0, width, height);

      // Start with the specified quality
      let currentQuality = quality;
      let compressedDataUrl = canvas.toDataURL(outputFormat, currentQuality);

      // Reduce quality until we get under the size limit
      while (
        getBase64SizeInKB(compressedDataUrl) > maxSizeKB &&
        currentQuality > 0.1
      ) {
        currentQuality -= 0.05;
        compressedDataUrl = canvas.toDataURL(outputFormat, currentQuality);
      }

      // If still too large, reduce dimensions further
      if (getBase64SizeInKB(compressedDataUrl) > maxSizeKB) {
        const scaleFactor = 0.8;
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        compressedDataUrl = canvas.toDataURL(outputFormat, currentQuality);
      }

      const originalSize = file.size;
      const compressedSize = getBase64SizeInBytes(compressedDataUrl);
      const compressionRatio =
        ((originalSize - compressedSize) / originalSize) * 100;

      resolve({
        compressedImage: compressedDataUrl,
        originalSize,
        compressedSize,
        compressionRatio,
      });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Read the file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Calculates the size of a base64 string in bytes
 * @param base64String - The base64 encoded string
 * @returns Size in bytes
 */
export const getBase64SizeInBytes = (base64String: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64String.split(",")[1] || base64String;

  // Calculate size: each base64 character represents 6 bits
  // Padding characters (=) don't contribute to size
  const padding = (base64Data.match(/=/g) || []).length;
  return Math.floor((base64Data.length * 3) / 4) - padding;
};

/**
 * Calculates the size of a base64 string in KB
 * @param base64String - The base64 encoded string
 * @returns Size in KB
 */
export const getBase64SizeInKB = (base64String: string): number => {
  return getBase64SizeInBytes(base64String) / 1024;
};

/**
 * Validates if an image size is suitable for Firestore storage
 * @param base64String - The base64 encoded image
 * @param maxSizeKB - Maximum allowed size in KB (default: 50KB)
 * @returns Boolean indicating if size is acceptable
 */
export const isImageSizeSuitable = (
  base64String: string,
  maxSizeKB: number = 50
): boolean => {
  return getBase64SizeInKB(base64String) <= maxSizeKB;
};

/**
 * Formats file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB", "250 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Preset compression options for different use cases
 */
export const COMPRESSION_PRESETS = {
  // Ultra compressed for Firestore storage
  FIRESTORE: {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.5,
    outputFormat: "image/jpeg" as const,
    maxSizeKB: 30,
  },

  // Thumbnail size
  THUMBNAIL: {
    maxWidth: 150,
    maxHeight: 150,
    quality: 0.6,
    outputFormat: "image/jpeg" as const,
    maxSizeKB: 20,
  },

  // Profile picture
  PROFILE: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.7,
    outputFormat: "image/jpeg" as const,
    maxSizeKB: 50,
  },

  // Small display image
  SMALL: {
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 2,
    outputFormat: "image/jpeg" as const,
    maxSizeKB: 300,
  },
} as const;
