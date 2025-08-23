// src/components/admin/ReviewTemplateModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ReviewTemplate } from '@/lib/types/blog'
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare,
  Tag,
  Save,
  AlertCircle
} from 'lucide-react'

interface ReviewTemplateModalProps {
  templates: ReviewTemplate[]
  onClose: () => void
  onSave: (templates: ReviewTemplate[]) => void
}

interface TemplateFormData {
  title: string
  content: string
  category: string
}

export default function ReviewTemplateModal({ templates, onClose, onSave }: ReviewTemplateModalProps) {
  const [localTemplates, setLocalTemplates] = useState<ReviewTemplate[]>(templates)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    content: '',
    category: 'general'
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: 'usefulness', label: '有益性' },
    { value: 'citation', label: '引用・出典' },
    { value: 'structure', label: '構成・見出し' },
    { value: 'grammar', label: '文章・表現' },
    { value: 'general', label: '一般的' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return
    }

    if (editingId) {
      // Edit existing template
      setLocalTemplates(prev => prev.map(template => 
        template.id === editingId
          ? { ...template, ...formData }
          : template
      ))
    } else {
      // Add new template
      const newTemplate: ReviewTemplate = {
        id: `template_${Date.now()}`,
        ...formData,
        isActive: true
      }
      setLocalTemplates(prev => [...prev, newTemplate])
    }

    // Reset form
    setFormData({ title: '', content: '', category: 'general' })
    setEditingId(null)
  }

  const handleEdit = (template: ReviewTemplate) => {
    setFormData({
      title: template.title,
      content: template.content,
      category: template.category
    })
    setEditingId(template.id)
  }

  const handleDelete = (id: string) => {
    if (confirm('このテンプレートを削除しますか？')) {
      setLocalTemplates(prev => prev.filter(template => template.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setLocalTemplates(prev => prev.map(template =>
      template.id === id
        ? { ...template, isActive: !template.isActive }
        : template
    ))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would save to API
      await new Promise(resolve => setTimeout(resolve, 500))
      onSave(localTemplates)
    } catch (error) {
      console.error('Template save error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ title: '', content: '', category: 'general' })
    setEditingId(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">フィードバックテンプレート管理</h2>
                <p className="text-gray-600">審査で使用するコメントテンプレートを編集できます</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Template List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">既存テンプレート</h3>
              <p className="text-sm text-gray-600">クリックして編集、切り替えで有効/無効を設定</p>
            </div>
            
            <div className="p-4 space-y-3">
              {localTemplates.map(template => (
                <div
                  key={template.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    editingId === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : template.isActive
                      ? 'border-gray-300 hover:border-gray-400'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 cursor-pointer" onClick={() => handleEdit(template)}>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {categories.find(cat => cat.value === template.category)?.label}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.content}</p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => handleToggleActive(template.id)}
                        className={`p-1 rounded transition-colors ${
                          template.isActive 
                            ? 'text-green-600 hover:bg-green-100' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={template.isActive ? '無効にする' : '有効にする'}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        title="編集"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Form */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                {editingId ? 'テンプレート編集' : '新規テンプレート作成'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  カテゴリ
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="テンプレートのタイトル（例：有益性不足）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="フィードバック内容を入力してください。{section}のような変数も使用できます。"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ヒント: {"{section}"}、{"{example}"}などの変数を使用すると、審査時に具体的な内容に置き換えられます
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? '更新' : '追加'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            {localTemplates.filter(t => t.isActive).length} / {localTemplates.length} 個のテンプレートが有効
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '保存中...' : '変更を保存'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}