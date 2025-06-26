import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createClient } from '@supabase/supabase-js';
import { Calendar as CalendarIcon, Clock, ChevronDown, Target, BarChart2, Settings, Zap, AlertCircle } from 'lucide-react';
import { getOptimalPostingTimes, getCalendarEvents, TimeRecommendation, CalendarEvent as ServiceCalendarEvent } from '../../services/calendarService';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Localizer pour le calendrier
const localizer = momentLocalizer(moment);

// Interface pour les événements du calendrier pour react-big-calendar
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform: string;
  status: string;
  color?: string;
  resourceId?: string;
}

// Interface pour les créneaux horaires optimaux
interface OptimalTimeSlot {
  dayOfWeek: string; 
  hour: number;
  platform: string;
  engagementScore: number;
}

/**
 * Page du Calendrier Intelligent
 * Affiche un calendrier interactif avec les publications programmées
 * et propose des créneaux horaires optimaux basés sur l'analyse des données
 */
const SmartCalendarPage: React.FC = () => {
  // État pour les événements du calendrier
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // État pour les créneaux horaires optimaux
  const [optimalTimes, setOptimalTimes] = useState<TimeRecommendation[]>([]);
  
  // État pour le chargement des données
  const [loading, setLoading] = useState<boolean>(true);
  
  // État pour les erreurs
  const [error, setError] = useState<string | null>(null);
  
  // État pour l'utilisateur actuel
  const [userId, setUserId] = useState<string | null>(null);
  
  // État pour la plateforme sélectionnée pour le filtrage
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  
  // État pour la vue du calendrier
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('week');
  
  // État pour l'affichage du modal d'ajout d'événement
  const [showAddEventModal, setShowAddEventModal] = useState<boolean>(false);
  
  // État pour l'événement sélectionné
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // État pour l'affichage des créneaux horaires optimaux sur le calendrier
  const [showOptimalTimes, setShowOptimalTimes] = useState<boolean>(true);

  /**
   * Récupérer l'utilisateur actuel à partir de Supabase
   */
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setError('Impossible de récupérer les informations utilisateur.');
      }
    };

    fetchCurrentUser();
  }, []);

  /**
   * Charger les événements du calendrier et les créneaux horaires optimaux
   */
  useEffect(() => {
    if (!userId) return;

    const loadCalendarData = async () => {
      setLoading(true);
      try {
        // Récupérer les événements du calendrier
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3); // Récupérer 3 mois d'événements
        
        const { data: calendarEvents, error: eventsError } = await getCalendarEvents(userId, startDate, endDate);
        
        if (eventsError) {
          throw eventsError;
        }
        
        // Convertir les dates string en objets Date pour react-big-calendar
        const formattedEvents = (calendarEvents || []).map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        
        // Filtrer les événements par plateforme si nécessaire
        const filteredEvents = selectedPlatform === 'all' 
          ? formattedEvents
          : formattedEvents.filter((event: CalendarEvent) => event.platform === selectedPlatform);
        
        setEvents(filteredEvents);
        
        // Récupérer les créneaux horaires optimaux
        const { data: optimalPostingTimes, error: timesError } = await getOptimalPostingTimes(userId, selectedPlatform !== 'all' ? selectedPlatform : undefined);
        
        if (timesError) {
          throw timesError;
        }
        
        setOptimalTimes(optimalPostingTimes || []);
        
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des données du calendrier:', error);
        setError('Impossible de charger les données du calendrier.');
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [userId, selectedPlatform]);

  // Gestion des événements du calendrier
  const handleAddEvent = () => {
    setShowAddEventModal(true);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowAddEventModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      // Dans une application réelle, vous feriez un appel API pour supprimer l'événement
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleSaveEvent = (event: Partial<CalendarEvent>) => {
    // Dans une application réelle, vous feriez un appel API pour créer/mettre à jour l'événement
    if (selectedEvent) {
      // Mise à jour d'un événement existant
      setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...event } as CalendarEvent : e));
    } else {
      // Création d'un nouvel événement
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: event.title || 'Nouvel événement',
        start: event.start || new Date(),
        end: event.end || new Date(Date.now() + 3600000),
        platform: event.platform || 'instagram',
        status: 'draft',
        color: event.platform === 'instagram' ? '#3b82f6' : 
               event.platform === 'facebook' ? '#ef4444' : 
               event.platform === 'twitter' ? '#06b6d4' : 
               event.platform === 'linkedin' ? '#1e40af' : 
               event.platform === 'tiktok' ? '#8b5cf6' : 
               '#6b7280',
        resourceId: `resource-${Date.now()}`
      };
      setEvents([...events, newEvent]);
    }
    setShowAddEventModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <CalendarIcon className="mr-2" size={24} />
          Calendrier Intelligent
        </h1>
        <p className="text-gray-600">
          Planifiez vos publications aux moments optimaux pour maximiser l'engagement
        </p>
      </div>

      {/* Contrôles et filtres */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="platform-filter" className="text-sm font-medium">
              Plateforme:
            </label>
            <div className="relative">
              <select
                id="platform-filter"
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="calendar-view" className="text-sm font-medium">
              Vue:
            </label>
            <div className="relative">
              <select
                id="calendar-view"
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={calendarView}
                onChange={(e) => setCalendarView(e.target.value as 'month' | 'week' | 'day')}
              >
                <option value="month">Mois</option>
                <option value="week">Semaine</option>
                <option value="day">Jour</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showOptimalTimes}
                onChange={() => setShowOptimalTimes(!showOptimalTimes)}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900">Afficher créneaux optimaux</span>
            </label>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          onClick={handleAddEvent}
        >
          <CalendarIcon className="mr-2" size={16} />
          Nouvelle publication
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Indicateur de chargement */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Légende du calendrier */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Instagram</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Facebook</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-cyan-500 mr-2"></div>
              <span className="text-sm">Twitter</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-800 mr-2"></div>
              <span className="text-sm">LinkedIn</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm">TikTok</span>
            </div>
            {showOptimalTimes && (
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-sm border-2 border-green-500 mr-2"></div>
                <span className="text-sm">Créneau optimal</span>
              </div>
            )}
          </div>

          {/* Calendrier */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
              view={calendarView}
              onView={(view: string) => setCalendarView(view as 'month' | 'week' | 'day')}
              eventPropGetter={(event: CalendarEvent) => {
                const backgroundColor = 
                  event.platform === 'instagram' ? '#3b82f6' : 
                  event.platform === 'facebook' ? '#ef4444' : 
                  event.platform === 'twitter' ? '#06b6d4' : 
                  event.platform === 'linkedin' ? '#1e40af' : 
                  event.platform === 'tiktok' ? '#8b5cf6' : 
                  '#6b7280';
                
                return {
                  style: {
                    backgroundColor,
                    borderRadius: '4px',
                    opacity: event.status === 'draft' ? 0.7 : 1,
                    border: event.status === 'failed' ? '2px solid #ef4444' : 'none'
                  }
                };
              }}
              selectable
              onSelectSlot={(slotInfo: any) => {
                setSelectedEvent(null);
                setShowAddEventModal(true);
              }}
              onSelectEvent={(event: CalendarEvent) => {
                setSelectedEvent(event);
                setShowAddEventModal(true);
              }}
              components={{
                timeSlotWrapper: (props: any) => {
                  const { children, value } = props;
                  if (!showOptimalTimes) return children;
                  
                  const dayOfWeek = moment(value).format('dddd').toLowerCase();
                  const hour = moment(value).hour();
                  
                  // Vérifier si ce créneau est optimal pour une plateforme
                  const isOptimal = optimalTimes.some(platform => 
                    platform.bestDays.some(day => 
                      day.day.toLowerCase() === dayOfWeek && 
                      day.slots.some(slot => 
                        parseInt(slot.hour) === hour && 
                        (selectedPlatform === 'all' || platform.platform === selectedPlatform)
                      )
                    )
                  );
                  
                  if (isOptimal) {
                    return (
                      <div 
                        className="border-2 border-green-500 border-dashed rounded-sm"
                        data-tooltip-id="optimal-tooltip"
                        data-tooltip-content="Créneau optimal"
                      >
                        {children}
                      </div>
                    );
                  }
                  
                  return children;
                }
              }}
            />
          </div>
        </>
      )}

      {/* Section des créneaux horaires optimaux */}
      {!loading && showOptimalTimes && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Créneaux horaires optimaux
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimalTimes
              .filter(platform => selectedPlatform === 'all' || platform.platform === selectedPlatform)
              .map((platformData, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-lg shadow p-4 border-l-4"
                  style={{
                    borderLeftColor: 
                      platformData.platform === 'instagram' ? '#3b82f6' : 
                      platformData.platform === 'facebook' ? '#ef4444' : 
                      platformData.platform === 'twitter' ? '#06b6d4' : 
                      platformData.platform === 'linkedin' ? '#1e40af' : 
                      platformData.platform === 'tiktok' ? '#8b5cf6' : 
                      '#6b7280'
                  }}
                >
                  <h3 className="font-semibold text-lg mb-3 capitalize">{platformData.platform}</h3>
                  
                  {platformData.bestDays.length === 0 ? (
                    <p className="text-gray-500 text-sm">Pas assez de données pour déterminer les créneaux optimaux.</p>
                  ) : (
                    <ul className="space-y-2">
                      {platformData.bestDays
                        .sort((a, b) => {
                          // Calculer le score moyen de chaque jour en fonction des slots
                          const aAvgScore = a.slots.reduce((acc, s) => acc + s.score, 0) / a.slots.length;
                          const bAvgScore = b.slots.reduce((acc, s) => acc + s.score, 0) / b.slots.length;
                          return bAvgScore - aAvgScore;
                        })
                        .slice(0, 5)
                        .map((day, dayIndex) => (
                          <li key={dayIndex} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2 text-gray-500" />
                              <span className="capitalize">{day.day}</span> à {day.slots[0].hour}
                            </div>
                            <div className="flex items-center">
                              <BarChart2 size={16} className="mr-1 text-green-500" />
                              <span className="text-sm font-medium text-green-600">
                                {Math.round(day.slots[0].score * 100) / 100}%
                              </span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  
                  <button
                    className="mt-4 w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                    onClick={() => {
                      // Créer un nouvel événement avec le premier créneau optimal
                      if (platformData.bestDays.length > 0) {
                        const bestDay = platformData.bestDays[0];
                        const today = new Date();
                        const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                          .indexOf(bestDay.day.toLowerCase());
                        
                        // Calculer la prochaine occurrence de ce jour de la semaine
                        const daysUntilNext = (dayIndex + 7 - today.getDay()) % 7;
                        const nextDate = new Date(today);
                        nextDate.setDate(today.getDate() + daysUntilNext);
                        nextDate.setHours(parseInt(bestDay.slots[0].hour), 0, 0, 0);
                        
                        setSelectedEvent(null);
                        setShowAddEventModal(true);
                      }
                    }}
                  >
                    <Zap size={16} className="mr-2" />
                    Planifier au meilleur moment
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition d'événement */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedEvent ? 'Modifier la publication' : 'Nouvelle publication'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddEventModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedEvent?.title || ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedEvent ? moment(selectedEvent.start).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Heure
                  </label>
                  <input
                    type="time"
                    id="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedEvent ? moment(selectedEvent.start).format('HH:mm') : '12:00'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                  Plateforme
                </label>
                <select
                  id="platform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedEvent?.platform || selectedPlatform !== 'all' ? selectedPlatform : 'instagram'}
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={selectedEvent?.status || 'draft'}
                >
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Programmé</option>
                  <option value="published">Publié</option>
                  <option value="failed">Échec</option>
                </select>
              </div>

              <div className="pt-4 flex justify-between">
                {selectedEvent && (
                  <button
                    type="button"
                    className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
                    onClick={() => {
                      // Supprimer l'événement
                      if (selectedEvent) {
                        const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
                        setEvents(updatedEvents);
                        setShowAddEventModal(false);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => setShowAddEventModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Code pour sauvegarder l'événement
                      setShowAddEventModal(false);
                    }}
                  >
                    {selectedEvent ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCalendarPage; 