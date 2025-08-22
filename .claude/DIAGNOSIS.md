### AIコーチング生徒タイプ診断システム：開発仕様書
## 1. システム概要
目的

自己決定理論（SDT）とBig Five性格理論に基づく科学的診断
6つのタイプ分類によるAIコーチング最適化
高校生・中学生向けのパーソナライゼーション

診断結果タイプ
表示名科学的分類特徴探求家内発的探求者好奇心・発見・理解の喜び戦略家目標志向戦略家計画性・論理性・目標達成努力家承認欲求努力家頑張り・認められたい・成長挑戦家競争志向挑戦家競争・スピード・勝利伴走者関係重視協調者仲間・支え合い・安心感効率家効率重視実用家実用性・効率・結果重視

## 2. 診断フロー
開始 → コア質問(6問) → スコア計算 → フォローアップ質問(0-4問) → 最終判定 → 結果表示

## 3. Firestoreデータベース構造
# コレクション設計
/masters
  └── /diagnosis_questions/{questionId}
      ├── questionText: string
      ├── questionType: 'core' | 'followup'
      ├── questionOrder: number
      ├── options: array
      └── scoringWeights: object

  └── /diagnosis_sessions/{sessionId}
      ├── userId: string | null
      ├── startedAt: timestamp
      ├── completedAt: timestamp | null
      ├── resultType: string | null
      ├── confidenceScore: number | null
      ├── rawScores: object
      ├── status: 'active' | 'completed' | 'abandoned'
      └── /responses/{responseId}
          ├── questionId: string
          ├── answer: string ('A'|'B'|'C'|'D')
          ├── responseTime: number
          └── answeredAt: timestamp

  └── /diagnosis_types/{typeId}
      ├── displayName: string
      ├── scientificName: string
      ├── description: string
      ├── characteristics: array
      ├── aiCoachingStyle: object
      └── strengths: array


# 具体的なドキュメントの例
質問マスタ（masters/diagnosis_questions/motivation_source）
{
  questionText: "勉強する理由で一番大きいものは？",
  questionType: "core",
  questionOrder: 1,
  options: [
    {
      id: "A",
      text: "新しいことを知るのが純粋に楽しいから"
    },
    {
      id: "B", 
      text: "将来の夢や目標を実現するために必要だから"
    },
    {
      id: "C",
      text: "良い成績を取って周りに認められたいから"
    },
    {
      id: "D",
      text: "成績が悪いと困るから・怒られるから"
    }
  ],
  scoringWeights: {
    A: {
      intrinsic_motivation: 3,
      openness: 1
    },
    B: {
      identified_regulation: 3,
      conscientiousness: 1
    },
    C: {
      introjected_regulation: 3,
      relatedness_need: 1
    },
    D: {
      external_regulation: 3,
      neuroticism: 1
    }
  }
}

# 診断セッション管理 （masters/diagnosis_sessions/{sessionId}）masters/diagnosis_sessions/{sessionId}）
{
  userId: "user123", // 例
  startedAt: Timestamp,
  completedAt: null,
  resultType: null,
  confidenceScore: null,
  rawScores: {},
  status: "active",
  currentQuestionIndex: 0,
  followUpQuestions: [] // 動的に追加
}



診断結果をユーザーダッシュボードで見返せるようにユーザーデータベースに保存するようにしてください。
セキュリティルールも追加構築必要ですが、エディタ側からデプロイは禁止です
モバイルアプリでも診断系が扱えるようにデータベースを作成利用するがWEB上で診断質問などをわざわざデータベース購読が無くてもできるよう、構成していく。
必要であればインデックスも設定する。

実際のWEB上では、キャッシュを扱い、UXを高める。

