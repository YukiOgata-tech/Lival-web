// src/components/sections/about-related/AboutMissionSection.tsx
'use client'
import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Globe } from 'lucide-react'

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

export default function AboutMissionSection() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            私たちの使命
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            教育の力で世界を変える。それが私たちLIVAL AIの使命です。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl blur-xl" 
                   style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${mission.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <mission.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{mission.title}</h3>
                <h4 className="text-lg font-semibold text-gray-300 mb-4">{mission.subtitle}</h4>
                <p className="text-gray-400 leading-relaxed">{mission.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}