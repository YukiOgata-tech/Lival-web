'use client'

import { motion } from 'framer-motion'
import { School, Users, Building, Award, ChevronRight } from 'lucide-react'

const partnerCategories = [
  {
    icon: School,
    title: '教育機関',
    description: '全国の学校・塾との協力関係',
    partners: [
      { name: '私立中高一貫校', count: '3校', region: '東京・大阪' },
      { name: '個人経営塾', count: '8塾', region: '全国' },
      { name: '学習支援NPO', count: '2団体', region: '関東・関西' }
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Users,
    title: '教育専門家',
    description: '現場経験豊富な教育者たち',
    partners: [
      { name: '現役教師', count: '4名', region: '小中高' },
      { name: '塾経営者', count: '3名', region: '個別・集団指導' },
      { name: '教育心理学者', count: '1名', region: '大学・研究機関' }
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Building,
    title: '技術パートナー',
    description: 'AI・システム開発の協力企業',
    partners: [
      { name: 'スタートアップ', count: '1社', region: 'Tech・AI' },
      { name: '大学研究室', count: '1研究室', region: 'AI・教育工学' },
      { name: 'フリーランス', count: '2名', region: 'デザイン・開発' }
    ],
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Award,
    title: '支援・認定',
    description: '公的機関からの支援と認定',
    partners: [
      { name: '自治体', count: '2自治体', region: '教育DX支援' },
      { name: '大学インキュベーター', count: '1機関', region: 'ビジネス支援' },
      { name: '教育関連協会', count: '3団体', region: '認定・推薦' }
    ],
    color: 'from-orange-500 to-red-600'
  }
]

const testimonials = [
  {
    name: '田中 先生',
    role: '私立高校 数学教師（指導歴15年）',
    comment: '生徒一人ひとりの特性を理解し、最適化された指導ができる。これまでの経験とAIの力が組み合わさることで、教育の可能性が大きく広がります。',
    avatar: '👨‍🏫'
  },
  {
    name: '山田 塾長',
    role: '個人塾経営（生徒数120名）',
    comment: '人手不足が深刻な中、AIコーチングは救世主。講師の負担を減らしながら、生徒により質の高い指導を提供できるようになりました。',
    avatar: '👩‍💼'
  },
  {
    name: '佐藤 教授',
    role: '教育心理学（大学教授）',
    comment: '学習者の心理特性を科学的に分析し、個別最適化を実現するアプローチは画期的。若いチームの技術力と教育への情熱に期待しています。',
    avatar: '👨‍🎓'
  }
]

export default function AboutPartnersSection() {
  return (
    <section className="py-20 bg-slate-800/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            協力パートナー
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            現場を知る教育者、最新技術を持つ企業、そして支援してくださる機関。
            多くの方々との協力により、LIVAL AIは成長しています。
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {partnerCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                <p className="text-gray-400 mb-6">{category.description}</p>
                
                <div className="space-y-3">
                  {category.partners.map((partner, partnerIndex) => (
                    <div key={partnerIndex} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                      <div>
                        <span className="text-white font-medium">{partner.name}</span>
                        <span className="text-gray-400 text-sm block">{partner.region}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-semibold">{partner.count}</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 rounded-3xl p-8 border border-gray-700/50"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">パートナーの声</h3>
          
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-700/30 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">”{testimonial.comment}”</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}