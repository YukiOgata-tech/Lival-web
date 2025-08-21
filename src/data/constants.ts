// src/data/constants.ts
import { 
  Brain, 
  Target, 
  MessageCircle, 
  BookOpen, 
  Award, 
  Shield,
  Users,
  Clock,
  TrendingUp,
  Star,
  Lightbulb,
  Zap,
  Heart,
  Rocket,
  CheckCircle,
  Calendar
} from 'lucide-react'

import type { StudentType } from '@/types'

/**
 * サイト基本情報
 */
export const SITE_CONFIG = {
  name: 'LIVAL AI',
  description: 'パーソナルAIコーチング',
  tagline: '一人ひとりの特性に最適化されたAIコーチング',
  url: 'https://lival-ai.com',
  author: 'LIVAL AI Team',
  social: {
    twitter: 'https://twitter.com/lival_ai',
    facebook: 'https://facebook.com/lival_ai',
    instagram: 'https://instagram.com/lival_ai',
    youtube: 'https://youtube.com/@lival_ai'
  }
}

/**
 * 統計データ
 */
export const STATS_DATA = [
  { 
    label: '利用学生数', 
    value: '10,000+', 
    icon: Users,
    description: '全国の学習者が利用'
  },
  { 
    label: '学習時間', 
    value: '500,000+', 
    suffix: '時間', 
    icon: Clock,
    description: '累計学習サポート時間'
  },
  { 
    label: '成績向上率', 
    value: '95%', 
    icon: TrendingUp,
    description: '利用者の成績向上実績'
  },
  { 
    label: '満足度', 
    value: '4.9', 
    suffix: '/5.0', 
    icon: Star,
    description: 'ユーザー評価平均'
  },
]

/**
 * 主要機能
 */
export const FEATURES_DATA = [
  {
    icon: Brain,
    title: 'パーソナルAIコーチ',
    description: '6つの学習タイプに基づいた、あなただけのAI専門チーム',
    color: 'from-blue-500 to-purple-600',
    details: [
      '性格診断に基づく個別最適化',
      '24時間365日対応',
      '3つの専門AIエージェント',
      '学習進捗の自動分析'
    ]
  },
  {
    icon: Target,
    title: '個別最適化学習',
    description: '性格診断と学習履歴から、最適な学習プランを自動生成',
    color: 'from-purple-500 to-pink-600',
    details: [
      'AIによる学習計画自動生成',
      '苦手分野の重点対策',
      '学習ペースの自動調整',
      '目標達成率90%以上'
    ]
  },
  {
    icon: MessageCircle,
    title: '24時間サポート',
    description: 'いつでもどこでも、専門AIがあなたの質問に即座に回答',
    color: 'from-green-500 to-blue-600',
    details: [
      '瞬時のQ&A対応',
      '科目別専門サポート',
      '学習相談・進路相談',
      '保護者向け報告機能'
    ]
  },
  {
    icon: BookOpen,
    title: '豊富な学習コンテンツ',
    description: '厳選されたYouTube動画や問題集で効率的な学習',
    color: 'from-orange-500 to-red-600',
    details: [
      '現役大学生が選定した動画',
      '理解度別問題セット',
      '苦手克服コンテンツ',
      '受験対策専用教材'
    ]
  },
  {
    icon: Award,
    title: '進捗可視化',
    description: '学習の成果を分かりやすくグラフで表示、モチベーション維持',
    color: 'from-yellow-500 to-orange-600',
    details: [
      'リアルタイム進捗表示',
      '成績向上グラフ',
      '学習時間統計',
      '達成バッジシステム'
    ]
  },
  {
    icon: Shield,
    title: '安心・安全',
    description: '教育専門チーム監修のセキュアな学習環境',
    color: 'from-teal-500 to-green-600',
    details: [
      'プライバシー完全保護',
      '教育専門家監修',
      'セキュリティ認証取得',
      '24時間監視体制'
    ]
  }
]

/**
 * 学習者タイプ定義
 */
