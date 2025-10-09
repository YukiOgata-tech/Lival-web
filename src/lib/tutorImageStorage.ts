import { storage, auth } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage'

export async function uploadTutorImageWeb(
  file: File,
  threadId: string,
  messageId: string
): Promise<{ storageUrl: string }> {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('User not authenticated')

  const resizedBlob = await resizeImage(file, 1024, 0.8)

  const timestamp = Date.now()
  const filename = `${messageId}_${timestamp}.jpg`
  const storagePath = `tutor_images/${uid}/${threadId}/${filename}`
  const storageRef = ref(storage, storagePath)

  await uploadBytes(storageRef, resizedBlob)
  const downloadUrl = await getDownloadURL(storageRef)
  return { storageUrl: downloadUrl }
}

async function resizeImage(file: File, maxWidth: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      canvas.width = w
      canvas.height = h
      ctx?.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to create blob'))
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export async function deleteThreadImages(threadId: string): Promise<number> {
  const uid = auth.currentUser?.uid
  if (!uid) return 0
  const folderRef = ref(storage, `tutor_images/${uid}/${threadId}`)
  const list = await listAll(folderRef)
  let count = 0
  await Promise.all(
    list.items.map(async (item) => {
      try {
        await deleteObject(item)
        count++
      } catch {
        // ignore individual failures
      }
    })
  )
  return count
}
