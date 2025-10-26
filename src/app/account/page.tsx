'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { updateUserProfile, updateAuthProfile } from '@/lib/user'
import { User, Edit3, Save, X, Camera, Mail, Calendar, Users, Trophy, Coins, Zap } from 'lucide-react'
import { formatPrice, getPlanInfo } from '@/data/subscriptions'
import { LivalUser, Gender } from '@/types'
import { Timestamp } from 'firebase/firestore'
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
    <div className="min-h-screen bg-gray-50 py-3 sm:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">アカウント管理</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">プロフィール情報とサブスクリプションの管理</p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600"
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">プロフィール情報</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center space-x-2 px-5 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-base font-medium"
                  >
                    <Edit3 className="w-5 h-5" />
                    <span>編集</span>
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-base font-medium min-h-[44px]"
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? '保存中...' : '保存'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-base font-medium min-h-[44px]"
                    >
                      <X className="w-5 h-5" />
                      <span>キャンセル</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Profile Image */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      {userData.photoURL ? (
                        <Image src={userData.photoURL} alt="Profile" className="w-20 h-20 sm:w-16 sm:h-16 rounded-full object-cover" width={80} height={80} />
                      ) : (
                        <User className="w-10 h-10 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                    {editing && (
                      <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{userData.displayName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1">
                      <Mail className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="break-all">{userData.email}</span>
                    </p>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">表示名</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                      placeholder="表示名を入力"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900">{userData.displayName || '未設定'}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">自己紹介</label>
                  {editing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400"
                      placeholder="自己紹介を入力"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-gray-900 leading-relaxed">{userData.bio || '未設定'}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
                  {editing ? (
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as Gender | '' })}
                      className="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="male">男性</option>
                      <option value="female">女性</option>
                    </select>
                  ) : (
                    <p className="text-base text-gray-900">
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
                      className="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-base text-gray-900 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      {userData.birthday ? userData.birthday.toDate().toLocaleDateString('ja-JP') : '未設定'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4">
            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">サブスクリプション</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">現在のプラン</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{planInfo?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">料金</span>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">{formatPrice(planInfo?.price || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">状態</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    userData.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userData.subscription.status === 'active' ? 'アクティブ' : '非アクティブ'}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <Link
                  href="/account/subscription"
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors text-center block min-h-[44px] flex items-center justify-center"
                >
                  サブスクリプション管理
                </Link>
                {userData.subscription.plan === 'free_web' && (
                  <Link
                    href="/pricing"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors text-center block min-h-[44px] flex items-center justify-center"
                  >
                    有料プランを始める
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">学習ステータス</h3>
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">レベル</p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">{userData.level}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">経験値</p>
                    <p className="text-lg font-bold text-gray-900">{userData.xp} XP</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Coins className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">コイン</p>
                    <p className="text-lg font-bold text-gray-900">{userData.coins}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">学習セッション</p>
                    <p className="text-lg font-bold text-gray-900">{userData.individualSessionCount + userData.groupSessionCount}</p>
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