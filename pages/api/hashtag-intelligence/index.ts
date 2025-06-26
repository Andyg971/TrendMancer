import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface HashtagRequest {
  content: string;
  userId: string;
  platform: string;
  count?: number;
  industry?: string;
  useAI?: boolean;
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
      const { content, userId, platform, count = 10, industry, useAI = true } = req.body as HashtagRequest;

      if (!content || !userId || !platform) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Récupérer les hashtags populaires dans l'industrie
      const { data: industryHashtags, error: industryError } = await supabase
        .from('popular_hashtags')
        .select('*')
        .eq('industry', industry || 'general')
        .eq('platform', platform.toLowerCase())
        .limit(50);

      if (industryError) {
        console.error('Erreur lors de la récupération des hashtags par industrie:', industryError);
      }

      // Analyser le contenu pour extraire les mots-clés pertinents
      const keywords = extractKeywords(content);

      // Générer des hashtags basés sur le contenu et les tendances
      const generatedHashtags = generateHashtags(
        content,
        platform,
        keywords,
        industryHashtags || [],
        count,
        useAI
      );

      // Enregistrer la recherche dans la base de données
      const { data: savedSearch, error: dbError } = await supabase
        .from('hashtag_searches')
        .insert({
          user_id: userId,
          content_preview: content.substring(0, 100),
          platform,
          hashtags: generatedHashtags,
          industry: industry || 'general',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erreur d\'enregistrement de la recherche:', dbError);
      }

      res.status(200).json({ 
        data: {
          hashtags: generatedHashtags,
          trends: getTrendingHashtags(platform, industry),
          searchId: savedSearch?.id
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération des hashtags:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId, platform, industry } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'UserId manquant' });
      }

      // Récupérer l'historique des recherches de hashtags de l'utilisateur
      let query = supabase
        .from('hashtag_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (platform) {
        query = query.eq('platform', platform);
      }

      if (industry) {
        query = query.eq('industry', industry);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Erreur lors de la récupération de l\'historique:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      // Récupérer les hashtags tendance
      const trending = getTrendingHashtags(platform as string, industry as string);

      res.status(200).json({ 
        data: {
          history: data,
          trends: trending
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}

// Fonction pour extraire les mots-clés d'un contenu
function extractKeywords(content: string): string[] {
  // Dans une application réelle, cette fonction utiliserait du NLP ou une API
  const text = content.toLowerCase();
  
  // Éliminer la ponctuation et caractères spéciaux
  const cleanText = text.replace(/[^\w\s]/gi, ' ');
  
  // Diviser en mots
  const words = cleanText.split(/\s+/);
  
  // Éliminer les mots vides
  const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'de', 'du', 'au', 'aux', 'ce', 'ces', 'cette', 'a', 'ont', 'est', 'sont', 'pour', 'dans', 'sur', 'par', 'avec', 'sans', 'à', 'en', 'qui', 'que', 'quoi', 'dont', 'où'];
  const filteredWords = words.filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Éliminer les doublons et trier par fréquence
  const wordCounts: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

// Fonction pour générer des hashtags basés sur le contenu
function generateHashtags(
  content: string,
  platform: string,
  keywords: string[],
  industryHashtags: any[],
  count: number,
  useAI: boolean
): string[] {
  // Créer un ensemble pour éviter les doublons
  const hashtagSet = new Set<string>();
  
  // Ajouter des hashtags basés sur les mots-clés extraits
  keywords.forEach(keyword => {
    hashtagSet.add(`#${keyword}`);
  });
  
  // Ajouter des hashtags populaires de l'industrie qui sont pertinents
  if (industryHashtags.length > 0) {
    // Trier les hashtags de l'industrie par pertinence pour le contenu
    const sortedIndustryHashtags = industryHashtags
      .map(hashtag => ({
        tag: hashtag.tag,
        relevance: keywords.some(keyword => hashtag.tag.toLowerCase().includes(keyword)) ? 2 : 1,
        popularity: hashtag.popularity || 1
      }))
      .sort((a, b) => (b.relevance * b.popularity) - (a.relevance * a.popularity));
    
    // Ajouter les hashtags les plus pertinents
    sortedIndustryHashtags.forEach(hashtag => {
      if (hashtagSet.size < count) {
        hashtagSet.add(`#${hashtag.tag}`);
      }
    });
  }
  
  // Si nous n'avons pas assez de hashtags, ajouter des hashtags génériques spécifiques à la plateforme
  const platformSpecificHashtags = getPlatformSpecificHashtags(platform);
  if (hashtagSet.size < count) {
    platformSpecificHashtags.forEach(hashtag => {
      if (hashtagSet.size < count) {
        hashtagSet.add(hashtag);
      }
    });
  }
  
  // Convertir l'ensemble en tableau et limiter au nombre demandé
  return Array.from(hashtagSet).slice(0, count);
}

// Fonction pour obtenir des hashtags spécifiques à la plateforme
function getPlatformSpecificHashtags(platform: string): string[] {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return ['#instagood', '#photooftheday', '#instagram', '#instadaily', '#picoftheday', '#follow', '#nature', '#photography', '#travel', '#fashion', '#beautiful', '#art', '#happy', '#love'];
    case 'twitter':
      return ['#tweetoftheday', '#trending', '#followback', '#news', '#nowplaying', '#viral', '#socialmedia'];
    case 'linkedin':
      return ['#networking', '#careers', '#jobsearch', '#leadership', '#professionaldevelopment', '#business', '#innovation', '#entrepreneurship'];
    case 'facebook':
      return ['#facebooklive', '#community', '#sharing', '#friends', '#events', '#moments'];
    case 'tiktok':
      return ['#fyp', '#foryoupage', '#trending', '#viral', '#challenge', '#tiktoktrend', '#duet', '#foryou'];
    default:
      return ['#socialmedia', '#digital', '#trending', '#content', '#online'];
  }
}

// Fonction pour obtenir des hashtags tendance
function getTrendingHashtags(platform?: string, industry?: string): any[] {
  // Dans une application réelle, cette fonction ferait un appel à une API pour obtenir les tendances
  const trending = [
    { tag: 'innovation', count: 562000, growth: '+15%', platforms: ['instagram', 'linkedin', 'twitter'] },
    { tag: 'marketing', count: 985000, growth: '+8%', platforms: ['instagram', 'linkedin', 'facebook'] },
    { tag: 'sustainability', count: 425000, growth: '+25%', platforms: ['instagram', 'linkedin', 'facebook'] },
    { tag: 'technology', count: 723000, growth: '+12%', platforms: ['twitter', 'linkedin'] },
    { tag: 'digital', count: 632000, growth: '+10%', platforms: ['instagram', 'linkedin', 'twitter'] },
    { tag: 'business', count: 891000, growth: '+5%', platforms: ['linkedin', 'facebook'] },
    { tag: 'startup', count: 345000, growth: '+18%', platforms: ['linkedin', 'twitter'] },
    { tag: 'design', count: 527000, growth: '+9%', platforms: ['instagram', 'pinterest'] },
    { tag: 'productivity', count: 218000, growth: '+14%', platforms: ['linkedin', 'twitter'] },
    { tag: 'remote', count: 324000, growth: '+20%', platforms: ['linkedin', 'twitter'] }
  ];
  
  // Filtrer par plateforme si spécifiée
  let filteredTrending = trending;
  if (platform) {
    filteredTrending = trending.filter(tag => 
      tag.platforms.includes(platform.toLowerCase())
    );
  }
  
  // Simuler des hashtags spécifiques à l'industrie
  if (industry) {
    const industrySpecific = {
      'tech': ['ai', 'machinelearning', 'datascience', 'coding', 'developers'],
      'marketing': ['branding', 'digitalmarketing', 'contentmarketing', 'seo', 'smm'],
      'finance': ['fintech', 'investing', 'trading', 'banking', 'stocks'],
      'health': ['wellness', 'fitness', 'nutrition', 'mentalhealth', 'healthcare'],
      'education': ['learning', 'students', 'teaching', 'edtech', 'onlinelearning']
    };
    
    const specificHashtags = (industrySpecific as any)[industry.toLowerCase()] || [];
    specificHashtags.forEach((tag: string, index: number) => {
      filteredTrending.push({
        tag,
        count: Math.floor(Math.random() * 500000) + 100000,
        growth: `+${Math.floor(Math.random() * 30) + 5}%`,
        platforms: platform ? [platform.toLowerCase()] : ['instagram', 'linkedin', 'twitter']
      });
    });
  }
  
  // Trier par nombre d'utilisation
  return filteredTrending
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(tag => ({
      ...tag,
      tag: `#${tag.tag}`
    }));
} 