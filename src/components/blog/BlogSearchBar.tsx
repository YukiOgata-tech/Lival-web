'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

export default function BlogSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())
    const trimmed = searchInput.trim()

    if (trimmed) {
      params.set('q', trimmed)
      params.delete('page')
    } else {
      params.delete('q')
      params.delete('page')
    }

    const queryString = params.toString()
    const url = queryString ? `/blog?${queryString}` : '/blog'
    router.push(url)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="記事名やキーワードで検索..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        検索
      </button>
    </form>
  )
}

