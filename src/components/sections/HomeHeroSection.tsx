'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Brain,
  Sparkles,
  Zap,
  Target,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  Play,
  Star
} from 'lucide-react'

// Lottie用のプレースホルダー
const LottieAnimation = ({ 
  className, 
  fallback 
}: { 
  className?: string
  fallback?: React.ReactNode 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {fallback || <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg animate-pulse" />}
    </div>
  )
}

// 固定パーティクル
const PARTICLES = [
  { id: 1, x: 10, y: 20, delay: 0, duration: 3, size: 2 },
  { id: 2, x: 80, y: 40, delay: 0.5, duration: 4, size: 3 },
  { id: 3, x: 30, y: 60, delay: 1, duration: 3.5, size: 2.5 },
  { id: 4, x: 70, y: 80, delay: 1.5, duration: 4.5, size: 2 },
  { id: 5, x: 50, y: 30, delay: 2, duration: 3, size: 3.5 },
  { id: 6, x: 20, y: 70, delay: 0.3, duration: 4, size: 2.5 },
  { id: 7, x: 90, y: 15, delay: 1.2, duration: 3.5, size: 2 },
  { id: 8, x: 40, y: 85, delay: 0.8, duration: 4.2, size: 3 },
  { id: 9, x: 60, y: 50, delay: 1.8, duration: 3.8, size: 2.5 },
  { id: 10, x: 15, y: 45, delay: 0.2, duration: 4.5, size: 2 },
  { id: 11, x: 85, y: 65, delay: 1.4, duration: 3.2, size: 3 },
  { id: 12, x: 35, y: 10, delay: 0.7, duration: 4.8, size: 2.5 },
  { id: 13, x: 75, y: 25, delay: 1.1, duration: 3.6, size: 2 },
  { id: 14, x: 25, y: 90, delay: 1.7, duration: 4.1, size: 3.5 },
  { id: 15, x: 65, y: 35, delay: 0.4, duration: 3.9, size: 2.5 },
  { id: 16, x: 45, y: 75, delay: 1.3, duration: 4.3, size: 2 },
  { id: 17, x: 95, y: 55, delay: 0.9, duration: 3.7, size: 3 },
  { id: 18, x: 5, y: 5, delay: 1.6, duration: 4.6, size: 2.5 },
  { id: 19, x: 55, y: 95, delay: 0.1, duration: 3.3, size: 2 },
  { id: 20, x: 12, y: 88, delay: 1.9, duration: 4.4, size: 3.5 }
]

export default function HomeHeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative md:min-h-[60vh] md:flex md:items-center md:justify-center overflow-hidden pt-4 pb-2 md:pt-10 md:pb-6"
    >
      {/* Background Animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"
        style={{ y }}
      />
      
      {/* Floating Particles - マウント後のみ表示 */}
      {isMounted && (
        <div className="absolute inset-0">
          {PARTICLES.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          
          {/* Main Headline */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 md:mb-8"
          >
            <h1 className="text-3xl md:text-6xl lg:text-7xl mb-3 md:mb-6">
              <span className="font-bold text-hero bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                あなただけの
              </span>
              <br />
              <div className="flex items-center justify-center">
                <Image
                  src="/images/header-livalAI.png"
                  alt="Lival AI"
                  width={300}
                  height={80}
                  className="h-10 md:h-16 lg:h-20 w-auto bg-emerald-300/40 rounded-4xl"
                  priority
                />
                <motion.span
                  className="inline-block ml-3 md:ml-4 text-stylish text-2xl md:text-4xl lg:text-5xl"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                >
                  ✨
                </motion.span>
              </div>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed font-soft">
              <span className="font-playful text-blue-700">6つの学習タイプ別</span>に最適化された
              <span className="block md:inline"><br className="md:hidden" /></span>
              <span className="font-accent text-purple-700">教育特化AIコーチング</span>で、学習効果を最大化
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-1 md:mb-2"
          >
            <Link
              href="/diagnosis"
              className="group relative px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base md:text-lg font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 md:transform md:hover:scale-105 shadow-lg hover:shadow-xl text-cta"
            >
              <span className="flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                無料性格診断を始める
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/daily-fortune"
              className="group flex items-center justify-center px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base md:text-lg font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 md:transform md:hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Star className="w-5 h-5 mr-2" />
              今日の学習運は？
            </Link>

            <button className="group flex items-center justify-center px-6 py-3 md:px-8 md:py-4 border-2 border-gray-300 text-gray-700 text-base md:text-lg font-semibold rounded-full hover:border-gray-400 transition-all duration-300 text-accent">
              <Play className="w-5 h-5 mr-2" />
              デモ動画を見る
            </button>
          </motion.div>

          {/* Hero Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mx-auto max-w-4xl px-4 md:px-0"
          >
            <LottieAnimation 
              className="h-44 sm:h-50 md:h-76 lg:h-[300px]" 
              fallback={
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl md:rounded-3xl p-8 md:p-16 relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 md:w-32 md:h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-10 h-10 md:w-16 md:h-16 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-s md:max-w-xl">
                      {[Brain, Target, Zap, Users, BookOpen, Award].map((Icon, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="w-8 h-8 md:w-12 md:h-12 bg-white/80 rounded-lg flex items-center justify-center shadow-lg"
                        >
                          <Icon className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - マウント後のみ表示 */}
      {isMounted && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="hidden md:block absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-1" />
          </div>
        </motion.div>
      )}
    </section>
  )
}
