import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CreditCard, Check, AlertTriangle, X, Info } from 'lucide-react';
import { 
  getSubscriptionPlans, 
  getCurrentSubscription, 
  subscribeToMockPlan, 
  cancelSubscription,
  SubscriptionPlan,
  UserSubscription,
  updateSubscription,
  SUBSCRIPTION_PLANS
} from '../../services/subscriptionService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '@radix-ui/react-switch';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const PricingCard = ({ 
  plan, 
  currentPlan, 
  isAnnualBilling, 
  onSubscribe 
}: { 
  plan: SubscriptionPlan, 
  currentPlan: UserSubscription | null, 
  isAnnualBilling: boolean, 
  onSubscribe: (planId: string) => void 
}) => {
  const isCurrent = currentPlan ? currentPlan.planId === plan.id : false;
  const price = isAnnualBilling ? plan.price.annual : plan.price.monthly;
  const priceDisplay = price === 0 ? 'Gratuit' : `${price.toFixed(2)}€/${isAnnualBilling ? 'an' : 'mois'}`;
  
  return (
    <Card className={`flex flex-col ${isCurrent ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold mb-4">{priceDisplay}</div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.social_scheduling ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Planification de posts
          </li>
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.calendar_view ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Vue calendrier
          </li>
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.analytics_basic ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Analytiques de base
          </li>
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.analytics_advanced ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Analytiques avancées
          </li>
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.ai_assistant ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Assistant IA
          </li>
          <li className="flex items-center">
            <span className="mr-2">
              {plan.features.image_generator ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
            </span>
            Générateur d'images
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">{plan.features.team_members}</span>
            Membres d'équipe
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">{plan.limits.storage_gb} Go</span>
            Stockage
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-500">{plan.limits.posts_per_month}</span>
            Posts par mois
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onSubscribe(plan.id)} 
          disabled={isCurrent}
          className="w-full"
          variant={isCurrent ? "outline" : "default"}
        >
          {isCurrent ? 'Plan Actuel' : plan.price.monthly === 0 ? 'Commencer Gratuitement' : 'Choisir ce Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

const SubscriptionPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isAnnualBilling, setIsAnnualBilling] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Charger les plans d'abonnement
        const plansData = await getSubscriptionPlans();
        if (plansData && plansData.data) {
          setPlans(plansData.data);
        }
        
        // Charger l'abonnement actuel de l'utilisateur
        const subscriptionData = await getCurrentSubscription();
        if (subscriptionData) {
          setCurrentSubscription(subscriptionData);
          setIsAnnualBilling(subscriptionData.billingInterval === 'annual');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'abonnement:', error);
        toast.error("Impossible de charger les informations d'abonnement.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleToggleBilling = (checked: boolean) => {
    setIsAnnualBilling(checked);
  };
  
  const handleSubscribe = async (planId: string) => {
    if (processingPlanId) return;
    
    setProcessingPlanId(planId);
    try {
      // Si l'utilisateur a déjà un abonnement, mettre à jour
      if (currentSubscription) {
        const result = await updateSubscription(planId, isAnnualBilling ? 'annual' : 'monthly');
        
        if (result.success) {
          const updatedSubscription = await getCurrentSubscription();
          if (updatedSubscription) {
            setCurrentSubscription(updatedSubscription);
          }
          toast.success("Votre abonnement a été mis à jour avec succès!");
        } else {
          throw new Error(result.message);
        }
      } else {
        // Sinon, créer un nouvel abonnement
        const result = await subscribeToMockPlan(planId, isAnnualBilling);
        
        if (result.success) {
          const newSubscription = await getCurrentSubscription();
          if (newSubscription) {
            setCurrentSubscription(newSubscription);
          }
          toast.success("Votre abonnement a été activé avec succès!");
        } else {
          throw new Error(result.error as string);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
      toast.error("Une erreur s'est produite lors de la souscription.");
    } finally {
      setProcessingPlanId(null);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    try {
      const result = await cancelSubscription();
      
      if (result.success) {
        const updatedSubscription = await getCurrentSubscription();
        if (updatedSubscription) {
          setCurrentSubscription(updatedSubscription);
        }
        setShowConfirmCancel(false);
        toast.success("Votre abonnement sera disponible jusqu'à la fin de la période actuelle.");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error("Une erreur s'est produite lors de l'annulation.");
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">Abonnement</h1>
        <p className="text-gray-600 mb-8">Choisissez le plan qui correspond le mieux à vos besoins</p>
        
        {currentSubscription && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Votre abonnement actuel</h2>
            <div className="flex items-start">
              <CreditCard className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">
                  Plan {SUBSCRIPTION_PLANS.find(p => p.id === currentSubscription.planId)?.name || 'Inconnu'}
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      currentSubscription.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' :
                      currentSubscription.status === 'canceled' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {currentSubscription.status === 'active' ? 'Actif' : 
                     currentSubscription.status === 'canceled' ? 'Annulé' : 
                     currentSubscription.status === 'trialing' ? 'En période d\'essai' : 
                     'Problème de paiement'}
                  </Badge>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentSubscription.billingInterval === 'annual' ? 'Facturation annuelle' : 'Facturation mensuelle'}
                </p>
                {currentSubscription.status === 'active' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Prochain renouvellement le {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {currentSubscription.status === 'canceled' && (
                  <div className="mt-2 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-orange-600">
                      Votre abonnement prendra fin le {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Nos formules</h2>
          
          <div className="flex items-center justify-center mt-6">
            <span className={`mr-2 ${!isAnnualBilling ? 'font-medium' : 'text-gray-500'}`}>Mensuel</span>
            <div className="mx-2">
              <Switch
                checked={isAnnualBilling}
                onCheckedChange={handleToggleBilling}
              />
            </div>
            <span className={`mr-2 ${isAnnualBilling ? 'font-medium' : 'text-gray-500'}`}>Annuel</span>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">Économisez 16%</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SUBSCRIPTION_PLANS.map(plan => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={currentSubscription}
              isAnnualBilling={isAnnualBilling}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
        
        {currentSubscription && currentSubscription.planId !== 'free' && (
          <div className="text-center">
            <Button 
              variant="outline" 
              className="text-red-500 border-red-500 hover:bg-red-50"
              onClick={() => setShowConfirmCancel(true)}
            >
              Annuler mon abonnement
            </Button>
          </div>
        )}
        
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Besoin d'une solution personnalisée?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si aucun de nos plans ne correspond à vos besoins, n'hésitez pas à nous contacter pour une solution personnalisée.
                Nous pouvons créer un forfait sur mesure pour votre entreprise.
              </p>
              <Button variant="outline" className="bg-white">Contactez-nous</Button>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showConfirmCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Confirmer l'annulation</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir annuler votre abonnement? Vous pourrez continuer à utiliser les fonctionnalités premium 
                jusqu'à la fin de votre période de facturation actuelle.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConfirmCancel(false)}>
                  Non, conserver
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancelSubscription}
                >
                  Oui, annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default SubscriptionPage; 