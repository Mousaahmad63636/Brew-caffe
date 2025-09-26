/**
 * Client-side image compression utilities for Better Menu
 * No Firebase Storage needed - stores base64 in Firestore
 */

export interface ImageValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Compresses an image file for menu display
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<string> Base64 encoded compressed image
 */
export const compressImage = (
  file: File, 
  options: CompressionOptions = {}
): Promise<string> => {
  const { maxWidth = 400, maxHeight = 400, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'))
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validates image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5MB)
 * @returns Validation result
 */
export const validateImageFile = (
  file: File, 
  maxSizeMB: number = 5
): ImageValidationResult => {
  const errors: string[] = []
  
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image (JPG, PNG, GIF, WebP)')
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`)
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPG, PNG, GIF, and WebP files are supported')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get estimated base64 size in KB
 * @param base64String - Base64 data URL
 * @returns Size in KB
 */
export const getBase64Size = (base64String: string): number => {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
  
  // Calculate size: (base64 length * 3) / 4 for actual bytes, then convert to KB
  return Math.round((base64Data.length * 3) / 4 / 1024)
}

/**
 * Check if base64 string is within Firestore limits
 * Firestore document limit is 1MB, so we keep images under 500KB for safety
 * @param base64String - Base64 data URL
 * @returns Boolean indicating if size is acceptable
 */
export const isBase64SizeAcceptable = (base64String: string): boolean => {
  const sizeKB = getBase64Size(base64String)
  return sizeKB <= 500 // Keep under 500KB for safety
}

/**
 * Generate a placeholder image data URL
 * @param width - Image width
 * @param height - Image height
 * @param text - Optional text to display
 * @returns Base64 data URL
 */
export const generatePlaceholderImage = (
  width: number = 400, 
  height: number = 400, 
  text: string = '🍽️'
): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  canvas.width = width
  canvas.height = height

  // Background
  ctx.fillStyle = '#f1f5f9'
  ctx.fillRect(0, 0, width, height)

  // Text
  ctx.fillStyle = '#64748b'
  ctx.font = `${Math.min(width, height) / 4}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)

  return canvas.toDataURL('image/png')
}

/**
 * Compress multiple images in batch
 * @param files - Array of image files
 * @param options - Compression options
 * @param onProgress - Progress callback
 * @returns Promise<string[]> Array of base64 compressed images
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const results: string[] = []
  
  for (let i = 0; i < files.length; i++) {
    try {
      const compressed = await compressImage(files[i], options)
      results.push(compressed)
    } catch (error) {
      console.error(`Failed to compress image ${i}:`, error)
      results.push('') // Push empty string for failed compressions
    }
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100)
    }
  }
  
  return results
}