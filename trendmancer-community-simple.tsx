import React from 'react';

// Interface pour les props du composant MessageItem
interface MessageItemProps {
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | string;
  sender: string;
  time: string;
  date: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  unread: boolean;
}

const CommunityManagementSimple = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion de Communauté</h1>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            Assigner des tâches
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-1 rounded-lg flex mb-6 shadow-sm">
          <button className="flex-1 py-2 text-center rounded-md text-sm font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
            Boîte de réception
            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          </button>
          <button className="flex-1 py-2 text-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Commentaires
            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              2
            </span>
          </button>
          <button className="flex-1 py-2 text-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Mentions
            <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              2
            </span>
          </button>
          <button className="flex-1 py-2 text-center rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Monitoring
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              className="w-full p-2.5 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg" 
              placeholder="Rechercher..." 
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-2 rounded-lg text-sm bg-blue-600 text-white">
              Tous
            </button>
            <button className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
              Instagram
            </button>
            <button className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
              Twitter
            </button>
            <button className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
              Facebook
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <MessageItem 
              platform="instagram" 
              sender="sarah_martin" 
              time="15:42" 
              date="Aujourd'hui" 
              content="Bonjour! J'adore vos produits, mais j'ai une question sur la livraison internationale. Est-ce que vous livrez en Belgique?" 
              sentiment="positive"
              unread={true}
            />
            
            <MessageItem 
              platform="twitter" 
              sender="tech_enthusiast" 
              time="12:18" 
              date="Aujourd'hui" 
              content="Votre service client est vraiment décevant. J'attends une réponse depuis 3 jours maintenant..." 
              sentiment="negative"
              unread={false}
            />
            
            <MessageItem 
              platform="facebook" 
              sender="jean.dupont" 
              time="18:27" 
              date="Hier" 
              content="Est-ce que vous allez proposer des réductions pour le Black Friday cette année?" 
              sentiment="neutral"
              unread={false}
            />
          </ul>
        </div>
        
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Réponse IA suggérée</h2>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              Bonjour sarah_martin! Merci pour votre message et pour votre intérêt dans nos produits. Oui, nous livrons bien en Belgique! Les frais de port sont de 9,95€ pour les commandes inférieures à 50€, et gratuits au-delà. Le délai de livraison est généralement de 3-5 jours ouvrés. N'hésitez pas si vous avez d'autres questions!
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Utiliser cette réponse
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
              Personnaliser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les éléments de message
const MessageItem = ({ platform, sender, time, date, content, sentiment, unread }: MessageItemProps) => {
  // Couleur de la plateforme
  const getPlatformColor = () => {
    switch (platform) {
      case 'instagram': return 'bg-pink-500';
      case 'twitter': return 'bg-blue-400';
      case 'facebook': return 'bg-blue-600';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };
  
  // Icône pour le sentiment
  const getSentimentDisplay = () => {
    if (sentiment === 'positive') {
      return (
        <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
          +
        </span>
      );
    } else if (sentiment === 'negative') {
      return (
        <span className="inline-block w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">
          -
        </span>
      );
    } else {
      return (
        <span className="inline-block w-4 h-4 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">
          =
        </span>
      );
    }
  };
  
  return (
    <li className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 ${unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getPlatformColor()} flex items-center justify-center text-white text-xs font-bold`}>
          {platform.substring(0, 2).toUpperCase()}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium truncate">
                {sender}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {date} à {time}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getSentimentDisplay()}
            </div>
          </div>
          <p className="mt-1 text-sm">
            {content}
          </p>
          <div className="mt-2 flex">
            <button className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 mr-2">
              Répondre
            </button>
            <button className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
              Assigner
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CommunityManagementSimple;