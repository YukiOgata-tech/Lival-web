// src/data/diagnosis/types.ts
import { DiagnosisType } from '@/types/diagnosis'

/**
 * 6つの診断タイプ定義
 */
export const DIAGNOSIS_TYPES: Record<string, DiagnosisType> = {
  explorer: {
    id: 'explorer',
    displayName: '探求家',
    scientificName: '内発的探求者',
    description: '好奇心・発見・理解の喜びを原動力とするタイプ',
    characteristics: [
      '新しいことを学ぶこと自体に喜びを感じる',
      '「なぜ？」「どうして？」を追求したがる',
      '創造的で独創的なアプローチを好む',
      '深く理解することを重視する',
      '学習プロセス自体を楽しむ'
    ],
    strengths: [
      '高い学習意欲',
      '創造的思考力',
      '批判的思考力',
      '独学能力',
      '持続的な集中力'
    ],
    aiCoachingStyle: {
      communicationStyle: '知的ガイド',
      languagePatterns: [
        '面白い視点だね。もし〇〇だったら？',
        'なぜそう思ったのか教えて',
        'この発見をさらに深めてみよう',
        '君の好奇心が素晴らしい！'
      ],
      motivationApproach: 'intrinsic',
      learningStyle: 'discovery-based'
    },
    weaknesses: [
      '実用性を軽視しがち',
      '計画性に欠ける場合がある',
      '興味のない分野への動機が低い'
    ],
    recommendedStrategies: [
      '興味を引く導入から始める',
      '関連性や応用例を示す',
      '自由な探求時間を設ける',
      '発見を共有する機会を作る'
    ]
  },
  strategist: {
    id: 'strategist',
    displayName: '戦略家',
    scientificName: '目標志向戦略家',
    description: '計画性・論理性・目標達成を重視するタイプ',
    characteristics: [
      '明確な目標設定を好む',
      '論理的で体系的なアプローチを取る',
      '長期的な視野を持つ',
      '効率的な学習方法を追求する',
      '自己管理能力が高い'
    ],
    strengths: [
      '高い計画性',
      '目標達成能力',
      '自己管理能力',
      '論理的思考力',
      '持続力'
    ],
    aiCoachingStyle: {
      communicationStyle: '論理的パートナー',
      languagePatterns: [
        'まず全体の構造を整理してみよう',
        '目標に向けた次のステップは？',
        'この方法の効率性を考えてみて',
        '計画通り進んでいるね！'
      ],
      motivationApproach: 'goal-oriented',
      learningStyle: 'structured'
    },
    weaknesses: [
      '柔軟性に欠ける場合がある',
      '過度な完璧主義',
      '創造性を軽視しがち'
    ],
    recommendedStrategies: [
      '明確な学習目標を設定する',
      '段階的なマイルストーンを作る',
      '進捗を可視化する',
      '論理的な説明を重視する'
    ]
  },
  achiever: {
    id: 'achiever',
    displayName: '努力家',
    scientificName: '承認欲求努力家',
    description: '頑張り・認められたい・成長を大切にするタイプ',
    characteristics: [
      '他者からの評価を重視する',
      '努力することに価値を置く',
      '成長実感を求める',
      '仲間との協力を好む',
      '励ましに敏感に反応する'
    ],
    strengths: [
      '高い努力継続力',
      '他者への配慮',
      'チームワーク',
      '素直さ',
      '成長意欲'
    ],
    aiCoachingStyle: {
      communicationStyle: '励ましコーチ',
      languagePatterns: [
        'すごい！よく頑張ったね',
        '君の努力が実を結んでいる',
        '一緒に頑張ろう',
        'みんなも君を応援している'
      ],
      motivationApproach: 'recognition-based',
      learningStyle: 'collaborative'
    },
    weaknesses: [
      '他者評価に依存しがち',
      '自信の不安定さ',
      '比較による焦り'
    ],
    recommendedStrategies: [
      '小さな成功を積み重ねる',
      '努力過程を認める',
      '仲間との学習機会を作る',
      '具体的な褒め言葉を使う'
    ]
  },
  challenger: {
    id: 'challenger',
    displayName: '挑戦家',
    scientificName: '競争志向挑戦家',
    description: '競争・スピード・勝利を追求するタイプ',
    characteristics: [
      '競争環境でパフォーマンスが向上する',
      'スピード感のある学習を好む',
      '勝負事や挑戦を楽しむ',
      '短期集中型の学習が得意',
      'ライバルの存在がモチベーションになる'
    ],
    strengths: [
      '高い集中力',
      '競争力',
      'スピード学習能力',
      '挑戦精神',
      '短期集中力'
    ],
    aiCoachingStyle: {
      communicationStyle: '競争パートナー',
      languagePatterns: [
        'チャレンジ問題だよ。挑戦してみる？',
        '君なら絶対できる！',
        'この記録を更新してみよう',
        '素晴らしいスピードだね！'
      ],
      motivationApproach: 'competition-based',
      learningStyle: 'challenge-driven'
    },
    weaknesses: [
      '持続力に欠ける場合がある',
      '基礎固めを軽視しがち',
      '失敗を恐れる傾向'
    ],
    recommendedStrategies: [
      'ゲーム要素を取り入れる',
      '短期目標を設定する',
      '競争環境を作る',
      '挑戦的な課題を提供する'
    ]
  },
  partner: {
    id: 'partner',
    displayName: '伴走者',
    scientificName: '関係重視協調者',
    description: '仲間・支え合い・安心感を重視するタイプ',
    characteristics: [
      '他者との関係性を大切にする',
      '協調的で思いやりがある',
      '安心できる環境を求める',
      '仲間と一緒に学ぶことを好む',
      '他者の成長も気にかける'
    ],
    strengths: [
      '高い協調性',
      '共感力',
      'サポート能力',
      '安定性',
      'チームワーク'
    ],
    aiCoachingStyle: {
      communicationStyle: '共感メンター',
      languagePatterns: [
        '大丈夫、一緒に頑張ろう',
        'みんなで支え合おう',
        '君の気持ちがよく分かる',
        '一歩ずつ進んでいこう'
      ],
      motivationApproach: 'relationship-based',
      learningStyle: 'supportive'
    },
    weaknesses: [
      '自立性に欠ける場合がある',
      '競争を避けがち',
      '決断力に不安'
    ],
    recommendedStrategies: [
      '安心できる学習環境を作る',
      '仲間との学習機会を増やす',
      '段階的なサポートを提供する',
      '協力の価値を認める'
    ]
  },
  pragmatist: {
    id: 'pragmatist',
    displayName: '効率家',
    scientificName: '効率重視実用家',
    description: '実用性・効率・結果重視を追求するタイプ',
    characteristics: [
      '実用的な価値を重視する',
      '効率的な方法を追求する',
      '結果志向である',
      '無駄を嫌う',
      '実践的な応用を好む'
    ],
    strengths: [
      '高い効率性',
      '実用的思考',
      '結果志向',
      '時間管理能力',
      '合理性'
    ],
    aiCoachingStyle: {
      communicationStyle: '実務コンサルタント',
      languagePatterns: [
        '結論から言うと、〇〇です',
        'この方法が最も効率的だね',
        '実際の場面でどう使える？',
        '時間を有効活用しよう'
      ],
      motivationApproach: 'result-oriented',
      learningStyle: 'practical'
    },
    weaknesses: [
      '創造性を軽視しがち',
      '過程を軽視する傾向',
      '長期的視野に欠ける場合'
    ],
    recommendedStrategies: [
      '実用的な応用例を示す',
      '効率的な学習法を提供する',
      '短期的な成果を可視化する',
      '時間対効果を明示する'
    ]
  }
}