## 4. 質問設計
コア質問（6問・必須）
Q1: 動機の源泉
質問: 勉強する理由で一番大きいものは？
選択肢内容スコア配分A新しいことを知るのが純粋に楽しいから内発的動機+3, 開放性+1B将来の夢や目標を実現するために必要だから同一化調整+3, 誠実性+1C良い成績を取って周りに認められたいから取り入れ調整+3, 関係性欲求+1D成績が悪いと困るから・怒られるから外的調整+3, 神経症傾向+1
Q2: 挑戦への態度
質問: 難しい問題に出会ったとき、どう感じる？
選択肢内容スコア配分Aワクワクして「やってやる！」という気持ちになる開放性+3, 内発的動機+2, 有能感+2B計画を立てて着実に取り組もうと思う誠実性+3, 同一化調整+2C不安だけど、頑張らないといけないと思う取り入れ調整+2, 神経症傾向+2D正直、避けたいと思ってしまう神経症傾向+3, 有能感-2
Q3: 学習環境の好み
質問: 勉強で一番集中できるのは？
選択肢内容スコア配分A図書館など、一人で静かに取り組める場所外向性-2, 自律性欲求+2B友達と一緒に教え合える場所外向性+3, 協調性+3, 関係性欲求+3C家族がそばにいる安心できる場所関係性欲求+3, 神経症傾向+1Dカフェなど、適度に人の気配がある場所外向性+1, 開放性+1
Q4: 計画性と継続性
質問: テスト勉強はどう進める？
選択肢内容スコア配分A詳細な計画を立てて、スケジュール通りに進める誠実性+3, 同一化調整+2B大まかな目標を決めて、その日の気分で調整する誠実性+1, 開放性+1Cとりあえず問題を解いてみてから考える開放性+2, 誠実性-1D直前になってから集中的にやる誠実性-2, 外的調整+2
Q5: 学習の深さ
質問: 授業で興味を持つのは？
選択肢内容スコア配分A「なぜそうなるのか」という理由や背景開放性+3, 内発的動機+2B「どう使えるのか」という実用的な応用方法同一化調整+2, 開放性+1C「どうやったら覚えられるか」という効率的な方法誠実性+2, 外的調整+1D「テストに出るか」という実践的な情報外的調整+3
Q6: 達成感の源泉
質問: 最近、勉強で一番嬉しかったのは？
選択肢内容スコア配分A新しい概念を理解できた瞬間内発的動機+3, 開放性+2, 有能感+2B立てた計画通りに進められた時誠実性+3, 同一化調整+2, 有能感+1C先生や親に褒められた時取り入れ調整+3, 関係性欲求+2Dテストで良い点数が取れた時外的調整+3, 有能感+1
フォローアップ質問（条件分岐）
F1: 探求特化（条件: 内発的動機≥4 AND 開放性≥4）
質問: 興味のある分野について調べるとき

A: 一つの分野を深く掘り下げたい → 深化探求+2
B: 色々な分野のつながりを見つけたい → 拡散探求+2

F2: 競争vs協調（条件: 外的調整≥3 OR 外向性≥2）
質問: クラスメイトとの関係で重要なのは？

A: 競い合って互いを高め合うこと → 競争志向+3
B: 協力して一緒に成長すること → 協調志向+3

F3: サポート好み（条件: 神経症傾向≥2 OR 関係性欲求≥3）
質問: 困ったとき、どんなサポートが欲しい？

A: 解決方法を一緒に考えてくれること → 協働サポート+2
B: 具体的な手順を教えてくれること → 指導サポート+2

F4: 学習ペース（条件: タイプスコアが接近）
質問: 自分に合う勉強のペースは？

A: じっくり考えながら着実に → 深化処理+2, 誠実性+1
B: テンポよくどんどん進む → 効率処理+2, 外向性+1

## 5. 判定ロジック
スコア計算式
【探求家】= 内発的動機×1.5 + 開放性×1.3 + 自律性欲求×1.2 + 深化探求×1.1
【戦略家】= 同一化調整×1.5 + 誠実性×1.4 + 自律性欲求×1.2 + 有能感×1.1
【努力家】= 取り入れ調整×1.5 + 関係性欲求×1.3 + 誠実性×1.2 + 協働サポート×1.1
【挑戦家】= 外的調整×1.3 + 外向性×1.4 + 競争志向×1.5 + 効率処理×1.1
【伴走者】= 関係性欲求×1.5 + 協調性×1.3 + 協調志向×1.4 + 協働サポート×1.2
【効率家】= 外的調整×1.2 + 誠実性×1.1 + 効率処理×1.4 + 指導サポート×1.3
信頼度計算
基本信頼度 = 85%
+ 一貫性スコア×8% (最大+10%)
+ 判定明確度×5% (最大+5%)
- 極端回答率×3% (最大-5%)

最終範囲: 75-98%

## 6. API設計
エンドポイント
診断開始
POST /api/diagnosis/start
Request: { userId?: string }
Response: { sessionId: string, firstQuestion: Question }
回答送信
POST /api/diagnosis/answer
Request: { sessionId: string, questionId: string, answer: "A"|"B"|"C"|"D", responseTime: number }
Response: { nextQuestion?: Question, isCompleted: boolean, progress: number }
結果取得
GET /api/diagnosis/result?sessionId={sessionId}
Response: { primaryType: string, secondaryType?: string, confidence: number, scores: object, typeDescription: object }

## 7. AIコーチング最適化
タイプ別スタイル設定
タイプコミュニケーションスタイル言語パターン例探求家知的ガイド「面白い視点だね。もし〇〇だったら？」戦略家論理的パートナー「まず全体の構造を整理してみよう」努力家励ましコーチ「すごい！よく頑張ったね」挑戦家競争パートナー「チャレンジ問題だよ。挑戦してみる？」伴走者共感メンター「大丈夫、一緒に頑張ろう」効率家実務コンサルタント「結論から言うと、〇〇です」
## 8. 実装チェックリスト
フロントエンド

 質問表示コンポーネント
 プログレスバー（動的計算）
 回答時間記録
 結果表示画面
 エラーハンドリング

バックエンド

 セッション管理
 スコア計算エンジン
 分岐ロジック
 データベース操作
 キャッシュ機能

品質保証

 各タイプの典型パターンテスト
 境界線ケーステスト
 信頼度計算検証
 レスポンス時間監視

# 以上、改善点などがあるのであれば常時申し出てください。