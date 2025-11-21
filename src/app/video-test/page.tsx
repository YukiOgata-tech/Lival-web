// src/app/video-test/page.tsx
'use client'

import { useState, useEffect } from 'react';

interface VideoFile {
  name: string;
  size: string;
  sizeBytes: number;
  type: 'webm' | 'mov';
}

export default function VideoTestPage() {
  const [bgType, setBgType] = useState<'checker' | 'white' | 'black' | 'blue' | 'gradient'>('checker');
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [selectedVideo1, setSelectedVideo1] = useState<string>('');
  const [selectedVideo2, setSelectedVideo2] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 動画ファイル一覧を取得
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideoFiles(data.files);
        if (data.files.length > 0) {
          setSelectedVideo1(data.files[0].name);
          setSelectedVideo2(data.files.length > 1 ? data.files[1].name : data.files[0].name);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load videos:', error);
        setIsLoading(false);
      });
  }, []);

  const getBackgroundClass = () => {
    switch (bgType) {
      case 'checker':
        return 'bg-checker';
      case 'white':
        return 'bg-white';
      case 'black':
        return 'bg-black';
      case 'blue':
        return 'bg-blue-500';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-400 via-pink-500 to-red-500';
      default:
        return 'bg-checker';
    }
  };

  const getVideoInfo = (filename: string) => {
    return videoFiles.find(v => v.name === filename) || { name: filename, size: 'Unknown', sizeBytes: 0, type: 'webm' as const };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 md:p-8">
      <style jsx>{`
        .bg-checker {
          background-image:
            linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-4 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">WebMアニメーション テスト 🎬</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">動画ファイルを選択して表示テスト</p>

          {/* 背景切り替えボタン */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl border border-blue-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">🎨 背景タイプを選択:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => setBgType('checker')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  bgType === 'checker'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                チェッカー
              </button>
              <button
                onClick={() => setBgType('white')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  bgType === 'white'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                白
              </button>
              <button
                onClick={() => setBgType('black')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  bgType === 'black'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                黒
              </button>
              <button
                onClick={() => setBgType('blue')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  bgType === 'blue'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                青
              </button>
              <button
                onClick={() => setBgType('gradient')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  bgType === 'gradient'
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                グラデーション
              </button>
            </div>
          </div>

          {/* 動画表示エリア */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">動画ファイルを読み込んでいます...</p>
            </div>
          ) : videoFiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">動画ファイルが見つかりませんでした</p>
              <p className="text-gray-500 text-sm mt-2">public/webm フォルダに .webm ファイルを追加してください</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 動画1 */}
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-pink-200">
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                    🎬 動画を選択: ({videoFiles.length}件)
                  </label>
                  <select
                    value={selectedVideo1}
                    onChange={(e) => setSelectedVideo1(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {videoFiles.map((video) => (
                      <option key={video.name} value={video.name}>
                        {video.name} ({video.size}) - {video.type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${getBackgroundClass()} rounded-lg p-4 sm:p-6 flex items-center justify-center min-h-[250px] sm:min-h-[400px]`}>
                  {selectedVideo1 && (
                    <video
                      key={selectedVideo1}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full max-h-[300px] sm:max-h-[500px] rounded-lg shadow-lg"
                    >
                      <source
                        src={`/webm/${selectedVideo1}`}
                        type={selectedVideo1.endsWith('.mov') ? 'video/quicktime' : 'video/webm'}
                      />
                      お使いのブラウザはこのビデオ形式をサポートしていません。
                    </video>
                  )}
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 bg-white p-2.5 sm:p-3 rounded-lg">
                  <p><strong>ファイル:</strong> {selectedVideo1}</p>
                  <p><strong>タイプ:</strong> {getVideoInfo(selectedVideo1).type.toUpperCase()}</p>
                  <p><strong>サイズ:</strong> {getVideoInfo(selectedVideo1).size}</p>
                </div>
              </div>

              {/* 動画2 - モバイルでは非表示 */}
              <div className="hidden lg:block bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    🎬 動画を選択: ({videoFiles.length}件)
                  </label>
                  <select
                    value={selectedVideo2}
                    onChange={(e) => setSelectedVideo2(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {videoFiles.map((video) => (
                      <option key={video.name} value={video.name}>
                        {video.name} ({video.size}) - {video.type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${getBackgroundClass()} rounded-lg p-6 flex items-center justify-center min-h-[400px]`}>
                  {selectedVideo2 && (
                    <video
                      key={selectedVideo2}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full max-h-[500px] rounded-lg shadow-lg"
                    >
                      <source
                        src={`/webm/${selectedVideo2}`}
                        type={selectedVideo2.endsWith('.mov') ? 'video/quicktime' : 'video/webm'}
                      />
                      お使いのブラウザはこのビデオ形式をサポートしていません。
                    </video>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600 bg-white p-3 rounded-lg">
                  <p><strong>ファイル:</strong> {selectedVideo2}</p>
                  <p><strong>タイプ:</strong> {getVideoInfo(selectedVideo2).type.toUpperCase()}</p>
                  <p><strong>サイズ:</strong> {getVideoInfo(selectedVideo2).size}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 技術情報 */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">📝 技術情報</h2>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-900">ファイル:</span>
              <code className="ml-2 bg-white px-2 py-1 rounded border">/webm/XXXXXX.webm</code>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-gray-900">コーデック:</span>
              <span className="ml-2">VP8 + アルファチャンネル（yuva420p）</span>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-semibold text-green-800">✓ 背景透過:</span>
              <span className="ml-2 text-green-700">対応済み</span>
            </div>
          </div>
        </div>

        {/* 変換コマンド */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">🔧 背景透過動画 変換コマンド</h2>

          {/* WebM変換 */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">🌐</span>
              MOV → WebM (Chrome/Edge用)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              MOVファイル（アルファチャンネル付き）を背景透過WebMに変換するFFmpegコマンド:
            </p>

            {/* ビットレート選択 */}
            <div className="space-y-2 sm:space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs sm:text-sm font-semibold text-green-700">200k ビットレート (推奨 - 軽量)</p>
                </div>
                <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  <code>ffmpeg -i input.mov -c:v libvpx -pix_fmt yuva420p -auto-alt-ref 0 -b:v 200k output.webm</code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs sm:text-sm font-semibold text-blue-700">250k ビットレート (バランス)</p>
                </div>
                <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  <code>ffmpeg -i input.mov -c:v libvpx -pix_fmt yuva420p -auto-alt-ref 0 -b:v 250k output.webm</code>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2">パラメータ説明:</h4>
              <div className="space-y-1 sm:space-y-1.5">
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-blue-600 font-semibold text-xs">-c:v libvpx</code>: VP8コーデックを使用（VP9ではなくVP8が透過に対応）</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-blue-600 font-semibold text-xs">-pix_fmt yuva420p</code>: アルファチャンネル付きピクセルフォーマット（透過用）</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-blue-600 font-semibold text-xs">-auto-alt-ref 0</code>: 自動参照フレームを無効化（透過処理に必要）</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-blue-600 font-semibold text-xs">-b:v [値]</code>: ビットレート（低いほどファイルサイズ小）</p>
              </div>
            </div>
          </div>

          {/* HEVC (iOS) 変換 */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 flex items-center">
              <span className="mr-2">📱</span>
              MOV → HEVC (iOS Safari用)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
              iOSデバイスで背景透過を表示するにはHEVC形式が必要です:
            </p>

            <div className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg font-mono text-xs overflow-x-auto mb-3 sm:mb-4">
              <code>ffmpeg -i input.mov -c:v libx265 -tag:v hvc1 -pix_fmt yuva420p -crf 28 -preset fast output-ios.mov</code>
            </div>

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700 bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2">パラメータ説明:</h4>
              <div className="space-y-1 sm:space-y-1.5">
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-purple-600 font-semibold text-xs">-c:v libx265</code>: H.265/HEVCコーデックを使用</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-purple-600 font-semibold text-xs">-tag:v hvc1</code>: QuickTimeと互換性のあるhvc1タグ（iOS Safari用）</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-purple-600 font-semibold text-xs">-pix_fmt yuva420p</code>: アルファチャンネル付きピクセルフォーマット</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-purple-600 font-semibold text-xs">-crf 28</code>: 品質設定（0-51、低いほど高品質。28は良好なバランス）</p>
                <p><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-purple-600 font-semibold text-xs">-preset fast</code>: エンコード速度を設定</p>
              </div>
            </div>
          </div>

          {/* ブラウザ互換性情報 */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">🌍 ブラウザ互換性</h4>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-start">
                <span className="mr-2 flex-shrink-0">✅</span>
                <div>
                  <strong>WebM (VP8 + Alpha):</strong> Chrome, Edge, Firefox, Opera完全サポート
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-2 flex-shrink-0">❌</span>
                <div>
                  <strong>WebM透過:</strong> iOS Safari、macOS Safariは非対応
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-2 flex-shrink-0">✅</span>
                <div>
                  <strong>HEVC (H.265 + Alpha):</strong> iOS Safari、macOS Safari完全サポート
                </div>
              </div>
              <div className="flex items-start">
                <span className="mr-2 flex-shrink-0">⚠️</span>
                <div>
                  <strong>HEVCの制限:</strong> Chrome/Edgeは一部環境でサポート（ライセンス問題）
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>💡 推奨:</strong> WebMとHEVC両方を用意して、videoタグで複数sourceを指定すると全ブラウザで対応できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
