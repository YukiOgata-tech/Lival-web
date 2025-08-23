// src/components/blog/BlogSubmitForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import TiptapEditor from './TiptapEditor'
import { BlogCategory } from '@/lib/types/blog'
import { 
  Save, 
  Send, 
  Eye, 
  FileText, 
  Tag, 
  Folder, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface BlogSubmitFormProps {
  categories: BlogCategory[]
  userRole?: string // Add user role to determine admin privileges
}

interface FormData {
  title: string
  content: string
  categories: string[]
  tags: string[]
  visibility: 'public' | 'teaser' | 'premium'
  coverPath: string
}

const visibilityOptions = [
  {
    value: 'public' as const,
    label: '完全公開',
    description: '全ての読者が記事全文を読めます'
  },
  {
    value: 'teaser' as const,
    label: 'ティザー記事',
    description: '先頭300文字のみ無料、続きは有料'
  },
  {
    value: 'premium' as const,
    label: 'プレミアム限定',
    description: 'サブスク会員のみ閲覧可能'
  }
]

export default function BlogSubmitForm({ categories, userRole = 'free' }: BlogSubmitFormProps) {
  // Mock user ID - in real implementation, get from auth
  const mockUserId = 'user123'
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categories: [],
    tags: [],
    visibility: 'teaser',
    coverPath: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [showDirectPublishWarning, setShowDirectPublishWarning] = useState(false)
  
  const isAdmin = userRole === 'admin'

  const handleInputChange = (field: keyof FormData) => (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
    setSuccess(null)
  }

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }))
      }
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'タイトルは必須です'
    if (!formData.content.trim()) return 'コンテンツは必須です'
    if (formData.categories.length === 0) return '少なくとも1つのカテゴリを選択してください'
    if (formData.title.length > 100) return 'タイトルは100文字以内で入力してください'
    if (formData.content.length < 300) return 'コンテンツは300文字以上で入力してください'
    return null
  }

  const saveDraft = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '保存に失敗しました')
      }

      const result = await response.json()
      setSuccess('下書きを保存しました')
      
      // Redirect to edit page or blog list after a short delay
      setTimeout(() => {
        router.push('/blog?author=me')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const submitForReview = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First save as draft
      const saveResponse = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || '投稿に失敗しました')
      }

      const saveResult = await saveResponse.json()
      
      // Then submit for review
      const submitResponse = await fetch('/api/blogs/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogId: saveResult.blogId })
      })

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json()
        throw new Error(errorData.error || '審査申請に失敗しました')
      }

      setSuccess('審査申請が完了しました。結果をお待ちください。')
      
      // Redirect after success
      setTimeout(() => {
        router.push('/blog?author=me')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const directPublish = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Direct publish for admin
      const publishResponse = await fetch('/api/blogs/admin-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json()
        throw new Error(errorData.error || '公開に失敗しました')
      }

      setSuccess('記事を公開しました！')
      
      // Redirect after success
      setTimeout(() => {
        router.push('/blog')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : '公開に失敗しました')
    } finally {
      setLoading(false)
      setShowDirectPublishWarning(false)
    }
  }

  const handleDirectPublishClick = () => {
    setShowDirectPublishWarning(true)
  }

  const wordCount = formData.content.replace(/<[^>]*>/g, '').length
  const estimatedReadTime = Math.ceil(wordCount / 200)

  return (
    <div className="p-8">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">新規記事作成</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>文字数: {wordCount.toLocaleString()}</span>
          <span>推定読了時間: {estimatedReadTime}分</span>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-800">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
        >
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <span className="text-green-800">{success}</span>
        </motion.div>
      )}

      <form className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            記事タイトル *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title')(e.target.value)}
            placeholder="読者の興味を引く魅力的なタイトルを入力してください"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            maxLength={100}
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {formData.title.length}/100文字
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Folder className="inline w-4 h-4 mr-1" />
            カテゴリ *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.categories.includes(category.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('categories')([...formData.categories, category.name])
                    } else {
                      handleInputChange('categories')(
                        formData.categories.filter(c => c !== category.name)
                      )
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="inline w-4 h-4 mr-1" />
            タグ (最大5個)
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
            placeholder="タグを入力してEnterまたはカンマで追加"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={formData.tags.length >= 5}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            公開設定
          </label>
          <div className="space-y-3">
            {visibilityOptions.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={formData.visibility === option.value}
                  onChange={(e) => handleInputChange('visibility')(e.target.value)}
                  className="mt-1 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              <FileText className="inline w-4 h-4 mr-1" />
              記事コンテンツ *
            </label>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'エディタ' : 'プレビュー'}</span>
            </button>
          </div>
          
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <TiptapEditor
              content={formData.content}
              onChange={handleInputChange('content')}
              preview={previewMode}
              uploaderId={mockUserId}
            />
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            最小300文字必要 • 現在{wordCount}文字
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving || loading}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            下書き保存
          </button>

          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={submitForReview}
                disabled={loading || saving}
                className="flex items-center justify-center px-6 py-3 border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                審査申請
              </button>

              <button
                type="button"
                onClick={handleDirectPublishClick}
                disabled={loading || saving}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                即座に公開
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={submitForReview}
              disabled={loading || saving}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              審査申請
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500 text-center pt-4">
          {isAdmin ? (
            '管理者として、審査なしで即座に公開することも可能です。'
          ) : (
            '審査申請後、編集部による品質確認を経て公開されます。通常1-3営業日でご連絡いたします。'
          )}
        </div>
      </form>

      {/* Direct Publish Warning Modal */}
      {showDirectPublishWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">即座に公開の確認</h3>
                <p className="text-sm text-gray-600">この操作は取り消せません</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                記事を審査なしで即座に公開します。以下の点をご確認ください：
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>内容に誤りや不適切な表現がないか</li>
                <li>画像や引用の権利問題がないか</li>
                <li>読者にとって有益で質の高い内容か</li>
                <li>誤字脱字や文章の構成は適切か</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDirectPublishWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={directPublish}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                公開する
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}