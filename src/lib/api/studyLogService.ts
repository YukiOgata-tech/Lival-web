// src/lib/api/studyLogService.ts
import { supabase } from '../supabase/supabaseClient';
import { StudyLog, StudyLogInput, StudyStats, PopularBook, UserBookStat, BookUsageStats, VideoUsageStats } from '../../types/study';

const sanitizeNullable = (s?: string | null) => {
  const t = (s ?? '').trim()
  return t.length ? t : null
}

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
    const { error } = await supabase
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

/** 学習記録を作成 */
export async function createStudyLog(
  userId: string,
  input: StudyLogInput
): Promise<StudyLog | null> {
  try {
    // 事前バリデーション
    const hasBook = Boolean(input.book_id)
    const manualTitle = sanitizeNullable(input.manual_book_title)
    const hasVideo = Boolean(input.video_id)
    const manualVideoTitle = sanitizeNullable(input.manual_video_title)
    const isFree = Boolean(input.free_mode)

    if (!isFree && !hasBook && !manualTitle && !hasVideo && !manualVideoTitle) {
      console.error('Validation failed: either book_id, manual_book_title, video_id, manual_video_title, or free_mode is required.')
      return null
    }

    // 学習記録を作成
    const { data, error } = await supabase
      .from('study_logs')
      .insert({
        user_id: userId,
        book_id: hasBook ? input.book_id! : null,
        manual_book_title: manualTitle,
        video_id: hasVideo ? input.video_id! : null,
        manual_video_title: manualVideoTitle,
        duration_minutes: input.duration_minutes,
        memo: sanitizeNullable(input.memo),
        studied_at: input.studied_at,
        free_mode: isFree,
        created_at: new Date().toISOString(),
      })
      .select(`*, book:books(*), video:videos(*)`)
      .single();

    if (error) {
      console.error('Error creating study log:', error);
      return null;
    }

    // 書籍利用統計を更新（book_idがある場合）
    if (hasBook && input.book_id) {
      await updateBookUsageStats(userId, input.book_id, input.duration_minutes, input.studied_at);
      await updateBookGlobalStats(input.book_id, input.duration_minutes);
    }

    // 動画利用統計を更新（video_idがある場合）
    if (hasVideo && input.video_id) {
      await updateVideoUsageStats(userId, input.video_id, input.duration_minutes, input.studied_at);
      await updateVideoGlobalStats(input.video_id, input.duration_minutes);
    }

    return data as StudyLog;
  } catch (e) {
    console.error('Error creating study log:', e);
    return null;
  }
}

export async function getStudyLogs(
  userId: string,
  limit = 50,
  offset = 0
): Promise<StudyLog[]> {
  try {
    const { data, error } = await supabase
      .from('study_logs')
      .select(`*, book:books(*), video:videos(*)`)
      .eq('user_id', userId)
      .order('studied_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching study logs:', error);
      return [];
    }
    return data as StudyLog[];
  } catch (e) {
    console.error('Error fetching study logs:', e);
    return [];
  }
}

/** 特定の学習記録を取得 */
export async function getStudyLog(
  userId: string,
  logId: number
): Promise<StudyLog | null> {
  try {
    const { data, error } = await supabase
      .from('study_logs')
      .select(`*, book:books(*), video:videos(*)`)
      .eq('user_id', userId)
      .eq('id', logId)
      .single();

    if (error) {
      console.error('Error fetching study log:', error);
      return null;
    }
    return data as StudyLog;
  } catch (e) {
    console.error('Error fetching study log:', e);
    return null;
  }
}

/** 学習記録を更新 */
export async function updateStudyLog(
  userId: string,
  logId: number,
  input: StudyLogInput
): Promise<StudyLog | null> {
  try {
    const hasBook = Boolean(input.book_id)
    const manualTitle = sanitizeNullable(input.manual_book_title)
    const hasVideo = Boolean(input.video_id)
    const manualVideoTitle = sanitizeNullable(input.manual_video_title)
    const isFree = Boolean(input.free_mode)

    if (!isFree && !hasBook && !manualTitle && !hasVideo && !manualVideoTitle) {
      console.error('Validation failed: either book_id, manual_book_title, video_id, manual_video_title, or free_mode is required.')
      return null
    }

    const { data, error } = await supabase
      .from('study_logs')
      .update({
        book_id: hasBook ? input.book_id! : null,
        manual_book_title: manualTitle,
        video_id: hasVideo ? input.video_id! : null,
        manual_video_title: manualVideoTitle,
        duration_minutes: input.duration_minutes,
        memo: sanitizeNullable(input.memo),
        free_mode: isFree,
        studied_at: input.studied_at
      })
      .eq('user_id', userId)
      .eq('id', logId)
      .select(`*, book:books(*), video:videos(*)`)
      .single();

    if (error) {
      console.error('Error updating study log:', error);
      return null;
    }
    return data as StudyLog;
  } catch (e) {
    console.error('Error updating study log:', e);
    return null;
  }
}

