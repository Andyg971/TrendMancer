import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Interface pour les créneaux horaires optimaux
interface OptimalTimeSlot {
  id?: string;
  user_id: string;
  day_of_week: number; // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  hour_of_day: number; // 0-23
  minute_of_hour: number; // 0-59
  platform: string;
  engagement_score: number; // 0-100
  confidence_level: number; // 0-100
  based_on_posts_count: number;
  last_updated: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Créer le client Supabase avec le contexte de la requête
  const supabase = createServerSupabaseClient<Database>({ req, res });

  // Vérifier si l'utilisateur est authentifié
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: 'Non authentifié',
      message: 'Vous devez être connecté pour accéder à cette ressource.',
    });
  }

  const userId = session.user.id;

  // Gérer les différentes méthodes HTTP
  switch (req.method) {
    case 'GET':
      return getOptimalTimes(req, res, supabase, userId);
    case 'POST':
      return analyzeEngagementData(req, res, supabase, userId);
    default:
      return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}

// Fonction pour récupérer les créneaux horaires optimaux
async function getOptimalTimes(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: any,
  userId: string
) {
  try {
    // Extraire les paramètres de requête
    const { platform, day, limit } = req.query;
    
    // Créer la requête de base
    let query = supabase
      .from('optimal_time_slots')
      .select('*')
      .eq('user_id', userId)
      .order('engagement_score', { ascending: false });

    // Filtrer par plateforme si spécifiée
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform);
    }

    // Filtrer par jour de la semaine si spécifié
    if (day && !isNaN(Number(day))) {
      query = query.eq('day_of_week', Number(day));
    }

    // Limiter le nombre de résultats si spécifié
    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des créneaux horaires optimaux:', error);
      return res.status(500).json({ error: error.message });
    }

    // Si aucune donnée n'est trouvée, générer des recommandations par défaut
    if (!data || data.length === 0) {
      const defaultRecommendations = generateDefaultRecommendations(userId);
      return res.status(200).json({
        data: defaultRecommendations,
        message: 'Aucune donnée d\'engagement trouvée. Voici des recommandations génériques basées sur les meilleures pratiques de l\'industrie.'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux horaires optimaux:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Fonction pour analyser les données d'engagement et générer des créneaux optimaux
async function analyzeEngagementData(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: any,
  userId: string
) {
  try {
    const { forceRegenerate } = req.body;
    
    // Vérifier si l'analyse est déjà en cours
    const { data: analysis } = await supabase
      .from('system_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_type', 'engagement_analysis')
      .eq('status', 'in_progress')
      .single();

    if (analysis && !forceRegenerate) {
      return res.status(202).json({ 
        message: 'Analyse déjà en cours',
        task_id: analysis.id 
      });
    }

    // Créer une tâche d'analyse
    const { data: task, error: taskError } = await supabase
      .from('system_tasks')
      .insert({
        user_id: userId,
        task_type: 'engagement_analysis',
        status: 'in_progress',
        details: 'Analyse des données d\'engagement pour générer des créneaux horaires optimaux'
      })
      .select()
      .single();

    if (taskError) {
      console.error('Erreur lors de la création de la tâche d\'analyse:', taskError);
      return res.status(500).json({ error: taskError.message });
    }

    // Démarrer l'analyse en arrière-plan
    setTimeout(() => processEngagementAnalysis(supabase, userId, task.id), 0);

    return res.status(202).json({ 
      message: 'Analyse des données d\'engagement démarrée',
      task_id: task.id
    });
  } catch (error) {
    console.error('Erreur lors de l\'analyse des données d\'engagement:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Fonction pour traiter l'analyse d'engagement en arrière-plan
async function processEngagementAnalysis(supabase: any, userId: string, taskId: string) {
  try {
    // Récupérer les données d'engagement de l'utilisateur
    const { data: engagementData, error: engagementError } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(500);  // Limiter à 500 entrées récentes

    if (engagementError) {
      console.error('Erreur lors de la récupération des données d\'engagement:', engagementError);
      await updateTaskStatus(supabase, taskId, 'failed', 'Erreur lors de la récupération des données d\'engagement');
      return;
    }

    // Si aucune donnée d'engagement n'est disponible, utiliser des recommandations par défaut
    if (!engagementData || engagementData.length === 0) {
      const defaultRecommendations = generateDefaultRecommendations(userId);
      
      // Supprimer les anciens créneaux horaires optimaux
      await supabase
        .from('optimal_time_slots')
        .delete()
        .eq('user_id', userId);
      
      // Insérer les recommandations par défaut
      await supabase
        .from('optimal_time_slots')
        .insert(defaultRecommendations);
      
      await updateTaskStatus(supabase, taskId, 'completed', 'Aucune donnée d\'engagement trouvée. Recommandations génériques générées.');
      return;
    }

    // Analyser les données d'engagement pour trouver les créneaux horaires optimaux
    const optimalTimeSlots = analyzeEngagementForOptimalTimes(engagementData, userId);
    
    // Supprimer les anciens créneaux horaires optimaux
    await supabase
      .from('optimal_time_slots')
      .delete()
      .eq('user_id', userId);
    
    // Insérer les nouveaux créneaux horaires optimaux
    const { error: insertError } = await supabase
      .from('optimal_time_slots')
      .insert(optimalTimeSlots);
    
    if (insertError) {
      console.error('Erreur lors de l\'insertion des créneaux horaires optimaux:', insertError);
      await updateTaskStatus(supabase, taskId, 'failed', 'Erreur lors de l\'insertion des créneaux horaires optimaux');
      return;
    }
    
    await updateTaskStatus(supabase, taskId, 'completed', `${optimalTimeSlots.length} créneaux horaires optimaux générés avec succès`);
  } catch (error) {
    console.error('Erreur lors du traitement de l\'analyse d\'engagement:', error);
    await updateTaskStatus(supabase, taskId, 'failed', 'Erreur inattendue lors de l\'analyse');
  }
}

// Fonction pour mettre à jour le statut d'une tâche
async function updateTaskStatus(supabase: any, taskId: string, status: string, message: string) {
  try {
    await supabase
      .from('system_tasks')
      .update({
        status: status,
        details: message,
        completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null
      })
      .eq('id', taskId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
  }
}

// Fonction pour analyser les données d'engagement et trouver les créneaux optimaux
function analyzeEngagementForOptimalTimes(engagementData: any[], userId: string): OptimalTimeSlot[] {
  // Initialiser les statistiques d'engagement par plateforme, jour de la semaine et heure
  const engagementStats: Record<string, Record<number, Record<number, { 
    totalEngagement: number, 
    count: number, 
    minutes: Record<number, { engagement: number, count: number }>
  }>>> = {};
  
  // Plateformes à suivre
  const platforms = ['instagram', 'twitter', 'facebook', 'linkedin'];
  
  // Initialiser les statistiques pour chaque plateforme
  platforms.forEach(platform => {
    engagementStats[platform] = {};
    
    // Pour chaque jour de la semaine (0-6)
    for (let day = 0; day < 7; day++) {
      engagementStats[platform][day] = {};
      
      // Pour chaque heure de la journée (0-23)
      for (let hour = 0; hour < 24; hour++) {
        engagementStats[platform][day][hour] = { 
          totalEngagement: 0, 
          count: 0,
          minutes: {} 
        };
        
        // Initialiser pour chaque minute (0, 15, 30, 45)
        [0, 15, 30, 45].forEach(minute => {
          engagementStats[platform][day][hour].minutes[minute] = { 
            engagement: 0, 
            count: 0 
          };
        });
      }
    }
  });

  // Traiter les données d'engagement
  engagementData.forEach(data => {
    if (!data.platform || !platforms.includes(data.platform) || !data.timestamp) {
      return;
    }
    
    const date = new Date(data.timestamp);
    const dayOfWeek = date.getDay();
    const hourOfDay = date.getHours();
    const minuteOfHour = Math.floor(date.getMinutes() / 15) * 15;  // Arrondir aux 15 minutes les plus proches
    
    // Calculer le score d'engagement (likes + commentaires + partages)
    const engagementScore = (data.likes || 0) + (data.comments || 0) + (data.shares || 0);
    
    // Ajouter aux statistiques
    engagementStats[data.platform][dayOfWeek][hourOfDay].totalEngagement += engagementScore;
    engagementStats[data.platform][dayOfWeek][hourOfDay].count += 1;
    
    // Ajouter aux statistiques par minute
    if (!engagementStats[data.platform][dayOfWeek][hourOfDay].minutes[minuteOfHour]) {
      engagementStats[data.platform][dayOfWeek][hourOfDay].minutes[minuteOfHour] = { 
        engagement: 0, 
        count: 0 
      };
    }
    
    engagementStats[data.platform][dayOfWeek][hourOfDay].minutes[minuteOfHour].engagement += engagementScore;
    engagementStats[data.platform][dayOfWeek][hourOfDay].minutes[minuteOfHour].count += 1;
  });

  // Générer les créneaux horaires optimaux
  const optimalTimeSlots: OptimalTimeSlot[] = [];
  const now = new Date().toISOString();
  
  platforms.forEach(platform => {
    // Pour chaque jour et heure, trouver les créneaux les plus performants
    for (let day = 0; day < 7; day++) {
      // Trouver les 3 heures les plus performantes pour chaque jour
      const topHours = findTopHours(engagementStats[platform][day], 3);
      
      topHours.forEach(hourData => {
        const hour = hourData.hour;
        const hourStats = engagementStats[platform][day][hour];
        
        // Trouver la minute avec le meilleur engagement dans cette heure
        let bestMinute = 0;
        let bestMinuteEngagement = 0;
        
        Object.entries(hourStats.minutes).forEach(([minute, stats]) => {
          if (stats.count > 0) {
            const avgEngagement = stats.engagement / stats.count;
            if (avgEngagement > bestMinuteEngagement) {
              bestMinuteEngagement = avgEngagement;
              bestMinute = parseInt(minute);
            }
          }
        });
        
        // Calculer le score d'engagement normalisé (0-100)
        const engagementScore = hourData.count > 0 
          ? Math.min(100, (hourData.avgEngagement / 10) * 100)  // Normaliser à 100
          : 0;
        
        // Calculer le niveau de confiance basé sur le nombre d'échantillons
        const confidenceLevel = Math.min(100, (hourData.count / 10) * 100);  // 10+ posts = 100% confiance
        
        optimalTimeSlots.push({
          user_id: userId,
          day_of_week: day,
          hour_of_day: hour,
          minute_of_hour: bestMinute,
          platform: platform,
          engagement_score: engagementScore,
          confidence_level: confidenceLevel,
          based_on_posts_count: hourData.count,
          last_updated: now
        });
      });
    }
  });

  return optimalTimeSlots;
}

// Fonction pour trouver les heures les plus performantes
function findTopHours(dayStats: Record<number, any>, count: number) {
  const hourStats = Object.entries(dayStats).map(([hour, stats]) => {
    const avgEngagement = stats.count > 0 ? stats.totalEngagement / stats.count : 0;
    return {
      hour: parseInt(hour),
      avgEngagement,
      count: stats.count
    };
  });
  
  // Trier par engagement moyen décroissant
  hourStats.sort((a, b) => b.avgEngagement - a.avgEngagement);
  
  // Retourner les N meilleures heures
  return hourStats.slice(0, count);
}

// Fonction pour générer des recommandations par défaut
function generateDefaultRecommendations(userId: string): OptimalTimeSlot[] {
  const defaultRecommendations: OptimalTimeSlot[] = [];
  const now = new Date().toISOString();
  
  // Recommandations génériques basées sur les meilleures pratiques de l'industrie
  const defaultTimes = {
    instagram: [
      { day: 1, hour: 12, minute: 0 },  // Lundi à 12h00
      { day: 3, hour: 15, minute: 0 },  // Mercredi à 15h00
      { day: 5, hour: 17, minute: 30 }, // Vendredi à 17h30
      { day: 6, hour: 11, minute: 0 },  // Samedi à 11h00
    ],
    twitter: [
      { day: 1, hour: 8, minute: 0 },   // Lundi à 8h00
      { day: 2, hour: 9, minute: 0 },   // Mardi à 9h00
      { day: 3, hour: 12, minute: 0 },  // Mercredi à 12h00
      { day: 4, hour: 17, minute: 0 },  // Jeudi à 17h00
    ],
    facebook: [
      { day: 1, hour: 13, minute: 0 },  // Lundi à 13h00
      { day: 3, hour: 16, minute: 0 },  // Mercredi à 16h00
      { day: 4, hour: 15, minute: 0 },  // Jeudi à 15h00
      { day: 0, hour: 13, minute: 0 },  // Dimanche à 13h00
    ],
    linkedin: [
      { day: 2, hour: 10, minute: 0 },  // Mardi à 10h00
      { day: 3, hour: 8, minute: 30 },  // Mercredi à 8h30
      { day: 4, hour: 14, minute: 0 },  // Jeudi à 14h00
      { day: 5, hour: 11, minute: 0 },  // Vendredi à 11h00
    ]
  };
  
  Object.entries(defaultTimes).forEach(([platform, times]) => {
    times.forEach((time, index) => {
      defaultRecommendations.push({
        user_id: userId,
        day_of_week: time.day,
        hour_of_day: time.hour,
        minute_of_hour: time.minute,
        platform,
        engagement_score: 80 - (index * 5),  // Diminuer légèrement le score pour chaque recommandation
        confidence_level: 50,  // Confiance moyenne car ce sont des recommandations génériques
        based_on_posts_count: 0,
        last_updated: now
      });
    });
  });
  
  return defaultRecommendations;
} 