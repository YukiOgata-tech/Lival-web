// src/components/blog/SocialShare.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link2, 
  Mail,
  MessageCircle,
  Check,
  Copy
} from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  via?: string
  className?: string
}

interface SharePlatform {
  name: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  getUrl: (params: ShareUrlParams) => string
}

interface ShareUrlParams {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  via?: string
}

const sharePlatforms: SharePlatform[] = [
  {
    name: 'Twitter',
    icon: <Twitter className="w-5 h-5" />,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    getUrl: ({ url, title, hashtags, via }) => {
      const params = new URLSearchParams({
        url,
        text: title,
        ...(hashtags && hashtags.length > 0 && { hashtags: hashtags.join(',') }),
        ...(via && { via })
      })
      return `https://twitter.com/intent/tweet?${params.toString()}`
    }
  },
  {
    name: 'Facebook',
    icon: <Facebook className="w-5 h-5" />,
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    getUrl: ({ url }) => {
      const params = new URLSearchParams({ u: url })
      return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
    }
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="w-5 h-5" />,
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
    getUrl: ({ url, title, description }) => {
      const params = new URLSearchParams({
        url,
        title,
        ...(description && { summary: description })
      })
      return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
    }
  },
  {
    name: 'LINE',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    getUrl: ({ url, title }) => {
      const params = new URLSearchParams({
        text: `${title} ${url}`
      })
      return `https://line.me/R/msg/text/?${params.toString()}`
    }
  },
  {
    name: 'Email',
    icon: <Mail className="w-5 h-5" />,
    color: 'bg-gray-500',
    hoverColor: 'hover:bg-gray-600',
    getUrl: ({ url, title, description }) => {
      const params = new URLSearchParams({
        subject: title,
        body: `${description || title}\n\n${url}`
      })
      return `mailto:?${params.toString()}`
    }
  }
]

export default function SocialShare({ 
  url, 
  title, 
  description, 
  hashtags = [], 
  via,
  className = '' 
}: SocialShareProps) {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform: SharePlatform) => {
    const shareUrl = platform.getUrl({ url, title, description, hashtags, via })
    
    // Open sharing window
    const width = 600
    const height = 400
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    window.open(
      shareUrl,
      `share-${platform.name}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )
    
    setShowModal(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (error) {
        console.error('Failed to share:', error)
      }
    } else {
      setShowModal(true)
    }
  }

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span>共有</span>
      </button>

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">記事を共有</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{title}</p>
              </div>

              {/* Share Platforms */}
              <div className="space-y-3 mb-6">
                {sharePlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className={`w-full flex items-center space-x-3 p-3 ${platform.color} text-white rounded-lg ${platform.hoverColor} transition-colors`}
                  >
                    {platform.icon}
                    <span className="font-medium">{platform.name}で共有</span>
                  </button>
                ))}
              </div>

              {/* Copy Link */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={handleCopyLink}
                  className={`w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg transition-colors ${
                    copied 
                      ? 'bg-green-50 border-green-300 text-green-700' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>コピーしました！</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>リンクをコピー</span>
                    </>
                  )}
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                閉じる
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Compact version for inline use
export function SocialShareCompact({ 
  url, 
  title, 
  description, 
  className = '' 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        console.error('Native share failed:', error)
      }
    } else {
      // Fallback for desktop browsers
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy URL:', error)
        alert('リンクのコピーに失敗しました。')
      }
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleShare}
        className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${
          copied 
            ? 'text-green-600 bg-green-50' 
            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
        }`}
        title={navigator.share ? '共有' : 'リンクをコピー'}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">コピーしました</span>
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">共有</span>
          </>
        )}
      </button>
    </div>
  )
}