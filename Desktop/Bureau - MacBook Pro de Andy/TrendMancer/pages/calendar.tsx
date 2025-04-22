import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bell, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Home, 
  LogOut, 
  MessageSquare, 
  BarChart3,
  Settings,
  Users,
  Sparkles,
  Search,
  PlusCircle, 
  Check,
  X,
  MoreHorizontal,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'all';
  type: 'post' | 'story' | 'video' | 'live' | 'meeting';
  status: 'scheduled' | 'draft' | 'published' | 'cancelled';
  author?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  
  // Données simulées pour le calendrier
  const events: CalendarEvent[] = [
    {
      id: 1,
      title: 'Publication photo produit',
      description: 'Nouvelle collection été',
      date: '2023-06-14',
      startTime: '09:00',
      platform: 'instagram',
      type: 'post',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Vidéo tutoriel',
      description: 'Comment utiliser notre nouveau service',
      date: '2023-06-15',
      startTime: '14:00',
      platform: 'youtube',
      type: 'video',
      status: 'draft'
    },
    {
      id: 3,
      title: 'Annonce nouveau partenariat',
      date: '2023-06-15',
      startTime: '10:30',
      platform: 'linkedin',
      type: 'post',
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Q&A avec les abonnés',
      date: '2023-06-16',
      startTime: '17:00',
      endTime: '18:00',
      platform: 'instagram',
      type: 'live',
      status: 'scheduled'
    },
    {
      id: 5,
      title: 'Promotion weekend',
      date: '2023-06-17',
      startTime: '12:00',
      platform: 'facebook',
      type: 'post',
      status: 'scheduled'
    },
    {
      id: 6,
      title: 'Annonce concours',
      description: 'Faire participer la communauté avec un jeu concours',
      date: '2023-06-20',
      startTime: '09:00',
      platform: 'twitter',
      type: 'post',
      status: 'draft'
    },
    {
      id: 7,
      title: 'Story coulisses',
      date: '2023-06-22',
      startTime: '11:00',
      platform: 'instagram',
      type: 'story',
      status: 'scheduled'
    },
    {
      id: 8,
      title: 'Réunion équipe marketing',
      description: 'Planification du contenu pour le mois prochain',
      date: '2023-06-23',
      startTime: '14:00',
      endTime: '15:30',
      platform: 'all',
      type: 'meeting',
      status: 'scheduled'
    },
    {
      id: 9,
      title: 'Publication article blog',
      date: '2023-06-26',
      startTime: '10:00',
      platform: 'linkedin',
      type: 'post',
      status: 'scheduled'
    },
    {
      id: 10,
      title: 'Live démo produit',
      date: '2023-06-28',
      startTime: '16:00',
      endTime: '17:00',
      platform: 'facebook',
      type: 'live',
      status: 'draft'
    }
  ];

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

  // Navigation dans le calendrier
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Génération du calendrier
  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    
    // Tableau pour stocker tous les jours à afficher
    const days = [];
    
    // Ajouter les jours du mois précédent pour compléter la première semaine
    const firstDayOfWeek = firstDay.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    // Si le premier jour n'est pas un lundi (1), ajouter les jours du mois précédent
    if (firstDayOfWeek !== 1) {
      const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      for (let i = daysToAdd - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, prevMonthLastDay - i);
        days.push({ date, isCurrentMonth: false });
      }
    }
    
    // Ajouter tous les jours du mois en cours
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Ajouter les jours du mois suivant pour compléter la dernière semaine
    const lastDayOfWeek = lastDay.getDay();
    if (lastDayOfWeek !== 0) {
      const daysToAdd = 7 - lastDayOfWeek;
      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(year, month + 1, i);
        days.push({ date, isCurrentMonth: false });
      }
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (selectedPlatformFilter !== 'all' && selectedPlatformFilter !== event.platform) {
        return false;
      }
      return event.date === dateString;
    });
  };

  const formatDateHeader = () => {
    return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const renderCalendar = () => {
    const days = getMonthData();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousMonth} 
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToNextMonth} 
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {formatDateHeader()}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToToday} 
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              Aujourd'hui
            </button>
            <div className="border-l border-gray-300 h-6 mx-2"></div>
                <button 
              onClick={() => setViewMode('month')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${
                viewMode === 'month' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Mois
                </button>
                <button 
              onClick={() => setViewMode('week')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${
                viewMode === 'week' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Semaine
                </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Liste
            </button>
          </div>
        </div>

        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* Jours de la semaine */}
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <div key={index} className="py-2 text-center text-sm font-medium text-gray-500 bg-white">
                {day}
              </div>
            ))}

            {/* Jours du mois */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.date);
              const isToday = day.date.toDateString() === today.toDateString();
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`relative min-h-[100px] p-2 bg-white border-b border-r border-gray-200 ${
                    !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  } ${isToday ? 'bg-blue-50' : ''} ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className={`text-right ${isToday ? 'font-bold text-blue-600' : ''}`}>
                    {day.date.getDate()}
                  </div>
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id}
                        className={`px-2 py-1 text-xs font-medium rounded truncate ${
                          event.platform === 'instagram' ? 'bg-pink-100 text-pink-800' :
                          event.platform === 'facebook' ? 'bg-blue-100 text-blue-800' :
                          event.platform === 'twitter' ? 'bg-sky-100 text-sky-800' :
                          event.platform === 'linkedin' ? 'bg-indigo-100 text-indigo-800' :
                          event.platform === 'youtube' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.startTime && <span className="mr-1">{event.startTime}</span>}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center mt-1">
                        +{dayEvents.length - 3} plus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-8 gap-px bg-gray-200">
                {/* En-têtes des heures et des jours */}
                <div className="py-2 text-center text-sm font-medium text-gray-500 bg-white">
                  Heure
                </div>
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                  <div key={index} className="py-2 text-center text-sm font-medium text-gray-500 bg-white">
                    {day}
                  </div>
                ))}

                {/* Plages horaires */}
                {Array.from({ length: 12 }).map((_, hour) => (
                  <React.Fragment key={hour}>
                    <div className="py-4 text-center text-xs font-medium text-gray-500 bg-white border-t border-gray-200">
                      {`${hour + 8}:00`}
                    </div>
                    {Array.from({ length: 7 }).map((_, day) => (
                      <div key={day} className="py-4 bg-white border-t border-gray-200 relative min-h-[60px]">
                        {/* Ici vous pouvez afficher les événements pour chaque créneau horaire */}
                      </div>
                    ))}
                  </React.Fragment>
              ))}
            </div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="divide-y divide-gray-200">
            {events
              .filter(event => {
                if (selectedPlatformFilter !== 'all' && selectedPlatformFilter !== event.platform) {
                  return false;
                }
                return true;
              })
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(event => {
                const eventDate = new Date(event.date);
                return (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            event.platform === 'instagram' ? 'bg-pink-100 text-pink-600' :
                            event.platform === 'facebook' ? 'bg-blue-100 text-blue-600' :
                            event.platform === 'twitter' ? 'bg-sky-100 text-sky-600' :
                            event.platform === 'linkedin' ? 'bg-indigo-100 text-indigo-600' :
                            event.platform === 'youtube' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {event.platform === 'instagram' && <Instagram className="h-4 w-4" />}
                            {event.platform === 'facebook' && <Facebook className="h-4 w-4" />}
                            {event.platform === 'twitter' && <Twitter className="h-4 w-4" />}
                            {event.platform === 'linkedin' && <Linkedin className="h-4 w-4" />}
                            {event.platform === 'youtube' && <Youtube className="h-4 w-4" />}
                            {event.platform === 'all' && <Calendar className="h-4 w-4" />}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-900">{event.title}</h3>
                            <div className="mt-1 flex items-center text-xs text-gray-500">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                              {event.startTime && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {event.description && (
                          <p className="mt-2 text-sm text-gray-600 ml-12">{event.description}</p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                          event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {event.status === 'scheduled' ? 'Planifié' :
                           event.status === 'draft' ? 'Brouillon' :
                           event.status === 'published' ? 'Publié' :
                           'Annulé'}
                        </span>
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Calendrier | TrendMancer</title>
        <meta name="description" content="Planification de contenu pour les réseaux sociaux" />
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
                <Link href="/calendar" className="flex items-center px-2 py-2 text-sm font-medium text-blue-700 rounded-md bg-blue-50 group">
                  <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                  Calendrier
                </Link>
                <Link href="/analytics" className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group">
                  <BarChart3 className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600" />
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
                <h1 className="text-2xl font-semibold text-gray-900">Calendrier</h1>
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
                {/* Actions et filtres */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowEventModal(true)}
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Nouvelle publication
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="relative inline-block text-left">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={selectedPlatformFilter}
                        onChange={(e) => setSelectedPlatformFilter(e.target.value)}
                      >
                        <option value="all">Toutes les plateformes</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Calendrier */}
                {renderCalendar()}
                
                {/* Informations sur les événements sélectionnés */}
                {selectedDate && (
                  <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Publications du {selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </h3>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setSelectedDate(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Fermer
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200">
                      <ul role="list" className="divide-y divide-gray-200">
                        {getEventsForDate(selectedDate).length > 0 ? (
                          getEventsForDate(selectedDate).map((event) => (
                            <li key={event.id} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                                    event.platform === 'instagram' ? 'bg-pink-100 text-pink-600' :
                                    event.platform === 'facebook' ? 'bg-blue-100 text-blue-600' :
                                    event.platform === 'twitter' ? 'bg-sky-100 text-sky-600' :
                                    event.platform === 'linkedin' ? 'bg-indigo-100 text-indigo-600' :
                                    event.platform === 'youtube' ? 'bg-red-100 text-red-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {event.platform === 'instagram' && <Instagram className="h-5 w-5" />}
                                    {event.platform === 'facebook' && <Facebook className="h-5 w-5" />}
                                    {event.platform === 'twitter' && <Twitter className="h-5 w-5" />}
                                    {event.platform === 'linkedin' && <Linkedin className="h-5 w-5" />}
                                    {event.platform === 'youtube' && <Youtube className="h-5 w-5" />}
                                    {event.platform === 'all' && <Calendar className="h-5 w-5" />}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    {event.description && (
                                      <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                      <Clock className="mr-1 h-3.5 w-3.5" />
                                      {event.startTime}
                                      {event.endTime && ` - ${event.endTime}`}
                                      <span className="mx-1">•</span>
                                      {event.type === 'post' && 'Publication'}
                                      {event.type === 'story' && 'Story'}
                                      {event.type === 'video' && 'Vidéo'}
                                      {event.type === 'live' && 'Live'}
                                      {event.type === 'meeting' && 'Réunion'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    event.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                    event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                    event.status === 'published' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {event.status === 'scheduled' ? 'Planifié' :
                                    event.status === 'draft' ? 'Brouillon' :
                                    event.status === 'published' ? 'Publié' :
                                    'Annulé'}
                        </span>
                                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <MoreHorizontal className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-5 text-center text-gray-500">
                            Aucune publication programmée pour cette date.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}