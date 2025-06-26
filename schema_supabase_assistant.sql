-- Partie 3: Tables pour l'assistant IA
-- Ce script crée les tables pour l'assistant IA et les fonctionnalités associées
-- À exécuter après schema_supabase_complet.sql et schema_supabase_analytics.sql

-- Table pour stocker l'historique des prompts et des réponses de l'assistant IA
CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  tone TEXT,
  content_type TEXT,
  keywords TEXT,
  usage_stats JSONB DEFAULT '{}'::jsonb,
  rating SMALLINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les modèles de prompts prédéfinis
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  category TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les paramètres d'IA personnalisés des utilisateurs
CREATE TABLE IF NOT EXISTS ai_user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_tone TEXT DEFAULT 'professional',
  default_platforms TEXT[] DEFAULT '{"instagram","linkedin"}',
  default_content_type TEXT DEFAULT 'post',
  preferred_keywords TEXT[] DEFAULT '{}',
  style_preferences JSONB DEFAULT '{}'::jsonb,
  ai_model_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les interactions avec le modèle de Blender 3D (si applicable)
CREATE TABLE IF NOT EXISTS blender_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  model_url TEXT,
  parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS et créer des déclencheurs pour les timestamps
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blender_models ENABLE ROW LEVEL SECURITY;

-- Créer des déclencheurs pour updated_at
CREATE TRIGGER set_timestamp_ai_prompts
BEFORE UPDATE ON ai_prompts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_ai_prompt_templates
BEFORE UPDATE ON ai_prompt_templates
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_ai_user_settings
BEFORE UPDATE ON ai_user_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_blender_models
BEFORE UPDATE ON blender_models
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Policies pour l'accès aux données
-- AI prompts
CREATE POLICY "Users can view their own prompts"
  ON ai_prompts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts"
  ON ai_prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON ai_prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- AI prompt templates
CREATE POLICY "Everyone can view public templates"
  ON ai_prompt_templates
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON ai_prompt_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON ai_prompt_templates
  FOR UPDATE
  USING (auth.uid() = user_id);

-- AI user settings
CREATE POLICY "Users can view their own AI settings"
  ON ai_user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI settings"
  ON ai_user_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Blender models
CREATE POLICY "Users can view their own blender models"
  ON blender_models
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own blender models"
  ON blender_models
  FOR ALL
  USING (auth.uid() = user_id);

-- Insérer des modèles prédéfinis
INSERT INTO ai_prompt_templates (name, description, template, category) VALUES
  ('Annonce de produit', 'Modèle pour annoncer un nouveau produit', 'Crée une publication pour annoncer le lancement de [PRODUIT] qui résout [PROBLÈME]. Notre cible est [AUDIENCE] et les points forts à mentionner sont [AVANTAGES].', 'Marketing'),
  ('Promotion événement', 'Modèle pour promouvoir un événement', 'Génère une publication pour inviter les gens à notre événement [NOM] qui aura lieu le [DATE] à [LIEU]. L''événement concerne [THÈME] et les avantages d''y participer sont [AVANTAGES].', 'Événement'),
  ('Question engagement', 'Modèle pour poser une question qui suscite l''engagement', 'Crée une publication posant une question à notre audience à propos de [SUJET] pour générer de l''engagement et des commentaires.', 'Engagement'),
  ('Témoignage client', 'Modèle pour mettre en avant un témoignage client', 'Rédige une publication mettant en valeur ce témoignage client : "[TÉMOIGNAGE]" de [NOM CLIENT] qui a utilisé notre [PRODUIT/SERVICE].', 'Social proof'),
  ('Contenu éducatif', 'Modèle pour du contenu informatif', 'Crée un post éducatif expliquant [CONCEPT] à notre audience de [NIVEAU D''EXPERTISE]. Inclure [NOMBRE] conseils ou astuces.', 'Éducation'),
  ('Calendrier de contenu', 'Modèle pour générer un calendrier de contenu mensuel', 'Génère un calendrier de contenu pour le mois de [MOIS] avec [NOMBRE] publications hebdomadaires réparties sur [PLATEFORMES]. Notre thématique principale est [THÈME].', 'Planification'),
  ('Réponse commentaire', 'Modèle pour répondre à un commentaire', 'Rédige une réponse au commentaire suivant: "[COMMENTAIRE]" en gardant un ton [TON] et en encourageant l''interaction.', 'Engagement'),
  ('Stories Instagram', 'Modèle pour créer une séquence de stories', 'Crée une séquence de [NOMBRE] stories Instagram pour présenter [SUJET] avec un call-to-action pour [OBJECTIF].', 'Stories'),
  ('Thread Twitter', 'Modèle pour créer un thread Twitter', 'Génère un thread Twitter de [NOMBRE] tweets sur le sujet [SUJET]. Le premier tweet doit capter l''attention et le dernier doit inclure un CTA.', 'Twitter'),
  ('Post LinkedIn professionnel', 'Modèle pour LinkedIn B2B', 'Rédige un post LinkedIn professionnel sur [SUJET] qui démontre notre expertise dans [DOMAINE] et génère des opportunités business.', 'LinkedIn');

