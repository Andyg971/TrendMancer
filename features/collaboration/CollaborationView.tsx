'use client';

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CollaborationService } from './CollaborationService';
import { Project, Task } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Instanciation du service
const collaborationService = new CollaborationService();

// --- Composant Modal Générique ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Sous-composants --- (Pour la clarté)

interface ProjectItemProps {
  project: Project;
  isSelected: boolean;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  onEdit: (project: Project) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, isSelected, onSelect, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className={`p-3 rounded-lg cursor-pointer flex justify-between items-center mb-2 ${isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
      onClick={() => onSelect(project.id)}
    >
      <span className="font-medium text-gray-800">{project.name}</span>
      <div className="flex space-x-2">
        <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-blue-100">
          <PencilIcon className="h-4 w-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-red-100">
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

interface TaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDelete, onEdit, onStatusChange }) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      className={`p-3 rounded-lg bg-white border-l-4 ${getPriorityColor(task.priority)} shadow-sm mb-2 flex justify-between items-center`}
    >
      <div className="flex-1 mr-4">
        <p className="font-medium text-gray-900">{task.title}</p>
        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
        {task.due_date && <p className="text-xs text-gray-500 mt-1">Échéance: {new Date(task.due_date).toLocaleDateString()}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)} focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400`}
        >
          <option value="todo">À faire</option>
          <option value="in_progress">En cours</option>
          <option value="done">Terminé</option>
          <option value="blocked">Bloqué</option>
        </select>
         <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-blue-100">
          <PencilIcon className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-600 p-1 rounded hover:bg-red-100">
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Composant Principal ---

export const CollaborationView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour les modales
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projectFormData, setProjectFormData] = useState({ name: '', description: '' });
  const [taskFormData, setTaskFormData] = useState<Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>>({ title: '', description: '', status: 'todo', priority: 'medium' });

  // Charger les projets au montage
  useEffect(() => {
    const loadProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      const fetchedProjects = await collaborationService.getProjects();
      if (fetchedProjects) {
        setProjects(fetchedProjects);
        if (fetchedProjects.length > 0 && !selectedProjectId) {
          setSelectedProjectId(fetchedProjects[0].id);
        }
      } else {
        setError('Impossible de charger les projets.');
      }
      setLoadingProjects(false);
    };
    loadProjects();
  }, []);

  // Charger les tâches quand le projet sélectionné change
  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }

    const loadTasks = async () => {
      setLoadingTasks(true);
      setError(null);
      const fetchedTasks = await collaborationService.getTasksForProject(selectedProjectId);
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      } else {
        setError('Impossible de charger les tâches pour ce projet.');
        setTasks([]);
      }
      setLoadingTasks(false);
    };
    loadTasks();
  }, [selectedProjectId]);

  // --- Fonctions de rappel (Callbacks) pour les actions --- 

  const handleSelectProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const handleDeleteProject = useCallback(async (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet et toutes ses tâches ?')) {
       setError(null);
       const success = await collaborationService.deleteProject(projectId);
       if (success) {
         setProjects(prev => prev.filter(p => p.id !== projectId));
         if (selectedProjectId === projectId) {
           setSelectedProjectId(projects.length > 1 ? projects.find(p => p.id !== projectId)?.id ?? null : null);
         }
       } else {
         setError('Erreur lors de la suppression du projet.');
       }
    }
  }, [selectedProjectId, projects]);

  // --- Gestion Modale Projet ---
  const openProjectModal = (project: Project | null = null) => {
    setEditingProject(project);
    setProjectFormData(project ? { name: project.name, description: project.description || '' } : { name: '', description: '' });
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
    setError(null);
  };

  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProject = async () => {
    if (!projectFormData.name) {
      setError('Le nom du projet est requis.');
      return;
    }
    setError(null);
    let success = false;
    if (editingProject) {
      const updatedProject = await collaborationService.updateProject(editingProject.id, projectFormData);
      if (updatedProject) {
        setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
        success = true;
      }
    } else {
      const newProject = await collaborationService.createProject(projectFormData);
      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
        setSelectedProjectId(newProject.id);
        success = true;
      }
    }

    if (success) {
      closeProjectModal();
    } else {
      setError(`Erreur lors de ${editingProject ? 'la mise à jour' : 'la création'} du projet.`);
    }
  };

  // --- Gestion Modale Tâche ---
  const openTaskModal = (task: Task | null = null) => {
    setEditingTask(task);
    setTaskFormData(task ? {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assigned_user_id: task.assigned_user_id,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    } : { title: '', description: '', status: 'todo', priority: 'medium' });
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setError(null);
  };

  const handleTaskFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = async () => {
    if (!taskFormData.title || !selectedProjectId) {
      setError('Le titre de la tâche est requis.');
      return;
    }
    setError(null);
    let success = false;

    // Prépare les données pour l'API
    const taskDataForApi = {
      ...taskFormData,
      due_date: taskFormData.due_date || undefined // Convertir chaîne vide en undefined
    };

    if (editingTask) {
      // Mise à jour
      // On ne passe que les champs modifiables, en s'assurant qu'ils ne sont pas undefined si requis
      const updatePayload: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'project_id'>> = {
        title: taskDataForApi.title || editingTask.title, // Garde l'ancien titre si vide
        description: taskDataForApi.description,
        status: taskDataForApi.status,
        priority: taskDataForApi.priority,
        assigned_user_id: taskDataForApi.assigned_user_id,
        due_date: taskDataForApi.due_date
      };
      const updatedTask = await collaborationService.updateTask(editingTask.id, updatePayload);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
        success = true;
      }
    } else {
      // Création
      // Assurer que les champs requis ont des valeurs valides
      const newTaskData: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
          project_id: selectedProjectId,
          title: taskDataForApi.title || 'Nouvelle Tâche', // Assure une string
          description: taskDataForApi.description,
          status: taskDataForApi.status || 'todo', 
          priority: taskDataForApi.priority || 'medium',
          assigned_user_id: taskDataForApi.assigned_user_id,
          due_date: taskDataForApi.due_date
      };
      const newTask = await collaborationService.createTask(newTaskData);
      if (newTask) {
        setTasks(prev => [...prev, newTask]);
        success = true;
      }
    }

    if (success) {
      closeTaskModal();
    } else {
      setError(`Erreur lors de ${editingTask ? 'la mise à jour' : 'la création'} de la tâche.`);
    }
  };

  // --- Callbacks existants mis à jour pour utiliser les modales ---

  const handleEditProject = useCallback((project: Project) => {
    openProjectModal(project);
  }, []);

  const handleCreateProject = useCallback(() => {
    openProjectModal();
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
       setError(null);
       const success = await collaborationService.deleteTask(taskId);
       if (success) {
         setTasks(prev => prev.filter(t => t.id !== taskId));
       } else {
         setError('Erreur lors de la suppression de la tâche.');
       }
     }
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    openTaskModal(task);
  }, []);

  const handleCreateTask = useCallback(() => {
    if (!selectedProjectId) return;
    openTaskModal();
  }, [selectedProjectId]);

  const handleTaskStatusChange = useCallback(async (taskId: string, status: Task['status']) => {
    setError(null);
    const updatedTask = await collaborationService.updateTask(taskId, { status });
    if (updatedTask) {
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } else {
      setError('Erreur lors de la mise à jour du statut de la tâche.');
    }
  }, []);


  return (
    <Fragment>
      <div className="flex h-[calc(100vh-theme(space.16))] bg-gray-100 p-4 space-x-4">
        <motion.div layout className="w-1/3 bg-white rounded-lg shadow p-4 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Projets</h2>
            <button 
              onClick={handleCreateProject}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Nouveau
            </button>
          </div>
          {loadingProjects ? (
            <div className="text-center text-gray-500">Chargement des projets...</div>
          ) : error && projects.length === 0 ? (
             <div className="text-center text-red-500 p-4 bg-red-50 rounded">{error}</div>
          ) : (
            <AnimatePresence>
              {projects.length === 0 && !loadingProjects && (
                <div className="text-center text-gray-500 mt-4">Aucun projet trouvé.</div>
              )}
              {projects.map(project => (
                <ProjectItem 
                  key={project.id}
                  project={project}
                  isSelected={selectedProjectId === project.id}
                  onSelect={handleSelectProject}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        <motion.div layout className="w-2/3 bg-white rounded-lg shadow p-4 flex flex-col overflow-y-auto">
          {selectedProjectId ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Tâches - {projects.find(p => p.id === selectedProjectId)?.name || 'Projet'}
                </h2>
                <button 
                   onClick={handleCreateTask}
                   className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 text-sm"
                 >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Nouvelle Tâche
                </button>
              </div>
              {loadingTasks ? (
                <div className="text-center text-gray-500">Chargement des tâches...</div>
              ) : error && tasks.length === 0 ? (
                 <div className="text-center text-red-500 p-4 bg-red-50 rounded">{error}</div>
              ) : (
                <AnimatePresence>
                  {tasks.length === 0 && !loadingTasks && (
                    <div className="text-center text-gray-500 mt-4">Aucune tâche dans ce projet.</div>
                  )}
                  {tasks.map(task => (
                    <TaskItem 
                      key={task.id}
                      task={task}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      onStatusChange={handleTaskStatusChange}
                    />
                  ))}
                </AnimatePresence>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sélectionnez un projet pour voir ses tâches.
            </div>
          )}
           {error && !loadingTasks && tasks.length > 0 && (
             <div className="text-center text-red-500 p-2 text-sm">{error}</div>
           )} 
        </motion.div>
      </div>

      <Modal isOpen={isProjectModalOpen} onClose={closeProjectModal} title={editingProject ? 'Modifier le projet' : 'Nouveau Projet'}>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Nom du projet</label>
            <input 
              type="text" 
              id="projectName" 
              name="name" 
              value={projectFormData.name}
              onChange={handleProjectFormChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">Description (optionnel)</label>
            <textarea 
              id="projectDescription" 
              name="description" 
              rows={3}
              value={projectFormData.description}
              onChange={handleProjectFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-4">
            <button onClick={closeProjectModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Annuler</button>
            <button onClick={handleSaveProject} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Enregistrer</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isTaskModalOpen} onClose={closeTaskModal} title={editingTask ? 'Modifier la tâche' : 'Nouvelle Tâche'}>
         <div className="space-y-4">
            <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">Titre</label>
                <input type="text" id="taskTitle" name="title" value={taskFormData.title || ''} onChange={handleTaskFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="taskDescription" name="description" rows={3} value={taskFormData.description || ''} onChange={handleTaskFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">Statut</label>
                    <select id="taskStatus" name="status" value={taskFormData.status || 'todo'} onChange={handleTaskFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="done">Terminé</option>
                        <option value="blocked">Bloqué</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">Priorité</label>
                    <select id="taskPriority" name="priority" value={taskFormData.priority || 'medium'} onChange={handleTaskFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700">Date d'échéance (optionnel)</label>
                <input type="date" id="taskDueDate" name="due_date" value={taskFormData.due_date || ''} onChange={handleTaskFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
             {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end space-x-2 pt-4">
                <button onClick={closeTaskModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Annuler</button>
                <button onClick={handleSaveTask} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Enregistrer</button>
            </div>
         </div>
      </Modal>
    </Fragment>
  );
}; 