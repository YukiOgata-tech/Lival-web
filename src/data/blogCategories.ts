import { BlogCategory } from '@/lib/types/blog'

// 中高生が関わる教育分野に沿ったカテゴリの共通定義
export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: 'study-methods', name: '学習法',   description: '効率的な学習のコツや記憶術', isActive: true, sortOrder: 1 },
  { id: 'exams',         name: '受験',     description: '中高生向けの受験対策と勉強計画', isActive: true, sortOrder: 2 },
  { id: 'trivia',        name: '雑学',     description: '学びに役立つ豆知識や話題',     isActive: true, sortOrder: 3 },
  { id: 'solutions',     name: '問題解説', description: '定期テスト・入試問題の解説',   isActive: true, sortOrder: 4 },
  { id: 'others',        name: 'その他',   description: '上記に当てはまらないトピック', isActive: true, sortOrder: 5 },
]

