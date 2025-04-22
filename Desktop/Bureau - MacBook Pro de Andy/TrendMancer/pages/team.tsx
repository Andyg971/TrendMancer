import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  BarChart3, 
  Bell, 
  Calendar, 
  Home, 
  LogOut, 
  MessageSquare, 
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Award,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  Landmark,
  Plus,
  Filter
} from 'lucide-react';

const TeamPage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('Utilisateur');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');

  // Données simulées pour l'équipe
  const teamMembers = [
    { 
      id: 1, 
      name: 'Thomas Dubois', 
      role: 'Community Manager', 
      email: 'thomas.dubois@trendmancer.com', 
      phone: '+33 6 12 34 56 78', 
      avatar: null,
      status: 'online',
      tasks: 5,
      activePlatforms: ['instagram', 'twitter', 'linkedin']
    },
    { 
      id: 2, 
      name: 'Sophie Laurent', 
      role: 'Content Creator', 
      email: 'sophie.laurent@trendmancer.com', 
      phone: '+33 6 23 45 67 89', 
      avatar: null,
      status: 'online',
      tasks: 3,
      activePlatforms: ['instagram', 'facebook', 'youtube']
    },
    { 
      id: 3, 
      name: 'Alexandre Martin', 
      role: 'Social Media Strategist', 
      email: 'alexandre.martin@trendmancer.com', 
      phone: '+33 6 34 56 78 90', 
      avatar: null,
      status: 'offline',
      tasks: 7,
      activePlatforms: ['twitter', 'linkedin', 'facebook']
    },
    { 
      id: 4, 
      name: 'Marie Lefevre', 
      role: 'Graphic Designer', 
      email: 'marie.lefevre@trendmancer.com', 
      phone: '+33 6 45 67 89 01', 
      avatar: null,
      status: 'busy',
      tasks: 2,
      activePlatforms: ['instagram', 'pinterest']
    },
    { 
      id: 5, 
      name: 'Julien Bernard', 
      role: 'Analytics Specialist', 
      email: 'julien.bernard@trendmancer.com', 
      phone: '+33 6 56 78 90 12', 
      avatar: null,
      status: 'online',
      tasks: 4,
      activePlatforms: ['facebook', 'google']
    },
  ];

  const projects = [
    {
      id: 1,
      name: 'Campagne été 2025',
      startDate: '10 mai 2025',
      endDate: '15 juin 2025',
      status: 'in-progress',
      completion: 45,
      members: [1, 2, 4],
      platforms: ['instagram', 'facebook', 'twitter']
    },
    {
      id: 2,
      name: 'Lancement produit X',
      startDate: '25 mai 2025',
      endDate: '30 juin 2025',
      status: 'planning',
      completion: 20,
      members: [3, 5],
      platforms: ['linkedin', 'twitter']
    },
    {
      id: 3,
      name: 'Refonte stratégie sociale',
      startDate: '1 juin 2025',
      endDate: '31 juillet 2025',
      status: 'planning',
      completion: 10,
      members: [1, 3, 5],
      platforms: ['all']
    },
  ];

  const tasks = [
    {
      id: 1,
      title: 'Créer 5 posts pour Instagram',
      assignedTo: 2,
      dueDate: '15 mai 2025',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Analyser performance des dernières campagnes',
      assignedTo: 5,
      dueDate: '12 mai 2025',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Répondre aux commentaires Facebook',
      assignedTo: 1,
      dueDate: '10 mai 2025',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Concevoir bannières pour Twitter',
      assignedTo: 4,
      dueDate: '20 mai 2025',
      status: 'not-started',
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Préparer rapport mensuel',
      assignedTo: 3,
      dueDate: '31 mai 2025',
      status: 'not-started',
      priority: 'low'
    },
  ];

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

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberById = (id: number) => {
    return teamMembers.find(member => member.id === id);
  };

  const getAssignedTasksCount = (memberId: number) => {
    return tasks.filter(task => task.assignedTo === memberId).length;
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            TM
          </div>
          <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">TrendMancer</span>
        </div>
        <div className="flex flex-col justify-between flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
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
            
            <Link href="/team" className="flex items-center px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Users className="w-5 h-5" />
              <span className="mx-4 font-medium">Équipe</span>
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
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center md:hidden">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
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

        {/* Team content */}
        <main className="flex-1 overflow-auto">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion d'équipe</h1>
              <button className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter
              </button>
            </div>

            {/* Tab navigation */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'members' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Membres
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'projects' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Projets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'tasks' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Tâches
                </button>
              </div>
            </div>

            {/* Members tab */}
            {activeTab === 'members' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Rechercher un membre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  
                  <div className="flex items-center">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mr-3">
                      <Filter className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Membre</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Plateformes</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tâches</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                                    {member.name.charAt(0)}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{member.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.status === 'online' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                                member.status === 'busy' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                              }`}>
                                <span className={`w-2 h-2 mr-1.5 rounded-full ${
                                  member.status === 'online' ? 'bg-green-600 dark:bg-green-400' :
                                  member.status === 'busy' ? 'bg-orange-600 dark:bg-orange-400' :
                                  'bg-gray-600 dark:bg-gray-400'
                                }`}></span>
                                {member.status === 'online' ? 'En ligne' : 
                                 member.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex -space-x-1">
                                {member.activePlatforms.map((platform, index) => (
                                  <div 
                                    key={index}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      platform === 'instagram' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' :
                                      platform === 'facebook' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                      platform === 'twitter' ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300' :
                                      platform === 'linkedin' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' :
                                      platform === 'youtube' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                      platform === 'pinterest' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                    }`}
                                  >
                                    {platform.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{getAssignedTasksCount(member.id)} tâches assignées</div>
                              <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" 
                                  style={{ width: `${(getAssignedTasksCount(member.id) / 10) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center mb-1">
                                <Mail className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{member.phone}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Projects tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projets en cours</h2>
                  <button className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Nouveau projet
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                            project.status === 'planning' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                            'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          }`}>
                            {project.status === 'in-progress' ? 'En cours' : 
                             project.status === 'planning' ? 'Planification' : 'Terminé'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{project.startDate} - {project.endDate}</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Progression</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{project.completion}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div 
                              className={`h-full rounded-full ${
                                project.status === 'in-progress' ? 'bg-blue-600 dark:bg-blue-500' :
                                project.status === 'planning' ? 'bg-blue-600 dark:bg-blue-500' :
                                'bg-green-600 dark:bg-green-500'
                              }`}
                              style={{ width: `${project.completion}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <Landmark className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Plateformes</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.platforms.map((platform, index) => (
                              <span 
                                key={index}
                                className={`px-2 py-0.5 text-xs rounded-full ${
                                  platform === 'instagram' ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300' :
                                  platform === 'facebook' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                                  platform === 'twitter' ? 'bg-sky-100 dark:bg-sky-900/20 text-sky-800 dark:text-sky-300' :
                                  platform === 'linkedin' ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300' :
                                  platform === 'all' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}
                              >
                                {platform === 'all' ? 'Toutes les plateformes' : platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <Users className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Équipe</span>
                          </div>
                          <div className="flex -space-x-2">
                            {project.members.map((memberId) => {
                              const member = getMemberById(memberId);
                              return (
                                <div 
                                  key={memberId}
                                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium ring-2 ring-white dark:ring-gray-800"
                                  title={member ? member.name : 'Membre'}
                                >
                                  {member ? member.name.charAt(0) : '?'}
                                </div>
                              );
                            })}
                            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 ring-2 ring-white dark:ring-gray-800">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tasks tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tâches de l'équipe</h2>
                  <button className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-lg">
                    <Plus className="w-4 h-4 mr-1" />
                    Créer une tâche
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tâche</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assigné à</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date limite</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priorité</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => {
                          const assignedTo = getMemberById(task.assignedTo);
                          return (
                            <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs">
                                    {assignedTo ? assignedTo.name.charAt(0) : '?'}
                                  </div>
                                  <div className="ml-2 text-sm text-gray-900 dark:text-white">
                                    {assignedTo ? assignedTo.name : 'Non assigné'}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">{task.dueDate}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.priority === 'high' 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                    : task.priority === 'medium' 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                }`}>
                                  {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                                  task.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                }`}>
                                  {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                                  {task.status === 'in-progress' && <Clock className="h-3.5 w-3.5 mr-1" />}
                                  {task.status === 'completed' ? 'Terminé' : 
                                   task.status === 'in-progress' ? 'En cours' : 'Non commencé'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Modifier</button>
                                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;