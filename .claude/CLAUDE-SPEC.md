# LIVAL-AI-SPEC.md
# LIVAL AI プロジェクト仕様書

> このファイルはClaude Codeでの開発時に参照される、LIVAL AIプロジェクトの包括的な仕様書です。

## 📋 プロジェクト概要

### 基本情報
- **プロジェクト名**: LIVAL AI - パーソナルAIコーチングプラットフォーム
- **バージョン**: Web版 v1.0
- **開発段階**: フロントエンド実装中
- **既存資産**: モバイルアプリ（Firestore データベース稼働中）

### 技術スタック
```json
{
  "frontend": {
    "framework": "Next.js 15.5.0",
    "react": "React 19.1.0", 
    "typescript": "TypeScript 5.x",
    "styling": "Tailwind CSS 4.x",
    "animation": "Framer Motion 12.x"
  },
  "backend": {
    "database": "Firebase Firestore",
    "auth": "Firebase Authentication",
    "storage": "Firebase Storage",
    "functions": "Firebase Cloud Functions"
  },
  "payment": {
    "provider": "Stripe",
    "currency": "JPY"
  }
}
```

## 🏗️ データベース構造

### 既存Firestore構造（モバイルアプリ互換）
```
lival-app/
├── users/{userId}/
│   ├── bio: string                    // 自己紹介
│   ├── birthday: Timestamp            // 生年月日  
│   ├── coins: number                  // ゲーミフィケーション用コイン
│   ├── createdAt: Timestamp           // アカウント作成日時
│   ├── currentMonsterId: string       // 現在のキャラクター
│   ├── displayName: string            // 表示名
│   ├── email: string                  // メールアドレス
│   ├── emailVerified: boolean         // メール認証状態
│   ├── gender: "male"|"female"        // 性別
│   ├── groupSessionCount: number      // グループ学習セッション数
│   ├── groupTotalMinutes: number      // グループ学習時間
│   ├── individualSessionCount: number // 個人学習セッション数
│   ├── individualTotalMinutes: number // 個人学習時間
│   ├── level: number                  // ユーザーレベル
│   ├── photoURL: string               // プロフィール画像URL
│   ├── updatedAt: Timestamp           // 最終更新日時
│   ├── xp: number                     // 経験値
│   └── subcollections/
│       ├── eduAI_threads/             // AIチャット履歴（モバイルで利用中）
│       ├── friends/                   // フレンド関係
│       └── xpLedger/                  // 経験値履歴
├── masters/
│   ├── achievements/           
│   ├── monsters/                    
│   └── rooms/                       
```

### Web版拡張フィールド
```typescript
// users/{userId}/ に追加されるフィールド
interface WebUserExtension {
  // サブスクリプション管理
  subscription: {
    plan: 'free_web' | 'premium';      // フリー（WEB限定）| プレミアム（4980円）
    status: 'active' | 'canceled' | 'past_due' | 'trial';
    currentPeriodStart: Timestamp;
    currentPeriodEnd: Timestamp;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  
  // Web版特有設定
  webProfile: {
    lastWebLogin: Timestamp;
    isWebUser: boolean;                // Web版メインユーザーかどうか
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
      language: 'ja' | 'en';
    };
  };
  
  // 今後の診断機能用（未実装）
  diagnostics?: {
    studentType?: string;              // 6つの学習タイプ
    completedAt?: Timestamp;
  };
}
```

## 💰 サブスクリプション仕様

### プラン構成
```typescript
const SUBSCRIPTION_PLANS = {
  free_web: {
    id: 'free_web',
    name: 'フリープラン',
    price: 0,
    currency: 'JPY',
    interval: null,
    description: 'Web版限定・基本機能のみ',
    features: [
      'Web版基本機能',
      '限定的なAI利用'
    ],
    restrictions: [
      'モバイルアプリ利用不可',
      '機能制限あり'
    ]
  },
  premium: {
    id: 'premium', 
    name: 'プレミアムプラン',
    price: 4980,
    currency: 'JPY',
    interval: 'month',
    description: 'AIサービス全般利用可能',
    features: [
      'AIサービス全機能利用可能',
      'モバイルアプリ対応',
      '無制限学習サポート',
      '専用AIコーチング',
      '進路相談サービス'
    ]
  }
}
```

