'use client'

import { motion } from 'framer-motion'
import { Users, Clock, TrendingUp, Star } from 'lucide-react'

// 統計数値
const stats = [
  { label: '利用学生数', value: '10,000+', icon: Users },
  { label: '学習時間', value: '500,000+', suffix: '時間', icon: Clock },
  { label: '成績向上率', value: '95%', icon: TrendingUp },
  { label: '満足度', value: '4.9', suffix: '/5.0', icon: Star },
]

export default function HomeStatsSection() {
  return (
    <section className="py-20 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}<span className="text-blue-600">{stat.suffix}</span>
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}