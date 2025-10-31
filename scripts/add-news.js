/**
 * Firestoreにお知らせを直接追加するスクリプト
 *
 * 使い方:
 * node scripts/add-news.js
 */

const admin = require('firebase-admin');

// Firebase Admin SDKの初期化
// 環境変数からFirebase設定を読み込む
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'lival-app'
  });
}

const db = admin.firestore();

/**
 * お知らせを追加する関数
 */
async function addNews(newsData) {
  try {
    const newsRef = db.collection('news').doc();

    const news = {
      title: newsData.title,
      content: newsData.content,
      excerpt: newsData.excerpt || generateExcerpt(newsData.content),
      priority: newsData.priority || 'normal',
      type: newsData.type || 'general',
      status: newsData.status || 'published',
      authorId: newsData.authorId || 'admin',
      authorName: newsData.authorName || 'LIVAL AI運営チーム',
      publishedAt: newsData.status === 'published' ? admin.firestore.Timestamp.now() : null,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      viewCount: 0
    };

    await newsRef.set(news);
    console.log('✅ お知らせを追加しました！');
    console.log('📄 ドキュメントID:', newsRef.id);
    console.log('📝 タイトル:', news.title);
    console.log('🔗 URL: https://console.firebase.google.com/project/lival-app/firestore/data/news/' + newsRef.id);

    return newsRef.id;
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  }
}

/**
 * コンテンツから抜粋を生成
 */
function generateExcerpt(content, maxLength = 150) {
  const text = content.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * 複数のお知らせを一括追加
 */
async function addMultipleNews(newsArray) {
  console.log(`📢 ${newsArray.length}件のお知らせを追加します...\n`);

  for (let i = 0; i < newsArray.length; i++) {
    console.log(`[${i + 1}/${newsArray.length}] 追加中...`);
    await addNews(newsArray[i]);
    console.log('');
  }

  console.log('✅ すべてのお知らせを追加しました！');
}

// ==========================================
// ここにお知らせデータを記述
// ==========================================

const newsData = [
  {
    title: '【重要】新機能リリースのお知らせ',
    content: `
      <h2>学習記録機能を追加しました</h2>
      <p>本日より、学習記録機能が利用可能になりました。</p>
      <ul>
        <li>学習時間の記録</li>
        <li>書籍情報の管理</li>
        <li>学習統計の表示</li>
      </ul>
      <p>ぜひご活用ください。</p>
    `,
    priority: 'high',
    type: 'feature',
    status: 'published',
  },
  {
    title: 'システムメンテナンスのお知らせ',
    content: `
      <p>下記日時にシステムメンテナンスを実施いたします。</p>
      <p><strong>日時:</strong> 2025年2月1日（土）2:00〜4:00</p>
      <p>メンテナンス中はサービスをご利用いただけません。</p>
      <p>ご不便をおかけしますが、ご理解のほどよろしくお願いいたします。</p>
    `,
    priority: 'urgent',
    type: 'maintenance',
    status: 'published',
  },
  {
    title: 'プレミアムプラン提供開始',
    content: `
      <h2>プレミアムプランの提供を開始しました</h2>
      <p>より多くの機能をご利用いただけるプレミアムプランの提供を開始しました。</p>
      <h3>プレミアムプランの特典</h3>
      <ul>
        <li>AIサービス全機能利用可能</li>
        <li>モバイルアプリ対応</li>
        <li>無制限学習サポート</li>
        <li>専用AIコーチング</li>
      </ul>
      <p>詳細は料金ページをご確認ください。</p>
    `,
    priority: 'normal',
    type: 'general',
    status: 'published',
  }
];

// ==========================================
// スクリプト実行
// ==========================================

if (require.main === module) {
  addMultipleNews(newsData)
    .then(() => {
      console.log('\n🎉 処理が完了しました！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ エラーが発生しました:', error);
      process.exit(1);
    });
}

module.exports = { addNews, addMultipleNews };