### 決済フロー
1. フリープランで新規登録（Web限定）
2. プレミアムプラン（4980円/月）へのアップグレード
3. Stripe決済統合
4. プラン変更・キャンセル機能

## 🎯 学習タイプ診断（今後実装）

### 6つの学習タイプ(仮案)
1. **戦略家（ストラテジスト）**: 効率と納得感を重視
2. **探求家（エクスプローラー）**: 発見と好奇心重視
3. **努力家（アチーバー）**: 承認と積み上げ重視
4. **挑戦家（チャレンジャー）**: 競争と困難克服重視
5. **伴走者（パートナー）**: 共感とサポート重視
6. **効率家（プラグマティスト）**: 実用性と結果重視

### 診断フロー（未実装）
- 12問の2択形式質問
- 判定ロジックによる分類
- 結果に基づくパーソナライズ

## 🔧 デフォルト値仕様

### 新規Web登録時の初期値
```typescript
const createDefaultUserData = (email: string, displayName?: string) => ({
  // 基本プロフィール
  bio: '',
  birthday: null,                      // 後から設定
  displayName: displayName || email.split('@')[0],
  gender: null,                        // 後から設定
  photoURL: '',                        // デフォルト画像設定
  
  // ゲーミフィケーション
  coins: 0,
  xp: 0,
  level: 1,
  currentMonsterId: 'monster-01',      // デフォルトキャラクター
  
  // 学習データ
  groupSessionCount: 0,
  groupTotalMinutes: 0,
  individualSessionCount: 0,
  individualTotalMinutes: 0,
  
  // システム
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  email,
  emailVerified: false,
  
  // Web版追加
  subscription: {
    plan: 'free_web',
    status: 'active',
    currentPeriodStart: serverTimestamp(),
    currentPeriodEnd: null
  },
  webProfile: {
    lastWebLogin: serverTimestamp(),
    isWebUser: true,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'ja'
    }
  }
});
```

## 🎨 デザイン

