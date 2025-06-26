import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SocialPostsList from '../../components/dashboard/SocialPostsList';
import PostEditor from '../../components/dashboard/PostEditor';
import { SocialPost } from '../../services/postsService';

const SocialFeedPage = () => {
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const handleEditPost = (post: SocialPost) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleCreatePost = () => {
    setSelectedPost(null);
    setIsCreatingPost(true);
    setShowEditor(true);
  };

  const handleSavePost = (post: SocialPost) => {
    setShowEditor(false);
    setIsCreatingPost(false);
    setSelectedPost(null);
    // On pourrait rafraîchir la liste des publications ici
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setIsCreatingPost(false);
    setSelectedPost(null);
  };

  return (
    <DashboardLayout>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Flux Social</h1>
          <p className="mt-1 text-gray-500">
            Gérez et suivez vos publications sur les différentes plateformes
          </p>
        </div>

        <div className="space-y-6">
          {showEditor ? (
            <PostEditor 
              post={selectedPost || undefined} 
              onSave={handleSavePost} 
              onCancel={handleCancelEdit} 
            />
          ) : (
            <SocialPostsList
              onEdit={handleEditPost}
              onCreateNew={handleCreatePost}
            />
          )}

          {/* Nous pourrions ajouter d'autres sections ici comme:
            - Un modal pour créer/modifier des publications
            - Des statistiques récentes
            - Des recommandations de contenu
          */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialFeedPage; 