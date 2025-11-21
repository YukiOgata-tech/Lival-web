'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Heart, Lightbulb, Globe, ChevronDown } from 'lucide-react'

const missions = [
  {
    icon: Target,
    title: 'ミッション',
    subtitle: 'すべての学習者に最適な教育を',
    description: '地域や経済状況に関係なく、すべての学習者が自分に最適化された教育を受けられる世界を実現します。AIの力で教育格差をなくし、一人ひとりの可能性を最大限に引き出します。',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Heart,
    title: 'ビジョン',
    subtitle: '学ぶ楽しさを世界中に',
    description: '学習が義務ではなく、喜びとなる世界を目指します。AIコーチングを通じて、学習者が自分らしく成長し、学ぶことの楽しさを発見できる教育環境を創造します。',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Lightbulb,
    title: 'イノベーション',
    subtitle: '教育×テクノロジーの未来',
    description: '最新のAI技術と教育心理学を融合し、従来の一律教育から脱却。個性を活かした学習方法で、次世代の人材育成に貢献します。',
    color: 'from-green-500 to-teal-500'
  },
  {
    icon: Globe,
    title: 'インパクト',
    subtitle: '社会課題の解決へ',
    description: '不登校、教育格差、人材不足など、現代社会が抱える教育課題に正面から向き合い、テクノロジーの力で持続可能な解決策を提供します。',
    color: 'from-orange-500 to-red-500'
  }
]

function MissionCard({ mission, index }: { mission: typeof missions[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      key={mission.title}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="p-5 sm:p-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${mission.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
              <mission.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{mission.title}</h3>
              <h4 className="text-sm sm:text-base sm:font-semibold text-gray-300">{mission.subtitle}</h4>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '14px' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{mission.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function AboutMissionSection() {
  return (
    <section className="py-10 sm:py16 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
            私たちの使命
          </h2>
          <p className="text-sm sm:text-lg text-gray-300 max-w-3xl mx-auto">
            技術とAI教育の力でを変える。それが私たちLIVAL AIの使命です。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {missions.map((mission, index) => (
            <MissionCard key={mission.title} mission={mission} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}