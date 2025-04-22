import React, { useState } from 'react';
import { Bell, Calendar, ChevronDown, MessageSquare, PieChart, Search, Settings, TrendingUp, Users, Menu, X, LogOut, Sun, Moon, HelpCircle, Star, Facebook, Instagram, Twitter, Linkedin, AlertCircle } from 'lucide-react';

const TrendMancerDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen flex transition-all duration-300`}>
      {/* Sidebar */}
      <aside 
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  TM
                </div>
                <span className="ml-2 font-bold text-lg">TrendMancer</span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="mx-auto">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  TM
                </div>
              </div>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} focus:outline-none`}
            >
              {sidebarCollapsed ? <ChevronDown size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              <NavItem icon={<TrendingUp />} label="Dashboard" active={true} collapsed={sidebarCollapsed} darkMode={darkMode} />
              <NavItem icon={<Calendar />} label="Calendrier" collapsed={sidebarCollapsed} darkMode={darkMode} />
              <NavItem icon={<Star />} label="Contenu IA" collapsed={sidebarCollapsed} darkMode={darkMode} />
              <NavItem icon={<PieChart />} label="Analytiques" collapsed={sidebarCollapsed} darkMode={darkMode} />
              <NavItem icon={<MessageSquare />} label="Communauté" collapsed={sidebarCollapsed} darkMode={darkMode} />
              <NavItem icon={<Users />} label="Équipe" collapsed={sidebarCollapsed} darkMode={darkMode} />
            </ul>

            {/* Settings Section */}
            <div className="mt-10 px-3">
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ${sidebarCollapsed ? 'text-center mb-3' : 'px-3 mb-2'} uppercase text-xs font-medium`}>
                {!sidebarCollapsed && "Paramètres"}
                {sidebarCollapsed && "..."}
              </div>
              <ul className="space-y-1">
                <NavItem icon={<Settings />} label="Paramètres" collapsed={sidebarCollapsed} darkMode={darkMode} />
                <NavItem icon={<HelpCircle />} label="Aide" collapsed={sidebarCollapsed} darkMode={darkMode} />
              </ul>
            </div>
          </nav>

          {/* User Section */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-medium">
                AD
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Alex Dupont</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Premium Plan</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  <LogOut size={18} />
                </button>
              )}
            </div>
            {/* Dark Mode Toggle */}
            {!sidebarCollapsed && (
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`mt-4 flex items-center justify-center w-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-lg py-2 px-3 text-sm`}
              >
                {darkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                {darkMode ? 'Mode Clair' : 'Mode Sombre'}
              </button>
            )}
            {sidebarCollapsed && (
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`mt-4 flex items-center justify-center w-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-lg p-2`}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Navigation */}
        <header className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-10`}>
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          
          <div className="flex items-center space-x-4">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg flex items-center px-3 py-1.5`}>
              <Search size={16} className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className={`bg-transparent border-none focus:outline-none text-sm w-40 ${darkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-700 placeholder:text-gray-500'}`}
              />
            </div>
            
            <button className="relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex items-center justify-center text-white font-medium">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Overview Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <OverviewCard 
              title="Total Followers" 
              value="28,426" 
              change="+12.5%" 
              positive={true} 
              darkMode={darkMode}
              icon={<Users size={20} className="text-blue-500" />}
            />
            <OverviewCard 
              title="Engagement Rate" 
              value="5.3%" 
              change="+1.8%" 
              positive={true} 
              darkMode={darkMode}
              icon={<TrendingUp size={20} className="text-green-500" />}
            />
            <OverviewCard 
              title="Total Reach" 
              value="152K" 
              change="-3.2%" 
              positive={false} 
              darkMode={darkMode}
              icon={<PieChart size={20} className="text-purple-500" />}
            />
            <OverviewCard 
              title="Scheduled Posts" 
              value="18" 
              change="+5" 
              positive={true} 
              darkMode={darkMode}
              icon={<Calendar size={20} className="text-orange-500" />}
            />
          </section>

          {/* Performance Chart */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 lg:col-span-2`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Performance par réseau</h2>
                <div className="flex space-x-2">
                  <button className={`text-xs px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    7 jours
                  </button>
                  <button className={`text-xs px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    30 jours
                  </button>
                  <button className={`text-xs px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    3 mois
                  </button>
                </div>
              </div>

              <div className="h-80 w-full">
                {/* Placeholder for chart */}
                <div className={`w-full h-full rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <div className="text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm mb-2`}>Graphique de performance</p>
                    <div className="flex justify-center space-x-4">
                      <span className="flex items-center text-xs">
                        <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                        Facebook
                      </span>
                      <span className="flex items-center text-xs">
                        <span className="h-3 w-3 rounded-full bg-pink-500 mr-1"></span>
                        Instagram
                      </span>
                      <span className="flex items-center text-xs">
                        <span className="h-3 w-3 rounded-full bg-blue-400 mr-1"></span>
                        Twitter
                      </span>
                      <span className="flex items-center text-xs">
                        <span className="h-3 w-3 rounded-full bg-blue-700 mr-1"></span>
                        LinkedIn
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Top Content Types</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Images</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Videos</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Links</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Text Only</span>
                    <span className="font-medium">12%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Posts & AI Suggestions */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Posts Programmés</h2>
                <button className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
                  <span className="mr-1">+</span> Créer
                </button>
              </div>

              <div className="space-y-4">
                {/* Upcoming post items */}
                <UpcomingPost 
                  platform="instagram" 
                  date="Aujourd'hui" 
                  time="15:30" 
                  content="Découvrez nos 5 astuces pour optimiser votre présence en ligne #MarketingTips" 
                  darkMode={darkMode} 
                />
                
                <UpcomingPost 
                  platform="twitter" 
                  date="Demain" 
                  time="10:15" 
                  content="Nous sommes ravis d'annoncer notre participation au salon #DigitalMarketing2025 la semaine prochaine à Paris!" 
                  darkMode={darkMode} 
                />
                
                <UpcomingPost 
                  platform="linkedin" 
                  date="26 Mar" 
                  time="09:00" 
                  content="Comment l'intelligence artificielle transforme la gestion des réseaux sociaux en 2025 - Nouveau blog post" 
                  darkMode={darkMode} 
                />
              </div>

              <button className={`w-full mt-4 text-sm py-2 text-center ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-50'} rounded-md`}>
                Voir tous les posts programmés
              </button>
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Suggestions IA</h2>
                <button className={`text-xs px-3 py-1.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-md flex items-center`}>
                  Actualiser
                </button>
              </div>

              <div className="space-y-4">
                <AISuggestion 
                  title="Tendance Détectée: #AIMarketing"
                  description="Ce hashtag gagne en popularité dans votre secteur. Nous recommandons de créer du contenu sur ce sujet cette semaine."
                  actionLabel="Créer du contenu"
                  type="trend"
                  darkMode={darkMode}
                />
                
                <AISuggestion 
                  title="Optimisation Horaire"
                  description="Vos posts Instagram obtiennent 34% plus d'engagement lorsqu'ils sont publiés entre 18h et 20h le mardi et jeudi."
                  actionLabel="Ajuster horaires"
                  type="insight"
                  darkMode={darkMode}
                />
                
                <AISuggestion 
                  title="Post Recommandé"
                  description="Partagez plus de contenu sur les études de cas. Ce type de contenu a généré 28% plus d'engagement le mois dernier."
                  actionLabel="Générer contenu"
                  type="content"
                  darkMode={darkMode}
                />
              </div>

              <button className={`w-full mt-4 text-sm py-2 text-center ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-50'} rounded-md`}>
                Toutes les suggestions
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, active = false, collapsed = false, darkMode = false }) => {
  return (
    <li>
      <a 
        href="#" 
        className={`
          flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-lg text-sm transition-colors
          ${active 
            ? darkMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-50 text-blue-700' 
            : darkMode 
              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `}
      >
        <span className="flex-shrink-0">{icon}</span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </a>
    </li>
  );
};

// Overview Card Component
const OverviewCard = ({ title, value, change, positive, darkMode, icon }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-5`}>
      <div className="flex justify-between">
        <div>
          <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className={`text-sm mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
            {change} {positive ? '↑' : '↓'}
          </p>
        </div>
        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} h-12 w-12 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Upcoming Post Component
const UpcomingPost = ({ platform, date, time, content, darkMode }) => {
  let platformIcon;
  let platformColor;
  
  switch (platform) {
    case 'instagram':
      platformIcon = <Instagram size={16} />;
      platformColor = 'text-pink-500';
      break;
    case 'facebook':
      platformIcon = <Facebook size={16} />;
      platformColor = 'text-blue-600';
      break;
    case 'twitter':
      platformIcon = <Twitter size={16} />;
      platformColor = 'text-blue-400';
      break;
    case 'linkedin':
      platformIcon = <Linkedin size={16} />;
      platformColor = 'text-blue-700';
      break;
    default:
      platformIcon = <MessageSquare size={16} />;
      platformColor = 'text-gray-500';
  }
  
  return (
    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className={`${platformColor} mr-2`}>{platformIcon}</span>
          <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
        </div>
        <div className="flex items-center">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{date} • {time}</span>
        </div>
      </div>
      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>{content}</p>
    </div>
  );
};

// AI Suggestion Component
const AISuggestion = ({ title, description, actionLabel, type, darkMode }) => {
  let typeIcon;
  let typeColor;
  
  switch (type) {
    case 'trend':
      typeIcon = <TrendingUp size={16} />;
      typeColor = 'text-pink-500';
      break;
    case 'insight':
      typeIcon = <PieChart size={16} />;
      typeColor = 'text-blue-500';
      break;
    case 'content':
      typeIcon = <MessageSquare size={16} />;
      typeColor = 'text-green-500';
      break;
    default:
      typeIcon = <AlertCircle size={16} />;
      typeColor = 'text-purple-500';
  }
  
  return (
    <div className={`p-4 rounded-lg cursor-pointer ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}>
      <div className="flex items-start mb-2">
        <div className={`mt-0.5 ${typeColor} mr-3`}>{typeIcon}</div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{description}</p>
          <button className={`mt-2 text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendMancerDashboard;