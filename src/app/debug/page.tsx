'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getUserData, createUserInFirestore } from '@/lib/user'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function DebugPage() {
  const { user, userData, loading } = useAuth()
  const [testResult, setTestResult] = useState('')
  const [isTestRunning, setIsTestRunning] = useState(false)

  const runFirestoreTest = async () => {
    setIsTestRunning(true)
    setTestResult('テスト開始...\n')
    
    try {
      // 1. Firestore接続テスト
      setTestResult(prev => prev + '1. Firestore接続をテスト中...\n')
      const testDocRef = doc(db, 'test', 'connection')
      await setDoc(testDocRef, { 
        timestamp: serverTimestamp(),
        test: 'connection' 
      })
      setTestResult(prev => prev + '✅ Firestore接続成功\n')

      // 2. ユーザー認証状態の確認
      setTestResult(prev => prev + '\n2. 認証状態を確認中...\n')
      if (user) {
        setTestResult(prev => prev + `✅ ユーザー認証済み: ${user.uid}\n`)
        setTestResult(prev => prev + `📧 Email: ${user.email}\n`)
        setTestResult(prev => prev + `👤 Display Name: ${user.displayName}\n`)
        
        // 3. ユーザーデータの確認
        setTestResult(prev => prev + '\n3. ユーザーデータを確認中...\n')
        const userData = await getUserData(user.uid)
        if (userData) {
          setTestResult(prev => prev + '✅ ユーザーデータ取得成功\n')
          setTestResult(prev => prev + `📋 Data: ${JSON.stringify({
            email: userData.email,
            displayName: userData.displayName,
            subscription: userData.subscription?.plan,
            webProfile: !!userData.webProfile
          }, null, 2)}\n`)
        } else {
          setTestResult(prev => prev + '❌ ユーザーデータが見つかりません\n')
          
          // 4. ユーザーデータの作成試行
          setTestResult(prev => prev + '\n4. ユーザーデータを作成中...\n')
          await createUserInFirestore(user)
          setTestResult(prev => prev + '✅ ユーザーデータ作成完了\n')
          
          // 5. 再度データ取得を試行
          const newUserData = await getUserData(user.uid)
          if (newUserData) {
            setTestResult(prev => prev + '✅ 新しいユーザーデータ取得成功\n')
          } else {
            setTestResult(prev => prev + '❌ ユーザーデータ作成後も取得できません\n')
          }
        }
      } else {
        setTestResult(prev => prev + '❌ ユーザーが認証されていません\n')
      }
      
      setTestResult(prev => prev + '\n🎉 テスト完了\n')
    } catch (error) {
      setTestResult(prev => prev + `\n🚨 エラー発生: ${error}\n`)
      console.error('Test error:', error)
    } finally {
      setIsTestRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Firebase デバッグ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 現在の状態 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">現在の状態</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>認証状態:</span>
                <span className={loading ? 'text-yellow-600' : user ? 'text-green-600' : 'text-red-600'}>
                  {loading ? '読み込み中' : user ? '認証済み' : '未認証'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ユーザーデータ:</span>
                <span className={userData ? 'text-green-600' : 'text-red-600'}>
                  {userData ? '取得済み' : '未取得'}
                </span>
              </div>
              {user && (
                <>
                  <div className="text-sm text-gray-600 mt-4">
                    <p><strong>UID:</strong> {user.uid}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Display Name:</strong> {user.displayName}</p>
                  </div>
                </>
              )}
              {userData && (
                <div className="text-sm text-gray-600 mt-4">
                  <p><strong>Subscription:</strong> {userData.subscription?.plan}</p>
                  <p><strong>Web Profile:</strong> {userData.webProfile ? 'あり' : 'なし'}</p>
                </div>
              )}
            </div>
          </div>

          {/* テストボタン */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Firestore テスト</h2>
            <button
              onClick={runFirestoreTest}
              disabled={isTestRunning}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isTestRunning ? 'テスト実行中...' : 'Firestore接続テストを実行'}
            </button>
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">テスト結果:</h3>
                <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
                  {testResult}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 環境変数チェック */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Firebase 設定確認</h2>
          <div className="text-sm space-y-1">
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '設定済み' : '❌ 未設定'}</p>
            <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '設定済み' : '❌ 未設定'}</p>
            <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '設定済み' : '❌ 未設定'}</p>
            <p><strong>Storage Bucket:</strong> {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '設定済み' : '❌ 未設定'}</p>
            <p><strong>Messaging Sender ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '設定済み' : '❌ 未設定'}</p>
            <p><strong>App ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '設定済み' : '❌ 未設定'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}