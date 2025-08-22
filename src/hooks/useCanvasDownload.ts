// src/hooks/useCanvasDownload.ts
// html2canvasの完全な代替実装
import { useCallback, useState } from 'react'

interface UseCanvasDownloadOptions {
  filename?: string
  width?: number
  height?: number
  backgroundColor?: string
}

export const useCanvasDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadAsCanvas = useCallback(async (
    elementId: string,
    options: UseCanvasDownloadOptions = {}
  ) => {
    const {
      filename = 'lival-ai-diagnosis-result',
      width = 800,
      height = 1200,
      backgroundColor = '#ffffff'
    } = options

    setIsDownloading(true)

    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      // Canvas要素を作成
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      // 高解像度設定
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(dpr, dpr)

      // 背景色を設定
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)

      // 要素から情報を抽出して手動で描画
      await drawElementToCanvas(element, ctx, 0, 0, width, height)

      // 画像をダウンロード
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
          }, 100)
        }
      }, 'image/png', 0.9)

    } catch (error) {
      console.error('Canvas download failed:', error)
      throw new Error(`Canvas download failed: ${error.message}`)
    } finally {
      setIsDownloading(false)
    }
  }, [])

  return {
    downloadAsCanvas,
    isDownloading
  }
}

// 要素をCanvasに描画する関数
async function drawElementToCanvas(
  element: Element, 
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) {
  const computedStyle = window.getComputedStyle(element)
  const rect = element.getBoundingClientRect()
  
  // 背景色を描画
  const bgColor = getBackgroundColor(element, computedStyle)
  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor
    ctx.fillRect(x, y, Math.min(rect.width, maxWidth), Math.min(rect.height, maxHeight))
  }
  
  // テキストコンテンツを描画
  if (element.textContent && element.children.length === 0) {
    drawText(ctx, element.textContent, x, y, computedStyle, maxWidth)
  }
  
  // 子要素を再帰的に描画
  let currentY = y + 20
  for (const child of Array.from(element.children)) {
    const childRect = child.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    
    const childX = x + (childRect.left - elementRect.left)
    const childY = currentY
    
    await drawElementToCanvas(child, ctx, childX, childY, maxWidth - childX, maxHeight - childY)
    currentY += 30 // 簡単な垂直スペーシング
  }
}

function getBackgroundColor(element: Element, computedStyle: CSSStyleDeclaration): string {
  // CSSクラスから背景色を決定
  const classList = Array.from(element.classList)
  
  // グラデーションクラスをチェック
  if (classList.some(cls => cls.includes('bg-gradient') || cls.includes('from-') || cls.includes('to-'))) {
    // タイプ別の色を決定
    if (classList.some(cls => cls.includes('purple'))) return '#8b5cf6'
    if (classList.some(cls => cls.includes('blue'))) return '#2563eb'
    if (classList.some(cls => cls.includes('green'))) return '#059669'
    if (classList.some(cls => cls.includes('red'))) return '#dc2626'
    if (classList.some(cls => cls.includes('pink'))) return '#db2777'
    if (classList.some(cls => cls.includes('amber'))) return '#d97706'
    return '#2563eb' // デフォルト
  }
  
  // 単色背景をチェック
  const bgColorMap: Record<string, string> = {
    'bg-white': '#ffffff',
    'bg-gray-50': '#f9fafb',
    'bg-blue-50': '#eff6ff',
    'bg-purple-50': '#faf5ff',
    'bg-green-50': '#f0fdf4',
    'bg-green-100': '#dcfce7',
    'bg-red-50': '#fef2f2',
    'bg-pink-50': '#fdf2f8',
    'bg-amber-50': '#fffbeb',
  }
  
  for (const [className, color] of Object.entries(bgColorMap)) {
    if (classList.includes(className)) {
      return color
    }
  }
  
  return 'transparent'
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  computedStyle: CSSStyleDeclaration,
  maxWidth: number
) {
  // フォント設定
  const fontSize = parseInt(computedStyle.fontSize) || 16
  const fontFamily = computedStyle.fontFamily || 'Arial, sans-serif'
  const fontWeight = computedStyle.fontWeight || 'normal'
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  
  // テキスト色の設定
  ctx.fillStyle = getTextColor(computedStyle)
  
  // テキストを描画（長いテキストは折り返し）
  const words = text.trim().split(' ')
  let line = ''
  let lineY = y + fontSize
  
  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, lineY)
      line = word + ' '
      lineY += fontSize + 4
    } else {
      line = testLine
    }
  }
  
  if (line.trim()) {
    ctx.fillText(line.trim(), x, lineY)
  }
}

function getTextColor(computedStyle: CSSStyleDeclaration): string {
  // 計算されたスタイルから色を取得を試みる
  const color = computedStyle.color
  
  // rgb()形式の場合はそのまま使用
  if (color && color.startsWith('rgb')) {
    return color
  }
  
  // デフォルトの色マッピング
  return '#374151' // text-gray-700相当
}