export const STUDENT_TYPES_DATA = [
  { 
    type: 'strategist' as StudentType,
    name: '戦略家', 
    description: '論理的思考で効率を重視', 
    icon: '🎯', 
    color: 'from-blue-400 to-blue-600',
    characteristics: [
      '計画的な学習が得意',
      '全体像を理解してから詳細に進む',
      '効率的な方法を常に模索',
      '目標設定が明確'
    ],
    aiCoachingStyle: '体系的で論理的な説明を重視し、学習計画の立案をサポート'
  },
  { 
    type: 'explorer' as StudentType,
    name: '探求家', 
    description: '好奇心旺盛で発見を楽しむ', 
    icon: '🔍', 
    color: 'from-purple-400 to-purple-600',
    characteristics: [
      '新しい発見にワクワクする',
      '試行錯誤を楽しむ',
      '関連知識を広く学ぶ',
      '創造的な解決策を好む'
    ],
    aiCoachingStyle: '知的好奇心を刺激し、発見的学習をガイド'
  },
  { 
    type: 'achiever' as StudentType,
    name: '努力家', 
    description: '継続的な努力で成果を積み上げ', 
    icon: '💪', 
    color: 'from-green-400 to-green-600',
    characteristics: [
      '継続的な努力を重視',
      '小さな成果の積み重ねを大切にする',
      '褒められることでやる気が出る',
      '真面目で責任感が強い'
    ],
    aiCoachingStyle: '努力を具体的に評価し、継続的な励ましでサポート'
  },
  { 
    type: 'challenger' as StudentType,
    name: '挑戦家', 
    description: '競争を楽しみ限界に挑戦', 
    icon: '⚡', 
    color: 'from-red-400 to-red-600',
    characteristics: [
      '競争や挑戦を楽しむ',
      '困難な問題に立ち向かう',
      'スピード感のある学習を好む',
      '結果重視の姿勢'
    ],
    aiCoachingStyle: '挑戦的な課題を提示し、競争心を活かした学習をサポート'
  },
  { 
    type: 'partner' as StudentType,
    name: '伴走者', 
    description: '協力と共感を大切にする', 
    icon: '🤝', 
    color: 'from-pink-400 to-pink-600',
    characteristics: [
      '他者との協力を重視',
      '共感的なコミュニケーションを好む',
      '安心できる環境で力を発揮',
      '人間関係を大切にする'
    ],
    aiCoachingStyle: '共感的で温かいサポートを提供し、安心感を重視'
  },
  { 
    type: 'pragmatist' as StudentType,
    name: '効率家', 
    description: '最短ルートで結果を追求', 
    icon: '🚀', 
    color: 'from-orange-400 to-orange-600',
    characteristics: [
      '実用性と効率性を重視',
      '最短距離での目標達成を目指す',
      '要点を押さえた学習を好む',
      '結果に直結する方法を選ぶ'
    ],
    aiCoachingStyle: '要点を絞った効率的な学習方法を提案し、結果重視でサポート'
  }
]

/**
 * 利用者の声
 */
export const TESTIMONIALS_DATA = [
  {
    name: '田中 さくら',
    grade: '高校2年生',
    studentType: 'achiever' as StudentType,
    comment: 'AIコーチのおかげで数学が20点もアップ！私の性格に合わせた勉強法が見つかりました。毎日の小さな成果を褒めてくれるので、続けられています。',
    avatar: '👩‍🎓',
    rating: 5,
    improvementData: {
      subject: '数学',
      beforeScore: 65,
      afterScore: 85,
      period: '3ヶ月'
    }
  },
  {
    name: '山田 健太',
    grade: '中学3年生',
    studentType: 'challenger' as StudentType,
    comment: '24時間いつでも質問できるのが最高。夜遅くでもすぐに答えてくれるから助かってます。難しい問題にも挑戦したくなります！',
    avatar: '👨‍🎓',
    rating: 5,
    improvementData: {
      subject: '英語',
      beforeScore: 70,
      afterScore: 90,
      period: '2ヶ月'
    }
  },
  {
    name: '佐藤 美咲',
    grade: '高校1年生',
    studentType: 'partner' as StudentType,
    comment: '不登校でしたが、AIコーチと一緒なら勉強が楽しい。自分のペースで進められるのが嬉しいです。優しく声をかけてくれるので安心できます。',
    avatar: '👩‍💼',
    rating: 5,
    improvementData: {
      subject: '全科目',
      beforeScore: 45,
      afterScore: 75,
      period: '6ヶ月'
    }
  },
  {
    name: '鈴木 大輔',
    grade: '高校3年生',
    studentType: 'strategist' as StudentType,
    comment: '受験勉強の計画立てが苦手でしたが、AIが効率的なスケジュールを組んでくれて助かりました。志望校に合格できそうです！',
    avatar: '👨‍💼',
    rating: 5,
    improvementData: {
      subject: '総合',
      beforeScore: 60,
      afterScore: 85,
      period: '8ヶ月'
    }
  },
  {
    name: '高橋 愛',
    grade: '中学2年生',
    studentType: 'explorer' as StudentType,
    comment: '理科の実験動画がとても面白くて、もっと知りたくなります。AIが私の興味に合わせて色々な情報を教えてくれるのが楽しいです。',
    avatar: '👩‍🔬',
    rating: 5,
    improvementData: {
      subject: '理科',
      beforeScore: 55,
      afterScore: 85,
      period: '4ヶ月'
    }
  },
  {
    name: '伊藤 翔太',
    grade: '高校3年生',
    studentType: 'pragmatist' as StudentType,
    comment: '時間がない中での受験勉強でしたが、要点を絞った効率的な学習で成績アップ。無駄がなくて助かりました！',
    avatar: '👨‍🎯',
    rating: 5,
    improvementData: {
      subject: '現代文',
      beforeScore: 50,
      afterScore: 80,
      period: '3ヶ月'
    }
  }
]

