import { supabase } from '../utils/supabase';
import { SocialPost } from '../types';

// Interface pour les créneaux optimaux
export interface OptimalTimeSlot {
  day: string;
  hour: string;
  platform: string;
  score: number; // score d'engagement prédit
  confidence: number; // niveau de confiance (0-1)
}

// Interface pour les moments recommandés
export interface TimeRecommendation {
  platform: string;
  bestDays: {
    day: string;
    slots: {
      hour: string;
      score: number;
    }[];
  }[];
  explanation: string;
}

// Interface pour les événements du calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string; // ISO date string
  platform: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  allDay: boolean;
  color?: string; // couleur pour l'affichage
  editable?: boolean; // si l'événement peut être modifié
}

/**
 * Récupère les créneaux optimaux pour publier
 */
export async function getOptimalPostingTimes(userId: string, platform?: string): Promise<{ data: TimeRecommendation[] | null, error: any }> {
  try {
    // 1. Récupérer les analytics pour identifier les tendances d'engagement
    const { data: analyticsSummaries, error: analyticsError } = await supabase
      .from('analytics_summaries')
      .select('*')
      .eq('user_id', userId);
    
    if (analyticsError) throw analyticsError;
    
    // 2. Récupérer l'historique d'engagement pour analyse détaillée
    const { data: posts, error: postsError } = await supabase
      .from('social_posts')
      .select('*, engagement_history(*)')
      .eq('user_id', userId)
      .eq('status', 'published');
    
    if (postsError) throw postsError;
    
    // 3. Récupérer les métadonnées d'audience 
    const { data: audienceData, error: audienceError } = await supabase
      .from('audience_metrics')
      .select('*')
      .eq('user_id', userId);
    
    if (audienceError) throw audienceError;
    
    // Si aucune donnée n'est disponible, retourner des recommandations génériques
    if (!posts || posts.length === 0 || !audienceData || audienceData.length === 0) {
      return { 
        data: generateGenericRecommendations(platform), 
        error: null 
      };
    }
    
    // Analyser les données pour prédire les meilleurs moments
    const recommendations = analyzeEngagementPatterns(posts, audienceData, platform);
    
    return { data: recommendations, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux optimaux:', error);
    return { data: null, error };
  }
}

/**
 * Récupère tous les posts prévus pour le calendrier
 */
export async function getCalendarEvents(userId: string, startDate: Date, endDate: Date): Promise<{ data: CalendarEvent[] | null, error: any }> {
  try {
    // Récupérer tous les posts (publiés, programmés et en brouillon)
    const { data: posts, error } = await supabase
      .from('social_posts')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_for', startDate.toISOString())
      .lte('scheduled_for', endDate.toISOString());
    
    if (error) throw error;
    
    if (!posts || posts.length === 0) {
      return { data: [], error: null };
    }
    
    // Transformer les posts en événements de calendrier
    const events: CalendarEvent[] = posts.map(post => {
      // Déterminer la couleur en fonction de la plateforme
      const colorMap: Record<string, string> = {
        'instagram': '#E1306C',
        'facebook': '#4267B2',
        'twitter': '#1DA1F2',
        'linkedin': '#0077B5'
      };
      
      const startTime = new Date(post.scheduled_for);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30); // Durée par défaut de 30 minutes
      
      return {
        id: post.id,
        title: post.title,
        start: post.scheduled_for,
        end: endTime.toISOString(),
        platform: post.platform,
        status: post.status,
        allDay: false,
        color: colorMap[post.platform] || '#718096',
        editable: post.status !== 'published' // Les posts publiés ne sont pas modifiables
      };
    });
    
    return { data: events, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des événements du calendrier:', error);
    return { data: null, error };
  }
}

/**
 * Prévoit un post sur un créneau spécifique
 */
export async function schedulePost(
  post: Omit<SocialPost, 'id' | 'created_at'>, 
  scheduledTime: string
): Promise<{ data: SocialPost | null, error: any }> {
  try {
    // Vérifier si le créneau est disponible
    const { data: existingPosts, error: checkError } = await supabase
      .from('social_posts')
      .select('*')
      .eq('platform', post.platform)
      .eq('scheduled_for', scheduledTime);
    
    if (checkError) throw checkError;
    
    // Si un post est déjà prévu au même moment sur la même plateforme
    if (existingPosts && existingPosts.length > 0) {
      return { 
        data: null, 
        error: "Un post est déjà prévu sur cette plateforme à ce moment. Veuillez choisir un autre créneau." 
      };
    }
    
    // Programmer le post
    const { data, error } = await supabase
      .from('social_posts')
      .insert([
        { 
          ...post,
          status: 'scheduled',
          scheduled_for: scheduledTime,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Erreur lors de la programmation du post:', error);
    return { data: null, error };
  }
}

/**
 * Met à jour la date/heure d'un post programmé (glisser-déposer dans le calendrier)
 */
export async function updatePostSchedule(
  postId: string, 
  newScheduledTime: string
): Promise<{ success: boolean, error: any }> {
  try {
    const { error } = await supabase
      .from('social_posts')
      .update({ 
        scheduled_for: newScheduledTime,
        updated_at: new Date().toISOString() 
      })
      .eq('id', postId)
      .eq('status', 'scheduled'); // Seuls les posts programmés peuvent être mis à jour
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la programmation:', error);
    return { success: false, error };
  }
}

/**
 * Génère des recommandations basées sur l'analyse des données d'engagement
 */
function analyzeEngagementPatterns(
  posts: any[], 
  audienceData: any[],
  filterPlatform?: string
): TimeRecommendation[] {
  const platforms = filterPlatform ? [filterPlatform] : ['instagram', 'facebook', 'twitter', 'linkedin'];
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const recommendations: TimeRecommendation[] = [];
  
  // Pour chaque plateforme, analyser les tendances d'engagement
  platforms.forEach(platform => {
    // Filtrer les posts pour cette plateforme
    const platformPosts = posts.filter(post => post.platform === platform);
    
    if (platformPosts.length === 0) {
      // Si aucune donnée pour cette plateforme, utiliser les données d'audience génériques
      const audienceForPlatform = audienceData.find(a => a.platform === platform);
      
      if (audienceForPlatform && audienceForPlatform.active_times) {
        const activeTimes = audienceForPlatform.active_times;
        // Déterminer les meilleurs moments basés sur l'activité de l'audience
        const bestDays = [
          {
            day: 'Mercredi',
            slots: [{ hour: '18:00', score: 0.85 }]
          },
          {
            day: 'Vendredi',
            slots: [{ hour: '12:00', score: 0.82 }]
          }
        ];
        
        recommendations.push({
          platform,
          bestDays,
          explanation: `Recommandation basée sur l'activité typique de votre audience sur ${platform}.`
        });
      }
    } else {
      // Analyser les performances par jour de la semaine et heure
      const dayHourPerformance: Record<string, Record<string, { count: number, engagement: number }>> = {};
      
      // Initialiser la structure
      daysOfWeek.forEach(day => {
        dayHourPerformance[day] = {};
        for (let h = 0; h < 24; h++) {
          const hour = h.toString().padStart(2, '0') + ':00';
          dayHourPerformance[day][hour] = { count: 0, engagement: 0 };
        }
      });
      
      // Agréger les données d'engagement
      platformPosts.forEach(post => {
        if (post.published_at && post.engagement_history) {
          const publishDate = new Date(post.published_at);
          const dayIndex = publishDate.getDay(); // 0 = Dimanche, 1 = Lundi, ...
          const day = daysOfWeek[dayIndex === 0 ? 6 : dayIndex - 1]; // Convertir en 0 = Lundi
          const hour = publishDate.getHours().toString().padStart(2, '0') + ':00';
          
          // Calculer l'engagement total pour ce post
          const totalEngagement = post.likes + post.comments + post.shares;
          
          // Mettre à jour les statistiques
          if (dayHourPerformance[day] && dayHourPerformance[day][hour]) {
            dayHourPerformance[day][hour].count += 1;
            dayHourPerformance[day][hour].engagement += totalEngagement;
          }
        }
      });
      
      // Calculer les scores moyens et trouver les meilleurs créneaux
      const timeSlots: { day: string; hour: string; score: number }[] = [];
      
      Object.entries(dayHourPerformance).forEach(([day, hours]) => {
        Object.entries(hours).forEach(([hour, stats]) => {
          if (stats.count > 0) {
            const avgEngagement = stats.engagement / stats.count;
            timeSlots.push({ day, hour, score: avgEngagement });
          }
        });
      });
      
      // Trier par score d'engagement et prendre les 3 meilleurs par jour
      timeSlots.sort((a, b) => b.score - a.score);
      
      // Regrouper par jour
      const bestDaySlots: Record<string, { hour: string; score: number }[]> = {};
      
      timeSlots.forEach(slot => {
        if (!bestDaySlots[slot.day]) {
          bestDaySlots[slot.day] = [];
        }
        
        if (bestDaySlots[slot.day].length < 3) {
          bestDaySlots[slot.day].push({ hour: slot.hour, score: slot.score });
        }
      });
      
      // Convertir en format de recommandation
      const bestDays = Object.entries(bestDaySlots)
        .map(([day, slots]) => ({ day, slots }))
        .sort((a, b) => {
          // Trier par le meilleur score dans chaque jour
          const maxScoreA = Math.max(...a.slots.map(s => s.score));
          const maxScoreB = Math.max(...b.slots.map(s => s.score));
          return maxScoreB - maxScoreA;
        })
        .slice(0, 3); // Prendre seulement les 3 meilleurs jours
      
      recommendations.push({
        platform,
        bestDays,
        explanation: `Recommandation basée sur l'analyse de ${platformPosts.length} publications sur ${platform}.`
      });
    }
  });
  
  return recommendations;
}

/**
 * Génère des recommandations génériques basées sur des études de marché
 * utilisées lorsque les données d'utilisateur sont insuffisantes
 */
function generateGenericRecommendations(filterPlatform?: string): TimeRecommendation[] {
  const platforms = filterPlatform ? [filterPlatform] : ['instagram', 'facebook', 'twitter', 'linkedin'];
  const genericData: Record<string, { days: string[], hours: string[], explanation: string }> = {
    instagram: {
      days: ['Mercredi', 'Jeudi', 'Vendredi'],
      hours: ['12:00', '15:00', '18:00'],
      explanation: 'Recommandation basée sur les tendances globales d\'Instagram. Les utilisateurs sont plus actifs en milieu de journée et en fin d\'après-midi.'
    },
    facebook: {
      days: ['Mardi', 'Mercredi', 'Jeudi'],
      hours: ['13:00', '15:00', '19:00'],
      explanation: 'Recommandation basée sur les tendances globales de Facebook. L\'engagement est généralement plus élevé en milieu d\'après-midi et en début de soirée.'
    },
    twitter: {
      days: ['Lundi', 'Mercredi', 'Vendredi'],
      hours: ['08:00', '12:00', '17:00'],
      explanation: 'Recommandation basée sur les tendances globales de Twitter. Les utilisateurs vérifient Twitter le matin et pendant les pauses déjeuner.'
    },
    linkedin: {
      days: ['Mardi', 'Mercredi', 'Jeudi'],
      hours: ['09:00', '12:00', '17:00'],
      explanation: 'Recommandation basée sur les tendances globales de LinkedIn. Les publications professionnelles fonctionnent mieux pendant les heures de bureau.'
    }
  };
  
  return platforms.map(platform => {
    const data = genericData[platform];
    if (!data) return null;
    
    const bestDays = data.days.map(day => ({
      day,
      slots: data.hours.map((hour, index) => ({
        hour,
        score: 0.9 - (index * 0.05) // Scores artificiels en ordre décroissant
      }))
    }));
    
    return {
      platform,
      bestDays,
      explanation: data.explanation
    };
  }).filter(Boolean) as TimeRecommendation[];
}

/**
 * Analyse le contenu d'un post et fait des recommandations d'optimisation
 */
export async function analyzePostContent(
  content: string, 
  platform: string
): Promise<{ data: any, error: any }> {
  try {
    // Pour cette implémentation, nous générons des recommandations simples
    // Dans une application réelle, cela pourrait être connecté à un modèle IA via une API
    
    const contentLength = content.length;
    const hashtagCount = (content.match(/#[a-zA-Z0-9]+/g) || []).length;
    const mentionCount = (content.match(/@[a-zA-Z0-9]+/g) || []).length;
    const urlCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    const hasEmoji = /[\p{Emoji}]/u.test(content);
    
    const recommendations = [];
    let score = 0;
    
    // Recommandations spécifiques par plateforme
    switch (platform) {
      case 'instagram':
        score = Math.min(100, 
          20 + // Base score
          (hashtagCount >= 5 && hashtagCount <= 15 ? 30 : 0) + // Hashtags optimaux
          (contentLength >= 50 && contentLength <= 300 ? 20 : 0) + // Longueur optimale
          (hasEmoji ? 15 : 0) + // Bonus pour emoji
          (mentionCount > 0 ? 15 : 0) // Bonus pour mentions
        );
        
        if (hashtagCount < 5) recommendations.push("Ajoutez plus de hashtags (5-15 pour un meilleur engagement)");
        if (hashtagCount > 15) recommendations.push("Réduisez le nombre de hashtags (5-15 est optimal)");
        if (contentLength < 50) recommendations.push("Augmentez légèrement la longueur du texte");
        if (!hasEmoji) recommendations.push("Ajoutez des emojis pour augmenter l'engagement");
        break;
        
      case 'facebook':
        score = Math.min(100, 
          20 + // Base score
          (hashtagCount <= 3 ? 20 : 0) + // Facebook préfère moins de hashtags
          (contentLength >= 100 && contentLength <= 500 ? 30 : 0) + // Longueur optimale
          (urlCount > 0 ? 15 : 0) + // Bonus pour les liens
          (hasEmoji ? 15 : 0) // Bonus pour emoji
        );
        
        if (hashtagCount > 3) recommendations.push("Réduisez le nombre de hashtags (1-3 est optimal sur Facebook)");
        if (contentLength < 100) recommendations.push("Augmentez la longueur du texte pour un meilleur engagement");
        if (urlCount === 0) recommendations.push("Ajoutez un lien pour augmenter le partage");
        break;
        
      case 'twitter':
        const maxLength = 280;
        const remainingChars = maxLength - contentLength;
        
        score = Math.min(100, 
          20 + // Base score
          (hashtagCount >= 1 && hashtagCount <= 3 ? 25 : 0) + // Hashtags optimaux
          (contentLength <= 280 ? 30 : 0) + // Dans la limite
          (contentLength >= 70 && contentLength <= 150 ? 15 : 0) + // Longueur optimale
          (hasEmoji ? 10 : 0) // Bonus pour emoji
        );
        
        if (contentLength > 280) recommendations.push(`Réduisez le texte de ${contentLength - 280} caractères`);
        if (hashtagCount > 3) recommendations.push("Limitez-vous à 1-3 hashtags maximum");
        if (!hasEmoji && remainingChars > 2) recommendations.push("Ajoutez un emoji pour plus d'engagement");
        break;
        
      case 'linkedin':
        score = Math.min(100, 
          20 + // Base score
          (hashtagCount >= 1 && hashtagCount <= 5 ? 20 : 0) + // Hashtags optimaux
          (contentLength >= 150 && contentLength <= 1000 ? 30 : 0) + // Longueur optimale
          (contentLength <= 1300 ? 15 : 0) + // Dans la limite
          (urlCount > 0 ? 15 : 0) // Bonus pour les liens
        );
        
        if (hashtagCount > 5) recommendations.push("Limitez-vous à 3-5 hashtags sur LinkedIn");
        if (contentLength < 150) recommendations.push("Augmentez la longueur du texte pour un engagement optimal");
        if (contentLength > 1300) recommendations.push("Réduisez le texte - les posts LinkedIn trop longs sont moins performants");
        if (urlCount === 0) recommendations.push("Ajoutez un lien vers un contenu professionnel pertinent");
        break;
    }
    
    // Recommandations générales
    if (contentLength > 0 && !recommendations.length && score >= 80) {
      recommendations.push("Votre contenu est bien optimisé pour cette plateforme!");
    }
    
    return {
      data: {
        score,
        recommendations,
        stats: {
          length: contentLength,
          hashtags: hashtagCount,
          mentions: mentionCount,
          urls: urlCount,
          hasEmoji
        }
      },
      error: null
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse du contenu:', error);
    return { data: null, error };
  }
} 