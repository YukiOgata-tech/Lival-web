// src/types/study.ts

export interface Book {
  id: string;                 // ← 追加: books.id (uuid)
  isbn?: string | null;       // ← null許容
  created_at: string;
  title: string;
  author: string;
  cover_image_url?: string | null;
  company: string;
}

export interface StudyLog {
  id: number;
  created_at: string;
  user_id: string;
  book_id?: string | null;          // ← 置換: book_isbn → book_id
  manual_book_title?: string | null;
  duration_minutes: number;
  memo?: string | null;
  studied_at: string;
  book?: Book;                      // リレーション
  free_mode?: boolean;
}

export interface StudyLogInput {
  book_id?: string | null;          // ← 置換
  manual_book_title?: string | null;
  duration_minutes: number;
  memo?: string | null;
  studied_at: string;
  free_mode?: boolean;
}

export interface StudyStats {
  totalMinutes: number;
  totalSessions: number;
  averageMinutesPerDay: number;
  currentStreak: number;
  longestStreak: number;
  recentStudyLogs: StudyLog[];
}

export interface BookSearchResult {
  id?: string;                      // ← 追加（保存後に返す）
  isbn?: string;                    // 取得できたら入る
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
  googleVolumeId?: string;          // ← 追加（ISBN無ケースを識別）
  source: 'supabase' | 'openbd' | 'google';
}

export interface OpenBDBook {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
}

export interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
}