/**
 * よくある質問
 */
export const FAQ_DATA = [
  {
    question: 'LIVAL AIはどのような学習者に適していますか？',
    answer: '小学生から高校生まで、あらゆる学習者に対応しています。特に、一人ひとりに合わせた学習方法を求める方、24時間サポートを必要とする方、不登校や学習に不安を抱える方におすすめです。'
  },
  {
    question: '性格診断はどのくらい正確ですか？',
    answer: '教育心理学の専門家が監修した12問の診断テストで、学習スタイルを6つのタイプに分類します。診断結果は学習履歴とともに継続的に最適化されます。'
  },
  {
    question: '料金はいくらですか？',
    answer: '個人プランは月額2,980円から、塾・学校向けプランもご用意しています。まずは無料体験で効果を実感してください。'
  },
  {
    question: 'AIの回答の精度は大丈夫ですか？',
    answer: '最新のAI技術と教育専門家の知見を組み合わせ、高精度な回答を提供しています。また、不適切な内容は24時間監視体制でチェックしています。'
  },
  {
    question: 'スマートフォンでも利用できますか？',
    answer: 'はい、スマートフォン、タブレット、PCなど、あらゆるデバイスでご利用いただけます。専用アプリも提供予定です。'
  },
  {
    question: '退会はいつでも可能ですか？',
    answer: 'はい、いつでも簡単に退会できます。違約金や解約手数料は一切かかりません。'
  }
]

/**
 * 価格プラン
 */
export const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'ベーシック',
    price: 2980,
    currency: 'JPY',
    interval: 'month',
    description: '個人学習者向けスタンダードプラン',
    features: [
      '性格診断・学習タイプ判定',
      '3つのAI専門エージェント',
      '24時間質問対応',
      '学習計画自動生成',
      '進捗レポート（月1回）',
      '基本学習コンテンツ'
    ],
    isPopular: false,
    isActive: true,
    maxStudents: 1
  },
  {
    id: 'premium',
    name: 'プレミアム',
    price: 4980,
    currency: 'JPY', 
    interval: 'month',
    description: '本格的な学習サポートを求める方向け',
    features: [
      'ベーシックプランの全機能',
      '人間カウンセラーとの面談（月2回）',
      '詳細進捗レポート（週1回）',
      '保護者向けレポート',
      '優先サポート',
      'プレミアム学習コンテンツ',
      '学習時間無制限'
    ],
    isPopular: true,
    isActive: true,
    maxStudents: 1
  },
  {
    id: 'enterprise',
    name: 'エンタープライズ',
    price: 50000,
    currency: 'JPY',
    interval: 'month',
    description: '塾・学校向け包括プラン',
    features: [
      '最大50名の学生管理',
      '講師向け管理画面',
      '一括進捗管理',
      '詳細分析レポート',
      'カスタマイズ可能',
      '専任サポート担当',
      'API連携対応',
      '導入研修・サポート'
    ],
    isPopular: false,
    isActive: true,
    maxStudents: 50
  }
]

/**
 * ナビゲーション項目
 */
export const NAVIGATION_ITEMS = [
  { name: 'ホーム', href: '/', description: 'トップページ' },
  { name: '機能', href: '/features', description: 'サービス機能紹介' },
  { name: '料金', href: '/pricing', description: '料金プラン' },
  { name: 'ブログ', href: '/blog', description: '教育・AI情報' },
  { name: '会社概要', href: '/about', description: '会社情報' },
  { name: 'お問い合わせ', href: '/contact', description: 'ご質問・ご相談' }
]

/**
 * CTA（Call to Action）ボタン
 */
