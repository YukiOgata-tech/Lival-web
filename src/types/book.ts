// src/types/book.ts

export type Book = {
  isbn13: string;
  title: string;
  authors: string[];
  publisher: string;
  edition: string | null;
  subject: string | null;   // 例: 'math' | 'english'...
  coverUrl: string | null;
  source: 'openbd' | 'ndl' | 'ol' | 'google' | 'manual';
  updatedAt: string;        // ISO
};
