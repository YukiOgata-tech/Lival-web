// src/types/study.ts

export interface Book {
  isbn: string;
  created_at: string;
  title: string;
  author: string;
  cover_image_url?: string;
  company: string;
}

export interface StudyLog {
  id: number;
  created_at: string;
  user_id: string;
  book_isbn?: string;
  manual_book_title?: string;
  duration_minutes: number;
  memo?: string;
  studied_at: string;
  // リレーション
  book?: Book;
}

export interface StudyLogInput {
  book_isbn?: string;
  manual_book_title?: string;
  duration_minutes: number;
  memo?: string;
  studied_at: string;
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
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverImageUrl?: string;
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
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
  };
}