### コンポーネント規約
```typescript
// 統一されたバリアント
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
type Size = 'sm' | 'md' | 'lg' | 'xl';


## 📱 レスポンシブ対応

### ブレークポイント
```typescript
const BREAKPOINTS = {
  sm: '640px',   // タブレット
  md: '768px',   // 小型PC
  lg: '1024px',  // デスクトップ
  xl: '1280px'   // 大型ディスプレイ
};
```

## 🔐 セキュリティ仕様

### Firebase セキュリティルール
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // サブコレクションも同様
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // mastersコレクションは認証済みユーザーのみ読み取り可能
    match /masters/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

### 認証フロー
1. Firebase Authentication使用
2. メール/パスワード認証
3. Googleソーシャルログイン対応
4. メール認証必須

## 🔄 データ同期仕様

### モバイル⇔Web 連携
- 同一Firebase プロジェクト（lival-app）使用
- ユーザーデータの完全同期
- Web版で追加されたフィールドはモバイル版で無視
- モバイル版のゲーミフィケーション要素をWeb版で表示

##現状のfirestorerules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSigned() { return request.auth != null;}
    function isMember(roomId) {
      return isSigned()
        && exists(/databases/$(database)/documents/rooms/$(roomId))
        && request.auth.uid in get(/databases/$(database)/documents/rooms/$(roomId)).data.members;
    }
    function isHost(roomId) {
      return isSigned()
        && get(/databases/$(database)/documents/rooms/$(roomId)).data.hostUserId == request.auth.uid;
    }
    function isOwner(uid) { return isSigned() && request.auth.uid == uid; }
    /* masters */
    match /masters/{docId} {
      allow read:  if true;
      allow write: if false;
    }
    /* ──── users ─── */
    match /users/{userId} {
      allow read:  if true;
      allow write, create: if true;
      allow update: if isSigned() && request.auth.uid == userId
        && request.resource.data.diff(resource.data).changedKeys().hasOnly([
          'displayName', 'bio', 'photoURL', 'gender', 'birthday',
          'expoPushTokens', 'updatedAt',
        ]);
      // Functions専用
      match /xpLedger/{entryId} {
        allow read: if isSigned() && request.auth.uid == userId;
        allow write: if false;
      }
      match /friends/{friendId} {
        allow read:  if isSigned() && request.auth.uid == userId;
        allow write: if false;
      }

      match /friendRequests/{senderId} {
        function isSender()   { return isSigned() && request.auth.uid == senderId; }
        function isReceiver() { return isSigned() && request.auth.uid == userId; }
        allow create: if isSender() && userId != senderId;  // 自分宛以外へ送信
        allow read:   if isSender() || isReceiver();
        allow update: if isReceiver();                      // 受理/拒否
        allow delete: if isSender() || isReceiver();
      }
      match /eduAI_threads/{threadId} {
        allow read: if isSigned();
        allow create, update, delete: if isSigned();
        /* 最低限の型バリデーション（agent フィールドなど） */
        allow create, update: if isOwner(uid) && (
          !('agent' in request.resource.data) ||
          request.resource.data.agent == null ||
          request.resource.data.agent in ['tutor','counselor','planner']
        );

        /* ---- メッセージ ---- */
        match /messages/{messageId} {
          allow read: if isOwner(uid) || isSigned();
          allow create, update, delete: if isOwner(uid) || isSigned();

          /* 追加の型/長さチェック（必要十分のゆるさで） */
          allow create, update: if isOwner(uid)
            && (request.resource.data.role in ['user','assistant'])
            && (request.resource.data.content is string)
            && (request.resource.data.content.size() <= 8000)   // 8KB程度に制限
            && (!('tags' in request.resource.data) || (
                  request.resource.data.tags is list &&
                  request.resource.data.tags.size() <= 5         // タグは最大5個
               ))
            && (!('agent' in request.resource.data) || request.resource.data.agent in ['tutor','counselor','planner', null]);
        }
      }

    }
    // roomInvites：招待の可視/更新
    match /roomInvites/{inviteId} {
      allow read: if request.auth != null
        && (request.auth.uid == resource.data.receiverId
            || request.auth.uid == resource.data.senderId);
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth != null
        && request.auth.uid == resource.data.receiverId; // 承諾/辞退
    }
    /* ───── rooms ───── */
    match /rooms/{roomId} {
      allow create: if isSigned()
        && request.resource.data.hostUserId == request.auth.uid
        && request.resource.data.members is list
      allow read:  if isSigned();
      allow update: if isSigned() && (
        (isHost(roomId) &&
          request.resource.data.diff(resource.data).changedKeys().hasOnly([
            'segmentMode','segmentMinutes','segmentStartedAt','segmentIndex',
            'status','sessionForceEndedAt','updatedAt'
          ]))
         ||
         // 自分の既読フラグだけは本人が付けられる
        (request.resource.data.keys().hasOnly(['seenBy','updatedAt']) &&
         request.resource.data.seenBy[request.auth.uid] == true)
        );
      allow write: if isSigned();
      
      match /_settlements/{sid} {
        // ルームメンバーなら誰でも作成可
        allow create: if request.auth != null &&
        request.auth.uid in get(/databases/$(db)/documents/rooms/$(roomId)).data.members;
        allow read, update, delete: if false;
        }

      /* グループチャット：メンバーのみ */
      match /groupChats/{messageId} {
        allow read:   if isMember(roomId);
        allow create: if isMember(roomId);
        // 自分の発言のみ編集/削除（ログは userId=null 想定なので事実上編集不可）
        allow update, delete: if isMember(roomId)
          && request.auth.uid == resource.data.userId;
      }

      /* AIチャット */
      match /aiChats/{uid}/messages/{messageId} {
        // 自分の部屋・自分の aiChats だけ
        allow read:   if isMember(roomId) && request.auth.uid == uid;
        allow create: if isMember(roomId) && request.auth.uid == uid
          && request.resource.data.userId == request.auth.uid;
          // 自分のメッセージだけ編集/削除
        allow update, delete: if isMember(roomId) && request.auth.uid == uid
          && resource.data.userId == request.auth.uid;
      }
      match /presence/{uid} {
        allow read:  if isMember(roomId);
        allow write: if isMember(roomId) && request.auth.uid == uid;
          match /stays/{stayId} {
            allow read:  if isMember(roomId);
            allow write: if isMember(roomId) && request.auth.uid == uid;
          }
      }
      match /results/{docId} {
        allow read:  if isMember(roomId);
        allow write: if isMember(roomId);
      }
      match /tasks/{taskId} {
        allow read:  if isMember(roomId);
        allow write: if isMember(roomId);
      }
      // ランキングの並び（任意）：ホストのみが作成/更新可
      match /ranking/{docId} {
        allow read: if isSigned();
        allow write: if isSigned();
      }
      match /invites/{inviteId} {
        // 作成（RoomCreateForm から）
        allow create: if isSigned()
          && request.resource.data.fromUid == request.auth.uid
          && (
               (request.resource.data.toUids is list && request.resource.data.toUids.size() > 0)
               || (request.resource.data.toUid is string && request.resource.data.toUid.size() > 0)
             );
        // 読み取り：ホスト or 自分宛て
        allow read: if isSigned() && (
          isHost(roomId) ||
          (resource.data.toUid == request.auth.uid) ||
          (resource.data.toUids is list && request.auth.uid in resource.data.toUids)
        );
        // クライアントからの更新/削除は不可（通知済みフラグ等は Functions が実施）
        allow update, delete: if false;
      }
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}



## 📋 実装優先順位

### Phase 1: 基盤実装 🔥
- [ ] TypeScript型定義作成
- [ ] Firebase統合最適化  
- [ ] 基本認証フロー
- [ ] デフォルトユーザー作成

### Phase 2: UI実装 ⭐
- [ ] アカウント管理画面
- [ ] プロフィール編集
- [ ] 学習進捗表示
- [ ] 設定画面

### Phase 3: サブスク実装 💰
- [ ] 4980円プラン設計
- [ ] Stripe決済統合
- [ ] 請求管理機能
- [ ] プラン変更フロー

### Phase 4: 拡張機能 🚀
- [ ] 学習タイプ診断（今後）
- [ ] AIチャット機能拡張
- [ ] パーソナライズ機能

## 🧪 テスト要件

### 必須テスト項目
- Firebase認証フロー
- ユーザーデータ作成・更新
- サブスクリプション状態管理
- モバイル⇔Web データ整合性

## 📝 開発ガイドライン

### Claude Code使用時の注意点
1. この仕様書を常に参照する
2. 既存のモバイルアプリとの互換性を最優先
3. 段階的な実装を心がける
4. デザインシステムの一貫性を保つ

### ファイル構成規約
```
src/
├── app/                    # Next.js App Router
├── components/             # UIコンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   ├── auth/              # 認証関連
│   ├── account/           # アカウント管理
│   └── subscription/      # サブスク関連
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ・設定
├── types/                 # TypeScript型定義
└── data/                  # 静的データ・定数
```

---

**このファイルは開発進捗に応じて更新されます。Claude Codeでの実装時は必ずこの仕様を参照してください。**