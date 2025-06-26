import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Vérifier la table des plans
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*');

    if (plansError) throw plansError;

    // Vérifier la structure des tables
    const { data: tables, error: tablesError } = await supabase
      .rpc('check_subscription_tables');

    if (tablesError) throw tablesError;

    return res.status(200).json({
      success: true,
      message: 'Tables d\'abonnement vérifiées avec succès',
      plans: plans,
      tables: tables
    });
  } catch (error) {
    console.error('Erreur lors de la vérification des tables:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des tables',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 