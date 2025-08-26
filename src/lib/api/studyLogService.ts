// src/lib/api/studyLogService.ts
import { createClient } from '../supabase/supabaseClient';
import { StudyLog, StudyLogInput, StudyStats } from '../../types/study';

const supabase = createClient();

// Supabase接続テスト関数
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    // まず基本的な接続テスト
    const { data, error } = await supabase
      .from('study_logs')
      .select('id, created_at, user_id')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection test failed:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        errorCode: error?.code
      });
      return false;
    }
    console.log('Supabase connection test successful, data:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

// テーブル存在確認関数（シンプルな直接アクセス）
export async function checkTableExists(): Promise<boolean> {
  try {
    // study_logsテーブルに直接アクセスして存在確認
    const { data, error } = await supabase
      .from('study_logs')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Table existence check failed:', {
        error,
        errorMessage: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details
      });
      return false;
    }
    
    console.log('Table exists - study_logs accessible');
    return true;
  } catch (error) {
    console.error('Table check error:', error);
    return false;
  }
}

/**
 * 学習記録を作成
 */
export async function createStudyLog(
  userId: string, 
  input: StudyLogInput
): Promise<StudyLog | null> {
  try {
    console.log('Creating study log for user:', userId);
    console.log('Study log input:', input);
    
    const { data, error } = await supabase
      .from('study_logs')
      .insert({
        user_id: userId,
        book_isbn: input.book_isbn || null,
        manual_book_title: input.manual_book_title || null,
        duration_minutes: input.duration_minutes,
        memo: input.memo || null,
        studied_at: input.studied_at,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        book:books(*)
      `)
      .single();

    if (error) {
      console.error('Error creating study log:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        errorCode: error?.code
      });
      return null;
    }

    return data as StudyLog;
  } catch (error) {
    console.error('Error creating study log:', error);
    return null;
  }
}

/**
 * ユーザーの学習記録一覧を取得
 */
export async function getStudyLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<StudyLog[]> {
  try {
    console.log('Fetching study logs for user:', userId);
    console.log('Query params:', { limit, offset });
    
    // Supabase認証状態を確認
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('Supabase session:', sessionData);
    
    const { data, error } = await supabase
      .from('study_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', userId)
      .order('studied_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching study logs:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      });
      return [];
    }

    return data as StudyLog[];
  } catch (error) {
    console.error('Error fetching study logs:', error);
    return [];
  }
}

/**
 * 特定の学習記録を取得
 */
export async function getStudyLog(
  userId: string, 
  logId: number
): Promise<StudyLog | null> {
  try {
    const { data, error } = await supabase
      .from('study_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', userId)
      .eq('id', logId)
      .single();

    if (error) {
      console.error('Error fetching study log:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      });
      return null;
    }

    return data as StudyLog;
  } catch (error) {
    console.error('Error fetching study log:', error);
    return null;
  }
}

/**
 * 学習記録を更新
 */
export async function updateStudyLog(
  userId: string,
  logId: number,
  input: StudyLogInput
): Promise<StudyLog | null> {
  try {
    const { data, error } = await supabase
      .from('study_logs')
      .update({
        book_isbn: input.book_isbn || null,
        manual_book_title: input.manual_book_title || null,
        duration_minutes: input.duration_minutes,
        memo: input.memo || null,
        studied_at: input.studied_at
      })
      .eq('user_id', userId)
      .eq('id', logId)
      .select(`
        *,
        book:books(*)
      `)
      .single();

    if (error) {
      console.error('Error updating study log:', error);
      return null;
    }

    return data as StudyLog;
  } catch (error) {
    console.error('Error updating study log:', error);
    return null;
  }
}

/**
 * 学習記録を削除
 */
export async function deleteStudyLog(
  userId: string, 
  logId: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('study_logs')
      .delete()
      .eq('user_id', userId)
      .eq('id', logId);

    if (error) {
      console.error('Error deleting study log:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting study log:', error);
    return false;
  }
}

/**
 * ユーザーの学習統計を取得
 */
export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    console.log('Getting study stats for user:', userId);
    console.log('Supabase client config:', {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey ? 'Present' : 'Missing'
    });

    // まず簡単なテーブルアクセステスト
    const { count, error: countError } = await supabase
      .from('study_logs')
      .select('*', { count: 'exact', head: true });
      
    console.log('Table access test:', {
      count,
      countError: countError ? {
        message: countError.message,
        code: countError.code,
        details: countError.details
      } : null
    });

    // 基本統計を取得
    const { data: logs, error } = await supabase
      .from('study_logs')
      .select('duration_minutes, studied_at')
      .eq('user_id', userId)
      .order('studied_at', { ascending: false });

    if (error || !logs) {
      console.error('Error fetching study stats:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        errorCode: error?.code,
        logs,
        userId,
        query: 'SELECT duration_minutes, studied_at FROM study_logs WHERE user_id = ? ORDER BY studied_at DESC'
      });
      return {
        totalMinutes: 0,
        totalSessions: 0,
        averageMinutesPerDay: 0,
        currentStreak: 0,
        longestStreak: 0,
        recentStudyLogs: []
      };
    }

    // 基本統計計算
    const totalMinutes = logs.reduce((sum, log) => sum + log.duration_minutes, 0);
    const totalSessions = logs.length;

    // 日別の学習データを作成
    const dailyStudy = new Map<string, number>();
    logs.forEach(log => {
      const date = new Date(log.studied_at).toDateString();
      dailyStudy.set(date, (dailyStudy.get(date) || 0) + log.duration_minutes);
    });

    // 平均学習時間（過去30日）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = logs.filter(log => new Date(log.studied_at) >= thirtyDaysAgo);
    const averageMinutesPerDay = recentLogs.length > 0 
      ? Math.round(recentLogs.reduce((sum, log) => sum + log.duration_minutes, 0) / 30)
      : 0;

    // 連続学習日数を計算
    const sortedDates = Array.from(dailyStudy.keys())
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (date.getTime() === expectedDate.getTime()) {
        tempStreak++;
        if (i === 0 || currentStreak === i) {
          currentStreak = tempStreak;
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
        if (i === 0) currentStreak = 0;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }

    // 最近の学習記録を取得
    const { data: recentStudyLogsData, error: recentError } = await supabase
      .from('study_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', userId)
      .order('studied_at', { ascending: false })
      .limit(10);

    const recentStudyLogs = recentError ? [] : (recentStudyLogsData as StudyLog[]);

    return {
      totalMinutes,
      totalSessions,
      averageMinutesPerDay,
      currentStreak,
      longestStreak,
      recentStudyLogs
    };
  } catch (error) {
    console.error('Error calculating study stats:', error);
    return {
      totalMinutes: 0,
      totalSessions: 0,
      averageMinutesPerDay: 0,
      currentStreak: 0,
      longestStreak: 0,
      recentStudyLogs: []
    };
  }
}

/**
 * 日別の学習記録を取得
 */
export async function getDailyStudyLogs(
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<StudyLog[]> {
  try {
    const { data, error } = await supabase
      .from('study_logs')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', userId)
      .gte('studied_at', startDate)
      .lte('studied_at', endDate)
      .order('studied_at', { ascending: false });

    if (error) {
      console.error('Error fetching daily study logs:', error);
      return [];
    }

    return data as StudyLog[];
  } catch (error) {
    console.error('Error fetching daily study logs:', error);
    return [];
  }
}