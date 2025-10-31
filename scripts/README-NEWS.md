# お知らせ追加スクリプト使用ガイド

Firestoreに直接お知らせを追加するためのスクリプトです。

## 📋 前提条件

### 1. Firebase Admin SDKのインストール

```bash
npm install firebase-admin --save-dev
```

### 2. Firebase認証設定

以下のいずれかの方法で認証を設定してください：

#### 方法A: サービスアカウントキーを使用（推奨）

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. `lival-app` プロジェクトを選択
3. **プロジェクトの設定** → **サービスアカウント** タブ
4. **新しい秘密鍵の生成** をクリック
5. ダウンロードしたJSONファイルを `scripts/serviceAccountKey.json` として保存
6. `add-news.js` の初期化部分を以下に変更：

```javascript
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'lival-app'
});
```

#### 方法B: 環境変数を使用

```bash
# Windows (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"

# macOS/Linux
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
```

---

## 🚀 使い方

### 基本的な使い方

1. `scripts/add-news.js` を開く
2. `newsData` 配列にお知らせを記述
3. スクリプトを実行

```bash
node scripts/add-news.js
```

### お知らせデータの記述例

```javascript
const newsData = [
  {
    title: 'お知らせのタイトル',
    content: `
      <h2>見出し</h2>
      <p>本文をここに書きます。HTMLタグが使えます。</p>
      <ul>
        <li>箇条書き1</li>
        <li>箇条書き2</li>
      </ul>
    `,
    priority: 'high',        // 'urgent' | 'high' | 'normal' | 'low'
    type: 'feature',         // 'general' | 'maintenance' | 'feature' | 'system'
    status: 'published',     // 'draft' | 'published' | 'archived'
  }
];
```

---

## 📝 フィールド説明

### 必須フィールド

| フィールド | 型 | 説明 | 例 |
|---|---|---|---|
| `title` | string | お知らせタイトル | "新機能リリースのお知らせ" |
| `content` | string | お知らせ本文（HTML可） | "<p>本文...</p>" |

### オプションフィールド

| フィールド | 型 | デフォルト値 | 選択肢 |
|---|---|---|---|
| `priority` | string | 'normal' | 'urgent', 'high', 'normal', 'low' |
| `type` | string | 'general' | 'general', 'maintenance', 'feature', 'system' |
| `status` | string | 'published' | 'draft', 'published', 'archived' |
| `excerpt` | string | 自動生成 | 手動で指定可能 |
| `authorId` | string | 'admin' | 任意の文字列 |
| `authorName` | string | 'LIVAL AI運営チーム' | 任意の文字列 |

---

## 🎨 優先度とタイプの使い分け

### 優先度 (priority)

| 値 | 表示名 | 用途 |
|---|---|---|
| `urgent` | 緊急 | システム障害、緊急メンテナンスなど |
| `high` | 重要 | 重要な新機能、大きな変更など |
| `normal` | 通常 | 一般的なお知らせ |
| `low` | 参考 | 参考情報、軽微な変更など |

### タイプ (type)

| 値 | 表示名 | アイコン | 用途 |
|---|---|---|---|
| `general` | 一般 | 📢 | 一般的なお知らせ |
| `maintenance` | メンテナンス | 🔧 | メンテナンス情報 |
| `feature` | 新機能 | ✨ | 新機能追加・アップデート |
| `system` | システム | ⚙️ | システム関連の通知 |

---

## 📋 実行例

### 例1: 単一のお知らせを追加

```javascript
const newsData = [
  {
    title: '【重要】料金プラン変更のお知らせ',
    content: `
      <p>2025年3月1日より、料金プランを変更いたします。</p>
      <p>詳細は料金ページをご確認ください。</p>
    `,
    priority: 'high',
    type: 'general',
    status: 'published',
  }
];
```

```bash
node scripts/add-news.js
```

**出力例**:
```
📢 1件のお知らせを追加します...

[1/1] 追加中...
✅ お知らせを追加しました！
📄 ドキュメントID: abc123def456
📝 タイトル: 【重要】料金プラン変更のお知らせ
🔗 URL: https://console.firebase.google.com/project/lival-app/firestore/data/news/abc123def456

✅ すべてのお知らせを追加しました！

🎉 処理が完了しました！
```

### 例2: 複数のお知らせを一括追加

```javascript
const newsData = [
  {
    title: 'お知らせ1',
    content: '内容1',
    priority: 'high',
    type: 'feature',
  },
  {
    title: 'お知らせ2',
    content: '内容2',
    priority: 'normal',
    type: 'general',
  },
  {
    title: 'お知らせ3',
    content: '内容3',
    priority: 'urgent',
    type: 'maintenance',
  }
];
```

---

## 🛠️ トラブルシューティング

### エラー: "Could not load the default credentials"

**原因**: Firebase認証情報が設定されていません。

**解決策**:
1. サービスアカウントキーをダウンロード
2. 環境変数 `GOOGLE_APPLICATION_CREDENTIALS` を設定
3. または、スクリプト内で直接キーを読み込む

### エラー: "Permission denied"

**原因**: Firestoreセキュリティルールで書き込みが拒否されています。

**解決策**:
- Firebase Admin SDKを使用している場合、セキュリティルールは適用されません
- サービスアカウントキーが正しく設定されているか確認

### エラー: "Cannot find module 'firebase-admin'"

**原因**: `firebase-admin` がインストールされていません。

**解決策**:
```bash
npm install firebase-admin --save-dev
```

---

## 🔒 セキュリティ注意事項

⚠️ **重要**: `serviceAccountKey.json` は秘密情報です！

- **絶対にGitにコミットしない**
- `.gitignore` に追加する
- 本番環境では環境変数を使用する

```gitignore
# .gitignore に追加
scripts/serviceAccountKey.json
serviceAccountKey.json
```

---

## 📚 関連ドキュメント

- [お知らせ機能データ構造](../docs/DATABASE-STRUCTURE.md#4-news-コレクション-実装済みモバイル対応)
- [モバイルアプリ連携ガイド](../docs/MOBILE-NEWS-INTEGRATION.md)
- [Firebase Admin SDK ドキュメント](https://firebase.google.com/docs/admin/setup)

---

## 💡 Tips

### HTMLコンテンツの記述

改行やインデントを含めたHTMLを記述する場合は、テンプレートリテラル（バッククォート）を使用します：

```javascript
content: `
  <h2>見出し</h2>
  <p>段落1</p>
  <p>段落2</p>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
`
```

### 下書き保存

すぐに公開せず、下書きとして保存する場合：

```javascript
{
  title: '下書きのお知らせ',
  content: '内容...',
  status: 'draft',  // 下書き状態
}
```

後でFirebaseコンソールから `status` を `published` に変更すると公開されます。

---

**最終更新**: 2025年1月
**作成者**: LIVAL AI開発チーム
