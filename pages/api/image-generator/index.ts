import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ImageRequest {
  userId: string;
  prompt: string;
  style?: string;
  colorScheme?: string;
  brandGuidelines?: {
    logo?: boolean;
    colors?: string[];
    typography?: string;
    tone?: string;
  };
  platform?: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest';
  aspectRatio?: '1:1' | '4:5' | '16:9' | '9:16' | '4:3';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier l'authentification
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  const token = authorization.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  if (req.method === 'POST') {
    try {
      const {
        userId,
        prompt,
        style = 'naturel',
        colorScheme,
        brandGuidelines,
        platform = 'instagram',
        aspectRatio = '1:1'
      } = req.body as ImageRequest;

      if (!userId || !prompt) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Vérifier le quota de génération d'images de l'utilisateur
      const { data: userQuota, error: quotaError } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (quotaError && quotaError.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification du quota:', quotaError);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      // Vérifier si l'utilisateur a dépassé son quota (dans un cas réel)
      // Ici, nous simulons cette vérification
      const hasReachedQuota = false;
      if (hasReachedQuota) {
        return res.status(403).json({
          error: 'Quota dépassé',
          message: 'Vous avez atteint votre limite de génération d\'images pour ce mois-ci.'
        });
      }

      // Récupérer les paramètres de marque de l'utilisateur si disponibles
      const { data: brandSettings, error: brandError } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (brandError && brandError.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération des paramètres de marque:', brandError);
      }

      // Fusionner les directives de marque avec les paramètres de marque sauvegardés
      const mergedBrandGuidelines = {
        ...brandSettings?.guidelines,
        ...brandGuidelines
      };

      // Enrichir le prompt avec les directives de marque
      const enhancedPrompt = enrichPromptWithBrandGuidelines(
        prompt,
        mergedBrandGuidelines,
        style,
        colorScheme,
        platform,
        aspectRatio
      );

      // Dans une implémentation réelle, nous appellerions ici une API d'IA pour générer l'image
      // Pour cet exemple, nous simulons une génération d'image
      const imageUrls = await simulateImageGeneration(enhancedPrompt, aspectRatio);

      // Enregistrer la demande de génération dans la base de données
      const { data: savedGeneration, error: dbError } = await supabase
        .from('image_generations')
        .insert({
          user_id: userId,
          original_prompt: prompt,
          enhanced_prompt: enhancedPrompt,
          style,
          platform,
          aspect_ratio: aspectRatio,
          color_scheme: colorScheme,
          brand_guidelines: mergedBrandGuidelines,
          image_urls: imageUrls,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erreur d\'enregistrement de la génération:', dbError);
      }

      res.status(200).json({ 
        data: {
          id: savedGeneration?.id,
          imageUrls,
          enhancedPrompt
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération d\'image:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId, generationId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'ID utilisateur manquant' });
      }

      if (generationId) {
        // Récupérer une génération spécifique
        const { data: generation, error: generationError } = await supabase
          .from('image_generations')
          .select('*')
          .eq('id', generationId)
          .eq('user_id', userId)
          .single();

        if (generationError) {
          console.error('Erreur lors de la récupération de la génération:', generationError);
          return res.status(404).json({ error: 'Génération non trouvée' });
        }

        return res.status(200).json({ 
          data: generation
        });
      } else {
        // Récupérer l'historique des générations de l'utilisateur
        const { data: generations, error: generationsError } = await supabase
          .from('image_generations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (generationsError) {
          console.error('Erreur lors de la récupération des générations:', generationsError);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        return res.status(200).json({ 
          data: generations
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des générations d\'images:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}

// Fonction pour enrichir le prompt avec les directives de marque
function enrichPromptWithBrandGuidelines(
  prompt: string,
  brandGuidelines: any,
  style: string,
  colorScheme?: string,
  platform?: string,
  aspectRatio?: string
): string {
  let enhancedPrompt = prompt;

  // Ajouter des éléments liés au style
  enhancedPrompt += `, dans un style ${style}`;

  // Ajouter des éléments liés au schéma de couleurs si spécifié
  if (colorScheme) {
    enhancedPrompt += `, en utilisant principalement des teintes ${colorScheme}`;
  }

  // Ajouter des éléments liés aux directives de marque
  if (brandGuidelines) {
    if (brandGuidelines.colors && brandGuidelines.colors.length > 0) {
      enhancedPrompt += `, avec les couleurs de la marque: ${brandGuidelines.colors.join(', ')}`;
    }

    if (brandGuidelines.typography) {
      enhancedPrompt += `, en respectant la typographie ${brandGuidelines.typography}`;
    }

    if (brandGuidelines.tone) {
      enhancedPrompt += `, avec un ton ${brandGuidelines.tone}`;
    }
  }

  // Ajouter des éléments liés à la plateforme
  if (platform) {
    enhancedPrompt += `, optimisé pour ${platform}`;
  }

  // Ajouter des éléments liés aux proportions de l'image
  if (aspectRatio) {
    enhancedPrompt += `, au format ${aspectRatio}`;
  }

  // Ajouter des éléments généraux pour améliorer la qualité
  enhancedPrompt += `, haute qualité, éclairage professionnel, détaillé`;

  return enhancedPrompt;
}

// Fonction pour simuler la génération d'images
async function simulateImageGeneration(prompt: string, aspectRatio: string): Promise<string[]> {
  // Dans une implémentation réelle, nous appellerions ici une API d'IA comme DALL-E, Midjourney, etc.
  // Pour cet exemple, nous renvoyons simplement des URLs d'images statiques de placeholder

  // Déterminer les dimensions en fonction du ratio d'aspect
  let width = 1080;
  let height = 1080;

  switch (aspectRatio) {
    case '4:5':
      width = 1080;
      height = 1350;
      break;
    case '16:9':
      width = 1920;
      height = 1080;
      break;
    case '9:16':
      width = 1080;
      height = 1920;
      break;
    case '4:3':
      width = 1280;
      height = 960;
      break;
    default:
      width = 1080;
      height = 1080;
  }

  // Générer des images aléatoires
  const seed = Math.floor(Math.random() * 1000);
  const images = [
    `https://picsum.photos/seed/${seed}/1080/1080`,
    `https://picsum.photos/seed/${seed + 1}/1080/1080`,
    `https://picsum.photos/seed/${seed + 2}/1080/1080`,
    `https://picsum.photos/seed/${seed + 3}/1080/1080`
  ];

  // Simuler un délai de génération
  await new Promise(resolve => setTimeout(resolve, 500));

  return images;
} 