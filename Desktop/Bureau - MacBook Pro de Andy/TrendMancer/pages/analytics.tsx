import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Users,
  Sparkles,
  TrendingUp,
  Users2,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  Repeat2
} from 'lucide-react';

interface User {
  name: string;
  email?: string;
  id?: string;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('apercu');
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    // Simulation d'authentification
    setTimeout(() => {
      const userFromStorage = localStorage.getItem('trendmancer-demo-user');
      if (userFromStorage) {
        setUser(JSON.parse(userFromStorage));
      } else {
        router.push('/login');
      }
      setLoading(false);
    }, 1000);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Données simulées pour les graphiques
  const platformData = [
    { name: 'Instagram', followers: 12500, growth: 5.2, engagement: 4.8, posts: 45 },
    { name: 'Twitter', followers: 8200, growth: 3.1, engagement: 2.5, posts: 68 },
    { name: 'YouTube', followers: 5600, growth: 7.3, engagement: 6.2, posts: 12 },
    { name: 'LinkedIn', followers: 3500, growth: 4.2, engagement: 3.9, posts: 22 },
  ];

  const recentPosts = [
    { id: 1, platform: 'Instagram', date: '2023-06-10', likes: 325, comments: 42, shares: 18 },
    { id: 2, platform: 'Twitter', date: '2023-06-12', likes: 128, comments: 24, shares: 37 },
    { id: 3, platform: 'LinkedIn', date: '2023-06-14', likes: 98, comments: 15, shares: 22 },
    { id: 4, platform: 'YouTube', date: '2023-06-15', likes: 456, comments: 63, shares: 41 },
  ];

  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case '7days': return '7 derniers jours';
      case '30days': return '30 derniers jours';
      case '90days': return '90 derniers jours';
      case 'year': return 'Année en cours';
      default: return '30 derniers jours';
    }
  };

  return (
    <>
      <Head>
        <title>Analytique | TrendMancer</title>
        <meta name="description" content="Statistiques et analyses de performances" />
      </Head>

      <div className="flex min-h-screen bg-white">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0">
          <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                TM
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">TrendMancer</span>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-1">
                <Link href="/dashboard" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <Home className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                  Tableau de bord
                </Link>
                <Link href="/calendar" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <Calendar className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                  Calendrier
                </Link>
                <Link href="/analytics" className="flex items-center px-2 py-2 text-sm font-medium text-blue-700 rounded-md bg-blue-50 group">
                  <BarChart3 className="mr-3 h-5 w-5 text-blue-600" />
                  Analytique
                </Link>
                <Link href="/community" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <MessageSquare className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                  Communauté
                </Link>
                <Link href="/team" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                  Équipe
                </Link>
              </nav>
              <div className="px-4 mt-6">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assistant
                </h3>
                <div className="mt-2 space-y-1">
                  <Link href="/ai-assistant" className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
                    <Sparkles className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                    Assistant IA
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <Image src="/avatar.jpg" alt="Avatar" width={40} height={40} className="inline-block h-9 w-9 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.name || 'Utilisateur'}
                    </p>
                    <Link href="/logout" className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center">
                      <LogOut className="mr-1 h-4 w-4" /> Déconnexion
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Analytique</h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Bell className="h-6 w-6" />
                </button>
                <Link href="/settings" className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <Settings className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Filtres et période */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
                      <button 
                        onClick={() => setActiveTab('apercu')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'apercu' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Aperçu
                      </button>
                      <button 
                        onClick={() => setActiveTab('audience')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'audience' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Audience
                      </button>
                      <button 
                        onClick={() => setActiveTab('contenu')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'contenu' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Contenu
                      </button>
                      <button 
                        onClick={() => setActiveTab('engagement')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'engagement' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Engagement
                      </button>
                    </div>
                  </div>
                  <div>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="7days">7 derniers jours</option>
                      <option value="30days">30 derniers jours</option>
                      <option value="90days">90 derniers jours</option>
                      <option value="year">Année en cours</option>
                    </select>
                  </div>
                </div>

                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <Users2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Audience Totale</p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">29,800</p>
                          <p className="ml-2 text-sm font-medium text-green-600">+4.6%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Engagement</p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">4.2%</p>
                          <p className="ml-2 text-sm font-medium text-green-600">+0.8%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Portée</p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">145,200</p>
                          <p className="ml-2 text-sm font-medium text-green-600">+12.3%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">Commentaires</p>
                        <div className="flex items-baseline">
                          <p className="text-2xl font-semibold text-gray-900">1,843</p>
                          <p className="ml-2 text-sm font-medium text-green-600">+7.2%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graphique principal */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Évolution de l'audience sur {getTimeRangeLabel()}</h2>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-50 text-blue-700">Instagram</button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-500">Twitter</button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-500">YouTube</button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-500">LinkedIn</button>
                    </div>
                  </div>
                  
                  {/* Placeholder pour graphique - utiliser une librairie comme recharts en production */}
                  <div className="w-full h-64 bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-500">Graphique d'évolution de l'audience (à implémenter avec Chart.js ou Recharts)</p>
                  </div>
                </div>

                {/* Statistiques par plateforme */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Statistiques par plateforme</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plateforme</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abonnés</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Croissance</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publications</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {platformData.map((platform, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100">
                                  {platform.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{platform.followers.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${platform.growth > 4 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  +{platform.growth}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{platform.engagement}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{platform.posts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Performances des publications récentes */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Publications récentes</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plateforme</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1" />
                              Likes
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Commentaires
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center">
                              <Share2 className="h-4 w-4 mr-1" />
                              Partages
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPosts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100">
                                  {post.platform.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{post.platform}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{post.likes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{post.comments}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{post.shares}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}