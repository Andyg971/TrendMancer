import React, { useState } from 'react';

// Composants d'icônes simplifiés au lieu d'utiliser lucide-react
const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconFilter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Icônes pour les réseaux sociaux
const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconMoreHorizontal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'list'
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  
  // Générer les données du calendrier
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  // Navigation des mois
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Données simulées pour les posts programmés
  const scheduledPosts = [
    { id: 1, date: new Date(currentYear, currentMonth, 5), time: '09:30', platform: 'instagram', content: 'Découvrez notre nouvelle collection de produits #Nouveautés' },
    { id: 2, date: new Date(currentYear, currentMonth, 5), time: '14:00', platform: 'twitter', content: 'Comment optimiser votre stratégie marketing en 2025 ? Découvrez nos 5 conseils essentiels !' },
    { id: 3, date: new Date(currentYear, currentMonth, 8), time: '11:15', platform: 'linkedin', content: 'Webinaire: L\'intelligence artificielle au service du marketing digital. Inscrivez-vous maintenant!' },
    { id: 4, date: new Date(currentYear, currentMonth, 12), time: '16:45', platform: 'facebook', content: 'Promotion exclusive pour nos abonnés: -20% sur notre formule Premium jusqu\'à la fin du mois!' },
    { id: 5, date: new Date(currentYear, currentMonth, 15), time: '10:00', platform: 'instagram', content: 'Témoignage client: comment Sophie a multiplié son engagement par 3 en utilisant notre plateforme' },
    { id: 6, date: new Date(currentYear, currentMonth, 18), time: '13:30', platform: 'twitter', content: 'Les dernières tendances #SocialMedia que vous devez connaître pour rester pertinent' },
    { id: 7, date: new Date(currentYear, currentMonth, 22), time: '09:00', platform: 'linkedin', content: 'Étude de cas: Comment une PME a augmenté son trafic organique de 150% en 3 mois' },
    { id: 8, date: new Date(currentYear, currentMonth, 25), time: '17:00', platform: 'facebook', content: 'Live Q&A demain à 14h avec notre expert en growth marketing. Posez vos questions dès maintenant!' },
  ];

  // Récupérer les posts pour un jour donné
  const getPostsForDay = (day) => {
    return scheduledPosts.filter(post => 
      post.date.getDate() === day && 
      post.date.getMonth() === currentMonth && 
      post.date.getFullYear() === currentYear
    );
  };
  
  // Obtenir l'icône pour une plateforme
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <IconInstagram />;
      case 'facebook':
        return <IconFacebook />;
      case 'twitter':
        return <IconTwitter />;
      case 'linkedin':
        return <IconLinkedin />;
      default:
        return null;
    }
  };
  
  // Obtenir la couleur pour une plateforme
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram':
        return 'bg-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-blue-400';
      case 'linkedin':
        return 'bg-blue-700';
      default:
        return 'bg-gray-500';
    }
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Jours du mois précédent
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`prev-${i}`} className="h-32 border border-gray-200 dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 opacity-50">
          <span className="text-sm text-gray-400"></span>
        </div>
      );
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                    currentMonth === new Date().getMonth() && 
                    currentYear === new Date().getFullYear();
      const isSelected = day === selectedDate;
      const postsForDay = getPostsForDay(day);
      
      days.push(
        <div 
          key={day} 
          className={`h-32 border border-gray-200 dark:border-gray-700 p-2 ${
            isToday 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : isSelected 
              ? 'bg-gray-100 dark:bg-gray-800' 
              : 'bg-white dark:bg-gray-900'
          }`}
          onClick={() => setSelectedDate(day)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`flex items-center justify-center h-6 w-6 rounded-full text-sm ${
              isToday 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-700 dark:text-gray-300'
            }`}>
              {day}
            </span>
            {postsForDay.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {postsForDay.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-20">
            {postsForDay.map(post => (
              <div 
                key={post.id}
                className={`text-xs p-1 rounded truncate flex items-center ${getPlatformColor(post.platform)} text-white`}
              >
                <span className="w-3 h-3 mr-1">
                  {getPlatformIcon(post.platform)}
                </span>
                <span className="truncate">{post.content.substring(0, 20)}...</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendrier Éditorial</h1>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setViewMode('month')}
              >
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-1.5"><IconGrid /></span>
                  Mois
                </span>
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setViewMode('week')}
              >
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-1.5"><IconCalendar /></span>
                  Semaine
                </span>
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}
                onClick={() => setViewMode('list')}
              >
                <span className="flex items-center">
                  <span className="w-4 h-4 mr-1.5"><IconList /></span>
                  Liste
                </span>
              </button>
            </div>
            
            <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2">
              <span className="w-5 h-5 text-gray-600 dark:text-gray-300"><IconFilter /></span>
            </button>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center text-sm font-medium">
              <span className="w-4 h-4 mr-1.5"><IconPlus /></span>
              Nouveau Post
            </button>
          </div>
        </div>
        
        {/* Navigation mois */}
        <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <span className="w-5 h-5 text-gray-600 dark:text-gray-300"><IconChevronLeft /></span>
          </button>
          
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <span className="w-5 h-5 text-gray-600 dark:text-gray-300"><IconChevronRight /></span>
          </button>
        </div>
        
        {/* Vue Calendrier */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700">
            {dayNames.map((day, index) => (
              <div key={index} className="py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>
          
          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-0">
            {renderCalendarDays()}
          </div>
        </div>
        
        {/* Section Posts du jour sélectionné */}
        {getPostsForDay(selectedDate).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Posts du {selectedDate} {monthNames[currentMonth]}
            </h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 space-y-4">
              {getPostsForDay(selectedDate).map(post => (
                <div 
                  key={post.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPlatformColor(post.platform)}`}>
                        <span className="w-5 h-5 text-white">
                          {getPlatformIcon(post.platform)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium capitalize">{post.platform}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="w-4 h-4 mr-1"><IconClock /></span>
                          {post.time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <span className="w-4 h-4 text-gray-600 dark:text-gray-300"><IconEdit /></span>
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <span className="w-4 h-4 text-gray-600 dark:text-gray-300"><IconMoreHorizontal /></span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">{post.content}</div>
                  
                  <div className="mt-4 flex justify-end">
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs px-2.5 py-1 rounded-full">
                      Programmé
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;