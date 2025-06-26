import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface FormatRequest {
  content: string;
  platforms: string[];
  tone?: string;
  hashtags?: number;
  emoji?: boolean;
  userId: string;
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
      const { content, platforms, tone = 'professionnel', hashtags = 3, emoji = true, userId } = req.body as FormatRequest;

      if (!content || !platforms || platforms.length === 0) {
        return res.status(400).json({ error: 'Données manquantes' });
      }

      // Générer le contenu multiformat pour chaque plateforme
      const formattedContent = await Promise.all(platforms.map(async (platform) => {
        // Dans une application réelle, cette partie utiliserait un appel à une API d'IA comme OpenAI
        let adaptedContent = '';
        let maxLength = 2200;
        let hashtagsText = '';

        // Générer quelques hashtags pertinents (simulé)
        if (hashtags > 0) {
          const relevantHashtags = getRelevantHashtags(content, hashtags, platform);
          hashtagsText = relevantHashtags.join(' ');
        }

        // Adapter le contenu en fonction de la plateforme
        switch (platform.toLowerCase()) {
          case 'instagram':
            maxLength = 2200;
            adaptedContent = adaptForInstagram(content, tone, emoji);
            break;
          case 'twitter':
            maxLength = 280;
            adaptedContent = adaptForTwitter(content, tone, emoji);
            break;
          case 'linkedin':
            maxLength = 3000;
            adaptedContent = adaptForLinkedin(content, tone, emoji);
            break;
          case 'facebook':
            maxLength = 5000;
            adaptedContent = adaptForFacebook(content, tone, emoji);
            break;
          default:
            adaptedContent = content;
        }

        // Tronquer le contenu si nécessaire
        if (adaptedContent.length > maxLength) {
          adaptedContent = adaptedContent.substring(0, maxLength - 3) + '...';
        }

        // Ajouter les hashtags si demandé
        if (hashtags > 0 && platform.toLowerCase() !== 'linkedin') {
          adaptedContent = `${adaptedContent}\n\n${hashtagsText}`;
        } else if (hashtags > 0 && platform.toLowerCase() === 'linkedin') {
          adaptedContent = `${adaptedContent}\n\n#${hashtagsText.replace(/\s+#/g, ' #')}`;
        }

        // Enregistrer dans la base de données
        const { data: savedContent, error: dbError } = await supabase
          .from('multi_format_content')
          .insert({
            user_id: userId,
            original_content: content,
            platform: platform,
            formatted_content: adaptedContent,
            tone: tone,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (dbError) {
          console.error('Erreur d'enregistrement dans la base de données:', dbError);
        }

        return {
          platform,
          content: adaptedContent,
          hashtags: hashtagsText
        };
      }));

      res.status(200).json({ data: formattedContent });
    } catch (error) {
      console.error('Erreur lors de la génération du contenu multiformat:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }
}

// Fonctions d'adaptation simulées (dans une application réelle, utiliserait une API d'IA)
function adaptForInstagram(content: string, tone: string, useEmoji: boolean): string {
  let adapted = content;
  
  // Simuler une adaptation pour Instagram
  if (tone === 'informel') {
    adapted = `${adapted} 📸`;
  } else if (tone === 'professionnel') {
    adapted = `${adapted}`;
  } else if (tone === 'engageant') {
    adapted = `${adapted}\n\nQu'en pensez-vous? Partagez dans les commentaires! 👇`;
  }
  
  if (useEmoji && !adapted.includes('📸')) {
    adapted = `${adapted} 📸`;
  }
  
  return adapted;
}

function adaptForTwitter(content: string, tone: string, useEmoji: boolean): string {
  // Limiter à 280 caractères
  let adapted = content.length > 260 ? content.substring(0, 260) + '...' : content;
  
  if (useEmoji) {
    adapted = `${adapted} 🐦`;
  }
  
  return adapted;
}

function adaptForLinkedin(content: string, tone: string, useEmoji: boolean): string {
  let adapted = content;
  
  // Simuler une adaptation pour LinkedIn
  if (tone === 'professionnel') {
    adapted = `${adapted}\n\nQu'en pensez-vous?`;
  } else if (tone === 'engageant') {
    adapted = `${adapted}\n\nPartagez votre expérience sur ce sujet!`;
  }
  
  if (useEmoji && tone === 'informel') {
    adapted = `${adapted} 💼`;
  }
  
  return adapted;
}

function adaptForFacebook(content: string, tone: string, useEmoji: boolean): string {
  let adapted = content;
  
  // Simuler une adaptation pour Facebook
  if (tone === 'engageant') {
    adapted = `${adapted}\n\nN'hésitez pas à partager et commenter!`;
  }
  
  if (useEmoji) {
    adapted = `${adapted} 👍`;
  }
  
  return adapted;
}

function getRelevantHashtags(content: string, count: number, platform: string): string[] {
  // Simuler la génération de hashtags basée sur le contenu
  const commonHashtags = ['marketing', 'socialmedia', 'digital', 'growth', 'trending', 'innovation'];
  const uniqueHashtags = [];
  
  // Extraire quelques mots clés du contenu
  const keywords = content
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .filter(word => word.length > 4)
    .slice(0, 3);
  
  // Ajouter les mots clés comme hashtags
  for (const keyword of keywords) {
    if (uniqueHashtags.length < count && !commonHashtags.includes(keyword)) {
      uniqueHashtags.push(`#${keyword}`);
    }
  }
  
  // Compléter avec des hashtags communs
  const remainingCount = count - uniqueHashtags.length;
  if (remainingCount > 0) {
    const shuffled = [...commonHashtags].sort(() => 0.5 - Math.random());
    uniqueHashtags.push(...shuffled.slice(0, remainingCount).map(tag => `#${tag}`));
  }
  
  return uniqueHashtags;
} 