import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardFooter 
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Instagram, Facebook, Twitter, Linkedin, Calendar, Image as ImageIcon, X, Smile, Check
} from 'lucide-react';
import { 
  SocialPost, createPost, updateSocialPost, publishPost, schedulePost 
} from '../../services/postsService';
import { supabase } from '../../utils/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRangePicker } from '../ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface PostEditorProps {
  post?: SocialPost;
  onSave: (post: SocialPost) => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(post?.title || '');
  const [content, setContent] = useState<string>(post?.content || '');
  const [platform, setPlatform] = useState<string>(post?.platform || 'instagram');
  const [scheduledDate, setScheduledDate] = useState<Date | null>(
    post?.scheduled_for ? new Date(post.scheduled_for) : null
  );
  const [isScheduling, setIsScheduling] = useState<boolean>(!!post?.scheduled_for);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>(post?.media_urls || []);
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'ID utilisateur
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };

    getCurrentUser();
  }, []);

  const handlePlatformChange = (selectedPlatform: string) => {
    setPlatform(selectedPlatform);
  };

  const handleScheduleDateChange = (date: DateRange | null) => {
    if (date?.from) {
      setScheduledDate(date.from);
    } else {
      setScheduledDate(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${userId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('posts').getPublicUrl(filePath);
      
      if (data?.publicUrl) {
        setMediaFiles([...mediaFiles, data.publicUrl]);
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setError('Erreur lors de l\'upload du fichier');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveMedia = (url: string) => {
    setMediaFiles(mediaFiles.filter(m => m !== url));
  };

  const handleSavePost = async (isPublish: boolean = false) => {
    if (!userId) return;
    if (!title || !content) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const postData: SocialPost = {
        id: post?.id,
        title,
        content,
        platform,
        status: isPublish ? 'published' : (isScheduling && scheduledDate ? 'scheduled' : 'draft'),
        media_urls: mediaFiles,
        tags,
        scheduled_for: isScheduling && scheduledDate ? scheduledDate.toISOString() : undefined,
        published_at: isPublish ? new Date().toISOString() : undefined
      };
      
      let result;
      
      if (post?.id) {
        // Mise à jour d'un post existant
        result = await updateSocialPost(postData, userId);
      } else {
        // Création d'un nouveau post
        result = await createPost(postData, userId);
      }
      
      if (result.error) throw result.error;
      
      if (result.data) {
        // Si on veut publier maintenant
        if (isPublish && result.data.id) {
          const publishResult = await publishPost(result.data.id, userId);
          if (publishResult.error) throw publishResult.error;
          onSave(publishResult.data || result.data);
        } 
        // Si on veut programmer la publication
        else if (isScheduling && scheduledDate && result.data.id) {
          const scheduleResult = await schedulePost(result.data.id, scheduledDate, userId);
          if (scheduleResult.error) throw scheduleResult.error;
          onSave(scheduleResult.data || result.data);
        } else {
          onSave(result.data);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde de la publication');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{post?.id ? 'Modifier la publication' : 'Nouvelle publication'}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          {/* Sélection de plateforme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plateforme
            </label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={platform === 'instagram' ? 'default' : 'outline'}
                onClick={() => handlePlatformChange('instagram')}
                className="flex items-center"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
              <Button
                type="button"
                variant={platform === 'facebook' ? 'default' : 'outline'}
                onClick={() => handlePlatformChange('facebook')}
                className="flex items-center"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button
                type="button"
                variant={platform === 'twitter' ? 'default' : 'outline'}
                onClick={() => handlePlatformChange('twitter')}
                className="flex items-center"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                type="button"
                variant={platform === 'linkedin' ? 'default' : 'outline'}
                onClick={() => handlePlatformChange('linkedin')}
                className="flex items-center"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de votre publication"
              className="w-full"
            />
          </div>
          
          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrivez votre contenu ici..."
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <div className="absolute bottom-2 right-2">
                <button 
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  title="Ajouter des emojis"
                >
                  <Smile className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {content.length} caractères
              {platform === 'twitter' && content.length > 280 && 
                <span className="text-red-500 ml-2">Dépassement de la limite de 280 caractères</span>
              }
            </div>
          </div>
          
          {/* Médias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Médias
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {mediaFiles.map((url, index) => (
                <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden group">
                  <img 
                    src={url} 
                    alt={`Média ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={handleUploadMedia}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <span className="animate-pulse">Chargement...</span>
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </label>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Ajouter un tag (appuyez sur Entrée)"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                className="ml-2"
              >
                Ajouter
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 px-2 py-1 rounded-md flex items-center group"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-400 group-hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Programmation */}
          <div>
            <div className="flex items-center mb-2">
              <input
                id="schedule"
                type="checkbox"
                checked={isScheduling}
                onChange={(e) => setIsScheduling(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label htmlFor="schedule" className="ml-2 block text-sm font-medium text-gray-700">
                Programmer la publication
              </label>
            </div>
            
            {isScheduling && (
              <div className="mt-2">
                <DateRangePicker
                  value={scheduledDate ? { from: scheduledDate, to: scheduledDate } : null}
                  onChange={handleScheduleDateChange}
                  placeholderText="Sélectionner une date de publication"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Annuler
        </Button>
        
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSavePost(false)}
            disabled={isSaving}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer comme brouillon'}
          </Button>
          
          {isScheduling && scheduledDate ? (
            <Button
              type="button"
              variant="default"
              onClick={() => handleSavePost(false)}
              disabled={isSaving || !scheduledDate}
              className="flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {isSaving ? 'Programmation...' : 'Programmer'}
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={() => handleSavePost(true)}
              disabled={isSaving}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              {isSaving ? 'Publication...' : 'Publier maintenant'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 