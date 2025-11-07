// src/components/layout/MainHeader.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, User, LogOut, Settings, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navigationItems = [
  { name: 'ホーム', href: '/' },
  { name: '機能', href: '/features' },
  { name: 'AIチャット', href: '/lival-agent-mode/threads' },
  { name: '料金', href: '/pricing' },
  { name: 'ブログ', href: '/blog' },
  { name: 'お知らせ', href: '/news' },
  { name: '会社概要', href: '/about' },
]

const ctaButtons = [
  { name: '学習タイプ診断', href: '/diagnosis', variant: 'outline' as const },
  { name: '無料で始める', href: '/signup', variant: 'primary' as const },
]

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, loading, signOut, isAdmin } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 border-b border-gray-700/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          
          {/* ロゴセクション */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg">
                <Image src="/images/lival-circle.png" alt="Lival AI Logo" width={40} height={40} priority />
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
            <div className="flex flex-col">
              <Image
                src="/images/header-livalAI.png"
                alt="Lival AI"
                width={120}
                height={32}
                className="h-6 lg:h-8 w-auto brightness-0 invert"
                priority
              />
              <span className="text-xs text-gray-400 hidden sm:block">
                パーソナル教育AI
              </span>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-300 hover:text-blue-400 transition-colors duration-200 font-medium group"
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}
          </nav>

          {/* CTA ボタン（デスクトップ） */}
          <div className="hidden lg:flex items-center space-x-3">
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300 font-medium">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-1"
                      >
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ダッシュボード
                        </Link>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          アカウント
                        </Link>
                        
                        {/* 管理者専用メニュー */}
                        {isAdmin && (
                          <>
                            <hr className="my-1 border-gray-600" />
                            <div className="px-3 py-1">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                管理者メニュー
                              </span>
                            </div>
                            <Link
                              href="/admin"
                              className="block px-4 py-2 text-orange-300 hover:bg-gray-700 transition-colors items-center space-x-2"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield className="w-4 h-4" />
                              <span>管理ダッシュボード</span>
                            </Link>
                            <Link
                              href="/admin/news"
                              className="block px-4 py-2 text-orange-300 hover:bg-gray-700 transition-colors items-center space-x-2"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-4 h-4" />
                              <span>お知らせ管理</span>
                            </Link>
                          </>
                        )}
                        
                        <hr className="my-1 border-gray-600" />
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>ログアウト</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    ログイン
                  </Link>
                  {ctaButtons.map((button) => (
                    <Link
                      key={button.name}
                      href={button.href}
                      className={`
                        px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
                        ${button.variant === 'outline'
                          ? 'border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                        }
                      `}
                    >
                      {button.name}
                    </Link>
                  ))}
                </>
              )
            )}
          </div>

          {/* モバイルメニューボタン */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-700 bg-gray-900/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-1">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* モバイル CTA ボタン */}
                <div className="pt-4 space-y-2 border-t border-gray-700">
                  {!loading && (
                    user ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: navigationItems.length * 0.05 }}
                        >
                          <div className="mx-4 p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-300 font-medium">
                                {user.displayName || user.email?.split('@')[0]}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: (navigationItems.length + 1) * 0.05 }}
                        >
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="block mx-4 px-4 py-3 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                          >
                            ダッシュボード
                          </Link>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: (navigationItems.length + 2) * 0.05 }}
                        >
                          <button
                            onClick={() => {
                              handleSignOut()
                              setIsMenuOpen(false)
                            }}
                            className="block w-full text-left mx-4 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
                          >
                            ログアウト
                          </button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: navigationItems.length * 0.05 }}
                        >
                          <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block mx-4 px-4 py-3 rounded-lg font-medium text-center transition-all duration-200 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                          >
                            ログイン
                          </Link>
                        </motion.div>
                        {ctaButtons.map((button, index) => (
                          <motion.div
                            key={button.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: (navigationItems.length + index + 1) * 0.05 }}
                          >
                            <Link
                              href={button.href}
                              onClick={() => setIsMenuOpen(false)}
                              className={`
                                block mx-4 px-4 py-3 rounded-lg font-medium text-center transition-all duration-200
                                ${button.variant === 'outline'
                                  ? 'border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                                }
                              `}
                            >
                              {button.name}
                            </Link>
                          </motion.div>
                        ))}
                      </>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
