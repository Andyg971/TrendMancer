import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Interface pour les événements du calendrier
interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  location?: string;
  event_type: string;
  platform?: string;
  post_id?: string;
  status: string;
  recurrence_rule?: string;
  color?: string;
  reminders?: any[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  
  // Récupérer le token d'authentification
  const token = req.headers.authorization?.split('Bearer ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  
  // Vérifier le token et récupérer l'utilisateur
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  const userId = user.id;
  
  switch (method) {
    case 'GET':
      return await getEvents(req, res, userId);
    case 'POST':
      return await createEvent(req, res, userId);
    case 'PUT':
      return await updateEvent(req, res, userId);
    case 'DELETE':
      return await deleteEvent(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Méthode ${method} non autorisée` });
  }
}

// Récupérer les événements
async function getEvents(
  req: NextApiRequest, 
  res: NextApiResponse,
  userId: string
) {
  const { 
    start, 
    end,
    platform,
    eventType
  } = req.query;
  
  let query = supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId);
  
  // Filtres optionnels
  if (start && end) {
    query = query
      .gte('start_time', start as string)
      .lte('end_time', end as string);
  }
  
  if (platform) {
    query = query.eq('platform', platform);
  }
  
  if (eventType) {
    query = query.eq('event_type', eventType);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
  }
  
  return res.status(200).json(data);
}

// Créer un événement
async function createEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const eventData = req.body;
  
  if (!eventData.title || !eventData.start_time || !eventData.end_time || !eventData.event_type) {
    return res.status(400).json({ error: "Données manquantes pour la création de l'événement" });
  }
  
  // Vérifier s'il y a un conflit d'horaire
  const { data: conflictingEvents } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .lte('start_time', eventData.end_time)
    .gte('end_time', eventData.start_time);
  
  // Métadonnées pour l'événement
  const event = {
    ...eventData,
    user_id: userId,
    status: eventData.status || 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('calendar_events')
    .insert([event])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return res.status(500).json({ error: "Erreur lors de la création de l'événement" });
  }
  
  // Si des conflits ont été détectés, les enregistrer
  if (conflictingEvents && conflictingEvents.length > 0) {
    // Enregistrer les conflits si une table dédiée existe
    await supabase.from('schedule_conflicts').insert(
      conflictingEvents.map(conflict => ({
        user_id: userId,
        event_id: data[0].id,
        conflicting_event_id: conflict.id,
        detected_at: new Date().toISOString()
      }))
    );
    
    // Renvoyer l'événement avec un avertissement de conflit
    return res.status(201).json({
      event: data[0],
      warning: "Des conflits d'horaire ont été détectés",
      conflicts: conflictingEvents
    });
  }
  
  return res.status(201).json(data[0]);
}

// Mettre à jour un événement
async function updateEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { id } = req.query;
  const eventData = req.body;
  
  if (!id) {
    return res.status(400).json({ error: "ID de l'événement manquant" });
  }
  
  // Vérifier que l'événement appartient à l'utilisateur
  const { data: existingEvent, error: fetchError } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (fetchError || !existingEvent) {
    return res.status(404).json({ error: 'Événement non trouvé' });
  }
  
  // Vérifier les conflits si les dates changent
  let conflicts = null;
  if (eventData.start_time || eventData.end_time) {
    const startTime = eventData.start_time || existingEvent.start_time;
    const endTime = eventData.end_time || existingEvent.end_time;
    
    const { data: conflictingEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .neq('id', id)
      .lte('start_time', endTime)
      .gte('end_time', startTime);
    
    conflicts = conflictingEvents;
  }
  
  // Mise à jour de l'événement
  const { data, error } = await supabase
    .from('calendar_events')
    .update({
      ...eventData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return res.status(500).json({ error: "Erreur lors de la mise à jour de l'événement" });
  }
  
  // Si des conflits ont été détectés, les signaler
  if (conflicts && conflicts.length > 0) {
    return res.status(200).json({
      event: data[0],
      warning: "Des conflits d'horaire ont été détectés",
      conflicts
    });
  }
  
  return res.status(200).json(data[0]);
}

// Supprimer un événement
async function deleteEvent(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "ID de l'événement manquant" });
  }
  
  // Vérifier que l'événement appartient à l'utilisateur
  const { data: existingEvent, error: fetchError } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();
  
  if (fetchError || !existingEvent) {
    return res.status(404).json({ error: 'Événement non trouvé' });
  }
  
  // Supprimer l'événement
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
  }
  
  // Supprimer les conflits associés s'ils existent
  await supabase
    .from('schedule_conflicts')
    .delete()
    .or(`event_id.eq.${id},conflicting_event_id.eq.${id}`);
  
  return res.status(200).json({ message: 'Événement supprimé avec succès' });
} 