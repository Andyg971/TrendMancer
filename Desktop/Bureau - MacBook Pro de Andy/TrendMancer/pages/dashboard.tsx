import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowUpRight, 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  LogOut, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  Users,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Utilisateur');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté (mode démo)
    const demoUser = localStorage.getItem('trendmancer-demo-user');
    
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser);
        setUserName(userData.name || 'Utilisateur Démo');
      } catch (e) {
        console.error('Erreur de parsing des données utilisateur');
      }
      setIsLoading(false);
    } else {
      // Rediriger vers la page de connexion si pas d'utilisateur
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('trendmancer-demo-user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-white md:dark:bg-gray-800 md:border-r md:border-gray-200 md:dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            TM
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">TrendMancer</span>
        </div>
        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Home className="w-5 h-5" />
              <span className="mx-4 font-medium">Tableau de bord</span>
            </Link>
            
            <Link href="/calendar" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Calendar className="w-5 h-5" />
              <span className="mx-4 font-medium">Calendrier</span>
            </Link>
            
            <Link href="/analytics" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="mx-4 font-medium">Analytiques</span>
            </Link>
            
            <Link href="/community" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span className="mx-4 font-medium">Communauté</span>
            </Link>
            
            <Link href="/team" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="mx-4 font-medium">Équipe</span>
            </Link>

            <Link href="/ai-assistant" className="flex items-center px-4 py-2 mt-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Sparkles className="w-5 h-5" />
              <span className="mx-4 font-medium">Assistant IA</span>
            </Link>
          </nav>
          
          <div className="px-2 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="mx-4 font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center md:hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              TM
            </div>
          </div>
          
          <div className="flex items-center">
            <button className="p-1 mr-4 text-gray-500 rounded-full hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300">
              <Bell className="w-6 h-6" />
            </button>
            
            <Link href="#" className="flex items-center text-gray-700 dark:text-gray-200">
              <span className="mr-2">{userName}</span>
              <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">{userName.charAt(0)}</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
            <p className="text-gray-600 dark:text-gray-400">Bienvenue dans votre espace TrendMancer, {userName}.</p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Publications ce mois</h3>
                <span className="text-green-500 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium">+12%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span>12% de plus que le mois dernier</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Engagement</h3>
                <span className="text-green-500 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium">+8%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span>8% de plus que le mois dernier</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nouveaux abonnés</h3>
                <span className="text-green-500 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium">+15%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">87</p>
              <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span>15% de plus que le mois dernier</span>
              </div>
            </div>
          </div>

          {/* Upcoming posts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Publications à venir</h2>
              <button className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                <PlusCircle className="w-4 h-4 mr-1" />
                <span>Ajouter</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-4">
                    {/* Randomly select an icon for demo */}
                    {item === 1 ? (
                      <MessageSquare className="w-5 h-5" />
                    ) : item === 2 ? (
                      <Image className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item === 1 
                        ? "Publication Instagram sur les tendances" 
                        : item === 2 
                        ? "Infographie sur LinkedIn" 
                        : "Campagne Twitter #TrendMancer"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Prévu pour le {item === 1 ? "12" : item === 2 ? "15" : "18"} mai 2025
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item === 1 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                    }`}>
                      {item === 1 ? "Prêt" : "En cours"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Preview */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h2 className="text-xl font-bold text-white mb-3">Assistant IA TrendMancer</h2>
                <p className="text-blue-100 mb-4">
                  Générez du contenu engageant, analysez vos performances et obtenez des recommandations personnalisées.
                </p>
                <Link href="/ai-assistant" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium inline-block">
                  Essayer l'assistant
                </Link>
              </div>
              <div className="md:w-1/3">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100/20 flex items-center justify-center text-white">
                      <span>TM</span>
                    </div>
                    <p className="ml-2 text-sm text-white">Assistant TrendMancer</p>
                  </div>
                  <p className="text-white text-sm">
                    Bonjour, je peux vous aider à créer du contenu ou analyser vos performances. Que souhaitez-vous faire aujourd'hui ?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;