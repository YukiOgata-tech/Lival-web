// src/hooks/useSimpleDownload.ts
// lab()色関数問題を完全に回避する最終的なソリューション
import { useCallback, useState } from 'react'

interface UseSimpleDownloadOptions {
  filename?: string
  width?: number
  height?: number
}

export const useSimpleDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadAsImage = useCallback(async (
    elementId: string,
    options: UseSimpleDownloadOptions = {}
  ) => {
    const {
      filename = 'lival-ai-diagnosis-result',
      width = 800,
      height = 1400
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

      // 白い背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // 診断結果の描画
      await drawDiagnosisResult(element, ctx, width, height)

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
      }, 'image/png', 0.95)

    } catch (error) {
      console.error('Simple download failed:', error)
      throw new Error(`画像のダウンロードに失敗しました: ${error.message}`)
    } finally {
      setIsDownloading(false)
    }
  }, [])

  return {
    downloadAsImage,
    isDownloading
  }
}

// 診断結果を手動で描画する関数（強化版）
async function drawDiagnosisResult(
  element: Element,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // フォント設定
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  
  let currentY = 30

  // ヘッダー部分を描画（より詳細に）
  const titleElement = element.querySelector('h1')
  const scientificNameEl = element.querySelector('[class*="opacity-90"], p')
  
  if (titleElement) {
    const titleText = titleElement.textContent || 'LIVAL AI 診断結果'
    const scientificName = scientificNameEl?.textContent || ''
    
    // ヘッダー背景（より美しいグラデーション）
    const headerHeight = 160
    const gradient = ctx.createLinearGradient(0, currentY, width, currentY + headerHeight)
    gradient.addColorStop(0, '#1e40af')
    gradient.addColorStop(0.3, '#3b82f6')
    gradient.addColorStop(0.7, '#8b5cf6')
    gradient.addColorStop(1, '#a855f7')
    ctx.fillStyle = gradient
    ctx.fillRect(0, currentY, width, headerHeight)
    
    // 装飾的な要素
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.beginPath()
    ctx.arc(width - 50, currentY + 30, 30, 0, 2 * Math.PI)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(50, currentY + headerHeight - 30, 20, 0, 2 * Math.PI)
    ctx.fill()
    
    // メインタイトル
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Arial, sans-serif'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 4
    const titleMetrics = ctx.measureText(titleText)
    const titleX = (width - titleMetrics.width) / 2
    ctx.fillText(titleText, titleX, currentY + 35)
    
    // サブタイトル（科学的分類）
    if (scientificName && scientificName.length > 5) {
      ctx.font = '18px Arial, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      const cleanScientificName = scientificName.replace(/^[^a-zA-Z]*/, '').slice(0, 30) + '...'
      const subtitleMetrics = ctx.measureText(cleanScientificName)
      const subtitleX = (width - subtitleMetrics.width) / 2
      ctx.fillText(cleanScientificName, subtitleX, currentY + 75)
    }
    
    // 日付とロゴ
    ctx.font = 'bold 14px Arial, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    const today = new Date().toLocaleDateString('ja-JP')
    ctx.fillText(`診断日: ${today}`, 40, currentY + 120)
    
    ctx.font = 'bold 16px Arial, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('LIVAL AI', width - 120, currentY + 120)
    
    // 影をリセット
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.shadowBlur = 0
    
    currentY += headerHeight + 30
  }

  // 学習タイプ名とアイコンを描画
  const typeNameElements = element.querySelectorAll('h1, [class*="text-3xl"], [class*="font-bold"]')
  let typeName = ''
  for (const el of Array.from(typeNameElements)) {
    const text = el.textContent?.trim()
    if (text && text.length < 20 && !text.includes('診断') && !text.includes('%')) {
      typeName = text
      break
    }
  }
  
  if (typeName) {
    // タイプ名の背景ボックス
    const typeBoxWidth = width - 80
    const typeBoxHeight = 80
    const typeBoxX = 40
    
    // 背景のグラデーション
    const typeGradient = ctx.createLinearGradient(typeBoxX, currentY, typeBoxX + typeBoxWidth, currentY + typeBoxHeight)
    typeGradient.addColorStop(0, '#f8fafc')
    typeGradient.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = typeGradient
    ctx.fillRect(typeBoxX, currentY, typeBoxWidth, typeBoxHeight)
    
    // 枠線
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    ctx.strokeRect(typeBoxX, currentY, typeBoxWidth, typeBoxHeight)
    
    // タイプアイコン（シンプルな図形で代用）
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(typeBoxX + 40, currentY + 40, 20, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 18px Arial, sans-serif'
    const iconText = typeName.charAt(0)
    const iconMetrics = ctx.measureText(iconText)
    ctx.fillText(iconText, typeBoxX + 40 - iconMetrics.width / 2, currentY + 32)
    
    // タイプ名
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 26px Arial, sans-serif'
    ctx.fillText(typeName, typeBoxX + 80, currentY + 28)
    
    currentY += typeBoxHeight + 30
  }

  // メイン説明文を描画
  const descElements = element.querySelectorAll('p')
  let mainDescription = ''
  for (const desc of Array.from(descElements)) {
    const text = desc.textContent?.trim()
    if (text && text.length > 20 && text.length < 200 && !text.includes('診断') && !text.includes('%')) {
      mainDescription = text
      break
    }
  }
  
  if (mainDescription) {
    ctx.fillStyle = '#475569'
    ctx.font = '16px Arial, sans-serif'
    const wrappedDesc = wrapText(ctx, mainDescription, width - 80)
    
    for (let i = 0; i < Math.min(wrappedDesc.length, 3); i++) {
      ctx.fillText(wrappedDesc[i], 40, currentY)
      currentY += 22
    }
    currentY += 25
  }

  // スコア情報セクション（より詳細に）
  const allElements = element.querySelectorAll('*')
  const scoreData = []
  
  // 信頼度を探す
  for (const el of Array.from(allElements)) {
    const text = el.textContent?.trim()
    if (text && /^\d{2,3}%$/.test(text)) {
      const parentText = el.parentElement?.textContent
      let label = '信頼度'
      if (parentText?.includes('信頼') || parentText?.includes('確実')) {
        label = '診断信頼度'
      } else if (parentText?.includes('質問')) {
        label = '質問数'
      } else if (parentText?.includes('時間')) {
        label = '所要時間'
      }
      scoreData.push({ value: text, label })
    }
  }
  
  // 質問数と時間を探す
  for (const el of Array.from(allElements)) {
    const text = el.textContent?.trim()
    if (text && /^\d+$/.test(text) && scoreData.length < 3) {
      const parentText = el.parentElement?.textContent
      if (parentText?.includes('質問')) {
        scoreData.push({ value: text + '問', label: '回答質問数' })
      }
    }
  }
  
  // 時間情報を探す
  for (const el of Array.from(allElements)) {
    const text = el.textContent?.trim()
    if (text && /\d+分\d+秒/.test(text) && scoreData.length < 3) {
      scoreData.push({ value: text, label: '診断時間' })
    }
  }
  
  if (scoreData.length > 0) {
    // スコアセクションのヘッダー
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 20px Arial, sans-serif'
    ctx.fillText('診断データ', 40, currentY)
    currentY += 35
    
    const boxWidth = (width - 120) / Math.min(scoreData.length, 3)
    const boxHeight = 90
    
    for (let i = 0; i < Math.min(scoreData.length, 3); i++) {
      const x = 40 + i * (boxWidth + 20)
      const y = currentY
      
      // ボックス背景
      const boxGradient = ctx.createLinearGradient(x, y, x + boxWidth, y + boxHeight)
      boxGradient.addColorStop(0, '#eff6ff')
      boxGradient.addColorStop(1, '#dbeafe')
      ctx.fillStyle = boxGradient
      ctx.fillRect(x, y, boxWidth, boxHeight)
      
      // ボックス枠線
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, boxWidth, boxHeight)
      
      // ラベル
      ctx.fillStyle = '#475569'
      ctx.font = '12px Arial, sans-serif'
      const labelMetrics = ctx.measureText(scoreData[i].label)
      ctx.fillText(scoreData[i].label, x + (boxWidth - labelMetrics.width) / 2, y + 15)
      
      // 値
      ctx.fillStyle = '#1e40af'
      ctx.font = 'bold 22px Arial, sans-serif'
      const valueMetrics = ctx.measureText(scoreData[i].value)
      ctx.fillText(scoreData[i].value, x + (boxWidth - valueMetrics.width) / 2, y + 40)
    }
    
    currentY += boxHeight + 30
  }

  // 特徴リストを美しく描画
  const listElements = element.querySelectorAll('li, [class*="flex items-center"], [class*="bg-blue-50"]')
  const characteristics = []
  
  // 特徴を収集
  for (const item of Array.from(listElements)) {
    const itemText = item.textContent?.trim()
    if (itemText && itemText.length > 5 && itemText.length < 100 && !itemText.includes('%')) {
      const cleanText = itemText.replace(/^[•·‣⁃\d+\.\s]*/, '').trim()
      if (cleanText.length > 5) {
        characteristics.push(cleanText)
      }
    }
  }
  
  if (characteristics.length > 0) {
    // 特徴セクションのヘッダー
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 20px Arial, sans-serif'
    ctx.fillText('✨ あなたの特徴', 40, currentY)
    currentY += 40
    
    const maxFeatures = Math.min(characteristics.length, 5)
    for (let i = 0; i < maxFeatures; i++) {
      const feature = characteristics[i]
      
      // 特徴ボックス
      const boxY = currentY
      const boxHeight = 50
      
      // 背景
      const featureGradient = ctx.createLinearGradient(40, boxY, width - 40, boxY + boxHeight)
      featureGradient.addColorStop(0, '#f0f9ff')
      featureGradient.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = featureGradient
      ctx.fillRect(40, boxY, width - 80, boxHeight)
      
      // アイコン
      ctx.fillStyle = '#0ea5e9'
      ctx.beginPath()
      ctx.arc(65, boxY + 25, 8, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 10px Arial, sans-serif'
      ctx.fillText((i + 1).toString(), 61, boxY + 21)
      
      // テキスト
      ctx.fillStyle = '#0f172a'
      ctx.font = '15px Arial, sans-serif'
      const wrappedFeature = wrapText(ctx, feature, width - 140)
      
      const textY = boxY + 18
      for (let j = 0; j < Math.min(wrappedFeature.length, 2); j++) {
        ctx.fillText(wrappedFeature[j], 85, textY + (j * 18))
      }
      
      currentY += boxHeight + 8
    }
    
    currentY += 20
  }

  // 科学的根拠セクション
  ctx.fillStyle = '#1e293b'
  ctx.font = 'bold 18px Arial, sans-serif'
  ctx.fillText('🔬 科学的根拠', 40, currentY)
  currentY += 35
  
  // 理論的背景
  const scientificTexts = [
    '自己決定理論（SDT）: 40年以上の心理学研究で実証',
    'Big Five性格理論: 学習成果予測の確実性が高い',
    '中高生特化設計: 発達段階に最適化された診断'
  ]
  
  ctx.font = '13px Arial, sans-serif'
  for (let i = 0; i < scientificTexts.length; i++) {
    ctx.fillStyle = '#475569'
    
    // アイコン
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(55, currentY + 8, 4, 0, 2 * Math.PI)
    ctx.fill()
    
    // テキスト
    ctx.fillStyle = '#374151'
    ctx.fillText(scientificTexts[i], 70, currentY + 5)
    currentY += 22
  }
  
  currentY += 20
  
  // フッター（強化版）
  const footerY = height - 60
  
  // フッター背景
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, footerY - 20, width, 80)
  
  // 区切り線
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, footerY - 20)
  ctx.lineTo(width, footerY - 20)
  ctx.stroke()
  
  // フッターテキスト
  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 16px Arial, sans-serif'
  const footerText = 'LIVAL AI - パーソナルAIコーチング'
  const footerMetrics = ctx.measureText(footerText)
  ctx.fillText(footerText, (width - footerMetrics.width) / 2, footerY)
  
  // 日付とURL
  ctx.font = '12px Arial, sans-serif'
  ctx.fillStyle = '#94a3b8'
  const urlText = 'https://lival.ai | 診断日: ' + new Date().toLocaleDateString('ja-JP')
  const urlMetrics = ctx.measureText(urlText)
  ctx.fillText(urlText, (width - urlMetrics.width) / 2, footerY + 25)
}

// テキストを指定幅で折り返す関数
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)

  return lines
}