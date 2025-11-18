// デイリー占いの型定義

export interface FortuneInput {
  birthDate: string // YYYY-MM-DD形式
  gender: 'male' | 'female' | 'other'
  date: string // YYYY-MM-DD形式（占いを行う日）
}

export interface FortuneResult {
  // 総合運勢評価
  luckScore: number // 1.0-5.0
  luckLabel: string // 評価ラベル（例: 絶好調）
  luckMessage: string // その日のアドバイスメッセージ

  // 今日の名言
  quote: {
    text: string
    author: string
    comment: string
  }

  // 日常行動アドバイス
  actionAdvice: string

  // 学習アドバイス
  studyAdvice: string

  // ラッキーアイテム（3つ）- 形容詞と名詞の組み合わせ
  luckyItems: Array<{
    adjective: string
    object: string
  }>

  // 占いを行った日付（表示用）
  fortuneDate: string
}
