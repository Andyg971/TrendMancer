import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, Clock, Instagram, Linkedin, Facebook, Twitter, Plus, X, Check, AlertCircle, Edit, Trash2, Loader } from 'lucide-react';
import { getAllPosts, getPostsByStatus, addPost, updatePost, deletePost } from '../../services/postsService';

// Interface pour les publications planifiées
interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: 'scheduled' | 'published' | 'draft' | 'failed';
  created_at: string;
  scheduled_for?: string;
  published_at?: string;
}

interface NewPostForm {
  title: string;
  content: string;
  date: string;
  time: string;
  platforms: string[];
}

const SchedulerPage = () => {
  // État pour les publications planifiées
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État pour le formulaire de nouvelle publication
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState<NewPostForm>({
    title: '',
    content: '',
    date: '',
    time: '',
    platforms: []
  });

  // État pour l'édition d'une publication
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // État pour le filtre des publications
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published' | 'draft'>('all');

  // Charger les publications au chargement du composant
  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  // Fonction pour récupérer les publications
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (statusFilter === 'all') {
        result = await getAllPosts();
      } else {
        result = await getPostsByStatus(statusFilter === 'failed' ? 'scheduled' : statusFilter);
      }
      
      if (result.error) {
        throw new Error('Erreur lors de la récupération des publications');
      }
      
      // Transformer les données pour correspondre à notre interface
      const formattedPosts = result.data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        date: new Date(post.scheduled_for ? post.scheduled_for.split('T')[0] : post.created_at),
        time: post.scheduled_for ? post.scheduled_for.split('T')[1].substring(0, 5) : '12:00',
        platforms: Array.isArray(post.platform) ? post.platform : [post.platform],
        status: post.status
      })) || [];
      
      setScheduledPosts(formattedPosts);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de charger les publications. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmitNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Préparer les données de la publication
      const scheduledDateTime = `${newPost.date}T${newPost.time}:00`;
      const postData = {
        title: newPost.title,
        content: newPost.content,
        platform: newPost.platforms[0] as 'instagram' | 'linkedin' | 'facebook' | 'twitter',
        platforms: newPost.platforms,
        status: 'scheduled' as const,
        scheduled_for: scheduledDateTime,
        user_id: 'user1' // Dans une application réelle, ce serait l'ID de l'utilisateur connecté
      };
      
      // Ajouter la publication
      const result = await addPost(postData);
      
      if (result.error) {
        throw new Error('Erreur lors de l\'ajout de la publication');
      }
      
      // Mettre à jour la liste des publications
      await fetchPosts();
      
      // Réinitialiser le formulaire
      setShowForm(false);
      setNewPost({
        title: '',
        content: '',
        date: '',
        time: '12:00',
        platforms: ['instagram']
      });
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible d\'ajouter la publication. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour éditer une publication
  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setShowEditForm(true);
  };

  // Fonction pour soumettre les modifications d'une publication
  const handleSubmitEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPost) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Préparer les données de la publication
      const scheduledDateTime = `${editingPost.date.toISOString().split('T')[0]}T${editingPost.time}:00`;
      const postData = {
        title: editingPost.title,
        content: editingPost.content,
        platform: editingPost.platforms[0] as 'instagram' | 'linkedin' | 'facebook' | 'twitter',
        platforms: editingPost.platforms,
        scheduled_for: scheduledDateTime
      };
      
      // Mettre à jour la publication
      const result = await updatePost(editingPost.id, postData);
      
      if (result.error) {
        throw new Error('Erreur lors de la mise à jour de la publication');
      }
      
      // Mettre à jour la liste des publications
      await fetchPosts();
      
      // Fermer le formulaire d'édition
      setShowEditForm(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de mettre à jour la publication. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une publication
  const handleDeletePost = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Supprimer la publication
      const result = await deletePost(id);
      
      if (!result.success) {
        throw new Error('Erreur lors de la suppression de la publication');
      }
      
      // Mettre à jour la liste des publications
      await fetchPosts();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de supprimer la publication. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer la sélection des plateformes
  const togglePlatform = (platform: string) => {
    if (newPost.platforms.includes(platform)) {
      setNewPost({
        ...newPost,
        platforms: newPost.platforms.filter(p => p !== platform)
      });
    } else {
      setNewPost({
        ...newPost,
        platforms: [...newPost.platforms, platform]
      });
    }
  };

  // Filtrer les publications selon le statut
  const filteredPosts = statusFilter === 'all' 
    ? scheduledPosts 
    : scheduledPosts.filter(post => post.status === statusFilter);

  // Icônes pour les différentes plateformes
  const platformIcons: Record<string, React.ReactNode> = {
    instagram: <Instagram className="h-4 w-4 text-pink-600" />,
    facebook: <Facebook className="h-4 w-4 text-blue-600" />,
    twitter: <Twitter className="h-4 w-4 text-sky-500" />,
    linkedin: <Linkedin className="h-4 w-4 text-blue-800" />
  };

  // Icônes et couleurs pour les différents statuts
  const statusColors: Record<string, string> = {
    scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.title || !newPost.content || !newPost.date || !newPost.time || newPost.platforms.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const scheduledDateTime = new Date(`${newPost.date}T${newPost.time}`);
    
    const newScheduledPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      scheduled_for: scheduledDateTime.toISOString(),
      platforms: newPost.platforms,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };
    
    setScheduledPosts([newScheduledPost, ...scheduledPosts]);
    
    // Réinitialiser le formulaire
    setNewPost({
      title: '',
      content: '',
      date: '',
      time: '',
      platforms: []
    });
    
    // Fermer le formulaire
    setShowForm(false);
  };

  const handleFilterChange = (filter: 'all' | 'scheduled' | 'published' | 'draft') => {
    setStatusFilter(filter);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planificateur de publications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Programmez et gérez vos publications sur les réseaux sociaux</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle publication
              </>
            )}
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
            <p className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </p>
          </div>
        )}

        {/* Formulaire de nouvelle publication */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Programmer une nouvelle publication</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddPost} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                  <input
                    type="text"
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="Titre de votre publication"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
                  <textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white h-32"
                    placeholder="Contenu de votre publication"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        value={newPost.date}
                        onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                        className="w-full p-2.5 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        value={newPost.time}
                        onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                        className="w-full p-2.5 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plateformes</label>
                  <div className="flex flex-wrap gap-2">
                    {['instagram', 'facebook', 'twitter', 'linkedin'].map(platform => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={`flex items-center px-3 py-1.5 rounded-lg border ${
                          newPost.platforms.includes(platform)
                            ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-300'
                            : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {platformIcons[platform]}
                        <span className="ml-1.5 capitalize">{platform}</span>
                        {newPost.platforms.includes(platform) && <Check className="h-3 w-3 ml-1.5" />}
                      </button>
                    ))}
                  </div>
                  {newPost.platforms.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Veuillez sélectionner au moins une plateforme</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={newPost.platforms.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Programmer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulaire d'édition de publication */}
        {showEditForm && editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modifier la publication</h2>
                <button onClick={() => setShowEditForm(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitEditPost} className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                  <input
                    type="text"
                    id="edit-title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    placeholder="Titre de votre publication"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
                  <textarea
                    id="edit-content"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white h-32"
                    placeholder="Contenu de votre publication"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="edit-date"
                        value={editingPost.date.toISOString().split('T')[0]}
                        onChange={(e) => setEditingPost({ ...editingPost, date: new Date(e.target.value) })}
                        className="w-full p-2.5 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heure</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="edit-time"
                        value={editingPost.time}
                        onChange={(e) => setEditingPost({ ...editingPost, time: e.target.value })}
                        className="w-full p-2.5 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plateformes</label>
                  <div className="flex flex-wrap gap-2">
                    {['instagram', 'facebook', 'twitter', 'linkedin'].map(platform => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => {
                          if (editingPost.platforms.includes(platform)) {
                            setEditingPost({
                              ...editingPost,
                              platforms: editingPost.platforms.filter(p => p !== platform)
                            });
                          } else {
                            setEditingPost({
                              ...editingPost,
                              platforms: [...editingPost.platforms, platform]
                            });
                          }
                        }}
                        className={`flex items-center px-3 py-1.5 rounded-lg border ${
                          editingPost.platforms.includes(platform)
                            ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-300'
                            : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {platformIcons[platform]}
                        <span className="ml-1.5 capitalize">{platform}</span>
                        {editingPost.platforms.includes(platform) && <Check className="h-3 w-3 ml-1.5" />}
                      </button>
                    ))}
                  </div>
                  {editingPost.platforms.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Veuillez sélectionner au moins une plateforme</p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editingPost.platforms.length === 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-700 pb-3">
          <span className="text-sm text-gray-700 dark:text-gray-300">Filtrer par :</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-sm rounded-lg ${
              statusFilter === 'all'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1 text-sm rounded-lg ${
              statusFilter === 'scheduled'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Programmés
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1 text-sm rounded-lg ${
              statusFilter === 'published'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Publiés
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1 text-sm rounded-lg ${
              statusFilter === 'draft'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Brouillons
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={`px-3 py-1 text-sm rounded-lg ${
              statusFilter === 'failed'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Échoués
          </button>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}

        {/* Liste des publications planifiées */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">Aucune publication {statusFilter !== 'all' ? `${statusFilter}e` : ''} trouvée.</p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[post.status]}`}>
                        {post.status === 'scheduled' && 'Programmé'}
                        {post.status === 'published' && 'Publié'}
                        {post.status === 'failed' && 'Échoué'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.platforms.map(platform => (
                      <span key={platform} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-xs">
                        {platformIcons[platform]}
                        <span className="ml-1 capitalize">{platform}</span>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.date)}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {post.time}
                    </div>
                    
                    <div className="flex space-x-2">
                      {post.status === 'scheduled' && (
                        <>
                          <button 
                            onClick={() => handleEditPost(post)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {post.status === 'failed' && (
                        <button className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300">
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchedulerPage; 