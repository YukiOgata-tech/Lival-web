'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, MessageCircle, Users, Building } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: '一般お問い合わせ',
    description: 'サービスに関するご質問・ご相談',
    contact: 'info@lival-ai.com',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Building,
    title: '法人・教育機関',
    description: '塾・学校での導入に関するご相談',
    contact: 'enterprise@lival-ai.com',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Users,
    title: '採用・協業',
    description: 'チーム参加・パートナーシップ',
    contact: 'careers@lival-ai.com',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: MessageCircle,
    title: 'メディア・取材',
    description: 'プレス・メディア関係者の方',
    contact: 'press@lival-ai.com',
    color: 'from-orange-500 to-red-600'
  }
]

const officeInfo = {
  address: '東京都渋谷区XXX X-X-X XXXビル Xフロア',
  phone: '03-XXXX-XXXX',
  hours: '平日 10:00 - 18:00',
  access: [
    'JR山手線「渋谷駅」徒歩5分',
    '東京メトロ「表参道駅」徒歩8分',
    '副都心線「明治神宮前駅」徒歩7分'
  ]
}

const socialLinks = [
  { name: 'Twitter', handle: '@lival_ai', url: '#', color: 'hover:text-blue-400' },
  { name: 'LinkedIn', handle: 'LIVAL AI', url: '#', color: 'hover:text-blue-600' },
  { name: 'GitHub', handle: 'lival-ai', url: '#', color: 'hover:text-gray-400' },
  { name: 'Note', handle: 'lival_ai', url: '#', color: 'hover:text-green-400' }
]

export default function AboutContactSection() {
  return (
    <section className="py-20 bg-gray-900">
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
            お気軽にご連絡ください
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            ご質問、ご提案、協業のご相談など、どんなことでもお気軽にお声がけください。
            若いチームならではのフットワークで、迅速に対応いたします。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Methods */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                    <div className={`w-14 h-14 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">{method.description}</p>
                    
                    <a 
                      href={`mailto:${method.contact}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      {method.contact}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-bold text-white mb-6">簡単お問い合わせ</h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">お名前</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="山田太郎"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">メールアドレス</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="yamada@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">件名</label>
                  <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors">
                    <option>サービスについて</option>
                    <option>導入検討</option>
                    <option>採用・協業</option>
                    <option>メディア取材</option>
                    <option>その他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">メッセージ</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="お気軽にご質問・ご相談ください..."
                  ></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  送信する
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Office Info & Social */}
          <div className="space-y-8">
            
            {/* Office Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                オフィス情報
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-gray-400 text-sm">住所</div>
                  <div className="text-white">{officeInfo.address}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">電話</div>
                  <div className="text-white">{officeInfo.phone}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm">営業時間</div>
                  <div className="text-white">{officeInfo.hours}</div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-sm mb-2">アクセス</div>
                  <div className="space-y-1">
                    {officeInfo.access.map((access, index) => (
                      <div key={index} className="text-white text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {access}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-bold text-white mb-6">SNS・コミュニティ</h3>
              
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`block p-3 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group ${social.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{social.name}</div>
                        <div className="text-gray-400 text-sm">{social.handle}</div>
                      </div>
                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        →
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-500/20"
            >
              <h3 className="text-lg font-bold text-white mb-4">レスポンス目標</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">一般お問い合わせ</span>
                  <span className="text-blue-400 font-semibold">24時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">法人・導入相談</span>
                  <span className="text-blue-400 font-semibold">12時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">採用・協業</span>
                  <span className="text-blue-400 font-semibold">48時間以内</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">緊急事項</span>
                  <span className="text-blue-400 font-semibold">即座</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-gray-800/30 to-slate-800/30 rounded-2xl border border-gray-700/30"
        >
          <p className="text-gray-300 leading-relaxed">
            LIVAL AIは、大学生を中心とした若いチームが運営しています。<br />
            フレッシュな視点と情熱で、皆様のご期待にお応えできるよう努めております。<br />
            どんな小さなことでも、お気軽にお声がけください。
          </p>
        </motion.div>
      </div>
    </section>
  )
}