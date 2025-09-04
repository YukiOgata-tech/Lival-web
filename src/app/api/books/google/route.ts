// src/app/api/books/google/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleBooksItem } from '@/types/study'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const maxResults = searchParams.get('maxResults') || '5'
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY // NEXT_PUBLIC_ なし
    if (!apiKey) {
      console.error('Google Books API key is not configured')
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 })
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`,
      {
        headers: {
          'User-Agent': 'LIVAL-AI/1.0'
        }
      }
    )

    if (!response.ok) {
      console.error('Google Books API error:', response.status, response.statusText)
      return NextResponse.json({ error: 'External API error' }, { status: response.status })
    }

    const data = await response.json()
    const items: GoogleBooksItem[] = data?.items || []

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Google Books API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}