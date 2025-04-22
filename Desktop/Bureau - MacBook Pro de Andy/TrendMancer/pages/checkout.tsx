import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { SubscriptionPlan } from '../types';

const CheckoutPage = () => {
  const router = useRouter();
  const { plan, interval } = router.query;
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basique',
      description: 'Pour les créateurs de contenu individuels',
      price: interval === 'year' ? 199.99 : 19.99,
      interval: (interval as 'month' | 'year') || 'month',
      features: [
        'Accès à l\'assistant IA avancé',
        'Posts illimités',
        '3 réseaux sociaux',
        'Programmation des posts',
        'Analyses détaillées',
        'Support prioritaire'
      ]
    },
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Pour les entreprises et équipes',
      price: interval === 'year' ? 499.99 : 49.99,
      interval: (interval as 'month' | 'year') || 'month',
      features: [
        'Tout du plan Basique',
        'Accès multi-utilisateurs (5)',
        'Tous les réseaux sociaux',
        'Intégrations avancées',
        'Rapports personnalisés',
        'Support 24/7'
      ]
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      description: 'Pour les grandes organisations',
      price: interval === 'year' ? 999.99 : 99.99,
      interval: (interval as 'month' | 'year') || 'month',
      features: [
        'Tout du plan Professionnel',
        'Accès multi-utilisateurs illimité',
        'API dédiée',
        'Gestionnaire de compte dédié',
        'Formation personnalisée',
        'SLA garantie'
      ]
    }
  ];

  useEffect(() => {
    if (plan) {
      const found = subscriptionPlans.find(p => p.id === plan);
      if (found) {
        setSelectedPlan(found);
      } else {
        router.push('/');
      }
    }
  }, [plan, interval, router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validation
    if (cardNumber.length < 19) {
      setError('Le numéro de carte est incomplet.');
      setIsProcessing(false);
      return;
    }

    if (expiryDate.length < 5) {
      setError('La date d\'expiration est invalide.');
      setIsProcessing(false);
      return;
    }

    if (cvv.length < 3) {
      setError('Le code de sécurité est invalide.');
      setIsProcessing(false);
      return;
    }

    if (!cardName) {
      setError('Le nom sur la carte est requis.');
      setIsProcessing(false);
      return;
    }

    // Simuler un traitement de paiement
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      
      // Rediriger vers le tableau de bord après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du traitement du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Paiement réussi !
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Votre abonnement {selectedPlan.name} a été activé avec succès.
            </p>
            <div className="mt-6">
              <Link 
                href="/dashboard" 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Accéder à mon espace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Retour
              </Link>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                TM
              </div>
            </div>

            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Finalisez votre achat
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Activez votre abonnement {selectedPlan.name} pour profiter de toutes les fonctionnalités.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Informations de paiement
                    </h2>

                    {error && (
                      <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Numéro de carte
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="cardNumber"
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom sur la carte
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="cardName"
                            placeholder="Jean Dupont"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date d'expiration
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="expiryDate"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={expiryDate}
                              onChange={handleExpiryDateChange}
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Code de sécurité (CVV)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cvv"
                              placeholder="123"
                              maxLength={4}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? 'Traitement en cours...' : `Payer ${selectedPlan.price.toFixed(2)}€`}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Récapitulatif de commande
                    </h2>
                    
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{selectedPlan.name}</span>
                        <span className="text-gray-900 dark:text-white">{selectedPlan.price.toFixed(2)}€</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPlan.interval === 'month' ? 'Facturation mensuelle' : 'Facturation annuelle'}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Inclus dans votre plan :
                      </h3>
                      <ul className="space-y-2">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Sous-total</span>
                        <span className="text-gray-900 dark:text-white">{selectedPlan.price.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500 dark:text-gray-400">Taxes</span>
                        <span className="text-gray-900 dark:text-white">0.00€</span>
                      </div>
                      <div className="flex justify-between mt-4 font-medium text-lg">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gray-900 dark:text-white">{selectedPlan.price.toFixed(2)}€</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {selectedPlan.interval === 'month' ? 'Facturé mensuellement' : 'Facturé annuellement'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                          Satisfaction garantie
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Garantie de remboursement de 14 jours. Annulez à tout moment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinner {
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 3px solid #3498db;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage; 