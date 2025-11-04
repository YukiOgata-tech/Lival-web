// src/components/admin/ReviewItem.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Blog, ReviewTemplate } from '@/lib/types/blog'
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Calendar, 
  Clock, 
  Tag, 
  Folder, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Eye
} from 'lucide-react'

interface ReviewItemProps {
  blog: Blog
  onReview: (blogId: string, action: 'approved' | 'rejected' | 'revise', comments?: string) => void
  onSelect: () => void
  templates: ReviewTemplate[]
}

export default function ReviewItem({ blog, onReview, onSelect, templates }: ReviewItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'revise' | null>(null)
  const [customComments, setCustomComments] = useState('')
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeSinceSubmission = () => {
    const now = new Date()
    const submitted = new Date(blog.createdAt)
    const diffHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return `${diffHours}時間前`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}日前`
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewAction) return

    setLoading(true)

    try {
      let finalComments = customComments

      // Add template feedback if selected
      if (selectedTemplates.length > 0) {
        const templateText = selectedTemplates
          .map(templateId => {
            const template = templates.find(t => t.id === templateId)
            return template ? `【${template.title}】\n${template.content}` : ''
          })
          .filter(text => text)
          .join('\n\n')
        
        if (templateText) {
          finalComments = templateText + (customComments ? `\n\n【追加コメント】\n${customComments}` : '')
        }
      }

      await onReview(blog.id, reviewAction, finalComments || undefined)
    } catch (error) {
      console.error('Review submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const wordCount = blog.content?.replace(/<[^>]*>/g, '').length || 0
  const readTime = Math.ceil(wordCount / 200)

  return (
    <motion.div
      layout
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="p-2 sm:p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
              {blog.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              <div className="hidden sm:flex items-center space-x-1">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{blog.authorName || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{getTimeSinceSubmission()}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{wordCount.toLocaleString()}文字 • {readTime}分</span>
              </div>
            </div>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              {blog.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-100 text-purple-800 text-[10px] sm:text-xs rounded-full"
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {category}
                </span>
              ))}
              {blog.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{blog.tags.length - 3}個のタグ
                </span>
              )}
            </div>

            {/* Excerpt */}
            <p className="text-gray-700 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          <div className="ml-2.5 sm:ml-4 flex flex-col items-end space-y-1.5 sm:space-y-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <button
              onClick={onSelect}
              className="flex items-center px-2 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              詳細
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 bg-gray-50"
          >
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
              {/* Review Actions */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">審査アクション</h4>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3">
                  <button
                    onClick={() => setReviewAction(reviewAction === 'approved' ? null : 'approved')}
                    className={`p-3 rounded-lg border transition-colors text-left ${
                      reviewAction === 'approved'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="font-medium">承認</span>
                    </div>
                    <p className="text-sm text-gray-600">記事を公開して読者に配信</p>
                  </button>

                  <button
                    onClick={() => setReviewAction(reviewAction === 'revise' ? null : 'revise')}
                    className={`p-3 rounded-lg border transition-colors text-left ${
                      reviewAction === 'revise'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:border-yellow-300 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      <span className="font-medium">差し戻し</span>
                    </div>
                    <p className="text-sm text-gray-600">修正が必要な点をフィードバック</p>
                  </button>

                  <button
                    onClick={() => setReviewAction(reviewAction === 'rejected' ? null : 'rejected')}
                    className={`p-3 rounded-lg border transition-colors text-left ${
                      reviewAction === 'rejected'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      <span className="font-medium">却下</span>
                    </div>
                    <p className="text-sm text-gray-600">公開基準に満たないため却下</p>
                  </button>
                </div>
              </div>

              {/* Template Selection (for revise/reject) */}
              {(reviewAction === 'revise' || reviewAction === 'rejected') && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    <MessageSquare className="inline w-4 h-4 mr-1" />
                    フィードバックテンプレート
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates.map(template => (
                      <label
                        key={template.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTemplates.includes(template.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedTemplates.includes(template.id)}
                            onChange={() => handleTemplateToggle(template.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium text-gray-900">{template.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {template.content}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Comments */}
              {reviewAction && reviewAction !== 'approved' && (
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">
                    追加コメント
                  </label>
                  <textarea
                    value={customComments}
                    onChange={(e) => setCustomComments(e.target.value)}
                    placeholder="具体的な修正点や改善提案を記入してください..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>
              )}

              {/* Submit Button */}
              {reviewAction && (
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmitReview}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      reviewAction === 'approved'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : reviewAction === 'revise'
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {loading ? '処理中...' : 
                     reviewAction === 'approved' ? '承認する' :
                     reviewAction === 'revise' ? '差し戻す' : '却下する'
                    }
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
