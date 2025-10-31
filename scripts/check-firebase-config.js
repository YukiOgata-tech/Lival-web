/**
 * Firebase設定診断スクリプト
 * 環境変数が正しく設定されているか確認します
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Firebase設定診断\n');
console.log('='.repeat(50));

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let allValid = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';

  if (isSet) {
    // 最初の4文字と最後の4文字だけ表示（セキュリティ対策）
    const masked = value.length > 8
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '****';
    console.log(`${status} ${varName}: ${masked}`);
  } else {
    console.log(`${status} ${varName}: 未設定`);
    allValid = false;
  }
});

console.log('='.repeat(50));

if (allValid) {
  console.log('\n✅ すべての必須環境変数が設定されています');
  console.log('\n📋 プロジェクトID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('🌐 Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
} else {
  console.log('\n❌ 一部の環境変数が設定されていません');
  console.log('\n📝 .env.local ファイルを確認してください');
}

console.log('\n');
