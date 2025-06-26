import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface OptimizationRequest {
  userId: string;
  platforms: string[];
  contentType?: string;
  audience?: string;
  timezone?: string;
  numberOfSlots?: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier l'authentification
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const token = authorization.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  if (req.method === 'POST') {
    try {
      const {
        userId,
        platforms,
        contentType = 'all',
        audience = 'general',
        timezone = 'Europe/Paris',
        numberOfSlots = 10
      } = req.body as OptimizationRequest;

      if (!userId || !platforms || platforms.length === 0) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Récupérer l'historique d'engagement de l'utilisateur
      const { data: userEngagement, error: engagementError } = await supabase
        .from('user_engagement_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (engagementError) {
        console.error('Erreur lors de la récupération des données d\'engagement:', engagementError);
      }

      // Générer les créneaux optimaux en fonction des données d'engagement
      const optimalSlots = generateOptimalTimeSlots(
        platforms,
        userEngagement || [],
        contentType,
        audience,
        timezone,
        numberOfSlots
      );

      // Enregistrer les résultats dans la base de données
      const { data: savedRequest, error: dbError } = await supabase
        .from('optimal_time_requests')
        .insert({
          user_id: userId,
          platforms,
          content_type: contentType,
          audience,
          timezone,
          optimal_slots: optimalSlots,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erreur d\'enregistrement de la demande:', dbError);
      }

      res.status(200).json({ 
        data: {
          optimalSlots,
          requestId: savedRequest?.id,
          insights: generateInsights(optimalSlots, platforms)
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération des créneaux optimaux:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId, requestId, platform } = req.query;

      if (requestId) {
        // Récupérer une demande spécifique
        const { data, error } = await supabase
          .from('optimal_time_requests')
          .select('*')
          .eq('id', requestId)
          .eq('user_id', userId)
          .single();

        if (error) {
          console.error('Erreur lors de la récupération de la demande:', error);
          return res.status(404).json({ error: 'Demande non trouvée' });
        }

        return res.status(200).json({ data });
      } else if (userId) {
        // Récupérer l'historique des demandes de l'utilisateur
        let query = supabase
          .from('optimal_time_requests')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (platform) {
          query = query.contains('platforms', [platform]);
        }

        const { data, error } = await query.limit(20);

        if (error) {
          console.error('Erreur lors de la récupération de l\'historique:', error);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        return res.status(200).json({ data });
      } else {
        return res.status(400).json({ error: 'Paramètres manquants' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}

interface OptimalTimeSlot {
  platform: string;
  day: string;
  hour: number;
  minute: number;
  score: number;
  contentType?: string;
  expected_engagement?: number;
}

// Fonction pour générer des créneaux optimaux
function generateOptimalTimeSlots(
  platforms: string[],
  engagementData: any[],
  contentType: string,
  audience: string,
  timezone: string,
  numberOfSlots: number
): OptimalTimeSlot[] {
  // Dans une application réelle, cette fonction analyserait les données d'engagement
  // pour déterminer les meilleurs moments de publication
  const allSlots: OptimalTimeSlot[] = [];
  
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  platforms.forEach(platform => {
    const platformSpecificData = getPlatformOptimalTimes(platform);
    
    // Générer des créneaux pour chaque jour de la semaine
    daysOfWeek.forEach(day => {
      // Heures de pointe générales pour chaque plateforme et jour
      const peakHours = platformSpecificData[day] || [
        { hour: 8, minute: 0 },
        { hour: 12, minute: 30 },
        { hour: 17, minute: 0 },
        { hour: 20, minute: 0 }
      ];
      
      // Ajouter tous les créneaux de pointe
      peakHours.forEach(({ hour, minute }) => {
        // Calculer un score (simulé) basé sur les données d'engagement
        const score = calculateEngagementScore(platform, day, hour, minute, engagementData);
        
        allSlots.push({
          platform,
          day,
          hour,
          minute,
          score,
          contentType,
          expected_engagement: Math.floor(Math.random() * 500) + 100
        });
      });
    });
  });
  
  // Trier par score et prendre les N meilleurs créneaux
  return allSlots
    .sort((a, b) => b.score - a.score)
    .slice(0, numberOfSlots);
}

// Fonction pour calculer un score d'engagement simulé
function calculateEngagementScore(
  platform: string,
  day: string,
  hour: number,
  minute: number,
  engagementData: any[]
): number {
  // Dans une application réelle, cette fonction analyserait les données d'engagement
  // pour calculer un score précis basé sur l'historique de l'utilisateur
  
  // Scores de base par plateforme (simulés)
  const basePlatformScores: {[key: string]: number} = {
    instagram: 8.5,
    facebook: 7.2,
    twitter: 6.8,
    linkedin: 7.5,
    tiktok: 9.0,
    pinterest: 6.5
  };
  
  // Ajustements de score par jour (simulés)
  const dayAdjustments: {[key: string]: number} = {
    monday: 0.9,
    tuesday: 1.0,
    wednesday: 1.1,
    thursday: 1.05,
    friday: 0.95,
    saturday: 0.8,
    sunday: 0.85
  };
  
  // Ajustements horaires (simulés)
  let timeAdjustment = 1.0;
  
  // Heures de faible engagement
  if (hour >= 0 && hour < 6) {
    timeAdjustment = 0.5;
  }
  // Heures du matin
  else if (hour >= 6 && hour < 9) {
    timeAdjustment = 0.8;
  }
  // Heures de bureau
  else if (hour >= 9 && hour < 12) {
    timeAdjustment = 0.9;
  }
  // Heures de déjeuner
  else if (hour >= 12 && hour < 14) {
    timeAdjustment = 1.2;
  }
  // Après-midi
  else if (hour >= 14 && hour < 17) {
    timeAdjustment = 0.9;
  }
  // Fin de journée
  else if (hour >= 17 && hour < 20) {
    timeAdjustment = 1.3;
  }
  // Soirée
  else {
    timeAdjustment = 1.1;
  }
  
  // Ajustement basé sur les données d'engagement de l'utilisateur (si disponibles)
  let userDataAdjustment = 1.0;
  if (engagementData && engagementData.length > 0) {
    // Simuler un ajustement basé sur les données
    userDataAdjustment = 0.9 + (Math.random() * 0.3);
  }
  
  // Calculer le score final
  const baseScore = basePlatformScores[platform.toLowerCase()] || 7.0;
  const dayFactor = dayAdjustments[day.toLowerCase()] || 1.0;
  
  return baseScore * dayFactor * timeAdjustment * userDataAdjustment;
}

// Obtenir des créneaux optimaux spécifiques à la plateforme
function getPlatformOptimalTimes(platform: string): any {
  // Créneaux optimaux par plateforme (basés sur des données générales)
  const platformTimes: {[key: string]: any} = {
    instagram: {
      monday: [
        { hour: 7, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 15, minute: 0 },
        { hour: 18, minute: 0 },
        { hour: 21, minute: 0 }
      ],
      wednesday: [
        { hour: 7, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 19, minute: 0 }
      ],
      friday: [
        { hour: 12, minute: 0 },
        { hour: 18, minute: 0 },
        { hour: 20, minute: 0 }
      ],
      saturday: [
        { hour: 11, minute: 0 },
        { hour: 20, minute: 0 }
      ]
    },
    linkedin: {
      tuesday: [
        { hour: 8, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 17, minute: 0 }
      ],
      wednesday: [
        { hour: 9, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 18, minute: 0 }
      ],
      thursday: [
        { hour: 9, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 17, minute: 0 }
      ]
    },
    twitter: {
      monday: [
        { hour: 8, minute: 0 },
        { hour: 12, minute: 0 },
        { hour: 17, minute: 0 },
        { hour: 21, minute: 0 }
      ],
      wednesday: [
        { hour: 9, minute: 0 },
        { hour: 15, minute: 0 },
        { hour: 18, minute: 0 }
      ],
      friday: [
        { hour: 9, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 17, minute: 0 }
      ]
    },
    facebook: {
      tuesday: [
        { hour: 9, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 19, minute: 0 }
      ],
      wednesday: [
        { hour: 12, minute: 0 },
        { hour: 15, minute: 0 },
        { hour: 19, minute: 0 }
      ],
      friday: [
        { hour: 10, minute: 0 },
        { hour: 13, minute: 0 },
        { hour: 19, minute: 0 }
      ]
    }
  };
  
  return platformTimes[platform.toLowerCase()] || {};
}

// Générer des insights basés sur les créneaux optimaux
function generateInsights(optimalSlots: OptimalTimeSlot[], platforms: string[]): any[] {
  const insights = [];
  
  // Insight sur les jours optimaux
  const dayFrequency: {[key: string]: number} = {};
  optimalSlots.forEach(slot => {
    dayFrequency[slot.day] = (dayFrequency[slot.day] || 0) + 1;
  });
  
  const bestDays = Object.entries(dayFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([day]) => day);
  
  insights.push({
    type: 'best_days',
    title: 'Jours optimaux',
    description: `Les meilleurs jours pour publier sont ${bestDays.join(', ')}.`,
    data: dayFrequency
  });
  
  // Insight sur les heures optimales
  const hourFrequency: {[key: number]: number} = {};
  optimalSlots.forEach(slot => {
    hourFrequency[slot.hour] = (hourFrequency[slot.hour] || 0) + 1;
  });
  
  const bestHours = Object.entries(hourFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => hour);
  
  insights.push({
    type: 'best_hours',
    title: 'Heures optimales',
    description: `Les meilleures heures pour publier sont ${bestHours.join('h, ')}h.`,
    data: hourFrequency
  });
  
  // Insight sur les plateformes
  if (platforms.length > 1) {
    const platformScores: {[key: string]: number} = {};
    optimalSlots.forEach(slot => {
      if (!platformScores[slot.platform]) {
        platformScores[slot.platform] = 0;
      }
      platformScores[slot.platform] += slot.score;
    });
    
    const bestPlatform = Object.entries(platformScores)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    insights.push({
      type: 'best_platform',
      title: 'Plateforme optimale',
      description: `${bestPlatform} offre le meilleur potentiel d'engagement pour votre contenu.`,
      data: platformScores
    });
  }
  
  // Calcul de l'engagement potentiel total
  const totalEngagement = optimalSlots.reduce((sum, slot) => sum + (slot.expected_engagement || 0), 0);
  
  insights.push({
    type: 'potential_engagement',
    title: 'Engagement potentiel',
    description: `L'utilisation de ces créneaux optimaux pourrait générer environ ${totalEngagement} engagements.`,
    data: { total: totalEngagement }
  });
  
  return insights;
} 