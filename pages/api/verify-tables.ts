import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Vérifier la table subscription_plans
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('id, name, monthly_price');

    if (plansError) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de la table subscription_plans',
        error: plansError.message
      });
    }

    // Vérifier la table subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('id')
      .limit(1);

    if (subsError) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de la table subscriptions',
        error: subsError.message
      });
    }

    // Vérifier la table payment_history
    const { data: payments, error: paymentsError } = await supabase
      .from('payment_history')
      .select('id')
      .limit(1);

    if (paymentsError) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de la table payment_history',
        error: paymentsError.message
      });
    }

    // Tout est OK
    return res.status(200).json({
      success: true,
      message: 'Toutes les tables sont correctement créées',
      data: {
        plans_count: plans?.length || 0,
        has_subscriptions_table: true,
        has_payment_history_table: true,
        subscription_plans: plans
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des tables',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
} 