export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      opportunities: {
        Row: {
          id: string
          type: string
          source: string
          keyword: string
          volume: number
          sentiment: number
          timestamp: string
          potential_reach: number
          engagement_rate: number
          relevance_score: number
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          source: string
          keyword: string
          volume: number
          sentiment: number
          timestamp?: string
          potential_reach: number
          engagement_rate: number
          relevance_score: number
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          source?: string
          keyword?: string
          volume?: number
          sentiment?: number
          timestamp?: string
          potential_reach?: number
          engagement_rate?: number
          relevance_score?: number
          created_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          workspace_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          workspace_id: string
          user_id: string
          role: string
          joined_at?: string
        }
        Update: {
          workspace_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      brand_voices: {
        Row: {
          id: string
          workspace_id: string
          name: string
          tone_description: string
          keywords: string[] | null
          examples: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          tone_description: string
          keywords?: string[] | null
          examples?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          name?: string
          tone_description?: string
          keywords?: string[] | null
          examples?: string[] | null
          created_at?: string
        }
      }
      content_library: {
        Row: {
          id: string
          workspace_id: string
          title: string
          content: string
          content_type: string
          metadata: Json | null
          performance_score: number | null
          last_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          title: string
          content: string
          content_type: string
          metadata?: Json | null
          performance_score?: number | null
          last_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          title?: string
          content?: string
          content_type?: string
          metadata?: Json | null
          performance_score?: number | null
          last_used?: string | null
          created_at?: string
        }
      }
      // ... autres tables similaires
    }
    Views: {
      relevant_opportunities: {
        Row: {
          id: string
          type: string
          source: string
          keyword: string
          volume: number
          sentiment: number
          timestamp: string
          potential_reach: number
          engagement_rate: number
          relevance_score: number
          created_at: string
        }
      }
    }
    Functions: {
      get_similar_trends: {
        Args: { trend_id: string }
        Returns: {
          id: string
          keyword: string
          similarity: number
        }[]
      }
    }
  }
} 