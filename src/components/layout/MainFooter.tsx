// src/components/layout/MainFooter.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Youtube,
  ArrowUp,
  Sparkles,
  Shield,
  Award
} from 'lucide-react'

const footerSections = [
  {
    title: 'サービス',
    links: [
      { name: 'パーソナルAIコーチング', href: '/features' },
      { name: '性格診断', href: '/diagnosis' },
      { name: '学習プランニング', href: '/planning' },
      { name: '進路相談', href: '/counseling' },
      { name: '家庭教師AI', href: '/tutor' },
    ]
  },
  {
    title: '料金・プラン',
    links: [
      { name: '個人プラン', href: '/pricing#individual' },
      { name: '塾・学校向け（エンタープライズ）', href: '/enterprise' },
      { name: '無料体験', href: '/trial' },
      { name: 'お問い合わせ（統一窓口）', href: '/contact' },
    ]
  },
  {
    title: '会社情報',
    links: [
      { name: '私たちについて', href: '/about' },
      { name: 'ブログ', href: '/blog' },
      { name: 'お知らせ', href: '/news' },
    ]
  },
  {
    title: 'サポート',
    links: [
      { name: 'ヘルプセンター', href: '/help' },
      { name: 'よくある質問', href: '/faq' },
      { name: 'お問い合わせ', href: '/contact' },
      { name: 'システム状況', href: '/status' },
    ]
  }
]

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/lival_ai' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/lival_ai' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/lival_ai' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@lival_ai' },
]

const trustBadges = [
  { icon: Shield, text: 'プライバシー保護' },
  { icon: Award, text: '教育AI認定' },
  { icon: Sparkles, text: '最新技術' },
]

export default function MainFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* <video
        src="/webm/lai-V.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute bottom-0 right-4 w-40 h-auto pointer-events-none transform -translate-y-4 hidden md:block"
        aria-hidden="true"
      /> */}
      {/* メインフッター */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-12">
          
          {/* ブランドセクション */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg">
                <Image src="/images/lival-circle.png" alt="Lival AI Logo" width={40} height={40} />
              </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-2 h-2 text-yellow-600" />
                </motion.div>
              </div>
              <div>
                <Image
                  src="/images/header-livalAI.png"
                  alt="Lival AI"
                  width={120}
                  height={32}
                  className="h-8 w-auto mb-1 brightness-0 invert"
                  style={{ width: 'auto', height: '32px' }}
                />
                <div className="text-sm text-gray-400">
                  パーソナルAIコーチング
                </div>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              一人ひとりの特性に最適化されたAIコーチングで、
              すべての学習者が自分らしく成長できる教育環境を提供します。
            </p>

            {/* 信頼バッジ */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-5 sm:mb-6">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-2 bg-white/10 rounded-full px-2.5 py-1 text-xs sm:text-sm"
                >
                  <badge.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{badge.text}</span>
                </motion.div>
              ))}
            </div>

            {/* 連絡先情報 */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span>info@lival-ai.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span>東京都</span>
              </div>
            </div>
          </div>

          {/* リンクセクション */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              className="lg:col-span-1"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 block text-sm sm:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ボトムセクション */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* コピーライト */}
            <div className="text-gray-400 text-sm flex items-center space-x-2">
              <span>&copy; 2025</span>
              <Image
                src="/images/header-livalAI.png"
                alt="Lival AI"
                width={80}
                height={20}
                className="h-4 w-auto brightness-0 invert opacity-70"
                style={{ width: 'auto', height: '16px' }}
              />
              <span>All rights reserved.</span>
            </div>

            {/* 法的リンク */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                利用規約
              </Link>
              <Link href="/legal/tokushoho" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                特定商取引法に基づく表示
              </Link>
              <Link href="/security" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                セキュリティ
              </Link>
            </div>

            {/* ソーシャルメディア */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-200" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* トップに戻るボタン */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        aria-label="ページトップに戻る"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    </footer>
  )
}

