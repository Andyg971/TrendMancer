import React from 'react';

function ReportsModuleSimple() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Rapports</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Analysez les performances de vos réseaux sociaux
            </p>
          </div>
          <div className="flex space-x-3">
            <select className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
              <option>Dernier mois</option>
              <option>Derniers 3 mois</option>
              <option>Derniers 6 mois</option>
              <option>Dernière année</option>
              <option>Personnalisé</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
              Exporter
            </button>
          </div>
        </div>
        
        {/* Report Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-6 items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Plateformes</label>
                <div className="flex space-x-1">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm">Toutes</button>
                  <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">Instagram</button>
                  <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">Twitter</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type de contenu</label>
                <select className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <option>Tous types</option>
                  <option>Images</option>
                  <option>Vidéos</option>
                  <option>Texte</option>
                  <option>Liens</option>
                </select>
              </div>
            </div>
            
            <div>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                Générer un rapport
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Engagement total</p>
                <p className="text-2xl font-bold mt-1">18,542</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +12.4% vs période précédente
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Impressions</p>
                <p className="text-2xl font-bold mt-1">254,842</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +8.3% vs période précédente
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nouveaux followers</p>
                <p className="text-2xl font-bold mt-1">1,284</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +5.2% vs période précédente
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Clics</p>
                <p className="text-2xl font-bold mt-1">8,753</p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  -3.1% vs période précédente
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Partages</p>
                <p className="text-2xl font-bold mt-1">4,621</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +14.7% vs période précédente
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Performance Graph */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Performance sur la période</h2>
          
          <div className="h-80 w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Graphique d'évolution des performances</p>
          </div>
          
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Engagement</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Impressions</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Nouveaux followers</span>
            </div>
          </div>
        </div>
        
        {/* Top Performing Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium mb-6">Contenu le plus performant</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contenu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plateforme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impressions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">5 conseils pour optimiser votre...</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Image + texte</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Instagram
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    15 Mar 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">8.7%</div>
                    <div className="text-xs text-green-600 dark:text-green-400">+2.3%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">12,845</div>
                    <div className="text-xs text-green-600 dark:text-green-400">+5.8%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">Présentation de notre nouvelle...</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Vidéo</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      Facebook
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    12 Mar 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">7.2%</div>
                    <div className="text-xs text-green-600 dark:text-green-400">+1.8%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">8,932</div>
                    <div className="text-xs text-green-600 dark:text-green-400">+3.5%</div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex-shrink-0"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">Comment l'IA transforme le...</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Article</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      LinkedIn
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    10 Mar 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">6.5%</div>
                    <div className="text-xs text-green-600 dark:text-green-400">+2.1%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium">5,467</div>
                    <div className="text-xs text-red-600 dark:text-red-400">-1.2%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Voir tous les contenus
            </button>
          </div>
        </div>
        
        {/* Demographics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">Démographiques d'audience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-medium mb-4">Répartition par âge</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>18-24 ans</span>
                    <span className="font-medium">22%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>25-34 ans</span>
                    <span className="font-medium">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>35-44 ans</span>
                    <span className="font-medium">27%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>45+ ans</span>
                    <span className="font-medium">13%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '13%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4">Répartition géographique</h3>
              <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Carte de répartition</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm font-medium">France</div>
                  <div className="text-lg font-bold">42%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm font-medium">Belgique</div>
                  <div className="text-lg font-bold">18%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm font-medium">Canada</div>
                  <div className="text-lg font-bold">15%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="text-sm font-medium">Autres</div>
                  <div className="text-lg font-bold">25%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsModuleSimple;