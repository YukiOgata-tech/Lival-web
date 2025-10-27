import { useCallback, useState } from 'react'
import { DiagnosisResult } from '@/types/diagnosis'

export function useDiagnosisImage() {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadDiagnosisPng = useCallback(async (result: DiagnosisResult, filename?: string) => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/diagnosis/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, name: filename })
      })
      if (!res.ok) throw new Error(`failed: ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(filename || `lival-diagnosis-${result.primaryType.id}`).replace(/[^a-zA-Z0-9-_]/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  return { downloadDiagnosisPng, isGenerating }
}

