export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      social_posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          platform: string
          status: string
          scheduled_at: string | null
          published_at: string | null
          likes: number
          comments: number
          shares: number
          impressions: number
          reach: number
          post_type: string | null
          tags: string[] | null
          media_urls: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          platform: string
          status: string
          scheduled_at?: string | null
          published_at?: string | null
          likes?: number
          comments?: number
          shares?: number
          impressions?: number
          reach?: number
          post_type?: string | null
          tags?: string[] | null
          media_urls?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          platform?: string
          status?: string
          scheduled_at?: string | null
          published_at?: string | null
          likes?: number
          comments?: number
          shares?: number
          impressions?: number
          reach?: number
          post_type?: string | null
          tags?: string[] | null
          media_urls?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          email: string | null
          subscription_tier: string
          subscription_status: string
          subscription_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          email?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          email?: string | null
          subscription_tier?: string
          subscription_status?: string
          subscription_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string
          type: string
          size: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url: string
          type: string
          size: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string
          type?: string
          size?: number
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          platform: string
          access_token: string
          refresh_token: string | null
          token_expires_at: string | null
          platform_user_id: string | null
          platform_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          access_token: string
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          platform_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          access_token?: string
          refresh_token?: string | null
          token_expires_at?: string | null
          platform_user_id?: string | null
          platform_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          all_day: boolean
          location: string | null
          event_type: string
          platform: string | null
          post_id: string | null
          status: string
          recurrence_rule: string | null
          color: string | null
          reminders: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          location?: string | null
          event_type: string
          platform?: string | null
          post_id?: string | null
          status?: string
          recurrence_rule?: string | null
          color?: string | null
          reminders?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          all_day?: boolean
          location?: string | null
          event_type?: string
          platform?: string | null
          post_id?: string | null
          status?: string
          recurrence_rule?: string | null
          color?: string | null
          reminders?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      optimal_time_slots: {
        Row: {
          id: string
          user_id: string
          platform: string
          day_of_week: number
          hour: number
          engagement_score: number
          confidence_level: number
          audience_segment: string | null
          sample_size: number | null
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          day_of_week: number
          hour: number
          engagement_score: number
          confidence_level: number
          audience_segment?: string | null
          sample_size?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          day_of_week?: number
          hour?: number
          engagement_score?: number
          confidence_level?: number
          audience_segment?: string | null
          sample_size?: number | null
          last_updated?: string
        }
      }
      system_tasks: {
        Row: {
          id: string
          user_id: string
          task_type: string
          status: string
          details: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_type: string
          status: string
          details?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_type?: string
          status?: string
          details?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      // Autres tables définies dans les schémas SQL
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_analytics_sample_data: {
        Args: { user_uuid: string }
        Returns: string
      }
      generate_ai_assistant_sample_data: {
        Args: { user_uuid: string }
        Returns: string
      }
      generate_calendar_sample_data: {
        Args: { user_uuid: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
  auth: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
} 