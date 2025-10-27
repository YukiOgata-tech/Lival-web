// src/app/blog/about/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Shield, 
  Users, 
  Crown, 
  BookOpen, 
 
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Eye,
  FileText,
  MessageSquare,
  Clock,
  Target,
  Lightbulb,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'ブログについて | Lival AI - 教育特化コンテンツプラットフォーム',
  description: 'Lival AIブログの仕組み、権限システム、コンテンツの価値について詳しく解説。質の高い教育コンテンツを提供するプラットフォームです。',
  keywords: 'Lival AI,教育ブログ,学習プラットフォーム,コンテンツ品質,審査システム'
}

export default function BlogAboutPage() {
  const qualityFeatures = [
    {
      icon: Shield,
      title: '厳格な審査システム',
      description: '全ての記事は教育専門の編集部が内容の正確性、有益性、独自性を徹底的に審査します。',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Users,
      title: '専門家による執筆',
      description: '教育業界の専門家、現場の教師、学習のプロフェッショナルが実践的なコンテンツを提供します。',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Award,
      title: '実証された効果',
      description: '実際の教育現場で検証された手法や、データに基づく学習メソッドのみを紹介しています。',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: TrendingUp,
      title: '継続的な改善',
      description: '読者のフィードバックと最新の教育研究を反映し、コンテンツを定期的に更新・改善しています。',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

  const accessLevels = [
    {
      icon: Eye,
      title: '無料記事',
      description: '教育の基礎知識や一般的な学習法について、誰でもアクセスできる記事です。',
      features: ['基礎的な学習法', '教育トレンド', '一般的なアドバイス'],
      color: 'border-gray-200 bg-gray-50'
    },
    {
      icon: BookOpen,
      title: 'ティザー記事',
      description: '導入部分は無料で読めますが、詳細な内容はサブスク会員限定です。',
      features: ['専門的な手法の概要', '実践事例の紹介', '詳細解説への導入'],
      color: 'border-blue-200 bg-blue-50'
    },
    {
      icon: Crown,
      title: 'プレミアム記事',
      description: 'サブスク会員のみがアクセスできる、最も価値の高いコンテンツです。',
      features: ['実践的なステップバイステップガイド', '専門家の独占インタビュー', 'ケーススタディと分析', 'ツールとテンプレート'],
      color: 'border-purple-200 bg-purple-50'
    }
  ]

  const contentTypes = [
    {
      icon: FileText,
      title: '実践ガイド',
      description: '具体的な手順で学習効果を最大化する方法を詳しく解説',
      examples: ['効果的なノート術', '記憶定着のテクニック', '時間管理術']
    },
    {
      icon: MessageSquare,
      title: '専門家インタビュー',
      description: '教育業界のトップランナーから学ぶ貴重な知見',
      examples: ['教育心理学者との対談', '成功した教師の秘訣', 'EdTech企業の最新動向']
    },
    {
      icon: Target,
      title: 'ケーススタディ',
      description: '実際の成功事例を詳細に分析し、再現可能な要素を抽出',
      examples: ['学習困難克服事例', '短期間での成績向上例', '効果的な指導法の実践']
    },
    {
      icon: Lightbulb,
      title: '最新研究解説',
      description: '教育・学習科学の最新研究を分かりやすく実践的に紹介',
      examples: ['脳科学に基づく学習法', 'AI活用の教育効果', '認知心理学の応用']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            教育特化ブログの
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              価値と仕組み
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/images/header-livalAI.png"
                alt="Lival AI"
                width={150}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
              <span className="text-white ml-2">ブログは、教育・学習の専門知識を厳選し、</span>
            </div>
            実践的で価値の高いコンテンツのみを提供する特別なプラットフォームです。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
            >
              ブログを読む
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              サブスクリプション詳細
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Why Our Blog is Special */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              なぜ
              <Image
                src="/images/header-livalAI.png"
                alt="Lival AI"
                width={120}
                height={32}
                className="h-6 w-auto inline mx-2"
              />
              ブログが特別なのか
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              一般的なブログとは異なり、教育に特化した専門性と品質管理により、
              本当に価値のある情報のみをお届けしています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {qualityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Access Levels */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              アクセスレベルと権限システム
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              読者のニーズに応じて、適切な情報を適切な形で提供する階層化されたアクセスシステムです。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accessLevels.map((level, index) => (
              <div key={index} className={`rounded-xl p-8 border-2 ${level.color} hover:shadow-lg transition-all`}>
                <div className="flex items-center space-x-3 mb-6">
                  <level.icon className="w-8 h-8 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-900">{level.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{level.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">含まれる内容：</h4>
                  <ul className="space-y-1">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Types */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              提供するコンテンツタイプ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              多様な形式で教育・学習に関する価値ある情報を提供し、
              あらゆる学習者のニーズに対応しています。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm">実例：</h4>
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, idx) => (
                      <span key={idx} className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publishing Process */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              記事公開までのプロセス
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">1. 執筆・投稿</h3>
                <p className="text-sm text-gray-600">専門家が実践的な内容を執筆し、プラットフォームに投稿</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">2. 専門審査</h3>
                <p className="text-sm text-gray-600">編集部が内容の正確性、有益性、独自性を徹底審査</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">3. 品質認定</h3>
                <p className="text-sm text-gray-600">基準をクリアした記事のみが品質認定を受けて承認</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">4. 公開配信</h3>
                <p className="text-sm text-gray-600">適切なアクセスレベルで読者に価値ある情報を提供</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              読者が得られる価値
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">学習効果の向上</h3>
              <p className="text-gray-600">
                科学的根拠に基づいた学習法により、効率的で効果的な学習が実現できます。
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">時間の節約</h3>
              <p className="text-gray-600">
                厳選された高品質な情報により、情報収集の時間を大幅に短縮できます。
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">専門性の獲得</h3>
              <p className="text-gray-600">
                業界トップクラスの専門家の知見を学び、自身の専門性を高められます。
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              今すぐ始めませんか？
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              質の高い教育コンテンツで、あなたの学習と成長を加速させましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
              >
                無料記事を読む
                <BookOpen className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                <Crown className="w-5 h-5 mr-2" />
                プレミアムを試す
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}