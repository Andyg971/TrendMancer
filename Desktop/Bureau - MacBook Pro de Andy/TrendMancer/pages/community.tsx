import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Search,
  PlusCircle,
  ThumbsUp,
  MessageCircle,
  Clock,
  Tag,
  MoreHorizontal
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface Topic {
  id: number;
  title: string;
  author: string;
  authorAvatar?: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  lastActivity: string;
  isNew?: boolean;
  isPinned?: boolean;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Données simulées pour le forum
  const categories: Category[] = [
    { id: 1, name: 'Discussions générales', count: 28 },
    { id: 2, name: 'Stratégies marketing', count: 45 },
    { id: 3, name: 'Soutien et entraide', count: 32 },
    { id: 4, name: 'Outils et ressources', count: 19 },
    { id: 5, name: 'Mises à jour', count: 12 },
  ];

  const topics: Topic[] = [
    {
      id: 1,
      title: 'Comment utiliser TikTok pour le marketing B2B ?',
      author: 'Emma Rodriguez',
      authorAvatar: '/avatars/user1.jpg',
      category: 'Stratégies marketing',
      replies: 24,
      views: 152,
      likes: 35,
      lastActivity: '2023-06-15T14:23:00Z',
      isNew: true
    },
    {
      id: 2,
      title: 'Meilleures pratiques pour l\'engagement Instagram en 2023',
      author: 'Thomas Meyer',
      authorAvatar: '/avatars/user2.jpg',
      category: 'Stratégies marketing',
      replies: 36,
      views: 289,
      likes: 52,
      lastActivity: '2023-06-14T09:45:00Z',
      isPinned: true
    },
    {
      id: 3,
      title: 'Présentation: nouveau dans la communauté',
      author: 'Sarah Johnson',
      authorAvatar: '/avatars/user3.jpg',
      category: 'Discussions générales',
      replies: 12,
      views: 87,
      likes: 19,
      lastActivity: '2023-06-13T18:12:00Z'
    },
    {
      id: 4,
      title: 'Quels outils utilisez-vous pour la planification de contenu?',
      author: 'Mark Wilson',
      authorAvatar: '/avatars/user4.jpg',
      category: 'Outils et ressources',
      replies: 29,
      views: 164,
      likes: 43,
      lastActivity: '2023-06-12T11:30:00Z'
    },
    {
      id: 5,
      title: 'Difficulté avec l\'algorithme de LinkedIn - des conseils?',
      author: 'Claire Dubois',
      authorAvatar: '/avatars/user5.jpg',
      category: 'Soutien et entraide',
      replies: 18,
      views: 127,
      likes: 25,
      lastActivity: '2023-06-10T16:45:00Z'
    },
    {
      id: 6,
      title: 'Mise à jour de la plateforme TrendMancer v2.3',
      author: 'Admin',
      authorAvatar: '/avatars/admin.jpg',
      category: 'Mises à jour',
      replies: 8,
      views: 203,
      likes: 41,
      lastActivity: '2023-06-09T08:15:00Z',
      isPinned: true
    },
    {
      id: 7,
      title: 'Comment gérer les commentaires négatifs sur les réseaux sociaux?',
      author: 'David Lee',
      authorAvatar: '/avatars/user6.jpg',
      category: 'Stratégies marketing',
      replies: 31,
      views: 176,
      likes: 28,
      lastActivity: '2023-06-08T13:20:00Z'
    }
  ];

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || topic.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      }
      return `il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return 'hier';
    } else if (diffDays < 7) {
      return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  return (
    <>
      <Head>
        <title>Communauté | TrendMancer</title>
        <meta name="description" content="Forum et discussions pour les utilisateurs de TrendMancer" />
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
                <Link href="/analytics" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <BarChart3 className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
                  Analytique
                </Link>
                <Link href="/community" className="flex items-center px-2 py-2 text-sm font-medium text-blue-700 rounded-md bg-blue-50 group">
                  <MessageSquare className="mr-3 h-5 w-5 text-blue-600" />
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
                <h1 className="text-2xl font-semibold text-gray-900">Communauté</h1>
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
                {/* Searchbar and create post */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                  <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Rechercher des discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Nouvelle discussion
                  </button>
                </div>

                {/* Content layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main forum list */}
                  <div className="flex-1">
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul role="list" className="divide-y divide-gray-200">
                        {filteredTopics.map((topic) => (
                          <li key={topic.id}>
                            <div className="block hover:bg-gray-50">
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center mb-1">
                                      {topic.isPinned && (
                                        <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          Épinglé
                                        </span>
                                      )}
                                      {topic.isNew && (
                                        <span className="inline-flex items-center mr-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Nouveau
                                        </span>
                                      )}
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {topic.category}
                                      </span>
                                    </div>
                                    <Link href={`/community/topic/${topic.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate">
                                      {topic.title}
                                    </Link>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 relative">
                                          {topic.authorAvatar ? (
                                            <Image
                                              src={topic.authorAvatar}
                                              alt={topic.author}
                                              fill
                                              className="rounded-full object-cover"
                                            />
                                          ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                              <span className="text-xs font-medium text-gray-500">
                                                {topic.author.charAt(0)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <span className="ml-2 truncate">{topic.author}</span>
                                      </div>
                                      <span className="mx-2">•</span>
                                      <span>Dernière activité {formatDate(topic.lastActivity)}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end space-y-2">
                                    <div className="flex space-x-4 text-sm text-gray-500">
                                      <span className="flex items-center">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        {topic.replies}
                                      </span>
                                      <span className="flex items-center">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {topic.likes}
                                      </span>
                                    </div>
                                    <span className="flex items-center text-xs text-gray-400">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDate(topic.lastActivity)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                        {filteredTopics.length === 0 && (
                          <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
                            Aucune discussion trouvée pour les critères de recherche actuels.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="w-full lg:w-80 space-y-6">
                    {/* Categories */}
                    <div className="bg-white shadow overflow-hidden rounded-md">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Catégories</h2>
                      </div>
                      <div className="px-4 py-3">
                        <ul className="space-y-2">
                          <li>
                            <button
                              onClick={() => setActiveCategory('all')}
                              className={`w-full flex justify-between items-center rounded-md px-3 py-2 text-sm font-medium ${
                                activeCategory === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <span>Toutes les discussions</span>
                              <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                {topics.length}
                              </span>
                            </button>
                          </li>
                          {categories.map((category) => (
                            <li key={category.id}>
                              <button
                                onClick={() => setActiveCategory(category.name)}
                                className={`w-full flex justify-between items-center rounded-md px-3 py-2 text-sm font-medium ${
                                  activeCategory === category.name ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>{category.name}</span>
                                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                  {category.count}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Community stats */}
                    <div className="bg-white shadow overflow-hidden rounded-md">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Statistiques</h2>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="flex flex-col border-r sm:border-r border-gray-200">
                            <dt className="text-sm font-medium text-gray-500 truncate">Total discussions</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">136</dd>
                          </div>
                          <div className="flex flex-col">
                            <dt className="text-sm font-medium text-gray-500 truncate">Membres actifs</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">427</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Community rules */}
                    <div className="bg-white shadow overflow-hidden rounded-md">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Règles de la communauté</h2>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <ul className="space-y-3 text-sm text-gray-700">
                          <li className="flex">
                            <span className="font-medium mr-2">1.</span>
                            <span>Soyez respectueux envers les autres membres</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium mr-2">2.</span>
                            <span>Publiez du contenu pertinent pour la communauté</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium mr-2">3.</span>
                            <span>Évitez le spam et la promotion excessive</span>
                          </li>
                          <li className="flex">
                            <span className="font-medium mr-2">4.</span>
                            <span>Contribuez de manière constructive aux discussions</span>
                          </li>
                        </ul>
                      </div>
                    </div>
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