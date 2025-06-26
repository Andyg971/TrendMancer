-- Script SQL sécurisé pour Supabase - peut être exécuté plusieurs fois sans erreur
-- Utilisez ce script si vous avez déjà créé certaines parties précédemment

-- Créer la table des publications si elle n'existe pas déjà
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

-- Activer RLS si ce n'est pas déjà fait
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent pour éviter les erreurs
DROP POLICY IF EXISTS "Users can CRUD their own posts" ON posts;
DROP POLICY IF EXISTS "Public access policy" ON posts;

-- Recréer les politiques
CREATE POLICY "Users can CRUD their own posts"
  ON posts
  FOR ALL
  USING (auth.uid()::text = user_id);

-- Politique d'accès public pour le développement
CREATE POLICY "Public access policy" 
  ON posts 
  FOR ALL 
  USING (true);

-- Créer la fonction de déclencheur pour mettre à jour 'updated_at' si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'trigger_set_timestamp') THEN
    CREATE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  END IF;
END
$$;

-- Supprimer le déclencheur s'il existe
DROP TRIGGER IF EXISTS set_timestamp ON posts;

-- Créer le déclencheur
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Insérer quelques données de test si la table est vide
INSERT INTO posts (title, content, platform, platforms, status, user_id)
SELECT 
  'Publication de test ' || generate_series(1, 3), 
  'Ceci est un contenu de test pour la publication ' || generate_series(1, 3),
  CASE (generate_series(1, 3) % 4)
    WHEN 0 THEN 'instagram'
    WHEN 1 THEN 'linkedin'
    WHEN 2 THEN 'facebook'
    WHEN 3 THEN 'twitter'
  END,
  ARRAY[
    CASE (generate_series(1, 3) % 4)
      WHEN 0 THEN 'instagram'
      WHEN 1 THEN 'linkedin'
      WHEN 2 THEN 'facebook'
      WHEN 3 THEN 'twitter'
    END
  ],
  CASE (generate_series(1, 3) % 3)
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'scheduled'
    WHEN 2 THEN 'published'
  END,
  'user1'
WHERE NOT EXISTS (SELECT 1 FROM posts); 