// src/components/layout/MainHeader.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Brain, Sparkles, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navigationItems = [
  { name: 'ホーム', href: '/' },
  { name: '機能', href: '/features' },
  { name: '料金', href: '/subscription' },
  { name: 'ブログ', href: '/blog' },
  { name: '会社概要', href: '/about' },
]

const ctaButtons = [
  { name: '学習タイプ診断', href: '/diagnosis', variant: 'outline' as const },
  { name: '無料で始める', href: '/signup', variant: 'primary' as const },
]

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, loading, signOut } = useAuth()

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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          
          {/* ロゴセクション */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
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
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LIVAL AI
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">
                パーソナルAIコーチング
              </span>
            </div>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
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
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                      >
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ダッシュボード
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          プロフィール
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
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
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-600 text-blue-600 hover:bg-blue-50"
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
                          ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
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
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="メニューを開く"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
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
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
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
                      className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* モバイル CTA ボタン */}
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  {!loading && (
                    user ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: navigationItems.length * 0.05 }}
                        >
                          <div className="mx-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">
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
                            className="block mx-4 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors duration-200"
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
                            className="block w-full text-left mx-4 px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors duration-200"
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
                            className="block mx-4 px-4 py-3 rounded-lg font-medium text-center transition-all duration-200 border border-blue-600 text-blue-600 hover:bg-blue-50"
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
                                  ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
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