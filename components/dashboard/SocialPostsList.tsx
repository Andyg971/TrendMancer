import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '../../components/ui/card';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '../../components/ui/table';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { getUserPosts, SocialPost, PostFilter, publishPost, schedulePost, deleteSocialPost } from '../../services/postsService';
import { supabase } from '../../utils/supabase';
import { 
  Calendar, Clock, Edit, Trash2, ExternalLink, Instagram, Facebook, Twitter, Linkedin, Filter, Search, Plus, Share2, Heart, MessageSquare, Eye 
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRangePicker } from '../../components/ui/date-range-picker';

const platformIcons = {
  instagram: <Instagram className="h-4 w-4 text-pink-500" />,
  facebook: <Facebook className="h-4 w-4 text-blue-600" />,
  twitter: <Twitter className="h-4 w-4 text-blue-400" />,
  linkedin: <Linkedin className="h-4 w-4 text-blue-700" />
};

const statusColors = {
  draft: 'bg-gray-200 text-gray-800',
  scheduled: 'bg-amber-200 text-amber-800',
  published: 'bg-green-200 text-green-800',
  failed: 'bg-red-200 text-red-800'
};

interface SocialPostsListProps {
  onEdit?: (post: SocialPost) => void;
  onCreateNew?: () => void;
}

export default function SocialPostsList({ onEdit, onCreateNew }: SocialPostsListProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [filters, setFilters] = useState<PostFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<any | null>(null);

  // Récupérer l'utilisateur actuel
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      } else {
        setError("Vous devez être connecté pour accéder à cette page.");
      }
    };

    getCurrentUser();
  }, []);

  // Charger les publications en fonction des filtres
  useEffect(() => {
    if (!userId) return;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Déterminer les filtres en fonction de l'onglet et des filtres supplémentaires
        const postFilters: PostFilter = { ...filters };
        
        if (currentTab !== 'all') {
          postFilters.status = currentTab as 'draft' | 'scheduled' | 'published' | 'failed';
        }
        
        if (platform !== 'all') {
          postFilters.platform = platform;
        }
        
        if (searchTerm) {
          postFilters.searchTerm = searchTerm;
        }
        
        if (dateRange) {
          postFilters.dateRange = dateRange;
        }

        const { data, error } = await getUserPosts(userId, postFilters);
        
        if (error) throw new Error(error.toString());
        if (data) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des publications:', err);
        setError("Une erreur est survenue lors du chargement des publications.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [userId, currentTab, filters, searchTerm, platform, dateRange]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePlatformChange = (value: string) => {
    setPlatform(value);
  };

  const handleDateRangeChange = (date: any | null) => {
    if (date?.from) {
      setDateRange(date);
      // Convertir pour les filtres
      setFilters(prev => ({
        ...prev,
        dateRange: date.from && {
          start: date.from,
          end: date.to || date.from
        }
      }));
    } else {
      setDateRange(null);
      setFilters(prev => ({
        ...prev,
        dateRange: undefined
      }));
    }
  };

  const handlePublish = async (postId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await publishPost(postId, userId);
      if (error) throw new Error(error.toString());
      
      // Mettre à jour la liste des publications
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, status: 'published', published_at: new Date().toISOString() } : post
        )
      );
    } catch (err) {
      console.error('Erreur lors de la publication:', err);
      setError("Une erreur est survenue lors de la publication.");
    }
  };

  const handleSchedule = async (postId: string, date: Date) => {
    if (!userId) return;
    
    try {
      const { data, error } = await schedulePost(postId, date, userId);
      if (error) throw new Error(error.toString());
      
      // Mettre à jour la liste des publications
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? { ...post, status: 'scheduled', scheduled_for: date.toISOString() } : post
        )
      );
    } catch (err) {
      console.error('Erreur lors de la planification:', err);
      setError("Une erreur est survenue lors de la planification.");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!userId || !window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) return;
    
    try {
      const { success, error } = await deleteSocialPost(postId, userId);
      if (error) throw new Error(error.toString());
      
      if (success) {
        // Supprimer la publication de la liste
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError("Une erreur est survenue lors de la suppression.");
    }
  };

  const renderStatusBadge = (status: string) => {
    const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-200 text-gray-800';
    
    return (
      <Badge className={color}>
        {status === 'draft' && 'Brouillon'}
        {status === 'scheduled' && 'Planifié'}
        {status === 'published' && 'Publié'}
        {status === 'failed' && 'Échec'}
      </Badge>
    );
  };

  const renderPlatformIcon = (platform: string) => {
    return platformIcons[platform as keyof typeof platformIcons] || <ExternalLink className="h-4 w-4" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy à HH:mm', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Publications</CardTitle>
            <CardDescription>Gérez vos publications sur les réseaux sociaux</CardDescription>
          </div>
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle publication
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <Select value={platform} onChange={(e) => handlePlatformChange(e.target.value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Toutes les plateformes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les plateformes</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholderText="Sélectionner une période"
          />
        </div>
        
        {/* Onglets par statut */}
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="draft">Brouillons</TabsTrigger>
            <TabsTrigger value="scheduled">Planifiées</TabsTrigger>
            <TabsTrigger value="published">Publiées</TabsTrigger>
            <TabsTrigger value="failed">Échecs</TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab}>
            {loading ? (
              <div className="text-center py-8">Chargement des publications...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune publication trouvée. Créez votre première publication !
              </div>
            ) : (
              <Table>
                <TableCaption>Liste de vos publications</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plateforme</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderPlatformIcon(post.platform)}
                          <span className="capitalize">{post.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {post.content}
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(post.status)}</TableCell>
                      <TableCell>
                        {post.status === 'published' && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                        )}
                        {post.status === 'scheduled' && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-500" />
                            <span>{formatDate(post.scheduled_for)}</span>
                          </div>
                        )}
                        {(post.status !== 'published' && post.status !== 'scheduled') && '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-red-500" />
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3 text-blue-500" />
                            <span>{post.comments || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3 w-3 text-green-500" />
                            <span>{post.shares || 0}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit && onEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {post.status === 'draft' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handlePublish(post.id || '')}
                            >
                              <ExternalLink className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(post.id || '')}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 