// src/data/diagnosis/questions.ts
import { DiagnosisQuestion, DiagnosisQuestionOption, ScoreWeights } from '@/types/diagnosis'

/**
 * コア質問（必須6問）
 */
export const CORE_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'motivation_source',
    questionText: '勉強する理由で一番大きいものは？',
    questionType: 'core',
    questionOrder: 1,
    options: [
      {
        id: 'A',
        text: '新しいことを知るのが純粋に楽しいから'
      },
      {
        id: 'B', 
        text: '将来の夢や目標を実現するために必要だから'
      },
      {
        id: 'C',
        text: '良い成績を取って周りに認められたいから'
      },
      {
        id: 'D',
        text: '成績が悪いと困るから・怒られるから'
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
  },
  {
    id: 'challenge_attitude',
    questionText: '難しい問題に出会ったとき、どう感じる？',
    questionType: 'core',
    questionOrder: 2,
    options: [
      {
        id: 'A',
        text: 'ワクワクして「やってやる！」という気持ちになる'
      },
      {
        id: 'B',
        text: '計画を立てて着実に取り組もうと思う'
      },
      {
        id: 'C',
        text: '不安だけど、頑張らないといけないと思う'
      },
      {
        id: 'D',
        text: '正直、避けたいと思ってしまう'
      }
    ],
    scoringWeights: {
      A: {
        openness: 3,
        intrinsic_motivation: 2,
        competence: 2
      },
      B: {
        conscientiousness: 3,
        identified_regulation: 2
      },
      C: {
        introjected_regulation: 2,
        neuroticism: 2
      },
      D: {
        neuroticism: 3,
        competence: -2
      }
    }
  },
  {
    id: 'learning_environment',
    questionText: '勉強で一番集中できるのは？',
    questionType: 'core',
    questionOrder: 3,
    options: [
      {
        id: 'A',
        text: '図書館など、一人で静かに取り組める場所'
      },
      {
        id: 'B',
        text: '友達と一緒に教え合える場所'
      },
      {
        id: 'C',
        text: '家族がそばにいる安心できる場所'
      },
      {
        id: 'D',
        text: 'カフェなど、適度に人の気配がある場所'
      }
    ],
    scoringWeights: {
      A: {
        extraversion: -2,
        autonomy: 2
      },
      B: {
        extraversion: 3,
        agreeableness: 3,
        relatedness_need: 3
      },
      C: {
        relatedness_need: 3,
        neuroticism: 1
      },
      D: {
        extraversion: 1,
        openness: 1
      }
    }
  },
  {
    id: 'planning_style',
    questionText: 'テスト勉強はどう進める？',
    questionType: 'core',
    questionOrder: 4,
    options: [
      {
        id: 'A',
        text: '詳細な計画を立てて、スケジュール通りに進める'
      },
      {
        id: 'B',
        text: '大まかな目標を決めて、その日の気分で調整する'
      },
      {
        id: 'C',
        text: 'とりあえず問題を解いてみてから考える'
      },
      {
        id: 'D',
        text: '直前になってから集中的にやる'
      }
    ],
    scoringWeights: {
      A: {
        conscientiousness: 3,
        identified_regulation: 2
      },
      B: {
        conscientiousness: 1,
        openness: 1
      },
      C: {
        openness: 2,
        conscientiousness: -1
      },
      D: {
        conscientiousness: -2,
        external_regulation: 2
      }
    }
  },
  {
    id: 'learning_depth',
    questionText: '授業で興味を持つのは？',
    questionType: 'core',
    questionOrder: 5,
    options: [
      {
        id: 'A',
        text: '「なぜそうなるのか」という理由や背景'
      },
      {
        id: 'B',
        text: '「どう使えるのか」という実用的な応用方法'
      },
      {
        id: 'C',
        text: '「どうやったら覚えられるか」という効率的な方法'
      },
      {
        id: 'D',
        text: '「テストに出るか」という実践的な情報'
      }
    ],
    scoringWeights: {
      A: {
        openness: 3,
        intrinsic_motivation: 2
      },
      B: {
        identified_regulation: 2,
        openness: 1
      },
      C: {
        conscientiousness: 2,
        external_regulation: 1
      },
      D: {
        external_regulation: 3
      }
    }
  },
  {
    id: 'achievement_source',
    questionText: '最近、勉強で一番嬉しかったのは？',
    questionType: 'core',
    questionOrder: 6,
    options: [
      {
        id: 'A',
        text: '新しい概念を理解できた瞬間'
      },
      {
        id: 'B',
        text: '立てた計画通りに進められた時'
      },
      {
        id: 'C',
        text: '先生や親に褒められた時'
      },
      {
        id: 'D',
        text: 'テストで良い点数が取れた時'
      }
    ],
    scoringWeights: {
      A: {
        intrinsic_motivation: 3,
        openness: 2,
        competence: 2
      },
      B: {
        conscientiousness: 3,
        identified_regulation: 2,
        competence: 1
      },
      C: {
        introjected_regulation: 3,
        relatedness_need: 2
      },
      D: {
        external_regulation: 3,
        competence: 1
      }
    }
  }
]

