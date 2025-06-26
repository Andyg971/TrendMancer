import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  PanelRight, 
  Download, 
  Copy, 
  ClipboardCopy, 
  Share2, 
  Trash2, 
  RotateCcw, 
  Loader, 
  Info,
  Clock,
  ImageIcon,
  CheckCircle,
  RefreshCw,
  Settings,
  Sparkles,
  Trash
} from 'lucide-react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SubscriptionFeatureCheck from '../../components/SubscriptionFeatureCheck';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../utils/supabase';
import { checkResourceLimit } from '../../services/subscriptionService';

// Types pour les images générées
interface GeneratedImage {
  id: string;
  imageUrls: string[];
  enhancedPrompt: string;
  originalPrompt: string;
  style: string;
  platform: string;
  aspectRatio: string;
  colorScheme?: string;
  createdAt: string;
}

// Type pour les paramètres de requête
interface ImageGenerationParams {
  prompt: string;
  style: string;
  colorScheme?: string;
  brandGuidelines: {
    logo?: boolean;
    colors?: string[];
    typography?: string;
    tone?: string;
  };
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest';
  aspectRatio: '1:1' | '4:5' | '16:9' | '9:16' | '4:3';
}

// Options pour les styles d'image
const styleOptions = [
  { value: 'naturel', label: 'Naturel' },
  { value: 'minimaliste', label: 'Minimaliste' },
  { value: 'artistique', label: 'Artistique' },
  { value: 'professionnel', label: 'Professionnel' },
  { value: 'futuriste', label: 'Futuriste' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'abstrait', label: 'Abstrait' },
];

// Options pour les plateformes
const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'pinterest', label: 'Pinterest' },
];

// Options pour les rapports d'aspect
const aspectRatioOptions = [
  { value: '1:1', label: 'Carré (1:1)' },
  { value: '4:5', label: 'Portrait Instagram (4:5)' },
  { value: '16:9', label: 'Paysage (16:9)' },
  { value: '9:16', label: 'Story/Réels (9:16)' },
  { value: '4:3', label: 'Standard (4:3)' },
];

// Options pour les schémas de couleurs
const colorSchemeOptions = [
  { value: 'chauds', label: 'Tons chauds' },
  { value: 'froids', label: 'Tons froids' },
  { value: 'neutres', label: 'Tons neutres' },
  { value: 'vifs', label: 'Couleurs vives' },
  { value: 'pastels', label: 'Pastels' },
  { value: 'monochromes', label: 'Monochromes' },
];

