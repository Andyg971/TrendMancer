import { supabase } from '@/lib/supabaseClient';
import { TwitterApi } from 'twitter-api-v2';
import { User } from '@/types/user';

export interface Trend {
  id: string;
  keyword: string;
  source: string;
  volume: number;
  sentiment: number;
  growth_rate: number;
  category: string;
  detected_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  start_date: string;
  due_date: string | null;
}

// Interface pour les données retournées par Supabase
interface ProjectMemberData {
  id: string;
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name: string;
      avatar_url: string | null;
    };
  };
}

export class DataService {
  private twitterClient: TwitterApi;

  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
  }

  // Récupérer les tendances
  async getTrends(): Promise<Trend[]> {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .order('detected_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Mettre à jour les tendances depuis Twitter
  async updateTrendsFromTwitter(): Promise<void> {
    try {
      // Utiliser l'API Twitter v2 pour obtenir les tendances
      const { data } = await this.twitterClient.v2.get('trends/place', {
        id: '1', // ID pour les tendances mondiales
      });
      
      const trends = data[0].trends;
      
      for (const trend of trends) {
        const { error } = await supabase
          .from('trends')
          .insert({
            keyword: trend.name,
            source: 'twitter',
            volume: trend.tweet_volume || 0,
            sentiment: Math.random(), // À remplacer par une vraie analyse de sentiment
            growth_rate: Math.random() * 2, // À remplacer par un vrai calcul
            category: 'Auto-détecté',
          });

        if (error) console.error('Erreur lors de l\'insertion de la tendance:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des tendances:', error);
      throw error;
    }
  }

  // Récupérer les projets
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Créer un nouveau projet
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mettre à jour un projet
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Récupérer les membres d'un projet
  async getProjectMembers(projectId: string): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          id,
          user:users (
            id,
            email,
            user_metadata
          )
        `)
        .eq('project_id', projectId);

      if (error) throw error;

      // Vérifier et transformer les données
      if (!data) return [];
      
      return data.map(member => {
        const userData = member.user as unknown as {
          id: string;
          email: string;
          user_metadata: {
            full_name: string;
            avatar_url: string | null;
          };
        };

        return {
          id: userData.id,
          email: userData.email,
          full_name: userData.user_metadata.full_name,
          avatar_url: userData.user_metadata.avatar_url
        };
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      return [];
    }
  }

  // Ajouter un membre à un projet
  async addProjectMember(projectId: string, userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('project_members')
      .insert([
        {
          project_id: projectId,
          user_id: userId,
          role: role
        }
      ]);

    if (error) throw error;
  }

  // Récupérer les analyses de performance
  async getAnalytics(contentId: string) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('content_id', contentId)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Enregistrer une nouvelle analyse
  async saveAnalytics(analytics: any) {
    const { error } = await supabase
      .from('analytics')
      .insert([analytics]);

    if (error) throw error;
  }
} 