'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { Result } from '@zxing/library'

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (isbn: string) => void
}

type ScanMode = 'camera' | 'upload'
type ScanStatus = 'idle' | 'scanning' | 'processing' | 'success' | 'error'

export default function BarcodeScanner({ isOpen, onClose, onScanComplete }: BarcodeScannerProps) {
  const [scanMode, setScanMode] = useState<ScanMode>('camera')
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [scannedISBN, setScannedISBN] = useState<string>('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const streamRef = useRef<{ stop: () => void } | null>(null)

  // コンポーネント初期化
  useEffect(() => {
    if (isOpen) {
      codeReaderRef.current = new BrowserMultiFormatReader()
      setScanStatus('idle')
      setErrorMessage('')
      setScannedISBN('')
    }

    return () => {
      stopScanning()
    }
  }, [isOpen])

  const startCameraScanning = async () => {
    if (!codeReaderRef.current || !videoRef.current) return

    try {
      setScanStatus('scanning')
      setErrorMessage('')
      
      // 利用可能なデバイスを取得
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices()
      
      if (videoInputDevices.length === 0) {
        throw new Error('カメラデバイスが見つかりませんでした')
      }

      // 最初に利用可能なカメラデバイスを使用
      const selectedDeviceId = videoInputDevices[0].deviceId

      // 継続的なスキャンを開始
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const isbn = extractISBN(result.getText())
            if (isbn) {
              setScannedISBN(isbn)
              setScanStatus('success')
              
              // スキャンを停止
              if (controls) {
                controls.stop()
              }
              
              setTimeout(() => {
                onScanComplete(isbn)
                onClose()
              }, 1500)
            }
          }
          
          if (error && scanStatus === 'scanning') {
            // エラーはログに記録するが、継続的にスキャンを試行
            console.debug('Scan attempt:', error.message)
          }
        }
      )

      // controlsをstreamRefに保存（停止用）
      streamRef.current = controls

    } catch (error) {
      console.error('Camera scanning error:', error)
      setScanStatus('error')
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('カメラのアクセスが拒否されました。ブラウザの設定でカメラアクセスを許可してください。')
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('カメラデバイスが見つかりませんでした。')
        } else {
          setErrorMessage('カメラの起動に失敗しました。ページを再読み込みして試してみてください。')
        }
      } else {
        setErrorMessage('予期しないエラーが発生しました。')
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !codeReaderRef.current) return

    try {
      setScanStatus('processing')
      setErrorMessage('')
      
      // ファイルをImageオブジェクトに変換
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()
      
      img.onload = async () => {
        try {
          const result = await codeReaderRef.current!.decodeFromImageUrl(imageUrl)
          
          if (result) {
            const isbn = extractISBN(result.getText())
            if (isbn) {
              setScannedISBN(isbn)
              setScanStatus('success')
              setTimeout(() => {
                onScanComplete(isbn)
                onClose()
              }, 1500)
            } else {
              setScanStatus('error')
              setErrorMessage('ISBNが見つかりませんでした。本のバーコードが写っている画像を選択してください。')
            }
          }
        } catch (decodeError) {
          console.error('Decode error:', decodeError)
          setScanStatus('error')
          setErrorMessage('画像からバーコードが見つかりませんでした。バーコードがはっきり写っている画像を選択してください。')
        } finally {
          URL.revokeObjectURL(imageUrl)
        }
      }
      
      img.onerror = () => {
        setScanStatus('error')
        setErrorMessage('画像の読み込みに失敗しました。別の画像を試してください。')
        URL.revokeObjectURL(imageUrl)
      }
      
      img.src = imageUrl
    } catch (error) {
      console.error('File upload error:', error)
      setScanStatus('error')
      setErrorMessage('画像の処理に失敗しました。別の画像を試してください。')
    }
  }

  const extractISBN = (text: string): string | null => {
    // EAN-13 (ISBN-13) format: 978 or 979 prefix
    const isbn13Match = text.match(/^(978|979)\d{10}$/)
    if (isbn13Match) {
      return text
    }
    
    // EAN-13 with hyphens
    const isbn13HyphenMatch = text.match(/^(978|979)-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/)
    if (isbn13HyphenMatch) {
      return text.replace(/-/g, '')
    }
    
    // ISBN-10 format
    const isbn10Match = text.match(/^\d{9}[\dX]$/)
    if (isbn10Match) {
      return convertISBN10to13(text)
    }
    
    return null
  }

  const convertISBN10to13 = (isbn10: string): string => {
    const isbn12 = '978' + isbn10.slice(0, 9)
    const checkDigit = calculateISBN13CheckDigit(isbn12)
    return isbn12 + checkDigit
  }

  const calculateISBN13CheckDigit = (isbn12: string): string => {
    let sum = 0
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(isbn12[i])
      sum += i % 2 === 0 ? digit : digit * 3
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return checkDigit.toString()
  }

  const stopScanning = () => {
    // スキャン制御を停止
    if (streamRef.current && typeof streamRef.current.stop === 'function') {
      try {
        streamRef.current.stop()
      } catch (error) {
        console.warn('Stop scanning error:', error)
      }
      streamRef.current = null
    }
    
    // ビデオ要素をクリア
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setScanStatus('idle')
  }

  const resetScan = () => {
    stopScanning()
    setErrorMessage('')
    setScannedISBN('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    stopScanning()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">バーコード読み取り</h2>
                <p className="text-gray-600 mt-1">ISBNバーコードを読み取って書籍を検索</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* モード選択 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => {
                  setScanMode('camera')
                  resetScan()
                }}
                className={`p-4 rounded-lg border transition-colors ${
                  scanMode === 'camera'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Camera className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">カメラで撮影</div>
              </button>
              <button
                onClick={() => {
                  setScanMode('upload')
                  resetScan()
                }}
                className={`p-4 rounded-lg border transition-colors ${
                  scanMode === 'upload'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">画像をアップロード</div>
              </button>
            </div>

            {/* スキャン エリア */}
            <div className="mb-6">
              {scanMode === 'camera' ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                    />
                  </div>
                  
                  {scanStatus === 'idle' && (
                    <button
                      onClick={startCameraScanning}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      スキャン開始
                    </button>
                  )}

                  {scanStatus === 'scanning' && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>バーコードを読み取り中...</span>
                      </div>
                      <p className="text-sm text-gray-600">バーコードにカメラを向けてください</p>
                      <button
                        onClick={stopScanning}
                        className="mt-3 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        停止
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">バーコード画像をアップロード</p>
                    <p className="text-sm text-gray-500">クリックして画像を選択</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {scanStatus === 'processing' && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-blue-600">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>画像を処理中...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ステータス表示 */}
            <AnimatePresence>
              {scanStatus === 'success' && scannedISBN && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-green-800 font-medium">ISBN読み取り成功！</p>
                      <p className="text-green-700 text-sm">ISBN: {scannedISBN}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {scanStatus === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">読み取りエラー</p>
                      <p className="text-red-700 text-sm">{errorMessage}</p>
                      <button
                        onClick={resetScan}
                        className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        再試行
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ヒント */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 スキャンのコツ</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• バーコード全体がはっきり見えるようにしてください</li>
                <li>• 十分な明るさがある場所で撮影してください</li>
                <li>• バーコードと平行に撮影してください</li>
                <li>• 手ブレしないようにしっかり固定してください</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}