-- Fonction pour générer des données d'exemples d'interactions avec l'assistant
CREATE OR REPLACE FUNCTION generate_ai_assistant_sample_data(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  platform_array TEXT[] := ARRAY['instagram', 'facebook', 'twitter', 'linkedin'];
  tone_array TEXT[] := ARRAY['professional', 'casual', 'enthusiastic', 'formal'];
  content_type_array TEXT[] := ARRAY['post', 'story', 'thread', 'article'];
  prompt_count INTEGER := 0;
BEGIN
  -- Créer des paramètres AI par défaut pour l'utilisateur
  INSERT INTO ai_user_settings (
    user_id,
    default_tone,
    default_platforms,
    default_content_type,
    preferred_keywords,
    style_preferences
  ) VALUES (
    user_uuid,
    'professional',
    ARRAY['instagram', 'linkedin'],
    'post',
    ARRAY['innovation', 'technologie', 'digital'],
    jsonb_build_object(
      'emoji_use', 'moderate',
      'hashtag_style', 'integrated',
      'sentence_length', 'medium',
      'formality', 'semi-formal'
    )
  );
  
  -- Créer des exemples d'interactions avec l'assistant
  -- Exemple 1: Post Instagram
  INSERT INTO ai_prompts (
    user_id,
    prompt,
    response,
    platforms,
    tone,
    content_type,
    keywords,
    usage_stats,
    rating
  ) VALUES (
    user_uuid,
    'Crée un post Instagram sur notre nouvelle application mobile de productivité',
    '✨ Dévoilement du jour : notre nouvelle app de productivité est enfin disponible ! 📱

Dites adieu aux journées chaotiques et bonjour à l''organisation parfaite. Notre application intuitive vous aide à :
• Planifier vos tâches en quelques secondes
• Suivre votre temps avec précision
• Collaborer sans effort avec votre équipe

Téléchargez dès maintenant via le lien dans notre bio et transformez votre quotidien ! 💯

#ProductivitéMaximale #AppLancement #GestionDuTemps #OrganisationParfaite',
    ARRAY['instagram'],
    'enthusiastic',
    'post',
    'app, productivité, lancement, organisation',
    jsonb_build_object(
      'generated_at', NOW()::text,
      'tokens_used', 230,
      'edited', false,
      'shared', true
    ),
    5
  );
  
  -- Exemple 2: Post LinkedIn
  INSERT INTO ai_prompts (
    user_id,
    prompt,
    response,
    platforms,
    tone,
    content_type,
    keywords,
    usage_stats,
    rating
  ) VALUES (
    user_uuid,
    'Rédige un post LinkedIn sur l''importance de l''intelligence artificielle dans le marketing moderne',
    'L''intelligence artificielle redéfinit les fondamentaux du marketing digital.

Après analyse de centaines de campagnes, nous constatons que les stratégies intégrant l''IA génèrent en moyenne 37% de conversion supplémentaire par rapport aux approches traditionnelles.

Comment l''IA transforme-t-elle concrètement le marketing ?

1️⃣ Hyperpersonnalisation : adaptation dynamique des messages selon le comportement utilisateur
2️⃣ Optimisation prédictive : anticipation des tendances et ajustement proactif des campagnes
3️⃣ Analyse conversationnelle : compréhension approfondie du sentiment client à grande échelle

Ce n''est plus un avantage compétitif mais une nécessité stratégique pour toute entreprise souhaitant rester pertinente.

Votre organisation a-t-elle intégré l''IA dans sa stratégie marketing ? Partagez votre expérience !

#IntelligenceArtificielle #MarketingDigital #Innovation #TransformationDigitale',
    ARRAY['linkedin'],
    'professional',
    'post',
    'intelligence artificielle, marketing, innovation, stratégie',
    jsonb_build_object(
      'generated_at', NOW()::text,
      'tokens_used', 315,
      'edited', true,
      'shared', true
    ),
    4
  );
  
  -- Exemple 3: Thread Twitter
  INSERT INTO ai_prompts (
    user_id,
    prompt,
    response,
    platforms,
    tone,
    content_type,
    keywords,
    usage_stats,
    rating
  ) VALUES (
    user_uuid,
    'Génère un thread Twitter de 3 tweets sur comment optimiser sa présence sur les réseaux sociaux',
    '1/3 Votre stratégie réseaux sociaux manque de résultats ? Voici 3 erreurs que 90% des marques commettent et comment les éviter. Un thread pour transformer votre approche digitale 👇 #SocialMediaStrategy

2/3 Erreur n°1 : Publier partout sans stratégie différenciée.
Solution : Identifiez vos 2 plateformes prioritaires et adaptez votre contenu à leur format spécifique. Instagram n''est pas LinkedIn - votre stratégie ne devrait pas être identique.

3/3 Erreur n°2 : Ignorer les données d''engagement.
Solution : Consacrez 20min/semaine à analyser vos métriques. Les posts qui performent vous révèlent exactement ce que veut votre audience. Écoutez ces signaux !',
    ARRAY['twitter'],
    'casual',
    'thread',
    'réseaux sociaux, stratégie, optimisation, engagement',
    jsonb_build_object(
      'generated_at', NOW()::text,
      'tokens_used', 280,
      'edited', false,
      'shared', false
    ),
    4
  );
  
  -- Créer quelques exemples supplémentaires avec des variations
  FOR i IN 1..5 LOOP
    INSERT INTO ai_prompts (
      user_id,
      prompt,
      response,
      platforms,
      tone,
      content_type,
      keywords,
      usage_stats,
      rating
    ) VALUES (
      user_uuid,
      'Génère du contenu pour ' || platform_array[(floor(random() * 4) + 1)::int] || ' avec un ton ' || tone_array[(floor(random() * 4) + 1)::int] || ' sur le sujet de la transformation digitale',
      'Voici un exemple de contenu généré pour l''utilisateur ' || user_uuid || '. Ce texte simule une réponse de l''assistant IA avec des variations de style et de format selon la plateforme et le ton demandés. Le contenu parle de transformation digitale et inclut les éléments typiques comme des hashtags, des emojis et une structure adaptée à la plateforme cible.',
      ARRAY[platform_array[(floor(random() * 4) + 1)::int]],
      tone_array[(floor(random() * 4) + 1)::int],
      content_type_array[(floor(random() * 4) + 1)::int],
      'transformation digitale, innovation, technologie',
      jsonb_build_object(
        'generated_at', NOW()::text,
        'tokens_used', (floor(random() * 300) + 100)::int,
        'edited', random() > 0.5,
        'shared', random() > 0.7
      ),
      (floor(random() * 5) + 1)::int
    );
    
    prompt_count := prompt_count + 1;
  END LOOP;
  
  RETURN 'Données d''exemple pour l''assistant IA générées avec succès: ' || prompt_count + 3 || ' interactions.';
END;
$$ LANGUAGE plpgsql; 