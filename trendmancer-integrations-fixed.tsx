import React from 'react';

function IntegrationsModuleFixed() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Intégrations API</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Connectez vos réseaux sociaux et autres services pour étendre les fonctionnalités
          </p>
        </div>
        
        {/* Connected Services */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Services connectés</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white text-xs">
                  IG
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Instagram</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Publiez, programmez et analysez vos posts Instagram
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-end mr-4">
                  <span className="text-sm font-medium">@votre_marque</span>
                  <span className="text-xs text-green-600 dark:text-green-400">Connecté</span>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                  Gérer
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-400 flex items-center justify-center text-white text-xs">
                  TW
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Twitter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gérez vos tweets, réponses et analyses Twitter
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-end mr-4">
                  <span className="text-sm font-medium">@votre_marque</span>
                  <span className="text-xs text-green-600 dark:text-green-400">Connecté</span>
                </div>
                <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                  Gérer
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs">
                  FB
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Facebook</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Publiez sur votre page et votre groupe, analysez l'engagement
                  </p>
                </div>
              </div>
              <div>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                  Connecter
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs">
                  LI
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">LinkedIn</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Partagez du contenu sur votre profil personnel ou page entreprise
                  </p>
                </div>
              </div>
              <div>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                  Connecter
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Available Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
            <h2 className="text-lg font-medium mb-4">Analytiques & CRM</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    GA
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">Google Analytics</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Suivez les performances de vos liens et campagnes
                    </p>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                    Connecté
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    HS
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">HubSpot</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Intégrez vos leads sociaux dans votre CRM
                    </p>
                  </div>
                </div>
                <div>
                  <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                    Configurer
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    SF
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">Salesforce</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Suivez l'engagement social de vos clients
                    </p>
                  </div>
                </div>
                <div>
                  <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                    Configurer
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
            <h2 className="text-lg font-medium mb-4">Automatisation</h2>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    ZP
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">Zapier</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatisez vos workflows entre TrendMancer et +3000 applications
                    </p>
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                    Connecté
                  </span>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    IF
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">IFTTT</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Créez des actions automatiques basées sur des déclencheurs
                    </p>
                  </div>
                </div>
                <div>
                  <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                    Configurer
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs">
                    MK
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-sm">Make (Integromat)</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatisez des processus complexes entre applications
                    </p>
                  </div>
                </div>
                <div>
                  <button className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg">
                    Configurer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* API Access */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">API Access</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Utilisez l'API TrendMancer pour créer vos propres intégrations personnalisées
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Générer une clé API
            </button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Clé API principale</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Créée le 15 février 2025
                </p>
              </div>
              <div className="flex items-center">
                <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm mr-3 font-mono">
                  ••••••••••••••••••••••••••
                </div>
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Limite de requêtes</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10,000</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">requêtes / mois</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Requêtes utilisées</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3,542</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ce mois-ci</p>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Pourcentage utilisé</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">35.4%</div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35.4%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Consultez notre <a href="#" className="font-medium underline">documentation API</a> pour apprendre à créer des intégrations personnalisées avec TrendMancer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Webhooks Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium">Webhooks</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Recevez des notifications en temps réel pour les événements TrendMancer
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Ajouter un webhook
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Événements</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">https://example.com/webhooks/trendmancer</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">post.published</span>
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">comment.received</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">Actif</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                      Tester
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">https://api.yourapp.com/trendmancer</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">analytics.updated</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">Actif</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                      Tester
                    </button>
                    <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegrationsModuleFixed;