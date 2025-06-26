import { supabase } from '@/lib/supabaseClient';
import {
  User,
  Project,
  SocialAccount,
  ContentCalendarItem,
  Analytics,
  Trend,
  AIContent,
  Collaborator,
  Comment,
  Platform
} from '@/types';

export class TrendMancerService {
  // Gestion des utilisateurs
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
      createdAt: user.created_at,
      updatedAt: user.last_sign_in_at || user.created_at
    };
  }

  // Gestion des projets
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        owner:users!projects_owner_id_fkey(*),
        collaborators:collaborators(
          *,
          user:users(*)
        )
      `)
      .or(`owner_id.eq.${userId},collaborators.user_id.eq.${userId}`);

    if (error) throw error;
    return data;
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Gestion des comptes sociaux
  async getSocialAccounts(projectId: string): Promise<SocialAccount[]> {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }

  async addSocialAccount(account: Omit<SocialAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<SocialAccount> {
    const { data, error } = await supabase
      .from('social_accounts')
      .insert(account)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Gestion du calendrier de contenu
  async getContentCalendar(projectId: string): Promise<ContentCalendarItem[]> {
    const { data, error } = await supabase
      .from('content_calendar')
      .select(`
        *,
        comments:comments(
          *,
          user:users(*)
        )
      `)
      .eq('project_id', projectId)
      .order('scheduled_for', { ascending: true });

    if (error) throw error;
    return data;
  }

  async scheduleContent(content: Omit<ContentCalendarItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentCalendarItem> {
    const { data, error } = await supabase
      .from('content_calendar')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Gestion des analyses
  async getAnalytics(projectId: string, platform?: Platform): Promise<Analytics[]> {
    let query = supabase
      .from('analytics')
      .select('*')
      .eq('project_id', projectId);

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query.order('recorded_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Gestion des tendances
  async getTrends(platform?: Platform): Promise<Trend[]> {
    let query = supabase
      .from('trends')
      .select('*');

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query.order('volume', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Gestion du contenu AI
  async generateAIContent(prompt: string, projectId: string, contentType: AIContent['contentType']): Promise<AIContent> {
    // Ici, vous intégrerez votre logique d'IA pour générer du contenu
    // Pour l'instant, nous créons juste l'enregistrement
    const content = {
      project_id: projectId,
      prompt,
      content_type: contentType,
      generated_content: "Contenu généré par l'IA..." // À remplacer par la vraie génération
    };

    const { data, error } = await supabase
      .from('ai_content')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Gestion des collaborateurs
  async getCollaborators(projectId: string): Promise<Collaborator[]> {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        user:users(*)
      `)
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }

  async addCollaborator(collaborator: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collaborator> {
    const { data, error } = await supabase
      .from('collaborators')
      .insert(collaborator)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Gestion des commentaires
  async addComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }
} 