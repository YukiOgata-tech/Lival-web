// src/lib/firebase/storage.ts
import { storage } from '../firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

export interface ImageUploadResult {
  id: string
  url: string
  originalName: string
  size: number
  width: number
  height: number
  uploaderId: string
  uploadedAt: Date
}

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'webp' | 'png'
}

class StorageService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  // Canvas-based image compression and resizing
  private async optimizeImage(
    file: File, 
    options: ImageOptimizationOptions = {}
  ): Promise<{ blob: Blob; width: number; height: number }> {
    const {
      maxWidth = 1200,
      maxHeight = 800,
      quality = 0.8,
      format = 'jpeg'
    } = options

    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context not supported'))
        return
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }

        // Set canvas size
        canvas.width = width
        canvas.height = height

        // Draw and compress image
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height })
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          `image/${format}`,
          quality
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Validate file before upload
  private validateFile(file: File): void {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('サポートされていないファイル形式です。JPEG、PNG、WebP、GIFのみ対応しています。')
    }

    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。')
    }
  }

  // Upload image to Firebase Storage with optimization
  async uploadImage(
    file: File,
    uploaderId: string,
    path: string = 'blog-images',
    options: ImageOptimizationOptions = {}
  ): Promise<ImageUploadResult> {
    try {
      // Validate file
      this.validateFile(file)

      // Optimize image
      const { blob, width, height } = await this.optimizeImage(file, options)

      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${sanitizedName}`
      const storagePath = `${path}/${uploaderId}/${fileName}`

      // Upload to Firebase Storage
      const storageRef = ref(storage, storagePath)
      const snapshot = await uploadBytes(storageRef, blob)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Save metadata to Firestore
      const uploadData = {
        originalName: file.name,
        fileName: fileName,
        storagePath: storagePath,
        url: downloadURL,
        size: blob.size,
        originalSize: file.size,
        width,
        height,
        uploaderId,
        uploadedAt: new Date(),
        compressionRatio: Math.round((1 - blob.size / file.size) * 100)
      }

      const docRef = await addDoc(collection(db, 'imageUploads'), uploadData)

      return {
        id: docRef.id,
        url: downloadURL,
        originalName: file.name,
        size: blob.size,
        width,
        height,
        uploaderId,
        uploadedAt: uploadData.uploadedAt
      }

    } catch (error) {
      console.error('Image upload error:', error)
      throw error instanceof Error ? error : new Error('画像のアップロードに失敗しました')
    }
  }

  // Delete image from Storage and Firestore
  async deleteImage(imageId: string, uploaderId: string): Promise<void> {
    try {
      // Get image metadata from Firestore
      const imageDoc = await doc(db, 'imageUploads', imageId)
      
      // Delete from Storage
      const storageRef = ref(storage, `blog-images/${uploaderId}/${imageId}`)
      await deleteObject(storageRef)

      // Delete metadata from Firestore
      await deleteDoc(imageDoc)

    } catch (error) {
      console.error('Image deletion error:', error)
      throw new Error('画像の削除に失敗しました')
    }
  }

  // Bulk upload with progress tracking
  async uploadImages(
    files: File[],
    uploaderId: string,
    onProgress?: (progress: number, currentFile: number, totalFiles: number) => void
  ): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = []

    for (let i = 0; i < files.length; i++) {
      try {
        onProgress?.(0, i + 1, files.length)

        const result = await this.uploadImage(files[i], uploaderId)
        results.push(result)
        
        onProgress?.(100, i + 1, files.length)
      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error)
        // Continue with other files instead of failing completely
      }
    }

    return results
  }

  // Generate different sized versions of an image
  async uploadImageVariants(
    file: File,
    uploaderId: string
  ): Promise<{
    thumbnail: ImageUploadResult
    medium: ImageUploadResult
    original: ImageUploadResult
  }> {
    const [thumbnail, medium, original] = await Promise.all([
      this.uploadImage(file, uploaderId, 'blog-images/thumbnails', {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
        format: 'webp'
      }),
      this.uploadImage(file, uploaderId, 'blog-images/medium', {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.8,
        format: 'webp'
      }),
      this.uploadImage(file, uploaderId, 'blog-images/original', {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.9
      })
    ])

    return { thumbnail, medium, original }
  }
}

export const storageService = new StorageService()