'use client'

import { useState, useEffect } from 'react'
import { getCachedImage, cacheImage } from '@/lib/tutorImageCache'

/**
 * 複数のストレージURLを受け取り、キャッシュまたはネットワークから画像を取得して
 * Object URLの配列を返すカスタムフック。
 *
 * @param storageUrls - Firebase Storageなどの公開画像URLの配列
 * @returns { imageUrls: string[], isLoading: boolean } - 表示用のObject URL配列とローディング状態
 */
export function useImageCache(storageUrls: string[] | undefined) {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!storageUrls || storageUrls.length === 0) {
      setIsLoading(false)
      return
    }

    let revoked: string[] = []
    let isCancelled = false

    const fetchImages = async () => {
      setIsLoading(true)
      const objectUrls: string[] = []

      for (const url of storageUrls) {
        if (isCancelled) break

        try {
          const cachedUrl = await getCachedImage(url)
          if (cachedUrl) {
            objectUrls.push(cachedUrl)
            continue
          }

          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`)
          
          const blob = await res.blob()
          await cacheImage(url, blob)
          
          const objectUrl = URL.createObjectURL(blob)
          objectUrls.push(objectUrl)
          revoked.push(objectUrl) // 後で解放するために記録
        } catch (error) {
          console.error(`[useImageCache] Failed to load image from ${url}:`, error)
          // エラー時でも、部分的に成功した画像は表示する
        }
      }

      if (!isCancelled) {
        setImageUrls(objectUrls)
        setIsLoading(false)
      }
    }

    fetchImages()

    return () => {
      isCancelled = true
      // コンポーネントのアンマウント時にObject URLを解放
      ;[...revoked, ...imageUrls].forEach((url) => {
        // createObjectURLで生成されたURLのみを対象
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageUrls?.join('|')]) // URLの配列が変更されたら再実行

  return { imageUrls, isLoading }
}
