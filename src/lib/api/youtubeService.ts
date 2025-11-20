// src/lib/api/youtubeService.ts
import { VideoSearchResult, Video } from '../../types/study';
import { supabase } from '../supabase/supabaseClient';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY || '';

/**
 * YouTube URLから動画IDを抽出
 * 対応形式:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractVideoId(url: string): string | null {
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/ // 直接IDが渡された場合
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting video ID:', error);
    return null;
  }
}

/**
 * YouTube動画IDから詳細情報を取得
 */
export async function getVideoDetails(videoId: string): Promise<VideoSearchResult | null> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key is not configured');
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error('YouTube API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const video = data.items[0];

    // ISO 8601 duration (PT1H2M10S) を秒数に変換
    const duration = parseDuration(video.contentDetails?.duration);

    return {
      videoId: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnailUrl: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
      publishedAt: video.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      durationSeconds: duration,
      viewCount: parseInt(video.statistics?.viewCount || '0'),
      likeCount: parseInt(video.statistics?.likeCount || '0'),
      source: 'youtube'
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}

/**
 * YouTubeキーワード検索
 */
export async function searchVideos(query: string, maxResults: number = 10): Promise<VideoSearchResult[]> {
  try {
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key is not configured');
      return [];
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      console.error('YouTube API error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // 各動画の詳細情報を取得（再生回数、高評価数、動画の長さなど）
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    const detailsData = await detailsResponse.json();
    const detailsMap = new Map(
      detailsData.items?.map((item: any) => [item.id, item]) || []
    );

    return data.items.map((item: any) => {
      const details = detailsMap.get(item.id.videoId);
      const duration = details ? parseDuration(details.contentDetails?.duration) : undefined;

      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        durationSeconds: duration,
        viewCount: details ? parseInt(details.statistics?.viewCount || '0') : undefined,
        likeCount: details ? parseInt(details.statistics?.likeCount || '0') : undefined,
        source: 'youtube'
      };
    });
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

/**
 * ISO 8601 duration (例: PT1H2M10S) を秒数に変換
 */
function parseDuration(duration?: string): number | undefined {
  if (!duration) return undefined;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * 動画をSupabaseに保存（すでに存在する場合は既存のものを返す）
 */
export async function saveVideoToSupabase(video: VideoSearchResult): Promise<Video | null> {
  try {
    // すでに存在するかチェック
    const { data: existingVideo, error: checkError } = await supabase
      .from('videos')
      .select('*')
      .eq('video_id', video.videoId)
      .single();

    if (existingVideo) {
      return existingVideo as Video;
    }

    // 新規保存
    const { data, error } = await supabase
      .from('videos')
      .insert({
        video_id: video.videoId,
        title: video.title,
        channel_title: video.channelTitle || null,
        thumbnail_url: video.thumbnailUrl || null,
        published_at: video.publishedAt || null,
        url: video.url || null,
        duration_seconds: video.durationSeconds || null,
        view_count: video.viewCount || null,
        like_count: video.likeCount || null,
        usage_count_global: 0,
        total_minutes_global: 0,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving video to Supabase:', error);
      return null;
    }

    return data as Video;
  } catch (error) {
    console.error('Error in saveVideoToSupabase:', error);
    return null;
  }
}

/**
 * YouTube URLで動画を検索（Supabase → YouTube API）
 */
export async function searchVideoByUrl(url: string): Promise<VideoSearchResult | null> {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      return null;
    }

    // まずSupabaseから検索
    const { data: existingVideo, error } = await supabase
      .from('videos')
      .select('*')
      .eq('video_id', videoId)
      .single();

    if (existingVideo) {
      return {
        id: existingVideo.id,
        videoId: existingVideo.video_id,
        title: existingVideo.title,
        channelTitle: existingVideo.channel_title || undefined,
        thumbnailUrl: existingVideo.thumbnail_url || undefined,
        publishedAt: existingVideo.published_at || undefined,
        url: existingVideo.url || undefined,
        durationSeconds: existingVideo.duration_seconds || undefined,
        viewCount: existingVideo.view_count || undefined,
        likeCount: existingVideo.like_count || undefined,
        source: 'supabase'
      };
    }

    // Supabaseになければ YouTube APIで検索
    const videoDetails = await getVideoDetails(videoId);
    if (!videoDetails) {
      return null;
    }

    // Supabaseに保存
    const savedVideo = await saveVideoToSupabase(videoDetails);
    if (savedVideo) {
      return {
        ...videoDetails,
        id: savedVideo.id,
        source: 'youtube'
      };
    }

    return videoDetails;
  } catch (error) {
    console.error('Error searching video by URL:', error);
    return null;
  }
}
