'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { updateUserProfile, updateAuthProfile } from '@/lib/user'
import { User, Edit3, Save, X, Camera, Mail, Calendar, Users, Trophy, Coins, Zap } from 'lucide-react'
import { formatPrice, getPlanInfo } from '@/data/subscriptions'
import { LivalUser, Gender } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

export default function AccountPage() {
  const { user, userData, loading, refreshUserData } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    gender: '' as Gender | '',
    birthday: ''
  })

  useEffect(() => {
    if (userData) {
      setEditForm({
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        gender: userData.gender || '',
        birthday: userData.birthday ? userData.birthday.toDate().toISOString().split('T')[0] : ''
      })
    }
  }, [userData])

  const handleSave = async () => {
    if (!user || !userData) return
    
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Firebase Authenticationのプロフィール更新
      if (editForm.displayName !== user.displayName) {
        await updateAuthProfile(user, { displayName: editForm.displayName })
      }

      // Firestoreのユーザーデータ更新
      const updates: Partial<LivalUser> = {
        displayName: editForm.displayName,
        bio: editForm.bio,
        gender: editForm.gender as Gender || null,
        birthday: editForm.birthday ? new Date(editForm.birthday) as unknown as Timestamp : null
      }

      await updateUserProfile(user.uid, updates)
      await refreshUserData()
      
      setEditing(false)
      setSuccess('プロフィールを更新しました')
    } catch (error) {
      console.error('Profile update error:', error)
      setError('プロフィールの更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (userData) {
      setEditForm({
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        gender: userData.gender || '',
        birthday: userData.birthday ? userData.birthday.toDate().toISOString().split('T')[0] : ''
      })
    }
    setEditing(false)
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            ログインページへ
          </Link>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ユーザー情報を読み込み中...</p>
          <p className="text-sm text-gray-500 mt-2">
            しばらく待ってもアクセスできない場合は、
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 underline ml-1"
            >
              ページを再読み込み
            </button>
            してください
          </p>
        </div>
      </div>
    )
  }

  const planInfo = getPlanInfo(userData.subscription.plan)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">アカウント管理</h1>
          <p className="text-gray-600 mt-2">プロフィール情報とサブスクリプションの管理</p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600"
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">プロフィール情報</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>編集</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? '保存中...' : '保存'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>キャンセル</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      {userData.photoURL ? (
                        <Image src={userData.photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" width={80} height={80} />
                      ) : (
                        <User className="w-10 h-10 text-white" />
                      )}
                    </div>
                    {editing && (
                      <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <Camera className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{userData.displayName}</h3>
                    <p className="text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">表示名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="表示名を入力"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.displayName || '未設定'}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">自己紹介</label>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="自己紹介を入力"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.bio || '未設定'}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
                  {editing ? (
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as Gender | '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {userData.gender === 'male' ? '男性' : userData.gender === 'female' ? '女性' : '未設定'}
                    </p>
                  )}
                </div>

                {/* Birthday */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
                  {editing ? (
                    <input
                      type="date"
                      value={editForm.birthday}
                      onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {userData.birthday ? userData.birthday.toDate().toLocaleDateString('ja-JP') : '未設定'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">サブスクリプション</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">現在のプラン</span>
                  <span className="font-medium text-gray-900">{planInfo?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">料金</span>
                  <span className="font-medium text-gray-900">{formatPrice(planInfo?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">状態</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userData.subscription.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                </div>
              </div>
              
              {userData.subscription.plan === 'free_web' && (
                <Link
                  href="/subscription"
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors text-center block"
                >
                  プレミアムにアップグレード
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">学習ステータス</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">レベル</p>
                    <p className="font-semibold text-gray-900">{userData.level}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">経験値</p>
                    <p className="font-semibold text-gray-900">{userData.xp} XP</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">コイン</p>
                    <p className="font-semibold text-gray-900">{userData.coins}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">学習セッション</p>
                    <p className="font-semibold text-gray-900">{userData.individualSessionCount + userData.groupSessionCount}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}