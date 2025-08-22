// src/hooks/useShare.ts
import { useCallback, useState } from 'react'
import { DiagnosisResult } from '@/types/diagnosis'

interface ShareData {
  title: string
  text: string
  url: string
  image?: string
}

export const useShare = () => {
  const [isSharing, setIsSharing] = useState(false)

  const createShareData = useCallback((result: DiagnosisResult): ShareData => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lival.ai'
    const shareUrl = `${baseUrl}/diagnosis/result/${result.sessionId}`
    
    return {
      title: `私の学習タイプは「${result.primaryType.displayName}」でした！`,
      text: `🧠 LIVAL AI 診断結果 🧠\n\n私の学習タイプ：${result.primaryType.displayName}\n${result.primaryType.description}\n\n✨ 信頼度: ${result.confidence}%\n\nあなたも無料で診断してみませんか？`,
      url: shareUrl
    }
  }, [])

  const shareViaWebAPI = useCallback(async (result: DiagnosisResult) => {
    if (!navigator.share) {
      throw new Error('Web Share API is not supported')
    }

    setIsSharing(true)
    try {
      const shareData = createShareData(result)
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareData.url
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        throw error
      }
    } finally {
      setIsSharing(false)
    }
  }, [createShareData])

  const shareToLine = useCallback((result: DiagnosisResult) => {
    const shareData = createShareData(result)
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
      `${shareData.text}\n\n${shareData.url}`
    )}`
    window.open(lineUrl, '_blank', 'width=600,height=400')
  }, [createShareData])

  const shareToX = useCallback((result: DiagnosisResult) => {
    const shareData = createShareData(result)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareData.text
    )}&url=${encodeURIComponent(shareData.url)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }, [createShareData])

  const shareToFacebook = useCallback((result: DiagnosisResult) => {
    const shareData = createShareData(result)
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareData.url
    )}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }, [createShareData])

  const copyToClipboard = useCallback(async (result: DiagnosisResult) => {
    const shareData = createShareData(result)
    const textToCopy = `${shareData.text}\n\n${shareData.url}`
    
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(textToCopy)
    } else {
      // フォールバック: 旧式のコピー方法
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }, [createShareData])

  const shareAsImage = useCallback(async (
    result: DiagnosisResult,
    imageDataUrl: string
  ) => {
    if (!navigator.share) {
      throw new Error('Web Share API is not supported')
    }

    setIsSharing(true)
    try {
      // Data URLをBlobに変換
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      const file = new File([blob], `lival-ai-diagnosis-${result.primaryType.id}.png`, {
        type: 'image/png'
      })

      const shareData = createShareData(result)
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        files: [file]
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        throw error
      }
    } finally {
      setIsSharing(false)
    }
  }, [createShareData])

  return {
    shareViaWebAPI,
    shareToLine,
    shareToX,
    shareToFacebook,
    copyToClipboard,
    shareAsImage,
    isSharing,
    createShareData
  }
}