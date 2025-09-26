'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  compressImage, 
  validateImageFile, 
  getBase64Size, 
  isBase64SizeAcceptable,
  CompressionOptions 
} from '@/utils/imageUtils'

interface ImageUploadProps {
  value?: string
  onChange: (imageData: string) => void
  label?: string
  className?: string
  compressionOptions?: CompressionOptions
  disabled?: boolean
}

export function ImageUpload({
  value = '',
  onChange,
  label = 'Image',
  className = '',
  compressionOptions = {},
  disabled = false
}: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    setErrors([])
    
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsProcessing(true)
    setProcessingProgress(0)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const compressedImage = await compressImage(file, compressionOptions)
      
      clearInterval(progressInterval)
      setProcessingProgress(100)

      // Check if compressed image is within size limits
      if (!isBase64SizeAcceptable(compressedImage)) {
        setErrors([`Compressed image is still too large (${getBase64Size(compressedImage)}KB). Try a smaller image.`])
        return
      }

      setTimeout(() => {
        onChange(compressedImage)
        setProcessingProgress(0)
      }, 500)

    } catch (error) {
      setErrors(['Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error')])
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }, [onChange, compressionOptions])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0] && !disabled) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect, disabled])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0] && !disabled) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect, disabled])

  const clearImage = useCallback(() => {
    onChange('')
    setErrors([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onChange])

  const triggerFileSelect = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
        {value && (
          <Badge variant="outline" className="ml-2 text-xs">
            {getBase64Size(value)}KB
          </Badge>
        )}
      </label>
      
      <Card className={`relative transition-all duration-200 ${
        dragActive ? 'border-amber-500 bg-amber-50' : 'border-slate-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}`}>
        <CardContent 
          className="p-6"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <AnimatePresence mode="wait">
            {value ? (
              <motion.div
                key="image-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="relative mx-auto w-fit">
                  <img
                    src={value}
                    alt="Preview"
                    className="mx-auto h-48 w-48 object-cover rounded-xl border-2 border-slate-200 shadow-sm"
                    onError={(e) => {
                      console.error('Image load error')
                      clearImage()
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={clearImage}
                      className="h-8 w-8 p-0 rounded-full shadow-md"
                      disabled={disabled || isProcessing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-slate-600 font-medium">Image uploaded successfully</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileSelect}
                    disabled={disabled || isProcessing}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-slate-400" />
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={triggerFileSelect}
                    disabled={disabled || isProcessing}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Upload an image
                  </Button>
                  <p className="text-slate-500 text-sm mt-1">or drag and drop</p>
                </div>
                
                <p className="text-xs text-slate-400">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg"
              >
                <div className="text-center space-y-3 max-w-xs">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                      Compressing image...
                    </p>
                    <Progress value={processingProgress} className="w-32" />
                    <p className="text-xs text-slate-500">
                      {processingProgress}% complete
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
        disabled={disabled || isProcessing}
      />
      
      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helpful Info */}
      {!value && !errors.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-slate-500 space-y-1"
        >
          <p>• Images are automatically compressed to 400×400px</p>
          <p>• Stored as optimized base64 data (no external storage needed)</p>
          <p>• Recommended: High-quality images work best for compression</p>
        </motion.div>
      )}
    </div>
  )
}