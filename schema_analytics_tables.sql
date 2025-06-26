-- Création des tables nécessaires pour la fonctionnalité d'analytics
-- Ce script doit être exécuté dans l'interface SQL de Supabase

-- Table pour stocker les posts sociaux avec leurs statistiques
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Statistiques d'engagement
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  
  -- Métadonnées
  media_urls TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  post_type TEXT,
  campaign_id UUID,
  
  -- Contrainte pour assurer que les posts publiés ont une date de publication
  CONSTRAINT published_posts_have_date CHECK (
    status != 'published' OR published_at IS NOT NULL
  )
);

-- Table pour stocker l'historique des statistiques d'engagement
-- Permet de suivre l'évolution dans le temps
CREATE TABLE IF NOT EXISTS engagement_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0
);

-- Table pour stocker les analyses agrégées par période
CREATE TABLE IF NOT EXISTS analytics_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  platform TEXT,
  total_posts INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  total_impressions INTEGER DEFAULT 0,
  total_reach INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2),
  growth_rate NUMERIC(5,2),
  best_performing_post_id UUID REFERENCES social_posts(id),
  best_posting_times JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les recommandations IA
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_text TEXT NOT NULL,
  category TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les données d'audience
CREATE TABLE IF NOT EXISTS audience_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  followers_count INTEGER DEFAULT 0,
  followers_growth INTEGER DEFAULT 0,
  demographics JSONB,
  location_data JSONB,
  active_times JSONB
);

