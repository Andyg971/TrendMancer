import { supabase } from '../utils/supabase';
import { createClient } from '@supabase/supabase-js';
import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionTier, Subscription } from '@/types/subscription';

/**
 * Interface définissant la structure d'un plan d'abonnement
 * @interface SubscriptionPlan
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: {
    social_scheduling: boolean;
    calendar_view: boolean;
    analytics_basic: boolean;
    analytics_advanced: boolean;
    ai_assistant: boolean;
    image_generator: boolean;
    team_members: number;
  };
  limits: {
    posts_per_month: number;
    storage_gb: number;
  };
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodEnd: string;
  billingInterval: 'monthly' | 'annual';
}

// Plans d'abonnement disponibles
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour les particuliers et les petites entreprises qui commencent.',
    price: {
      monthly: 0,
      annual: 0
    },
    features: {
      social_scheduling: true,
      calendar_view: true,
      analytics_basic: true,
      analytics_advanced: false,
      ai_assistant: false,
      image_generator: false,
      team_members: 1
    },
    limits: {
      posts_per_month: 15,
      storage_gb: 1
    }
  },
  {
    id: 'basic',
    name: 'Basique',
    description: 'Pour les créateurs de contenu et les petites entreprises.',
    price: {
      monthly: 12.99,
      annual: 129.90 // ~16% de réduction
    },
    features: {
      social_scheduling: true,
      calendar_view: true,
      analytics_basic: true,
      analytics_advanced: true,
      ai_assistant: false,
      image_generator: false,
      team_members: 3
    },
    limits: {
      posts_per_month: 100,
      storage_gb: 10
    }
  },
  {
    id: 'pro',
    name: 'Professionnel',
    description: 'Pour les professionnels et les entreprises en croissance.',
    price: {
      monthly: 24.99,
      annual: 249.90 // ~16% de réduction
    },
    features: {
      social_scheduling: true,
      calendar_view: true,
      analytics_basic: true,
      analytics_advanced: true,
      ai_assistant: true,
      image_generator: true,
      team_members: 10
    },
    limits: {
      posts_per_month: 500,
      storage_gb: 50
    }
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    description: 'Solution complète pour les grandes organisations.',
    price: {
      monthly: 49.99,
      annual: 499.90 // ~16% de réduction
    },
    features: {
      social_scheduling: true,
      calendar_view: true,
      analytics_basic: true,
      analytics_advanced: true,
      ai_assistant: true,
      image_generator: true,
      team_members: 25
    },
    limits: {
      posts_per_month: 2000,
      storage_gb: 250
    }
  }
];

/**
 * Interface pour la réponse de vérification d'accès aux fonctionnalités
 * @interface FeatureAccessResponse
 */
interface FeatureAccessResponse {
  hasAccess: boolean;
  message?: string;
}

/**
 * Récupère les informations sur l'abonnement actuel de l'utilisateur
 */
export const getCurrentSubscription = async (): Promise<UserSubscription | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Dans une application réelle, vous récupéreriez ces informations depuis Supabase
  // Ici, on simule un abonnement pour démonstration
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();
  
  if (error || !data) {
    // Simulation d'un abonnement gratuit par défaut
    return {
      planId: 'free',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      billingInterval: 'monthly'
    };
  }
  
  return {
    planId: data.plan_id,
    status: data.status,
    currentPeriodEnd: data.current_period_end,
    billingInterval: data.billing_interval
  };
};

/**
 * Vérifie si l'utilisateur a accès à une fonctionnalité spécifique
 * @param {keyof SubscriptionPlan['features']} featureName - Nom de la fonctionnalité à vérifier
 * @returns {Promise<FeatureAccessResponse>} Réponse indiquant si l'accès est autorisé
 * @throws {Error} Si la vérification échoue
 */
export async function hasFeatureAccess(
  featureName: keyof SubscriptionPlan['features']
): Promise<FeatureAccessResponse> {
  try {
    const currentPlan = await getCurrentSubscriptionPlan();
    
    if (!currentPlan) {
      return {
        hasAccess: false,
        message: 'Aucun plan d\'abonnement actif'
      };
    }

    const featureValue = currentPlan.features[featureName];
    const hasAccess = typeof featureValue === 'number' 
      ? featureValue > 0 
      : Boolean(featureValue);

    return {
      hasAccess,
      message: hasAccess 
        ? 'Accès autorisé' 
        : 'Cette fonctionnalité nécessite une mise à niveau'
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'accès:', error);
    throw new Error('Impossible de vérifier l\'accès à la fonctionnalité');
  }
}

/**
 * Récupère le plan d'abonnement actuel de l'utilisateur
 * @returns {Promise<SubscriptionPlan | null>} Le plan d'abonnement actuel ou null
 * @throws {Error} Si la récupération échoue
 */
export async function getCurrentSubscriptionPlan(): Promise<SubscriptionPlan | null> {
  try {
    // Implémentation de la récupération du plan...
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du plan:', error);
    throw new Error('Impossible de récupérer le plan d\'abonnement');
  }
}

/**
 * Vérifie les limites de ressources pour l'utilisateur
 */
