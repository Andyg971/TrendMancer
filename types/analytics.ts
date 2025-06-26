export interface Analytics {
  id: string;
  type: 'trend' | 'mention' | 'hashtag';
  source: 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  keyword: string;
  volume: number;
  sentiment: number;
  timestamp: string;
  potential_reach: number;
  engagement_rate: number;
  relevance_score: number;
}

export interface TrendAnalysis extends Analytics {
  growth_rate?: number;
  duration?: number;
  category?: string;
  related_keywords?: string[];
  demographic_data?: {
    age_groups?: Record<string, number>;
    locations?: Record<string, number>;
    interests?: string[];
  };
} 