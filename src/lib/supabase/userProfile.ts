import { supabase } from './supabaseClient'

// ユーザープロファイルの型定義
export interface UserProfile {
  uid: string
  deviation_score: number
  display_name?: string | null
  grade?: string | null
  diag_rslt?: string | null
  diag_rslt_desc?: string | null
  target_universities?: string | null
  career_interests?: string | null
  avg_study_min?: number | null
  prefers_video?: boolean
  prefers_text?: boolean
  recency_mark?: string | null
  created_at: string
  updated_at: string
}

// プロファイル作成用の型（作成時に不要なフィールドを除外）
export interface CreateUserProfileData {
  uid: string
  deviation_score?: number
  display_name?: string
  grade?: string
  diag_rslt?: string
  diag_rslt_desc?: string
  target_universities?: string
  career_interests?: string
  avg_study_min?: number
  prefers_video?: boolean
  prefers_text?: boolean
  recency_mark?: string
}

// プロファイル更新用の型
export interface UpdateUserProfileData {
  display_name?: string
  grade?: string
  diag_rslt?: string
  diag_rslt_desc?: string
  target_universities?: string
  career_interests?: string
  avg_study_min?: number
  prefers_video?: boolean
  prefers_text?: boolean
  recency_mark?: string
  updated_at?: string
}

/**
 * ユーザープロファイルを作成または更新
 */
export async function upsertUserProfile(profileData: CreateUserProfileData): Promise<UserProfile | null> {
  try {
    console.log('🔄 Upserting user profile:', profileData)
    
    const dataToInsert = {
      ...profileData,
      deviation_score: profileData.deviation_score || 50, // デフォルト値
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(dataToInsert, {
        onConflict: 'uid'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error upserting user profile:', error)
      throw error
    }

    console.log('✅ User profile upserted successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to upsert user profile:', error)
    return null
  }
}

/**
 * ユーザープロファイルを取得
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    console.log('🔍 Getting user profile for:', uid)
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('uid', uid)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // プロファイルが見つからない場合
        console.log('📄 No profile found for user:', uid)
        return null
      }
      console.error('❌ Error getting user profile:', error)
      throw error
    }

    console.log('✅ User profile retrieved:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to get user profile:', error)
    return null
  }
}

/**
 * ユーザープロファイルを更新
 */
export async function updateUserProfile(uid: string, updates: UpdateUserProfileData): Promise<UserProfile | null> {
  try {
    console.log('🔄 Updating user profile:', uid, updates)
    
    const dataToUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(dataToUpdate)
      .eq('uid', uid)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating user profile:', error)
      throw error
    }

    console.log('✅ User profile updated successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Failed to update user profile:', error)
    return null
  }
}

/**
 * ユーザープロファイルを削除
 */
export async function deleteUserProfile(uid: string): Promise<boolean> {
  try {
    console.log('🗑️ Deleting user profile:', uid)
    
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('uid', uid)

    if (error) {
      console.error('❌ Error deleting user profile:', error)
      throw error
    }

    console.log('✅ User profile deleted successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to delete user profile:', error)
    return false
  }
}

/**
 * プロファイルの完成度をチェック
 */
export function checkProfileCompleteness(profile: UserProfile | null): {
  isComplete: boolean
  completionPercentage: number
  missingFields: string[]
} {
  if (!profile) {
    return {
      isComplete: false,
      completionPercentage: 0,
      missingFields: ['display_name', 'grade', 'target_universities', 'career_interests', 'avg_study_min', 'recency_mark']
    }
  }

  const optionalFields = [
    'display_name',
    'grade', 
    'target_universities',
    'career_interests',
    'avg_study_min',
    'recency_mark'
  ]

  const completedFields = optionalFields.filter(field => {
    const value = profile[field as keyof UserProfile]
    return value !== null && value !== undefined && value !== ''
  })

  const missingFields = optionalFields.filter(field => {
    const value = profile[field as keyof UserProfile]
    return value === null || value === undefined || value === ''
  })

  const completionPercentage = Math.round((completedFields.length / optionalFields.length) * 100)
  const isComplete = completionPercentage >= 70 // 70%以上で完成とみなす

  return {
    isComplete,
    completionPercentage,
    missingFields
  }
}

/**
 * プロファイルの統計を取得（管理者向け）
 */
export async function getProfileStats(): Promise<{
  totalProfiles: number
  completedProfiles: number
  averageCompletionRate: number
} | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')

    if (error) {
      console.error('❌ Error getting profile stats:', error)
      return null
    }

    const totalProfiles = data.length
    let totalCompletionRate = 0
    let completedProfiles = 0

    data.forEach(profile => {
      const { isComplete, completionPercentage } = checkProfileCompleteness(profile)
      totalCompletionRate += completionPercentage
      if (isComplete) completedProfiles++
    })

    const averageCompletionRate = totalProfiles > 0 ? totalCompletionRate / totalProfiles : 0

    return {
      totalProfiles,
      completedProfiles,
      averageCompletionRate: Math.round(averageCompletionRate)
    }
  } catch (error) {
    console.error('❌ Failed to get profile stats:', error)
    return null
  }
}