export const checkResourceLimit = async (resourceType: keyof SubscriptionPlan['limits']): Promise<{ limit: number; used: number; remaining: number }> => {
  const subscription = await getCurrentSubscription();
  
  if (!subscription) {
    return { limit: 0, used: 0, remaining: 0 };
  }
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.planId);
  
  if (!plan) {
    return { limit: 0, used: 0, remaining: 0 };
  }
  
  const limit = plan.limits[resourceType];
  
  // Dans une application réelle, vous récupéreriez l'utilisation actuelle depuis la base de données
  // Ici, on simule une utilisation aléatoire
  const used = Math.floor(Math.random() * limit * 0.7);
  const remaining = Math.max(0, limit - used);
  
  return { limit, used, remaining };
};

/**
 * Met à jour l'abonnement de l'utilisateur
 */
export const updateSubscription = async (planId: string, billingInterval: 'monthly' | 'annual'): Promise<{ success: boolean; message: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: "Utilisateur non authentifié." };
  }
  
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  
  if (!plan) {
    return { success: false, message: "Plan d'abonnement invalide." };
  }
  
  // Dans une vraie application, vous intégreriez ici avec Stripe, PayPal, etc.
  // pour gérer le paiement
  
  // Une fois le paiement réussi, vous mettriez à jour la base de données
  const now = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (billingInterval === 'annual' ? 12 : 1));
  
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: user.id,
      plan_id: planId,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      billing_interval: billingInterval,
      payment_method: 'simulated'
    });
  
  if (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    return { success: false, message: "Erreur lors de la mise à jour de l'abonnement." };
  }
  
  return { success: true, message: "Abonnement mis à jour avec succès." };
};

/**
 * Annule l'abonnement de l'utilisateur
 */
export const cancelSubscription = async (): Promise<{ success: boolean; message: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, message: "Utilisateur non authentifié." };
  }
  
  // Dans une vraie application, vous intégreriez ici avec votre fournisseur de paiement
  // pour annuler l'abonnement récurrent
  
  const { error } = await supabase
    .from('user_subscriptions')
    .update({ status: 'canceled' })
    .eq('user_id', user.id)
    .eq('status', 'active');
  
  if (error) {
    console.error("Erreur lors de l'annulation de l'abonnement:", error);
    return { success: false, message: "Erreur lors de l'annulation de l'abonnement." };
  }
  
  return { success: true, message: "Abonnement annulé avec succès. Vous aurez accès aux fonctionnalités premium jusqu'à la fin de la période de facturation." };
};

// Récupérer tous les plans d'abonnement disponibles
export async function getSubscriptionPlans() {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('monthly_price', { ascending: true });
    
    if (error) throw error;
    
    return { data: data as SubscriptionPlan[], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des plans d\'abonnement:', error);
    return { data: null, error };
  }
}

// Souscrire à un plan d'abonnement (simulation - à remplacer par une intégration de paiement réelle)
export async function subscribeToMockPlan(planId: string, isAnnual: boolean = false) {
  try {
    // Obtenir l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Utilisateur non authentifié");

    // Obtenir le plan d'abonnement
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) throw new Error("Plan d'abonnement non trouvé");

    // Calculer les dates de période
    const now = new Date();
    const periodStart = now.toISOString();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + (isAnnual ? 12 : 1));

    // Vérifier si l'utilisateur a déjà un abonnement
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let operation;
    if (existingSubscription) {
      // Mettre à jour l'abonnement existant
      operation = supabase
        .from('user_subscriptions')
        .update({
          plan_id: planId,
          status: 'active',
          current_period_start: periodStart,
          current_period_end: periodEnd.toISOString(),
          is_annual: isAnnual,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      // Créer un nouvel abonnement
      operation = supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          current_period_start: periodStart,
          current_period_end: periodEnd.toISOString(),
          is_annual: isAnnual
        });
    }

    const { error: subscriptionError } = await operation;
    if (subscriptionError) throw subscriptionError;

    // Simuler un enregistrement de paiement
    const amount = isAnnual ? plan.annual_price : plan.monthly_price;
    if (amount > 0) {
      const { error: paymentError } = await supabase
        .from('payment_history')
        .insert({
          user_id: user.id,
          amount: amount,
          status: 'succeeded',
          payment_method: 'card',
          payment_id: `mock_payment_${Date.now()}`,
          invoice_id: `mock_invoice_${Date.now()}`
        });

      if (paymentError) throw paymentError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Erreur lors de la souscription au plan:', error);
    return { success: false, error };
  }
}

// Récupérer l'historique des paiements
export async function getPaymentHistory() {
  try {
    const { data, error } = await supabase
      .from('payment_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
    return { data: null, error };
  }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export class SubscriptionService {
  // Créer une session de paiement Stripe
  async createCheckoutSession(planId: SubscriptionTier): Promise<string | null> {
    try {
      const { data: { session } } = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      }).then(res => res.json());

      const stripe = await stripePromise;
      if (!stripe || !session) return null;

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) throw error;

      return session.id;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      return null;
    }
  }

  // Récupérer l'abonnement actuel de l'utilisateur
  async getCurrentSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Erreur lors de la récupération de l\'abonnement:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur du service d\'abonnement:', error);
      return null;
    }
  }

  // Annuler un abonnement
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const { success } = await response.json();
      return success;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      return false;
    }
  }

  // Mettre à jour un abonnement
  async updateSubscription(subscriptionId: string, data: Partial<Subscription>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update(data)
        .eq('id', subscriptionId);

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur du service d\'abonnement:', error);
      return false;
    }
  }
} 