/**
 * フォローアップ質問（条件分岐）
 */
export const FOLLOWUP_QUESTIONS: DiagnosisQuestion[] = [
  {
    id: 'exploration_depth',
    questionText: '興味のある分野について調べるとき',
    questionType: 'followup',
    questionOrder: 1,
    condition: {
      intrinsic_motivation: { min: 4 },
      openness: { min: 4 }
    },
    options: [
      {
        id: 'A',
        text: '一つの分野を深く掘り下げたい'
      },
      {
        id: 'B',
        text: '色々な分野のつながりを見つけたい'
      },
      {
        id: 'C',
        text: 'まずは全体像を把握してから詳しく学ぶ'
      },
      {
        id: 'D',
        text: '実際の事例を通して理解を深めたい'
      }
    ],
    scoringWeights: {
      A: {
        deep_exploration: 2,
        conscientiousness: 1
      },
      B: {
        broad_exploration: 2,
        openness: 1
      },
      C: {
        deep_exploration: 1,
        broad_exploration: 1
      },
      D: {
        identified_regulation: 2,
        openness: 1
      }
    }
  },
  {
    id: 'competition_cooperation',
    questionText: 'クラスメイトとの関係で重要なのは？',
    questionType: 'followup',
    questionOrder: 2,
    condition: {
      external_regulation: { min: 3 },
      extraversion: { min: 2 }
    },
    options: [
      {
        id: 'A',
        text: '競い合って互いを高め合うこと'
      },
      {
        id: 'B',
        text: '協力して一緒に成長すること'
      },
      {
        id: 'C',
        text: '互いの得意分野を活かし合うこと'
      },
      {
        id: 'D',
        text: '情報を共有して効率よく学ぶこと'
      }
    ],
    scoringWeights: {
      A: {
        competitive_orientation: 3,
        extraversion: 1
      },
      B: {
        cooperative_orientation: 3,
        agreeableness: 1
      },
      C: {
        cooperative_orientation: 2,
        collaborative_support: 1
      },
      D: {
        efficient_processing: 2,
        collaborative_support: 1
      }
    }
  },
  {
    id: 'support_preference',
    questionText: '困ったとき、どんなサポートが欲しい？',
    questionType: 'followup',
    questionOrder: 3,
    condition: {
      neuroticism: { min: 2 },
      relatedness_need: { min: 3 }
    },
    options: [
      {
        id: 'A',
        text: '解決方法を一緒に考えてくれること'
      },
      {
        id: 'B',
        text: '具体的な手順を教えてくれること'
      },
      {
        id: 'C',
        text: '励ましの言葉をかけてくれること'
      },
      {
        id: 'D',
        text: 'そっと見守ってくれること'
      }
    ],
    scoringWeights: {
      A: {
        collaborative_support: 2,
        relatedness_need: 1
      },
      B: {
        directive_support: 2,
        external_regulation: 1
      },
      C: {
        relatedness_need: 2,
        introjected_regulation: 1
      },
      D: {
        autonomy: 2,
        relatedness_need: 1
      }
    }
  },
  {
    id: 'learning_pace',
    questionText: '自分に合う勉強のペースは？',
    questionType: 'followup',
    questionOrder: 4,
    condition: {
      scoreGap: { max: 3 } // トップスコアと2位のスコア差が3以下の場合
    },
    options: [
      {
        id: 'A',
        text: 'じっくり考えながら着実に'
      },
      {
        id: 'B',
        text: 'テンポよくどんどん進む'
      },
      {
        id: 'C',
        text: '集中できるときに一気に'
      },
      {
        id: 'D',
        text: '短時間ずつ毎日コツコツと'
      }
    ],
    scoringWeights: {
      A: {
        deep_processing: 2,
        conscientiousness: 1
      },
      B: {
        efficient_processing: 2,
        extraversion: 1
      },
      C: {
        competitive_orientation: 1,
        efficient_processing: 1
      },
      D: {
        conscientiousness: 2,
        deep_processing: 1
      }
    }
  }
]

export default {
  CORE_QUESTIONS,
  FOLLOWUP_QUESTIONS
}