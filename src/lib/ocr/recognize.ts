// src/lib/ocr/recognize.ts

// 画像(DataURL)からOCRテキストを抽出（Tesseract.jsを動的import）
// 日本語+英語を対象にし、失敗時は英語のみでフォールバック

export async function recognizeImageDataURL(dataUrl: string): Promise<string> {
  try {
    const { createWorker } = await import('tesseract.js')
    const worker = await createWorker()
    try {
      await worker.loadLanguage('jpn+eng')
      await worker.initialize('jpn+eng')
    } catch {
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
    }
    const { data } = await worker.recognize(dataUrl)
    await worker.terminate()
    return (data?.text || '').trim()
  } catch (e) {
    console.warn('OCR failed, returning empty text', e)
    return ''
  }
}

export async function recognizeMultiple(dataUrls: string[], max = 2): Promise<string> {
  const targets = dataUrls.slice(0, max)
  const results: string[] = []
  for (const url of targets) {
    const text = await recognizeImageDataURL(url)
    if (text) results.push(text)
  }
  return results.join('\n\n')
}

