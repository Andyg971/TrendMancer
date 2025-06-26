// Types de base
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// Type utilisateur
export interface User extends BaseModel {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

// Type projet
export interface Project extends BaseModel {
  name: string;
  description?: string;
  owner_id: string;
  owner: User | null;
  collaborators: Collaborator[];
}

// Plateformes sociales supportées
export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';

// Type compte social
export interface SocialAccount extends BaseModel {
  projectId: string;
  platform: SocialPlatform;
  accountName: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
}

// Type élément du calendrier de contenu
export interface ContentCalendarItem extends BaseModel {
  projectId: string;
  title: string;
  content: string;
  platform: SocialPlatform;
  scheduledFor: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaUrls: string[];
}

// Type analytics
export interface Analytics extends BaseModel {
  projectId: string;
  platform: SocialPlatform;
  metric: string;
  value: number;
  recordedAt: string;
}

// Type tendance
export interface Trend extends BaseModel {
  platform: SocialPlatform;
  keyword: string;
  volume: number;
  sentiment: number;
  growthRate: number;
}

// Type contenu AI
export interface AIContent extends BaseModel {
  projectId: string;
  prompt: string;
  contentType: 'post' | 'article' | 'caption' | 'hashtags';
  generatedContent: string;
}

// Type collaborateur
export interface Collaborator extends BaseModel {
  projectId: string;
  userId: string;
  role: 'editor' | 'viewer';
  user: User | null;
}

// Type commentaire
export interface Comment extends BaseModel {
  userId: string;
  contentId: string;
  text: string;
  user: User | null;
}

// Types utilitaires
export type Platform = SocialAccount['platform'];
export type ContentStatus = ContentCalendarItem['status'];
export type CollaboratorRole = Collaborator['role'];
export type ContentType = AIContent['contentType'];

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

// --- Collaboration Types ---

export interface Task {
  id: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assigned_user_id?: string;
  due_date?: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: string;
} 