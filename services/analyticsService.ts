import { supabase } from '../utils/supabase';

export interface SocialPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
  media_urls: string[];
  tags: string[];
  post_type?: string;
}

export interface EngagementHistory {
  id: string;
  post_id: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  reach: number;
}

export interface AnalyticsSummary {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  platform?: string;
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_impressions: number;
  total_reach: number;
  engagement_rate: number;
  growth_rate: number;
  best_performing_post_id?: string;
  best_posting_times?: {
    [key: string]: {
      hour: string;
      engagement: number;
    };
  };
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  recommendation_text: string;
  category: string;
  priority: number;
  is_applied: boolean;
  applied_at?: string;
  created_at: string;
}

export interface AudienceMetrics {
  id: string;
  user_id: string;
  platform: string;
  date: string;
  followers_count: number;
  followers_growth: number;
  demographics: {
    age_groups: {
      [key: string]: number;
    };
    gender: {
      [key: string]: number;
    };
  };
  location_data: {
    countries: {
      [key: string]: number;
    };
  };
  active_times: {
    [key: string]: number;
  };
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Récupérer les posts de l'utilisateur
export async function getUserPosts(userId: string, range?: DateRange, platform?: string) {
  try {
    let query = supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId);
    
    if (range) {
      query = query
        .gte('published_at', range.startDate.toISOString())
        .lte('published_at', range.endDate.toISOString());
    }
    
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform);
    }
    
    const { data, error } = await query.order('published_at', { ascending: false });
    
    if (error) throw error;
    
    return { data: data as SocialPost[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    return { data: null, error };
  }
}

// Récupérer l'historique d'engagement pour un post
export async function getPostEngagementHistory(postId: string) {
  try {
    const { data, error } = await supabase
      .from('engagement_history')
      .select('*')
      .eq('post_id', postId)
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    return { data: data as EngagementHistory[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique d\'engagement:', error);
    return { data: null, error };
  }
}

// Récupérer les résumés d'analytics
export async function getAnalyticsSummaries(userId: string, platform?: string) {
  try {
    let query = supabase
      .from('analytics_summaries')
      .select('*')
      .eq('user_id', userId);
    
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform);
    }
    
    const { data, error } = await query.order('period_end', { ascending: false });
    
    if (error) throw error;
    
    return { data: data as AnalyticsSummary[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des résumés d\'analytics:', error);
    return { data: null, error };
  }
}

