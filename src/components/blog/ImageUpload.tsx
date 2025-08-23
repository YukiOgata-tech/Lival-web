// src/components/blog/ImageUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { storageService, ImageUploadResult } from '@/lib/firebase/storage'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  AlertCircle,
  CheckCircle,
  FileImage,
  Trash2
} from 'lucide-react'

interface ImageUploadProps {
  onUpload: (images: ImageUploadResult[]) => void
  onRemove?: (imageId: string) => void
  maxFiles?: number
  existingImages?: ImageUploadResult[]
  uploaderId: string
  className?: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  result?: ImageUploadResult
  error?: string
}

export default function ImageUpload({ 
  onUpload, 
  onRemove,
  maxFiles = 5, 
  existingImages = [],
  uploaderId,
  className = '' 
}: ImageUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    const remainingSlots = maxFiles - existingImages.length
    const filesToUpload = fileArray.slice(0, remainingSlots)

    if (fileArray.length > remainingSlots) {
      alert(`最大${maxFiles}枚までアップロードできます。${remainingSlots}枚のみアップロードします。`)
    }

    uploadFiles(filesToUpload)
  }

  const uploadFiles = async (files: File[]) => {
    // Initialize progress tracking
    const initialProgress: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))
    
    setUploadProgress(initialProgress)

    const results: ImageUploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      try {
        // Update progress for current file
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, progress: 50 } : item
        ))

        const result = await storageService.uploadImage(files[i], uploaderId)
        results.push(result)

        // Update success status
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, progress: 100, status: 'success', result } : item
        ))

      } catch (error) {
        // Update error status
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { 
            ...item, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'アップロードに失敗しました'
          } : item
        ))
      }
    }

    // Call onUpload with successful results
    if (results.length > 0) {
      onUpload(results)
    }

    // Clear progress after delay
    setTimeout(() => {
      setUploadProgress([])
    }, 3000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const canUploadMore = existingImages.length + uploadProgress.filter(p => p.status === 'success').length < maxFiles

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          <div className="space-y-2">
            <Upload className={`w-8 h-8 mx-auto ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                クリックまたはドラッグ&ドロップで画像をアップロード
              </p>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP, GIF対応 • 最大5MB • {maxFiles - existingImages.length}枚まで追加可能
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            アップロード済み画像 ({existingImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {existingImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-b-lg">
                  <p className="truncate">{image.originalName}</p>
                  <p>{formatFileSize(image.size)}</p>
                </div>
                {onRemove && (
                  <button
                    onClick={() => onRemove(image.id)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-900">アップロード中</h4>
            {uploadProgress.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900 truncate">
                      {item.file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(item.file.size)})
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {item.status === 'uploading' && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                {item.status === 'uploading' && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
                
                {/* Error Message */}
                {item.status === 'error' && item.error && (
                  <p className="text-xs text-red-600 mt-1">{item.error}</p>
                )}
                
                {/* Success Message */}
                {item.status === 'success' && (
                  <p className="text-xs text-green-600 mt-1">アップロード完了</p>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}