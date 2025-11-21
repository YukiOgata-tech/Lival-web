// src/app/api/videos/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const webmDirectory = path.join(process.cwd(), 'public', 'webm');

    // ディレクトリ内のファイルを読み込む
    const files = fs.readdirSync(webmDirectory);

    // .webmファイルのみフィルタリング
    const webmFiles = files
      .filter(file => file.endsWith('.webm'))
      .map(file => {
        const filePath = path.join(webmDirectory, file);
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(1);

        return {
          name: file,
          size: sizeInKB < 1024 ? `${sizeInKB}KB` : `${sizeInMB}MB`,
          sizeBytes: stats.size
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // ファイル名でソート

    return NextResponse.json({ files: webmFiles });
  } catch (error) {
    console.error('Error reading webm directory:', error);
    return NextResponse.json(
      { error: 'Failed to read video files', files: [] },
      { status: 500 }
    );
  }
}