// Récupérer les recommandations IA
export async function getAIRecommendations(userId: string, category?: string) {
  try {
    let query = supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('priority', { ascending: true });
    
    if (error) throw error;
    
    return { data: data as AIRecommendation[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations IA:', error);
    return { data: null, error };
  }
}

// Marquer une recommandation comme appliquée
export async function markRecommendationAsApplied(recommendationId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .update({
        is_applied: true,
        applied_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] as AIRecommendation, error: null };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la recommandation:', error);
    return { data: null, error };
  }
}

// Récupérer les métriques d'audience
export async function getAudienceMetrics(userId: string, platform?: string) {
  try {
    let query = supabase
      .from('audience_metrics')
      .select('*')
      .eq('user_id', userId);
    
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    
    return { data: data as AudienceMetrics[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques d\'audience:', error);
    return { data: null, error };
  }
}

// Générer une analyse complète
export async function generateAnalyticsReport(userId: string, range: DateRange, platform?: string) {
  try {
    // Récupérer les posts
    const { data: posts } = await getUserPosts(userId, range, platform);
    if (!posts || posts.length === 0) {
      return { data: null, error: 'Aucune donnée disponible pour cette période' };
    }
    
    // Récupérer les résumés d'analytics
    const { data: summaries } = await getAnalyticsSummaries(userId, platform);
    
    // Récupérer les recommandations IA
    const { data: recommendations } = await getAIRecommendations(userId);
    
    // Récupérer les métriques d'audience
    const { data: audienceData } = await getAudienceMetrics(userId, platform);
    
    // Regrouper les données dans un rapport complet
    const report = {
      posts: posts || [],
      summaries: summaries || [],
      recommendations: recommendations || [],
      audienceData: audienceData || [],
      
      // Calculer des métriques globales
      totalPosts: posts?.length || 0,
      totalEngagement: posts?.reduce((sum, post) => 
        sum + post.likes + post.comments + post.shares, 0) || 0,
      averageEngagementRate: posts?.length 
        ? posts.reduce((sum, post) => 
            sum + ((post.likes + post.comments + post.shares) / Math.max(post.impressions, 1)), 0) / posts.length * 100
        : 0,
      
      // Analyser les performances par type de contenu
      contentTypePerformance: generateContentTypePerformance(posts || []),
      
      // Calculer les meilleurs moments pour publier
      bestPostingTimes: calculateBestPostingTimes(posts || []),
      
      // Générer des conseils personnalisés
      customInsights: generateCustomInsights(posts || [], audienceData || [])
    };
    
    // Enregistrer le log d'analyse
    await supabase
      .from('analytics_logs')
      .insert({
        user_id: userId,
        action: 'generate_report',
        parameters: {
          date_range: {
            start: range.startDate.toISOString(),
            end: range.endDate.toISOString()
          },
          platform: platform || 'all'
        },
        results: {
          total_posts: report.totalPosts,
          total_engagement: report.totalEngagement
        }
      });
    
    return { data: report, error: null };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport d\'analyse:', error);
    return { data: null, error };
  }
}

// Fonction utilitaire pour analyser les performances par type de contenu
function generateContentTypePerformance(posts: SocialPost[]) {
  const typeMap: { [key: string]: { count: number, engagement: number } } = {};
  
  posts.forEach(post => {
    const type = post.post_type || 'text';
    const engagement = post.likes + post.comments + post.shares;
    
    if (!typeMap[type]) {
      typeMap[type] = { count: 0, engagement: 0 };
    }
    
    typeMap[type].count += 1;
    typeMap[type].engagement += engagement;
  });
  
  return Object.entries(typeMap).map(([type, data]) => ({
    type,
    count: data.count,
    totalEngagement: data.engagement,
    averageEngagement: data.count > 0 ? data.engagement / data.count : 0
  })).sort((a, b) => b.averageEngagement - a.averageEngagement);
}

// Fonction utilitaire pour calculer les meilleurs moments pour publier
function calculateBestPostingTimes(posts: SocialPost[]) {
  const dayHourMap: { [key: string]: { [key: string]: { count: number, engagement: number } } } = {
    'Lundi': {}, 'Mardi': {}, 'Mercredi': {}, 'Jeudi': {}, 'Vendredi': {}, 'Samedi': {}, 'Dimanche': {}
  };
  
  posts.forEach(post => {
    if (!post.published_at) return;
    
    const date = new Date(post.published_at);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const hour = date.getHours().toString().padStart(2, '0') + ':00';
    const engagement = post.likes + post.comments + post.shares;
    
    if (!dayHourMap[day][hour]) {
      dayHourMap[day][hour] = { count: 0, engagement: 0 };
    }
    
    dayHourMap[day][hour].count += 1;
    dayHourMap[day][hour].engagement += engagement;
  });
  
  // Convertir en array pour faciliter le tri
  const results: { day: string, hour: string, posts: number, engagement: number, engagementRate: number }[] = [];
  
  Object.entries(dayHourMap).forEach(([day, hours]) => {
    Object.entries(hours).forEach(([hour, data]) => {
      if (data.count > 0) {
        results.push({
          day,
          hour,
          posts: data.count,
          engagement: data.engagement,
          engagementRate: data.engagement / data.count
        });
      }
    });
  });
  
  return results.sort((a, b) => b.engagementRate - a.engagementRate);
}

// Fonction utilitaire pour générer des insights personnalisés
function generateCustomInsights(posts: SocialPost[], audienceData: AudienceMetrics[]) {
  const insights: string[] = [];
  
  // Analyser les plateformes
  const platformPerformance: { [key: string]: { posts: number, engagement: number } } = {};
  
  posts.forEach(post => {
    if (!platformPerformance[post.platform]) {
      platformPerformance[post.platform] = { posts: 0, engagement: 0 };
    }
    
    platformPerformance[post.platform].posts += 1;
    platformPerformance[post.platform].engagement += post.likes + post.comments + post.shares;
  });
  
  // Trouver la plateforme la plus performante
  let bestPlatform = '';
  let bestPlatformRate = 0;
  
  Object.entries(platformPerformance).forEach(([platform, data]) => {
    const rate = data.posts > 0 ? data.engagement / data.posts : 0;
    if (rate > bestPlatformRate) {
      bestPlatform = platform;
      bestPlatformRate = rate;
    }
  });
  
  if (bestPlatform) {
    insights.push(`${bestPlatform} est votre meilleure plateforme avec un taux d'engagement moyen de ${bestPlatformRate.toFixed(1)}.`);
  }
  
  // Analyser les hashtags performants
  const hashtagPerformance: { [key: string]: { count: number, engagement: number } } = {};
  
  posts.forEach(post => {
    const tags = post.tags || [];
    const engagement = post.likes + post.comments + post.shares;
    
    tags.forEach(tag => {
      if (!hashtagPerformance[tag]) {
        hashtagPerformance[tag] = { count: 0, engagement: 0 };
      }
      
      hashtagPerformance[tag].count += 1;
      hashtagPerformance[tag].engagement += engagement;
    });
  });
  
  // Trouver les hashtags les plus performants (avec au moins 2 occurrences)
  const topHashtags = Object.entries(hashtagPerformance)
    .filter(([, data]) => data.count >= 2)
    .map(([tag, data]) => ({
      tag,
      count: data.count,
      engagementRate: data.count > 0 ? data.engagement / data.count : 0
    }))
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, 3);
  
  if (topHashtags.length > 0) {
    insights.push(`Vos hashtags les plus performants sont: ${topHashtags.map(h => h.tag).join(', ')}.`);
  }
  
  // Analyser les tendances d'audience
  if (audienceData.length > 0) {
    const latestAudience = audienceData[0];
    
    // Trouver la tranche d'âge principale
    let mainAgeGroup = '';
    let mainAgeGroupPercentage = 0;
    
    Object.entries(latestAudience.demographics.age_groups).forEach(([ageGroup, percentage]) => {
      if (percentage > mainAgeGroupPercentage) {
        mainAgeGroup = ageGroup;
        mainAgeGroupPercentage = percentage;
      }
    });
    
    if (mainAgeGroup) {
      insights.push(`Votre audience principale est dans la tranche d'âge ${mainAgeGroup} (${mainAgeGroupPercentage.toFixed(1)}%).`);
    }
    
    // Analyser les pays principaux
    const mainCountry = Object.entries(latestAudience.location_data.countries)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mainCountry) {
      insights.push(`La majorité de votre audience se trouve en ${mainCountry[0]} (${mainCountry[1].toFixed(1)}%).`);
    }
    
    // Analyser les moments d'activité
    const mainActiveTime = Object.entries(latestAudience.active_times)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (mainActiveTime) {
      insights.push(`Votre audience est principalement active le ${mainActiveTime[0]}.`);
    }
  }
  
  return insights;
}

// Générer des données d'exemple pour un utilisateur
export async function generateSampleData(userId: string) {
  try {
    // Appeler la fonction SQL qui génère des données d'exemple
    const { data, error } = await supabase.rpc('generate_sample_data', {
      user_uuid: userId
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la génération des données d\'exemple:', error);
    return { data: null, error };
  }
} 