export const CTA_BUTTONS = [
  { 
    name: '無料診断', 
    href: '/diagnosis', 
    variant: 'outline' as const,
    description: '2分で完了する性格診断'
  },
  { 
    name: '無料体験', 
    href: '/trial', 
    variant: 'primary' as const,
    description: '実際のAIコーチングを体験'
  },
]

/**
 * フッターリンク
 */
export const FOOTER_SECTIONS = [
  {
    title: 'サービス',
    links: [
      { name: 'パーソナルAIコーチング', href: '/features' },
      { name: '性格診断', href: '/diagnosis' },
      { name: '学習プランニング', href: '/features/planning' },
      { name: '進路相談', href: '/features/counseling' },
      { name: '家庭教師AI', href: '/features/tutor' },
    ]
  },
  {
    title: '料金・プラン',
    links: [
      { name: '個人プラン', href: '/pricing#individual' },
      { name: '塾・学校向け', href: '/pricing#enterprise' },
      { name: '無料体験', href: '/trial' },
      { name: '法人お問い合わせ', href: '/contact/enterprise' },
    ]
  },
  {
    title: '会社情報',
    links: [
      { name: '私たちについて', href: '/about' },
      { name: 'ブログ', href: '/blog' },
      { name: 'お知らせ', href: '/news' },
      { name: 'プレスリリース', href: '/press' },
      { name: '採用情報', href: '/careers' },
    ]
  },
  {
    title: 'サポート',
    links: [
      { name: 'ヘルプセンター', href: '/help' },
      { name: 'よくある質問', href: '/faq' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: 'システム状況', href: '/status' },
      { name: 'APIドキュメント', href: '/docs' },
    ]
  }
]

/**
 * ソーシャルメディアリンク
 */
export const SOCIAL_LINKS = [
  { 
    name: 'Twitter', 
    icon: 'Twitter', 
    href: 'https://twitter.com/lival_ai',
    color: '#1DA1F2'
  },
  { 
    name: 'Facebook', 
    icon: 'Facebook', 
    href: 'https://facebook.com/lival_ai',
    color: '#4267B2'
  },
  { 
    name: 'Instagram', 
    icon: 'Instagram', 
    href: 'https://instagram.com/lival_ai',
    color: '#E4405F'
  },
  { 
    name: 'YouTube', 
    icon: 'Youtube', 
    href: 'https://youtube.com/@lival_ai',
    color: '#FF0000'
  },
]

/**
 * 信頼バッジ
 */
export const TRUST_BADGES = [
  { 
    icon: Shield, 
    text: 'プライバシー保護',
    description: 'ISO27001準拠のセキュリティ対策'
  },
  { 
    icon: Award, 
    text: '教育AI認定',
    description: '文部科学省後援の教育AI認定取得'
  },
  { 
    icon: CheckCircle, 
    text: '専門家監修',
    description: '教育心理学の専門家チームが監修'
  },
]

/**
 * 成功事例カテゴリ
 */
export const SUCCESS_CATEGORIES = [
  {
    id: 'grade_improvement',
    name: '成績向上',
    description: '定期テスト・模試での成績アップ事例',
    icon: TrendingUp,
    color: 'from-green-500 to-blue-600'
  },
  {
    id: 'motivation',
    name: '学習意欲向上',
    description: '勉強嫌いから学習好きへの変化',
    icon: Heart,
    color: 'from-pink-500 to-red-600'
  },
  {
    id: 'special_needs',
    name: '特別支援',
    description: '不登校や学習障害のサポート事例',
    icon: Users,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'exam_success',
    name: '受験合格',
    description: '志望校合格までのサポート事例',
    icon: Target,
    color: 'from-yellow-500 to-orange-600'
  }
]

/**
 * 学習科目
 */
export const SUBJECTS = [
  { id: 'math', name: '数学', icon: '📐', color: 'bg-blue-500' },
  { id: 'japanese', name: '国語', icon: '📚', color: 'bg-red-500' },
  { id: 'english', name: '英語', icon: '🌍', color: 'bg-green-500' },
  { id: 'science', name: '理科', icon: '🧪', color: 'bg-purple-500' },
  { id: 'social', name: '社会', icon: '🌏', color: 'bg-yellow-500' },
  { id: 'programming', name: 'プログラミング', icon: '💻', color: 'bg-gray-500' },
]

/**
 * 学年定義
 */
