export type Category = 'channels' | 'videos' | 'shorts';

export interface LeaderboardItem {
  id: string;
  rank: number;
  title: string;
  thumbnail: string;
  views: number;
  growth: number; // Percentage growth
  subscribers?: number; // For channels
  duration?: string; // For videos/shorts
  category: Category;
  engagementRate: number;
  publishedAt: string;
}

export interface AnalysisResult {
  title: string;
  insights: string[];
  viralScore: number;
  strategySuggestion: string;
}

export interface ChartData {
  name: string;
  views: number;
  subs: number;
}