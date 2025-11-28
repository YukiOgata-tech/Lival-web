// src/app/api/link-preview/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface LinkMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
}

/**
 * URLからOGPメタデータを取得するAPI
 * CORS制限を回避するため、サーバーサイドで取得
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URLが必要です' },
        { status: 400 }
      )
    }

    // URLの妥当性チェック
    let validUrl: URL
    try {
      validUrl = new URL(url)
      // HTTPSのみ許可（セキュリティ）
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json(
        { error: '無効なURLです' },
        { status: 400 }
      )
    }

    // URLのHTMLを取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LIVAL-AI-Bot/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10秒タイムアウト
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'URLの取得に失敗しました' },
        { status: response.status }
      )
    }

    const html = await response.text()

    // メタデータを抽出
    const metadata: LinkMetadata = {
      url: url,
    }

    // OGPタグの抽出
    const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i)
    const ogDescription = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i)
    const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
    const ogSiteName = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i)

    // Twitterカードタグの抽出（フォールバック）
    const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i)
    const twitterDescription = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i)
    const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)

    // 通常のメタタグ（フォールバック）
    const metaDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
    const titleTag = html.match(/<title>([^<]+)<\/title>/i)

    // ファビコン
    const favicon = html.match(/<link\s+[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/i)

    // 優先順位をつけてメタデータを設定
    metadata.title = ogTitle?.[1] || twitterTitle?.[1] || titleTag?.[1] || validUrl.hostname
    metadata.description = ogDescription?.[1] || twitterDescription?.[1] || metaDescription?.[1] || ''
    metadata.image = ogImage?.[1] || twitterImage?.[1] || ''
    metadata.siteName = ogSiteName?.[1] || validUrl.hostname
    metadata.favicon = favicon?.[1] || `${validUrl.origin}/favicon.ico`

    // 相対URLを絶対URLに変換
    if (metadata.image && !metadata.image.startsWith('http')) {
      metadata.image = new URL(metadata.image, validUrl.origin).toString()
    }
    if (metadata.favicon && !metadata.favicon.startsWith('http')) {
      metadata.favicon = new URL(metadata.favicon, validUrl.origin).toString()
    }

    // HTMLエンティティをデコード
    const decodeHtmlEntities = (text: string) => {
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&nbsp;/g, ' ')
    }

    if (metadata.title) metadata.title = decodeHtmlEntities(metadata.title)
    if (metadata.description) metadata.description = decodeHtmlEntities(metadata.description)

    // 説明文を200文字に制限
    if (metadata.description && metadata.description.length > 200) {
      metadata.description = metadata.description.substring(0, 200) + '...'
    }

    return NextResponse.json(metadata)
  } catch (error) {
    console.error('Link preview error:', error)
    return NextResponse.json(
      { error: 'メタデータの取得に失敗しました' },
      { status: 500 }
    )
  }
}
