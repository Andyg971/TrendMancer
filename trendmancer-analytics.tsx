import React, { useState } from 'react';

// Composants d'icônes simplifiés
const IconChartBar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const IconChartLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18 9l-5 5-2-2-5 5"></path>
  </svg>
);

const IconTrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconMessageSquare = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

// Icônes de réseaux sociaux
const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const AnalyticsModule = () => {
  const [timeRange, setTimeRange] = useState('7j');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  
  // Données simulées
  const overviewData = {
    followers: {
      current: 28426,
      previous: 26932,
      change: 5.5,
      positive: true
    },
    engagement: {
      current: 5.8,
      previous: 4.2,
      change: 38.1,
      positive: true
    },
    impressions: {
      current: 152984,
      previous: 143256,
      change: 6.8,
      positive: true
    },
    clicks: {
      current: 8427,
      previous: 8764,
      change: 3.8,
      positive: false
    }
  };
  
  const socialNetworks = [
    { id: 'facebook', name: 'Facebook', icon: <IconFacebook />, color: 'bg-blue-600', followers: 12453, engagement: 3.2 },
    { id: 'twitter', name: 'Twitter', icon: <IconTwitter />, color: 'bg-blue-400', followers: 8732, engagement: 2.1 },
    { id: 'instagram', name: 'Instagram', icon: <IconInstagram />, color: 'bg-pink-500', followers: 5824, engagement: 8.7 },
    { id: 'linkedin', name: 'LinkedIn', icon: <IconLinkedin />, color: 'bg-blue-700', followers: 1417, engagement: 4.6 }
  ];
  
  const contentTypes = [
    { type: 'Images', percentage: 42, color: 'bg-blue-500' },
    { type: 'Vidéos', percentage: 28, color: 'bg-purple-500' },
    { type: 'Liens', percentage: 18, color: 'bg-green-500' },
    { type: 'Texte', percentage: 12, color: 'bg-orange-500' }
  ];
  
  const bestPerformingPosts = [
    { 
      id: 1, 
      network: 'instagram', 
      content: 'Comment notre client a augmenté son engagement de 300% en 3 mois #SuccessStory', 
      engagement: 12.4,
      impressions: 4582,
      likes: 843,
      comments: 156
    },
    { 
      id: 2, 
      network: 'linkedin', 
      content: 'Découvrez notre nouvelle étude sur les tendances marketing en 2025', 
      engagement: 8.7,
      impressions: 3214,
      likes: 245,
      comments: 68
    },
    { 
      id: 3, 
      network: 'twitter', 
      content: '5 astuces pour optimiser votre stratégie sur les réseaux sociaux #MarketingTips', 
      engagement: 7.5,
      impressions: 2876,
      likes: 194,
      comments: 42
    }
  ];
  
  // Helper pour formater les nombres
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Helper pour obtenir l'icône du réseau social
  const getNetworkIcon = (network) => {
    switch (network) {
      case 'facebook': return <IconFacebook />;
      case 'twitter': return <IconTwitter />;
      case 'instagram': return <IconInstagram />;
      case 'linkedin': return <IconLinkedin />;
      default: return null;
    }
  };
  
  // Helper pour obtenir la couleur du réseau social
  const getNetworkColor = (network) => {
    switch (network) {
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-blue-400';
      case 'instagram': return 'bg-pink-500';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytiques</h1>
          
          <div className="flex items-center space-x-3">
            {/* Sélecteur de période */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${timeRange === '7j' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('7j')}
              >
                7 jours
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${timeRange === '30j' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('30j')}
              >
                30 jours
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${timeRange === '90j' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('90j')}
              >
                3 mois
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${timeRange === 'custom' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setTimeRange('custom')}
              >
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-1"><IconCalendar /></span>
                  Personnalisé
                </div>
              </button>
            </div>
            
            {/* Bouton d'export */}
            <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-sm font-medium">
              <span className="w-4 h-4 mr-1.5"><IconDownload /></span>
              Exporter
            </button>
          </div>
        </div>
        
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard 
            title="Followers" 
            value={formatNumber(overviewData.followers.current)} 
            change={`${overviewData.followers.positive ? '+' : '-'}${overviewData.followers.change}%`} 
            positive={overviewData.followers.positive} 
            icon={<IconUsers />}
          />
          <OverviewCard 
            title="Taux d'engagement" 
            value={`${overviewData.engagement.current}%`} 
            change={`${overviewData.engagement.positive ? '+' : '-'}${overviewData.engagement.change}%`} 
            positive={overviewData.engagement.positive} 
            icon={<IconMessageSquare />}
          />
          <OverviewCard 
            title="Impressions" 
            value={formatNumber(overviewData.impressions.current)} 
            change={`${overviewData.impressions.positive ? '+' : '-'}${overviewData.impressions.change}%`} 
            positive={overviewData.impressions.positive} 
            icon={<IconEye />}
          />
          <OverviewCard 
            title="Clics" 
            value={formatNumber(overviewData.clicks.current)} 
            change={`${overviewData.clicks.positive ? '+' : '-'}${overviewData.clicks.change}%`} 
            positive={overviewData.clicks.positive} 
            icon={<IconTrendingUp />}
          />
        </div>
        
        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Performance par réseau</h2>
              <div className="flex space-x-2">
                <select 
                  className="bg-gray-100 dark:bg-gray-700 border-none rounded-md text-sm p-2"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  <option value="all">Tous les réseaux</option>
                  {socialNetworks.map(network => (
                    <option key={network.id} value={network.id}>{network.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-80 w-full">
              {/* Placeholder pour le graphique */}
              <div className="w-full h-full rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Graphique d'évolution des performances</p>
                  <div className="flex justify-center space-x-4">
                    {socialNetworks.map(network => (
                      <span key={network.id} className="flex items-center text-xs">
                        <span className={`h-3 w-3 rounded-full ${network.color} mr-1`}></span>
                        {network.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Types de contenu</h2>
            </div>

            <div className="space-y-6">
              {contentTypes.map(type => (
                <div key={type.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{type.type}</span>
                    <span className="font-medium">{type.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`${type.color} h-2.5 rounded-full`} style={{ width: `${type.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Réseaux sociaux comparaison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-bold text-lg mb-6">Performance par réseau social</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Réseau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Followers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meilleur jour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Meilleure heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {socialNetworks.map(network => (
                  <tr key={network.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-8 w-8 rounded-full ${network.color} flex items-center justify-center text-white`}>
                          {network.icon}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{network.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatNumber(network.followers)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {network.engagement}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {Math.floor(Math.random() * 20) + 10}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'][Math.floor(Math.random() * 5)]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {`${10 + Math.floor(Math.random() * 8)}:00`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Posts les plus performants */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-lg mb-6">Posts les plus performants</h2>
          
          <div className="space-y-6">
            {bestPerformingPosts.map(post => (
              <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getNetworkColor(post.network)} flex items-center justify-center text-white`}>
                    {getNetworkIcon(post.network)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center">
                        <span className="w-3.5 h-3.5 mr-1"><IconTrendingUp /></span>
                        Engagement: {post.engagement}%
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs px-2.5 py-1 rounded-full flex items-center">
                        <span className="w-3.5 h-3.5 mr-1"><IconEye /></span>
                        Impressions: {formatNumber(post.impressions)}
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-xs px-2.5 py-1 rounded-full">
                        Likes: {formatNumber(post.likes)}
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 text-xs px-2.5 py-1 rounded-full">
                        Commentaires: {formatNumber(post.comments)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de statistiques
const OverviewCard = ({ title, value, change, positive, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className={`text-sm mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {change} {positive ? '↑' : '↓'}
          </p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 h-12 w-12 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;