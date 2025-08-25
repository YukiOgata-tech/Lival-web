import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export interface InitializeUserRequest {
  platform?: 'web' | 'mobile';
}

export interface UserSubscription {
  plan: 'free_web' | 'free' | 'premium';
  status: 'active' | 'canceled' | 'past_due' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface InitializeUserResponse {
  success: boolean;
  message: string;
  userData?: {
    displayName: string;
    role: string;
    subscription: UserSubscription;
    coins: number;
    xp: number;
    level: number;
  };
}

/**
 * ユーザー初期化関数を呼び出し（Web・Mobile共通）
 * アカウント作成時にユーザーデータベースに必要な初期データを設定
 */
export const initializeUserData = async (
  data: InitializeUserRequest = { platform: 'web' }
): Promise<InitializeUserResponse> => {
  const initializeUser = httpsCallable<InitializeUserRequest, InitializeUserResponse>(
    functions,
    'initializeUserData'
  );

  try {
    const result = await initializeUser(data);
    return result.data;
  } catch (error) {
    console.error('Failed to initialize user data:', error);
    throw new Error('ユーザーデータの初期化に失敗しました');
  }
};

/**
 * 認証後のユーザー初期化処理
 * サインアップ完了時に自動実行される想定
 */
export const handleUserSignup = async (): Promise<InitializeUserResponse> => {
  try {
    const result = await initializeUserData({ platform: 'web' });
    
    if (result.success) {
      console.log('User initialized successfully:', result.userData);
    }
    
    return result;
  } catch (error) {
    console.error('User signup initialization failed:', error);
    throw error;
  }
};