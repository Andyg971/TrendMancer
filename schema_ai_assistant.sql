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
  
  -- Index pour accélérer les recherches par utilisateur
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne peuvent voir que leurs propres prompts
CREATE POLICY "Users can view their own prompts"
  ON ai_prompts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : les utilisateurs ne peuvent insérer que leurs propres prompts
CREATE POLICY "Users can insert their own prompts"
  ON ai_prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : les utilisateurs ne peuvent mettre à jour que leurs propres prompts
CREATE POLICY "Users can update their own prompts"
  ON ai_prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Table pour stocker les modèles de prompts prédéfinis
CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  category TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour les modèles de prompts
ALTER TABLE ai_prompt_templates ENABLE ROW LEVEL SECURITY;

-- Politique : tout le monde peut voir les modèles publics
CREATE POLICY "Everyone can view public templates"
  ON ai_prompt_templates
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Politique : les utilisateurs peuvent insérer leurs propres modèles
CREATE POLICY "Users can insert their own templates"
  ON ai_prompt_templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insérer quelques modèles prédéfinis
INSERT INTO ai_prompt_templates (name, description, template, category) VALUES
  ('Annonce de produit', 'Modèle pour annoncer un nouveau produit', 'Crée une publication pour annoncer le lancement de [PRODUIT] qui résout [PROBLÈME]. Notre cible est [AUDIENCE] et les points forts à mentionner sont [AVANTAGES].', 'Marketing'),
  ('Promotion événement', 'Modèle pour promouvoir un événement', 'Génère une publication pour inviter les gens à notre événement [NOM] qui aura lieu le [DATE] à [LIEU]. L''événement concerne [THÈME] et les avantages d''y participer sont [AVANTAGES].', 'Événement'),
  ('Question engagement', 'Modèle pour poser une question qui suscite l''engagement', 'Crée une publication posant une question à notre audience à propos de [SUJET] pour générer de l''engagement et des commentaires.', 'Engagement'),
  ('Témoignage client', 'Modèle pour mettre en avant un témoignage client', 'Rédige une publication mettant en valeur ce témoignage client : "[TÉMOIGNAGE]" de [NOM CLIENT] qui a utilisé notre [PRODUIT/SERVICE].', 'Social proof'),
  ('Contenu éducatif', 'Modèle pour du contenu informatif', 'Crée un post éducatif expliquant [CONCEPT] à notre audience de [NIVEAU D''EXPERTISE]. Inclure [NOMBRE] conseils ou astuces.', 'Éducation'); 