const ImageGeneratorPage: React.FC = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  
  // États pour les paramètres de génération
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('naturel');
  const [colorScheme, setColorScheme] = useState<string | undefined>();
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest'>('instagram');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9' | '9:16' | '4:3'>('1:1');
  const [brandGuidelines, setBrandGuidelines] = useState<{
    logo?: boolean;
    colors?: string[];
    typography?: string;
    tone?: string;
  }>({});
  
  // États pour l'UI
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(10);
  const [brandColor, setBrandColor] = useState('');
  const [brandColors, setBrandColors] = useState<string[]>([]);
  const [brandTypography, setBrandTypography] = useState('');
  const [brandTone, setBrandTone] = useState('');
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Effet pour charger les paramètres de marque
  useEffect(() => {
    if (user) {
      const loadBrandSettings = async () => {
        const { data, error } = await supabase
          .from('brand_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setBrandGuidelines(data.guidelines || {});
          setBrandColors(data.guidelines?.colors || []);
          setBrandTypography(data.guidelines?.typography || '');
          setBrandTone(data.guidelines?.tone || '');
        }
      };
      
      loadBrandSettings();
    }
  }, [user, supabase]);
  
  // Effet pour charger l'historique des images
  useEffect(() => {
    if (user && showHistory) {
      loadImageHistory();
    }
  }, [user, showHistory]);
  
  // Fonction pour charger l'historique des images
  const loadImageHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/image-generator?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        }
      });
      
      if (response.ok) {
        const { data } = await response.json();
        setImageHistory(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast.error('Impossible de charger l\'historique des images');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  // Fonction pour ajouter une couleur à la marque
  const addBrandColor = () => {
    if (brandColor && !brandColors.includes(brandColor)) {
      const newColors = [...brandColors, brandColor];
      setBrandColors(newColors);
      setBrandGuidelines(prev => ({ ...prev, colors: newColors }));
      setBrandColor('');
    }
  };
  
  // Fonction pour supprimer une couleur de la marque
  const removeBrandColor = (colorToRemove: string) => {
    const newColors = brandColors.filter(color => color !== colorToRemove);
    setBrandColors(newColors);
    setBrandGuidelines(prev => ({ ...prev, colors: newColors }));
  };
  
  // Mise à jour de la typographie
  const updateTypography = (value: string) => {
    setBrandTypography(value);
    setBrandGuidelines(prev => ({ ...prev, typography: value }));
  };
  
  // Mise à jour du ton
  const updateTone = (value: string) => {
    setBrandTone(value);
    setBrandGuidelines(prev => ({ ...prev, tone: value }));
  };
  
  // Fonction pour générer des images
  const generateImages = async () => {
    if (!prompt) {
      toast.error('Veuillez entrer un prompt pour générer des images');
      return;
    }
    
    if (!user) {
      toast.error('Veuillez vous connecter pour générer des images');
      return;
    }
    
    if (remainingGenerations !== null && remainingGenerations <= 0) {
      setError('Vous avez atteint votre limite de générations d\'images. Veuillez mettre à niveau votre abonnement pour continuer.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const params: ImageGenerationParams = {
        prompt,
        style,
        colorScheme,
        brandGuidelines: {
          colors: brandColors,
          typography: brandTypography,
          tone: brandTone
        },
        platform,
        aspectRatio
      };
      
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await supabase.auth.getSession().then(res => res.data.session?.access_token)}`
        },
        body: JSON.stringify({
          userId: user.id,
          ...params
        })
      });
      
      if (response.ok) {
        const { data } = await response.json();
        
        const newImage: GeneratedImage = {
          id: data.id,
          imageUrls: data.imageUrls,
          enhancedPrompt: data.enhancedPrompt,
          originalPrompt: prompt,
          style,
          platform,
          aspectRatio,
          colorScheme,
          createdAt: new Date().toISOString()
        };
        
        setGeneratedImages([newImage, ...generatedImages]);
        setSelectedImage(newImage);
        setRemainingCredits(prev => Math.max(0, prev - 1));
        toast.success('Images générées avec succès!');
        
        // Mettre à jour le compteur de générations restantes
        if (remainingGenerations !== null) {
          setRemainingGenerations(remainingGenerations - 1);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la génération des images');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération des images');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Fonction pour télécharger une image
  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `image-${Date.now()}.jpg`;
    link.click();
  };
  
  // Fonction pour copier une image
  const copyImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast.success('Image copiée dans le presse-papier');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast.error('Impossible de copier l\'image');
    }
  };
  
  // Fonction pour copier le prompt
  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt copié dans le presse-papier');
  };
  
  // Fonction pour supprimer une image
  const deleteImage = async (id: string) => {
    setGeneratedImages(generatedImages.filter(img => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };
  
  return (
    <DashboardLayout>
      <SubscriptionFeatureCheck featureName="image_generator">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Générateur d'Images IA</h1>
              <p className="text-gray-600">Créez des images uniques en utilisant l'intelligence artificielle</p>
            </div>
            {remainingGenerations !== null && (
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                <span>Générations restantes: <strong>{remainingGenerations}</strong></span>
              </div>
            )}
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Générer une nouvelle image</CardTitle>
              <CardDescription>
                Décrivez l'image que vous souhaitez créer en détail. Plus votre description est précise, meilleur sera le résultat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Décrivez l'image que vous souhaitez générer..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setPrompt('')}
                disabled={isGenerating || !prompt}
              >
                Effacer
              </Button>
              <Button
                onClick={generateImages}
                disabled={isGenerating || !prompt || (remainingGenerations !== null && remainingGenerations <= 0)}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer l'image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Images générées</h2>
            
            {generatedImages.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Aucune image générée</h3>
                <p className="text-gray-500 mt-2">
                  Les images que vous générez apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={image.imageUrls[0]}
                        alt={image.enhancedPrompt}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {image.enhancedPrompt}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-3 pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadImage(image.imageUrls[0])}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SubscriptionFeatureCheck>
    </DashboardLayout>
  );
};

export default ImageGeneratorPage; 