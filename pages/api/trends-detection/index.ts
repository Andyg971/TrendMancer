import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface TrendRequest {
  userId: string;
  industries: string[];
  keywords?: string[];
  minTrendScore?: number;
  timeframe?: 'day' | 'week' | 'month';
  maxResults?: number;
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
        industries,
        keywords = [],
        minTrendScore = 70,
        timeframe = 'week',
        maxResults = 10
      } = req.body as TrendRequest;

      if (!userId || !industries || industries.length === 0) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Récupérer les tendances pour les industries spécifiées
      const { data: industryTrends, error: trendsError } = await supabase
        .from('trending_topics')
        .select('*')
        .in('industry', industries)
        .gte('trend_score', minTrendScore)
        .order('trend_score', { ascending: false });

      if (trendsError) {
        console.error('Erreur lors de la récupération des tendances:', trendsError);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      // Récupérer l'historique de contenu de l'utilisateur pour filtrer les tendances
      const { data: userContent, error: contentError } = await supabase
        .from('user_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (contentError) {
        console.error('Erreur lors de la récupération du contenu utilisateur:', contentError);
      }

      // Filtrer et prioriser les tendances
      const filteredTrends = filterAndPrioritizeTrends(
        industryTrends || [],
        userContent || [],
        keywords,
        timeframe
      );

      // Limiter les résultats
      const limitedTrends = filteredTrends.slice(0, maxResults);

      // Générer des recommandations de contenu pour chaque tendance
      const trendsWithRecommendations = await Promise.all(
        limitedTrends.map(async (trend) => {
          const contentIdeas = generateContentIdeas(trend, industries);
          
          return {
            ...trend,
            contentIdeas
          };
        })
      );

      // Enregistrer la recherche dans la base de données
      const { data: savedSearch, error: dbError } = await supabase
        .from('trend_searches')
        .insert({
          user_id: userId,
          industries,
          keywords,
          timeframe,
          trend_count: limitedTrends.length,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Erreur d\'enregistrement de la recherche:', dbError);
      }

      res.status(200).json({ 
        data: {
          trends: trendsWithRecommendations,
          searchId: savedSearch?.id
        }
      });
    } catch (error) {
      console.error('Erreur lors de la détection des tendances:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else if (req.method === 'GET') {
    try {
      const { userId, industries, searchId } = req.query;

      if (searchId) {
        // Récupérer une recherche spécifique
        const { data: search, error: searchError } = await supabase
          .from('trend_searches')
          .select('*')
          .eq('id', searchId)
          .eq('user_id', userId)
          .single();

        if (searchError) {
          console.error('Erreur lors de la récupération de la recherche:', searchError);
          return res.status(404).json({ error: 'Recherche non trouvée' });
        }

        // Récupérer les tendances associées à cette recherche
        const { data: trends, error: trendsError } = await supabase
          .from('trending_topics')
          .select('*')
          .in('industry', search.industries)
          .gte('trend_score', 70)
          .order('trend_score', { ascending: false })
          .limit(10);

        if (trendsError) {
          console.error('Erreur lors de la récupération des tendances:', trendsError);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        return res.status(200).json({ 
          data: {
            search,
            trends
          }
        });
      } else if (userId) {
        // Récupérer les dernières tendances pour l'utilisateur
        let query = supabase
          .from('trend_searches')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (industries) {
          const industriesArray = Array.isArray(industries) 
            ? industries 
            : [industries];
          
          // Filtrer par industries
          query = query.overlaps('industries', industriesArray);
        }

        const { data: searches, error: searchesError } = await query.limit(5);

        if (searchesError) {
          console.error('Erreur lors de la récupération des recherches:', searchesError);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        // Récupérer les tendances actuelles
        const { data: currentTrends, error: trendsError } = await supabase
          .from('trending_topics')
          .select('*')
          .gte('trend_score', 80)
          .order('trend_score', { ascending: false })
          .limit(5);

        if (trendsError) {
          console.error('Erreur lors de la récupération des tendances:', trendsError);
        }

        return res.status(200).json({ 
          data: {
            searches,
            currentTrends: currentTrends || []
          }
        });
      } else {
        return res.status(400).json({ error: 'Paramètres manquants' });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}

// Fonction pour filtrer et prioriser les tendances
function filterAndPrioritizeTrends(
  trends: any[],
  userContent: any[],
  keywords: string[],
  timeframe: string
): any[] {
  // Dans une application réelle, cette fonction ferait une analyse plus sophistiquée
  // pour filtrer et prioriser les tendances pertinentes pour l'utilisateur
  
  const filteredTrends = [...trends];
  
  // Filtrer par mots-clés si spécifiés
  if (keywords && keywords.length > 0) {
    const lowercaseKeywords = keywords.map(k => k.toLowerCase());
    
    for (let i = 0; i < filteredTrends.length; i++) {
      const trend = filteredTrends[i];
      
      // Calculer un score de pertinence pour les mots-clés
      let keywordRelevance = 0;
      const trendKeywords = [
        trend.topic.toLowerCase(),
        ...(trend.keywords || []).map((k: string) => k.toLowerCase())
      ];
      
      // Augmenter la pertinence si les mots-clés correspondent
      lowercaseKeywords.forEach(keyword => {
        trendKeywords.forEach(trendKeyword => {
          if (trendKeyword.includes(keyword)) {
            keywordRelevance += 10;
          }
        });
      });
      
      // Ajouter le score de pertinence des mots-clés
      filteredTrends[i].relevance_score = (filteredTrends[i].relevance_score || 0) + keywordRelevance;
    }
  }
  
  // Ajuster les tendances en fonction du contenu passé de l'utilisateur
  if (userContent && userContent.length > 0) {
    for (let i = 0; i < filteredTrends.length; i++) {
      const trend = filteredTrends[i];
      let contentRelevance = 0;
      
      // Vérifier si l'utilisateur a déjà créé du contenu similaire
      userContent.forEach((content: any) => {
        const contentKeywords = content.keywords || [];
        const trendKeywords = trend.keywords || [];
        
        // Compter les correspondances de mots-clés
        const matches = trendKeywords.filter((k: string) => 
          contentKeywords.includes(k.toLowerCase())
        ).length;
        
        // Augmenter la pertinence en fonction des correspondances
        if (matches > 0) {
          contentRelevance += matches * 5;
        }
      });
      
      // Ajouter le score de pertinence du contenu
      filteredTrends[i].relevance_score = (filteredTrends[i].relevance_score || 0) + contentRelevance;
    }
  }
  
  // Ajuster par période
  const now = new Date();
  for (let i = 0; i < filteredTrends.length; i++) {
    const trend = filteredTrends[i];
    const trendDate = new Date(trend.detected_at);
    const daysDiff = Math.floor((now.getTime() - trendDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let timeframeScore = 0;
    if (timeframe === 'day' && daysDiff <= 1) {
      timeframeScore = 20;
    } else if (timeframe === 'week' && daysDiff <= 7) {
      timeframeScore = 15;
    } else if (timeframe === 'month' && daysDiff <= 30) {
      timeframeScore = 10;
    }
    
    // Ajouter le score de période
    filteredTrends[i].relevance_score = (filteredTrends[i].relevance_score || 0) + timeframeScore;
  }
  
  // Trier par score combiné (tendance + pertinence)
  return filteredTrends.sort((a, b) => {
    const aTotal = (a.trend_score || 0) + (a.relevance_score || 0);
    const bTotal = (b.trend_score || 0) + (b.relevance_score || 0);
    return bTotal - aTotal;
  });
}

// Fonction pour générer des idées de contenu basées sur les tendances
function generateContentIdeas(trend: any, industries: string[]): any[] {
  // Dans une application réelle, cette fonction utiliserait du NLP ou une API d'IA
  // pour générer des idées de contenu adaptées à la tendance et au secteur
  
  const contentTypes = [
    'image', 'video', 'carousel', 'article', 'story', 'live', 'thread'
  ];
  
  const angles = [
    'informatif', 'éducatif', 'divertissant', 'débat', 'témoignage', 'analyse'
  ];
  
  const ideas = [];
  
  // Générer 3-5 idées différentes
  const numIdeas = Math.floor(Math.random() * 3) + 3;
  
  for (let i = 0; i < numIdeas; i++) {
    // Sélectionner aléatoirement un type de contenu et un angle
    const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    
    // Générer un titre en fonction de la tendance et de l'industrie
    let title = '';
    
    // Simuler la génération de titres basés sur le sujet de la tendance
    switch (angle) {
      case 'informatif':
        title = `Les 5 choses à savoir sur "${trend.topic}"`;
        break;
      case 'éducatif':
        title = `Comment "${trend.topic}" va transformer votre secteur`;
        break;
      case 'divertissant':
        title = `Expérience avec "${trend.topic}" : ce que nous avons découvert`;
        break;
      case 'débat':
        title = `"${trend.topic}" : opportunité ou menace pour votre entreprise ?`;
        break;
      case 'témoignage':
        title = `Notre expérience avec "${trend.topic}" : résultats et leçons`;
        break;
      case 'analyse':
        title = `Analyse approfondie : l'impact de "${trend.topic}" sur ${industries[0]}`;
        break;
      default:
        title = `Tout savoir sur "${trend.topic}"`;
    }
    
    // Générer une estimation de l'engagement potentiel
    const engagementPotential = Math.floor(Math.random() * 50) + 50;
    
    ideas.push({
      title,
      contentType,
      angle,
      engagementPotential,
      createdAt: new Date().toISOString()
    });
  }
  
  // Trier par potentiel d'engagement
  return ideas.sort((a, b) => b.engagementPotential - a.engagementPotential);
} 