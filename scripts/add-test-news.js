/**
 * テスト用お知らせデータをFirestoreに追加するスクリプト
 *
 * 使い方:
 * node scripts/add-test-news.js
 */

const admin = require('firebase-admin');

// Firebase Admin SDKの初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'lival-app'
  });
}

const db = admin.firestore();

/**
 * テスト用お知らせデータ
 */
const testNewsData = [
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
    priority: 'normal',
    type: 'maintenance',
    status: 'published',
  },
  {
    title: '【下書き】準備中のお知らせ',
    content: `
      <p>これは下書き状態のお知らせです。</p>
      <p>公開前の内容を確認できます。</p>
    `,
    priority: 'low',
    type: 'general',
    status: 'draft',
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

/**
 * お知らせを追加する関数
 */
async function addTestNews() {
  console.log('\n📢 テスト用お知らせデータを追加します...\n');

  try {
    for (let i = 0; i < testNewsData.length; i++) {
      const newsItem = testNewsData[i];
      console.log(`[${i + 1}/${testNewsData.length}] 追加中: ${newsItem.title}`);

      const newsRef = db.collection('news').doc();
      const now = admin.firestore.Timestamp.now();

      // 抜粋を生成
      const excerpt = newsItem.content
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 150) + '...';

      const news = {
        title: newsItem.title,
        content: newsItem.content,
        excerpt: excerpt,
        priority: newsItem.priority,
        type: newsItem.type,
        status: newsItem.status,
        authorId: 'admin',
        authorName: 'LIVAL AI運営チーム',
        publishedAt: newsItem.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
        viewCount: 0
      };

      await newsRef.set(news);
      console.log(`✅ 追加完了: ${newsRef.id}`);
    }

    console.log('\n✅ すべてのテストデータを追加しました！');
    console.log('\n📋 追加されたお知らせ:');
    console.log(`  - 公開中: ${testNewsData.filter(n => n.status === 'published').length}件`);
    console.log(`  - 下書き: ${testNewsData.filter(n => n.status === 'draft').length}件`);
    console.log('\n🌐 確認: http://localhost:3000/admin/news');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  addTestNews()
    .then(() => {
      console.log('\n🎉 処理が完了しました！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ エラー:', error);
      process.exit(1);
    });
}

module.exports = { addTestNews };
