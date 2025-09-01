// src/hooks/useImageDownload.ts
import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'

interface UseImageDownloadOptions {
  filename?: string
  scale?: number
  backgroundColor?: string
}

export const useImageDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  // lab()色関数を含むCSSを検出して置換する関数
  const sanitizeStyles = (element: HTMLElement): HTMLElement => {
    const clonedElement = element.cloneNode(true) as HTMLElement
    const allElements = clonedElement.querySelectorAll('*')
    
    // クローンされた要素の全てのスタイルをチェック・修正
    const elementsToProcess = [clonedElement, ...Array.from(allElements)]
    
    elementsToProcess.forEach(el => {
      if (el instanceof HTMLElement) {
        // インラインスタイルをチェック
        window.getComputedStyle(element.querySelector(`[data-element-id="${Math.random()}"]`) || element)
        
        // 背景関連のスタイルを安全な値に置換
        if (el.style.background || el.style.backgroundColor || el.style.backgroundImage) {
          el.style.background = ''
          el.style.backgroundImage = ''
          el.style.backgroundColor = ''
        }
        
        // CSSクラスベースの背景色設定
        const classList = Array.from(el.classList)
        classList.forEach(className => {
          if (className.includes('bg-gradient') || className.includes('from-') || className.includes('to-')) {
            el.classList.remove(className)
            el.style.backgroundColor = '#2563eb'
          } else if (className.includes('bg-')) {
            const colorMap: Record<string, string> = {
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
            
            if (colorMap[className]) {
              el.style.backgroundColor = colorMap[className]
            }
          }
          
          // テキスト色の設定
          if (className.includes('text-')) {
            const textColorMap: Record<string, string> = {
              'text-white': '#ffffff',
              'text-gray-600': '#4b5563',
              'text-gray-700': '#374151',
              'text-gray-900': '#111827',
              'text-blue-600': '#2563eb',
              'text-purple-600': '#8b5cf6',
              'text-green-600': '#059669',
            }
            
            if (textColorMap[className]) {
              el.style.color = textColorMap[className]
            }
          }
        })
        
        // グラデーションテキストの処理
        if (el.classList.contains('bg-clip-text') || el.classList.contains('text-transparent')) {
          el.classList.remove('bg-clip-text', 'text-transparent')
          el.style.background = 'none'
          el.style.color = '#2563eb'
          el.style.webkitBackgroundClip = 'unset'
          el.style.backgroundClip = 'unset'
        }
      }
    })
    
    return clonedElement
  }

  const downloadAsImage = useCallback(async (
    elementId: string,
    options: UseImageDownloadOptions = {}
  ) => {
    const {
      filename = 'lival-ai-diagnosis-result',
      scale = 1.5,
      backgroundColor = '#ffffff'
    } = options

    setIsDownloading(true)

    try {
      // 元の要素を取得
      const originalElement = document.getElementById(elementId)
      if (!originalElement) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      // 要素を安全にクローンして処理
      const sanitizedElement = sanitizeStyles(originalElement as HTMLElement)
      
      // 一時的にDOMに追加（html2canvasが要素を正しく認識するため）
      sanitizedElement.style.position = 'absolute'
      sanitizedElement.style.left = '-9999px'
      sanitizedElement.style.top = '0'
      document.body.appendChild(sanitizedElement)

      try {
        // html2canvasを実行（最小限の設定）
        const canvas = await html2canvas(sanitizedElement, {
          scale,
          backgroundColor,
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 15000,
          // 問題のある要素を完全に除外
          ignoreElements: (element) => {
            return element.tagName === 'SVG' || 
                   element.tagName === 'SCRIPT' ||
                   element.tagName === 'STYLE' ||
                   element.classList?.contains('animate-spin') ||
                   element.hasAttribute('data-html2canvas-ignore')
          },
          onclone: (clonedDoc) => {
            // クローンされたドキュメント内で追加の安全化処理
            const style = clonedDoc.createElement('style')
            style.textContent = `
              * {
                animation: none !important;
                transition: none !important;
                transform: none !important;
                box-shadow: none !important;
                filter: none !important;
                backdrop-filter: none !important;
                background-image: none !important;
              }
              svg, .animate-spin, [role="status"] { 
                display: none !important; 
              }
            `
            clonedDoc.head.appendChild(style)
            
            // すべての要素から危険なCSSを除去
            const allClonedElements = clonedDoc.querySelectorAll('*')
            allClonedElements.forEach(el => {
              if (el instanceof HTMLElement) {
                // 全ての背景関連プロパティをクリア
                el.style.backgroundImage = 'none'
                el.style.background = el.style.backgroundColor || '#ffffff'
              }
            })
          }
        })

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
            
            // クリーンアップ
            setTimeout(() => {
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }, 100)
          }
        }, 'image/png', 0.9)

      } finally {
        // 一時要素を削除
        document.body.removeChild(sanitizedElement)
      }

    } catch (error) {
      console.error('画像のダウンロードに失敗しました:', error)
      if (error instanceof Error) {
        throw new Error(`画像のダウンロードに失敗しました: ${error.message}`)
      }
      throw new Error('画像のダウンロードに失敗しました')
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const getImageDataURL = useCallback(async (
    elementId: string,
    options: UseImageDownloadOptions = {}
  ): Promise<string> => {
    const {
      scale = 1.5,
      backgroundColor = '#ffffff'
    } = options

    try {
      const originalElement = document.getElementById(elementId)
      if (!originalElement) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      const sanitizedElement = sanitizeStyles(originalElement as HTMLElement)
      
      sanitizedElement.style.position = 'absolute'
      sanitizedElement.style.left = '-9999px'
      document.body.appendChild(sanitizedElement)

      try {
        const canvas = await html2canvas(sanitizedElement, {
          scale,
          backgroundColor,
          useCORS: true,
          allowTaint: true,
          logging: false,
          ignoreElements: (element) => {
            return element.tagName === 'SVG' || 
                   element.classList?.contains('animate-spin')
          }
        })

        return canvas.toDataURL('image/png', 0.9)
      } finally {
        document.body.removeChild(sanitizedElement)
      }
    } catch (error) {
      console.error('画像データの取得に失敗しました:', error)
      if (error instanceof Error) {
        throw new Error(`画像データの取得に失敗しました: ${error.message}`)
      }
      throw new Error('画像データの取得に失敗しました')
    }
  }, [])

  return {
    downloadAsImage,
    getImageDataURL,
    isDownloading
  }
}