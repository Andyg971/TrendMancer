import { create, StateCreator } from 'zustand';
import { logger } from '../utils/logger';
import { SubscriptionPlan } from '../services/subscriptionService';

interface SubscriptionState {
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
  features: Record<keyof SubscriptionPlan['features'], boolean>;
  setCurrentPlan: (plan: SubscriptionPlan | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  checkFeatureAccess: (feature: keyof SubscriptionPlan['features']) => boolean;
}

type SubscriptionStore = StateCreator<SubscriptionState>;

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentPlan: null,
  isLoading: false,
  error: null,
  features: {
    social_scheduling: false,
    calendar_view: false,
    analytics_basic: false,
    analytics_advanced: false,
    ai_assistant: false,
    image_generator: false,
    team_members: false
  },
  
  setCurrentPlan: (plan: SubscriptionPlan | null) => {
    logger.info('Mise à jour du plan d\'abonnement', { 
      planId: plan?.id,
      planName: plan?.name 
    });
    
    set({ 
      currentPlan: plan,
      features: plan ? {
        social_scheduling: plan.features.social_scheduling,
        calendar_view: plan.features.calendar_view,
        analytics_basic: plan.features.analytics_basic,
        analytics_advanced: plan.features.analytics_advanced,
        ai_assistant: plan.features.ai_assistant,
        image_generator: plan.features.image_generator,
        team_members: Boolean(plan.features.team_members)
      } : {
        social_scheduling: false,
        calendar_view: false,
        analytics_basic: false,
        analytics_advanced: false,
        ai_assistant: false,
        image_generator: false,
        team_members: false
      }
    });
  },
  
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
  
  setError: (error: string | null) => {
    if (error) {
      logger.error('Erreur abonnement:', new Error(error));
    }
    set({ error });
  },
  
  checkFeatureAccess: (feature: keyof SubscriptionPlan['features']) => {
    const state = get();
    const hasAccess = state.features[feature];
    
    logger.debug('Vérification accès fonctionnalité', {
      feature,
      hasAccess,
      planName: state.currentPlan?.name
    });
    
    return hasAccess;
  },
})); 