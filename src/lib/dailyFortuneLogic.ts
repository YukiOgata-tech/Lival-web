import { FortuneInput, FortuneResult } from '@/types/dailyFortune'
import {
  LUCK_RATINGS,
  QUOTES,
  ACTION_ADVICES,
  STUDY_ADVICES,
  LUCKY_ADJECTIVES,
  LUCKY_OBJECTS
} from '@/data/dailyFortuneData'

/**
 * 文字列からシンプルなハッシュ値を生成する
 * 同じ入力には常に同じハッシュ値を返す
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * ハッシュ値から配列のインデックスを取得
 */
function getIndexFromHash(hash: number, arrayLength: number): number {
  return hash % arrayLength
}

/**
 * 生年月日、性別、日付からユニークなシード文字列を生成
 */
function generateSeed(input: FortuneInput): string {
  return `${input.birthDate}-${input.gender}-${input.date}`
}

/**
 * デイリー占いの結果を生成する
 * 同じ入力（生年月日、性別、日付）には常に同じ結果を返す
 */
export function generateDailyFortune(input: FortuneInput): FortuneResult {
  const seed = generateSeed(input)

  // 各項目で異なるハッシュ値を使用（文字列を追加してハッシュを変える）
  const luckHash = simpleHash(seed + '-luck')
  const quoteHash = simpleHash(seed + '-quote')
  const actionHash = simpleHash(seed + '-action')
  const studyHash = simpleHash(seed + '-study')

  // ラッキーアイテム用：形容詞と名詞を別々に選択
  const adjHash1 = simpleHash(seed + '-adj1')
  const adjHash2 = simpleHash(seed + '-adj2')
  const adjHash3 = simpleHash(seed + '-adj3')
  const objHash1 = simpleHash(seed + '-obj1')
  const objHash2 = simpleHash(seed + '-obj2')
  const objHash3 = simpleHash(seed + '-obj3')

  // 各配列からインデックスを取得して結果を選択
  const luckIndex = getIndexFromHash(luckHash, LUCK_RATINGS.length)
  const quoteIndex = getIndexFromHash(quoteHash, QUOTES.length)
  const actionIndex = getIndexFromHash(actionHash, ACTION_ADVICES.length)
  const studyIndex = getIndexFromHash(studyHash, STUDY_ADVICES.length)

  // ラッキーアイテムのインデックス
  const adjIndex1 = getIndexFromHash(adjHash1, LUCKY_ADJECTIVES.length)
  const adjIndex2 = getIndexFromHash(adjHash2, LUCKY_ADJECTIVES.length)
  const adjIndex3 = getIndexFromHash(adjHash3, LUCKY_ADJECTIVES.length)
  const objIndex1 = getIndexFromHash(objHash1, LUCKY_OBJECTS.length)
  const objIndex2 = getIndexFromHash(objHash2, LUCKY_OBJECTS.length)
  const objIndex3 = getIndexFromHash(objHash3, LUCKY_OBJECTS.length)

  const selectedLuck = LUCK_RATINGS[luckIndex]
  const selectedQuote = QUOTES[quoteIndex]

  return {
    luckScore: selectedLuck.score,
    luckLabel: selectedLuck.label,
    luckMessage: selectedLuck.message,
    quote: {
      text: selectedQuote.text,
      author: selectedQuote.author,
      comment: selectedQuote.comment
    },
    actionAdvice: ACTION_ADVICES[actionIndex],
    studyAdvice: STUDY_ADVICES[studyIndex],
    luckyItems: [
      {
        adjective: LUCKY_ADJECTIVES[adjIndex1],
        object: LUCKY_OBJECTS[objIndex1]
      },
      {
        adjective: LUCKY_ADJECTIVES[adjIndex2],
        object: LUCKY_OBJECTS[objIndex2]
      },
      {
        adjective: LUCKY_ADJECTIVES[adjIndex3],
        object: LUCKY_OBJECTS[objIndex3]
      }
    ],
    fortuneDate: input.date
  }
}

/**
 * 今日の日付を YYYY-MM-DD 形式で取得
 */
export function getTodayDate(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 日付を日本語形式に変換（例: 2025年1月18日）
 */
export function formatDateJapanese(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}
