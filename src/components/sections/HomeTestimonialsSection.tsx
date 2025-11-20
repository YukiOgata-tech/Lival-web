'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

// 体験談
const testimonials = [
  {
    name: '田中 さくら',
    grade: '高2',
    comment: 'AIコーチのおかげなのか模試数学が20点も上がりました。これからも頑張ります。',
    initial: 'T',
    bgColor: 'bg-pink-500',
    rating: 5
  },
  {
    name: '山田です',
    grade: '中学3', 
    comment: '24時間質問できるの最高です。遅くでもすぐに答えてくれるから助かってます。',
    initial: '山',
    bgColor: 'bg-blue-500',
    rating: 5
  },
  {
    name: '美咲',
    grade: '高校1年生',
    comment: '不登校でしたが、勉強が家でも出来てきました。自分のペースで進められるのが嬉しいです。',
    initial: '美',
    bgColor: 'bg-green-500',
    rating: 5
  }
]

export default function HomeTestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-6">
            利用者の声
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-gray-600 px-4 md:px-0">
            実際にLIVAL AIを使って成果を上げた学習者たちの体験談
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4 md:mb-6">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white text-sm md:text-lg font-bold mr-3 md:mr-4 shadow-md`}>
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                  <div className="text-gray-600 text-xs md:text-sm">{testimonial.grade}</div>
                </div>
              </div>
              
              <div className="flex mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{testimonial.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}