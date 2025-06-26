import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Settings, User, Bell, Lock, Database, Globe, Palette, Shield, ToggleLeft } from 'lucide-react';

type NotificationKey = 'email' | 'push' | 'sms' | 'weekly' | 'mentions';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    mentions: true
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('fr');

  const handleNotificationChange = (key: NotificationKey) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  // Fonction pour appliquer le thème
  const applyTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    
    // Ajuster les classes HTML en fonction du thème
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (selectedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Thème système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Fonction pour changer de langue
  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    // Ici, vous pourriez implémenter la logique pour changer la langue de l'application
  };

  // Fonction pour sauvegarder le profil
  const saveProfile = () => {
    // Simuler une sauvegarde
    alert('Profil sauvegardé avec succès !');
  };

  // Fonction pour mettre à jour le mot de passe
  const updatePassword = () => {
    // Simuler la mise à jour du mot de passe
    alert('Mot de passe mis à jour avec succès !');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez vos préférences et informations de compte</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              {[
                { id: 'profile', name: 'Profil', icon: User },
                { id: 'notifications', name: 'Notifications', icon: Bell },
                { id: 'security', name: 'Sécurité', icon: Lock },
                { id: 'connections', name: 'Connexions API', icon: Database },
                { id: 'appearance', name: 'Apparence', icon: Palette },
                { id: 'privacy', name: 'Confidentialité', icon: Shield }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  } flex items-center px-3 py-2 text-sm font-medium rounded-md w-full border-l-4 transition`}
                >
                  <item.icon className="mr-3 h-5 w-5 text-current" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      defaultValue="Andy"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      defaultValue="Grava"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue="andy@exemple.com"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      defaultValue="+33 6 12 34 56 78"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Biographie
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    defaultValue="Social media manager avec 5 ans d'expérience dans la gestion des campagnes numériques."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    type="button" 
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 mr-2"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    onClick={saveProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Préférences de notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notifications par email</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des mises à jour sur vos posts et analyses</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('email')}
                      className={`${
                        notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifications.email ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notifications push</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des alertes sur votre navigateur</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('push')}
                      className={`${
                        notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifications.push ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notifications SMS</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des alertes par message texte</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange('sms')}
                      className={`${
                        notifications.sms ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          notifications.sms ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Types de notifications</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Résumés hebdomadaires</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir une synthèse de vos performances</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('weekly')}
                          className={`${
                            notifications.weekly ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              notifications.weekly ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mentions et commentaires</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Être alerté lorsque quelqu'un vous mentionne</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('mentions')}
                          className={`${
                            notifications.mentions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                          <span
                            className={`${
                              notifications.mentions ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Apparence et langue</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Thème</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', name: 'Clair' },
                        { id: 'dark', name: 'Sombre' },
                        { id: 'system', name: 'Système' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => applyTheme(item.id)}
                          className={`${
                            theme === item.id
                              ? 'border-blue-500 ring-2 ring-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center`}
                        >
                          <div className={`h-8 w-8 rounded-full ${
                            item.id === 'light' 
                              ? 'bg-yellow-400' 
                              : item.id === 'dark' 
                              ? 'bg-indigo-800' 
                              : 'bg-gradient-to-r from-yellow-400 to-indigo-800'
                          }`}></div>
                          <span className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Langue</h3>
                    <select
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="es">Espagnol</option>
                      <option value="de">Allemand</option>
                    </select>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button type="button" className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 mr-2">
                      Réinitialiser
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Sécurité du compte</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Changer le mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="current-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button 
                        type="submit" 
                        onClick={updatePassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">Authentification à deux facteurs</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Renforcez la sécurité de votre compte en ajoutant une étape de vérification supplémentaire
                    </p>
                    <button type="button" className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                      Configurer la 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 