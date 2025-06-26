import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

// Types pour les projets et les membres
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  members: TeamMember[];
  dueDate: string;
}

export default function CollaborationPage() {
  // État pour les projets (simulé pour l'exemple)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Campagne Réseaux Sociaux Q2',
      description: 'Planification et exécution de la campagne sur les réseaux sociaux pour le deuxième trimestre',
      progress: 75,
      dueDate: '2024-06-30',
      members: [
        { id: '1', name: 'Sophie Martin', role: 'Chef de Projet', avatar: '/avatars/sophie.jpg' },
        { id: '2', name: 'Thomas Dubois', role: 'Designer', avatar: '/avatars/thomas.jpg' },
        { id: '3', name: 'Emma Laurent', role: 'Copywriter', avatar: '/avatars/emma.jpg' },
      ]
    },
    {
      id: '2',
      title: 'Analyse des Tendances',
      description: 'Analyse approfondie des tendances du marché et des comportements utilisateurs',
      progress: 45,
      dueDate: '2024-05-15',
      members: [
        { id: '4', name: 'Lucas Bernard', role: 'Analyste', avatar: '/avatars/lucas.jpg' },
        { id: '5', name: 'Julie Petit', role: 'Data Scientist', avatar: '/avatars/julie.jpg' },
      ]
    }
  ]);

  return (
    <Layout>
      {/* En-tête de la page */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Espace de Collaboration
            </h1>
            <p className="text-xl opacity-90">
              Gérez vos projets et votre équipe en un seul endroit
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Vue d'ensemble des projets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {project.description}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Date d'échéance */}
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Date limite :</span>{' '}
                {new Date(project.dueDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>

              {/* Membres de l'équipe */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Membres de l'équipe
                </h4>
                <div className="flex -space-x-2">
                  {project.members.map((member) => (
                    <div
                      key={member.id}
                      className="relative"
                      title={`${member.name} - ${member.role}`}
                    >
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-white"
                      />
                    </div>
                  ))}
                  <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-gray-600 hover:bg-gray-200">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouveau Projet
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Inviter un Membre
          </button>
          <button className="flex items-center justify-center gap-2 bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Créer une Tâche
          </button>
          <button className="flex items-center justify-center gap-2 bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Voir les Rapports
          </button>
        </div>
      </div>
    </Layout>
  );
} 