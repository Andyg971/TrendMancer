export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier?: 'free' | 'basic' | 'professional' | 'enterprise';
  created_at: string;
}

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter';
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for?: string;
  published_at?: string;
  engagement_stats?: EngagementStats;
  user_id: string;
  created_at: string;
}

export interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  user_id: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joined_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  type: 'post' | 'meeting' | 'task' | 'other';
  related_post_id?: string;
  user_id: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface AnalyticsData {
  period: string;
  posts_count: number;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    reach: number;
  };
  top_platforms: {
    platform: string;
    count: number;
  }[];
  growth_rate: number;
}

export interface Integration {
  id: string;
  name: string;
  platform: 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'google' | 'other';
  status: 'connected' | 'disconnected' | 'pending';
  metadata?: any;
  user_id: string;
  connected_at?: string;
  created_at: string;
} 