/**
 * タイプ判定用のスコア計算式
 */
export const SCORING_FORMULAS = {
  explorer: {
    formula: 'intrinsic_motivation * 1.5 + openness * 1.3 + autonomy * 1.2 + deep_exploration * 1.1',
    weights: {
      intrinsic_motivation: 1.5,
      openness: 1.3,
      autonomy: 1.2,
      deep_exploration: 1.1
    }
  },
  strategist: {
    formula: 'identified_regulation * 1.5 + conscientiousness * 1.4 + autonomy * 1.2 + competence * 1.1',
    weights: {
      identified_regulation: 1.5,
      conscientiousness: 1.4,
      autonomy: 1.2,
      competence: 1.1
    }
  },
  achiever: {
    formula: 'introjected_regulation * 1.5 + relatedness_need * 1.3 + conscientiousness * 1.2 + collaborative_support * 1.1',
    weights: {
      introjected_regulation: 1.5,
      relatedness_need: 1.3,
      conscientiousness: 1.2,
      collaborative_support: 1.1
    }
  },
  challenger: {
    formula: 'external_regulation * 1.3 + extraversion * 1.4 + competitive_orientation * 1.5 + efficient_processing * 1.1',
    weights: {
      external_regulation: 1.3,
      extraversion: 1.4,
      competitive_orientation: 1.5,
      efficient_processing: 1.1
    }
  },
  partner: {
    formula: 'relatedness_need * 1.5 + agreeableness * 1.3 + cooperative_orientation * 1.4 + collaborative_support * 1.2',
    weights: {
      relatedness_need: 1.5,
      agreeableness: 1.3,
      cooperative_orientation: 1.4,
      collaborative_support: 1.2
    }
  },
  pragmatist: {
    formula: 'external_regulation * 1.2 + conscientiousness * 1.1 + efficient_processing * 1.4 + directive_support * 1.3',
    weights: {
      external_regulation: 1.2,
      conscientiousness: 1.1,
      efficient_processing: 1.4,
      directive_support: 1.3
    }
  }
}

export default DIAGNOSIS_TYPES