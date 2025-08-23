// src/components/blog/BlogFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BlogCategory } from '@/lib/types/blog'
import { 
  Search, 
  Filter, 
  X, 
  Folder, 
  Tag as TagIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface BlogFiltersProps {
  categories: BlogCategory[]
  currentCategory?: string
  currentTag?: string
  currentQuery?: string
}

export default function BlogFilters({ 
  categories, 
  currentCategory, 
  currentTag, 
  currentQuery 
}: BlogFiltersProps) {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState(currentQuery || '')
  const [isExpanded, setIsExpanded] = useState(true)

  const popularTags = [
    '学習法', '記憶術', '集中力', 'モチベーション', 'ノート術',
    '時間管理', '受験対策', '英語学習', '数学', '読書法'
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: searchInput.trim() })
  }

  const updateFilters = (filters: { 
    category?: string 
    tag?: string 
    q?: string 
  }) => {
    const params = new URLSearchParams()
    
    // Keep existing filters and update with new ones
    if (filters.category !== undefined) {
      if (filters.category) params.set('category', filters.category)
    } else if (currentCategory) {
      params.set('category', currentCategory)
    }
    
    if (filters.tag !== undefined) {
      if (filters.tag) params.set('tag', filters.tag)
    } else if (currentTag) {
      params.set('tag', currentTag)
    }
    
    if (filters.q !== undefined) {
      if (filters.q) params.set('q', filters.q)
    } else if (currentQuery) {
      params.set('q', currentQuery)
    }

    const queryString = params.toString()
    const url = queryString ? `/blog?${queryString}` : '/blog'
    router.push(url)
  }

  const clearFilters = () => {
    setSearchInput('')
    router.push('/blog')
  }

  const hasActiveFilters = currentCategory || currentTag || currentQuery

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ height: 'auto' }}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className="overflow-hidden lg:!h-auto"
      >
        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="記事を検索..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              検索
            </button>
          </form>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">適用中のフィルター</span>
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 transition-colors"
              >
                すべてクリア
              </button>
            </div>
            <div className="space-y-2">
              {currentQuery && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Search className="w-3 h-3 text-blue-600" />
                    <span className="text-sm text-blue-800">"{currentQuery}"</span>
                  </div>
                  <button
                    onClick={() => updateFilters({ q: '' })}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentCategory && (
                <div className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Folder className="w-3 h-3 text-purple-600" />
                    <span className="text-sm text-purple-800">{currentCategory}</span>
                  </div>
                  <button
                    onClick={() => updateFilters({ category: '' })}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {currentTag && (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <TagIcon className="w-3 h-3 text-green-600" />
                    <span className="text-sm text-green-800">#{currentTag}</span>
                  </div>
                  <button
                    onClick={() => updateFilters({ tag: '' })}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <h4 className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-3">
            <Folder className="w-4 h-4 text-purple-500" />
            <span>カテゴリ</span>
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => updateFilters({ category: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !currentCategory
                  ? 'bg-purple-50 text-purple-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => updateFilters({ category: category.name })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentCategory === category.name
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h4 className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-3">
            <TagIcon className="w-4 h-4 text-green-500" />
            <span>人気のタグ</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => updateFilters({ tag })}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  currentTag === tag
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}