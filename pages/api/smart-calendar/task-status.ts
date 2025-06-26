import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Interface pour les tâches système
interface SystemTask {
  id: string;
  user_id: string;
  task_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
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

  // Seule la méthode GET est autorisée pour cette endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Extraire les paramètres de requête
    const { taskId, taskType } = req.query;

    // Créer la requête de base
    let query = supabase
      .from('system_tasks')
      .select('*')
      .eq('user_id', userId);

    // Filtrer par ID de tâche si spécifié
    if (taskId) {
      query = query.eq('id', taskId);
    }

    // Filtrer par type de tâche si spécifié
    if (taskType) {
      query = query.eq('task_type', taskType);
    }

    // Exécuter la requête
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      return res.status(500).json({ error: error.message });
    }

    // Si aucune tâche n'est trouvée et qu'un ID de tâche a été spécifié
    if ((!data || data.length === 0) && taskId) {
      return res.status(404).json({ 
        error: 'Tâche non trouvée',
        message: `Aucune tâche avec l'ID ${taskId} n'a été trouvée pour cet utilisateur.`
      });
    }

    // Si un ID de tâche a été spécifié, retourner uniquement cette tâche
    if (taskId && data && data.length > 0) {
      const task: SystemTask = data[0];
      
      // Vérifier si la tâche est terminée ou a échoué
      const isCompleted = task.status === 'completed' || task.status === 'failed';
      
      return res.status(200).json({
        task,
        isCompleted,
        message: getTaskStatusMessage(task)
      });
    }

    // Sinon, retourner toutes les tâches
    return res.status(200).json({
      tasks: data,
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

// Fonction pour générer un message basé sur le statut de la tâche
function getTaskStatusMessage(task: SystemTask): string {
  switch (task.status) {
    case 'pending':
      return `La tâche est en attente de traitement.`;
    case 'in_progress':
      return `La tâche est en cours d'exécution. ${task.details || ''}`;
    case 'completed':
      const completedTime = task.completed_at ? new Date(task.completed_at).toLocaleString() : 'récemment';
      return `La tâche a été complétée avec succès à ${completedTime}. ${task.details || ''}`;
    case 'failed':
      const failedTime = task.completed_at ? new Date(task.completed_at).toLocaleString() : 'récemment';
      return `La tâche a échoué à ${failedTime}. Erreur: ${task.details || 'Raison inconnue'}`;
    default:
      return `État de la tâche: ${task.status}`;
  }
} 