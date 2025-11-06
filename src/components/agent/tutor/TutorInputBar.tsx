'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, X, Sparkles, ChevronUp } from 'lucide-react'
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
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const fileRef = useRef<HTMLInputElement | null>(null)

  // スクロール検知（モバイルのみ）
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          // スマホサイズのみスクロールで非表示
          if (window.innerWidth < 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsVisible(false)
            } else if (currentScrollY < lastScrollY) {
              setIsVisible(true)
            }
          }
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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
    <>
      {/* フローティングボタン（モバイルで非表示時のみ） */}
      <AnimatePresence>
        {!isVisible && window.innerWidth < 768 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(true)}
            className="fixed right-4 bottom-4 z-50 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 text-white shadow-2xl hover:shadow-emerald-300"
            aria-label="入力欄を表示"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          y: isVisible ? 0 : '100%',
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-xl safe-area-inset-bottom shadow-2xl"
      >
        <div className="mx-auto max-w-3xl p-4 pb-4">
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 overflow-hidden"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group flex-shrink-0"
                  >
                    <img
                      src={img.url}
                      alt="preview"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-gray-200 shadow-md group-hover:shadow-lg transition-shadow"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(img.id)}
                      className="absolute -right-2 -top-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 p-1.5 text-white shadow-lg hover:shadow-xl transition-shadow"
                      aria-label="画像を削除"
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={pickFiles}
            className="flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-3 text-gray-700 shadow-md hover:shadow-lg hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-600 transition-all"
            title="画像を添付（最大4枚）"
          >
            <ImageIcon className="w-5 h-5" />
          </motion.button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="質問を入力してください..."
              rows={1}
              className="w-full min-h-[48px] max-h-32 resize-none text-gray-900 bg-white placeholder:text-gray-400 rounded-xl border-2 border-gray-200 px-4 py-3 text-base shadow-md focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
              style={{ fontSize: '16px' }}
            />
            {text.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </motion.div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={send}
            disabled={disabled}
            className={`flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3.5 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs text-gray-500 text-center"
          >
            {images.length}/4枚の画像を添付中
          </motion.div>
        )}
      </div>
    </motion.div>
    </>
  )
}
