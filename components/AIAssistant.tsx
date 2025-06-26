import React from 'react';

const AIAssistant = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Assistant IA</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Générez du contenu optimisé pour vos réseaux sociaux avec notre assistant IA
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    IA
                  </div>
                  <div className="ml-3">
                    <h2 className="font-semibold">Assistant TrendMancer</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Propulsé par IA avancée</p>
                  </div>
                </div>
                <button className="text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* AI Message */}
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    IA
                  </div>
                  <div className="ml-3 bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none p-4 max-w-3xl">
                    <p className="text-sm">
                      Bonjour ! Je suis l'assistant TrendMancer. Comment puis-je vous aider aujourd'hui ? Je peux vous aider à :
                    </p>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                      <li>Générer des idées de contenu pour vos réseaux sociaux</li>
                      <li>Rédiger des posts adaptés à chaque plateforme</li>
                      <li>Suggérer des hashtags pertinents</li>
                      <li>Analyser les tendances de votre secteur</li>
                      <li>Optimiser vos textes pour maximiser l'engagement</li>
                    </ul>
                  </div>
                </div>
                
                {/* User Message */}
                <div className="flex items-start justify-end">
                  <div className="mr-3 bg-blue-500 text-white rounded-lg rounded-tr-none p-4 max-w-3xl">
                    <p className="text-sm">
                      J'aimerais créer un post pour annoncer notre nouvelle collection de printemps sur Instagram et LinkedIn. Le ton doit être professionnel mais chaleureux.
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold flex-shrink-0">
                    AD
                  </div>
                </div>
                
                {/* AI Response */}
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    IA
                  </div>
                  <div className="ml-3 space-y-4 max-w-3xl">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none p-4">
                      <p className="text-sm">
                        Voici deux suggestions de posts pour annoncer votre nouvelle collection de printemps :
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Instagram</p>
                        <div className="flex">
                          <button className="text-xs text-blue-600 dark:text-blue-400 mr-2">Copier</button>
                          <button className="text-xs text-blue-600 dark:text-blue-400">Utiliser</button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        ✨ Notre collection Printemps 2025 est enfin arrivée ! ✨ Des couleurs vibrantes, des coupes élégantes et des matières durables - tout ce dont vous avez besoin pour accueillir les beaux jours avec style. Swipez pour découvrir nos pièces favorites et rendez-vous en boutique ou sur notre site pour explorer l'intégralité de la collection. #NouvelleCollection #Printemps2025 #ModeResponsable
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">LinkedIn</p>
                        <div className="flex">
                          <button className="text-xs text-blue-600 dark:text-blue-400 mr-2">Copier</button>
                          <button className="text-xs text-blue-600 dark:text-blue-400">Utiliser</button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Nous sommes ravis de vous présenter notre nouvelle collection Printemps 2025, alliant élégance, confort et durabilité. Notre équipe de designers a travaillé avec passion pour créer des pièces intemporelles qui s'intègrent parfaitement dans le quotidien professionnel tout en répondant à nos engagements environnementaux.

                        Découvrez dès maintenant l'intégralité de la collection sur notre site web ou dans nos boutiques partenaires.

                        #NouvelleCollection #ModeDurable #Printemps2025
                      </p>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-none p-4">
                      <p className="text-sm">
                        Souhaitez-vous que j'adapte l'un de ces textes ou que je génère d'autres propositions ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <input 
                    type="text" 
                    placeholder="Écrivez votre message..." 
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                  <button className="ml-2 p-3 bg-blue-600 text-white rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Paramètres de génération</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type de contenu</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option>Post régulier</option>
                    <option>Annonce produit</option>
                    <option>Promotion</option>
                    <option>Événement</option>
                    <option>Témoignage client</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Plateformes</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" checked className="h-4 w-4 text-blue-600 rounded" />
                      <label className="ml-2 text-sm">Instagram</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" checked className="h-4 w-4 text-blue-600 rounded" />
                      <label className="ml-2 text-sm">LinkedIn</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                      <label className="ml-2 text-sm">Facebook</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                      <label className="ml-2 text-sm">Twitter</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Ton</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option>Professionnel</option>
                    <option>Amical</option>
                    <option>Enthousiaste</option>
                    <option>Informatif</option>
                    <option>Humoristique</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Longueur</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option>Courte</option>
                    <option>Moyenne</option>
                    <option>Longue</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mots-clés (séparés par des virgules)</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" 
                    placeholder="ex: printemps, collection, mode"
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                  Générer du contenu
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Historique des générations</h2>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer">
                  <p className="text-sm font-medium">Annonce collection printemps</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aujourd'hui, 14:30</p>
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer">
                  <p className="text-sm font-medium">Promotion soldes d'été</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hier, 10:15</p>
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer">
                  <p className="text-sm font-medium">Publication événement</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">20 Mar, 16:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 