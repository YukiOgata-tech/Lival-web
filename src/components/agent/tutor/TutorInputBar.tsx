'use client'

import { useEffect, useRef, useState } from 'react'
import { resizeImageToDataURL } from '@/lib/utils/image'

type ImageItem = { id: string; url: string; file?: File }

export default function TutorInputBar({
  disabled,
  onSend,
}: {
  disabled?: boolean
  onSend: (payload: { text: string; images: string[]; files: File[] }) => void
}) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const handler = () => {
      window.dispatchEvent(new Event('planner-input-focus'))
    }
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  const pickFiles = () => fileRef.current?.click()

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const toAdd: ImageItem[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (!f.type.startsWith('image/')) continue
      const dataUrl = await resizeImageToDataURL(f, 1024)
      toAdd.push({ id: crypto.randomUUID(), url: dataUrl, file: f })
    }
    setImages((prev) => {
      const next = [...prev, ...toAdd].slice(0, 4)
      return next
    })
  }

  const removeImage = (id: string) => setImages((prev) => prev.filter((x) => x.id !== id))

  const send = () => {
    if (disabled) return
    const payload = { text: text.trim(), images: images.map((x) => x.url), files: images.map((x) => x.file!).filter(Boolean) }
    if (!payload.text && payload.images.length === 0) return
    onSend(payload)
    setText('')
    setImages([])
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur-sm safe-area-inset-bottom">
      <div className="mx-auto max-w-3xl p-3 pb-3">
        {images.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="preview" className="h-16 w-16 rounded object-cover border" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -right-2 -top-2 rounded-full bg-black/70 p-1 text-white"
                  aria-label="画像を削除"
                >
                  <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={pickFiles}
            className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            title="画像を添付（最大4枚）"
          >
            画像
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="質問を入力（画像添付に対応）"
            rows={1}
            className="min-h-[40px] flex-1 resize-none text-black rounded-md border border-gray-300 p-2 text-base shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            style={{ fontSize: '16px' }}
          />
          <button
            onClick={send}
            disabled={disabled}
            className={`rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 ${disabled ? 'opacity-60' : ''}`}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  )
}
