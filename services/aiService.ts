import { supabase } from '../utils/supabase';

export interface AIPrompt {
  id?: string;
  user_id: string;
  prompt: string;
  response: string;
  platforms?: string[];
  tone?: string;
  content_type?: string;
  keywords?: string;
  usage_stats?: Record<string, any>;
  rating?: number;
  created_at?: string;
}

export interface AIPromptTemplate {
  id?: string;
  name: string;
  description?: string;
  template: string;
  category: string;
  is_public?: boolean;
  user_id?: string;
  created_at?: string;
}

// Récupérer l'historique des prompts pour un utilisateur
export async function getUserPromptHistory(userId: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des prompts:', error);
    return { data: null, error };
  }
}

// Sauvegarder un nouveau prompt et sa réponse
export async function savePrompt(promptData: AIPrompt) {
  try {
    const { data, error } = await supabase
      .from('ai_prompts')
      .insert([promptData])
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du prompt:', error);
    return { data: null, error };
  }
}

// Évaluer un prompt (donner une note)
export async function ratePrompt(promptId: string, rating: number) {
  try {
    const { data, error } = await supabase
      .from('ai_prompts')
      .update({ rating })
      .eq('id', promptId)
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error(`Erreur lors de l'évaluation du prompt ${promptId}:`, error);
    return { data: null, error };
  }
}

// Récupérer tous les modèles de prompts (templates)
export async function getPromptTemplates(category?: string) {
  try {
    let query = supabase
      .from('ai_prompt_templates')
      .select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles de prompts:', error);
    return { data: null, error };
  }
}

// Ajouter un nouveau modèle de prompt
export async function addPromptTemplate(template: AIPromptTemplate) {
  try {
    const { data, error } = await supabase
      .from('ai_prompt_templates')
      .insert([template])
      .select();
    
    if (error) throw error;
    
    return { data: data?.[0] || null, error: null };
  } catch (error) {
    console.error('Erreur lors de l\'ajout du modèle de prompt:', error);
    return { data: null, error };
  }
}

// Fonction pour générer du contenu avec l'assistant IA (simulation)
export function generateAIContent(
  prompt: string, 
  platforms: string[] = ['instagram'], 
  tone: string = 'professional',
  contentType: string = 'post',
  keywords: string = ''
) {
  // Simuler la génération de contenu selon les paramètres
  // Dans une vraie implémentation, cela appellerait une API comme OpenAI
  
  const contents: Record<string, string> = {};
  
  if (platforms.includes('instagram')) {
    contents['Instagram'] = tone === 'professional' 
      ? `✨ Innovation et excellence au service de votre quotidien ✨\n\nDécouvrez notre approche unique qui allie design contemporain et fonctionnalité. Chaque produit est conçu avec soin pour répondre à vos besoins spécifiques.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Innovation #Excellence #Design'}`
      : tone === 'casual'
      ? `Hey ! 👋 On a quelque chose de cool à vous montrer ! 😍\n\nOn a travaillé dur ces derniers mois et on est super excités de partager ça avec vous. Swipez pour découvrir notre dernière création !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Nouveau #Cool #Découverte'}`
      : `🔥 INCROYABLE NOUVEAUTÉ ! 🔥\n\nVous n'avez JAMAIS rien vu de tel ! Notre toute dernière innovation va RÉVOLUTIONNER votre façon de voir les choses ! À découvrir ABSOLUMENT ! 😱\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Incroyable #Révolution #MustHave'}`;
  }
  
  if (platforms.includes('linkedin')) {
    contents['LinkedIn'] = tone === 'professional' 
      ? `Nous sommes fiers d'annoncer le lancement de notre dernière innovation, fruit d'un travail collaboratif intensif et d'une recherche approfondie.\n\nCette avancée représente parfaitement notre engagement continu envers l'excellence et la satisfaction client qui ont toujours été au cœur de notre philosophie d'entreprise.\n\nN'hésitez pas à me contacter pour plus d'informations sur cette initiative passionnante.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Innovation #Excellence #Leadership'}`
      : tone === 'casual'
      ? `Heureux de partager avec mon réseau notre dernière réalisation !\n\nAprès plusieurs mois de travail en équipe, nous avons enfin lancé ce projet qui nous tient à cœur. Un grand merci à tous ceux qui ont contribué à ce succès.\n\nQu'en pensez-vous ? Vos retours sont les bienvenus !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Collaboration #Projet #Partage'}`
      : `🚀 ANNONCE MAJEURE ! 🚀\n\nJe suis EXTRÊMEMENT FIER de vous présenter notre RÉVOLUTION dans le secteur ! Une innovation qui va TRANSFORMER votre façon de travailler !\n\nDemandez-moi comment en profiter dès MAINTENANT !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Disruption #Innovation #GameChanger'}`;
  }
  
  if (platforms.includes('facebook')) {
    contents['Facebook'] = tone === 'professional' 
      ? `Nous avons le plaisir de vous présenter notre dernière nouveauté, conçue pour répondre aux besoins exigeants de nos clients.\n\nAprès des mois de développement et de tests rigoureux, ce produit incarne notre engagement envers la qualité et l'innovation.\n\nDécouvrez-en plus sur notre site web ou contactez-nous directement pour une démonstration personnalisée.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Qualité #Innovation #Service'}`
      : tone === 'casual'
      ? `Hey tout le monde ! On est super contents de vous montrer ce sur quoi on travaille depuis des mois ! 🤩\n\nOn a mis tout notre cœur dans ce projet et on espère vraiment qu'il vous plaira autant qu'à nous.\n\nN'hésitez pas à partager votre avis dans les commentaires !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Nouveau #Excited #Feedback'}`
      : `🔥 ATTENTION ANNONCE IMPORTANTE ! 🔥\n\nNous venons de LANCER notre produit le plus INCROYABLE à ce jour ! Vous ne voudrez pas manquer ça !\n\nCLIQUEZ sur le lien dans notre bio pour être parmi les PREMIERS à en profiter ! Places limitées !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#NePasManquer #Exclusif #Limité'}`;
  }
  
  if (platforms.includes('twitter')) {
    contents['Twitter'] = tone === 'professional' 
      ? `Nous sommes ravis de vous présenter notre dernière innovation, conçue pour optimiser votre productivité quotidienne. Découvrez comment sur notre site.\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Innovation #Productivité'}`
      : tone === 'casual'
      ? `Devinez ce qu'on vient de lancer ? 👀 Notre nouveau produit est enfin dispo ! On a hâte de savoir ce que vous en pensez !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#Nouveau #Feedback'}`
      : `BOUM ! 💥 Notre produit révolutionnaire vient de sortir et il va TOUT CHANGER ! Lien en bio ! RT appréciés !\n\n${keywords ? `#${keywords.split(',').map(k => k.trim()).join(' #')}` : '#GameChanger #MustHave'}`;
  }
  
  return {
    response: "Voici le contenu généré selon vos critères. N'hésitez pas à me demander des ajustements si nécessaire !",
    contents: Object.entries(contents).map(([platform, content]) => ({
      id: `${platform.toLowerCase()}-${Date.now()}`,
      platform,
      content
    }))
  };
} 