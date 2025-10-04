// src/data/faq/categories/technical.ts
import { FAQArticle, createHeading, createParagraph, createList, createSteps, createInfo, createWarning, createCode } from '../types'

export const technicalArticles: FAQArticle[] = [
  {
    id: 'login-issues',
    title: 'ログインできない場合',
    category: '技術的な問題',
    categoryId: 'technical',
    description: 'ログイン問題の一般的な原因と解決方法について詳しく説明します。パスワードリセットから技術的なトラブルまで網羅的にカバーします。',
    isPopular: true,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 6,
    views: 623,
    tags: ['ログイン', 'パスワード', 'アカウント'],
    relatedArticles: ['account-security', 'app-crashes'],
    content: [
      createHeading('ログイン問題の診断', 1),
      createParagraph('ログインできない原因は様々です。以下の手順で問題を特定し、解決しましょう。'),

      createHeading('パスワードを忘れた場合'),
      createSteps([
        'ログイン画面の「パスワードを忘れた方」をクリック',
        '登録済みメールアドレスを入力',
        'パスワードリセットメールを確認（迷惑メールフォルダも確認）',
        'メール内のリンクをクリック',
        '新しいパスワードを設定',
        '新しいパスワードでログイン'
      ]),

      createInfo('パスワードリセットメールが届かない場合は、迷惑メールフィルターの設定を確認してください。'),

      createHeading('メールアドレスの入力ミス'),
      createList([
        '大文字・小文字、ピリオドの位置を確認',
        '複数のメールアドレスをお持ちの場合は、別のアドレスで試行',
        'ブラウザの自動補完機能が間違ったアドレスを入力している可能性'
      ]),

      createHeading('アカウントロック'),
      createParagraph('5回連続でログインに失敗すると30分間ロックされます。'),
      createList([
        '30分待ってから再度試行',
        'ロックが解除されない場合はサポートに連絡',
        '不正アクセス検知でロックされた場合の対処'
      ]),

      createHeading('ブラウザの問題'),
      createSteps([
        'ブラウザのキャッシュとCookieをクリア',
        '別のブラウザで試行',
        'プライベートモードで試行',
        'ブラウザを最新版にアップデート'
      ]),

      createCode(`
キャッシュクリア（Chrome）:
Ctrl+Shift+Delete → 全期間 → データを削除
`, 'text'),

      createHeading('よくある質問'),
      createParagraph('**Q: パスワードリセットメールが届きません**'),
      createParagraph('A: 迷惑メールフォルダを確認し、info@lival-ai.com からのメールを許可してください。'),
      
      createParagraph('**Q: 複数のデバイスで同じアカウントを使えますか？**'),
      createParagraph('A: はい。最大5台のデバイスで同時利用可能です。')
    ]
  },

  {
    id: 'app-crashes',
    title: 'アプリが動作しない',
    category: '技術的な問題',
    categoryId: 'technical',
    description: 'アプリクラッシュや動作不良の対処法について説明します。iOS・Android両対応の解決方法を提供します。',
    isPopular: false,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 5,
    tags: ['アプリ', 'クラッシュ', '動作不良'],
    relatedArticles: ['performance', 'sync-problems'],
    content: [
      createHeading('アプリ動作問題の診断', 1),
      createParagraph('LIVAL AIモバイルアプリの動作に問題がある場合の診断と解決方法をご案内します。'),

      createHeading('アプリが起動しない'),
      createSteps([
        'アプリを完全に終了',
        'デバイスの再起動',
        'アプリストアで更新確認',
        'デバイスの空き容量確認（最低1GB必要）',
        'OSバージョンの確認と更新'
      ]),

      createHeading('アプリが強制終了する'),
      createList([
        'メモリ不足: 他のアプリを終了してメモリを確保',
        'バックグラウンド処理: バックグラウンドアプリ更新を制限',
        '省電力モード: 省電力モードを一時的に無効化',
        'デバイス温度: デバイスの過熱時は冷却後に再試行'
      ]),

      createInfo('アプリクラッシュが頻発する場合は、デバイスの再起動が最も効果的です。'),

      createHeading('iOS固有の問題'),
      createSteps([
        '設定 → 一般 → iPhone/iPadストレージ → LIVAL AI → Appを取り除く',
        '設定 → 一般 → Appのバックグラウンド更新 → LIVAL AI をオフ/オン',
        'iOSの強制再起動',
        'App Storeからアプリの強制更新'
      ]),

      createCode(`
iOS強制再起動:
iPhone X以降: 音量上→音量下→サイドボタン長押し
iPhone 8: 音量上→音量下→サイドボタン長押し
iPhone 7: 音量下+サイドボタン同時に10秒間
`, 'text'),

      createHeading('Android固有の問題'),
      createSteps([
        '設定 → アプリ → LIVAL AI → ストレージ → キャッシュを削除',
        '設定 → アプリ → LIVAL AI → 強制停止 → 再起動',
        '設定 → 電池 → 電池の最適化 → LIVAL AI を最適化対象外に設定',
        'Google Play ストアで手動更新'
      ]),

      createHeading('権限の確認'),
      createList([
        'カメラ権限: 画像解析機能のために必要',
        'マイク権限: 音声入力機能のために必要',
        'ストレージ権限: データ保存のために必要',
        'ネットワーク権限: 同期機能のために必要'
      ]),

      createHeading('推奨デバイススペック'),
      createList([
        'iOS: iOS 14.0以上、iPhone 7以降推奨',
        'Android: Android 8.0以上、RAM 3GB以上推奨',
        'ストレージ: 空き容量1GB以上',
        'ネットワーク: Wi-Fi環境推奨'
      ]),

      createHeading('よくある質問'),
      createParagraph('**Q: アプリが毎回クラッシュします**'),
      createParagraph('A: デバイスの再起動後、アプリの再インストールをお試しください。'),
      
      createParagraph('**Q: 特定の機能だけ使えません**'),
      createParagraph('A: アプリの権限設定を確認してください。カメラ、マイク、ストレージの権限が必要です。')
    ]
  },

  {
    id: 'sync-problems',
    title: 'データ同期の問題',
    category: '技術的な問題',
    categoryId: 'technical',
    description: 'デバイス間でのデータ同期トラブルの原因と解決方法について説明します。学習データの整合性を保つためのヒントも紹介します。',
    isPopular: false,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 5,
    tags: ['同期', 'データ', 'バックアップ'],
    relatedArticles: ['mobile-app', 'app-crashes'],
    content: [
      createHeading('データ同期の仕組み', 1),
      createParagraph('LIVAL AIでは、複数のデバイス間でシームレスなデータ同期を実現しています。同期に問題がある場合の診断と解決方法をご案内します。'),

      createHeading('同期されるデータ'),
      createList([
        'チャット履歴: AIエージェントとの全ての対話',
        '学習記録: 学習時間、進捗状況、成績データ',
        'プロフィール設定: 個人情報、学習目標、AI設定',
        'レポートデータ: 生成された学習レポート',
        'ブックマーク: 保存した重要なチャットや情報'
      ]),

      createHeading('同期のタイミング'),
      createList([
        '自動同期: アプリ起動時、バックグラウンド復帰時',
        'リアルタイム: チャット送信時、学習記録更新時',
        '定期同期: 5分間隔での自動同期',
        '手動同期: 設定画面からの手動実行'
      ]),

      createHeading('同期問題の診断'),
      createParagraph('**新しいチャットが他のデバイスに表示されない**'),
      createSteps([
        'インターネット接続を確認',
        '両方のデバイスで同じアカウントにログインしているか確認',
        '送信デバイスで送信完了アイコン（✓）を確認',
        '受信デバイスでアプリを一度閉じて再起動',
        '設定 → アカウント → 手動同期を実行'
      ]),

      createParagraph('**学習記録の時間が合わない**'),
      createSteps([
        'デバイスの時刻設定を確認（自動設定推奨）',
        'タイムゾーン設定を確認',
        'アプリの設定 → 学習記録 → 時刻補正を実行'
      ]),

      createHeading('ネットワーク関連の問題'),
      createList([
        'Wi-Fi接続: 安定したWi-Fi環境が推奨',
        'モバイルデータ: データ制限設定を確認',
        '企業ネットワーク: ファイアウォール設定を確認',
        'VPN接続: VPN使用時は同期が制限される場合あり'
      ]),

      createInfo('モバイルデータでの同期は、データ通信量を消費します。Wi-Fi環境での同期を推奨します。'),

      createHeading('アカウント関連の問題'),
      createSteps([
        '現在ログイン中のアカウントをメニューで確認',
        '設定 → アカウント情報で登録メールアドレスを確認',
        '別のログイン方法（Google、Apple等）を試行',
        '正しいアカウントでログインし直し'
      ]),

      createHeading('同期の最適化設定'),
      createList([
        'Wi-Fi接続時のみ同期: データ通信量を節約',
        '同期頻度の調整: バッテリー消費を抑制',
        '重要データ優先: チャット履歴を最優先で同期',
        'バックグラウンド同期: アプリ終了時の同期設定'
      ]),

      createWarning('同期エラーが頻発する場合は、一度アプリを再インストールすることで解決する場合があります。'),

      createHeading('よくある質問'),
      createParagraph('**Q: 同期が完了するまでどのくらい時間がかかりますか？**'),
      createParagraph('A: データ量により異なりますが、通常は1-5分程度です。初回同期は時間がかかる場合があります。'),
      
      createParagraph('**Q: 同期エラーでデータが失われることはありますか？**'),
      createParagraph('A: 同期エラーが発生してもデータは各デバイスとクラウドに保存されているため、完全に失われることはありません。')
    ]
  },

  {
    id: 'performance',
    title: 'パフォーマンスの改善',
    category: '技術的な問題',
    categoryId: 'technical',
    description: 'アプリの動作速度を向上させる方法について説明します。メモリ最適化からネットワーク設定まで包括的にカバーします。',
    isPopular: false,
    lastUpdated: '2024-08-22',
    estimatedReadTime: 4,
    tags: ['パフォーマンス', '最適化', '速度改善'],
    relatedArticles: ['app-crashes', 'sync-problems'],
    content: [
      createHeading('パフォーマンス問題の特定', 1),
      createParagraph('LIVAL AIの動作が遅い場合、原因を特定して適切な対処を行うことで、快適な学習環境を取り戻せます。'),

      createHeading('一般的なパフォーマンス問題'),
      createList([
        'アプリの起動が遅い',
        'チャットの応答が遅い',
        '画像解析の処理時間が長い',
        '画面の切り替えが重い',
        '同期処理に時間がかかる'
      ]),

      createHeading('デバイス側の最適化'),
      createSteps([
        '不要なアプリを終了してメモリを解放',
        'デバイスの再起動で一時的なデータをクリア',
        'ストレージ容量を確保（推奨：空き容量2GB以上）',
        'バックグラウンドアプリの制限'
      ]),

      createHeading('アプリ設定の最適化'),
      createList([
        '画質設定を「標準」に変更',
        'アニメーション効果を軽量化',
        '自動画像読み込みを制限',
        'フォントサイズの最適化'
      ]),

      createHeading('ネットワーク最適化'),
      createList([
        'ルーターの再起動',
        '5GHz帯への接続（2.4GHz帯より高速）',
        'DNS設定を高速なものに変更（8.8.8.8等）',
        'ルーターとデバイスの距離を近づける'
      ]),

      createCode(`
推奨ネットワーク速度:
最低要求: 1Mbps（基本機能）
推奨速度: 5Mbps（快適な利用）
画像解析: 10Mbps（高速処理）
`, 'text'),

      createHeading('iOS最適化'),
      createList([
        '設定 → 一般 → Appのバックグラウンド更新 → 必要なアプリのみ有効',
        '設定 → アクセシビリティ → 動作 → 視差効果を減らす → オン',
        '設定 → バッテリー → 低電力モード → 一時的に有効',
        'iOSの最新版への更新'
      ]),

      createHeading('Android最適化'),
      createList([
        '設定 → 電池 → 電池の最適化 → LIVAL AIを最適化対象外に設定',
        '設定 → アプリ → LIVAL AI → 電池 → バックグラウンド動作を許可',
        '設定 → ストレージ → キャッシュデータを削除',
        'Androidの最新版への更新'
      ]),

      createHeading('定期メンテナンス'),
      createSteps([
        '週1回: アプリのキャッシュクリア',
        '月1回: デバイスの再起動',
        '月1回: ストレージ容量の確認と整理',
        '3ヶ月に1回: アプリの再インストール'
      ]),

      createInfo('パフォーマンス問題が解決しない場合は、デバイスの性能がアプリの要件を下回っている可能性があります。'),

      createHeading('よくある質問'),
      createParagraph('**Q: どのくらいのメモリが必要ですか？**'),
      createParagraph('A: 最低2GB、推奨4GB以上のRAMが必要です。ストレージは1GB以上の空き容量を確保してください。'),
      
      createParagraph('**Q: 古いデバイスでも快適に使えますか？**'),
      createParagraph('A: 推奨スペックを下回る場合は、設定を軽量化することで改善できる場合があります。')
    ]
  }
]
