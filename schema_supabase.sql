-- Voici le SQL pour créer une table 'posts' dans votre base de données Supabase
-- Copiez ce code dans l'éditeur SQL de Supabase (SQL Editor)
-- Pour exécuter ce script:
-- 1. Connectez-vous à votre projet Supabase (https://app.supabase.com)
-- 2. Allez dans "SQL Editor" dans le menu de gauche
-- 3. Créez une nouvelle requête
-- 4. Copiez-collez ce code
-- 5. Cliquez sur "Run" ou "Execute"

-- Créer la table des publications
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une politique RLS (Row Level Security) pour permettre l'accès
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Permettre à tous les utilisateurs authentifiés d'accéder à leurs propres données
CREATE POLICY "Users can CRUD their own posts"
  ON posts
  FOR ALL
  USING (auth.uid()::text = user_id);

-- Si vous voulez permettre l'accès public pour développement/test
-- Note: En production, vous devriez supprimer ou commenter cette politique
CREATE POLICY "Public access policy" 
  ON posts 
  FOR ALL 
  USING (true);

-- Créer un déclencheur pour mettre à jour automatiquement 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp(); 