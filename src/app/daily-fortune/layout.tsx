import { Metadata } from 'next'
import { Yusei_Magic, Mochiy_Pop_One, Shippori_Mincho, RocknRoll_One } from 'next/font/google'

export const metadata: Metadata = {
  title: '学習デイリー占い | LIVAL AI',
  description: '毎日の学習運をチェック！あなた専用の学習アドバイスとラッキーアイテムをお届けします。',
  keywords: ['LIVAL','学習占い','デイリー占い','学習運','受験','勉強','モチベーション','AI','占い','宿題'],
  openGraph: {
    title: '学習デイリー占い | LIVAL AI',
    description: '毎日の学習運をチェック！あなた専用の学習アドバイスとラッキーアイテムをお届けします。',
    type: 'website',
  },
}

// 占い用の特殊フォント
const yuseiMagic = Yusei_Magic({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-yusei-magic',
})

const mochiyPopOne = Mochiy_Pop_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mochiy-pop',
})

const shipporiMincho = Shippori_Mincho({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-shippori-mincho',
})

const rocknRollOne = RocknRoll_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rocknroll',
})

export default function DailyFortuneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${yuseiMagic.variable} ${mochiyPopOne.variable} ${shipporiMincho.variable} ${rocknRollOne.variable}`}>
      {children}
    </div>
  )
}
