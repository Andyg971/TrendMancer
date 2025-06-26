import React, { useEffect } from 'react';
import { SubscriptionPlan } from '../services/subscriptionService';
import Link from 'next/link';
import { Info, Lock } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { logger } from '../utils/logger';

interface SubscriptionFeatureCheckProps {
  featureName: keyof SubscriptionPlan['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Composant qui vérifie si l'utilisateur a accès à une fonctionnalité spécifique
 * en fonction de son abonnement actuel.
 */
const SubscriptionFeatureCheck: React.FC<SubscriptionFeatureCheckProps> = ({ 
  featureName, 
  children, 
  fallback 
}) => {
  const { checkFeatureAccess, isLoading } = useSubscriptionStore();

  useEffect(() => {
    logger.debug('Vérification accès fonctionnalité', { featureName });
  }, [featureName]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4" role="status">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const hasAccess = checkFeatureAccess(featureName);

  if (hasAccess) {
    logger.debug('Accès autorisé à la fonctionnalité', { featureName });
    return <>{children}</>;
  }

  if (fallback) {
    logger.debug('Affichage du contenu de remplacement', { featureName });
    return <>{fallback}</>;
  }

  logger.info('Accès refusé à la fonctionnalité', { featureName });
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Lock className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Fonctionnalité Premium</h3>
      <p className="text-gray-500 mb-4">
        Cette fonctionnalité n'est pas disponible avec votre abonnement actuel.
      </p>
      <div className="flex items-center text-sm bg-blue-50 p-3 rounded-md text-blue-700">
        <Info className="h-4 w-4 mr-2" />
        <span>Mettez à niveau votre abonnement pour accéder à cette fonctionnalité.</span>
      </div>
      <Link href="/dashboard/subscription" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Voir les options d'abonnement
      </Link>
    </div>
  );
};

export default SubscriptionFeatureCheck; 