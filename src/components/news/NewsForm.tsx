// src/components/news/NewsForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import TiptapEditor from '@/components/blog/TiptapEditor'
import { 
  NewsFormData, 
  NewsPriority, 
  NewsType, 
  NewsStatus,
  NEWS_PRIORITY_CONFIG,
  NEWS_TYPE_CONFIG,
  News
} from '@/lib/types/news'
import { 
  Save, 
  Send, 
  Eye, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Globe,
  Archive
} from 'lucide-react'

interface NewsFormProps {
  initialData?: News
  mode: 'create' | 'edit'
}

export default function NewsForm({ initialData, mode }: NewsFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<NewsFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    priority: initialData?.priority || 'normal',
    type: initialData?.type || 'general',
    status: initialData?.status || 'draft'
  })

  // フォームバリデーション
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルを入力してください'
    } else if (formData.title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください'
    }

    if (!formData.content.trim()) {
      newErrors.content = '内容を入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // フォーム送信
  const handleSubmit = async (status: NewsStatus) => {
    if (!validateForm()) return
    if (!user) return

    setIsSubmitting(true)
    try {
      const submitData = {
        ...formData,
        status
      }

      const response = await fetch(
        mode === 'create' ? '/api/news' : `/api/news/${initialData?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        }
      )

      if (!response.ok) {
        throw new Error('保存に失敗しました')
      }

      const result = await response.json()
      
      // 成功メッセージ表示
      const message = status === 'published' ? 'お知らせを公開しました' : 'お知らせを保存しました'
      alert(message)

      // 一覧ページに戻る
      router.push('/admin/news')
    } catch (error) {
      console.error('Submit error:', error)
      alert(error instanceof Error ? error.message : '保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // プレビュー機能
  const handlePreview = () => {
    if (!validateForm()) return
    // TODO: プレビューモーダルの実装
    alert('プレビュー機能は実装予定です')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'お知らせを作成' : 'お知らせを編集'}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* メインフォーム */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {/* タイトル入力 */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="お知らせのタイトルを入力してください"
                maxLength={100}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.title}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/100文字
              </p>
            </div>

            {/* コンテンツエディタ */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容 *
              </label>
              <div className={`border rounded-lg ${errors.content ? 'border-red-300' : 'border-gray-300'}`}>
                <TiptapEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="お知らせの内容を入力してください..."
                />
              </div>
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.content}
                </p>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting && formData.status === 'draft' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                下書き保存
              </button>

              <button
                onClick={() => handleSubmit('published')}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting && formData.status === 'published' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                公開する
              </button>

              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                プレビュー
              </button>
            </div>
          </motion.div>
        </div>

        {/* サイドバー */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">設定</h3>

            {/* 優先度選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先度
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as NewsPriority }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(NEWS_PRIORITY_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* タイプ選択 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイプ
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as NewsType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(NEWS_TYPE_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.icon} {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ステータス表示 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <div className="flex items-center">
                {formData.status === 'published' ? (
                  <div className="flex items-center text-green-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">公開中</span>
                  </div>
                ) : formData.status === 'archived' ? (
                  <div className="flex items-center text-gray-600">
                    <Archive className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">アーカイブ</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">下書き</span>
                  </div>
                )}
              </div>
            </div>

            {/* 作成者情報 */}
            {initialData && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">作成者情報</h4>
                <p className="text-sm text-gray-600">{initialData.authorName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  作成: {initialData.createdAt.toLocaleDateString('ja-JP')}
                </p>
                <p className="text-xs text-gray-500">
                  更新: {initialData.updatedAt.toLocaleDateString('ja-JP')}
                </p>
                {initialData.publishedAt && (
                  <p className="text-xs text-gray-500">
                    公開: {initialData.publishedAt.toLocaleDateString('ja-JP')}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}