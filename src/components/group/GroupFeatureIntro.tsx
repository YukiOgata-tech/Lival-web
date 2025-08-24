// src/components/group/GroupFeatureIntro.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users,
  Smartphone,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  MessageCircle,
  Target,
  Trophy,
  Clock,
  ArrowLeft,
  Download,
  Sparkles
} from 'lucide-react'

export default function GroupFeatureIntro() {
  const router = useRouter()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: Users,
      title: 'リアルタイム学習',
      description: '最大8人のグループで同時学習。お互いの進捗を確認しながら効率的な学習が可能',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'AI学習サポート',
      description: '専用AIがグループ全体の理解度を分析し、最適な学習プランを提案',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Trophy,
      title: 'ゲーミフィケーション',
      description: 'チーム戦やランキング機能で楽しく継続的な学習をサポート',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Target,
      title: '目標設定・達成',
      description: 'グループで共通の目標を設定し、みんなで達成を目指す仕組み',
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const steps = [
    {
      step: '1',
      title: 'プレミアムプランに登録',
      description: 'グループ学習機能はプレミアム会員限定機能です'
    },
    {
      step: '2', 
      title: 'モバイルアプリをダウンロード',
      description: 'App Store・Google Playからアプリを入手'
    },
    {
      step: '3',
      title: 'グループに参加・作成',
      description: '友達を招待するか、オープングループに参加'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* 戻るボタン */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ダッシュボードに戻る
        </button>
      </div>

      {/* ヒーローセクション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          モバイルアプリ限定機能
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          グループ学習で
          <span className="text-orange-600">効率UP</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          仲間と一緒に学ぶことで、モチベーション維持と学習効果を最大化。
          <br />
          AIが最適化したグループ学習体験をモバイルアプリでお楽しみください。
        </p>

        {/* アプリダウンロードCTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => router.push('/pricing')}
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Star className="w-5 h-5 mr-2" />
            プレミアムプランに登録
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-2">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-gray-500">App Store</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-2">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-gray-500">Google Play</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 機能紹介セクション */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            グループ学習の特徴
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            一人では続かない学習も、仲間がいれば楽しく継続できます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* デモ動画セクション */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          グループ学習の様子
        </h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden relative">
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-pink-600">
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all transform hover:scale-110"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold">グループ学習デモ動画</h3>
                  <p className="text-sm opacity-90">実際の学習風景をご覧ください</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-white text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">デモ動画はモバイルアプリでご確認ください</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 始め方セクション */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            グループ学習の始め方
          </h2>
          <p className="text-gray-600">
            簡単3ステップですぐに始められます
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center relative"
            >
              {/* ステップ間の線 */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
              )}
              
              <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 relative z-10">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 価格・プラン案内 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          グループ学習を始めませんか？
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          プレミアムプランで全ての機能をご利用いただけます。
          <br />
          初回7日間無料でお試しいただけます。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/pricing')}
            className="inline-flex items-center px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Star className="w-5 h-5 mr-2" />
            プレミアムプランを見る
          </button>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-semibold"
          >
            ダッシュボードに戻る
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            7日間無料試用
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            いつでもキャンセル可能
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
            全機能利用可能
          </div>
        </div>
      </motion.div>
    </div>
  )
}