/** 学習記録を削除 */
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
  } catch (e) {
    console.error('Error deleting study log:', e);
    return false;
  }
}

/** ユーザーの学習統計を取得 */
export async function getStudyStats(userId: string): Promise<StudyStats> {
  try {
    console.log('Getting study stats for user:', userId);
    

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
        book:books(*),
        video:videos(*)
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

/** 日別の学習記録を取得 */
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
        book:books(*),
        video:videos(*)
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

/** 人気書籍ランキングを取得 */
export async function getPopularBooks(limit = 10): Promise<PopularBook[]> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        id,
        isbn,
        title,
        author,
        company,
        cover_image_url,
        created_at,
        usage_count_global,
        total_minutes_global
      `)
      .not('usage_count_global', 'is', null)
      .gt('usage_count_global', 0)
      .order('usage_count_global', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular books:', error);
      return [];
    }

    // ランキングと平均時間を計算
    const popularBooks: PopularBook[] = data.map((book, index) => ({
      ...book,
      rank: index + 1,
      usage_count_global: book.usage_count_global || 0,
      total_minutes_global: book.total_minutes_global || 0,
      avg_minutes_per_session: book.usage_count_global > 0 
        ? Math.round((book.total_minutes_global || 0) / book.usage_count_global * 10) / 10
        : 0
    }));

    return popularBooks;
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
}

/** ユーザー個別の書籍使用統計を取得 */
export async function getUserBookStats(userId: string): Promise<UserBookStat[]> {
  try {
    // user_profilesからbook_usage_statsを取得
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('book_usage_stats')
      .eq('uid', userId)
      .single();

    if (profileError || !profileData?.book_usage_stats) {
      console.error('Error fetching user book stats from profile:', profileError);
      return [];
    }

    const bookUsageStats = profileData.book_usage_stats as BookUsageStats;
    const bookIds = Object.keys(bookUsageStats);

    if (bookIds.length === 0) {
      return [];
    }

    // 対応する書籍情報を取得
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select(`
        id,
        isbn,
        title,
        author,
        company,
        cover_image_url,
        created_at
      `)
      .in('id', bookIds);

    if (booksError || !booksData) {
      console.error('Error fetching books data:', booksError);
      return [];
    }

    // 統計データと書籍情報を結合
    const userBookStats: UserBookStat[] = booksData
      .map(book => {
        const stats = bookUsageStats[book.id];
        if (!stats) return null;

        return {
          book,
          used_times: stats.used_times,
          total_minutes: stats.total_minutes,
          last_used_at: stats.last_used_at,
          avg_minutes_per_session: stats.used_times > 0 
            ? Math.round(stats.total_minutes / stats.used_times * 10) / 10
            : 0
        };
      })
      .filter((stat): stat is UserBookStat => stat !== null)
      .sort((a, b) => b.used_times - a.used_times); // デフォルトは使用回数順

    return userBookStats;
  } catch (error) {
    console.error('Error fetching user book stats:', error);
    return [];
  }
}

/** 特定書籍のグローバル統計を取得（比較用） */
export async function getBookGlobalStats(bookId: string): Promise<{usage_count_global: number, total_minutes_global: number} | null> {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('usage_count_global, total_minutes_global')
      .eq('id', bookId)
      .single();

    if (error) {
      console.error('Error fetching book global stats:', error);
      return null;
    }

    return {
      usage_count_global: data.usage_count_global || 0,
      total_minutes_global: data.total_minutes_global || 0
    };
  } catch (error) {
    console.error('Error fetching book global stats:', error);
    return null;
  }
}

/** ユーザーの特定書籍使用統計と全体平均の比較データを取得 */
export async function getBookComparisonData(
  userId: string,
  bookId: string
): Promise<{
  bookTitle: string;
  userUsage: number;
  userTime: number;
  globalAvgUsage: number;
  globalAvgTime: number;
  userRank: 'above_average' | 'average' | 'below_average';
} | null> {
  try {
    // ユーザーの統計を取得
    const userStats = await getUserBookStats(userId);
    const userBookStat = userStats.find(stat => stat.book.id === bookId);

    if (!userBookStat) {
      console.log('User has no stats for this book');
      return null;
    }

    // グローバル統計を取得
    const globalStats = await getBookGlobalStats(bookId);
    if (!globalStats) {
      console.log('No global stats found for this book');
      return null;
    }

    // 全ユーザー数を大まかに推定（実際のユーザー数取得は重い処理のため簡易計算）
    // usage_count_globalを利用してざっくりとした平均を算出
    const estimatedAvgUsagePerUser = Math.max(1, Math.floor(globalStats.usage_count_global / 50)); // 50ユーザー程度と仮定
    const estimatedAvgTimePerUser = Math.max(30, Math.floor(globalStats.total_minutes_global / 50));

    // ランク判定
    const usageRatio = userBookStat.used_times / estimatedAvgUsagePerUser;
    const timeRatio = userBookStat.total_minutes / estimatedAvgTimePerUser;
    const overallRatio = (usageRatio + timeRatio) / 2;

    let userRank: 'above_average' | 'average' | 'below_average';
    if (overallRatio >= 1.3) {
      userRank = 'above_average';
    } else if (overallRatio >= 0.7) {
      userRank = 'average';
    } else {
      userRank = 'below_average';
    }

    return {
      bookTitle: userBookStat.book.title,
      userUsage: userBookStat.used_times,
      userTime: userBookStat.total_minutes,
      globalAvgUsage: estimatedAvgUsagePerUser,
      globalAvgTime: estimatedAvgTimePerUser,
      userRank
    };
  } catch (error) {
    console.error('Error fetching book comparison data:', error);
    return null;
  }
}

/** ユーザーの書籍利用統計を更新 */
async function updateBookUsageStats(
  userId: string,
  bookId: string,
  durationMinutes: number,
  studiedAt: string
): Promise<void> {
  try {
    // 現在の統計を取得
    const { data: profileData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('book_usage_stats')
      .eq('uid', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user profile for stats update:', fetchError);
      return;
    }

    // 既存の統計を取得（なければ空オブジェクト）
    const currentStats = (profileData?.book_usage_stats as BookUsageStats) || {};

    // 該当書籍の統計を更新
    const bookStats = currentStats[bookId] || {
      used_times: 0,
      total_minutes: 0,
      last_used_at: studiedAt
    };

    bookStats.used_times += 1;
    bookStats.total_minutes += durationMinutes;
    bookStats.last_used_at = studiedAt;

    currentStats[bookId] = bookStats;

    // 統計を保存
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ book_usage_stats: currentStats })
      .eq('uid', userId);

    if (updateError) {
      console.error('Error updating book usage stats:', updateError);
    }
  } catch (error) {
    console.error('Error in updateBookUsageStats:', error);
  }
}

/** 書籍のグローバル統計を更新 */
async function updateBookGlobalStats(
  bookId: string,
  durationMinutes: number
): Promise<void> {
  try {
    // 現在の統計を取得
    const { data: bookData, error: fetchError } = await supabase
      .from('books')
      .select('usage_count_global, total_minutes_global')
      .eq('id', bookId)
      .single();

    if (fetchError) {
      console.error('Error fetching book for global stats update:', fetchError);
      return;
    }

    const currentUsageCount = bookData?.usage_count_global || 0;
    const currentTotalMinutes = bookData?.total_minutes_global || 0;

    // 統計を更新
    const { error: updateError } = await supabase
      .from('books')
      .update({
        usage_count_global: currentUsageCount + 1,
        total_minutes_global: currentTotalMinutes + durationMinutes
      })
      .eq('id', bookId);

    if (updateError) {
      console.error('Error updating book global stats:', updateError);
    }
  } catch (error) {
    console.error('Error in updateBookGlobalStats:', error);
  }
}

/** ユーザーの動画利用統計を更新 */
async function updateVideoUsageStats(
  userId: string,
  videoId: string,
  durationMinutes: number,
  studiedAt: string
): Promise<void> {
  try {
    // 現在の統計を取得
    const { data: profileData, error: fetchError } = await supabase
      .from('user_profiles')
      .select('video_usage_stats')
      .eq('uid', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user profile for video stats update:', fetchError);
      return;
    }

    // 既存の統計を取得（なければ空オブジェクト）
    const currentStats = (profileData?.video_usage_stats as VideoUsageStats) || {};

    // 該当動画の統計を更新
    const videoStats = currentStats[videoId] || {
      used_times: 0,
      total_minutes: 0,
      last_used_at: studiedAt
    };

    videoStats.used_times += 1;
    videoStats.total_minutes += durationMinutes;
    videoStats.last_used_at = studiedAt;

    currentStats[videoId] = videoStats;

    // 統計を保存
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ video_usage_stats: currentStats })
      .eq('uid', userId);

    if (updateError) {
      console.error('Error updating video usage stats:', updateError);
    }
  } catch (error) {
    console.error('Error in updateVideoUsageStats:', error);
  }
}

/** 動画のグローバル統計を更新 */
async function updateVideoGlobalStats(
  videoId: string,
  durationMinutes: number
): Promise<void> {
  try {
    // 現在の統計を取得
    const { data: videoData, error: fetchError } = await supabase
      .from('videos')
      .select('usage_count_global, total_minutes_global')
      .eq('id', videoId)
      .single();

    if (fetchError) {
      console.error('Error fetching video for global stats update:', fetchError);
      return;
    }

    const currentUsageCount = videoData?.usage_count_global || 0;
    const currentTotalMinutes = videoData?.total_minutes_global || 0;

    // 統計を更新
    const { error: updateError } = await supabase
      .from('videos')
      .update({
        usage_count_global: currentUsageCount + 1,
        total_minutes_global: currentTotalMinutes + durationMinutes
      })
      .eq('id', videoId);

    if (updateError) {
      console.error('Error updating video global stats:', updateError);
    }
  } catch (error) {
    console.error('Error in updateVideoGlobalStats:', error);
  }
}