import { openDB, type DBSchema } from 'idb'

interface ImageCacheDB extends DBSchema {
  images: {
    key: string // storageUrl
    value: {
      url: string
      blob: Blob
      cachedAt: number
    }
  }
}

const isClient = typeof window !== 'undefined' && typeof indexedDB !== 'undefined'

let dbPromise: Promise<import('idb').IDBPDatabase<ImageCacheDB>> | null = null
async function getDB() {
  if (!isClient) return null
  if (!dbPromise) {
    dbPromise = openDB<ImageCacheDB>('tutor-image-cache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images')
        }
      },
    })
  }
  return dbPromise
}

export async function getCachedImage(storageUrl: string): Promise<string | null> {
  const db = await getDB()
  if (!db) return null
  const cached = await db.get('images', storageUrl)
  if (cached) {
    return URL.createObjectURL(cached.blob)
  }
  return null
}

export async function cacheImage(storageUrl: string, blob: Blob): Promise<void> {
  const db = await getDB()
  if (!db) return
  await db.put(
    'images',
    {
      url: storageUrl,
      blob,
      cachedAt: Date.now(),
    },
    storageUrl,
  )
}

export async function deleteCachedImage(storageUrl: string): Promise<void> {
  const db = await getDB()
  if (!db) return
  await db.delete('images', storageUrl)
}
