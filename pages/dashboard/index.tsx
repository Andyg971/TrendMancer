import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { TrendingUp, Users, Calendar, MessageSquare, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { AnalyticsData, SocialPost } from '../../types';
import Link from 'next/link';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    period: 'Cette semaine',
    posts_count: 12,
    engagement: {
      likes: 843,
      comments: 156,
      shares: 98,
      impressions: 12567,
      reach: 8934
    },
    top_platforms: [
      { platform: 'Instagram', count: 7 },
      { platform: 'LinkedIn', count: 3 },
      { platform: 'Twitter', count: 2 }
    ],
    growth_rate: 15.8
  });

  const [recentPosts, setRecentPosts] = useState<SocialPost[]>([
    {
      id: '1',
      title: 'Annonce collection printemps',
      content: '✨ Notre collection Printemps 2025 est enfin arrivée ! ✨ Des couleurs vibrantes, des coupes élégantes et des matières durables - tout ce dont vous avez besoin pour accueillir les beaux jours avec style.',
      platform: 'instagram',
      status: 'published',
      published_at: '2023-04-20T10:30:00Z',
      engagement_stats: {
        likes: 345,
        comments: 67,
        shares: 28,
        impressions: 4578,
        reach: 3245
      },
      user_id: 'user1',
      created_at: '2023-04-19T14:25:00Z'
    },
    {
      id: '2',
      title: 'Annonce webinaire marketing',
      content: 'Rejoignez-nous pour un webinaire exclusif sur les dernières tendances du marketing digital. Notre expert partagera ses meilleures stratégies pour développer votre audience.',
      platform: 'linkedin',
      status: 'scheduled',
      scheduled_for: '2023-04-25T15:00:00Z',
      user_id: 'user1',
      created_at: '2023-04-21T09:15:00Z'
    },
    {
      id: '3',
      title: 'Promotion soldes d\'été',
      content: '🔥 Les soldes arrivent ! Profitez de -30% sur toute notre collection d\'été. Dépêchez-vous, stocks limités !',
      platform: 'facebook',
      status: 'draft',
      user_id: 'user1',
      created_at: '2023-04-22T11:45:00Z'
    }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: '1',
      title: 'Publication LinkedIn',
      date: '23 avril 2023, 14:30',
      type: 'post'
    },
    {
      id: '2',
      title: 'Réunion d\'équipe marketing',
      date: '24 avril 2023, 10:00',
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Webinaire marketing digital',
      date: '25 avril 2023, 15:00',
      type: 'event'
    }
  ]);

  // Simuler un appel API
  useEffect(() => {
    // Dans une app réelle, ce serait un appel API à Supabase ici
  }, []);

  const StatCard = ({ title, value, icon: Icon, change, changeType }: { title: string, value: string | number, icon: any, change?: number, changeType?: 'up' | 'down' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{value}</h3>
          {change !== undefined && (
            <p className={`mt-1 text-sm flex items-center ${
              changeType === 'up' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {changeType === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {change}% depuis le mois dernier
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Bienvenue sur votre espace de gestion des réseaux sociaux</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/dashboard/assistant" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/30 transition flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Assistant IA
          </Link>
          <Link href="/dashboard/scheduler" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800/30 transition flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Programmer un post
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Bonjour, Andy! 👋</h2>
            <p className="mb-4 max-w-2xl">Votre présence sur les réseaux sociaux s'améliore. Vous avez reçu <strong>23% plus d'engagement</strong> cette semaine par rapport à la semaine dernière.</p>
            <Link href="/dashboard/analytics" className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition inline-flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Voir les analyses complètes
            </Link>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm font-semibold">Suggestion de l'IA</p>
            <p className="text-sm mt-1">Essayez de publier du contenu interactif cette semaine pour augmenter votre engagement de 30%.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Publications" 
          value={analyticsData.posts_count} 
          icon={MessageSquare} 
          change={12.5} 
          changeType="up" 
        />
        <StatCard 
          title="Engagement" 
          value={analyticsData.engagement.likes + analyticsData.engagement.comments + analyticsData.engagement.shares} 
          icon={TrendingUp} 
          change={8.3} 
          changeType="up" 
        />
        <StatCard 
          title="Impressions" 
          value={analyticsData.engagement.impressions.toLocaleString()} 
          icon={Users} 
          change={15.8} 
          changeType="up" 
        />
        <StatCard 
          title="Événements à venir" 
          value={upcomingEvents.length} 
          icon={Calendar} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Publications récentes
              </h2>
              <a 
                href="#" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Voir tout
              </a>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.platform === 'instagram' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                              : post.platform === 'linkedin' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </span>
                        <span 
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : post.status === 'scheduled' 
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {post.status === 'published' 
                            ? 'Publié' 
                            : post.status === 'scheduled' 
                            ? 'Programmé' 
                            : 'Brouillon'}
                        </span>
                      </div>
                      <h3 className="mt-2 text-md font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {post.content}
                      </p>
                      {post.published_at && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Publié le {new Date(post.published_at).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      {post.scheduled_for && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Programmé pour le {new Date(post.scheduled_for).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    {post.engagement_stats && (
                      <div className="flex space-x-3 text-xs text-gray-500 dark:text-gray-400 ml-4">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{post.engagement_stats.likes}</span>
                          <span>J'aime</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{post.engagement_stats.comments}</span>
                          <span>Comm.</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold">{post.engagement_stats.shares}</span>
                          <span>Partages</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/dashboard/scheduler" className="w-full py-2 px-4 border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition flex items-center justify-center">
                <Clock className="w-4 h-4 mr-2" />
                Créer une nouvelle publication
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Agenda
              </h2>
              <Link 
                href="/dashboard/smart-calendar" 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    event.type === 'post' 
                      ? 'bg-blue-100 dark:bg-blue-900/30' 
                      : event.type === 'meeting' 
                      ? 'bg-purple-100 dark:bg-purple-900/30' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}>
                    {event.type === 'post' && <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {event.type === 'meeting' && <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    {event.type === 'event' && <Calendar className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/smart-calendar" className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Ajouter un événement
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Répartition par plateforme
            </h2>
            <div className="space-y-4">
              {analyticsData.top_platforms.map((platform, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{platform.platform}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{platform.count} posts</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 
                          ? 'bg-blue-600' 
                          : index === 1 
                          ? 'bg-purple-600' 
                          : 'bg-green-600'
                      }`} 
                      style={{ width: `${(platform.count / analyticsData.posts_count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 