-- Table pour stocker les logs d'analyse
CREATE TABLE IF NOT EXISTS analytics_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  parameters JSONB,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajout des politiques RLS (Row Level Security)
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour que les utilisateurs ne voient que leurs propres données
CREATE POLICY "Users can view their own posts" 
  ON social_posts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own engagement history" 
  ON engagement_history FOR SELECT 
  USING (EXISTS (
    SELECT 1
    FROM social_posts
    WHERE social_posts.id = engagement_history.post_id
    AND social_posts.user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own analytics" 
  ON analytics_summaries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations" 
  ON ai_recommendations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own audience metrics" 
  ON audience_metrics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics logs" 
  ON analytics_logs FOR SELECT 
  USING (auth.uid() = user_id);

-- Fonction pour générer des données d'exemple
CREATE OR REPLACE FUNCTION generate_sample_data(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  post_id UUID;
  platform_array TEXT[] := ARRAY['instagram', 'facebook', 'twitter', 'linkedin'];
  platform TEXT;
  post_count INTEGER := 0;
BEGIN
  -- Générer 20 posts répartis sur différentes plateformes
  FOR i IN 1..20 LOOP
    -- Choisir une plateforme aléatoire
    platform := platform_array[floor(random() * 4 + 1)];
    
    -- Créer un post
    INSERT INTO social_posts (
      user_id, 
      title, 
      content, 
      platform, 
      status, 
      published_at, 
      likes, 
      comments, 
      shares, 
      impressions, 
      reach,
      post_type,
      tags
    ) VALUES (
      user_uuid,
      'Post ' || i,
      CASE 
        WHEN platform = 'instagram' THEN 'Contenu Instagram avec #hashtags et emojis 📸'
        WHEN platform = 'facebook' THEN 'Contenu plus long pour Facebook, adapté à un public plus large et diversifié.'
        WHEN platform = 'twitter' THEN 'Tweet court et concis avec #hashtags'
        ELSE 'Contenu professionnel pour LinkedIn parlant de #innovation et #business'
      END,
      platform,
      'published',
      NOW() - (INTERVAL '1 day' * floor(random() * 30)), -- Publié dans les 30 derniers jours
      floor(random() * 200), -- Likes (0-200)
      floor(random() * 50), -- Commentaires (0-50)
      floor(random() * 30), -- Partages (0-30)
      floor(random() * 1000 + 100), -- Impressions (100-1100)
      floor(random() * 800 + 50), -- Portée (50-850)
      CASE 
        WHEN random() < 0.3 THEN 'image'
        WHEN random() < 0.6 THEN 'video'
        ELSE 'text'
      END,
      CASE 
        WHEN random() < 0.5 THEN ARRAY['produit', 'nouveau', 'offre']
        ELSE ARRAY['entreprise', 'équipe', 'actualité']
      END
    ) RETURNING id INTO post_id;
    
    -- Créer des entrées d'historique d'engagement pour ce post
    FOR j IN 1..5 LOOP
      INSERT INTO engagement_history (
        post_id,
        date,
        likes,
        comments,
        shares,
        impressions,
        reach
      ) VALUES (
        post_id,
        NOW() - (INTERVAL '1 day' * (6-j)), -- Derniers 5 jours
        floor(random() * 40 * j), -- Likes progressifs
        floor(random() * 10 * j), -- Commentaires progressifs
        floor(random() * 6 * j),  -- Partages progressifs
        floor(random() * 200 * j + 50), -- Impressions progressives
        floor(random() * 160 * j + 30)  -- Portée progressive
      );
    END LOOP;
    
    post_count := post_count + 1;
  END LOOP;
  
  -- Générer des résumés d'analyse
  INSERT INTO analytics_summaries (
    user_id,
    period_start,
    period_end,
    platform,
    total_posts,
    total_likes,
    total_comments,
    total_shares,
    total_impressions,
    total_reach,
    engagement_rate,
    growth_rate,
    best_posting_times
  )
  SELECT 
    user_uuid,
    NOW() - INTERVAL '30 days',
    NOW(),
    platform,
    COUNT(*),
    SUM(likes),
    SUM(comments),
    SUM(shares),
    SUM(impressions),
    SUM(reach),
    (SUM(likes) + SUM(comments) + SUM(shares))::numeric / NULLIF(SUM(impressions), 0) * 100,
    random() * 10 + 1,
    jsonb_build_object(
      'monday', jsonb_build_object('hour', '10:00', 'engagement', random() * 5 + 1),
      'wednesday', jsonb_build_object('hour', '13:00', 'engagement', random() * 5 + 2),
      'friday', jsonb_build_object('hour', '18:00', 'engagement', random() * 5 + 3)
    )
  FROM social_posts
  WHERE user_id = user_uuid
  GROUP BY platform;
  
  -- Générer des recommandations IA
  INSERT INTO ai_recommendations (
    user_id,
    recommendation_text,
    category,
    priority
  ) VALUES 
  (user_uuid, 'Publiez plus souvent sur Instagram où votre taux d''engagement est 30% plus élevé', 'plateforme', 1),
  (user_uuid, 'Vos publications contenant des images génèrent 2x plus d''interactions', 'contenu', 2),
  (user_uuid, 'Le meilleur moment pour publier sur LinkedIn est le mercredi à 13h', 'timing', 2),
  (user_uuid, 'Augmentez la fréquence des publications sur Twitter pour améliorer votre visibilité', 'fréquence', 3),
  (user_uuid, 'Utilisez plus de hashtags dans vos publications Instagram pour élargir votre audience', 'hashtags', 3);
  
  -- Générer des métriques d'audience
  FOR platform IN SELECT unnest(platform_array) LOOP
    INSERT INTO audience_metrics (
      user_id,
      platform,
      date,
      followers_count,
      followers_growth,
      demographics,
      location_data,
      active_times
    ) VALUES (
      user_uuid,
      platform,
      NOW(),
      floor(random() * 5000 + 500), -- 500-5500 followers
      floor(random() * 100), -- Croissance
      jsonb_build_object(
        'age_groups', jsonb_build_object(
          '18-24', random() * 20 + 10,
          '25-34', random() * 30 + 20,
          '35-44', random() * 20 + 15,
          '45-54', random() * 15 + 5,
          '55+', random() * 10 + 2
        ),
        'gender', jsonb_build_object(
          'male', random() * 50 + 25,
          'female', random() * 50 + 25
        )
      ),
      jsonb_build_object(
        'countries', jsonb_build_object(
          'France', random() * 40 + 30,
          'Canada', random() * 20 + 10,
          'Belgique', random() * 15 + 5,
          'Suisse', random() * 10 + 5,
          'Autres', random() * 15 + 10
        )
      ),
      jsonb_build_object(
        'morning', random() * 30 + 20,
        'afternoon', random() * 40 + 30,
        'evening', random() * 30 + 20,
        'night', random() * 10 + 5
      )
    );
  END LOOP;
  
  RETURN 'Données générées avec succès! ' || post_count || ' posts créés pour l''utilisateur ' || user_uuid;
END;
$$ LANGUAGE plpgsql; 