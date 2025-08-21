'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

// 体験談
const testimonials = [
  {
    name: '田中 さくら',
    grade: '高校2年生',
    comment: 'AIコーチのおかげで数学が20点もアップ！私の性格に合わせた勉強法が見つかりました。',
    avatar: '👩‍🎓',
    rating: 5
  },
  {
    name: '山田 健太',
    grade: '中学3年生', 
    comment: '24時間いつでも質問できるのが最高。夜遅くでもすぐに答えてくれるから助かってます。',
    avatar: '👨‍🎓',
    rating: 5
  },
  {
    name: '佐藤 美咲',
    grade: '高校1年生',
    comment: '不登校でしたが、AIコーチと一緒なら勉強が楽しい。自分のペースで進められるのが嬉しいです。',
    avatar: '👩‍💼',
    rating: 5
  }
]

export default function HomeTestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            利用者の声
          </h2>
          <p className="text-xl text-gray-600">
            実際にLIVAL AIを使って成果を上げた学習者たちの体験談
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.grade}</div>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{testimonial.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}