// src/lib/ocr/recognize.ts

// 画像(DataURL)からOCRテキストを抽出（Tesseract.jsを動的import）
// 日本語+英語を対象

export async function recognizeImageDataURL(dataUrl: string): Promise<string> {
  let worker: Tesseract.Worker | undefined;
  try {
    const { createWorker } = await import('tesseract.js')
    // Pass languages directly to the factory function.
    // The worker comes pre-initialized and with the language loaded.
    worker = await createWorker('jpn+eng');
    const { data } = await worker.recognize(dataUrl)
    return (data?.text || '').trim()
  } catch (e) {
    console.warn('OCR failed, returning empty text', e)
    return ''
  } finally {
    // Ensure worker is terminated even on error
    await worker?.terminate()
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

