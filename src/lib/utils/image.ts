
/**
 * 画像ファイルをリサイズし、Data URLとして返す
 * @param file - リサイズする画像ファイル
 * @param maxSide - 最大辺の長さ（ピクセル）
 * @param quality - JPEG品質（0-1）
 * @returns リサイズされた画像のData URL
 */
export async function resizeImageToDataURL(file: File, maxSide = 1024, quality = 0.8): Promise<string> {
  const img = document.createElement('img')
  const reader = new FileReader()
  
  const dataUrl: string = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  
  img.src = dataUrl
  await new Promise((res) => (img.onload = () => res(null)))
  
  const { width, height } = img
  const scale = Math.min(1, maxSide / Math.max(width, height))
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  
  // toDataURLでEXIF情報は自動的に削除される（ブラウザ実装依存）
  return canvas.toDataURL('image/jpeg', quality)
}
