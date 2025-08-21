// src/data/faq/categories/getting-started.ts
import { FAQArticle, createHeading, createParagraph, createList, createSteps, createInfo, createWarning } from '../types'

export const gettingStartedArticles: FAQArticle[] = [
  {
    id: 'account-creation',
    title: 'アカウントの作成方法',
    category: 'はじめに',
    categoryId: 'getting-started',
    description: 'LIVAL AIでアカウントを作成する手順を詳しく説明します。性格診断から初期設定まで、スムーズに始められるガイドです。',
    isPopular: true,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 5,
    views: 1250,
    tags: ['アカウント', '新規登録', '始め方'],
    relatedArticles: ['personality-test', 'first-setup'],
    content: [
      createHeading('アカウント作成の概要', 1),
      createParagraph('LIVAL AIへようこそ！アカウント作成は約3分で完了し、すぐにパーソナライズされたAIコーチングを始められます。'),
      
      createHeading('必要なもの'),
      createList([
        'メールアドレス（Gmail、Yahoo!メールなど）',
        'スマートフォンまたはパソコン',
        '学年・志望校などの基本情報（後から変更可能）'
      ]),

      createHeading('ステップ1: 基本情報の入力'),
      createSteps([
        'LIVAL AI公式サイトの「無料で始める」ボタンをクリック',
        'メールアドレスとパスワードを入力',
        '利用規約とプライバシーポリシーに同意',
        '「アカウント作成」ボタンをクリック'
      ]),

      createInfo('パスワードは8文字以上で、英数字と記号を組み合わせることを推奨します。'),

      createHeading('ステップ2: メール認証'),
      createParagraph('入力したメールアドレスに認証メールが送信されます。メール内の「認証する」ボタンをクリックしてください。'),
      
      createWarning('認証メールが届かない場合は、迷惑メールフォルダを確認してください。それでも見つからない場合は、サポートまでお問い合わせください。'),

      createHeading('ステップ3: 性格診断'),
      createParagraph('アカウント認証後、自動的に性格診断ページに移動します。12個の簡単な質問に答えることで、あなたに最適なAIコーチングスタイルを決定します。'),
      
      createList([
        '所要時間: 約2分',
        '質問数: 12問（2択形式）',
        '結果: 6つのタイプから判定',
        '診断結果は後から詳細確認可能'
      ]),

      createHeading('ステップ4: 基本プロフィール設定'),
      createParagraph('性格診断完了後、学習に関する基本情報を設定します。'),
      
      createSteps([
        '学年・学校名の入力',
        '志望校・進路の設定（複数選択可）',
        '得意科目・苦手科目の選択',
        '学習時間の目標設定',
        'AI呼び出し名のカスタマイズ（任意）'
      ]),

      createInfo('すべての情報は後から変更できるので、わからない項目はスキップしても大丈夫です。'),

      createHeading('ステップ5: AIエージェントとの初回対話'),
      createParagraph('設定完了後、3つのAIエージェントが自己紹介を行います：'),
      
      createList([
        '家庭教師AI: 問題解説と学習サポート担当',
        '進路カウンセラーAI: 進路相談と情報提供担当', 
        '学習計画AI: スケジュール管理と計画立案担当'
      ]),

      createHeading('完了！学習を始めましょう'),
      createParagraph('アカウント作成が完了しました。ダッシュボードから気になるAIエージェントとの対話を始めて、あなただけの学習体験をスタートさせましょう。'),

      createHeading('よくある質問'),
      createParagraph('**Q: 未成年でもアカウント作成できますか？**'),
      createParagraph('A: はい。ただし、保護者の同意が必要です。初回ログイン時に保護者確認メールが送信されます。'),
      
      createParagraph('**Q: 複数のアカウントを作成できますか？**'),
      createParagraph('A: 1つのメールアドレスにつき1つのアカウントのみ作成可能です。'),
      
      createParagraph('**Q: アカウント作成後にメールアドレスを変更できますか？**'),
      createParagraph('A: 設定ページから変更可能です。新しいメールアドレスでの認証が必要になります。')
    ]
  },

  {
    id: 'personality-test',
    title: '性格診断の受け方',
    category: 'はじめに',
    categoryId: 'getting-started',
    description: '6つの学習タイプを判定する性格診断について詳しく解説します。診断結果がAIコーチングにどう活用されるかも説明します。',
    isPopular: true,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 7,
    views: 445,
    tags: ['性格診断', 'パーソナライズ', '学習タイプ'],
    relatedArticles: ['account-creation', 'ai-types'],
    content: [
      createHeading('性格診断とは', 1),
      createParagraph('LIVAL AIの性格診断は、あなたの学習スタイルと動機を理解し、最適なAIコーチング体験を提供するための重要なステップです。'),

      createHeading('診断の仕組み'),
      createParagraph('12個の2択質問に答えることで、学習における「モチベーションの源泉」と「学習の進め方」を分析し、6つのタイプに分類します。'),

      createInfo('診断結果によって、AIエージェントの話し方、提案する学習方法、励まし方が自動的に最適化されます。'),

      createHeading('6つの学習タイプ'),
      
      createHeading('1. 戦略家（ストラテジスト）', 3),
      createList([
        '効率と納得感を重視する論理的な計画者',
        '「なぜ」を理解してから行動したい',
        'AIは知的パートナーとして論理的にサポート',
        '全体像を把握してから段階的に進める'
      ]),

      createHeading('2. 探求家（エクスプローラー）', 3),
      createList([
        '発見を楽しむ自律的な探求者',
        '好奇心と「面白そう」が原動力',
        'AIは答えを直接教えず、ヒントで発見を促す',
        '試行錯誤のプロセスを重視'
      ]),

      createHeading('3. 努力家（アチーバー）', 3),
      createList([
        '明確な目標と承認を力に変える積み上げ型',
        '賞賛や進捗の可視化がモチベーション',
        'AIは熱心なチアリーダーとして頻繁に褒める',
        'コツコツと着実な学習を好む'
      ]),

      createHeading('4. 挑戦家（チャレンジャー）', 3),
      createList([
        '競争や困難な課題に燃えるダイナミックな挑戦者',
        '競争環境や困難克服がスリル',
        'AIは競争心を煽るコーチとして振る舞う',
        'ゲーム感覚のスピーディな学習を好む'
      ]),

      createHeading('5. 伴走者（パートナー）', 3),
      createList([
        'つながりと精神的サポートを重視する協調型',
        '「一人じゃない」安心感が原動力',
        'AIは心優しいメンターとして共感的にサポート',
        '対話的・協調的な学習を好む'
      ]),

      createHeading('6. 効率家（プラグマティスト）', 3),
      createList([
        '結果重視で最短経路を求める現実主義者',
        '実用性や効率性が最優先',
        'AIは専門コンサルタントとして簡潔に回答',
        '要点や即効性のある知識を求める'
      ]),

      createHeading('診断の受け方'),
      createSteps([
        'アカウント作成後、自動的に診断ページに移動',
        '12個の質問に直感で回答（各2択、約2分）',
        '回答完了後、即座に結果を表示',
        '診断結果の詳細説明を確認',
        '必要に応じて診断を再実行可能'
      ]),

      createHeading('診断結果の活用'),
      createParagraph('診断結果は以下の場面で活用されます：'),
      createList([
        'AIエージェントの話し方・対応スタイル',
        '学習プランの提案方法',
        '問題解説のアプローチ',
        '進路相談での情報提示方法',
        'モチベーション維持の声かけ',
        '成果レポートの表現方法'
      ]),

      createHeading('診断結果の変更'),
      createParagraph('学習を続ける中で「自分に合わない」と感じた場合は、設定ページからいつでも診断を再実行できます。'),
      
      createInfo('診断結果を変更すると、すべてのAIエージェントが新しいタイプに合わせて対応を調整します。'),

      createHeading('よくある質問'),
      createParagraph('**Q: 診断結果に納得できない場合は？**'),
      createParagraph('A: 診断は再実行可能です。また、手動でタイプを選択することもできます。'),
      
      createParagraph('**Q: 複数のタイプの特徴を持っている場合は？**'),
      createParagraph('A: 最も強い傾向のタイプが選ばれますが、設定で「ハイブリッドモード」を選択すると複数タイプの特徴を組み合わせられます。'),
      
      createParagraph('**Q: 保護者も診断結果を確認できますか？**'),
      createParagraph('A: 未成年の場合、保護者アカウントから診断結果と学習傾向を確認できます。')
    ]
  },

  {
    id: 'first-setup',
    title: '初期設定の方法',
    category: 'はじめに',
    categoryId: 'getting-started',
    description: 'アカウント作成後の基本設定について詳しく説明します。プロフィール設定から通知設定まで、最適な学習環境を構築しましょう。',
    isPopular: false,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 6,
    tags: ['設定', 'プロフィール', '通知'],
    relatedArticles: ['account-creation', 'personality-test'],
    content: [
      createHeading('初期設定の概要', 1),
      createParagraph('アカウント作成と性格診断完了後、学習効果を最大化するための各種設定を行います。すべて後から変更可能なので、まずは基本設定から始めましょう。'),

      createHeading('プロフィール設定'),
      createParagraph('あなたの学習状況をAIが理解するための基本情報を設定します。'),
      
      createHeading('基本情報', 3),
      createSteps([
        '学年・学校名の入力',
        '志望校・志望学部の設定',
        '現在の学習状況（偏差値、模試結果など）',
        'メインで学習したい科目の選択'
      ]),

      createInfo('志望校は最大5校まで設定可能です。AIが各校の入試傾向に合わせたアドバイスを提供します。'),

      createHeading('学習スタイル設定', 3),
      createSteps([
        '1日の学習時間目標',
        '集中しやすい時間帯',
        '学習場所（自宅、図書館、塾など）',
        '休憩の取り方の好み'
      ]),

      createHeading('通知設定'),
      createParagraph('学習継続をサポートする通知機能をカスタマイズできます。'),
      
      createList([
        '**学習リマインダー**: 設定した時間に学習開始を通知',
        '**進捗確認**: 週次・月次の学習状況レポート',
        '**モチベーション**: 励ましやヒントの定期配信',
        '**重要情報**: 志望校の入試情報や制度変更',
        '**AI応答**: チャットへの返信通知'
      ]),

      createHeading('AIエージェント設定'),
      createParagraph('3つのAIエージェントをあなた好みにカスタマイズできます。'),
      
      createHeading('呼び方・名前設定', 3),
      createSteps([
        '各AIエージェントのニックネーム設定',
        'あなたの呼ばれ方設定（さん、君、ちゃんなど）',
        '敬語レベルの調整',
        '話し方の細かい調整（方言、キャラクター性など）'
      ]),

      createHeading('応答スタイル設定', 3),
      createParagraph('性格診断結果をベースに、さらに細かく調整できます：'),
      createList([
        '回答の詳しさレベル（簡潔 ↔ 詳細）',
        '励ましの頻度（控えめ ↔ 積極的）',
        '質問の仕方（直接的 ↔ 誘導的）',
        'ヒントの出し方（明確 ↔ 考えさせる）'
      ]),

      createHeading('プライバシー設定'),
      createParagraph('学習データの管理と共有に関する設定を行います。'),
      
      createHeading('データ管理', 3),
      createList([
        '学習履歴の保存期間',
        'チャット履歴の自動削除設定',
        '成績データの保存範囲',
        '分析レポートの詳細レベル'
      ]),

      createHeading('共有設定', 3),
      createList([
        '保護者への学習状況共有（未成年の場合）',
        '学校・塾への進捗報告（任意）',
        '匿名での統計データ協力',
        'サービス改善のための分析協力'
      ]),

      createWarning('未成年の場合、保護者の同意なく共有設定を変更することはできません。'),

      createHeading('科目別設定'),
      createParagraph('科目ごとに学習方針や目標を詳細に設定できます。'),
      
      createSteps([
        '科目ごとの優先度設定',
        '現在のレベルと目標レベル',
        '使用中の教材・参考書の登録',
        '学習時間の配分設定',
        '弱点分野の明確化'
      ]),

      createHeading('保護者設定（未成年の場合）'),
      createParagraph('保護者の方にも安心してご利用いただくための設定です。'),
      
      createList([
        '保護者アカウントの紐付け',
        '学習状況の共有レベル設定',
        '利用時間制限の設定',
        '不適切コンテンツのフィルタリング',
        '緊急時の連絡先設定'
      ]),

      createHeading('設定完了後の確認'),
      createParagraph('すべての設定が完了したら、以下を確認しましょう：'),
      
      createSteps([
        'プロフィール情報の最終確認',
        'AIエージェントとのテスト対話',
        '通知設定の動作確認',
        '保護者設定の確認（該当者のみ）',
        'プライバシー設定の再確認'
      ]),

      createInfo('設定は学習を続ける中でいつでも変更できます。最初は基本設定で始めて、使いながら調整していくのがおすすめです。'),

      createHeading('よくある質問'),
      createParagraph('**Q: 設定を変更するとAIの対応はすぐに変わりますか？**'),
      createParagraph('A: はい。設定変更は即座に反映され、次の対話から新しい設定で応答します。'),
      
      createParagraph('**Q: 設定を間違えてしまいました。元に戻せますか？**'),
      createParagraph('A: すべての設定は変更履歴が保存されており、以前の状態に戻すことができます。'),
      
      createParagraph('**Q: 推奨設定はありますか？**'),
      createParagraph('A: 性格診断結果に基づいて、あなたに最適な設定を自動提案する機能があります。')
    ]
  },

  {
    id: 'mobile-app',
    title: 'モバイルアプリの使い方',
    category: 'はじめに', 
    categoryId: 'getting-started',
    description: 'スマートフォンアプリの基本操作について詳しく説明します。外出先でも効率的に学習を続けるためのヒントも紹介します。',
    isPopular: false,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 5,
    tags: ['モバイル', 'アプリ', '操作方法'],
    relatedArticles: ['account-creation', 'sync-problems'],
    content: [
      createHeading('モバイルアプリの特徴', 1),
      createParagraph('LIVAL AIモバイルアプリは、外出先でもAIコーチングを受けられる便利なツールです。Webブラウザ版と完全同期し、シームレスな学習体験を提供します。'),

      createHeading('アプリのダウンロード'),
      createSteps([
        'App Store（iOS）またはGoogle Play（Android）で「LIVAL AI」を検索',
        'アプリをダウンロード・インストール',
        'アプリを起動してアカウントでログイン',
        '初回セットアップを完了'
      ]),

      createInfo('アプリは無料でダウンロードできます。プレミアム機能の利用にはサブスクリプション契約が必要です。'),

      createHeading('基本操作'),
      
      createHeading('ホーム画面', 3),
      createParagraph('アプリ起動時に表示される画面です：'),
      createList([
        '**今日の学習状況**: 本日の学習時間と進捗',
        '**AIエージェント**: 3つのAIとの最新対話',
        '**クイックアクション**: 写真撮影、音声入力、スケジュール確認',
        '**通知センター**: 重要なお知らせとリマインダー'
      ]),

      createHeading('チャット機能', 3),
      createParagraph('AIエージェントとの対話に最適化されています：'),
      createList([
        '**音声入力**: マイクボタンで話しかけ',
        '**写真撮影**: 問題や資料を撮影して質問',
        '**手書き入力**: 数式や図を直接描画',
        '**テンプレート**: よく使う質問のワンタップ入力'
      ]),

      createHeading('学習記録機能', 3),
      createList([
        '**タイマー機能**: 学習時間の計測',
        '**科目記録**: 何を勉強したかを記録',
        '**進捗写真**: 学習の様子を撮影保存',
        '**感想メモ**: 学習の振り返りを記録'
      ]),

      createHeading('オフライン機能'),
      createParagraph('インターネット接続がない環境でも一部機能が利用できます：'),
      
      createList([
        '**過去のチャット履歴**: 最新100件まで閲覧可能',
        '**学習記録**: タイマーと記録機能',
        '**ダウンロード済み資料**: 事前保存した教材',
        '**レポート閲覧**: 過去に生成したレポート'
      ]),

      createWarning('オフライン時はAIとの新しい対話はできません。ネット接続後に同期されます。'),

      createHeading('写真撮影機能'),
      createParagraph('問題や教材を撮影してAIに質問する機能です：'),
      
      createSteps([
        'チャット画面のカメラアイコンをタップ',
        '問題や資料を撮影',
        '必要に応じて画像を編集・トリミング',
        '質問内容を入力して送信',
        'AIが画像を解析して回答'
      ]),

      createInfo('OCR（文字認識）機能により、手書きや印刷された文字を高精度で読み取れます。'),

      createHeading('音声入力機能'),
      createParagraph('話しかけるだけでAIに質問できる便利な機能です：'),
      
      createList([
        '**音声認識**: 日本語の自然な話し言葉に対応',
        '**ノイズキャンセリング**: 周囲の雑音を除去',
        '**感情認識**: 声のトーンから感情を分析',
        '**方言対応**: 主要な方言も認識可能'
      ]),

      createHeading('通知設定'),
      createParagraph('モバイルアプリならではの通知機能を活用しましょう：'),
      
      createList([
        '**プッシュ通知**: 学習リマインダーと重要情報',
        '**バッジ**: 未読メッセージ数の表示',
        '**ロック画面通知**: 画面を開かずに確認',
        '**スケジュール通知**: 学習予定の事前お知らせ'
      ]),

      createHeading('セキュリティ機能'),
      createParagraph('個人情報保護のためのセキュリティ機能：'),
      
      createList([
        '**顔認証・指紋認証**: アプリロック機能',
        '**自動ログアウト**: 一定時間後の自動ログアウト',
        '**データ暗号化**: 端末内データの保護',
        '**リモートワイプ**: 紛失時のデータ削除'
      ]),

      createHeading('トラブルシューティング'),
      
      createHeading('アプリが起動しない', 3),
      createSteps([
        'アプリを完全に終了して再起動',
        'スマートフォンの再起動',
        'アプリの最新版への更新',
        'ストレージ容量の確認と整理'
      ]),

      createHeading('同期がうまくいかない', 3),
      createSteps([
        'インターネット接続の確認',
        'アプリの手動同期実行',
        'ログアウト・ログイン',
        'アプリの再インストール'
      ]),

      createHeading('バッテリー消費が多い', 3),
      createList([
        'バックグラウンド更新の無効化',
        '通知頻度の調整',
        '画面の明るさ調整',
        '位置情報サービスの見直し'
      ]),

      createHeading('よくある質問'),
      createParagraph('**Q: アプリとWebブラウザ版の違いは何ですか？**'),
      createParagraph('A: 基本機能は同じですが、アプリでは写真撮影、音声入力、プッシュ通知などモバイル特有の機能が利用できます。'),
      
      createParagraph('**Q: データ通信量はどのくらいかかりますか？**'),
      createParagraph('A: テキストチャットは月1GB程度、写真送信を頻繁に行う場合は2-3GB程度です。'),
      
      createParagraph('**Q: 機種変更時のデータ移行方法は？**'),
      createParagraph('A: アカウントに紐付いているため、新しい端末でログインするだけでデータが同期されます。')
    ]
  }
]