export const GRADE_LEVELS = [
  { id: 1, name: '小学1年生', shortName: '小1', category: 'elementary' },
  { id: 2, name: '小学2年生', shortName: '小2', category: 'elementary' },
  { id: 3, name: '小学3年生', shortName: '小3', category: 'elementary' },
  { id: 4, name: '小学4年生', shortName: '小4', category: 'elementary' },
  { id: 5, name: '小学5年生', shortName: '小5', category: 'elementary' },
  { id: 6, name: '小学6年生', shortName: '小6', category: 'elementary' },
  { id: 7, name: '中学1年生', shortName: '中1', category: 'junior_high' },
  { id: 8, name: '中学2年生', shortName: '中2', category: 'junior_high' },
  { id: 9, name: '中学3年生', shortName: '中3', category: 'junior_high' },
  { id: 10, name: '高校1年生', shortName: '高1', category: 'high_school' },
  { id: 11, name: '高校2年生', shortName: '高2', category: 'high_school' },
  { id: 12, name: '高校3年生', shortName: '高3', category: 'high_school' },
]

/**
 * AIエージェント情報
 */
export const AI_AGENTS = [
  {
    type: 'tutor' as const,
    name: '家庭教師AI',
    description: '問題解説と学習指導の専門AI',
    icon: BookOpen,
    color: 'from-blue-500 to-indigo-600',
    features: [
      '画像認識による問題解説',
      '詳細な解法ステップ説明', 
      '類似問題の提案',
      '理解度チェック'
    ],
    personality: '丁寧で分かりやすい説明を心がけ、学習者のペースに合わせて指導'
  },
  {
    type: 'counselor' as const,
    name: '進路カウンセラーAI',
    description: '進路相談と情報提供の専門AI',
    icon: Target,
    color: 'from-purple-500 to-pink-600',
    features: [
      '志望校情報の提供',
      '進路相談・アドバイス',
      '受験戦略の立案',
      '最新入試情報の検索'
    ],
    personality: '共感的で励ましながら、現実的なアドバイスを提供'
  },
  {
    type: 'planner' as const,
    name: '学習計画AI',
    description: '学習計画の立案と管理の専門AI',
    icon: Calendar,
    color: 'from-green-500 to-teal-600',
    features: [
      '個別学習計画の作成',
      '進捗状況の分析',
      'スケジュール調整',
      '学習時間の最適化'
    ],
    personality: '効率的で実用的な計画を提案し、継続をサポート'
  }
]

/**
 * セキュリティ・プライバシー対策
 */
export const SECURITY_FEATURES = [
  {
    title: 'データ暗号化',
    description: '全ての通信とデータは最高レベルの暗号化で保護',
    icon: Shield
  },
  {
    title: 'プライバシー保護',
    description: '個人情報は厳格な管理下で、第三者への提供は一切なし',
    icon: Users
  },
  {
    title: '24時間監視',
    description: 'AIの応答内容を24時間体制で監視・品質管理',
    icon: Clock
  },
  {
    title: '認証システム',
    description: '多要素認証によるセキュアなアカウント管理',
    icon: CheckCircle
  }
]

/**
 * 開発・運用チーム
 */
export const TEAM_ROLES = [
  {
    role: 'AI Engineer',
    description: 'AIモデルの開発・最適化を担当',
    skills: ['機械学習', 'NLP', 'データサイエンス']
  },
  {
    role: 'Education Specialist',
    description: '教育カリキュラム・コンテンツの監修',
    skills: ['教育心理学', 'カリキュラム設計', '学習効果測定']
  },
  {
    role: 'UX Designer',
    description: 'ユーザビリティ・学習体験の設計',
    skills: ['UXデザイン', 'プロトタイピング', 'ユーザーリサーチ']
  },
  {
    role: 'Quality Assurance',
    description: 'AIの応答品質・安全性の管理',
    skills: ['品質管理', 'テスト設計', 'リスク評価']
  }
]

/**
 * アニメーション設定
 */
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

/**
 * カラーテーマ
 */
export const COLOR_THEMES = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    900: '#581c87'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f'
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d'
  }
}

export default {
  SITE_CONFIG,
  STATS_DATA,
  FEATURES_DATA,
  STUDENT_TYPES_DATA,
  TESTIMONIALS_DATA,
  FAQ_DATA,
  PRICING_PLANS,
  NAVIGATION_ITEMS,
  CTA_BUTTONS,
  FOOTER_SECTIONS,
  SOCIAL_LINKS,
  TRUST_BADGES,
  SUCCESS_CATEGORIES,
  SUBJECTS,
  GRADE_LEVELS,
  AI_AGENTS,
  SECURITY_FEATURES,
  TEAM_ROLES,
  ANIMATION_VARIANTS,
  COLOR_THEMES
}