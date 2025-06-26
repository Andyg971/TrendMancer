import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Interface pour les données d'engagement
interface EngagementData {
  post_id: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  posted_at: string;
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

  // Seule la méthode POST est autorisée pour cette endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Extraire les paramètres du corps de la requête
    const { 
      platform = null, 
      startDate = null,
      endDate = null,
      forceUpdate = false 
    } = req.body;

    // Vérifier si une analyse est déjà en cours pour cet utilisateur
    const { data: existingTasks, error: taskError } = await supabase
      .from('system_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_type', 'engagement_analysis')
      .in('status', ['pending', 'in_progress'])
      .limit(1);

    if (taskError) {
      console.error('Erreur lors de la vérification des tâches existantes:', taskError);
      return res.status(500).json({ error: taskError.message });
    }

    // Si une analyse est déjà en cours et que l'utilisateur ne force pas la mise à jour
    if (existingTasks && existingTasks.length > 0 && !forceUpdate) {
      return res.status(409).json({
        error: 'Analyse déjà en cours',
        message: 'Une analyse est déjà en cours. Veuillez réessayer plus tard ou utilisez forceUpdate=true pour lancer une nouvelle analyse.',
        taskId: existingTasks[0].id
      });
    }

    // Si une analyse est en cours mais que l'utilisateur force la mise à jour
    if (existingTasks && existingTasks.length > 0 && forceUpdate) {
      // Marquer les tâches existantes comme "annulées"
      const { error: updateError } = await supabase
        .from('system_tasks')
        .update({ status: 'failed', details: 'Annulée par l\'utilisateur' })
        .eq('id', existingTasks[0].id);

      if (updateError) {
        console.error('Erreur lors de l\'annulation des tâches existantes:', updateError);
        return res.status(500).json({ error: updateError.message });
      }
    }

    // Créer une nouvelle tâche d'analyse
    const taskId = uuidv4();
    const taskDetails = JSON.stringify({
      platform,
      startDate,
      endDate,
      requestedAt: new Date().toISOString()
    });

    const { error: createTaskError } = await supabase
      .from('system_tasks')
      .insert({
        id: taskId,
        user_id: userId,
        task_type: 'engagement_analysis',
        status: 'pending',
        details: taskDetails
      });

    if (createTaskError) {
      console.error('Erreur lors de la création de la tâche:', createTaskError);
      return res.status(500).json({ error: createTaskError.message });
    }

    // Lancer l'analyse en arrière-plan (simulé ici)
    // Dans une application réelle, cela pourrait être fait avec des tâches en arrière-plan
    // comme AWS Lambda, Google Cloud Functions, ou un worker séparé
    processEngagementAnalysis(supabase, userId, taskId, platform, startDate, endDate);

    // Répondre avec l'ID de la tâche
    return res.status(202).json({
      message: 'Analyse d\'engagement lancée avec succès',
      taskId,
      status: 'pending',
      details: 'L\'analyse est en file d\'attente et démarrera bientôt.'
    });
  } catch (error) {
    console.error('Erreur lors du lancement de l\'analyse d\'engagement:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Fonction pour traiter l'analyse d'engagement en arrière-plan
async function processEngagementAnalysis(
  supabase: any,
  userId: string,
  taskId: string,
  platform: string | null,
  startDate: string | null,
  endDate: string | null
) {
  try {
    // Mettre à jour le statut de la tâche
    await updateTaskStatus(supabase, taskId, 'in_progress', 'Collecte des données d\'engagement');

    // Dans une application réelle, vous récupéreriez les données d'engagement de Supabase
    // Pour cet exemple, nous simulons une attente de 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simuler la récupération des données d'engagement
    await updateTaskStatus(supabase, taskId, 'in_progress', 'Analyse des données en cours...');
    
    // Simuler le traitement des données (dans une application réelle, c'est ici que l'analyse serait effectuée)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Créer des créneaux horaires optimaux basés sur l'analyse
    const optimalTimeSlots = generateSampleOptimalTimeSlots(platform);

    // Enregistrer les créneaux horaires optimaux dans la base de données
    const { error: insertError } = await supabase
      .from('optimal_time_slots')
      .upsert(
        optimalTimeSlots.map(slot => ({
          user_id: userId,
          day_of_week: slot.dayOfWeek,
          hour_of_day: slot.hourOfDay,
          platform: slot.platform,
          engagement_score: slot.engagementScore,
          confidence: slot.confidence,
          last_updated: new Date().toISOString()
        })),
        { onConflict: 'user_id, day_of_week, hour_of_day, platform' }
      );

    if (insertError) {
      throw insertError;
    }

    // Mettre à jour le statut de la tâche comme terminée
    await updateTaskStatus(
      supabase, 
      taskId, 
      'completed', 
      `Analyse terminée. ${optimalTimeSlots.length} créneaux horaires optimaux générés.`
    );
  } catch (error) {
    console.error('Erreur lors de l\'analyse d\'engagement:', error);
    
    // Mettre à jour le statut de la tâche comme échouée
    await updateTaskStatus(
      supabase, 
      taskId, 
      'failed', 
      `L'analyse a échoué: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    );
  }
}

// Fonction pour mettre à jour le statut d'une tâche
async function updateTaskStatus(
  supabase: any,
  taskId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'failed',
  details: string
) {
  const updates: any = { status, details };
  
  // Si la tâche est terminée ou a échoué, ajouter l'horodatage de fin
  if (status === 'completed' || status === 'failed') {
    updates.completed_at = new Date().toISOString();
  }
  
  const { error } = await supabase
    .from('system_tasks')
    .update(updates)
    .eq('id', taskId);

  if (error) {
    console.error(`Erreur lors de la mise à jour du statut de la tâche ${taskId}:`, error);
  }
}

// Fonction pour générer des créneaux horaires optimaux d'exemple
function generateSampleOptimalTimeSlots(platform: string | null) {
  const platforms = platform ? [platform] : ['instagram', 'facebook', 'twitter', 'linkedin'];
  const optimalTimeSlots = [];

  // Pour chaque plateforme, générer des créneaux horaires optimaux pour chaque jour de la semaine
  for (const plt of platforms) {
    for (let day = 0; day < 7; day++) {
      // Pour chaque jour, générer 2-3 créneaux horaires optimaux
      const numSlots = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numSlots; i++) {
        // Générer une heure aléatoire (mais réaliste) pour le créneau
        let hour;
        
        if (plt === 'instagram') {
          // Instagram: matin tôt ou soirée
          hour = Math.random() < 0.5 ? 7 + Math.floor(Math.random() * 3) : 18 + Math.floor(Math.random() * 3);
        } else if (plt === 'facebook') {
          // Facebook: fin de matinée ou début de soirée
          hour = Math.random() < 0.5 ? 10 + Math.floor(Math.random() * 3) : 19 + Math.floor(Math.random() * 2);
        } else if (plt === 'twitter') {
          // Twitter: pauses déjeuner ou fin d'après-midi
          hour = Math.random() < 0.5 ? 12 + Math.floor(Math.random() * 2) : 16 + Math.floor(Math.random() * 3);
        } else {
          // LinkedIn: heures de bureau
          hour = 9 + Math.floor(Math.random() * 7);
        }
        
        optimalTimeSlots.push({
          dayOfWeek: day,
          hourOfDay: hour,
          platform: plt,
          engagementScore: 70 + Math.floor(Math.random() * 30),
          confidence: 0.7 + Math.random() * 0.3
        });
      }
    }
  }

  return optimalTimeSlots;
} 