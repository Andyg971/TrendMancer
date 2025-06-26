import { supabase } from '@/lib/supabase-client';
import { Project, Task } from '@/types';
import { AuthError, PostgrestError } from '@supabase/supabase-js';

// Type pour les données de création de tâche, excluant les champs auto-générés
type CreateTaskData = Omit<Task, 'id' | 'created_at' | 'updated_at'>;

export class CollaborationService {

  // --- Gestion des Projets ---

  /**
   * Crée un nouveau projet pour l'utilisateur actuellement authentifié.
   * @param projectData - Données du projet (nom, description).
   * @returns Le projet créé ou null en cas d'erreur.
   */
  async createProject(projectData: Pick<Project, 'name' | 'description'>): Promise<Project | null> {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Erreur d\'authentification:', userError);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...projectData, owner_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du projet:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (createProject):', err);
      return null;
    }
  }

  /**
   * Récupère tous les projets appartenant à l'utilisateur actuellement authentifié.
   * @returns Liste des projets ou null en cas d'erreur.
   */
  async getProjects(): Promise<Project[] | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        // La politique RLS filtre automatiquement par owner_id = auth.uid()
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (getProjects):', err);
      return null;
    }
  }

  /**
   * Met à jour un projet existant.
   * @param projectId - ID du projet à mettre à jour.
   * @param updates - Données à mettre à jour.
   * @returns Le projet mis à jour ou null en cas d'erreur.
   */
  async updateProject(projectId: string, updates: Partial<Pick<Project, 'name' | 'description'>>): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        // La politique RLS vérifie que l'utilisateur est propriétaire
        .select()
        .single();
        
      if (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (updateProject):', err);
      return null;
    }
  }

  /**
   * Supprime un projet et ses tâches associées (grâce à ON DELETE CASCADE).
   * @param projectId - ID du projet à supprimer.
   * @returns true si succès, false sinon.
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        // La politique RLS vérifie que l'utilisateur est propriétaire

      if (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Erreur inattendue (deleteProject):', err);
      return false;
    }
  }

  // --- Gestion des Tâches ---

  /**
   * Crée une nouvelle tâche pour un projet donné.
   * @param taskData - Données de la tâche (project_id, title, etc.).
   * @returns La tâche créée ou null en cas d'erreur.
   */
  async createTask(taskData: CreateTaskData): Promise<Task | null> {
     // Vérification implicite de l'accès au projet via RLS lors de l'insertion
    try {
      // On s'assure de ne passer que les champs attendus par l'API
      const { project_id, title, description, status, priority, assigned_user_id, due_date } = taskData;
      const insertData = {
        project_id,
        title,
        description,
        status,
        priority,
        assigned_user_id,
        due_date
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(insertData) // Insertion des données nettoyées
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la tâche:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (createTask):', err);
      return null;
    }
  }

  /**
   * Récupère toutes les tâches d'un projet spécifique.
   * @param projectId - ID du projet.
   * @returns Liste des tâches ou null en cas d'erreur.
   */
  async getTasksForProject(projectId: string): Promise<Task[] | null> {
    // Vérification implicite de l'accès au projet via RLS lors de la sélection
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (getTasksForProject):', err);
      return null;
    }
  }

  /**
   * Met à jour une tâche existante.
   * @param taskId - ID de la tâche à mettre à jour.
   * @param updates - Données à mettre à jour (title, description, status, etc.).
   * @returns La tâche mise à jour ou null en cas d'erreur.
   */
  async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at' | 'project_id'>>): Promise<Task | null> {
     // Vérification implicite de l'accès au projet via RLS lors de la mise à jour
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Erreur inattendue (updateTask):', err);
      return null;
    }
  }

  /**
   * Supprime une tâche.
   * @param taskId - ID de la tâche à supprimer.
   * @returns true si succès, false sinon.
   */
  async deleteTask(taskId: string): Promise<boolean> {
    // Vérification implicite de l'accès au projet via RLS lors de la suppression
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Erreur inattendue (deleteTask):', err);
      return false;
    }
  }
} 