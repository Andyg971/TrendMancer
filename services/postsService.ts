import { supabase } from '../utils/supabase';

export interface SocialPost {
  id?: string;
  user_id?: string;
  title: string;
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduled_for?: string;
  published_at?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
  reach?: number;
  media_urls?: string[];
  tags?: string[];
  post_type?: string;
  campaign_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostFilter {
  platform?: string;
  status?: 'draft' | 'scheduled' | 'published' | 'failed';
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  tags?: string[];
}

// Récupérer toutes les publications
export async function getAllPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des publications:', error);
    return { data: null, error };
  }
}

// Récupérer les publications par statut
export async function getPostsByStatus(status: 'draft' | 'scheduled' | 'published' | 'failed', userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('status', status)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error(`Erreur lors de la récupération des publications avec statut ${status}:`, error);
    return { data: null, error };
  }
}

// Ajouter une nouvelle publication
export async function addPost(post: Omit<SocialPost, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        { 
          ...post,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la publication:', error);
    return { data: null, error };
  }
}

// Mettre à jour une publication
export async function updatePost(id: string, updates: Partial<SocialPost>) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la publication ${id}:`, error);
    return { data: null, error };
  }
}

// Supprimer une publication
export async function deletePost(id: string) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Erreur lors de la suppression de la publication ${id}:`, error);
    return { success: false, error };
  }
}

// Récupérer tous les posts d'un utilisateur avec filtres optionnels
export async function getUserPosts(userId: string, filters?: PostFilter) {
  try {
    let query = supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId);
    
    if (filters) {
      // Filtrage par plateforme
      if (filters.platform && filters.platform !== 'all') {
        query = query.eq('platform', filters.platform);
      }
      
      // Filtrage par statut
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Filtrage par date
      if (filters.dateRange) {
        if (filters.dateRange.start) {
          query = query.gte('created_at', filters.dateRange.start.toISOString());
        }
        if (filters.dateRange.end) {
          query = query.lte('created_at', filters.dateRange.end.toISOString());
        }
      }
      
      // Recherche dans le titre et le contenu
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,content.ilike.%${filters.searchTerm}%`);
      }
      
      // Filtrage par tags
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    return { data: null, error };
  }
}

// Créer un nouveau post
export async function createPost(post: SocialPost, userId: string) {
  try {
    const newPost = {
      ...post,
      user_id: userId,
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      impressions: post.impressions || 0,
      reach: post.reach || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('social_posts')
      .insert(newPost)
      .select();
    
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    return { data: null, error };
  }
}

// Mettre à jour un post existant
export async function updateSocialPost(post: SocialPost, userId: string) {
  if (!post.id) {
    return { data: null, error: 'ID du post manquant' };
  }
  
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .update({
        ...post,
        updated_at: new Date().toISOString()
      })
      .eq('id', post.id)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du post:', error);
    return { data: null, error };
  }
}

// Supprimer un post
export async function deleteSocialPost(postId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    return { success: false, error };
  }
}

// Publier un post (changer son statut à 'published')
export async function publishPost(postId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Erreur lors de la publication du post:', error);
    return { data: null, error };
  }
}

// Planifier un post pour publication future
export async function schedulePost(postId: string, scheduledDate: Date, userId: string) {
  try {
    const { data, error } = await supabase
      .from('social_posts')
      .update({
        status: 'scheduled',
        scheduled_for: scheduledDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .eq('user_id', userId)
      .select();
    
    if (error) throw error;
    
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Erreur lors de la planification du post:', error);
    return { data: null, error };
  }
}

// Récupérer les statistiques des posts par plateforme
export async function getPostsStatsByPlatform(userId: string) {
  try {
    const { data: posts, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const stats = {
      total: posts.length,
      byPlatform: {} as Record<string, number>,
      byStatus: {
        draft: 0,
        scheduled: 0,
        published: 0,
        failed: 0
      }
    };
    
    posts.forEach(post => {
      // Stats par plateforme
      if (!stats.byPlatform[post.platform]) {
        stats.byPlatform[post.platform] = 0;
      }
      stats.byPlatform[post.platform]++;
      
      // Stats par statut
      const status = post.status as 'draft' | 'scheduled' | 'published' | 'failed';
      if (status === 'draft' || status === 'scheduled' ||
          status === 'published' || status === 'failed') {
        stats.byStatus[status]++;
      }
    });
    
    return { data: stats, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return { data: null, error };
  }
} 