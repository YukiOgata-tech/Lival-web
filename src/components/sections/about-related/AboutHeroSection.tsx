'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Sparkles, Users, GraduationCap } from 'lucide-react'

// 固定パーティクル（ランダム値を使わない）
const FIXED_PARTICLES = [
  { id: 1, x: 15, y: 25, delay: 0, duration: 4, size: 2 },
  { id: 2, x: 85, y: 45, delay: 0.8, duration: 3.5, size: 3 },
  { id: 3, x: 35, y: 65, delay: 1.2, duration: 4.2, size: 2.5 },
  { id: 4, x: 75, y: 15, delay: 0.3, duration: 3.8, size: 2 },
  { id: 5, x: 55, y: 85, delay: 1.5, duration: 4.5, size: 3.5 },
  { id: 6, x: 25, y: 35, delay: 0.6, duration: 3.2, size: 2.5 },
  { id: 7, x: 90, y: 70, delay: 1.8, duration: 4.1, size: 2 },
  { id: 8, x: 45, y: 20, delay: 0.9, duration: 3.7, size: 3 },
  { id: 9, x: 65, y: 55, delay: 1.1, duration: 3.9, size: 2.5 },
  { id: 10, x: 10, y: 80, delay: 0.4, duration: 4.3, size: 2 },
  { id: 11, x: 80, y: 30, delay: 1.6, duration: 3.6, size: 3 },
  { id: 12, x: 40, y: 90, delay: 0.7, duration: 4.4, size: 2.5 }
]

export default function AboutHeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/40" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Floating Elements - マウント後のみ表示 */}
      {isMounted && (
        <div className="absolute inset-0">
          {FIXED_PARTICLES.map((particle) => (
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
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Icon Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-gray-900" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 text-white">
              <span className="font-display font-bold">若い力で</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block text-hero">
                教育を革新
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto font-soft">
              <span className="font-playful text-blue-200">大学生を中心とした若いチーム</span>と、<span className="font-accent text-purple-200">現場を知る教育者たち</span>が手を取り合い、
              次世代の学習体験を創造しています。
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { icon: Users, label: 'チームメンバー', value: '15+' },
                { icon: GraduationCap, label: '大学生開発者', value: '8' },
                { icon: Brain, label: '教育専門家', value: '5' },
                { icon: Sparkles, label: '協力機関', value: '12' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                >
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}