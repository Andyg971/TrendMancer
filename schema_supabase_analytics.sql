-- Partie 2: Tables pour l'analytique et le reporting
-- Ce script crée les tables pour l'analyse des données et la génération de rapports
-- À exécuter après schema_supabase_complet.sql

-- Table pour stocker l'historique des statistiques d'engagement
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

-- Table pour les créneaux horaires optimaux
CREATE TABLE IF NOT EXISTS optimal_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour < 24),
  engagement_score NUMERIC(5,2) NOT NULL,
  confidence_level NUMERIC(3,2) DEFAULT 0.5,
  data_points_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les rapports générés
CREATE TABLE IF NOT EXISTS analytics_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  platforms TEXT[],
  report_data JSONB NOT NULL,
  scheduled BOOLEAN DEFAULT FALSE,
  schedule_frequency TEXT,
  recipients TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS et créer des déclencheurs pour les timestamps
ALTER TABLE engagement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimal_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;

-- Créer des déclencheurs pour updated_at
CREATE TRIGGER set_timestamp_analytics_reports
BEFORE UPDATE ON analytics_reports
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Policies pour l'accès aux données
-- Engagement history
CREATE POLICY "Users can view engagement history of their posts" 
  ON engagement_history FOR SELECT 
  USING (EXISTS (
    SELECT 1
    FROM social_posts
    WHERE social_posts.id = engagement_history.post_id
    AND social_posts.user_id = auth.uid()
  ));

-- Analytics summaries
CREATE POLICY "Users can view their own analytics summaries" 
  ON analytics_summaries FOR SELECT 
  USING (auth.uid() = user_id);

-- AI recommendations
CREATE POLICY "Users can view their own AI recommendations" 
  ON ai_recommendations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI recommendations" 
  ON ai_recommendations FOR UPDATE 
  USING (auth.uid() = user_id);

-- Audience metrics
CREATE POLICY "Users can view their own audience metrics" 
  ON audience_metrics FOR SELECT 
  USING (auth.uid() = user_id);

-- Optimal time slots
CREATE POLICY "Users can view their own optimal time slots" 
  ON optimal_time_slots FOR SELECT 
  USING (auth.uid() = user_id);

-- Analytics reports
CREATE POLICY "Users can view their own reports" 
  ON analytics_reports FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reports" 
  ON analytics_reports FOR ALL 
  USING (auth.uid() = user_id);

-- Fonction pour générer des données analytiques d'exemple
CREATE OR REPLACE FUNCTION generate_analytics_sample_data(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  post_id UUID;
  platform_array TEXT[] := ARRAY['instagram', 'facebook', 'twitter', 'linkedin'];
  platform TEXT;
  post_count INTEGER := 0;
  i INTEGER;
  j INTEGER;
BEGIN
  -- Générer 20 posts répartis sur différentes plateformes
  FOR i IN 1..20 LOOP
    -- Choisir une plateforme aléatoire
    platform := platform_array[(floor(random() * 4) + 1)::int];
    
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
      floor(random() * 200)::int, -- Likes (0-200)
      floor(random() * 50)::int, -- Commentaires (0-50)
      floor(random() * 30)::int, -- Partages (0-30)
      floor(random() * 1000 + 100)::int, -- Impressions (100-1100)
      floor(random() * 800 + 50)::int, -- Portée (50-850)
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
        floor(random() * 40 * j)::int, -- Likes progressifs
        floor(random() * 10 * j)::int, -- Commentaires progressifs
        floor(random() * 6 * j)::int,  -- Partages progressifs
        floor(random() * 200 * j + 50)::int, -- Impressions progressives
        floor(random() * 160 * j + 30)::int  -- Portée progressive
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
    COUNT(*)::int,
    SUM(likes)::int,
    SUM(comments)::int,
    SUM(shares)::int,
    SUM(impressions)::int,
    SUM(reach)::int,
    (SUM(likes) + SUM(comments) + SUM(shares))::numeric / NULLIF(SUM(impressions), 0) * 100,
    random() * 15 + 5, -- Croissance entre 5% et 20%
    jsonb_build_object(
      'monday', jsonb_build_object('hour', (floor(random() * 12) + 8)::int, 'score', (random() * 8 + 2)::numeric(4,2)),
      'wednesday', jsonb_build_object('hour', (floor(random() * 12) + 8)::int, 'score', (random() * 8 + 2)::numeric(4,2)),
      'friday', jsonb_build_object('hour', (floor(random() * 12) + 8)::int, 'score', (random() * 8 + 2)::numeric(4,2))
    )
  FROM social_posts
  WHERE user_id = user_uuid
  GROUP BY platform;
  
  -- Générer des données d'audience pour chaque plateforme
  FOREACH platform IN ARRAY platform_array LOOP
    INSERT INTO audience_metrics (
      user_id,
      platform,
      followers_count,
      followers_growth,
      demographics,
      location_data,
      active_times
    ) VALUES (
      user_uuid,
      platform,
      floor(random() * 5000 + 1000)::int, -- Entre 1000 et 6000 followers
      floor(random() * 200 + 10)::int, -- Croissance entre 10 et 210
      jsonb_build_object(
        'age_groups', jsonb_build_object(
          '18-24', (random() * 30)::numeric(4,1),
          '25-34', (random() * 40)::numeric(4,1),
          '35-44', (random() * 20)::numeric(4,1),
          '45-54', (random() * 10)::numeric(4,1)
        ),
        'gender', jsonb_build_object(
          'male', (random() * 60)::numeric(4,1),
          'female', (random() * 40)::numeric(4,1)
        )
      ),
      jsonb_build_object(
        'countries', jsonb_build_object(
          'France', (random() * 60)::numeric(4,1),
          'USA', (random() * 20)::numeric(4,1),
          'Canada', (random() * 10)::numeric(4,1),
          'Germany', (random() * 10)::numeric(4,1)
        )
      ),
      jsonb_build_object(
        'weekdays', jsonb_build_object(
          'monday', (random() * 20)::numeric(4,1),
          'wednesday', (random() * 25)::numeric(4,1),
          'friday', (random() * 35)::numeric(4,1),
          'sunday', (random() * 20)::numeric(4,1)
        ),
        'hours', jsonb_build_object(
          '8', (random() * 10)::numeric(4,1),
          '12', (random() * 25)::numeric(4,1),
          '18', (random() * 40)::numeric(4,1),
          '21', (random() * 25)::numeric(4,1)
        )
      )
    );
    
    -- Créer des créneaux horaires optimaux pour chaque plateforme
    INSERT INTO optimal_time_slots (
      user_id,
      platform,
      day_of_week,
      hour,
      engagement_score,
      confidence_level
    ) VALUES 
    (
      user_uuid,
      platform,
      'monday',
      (floor(random() * 5) + 9)::int, -- Entre 9h et 14h
      (random() * 8 + 2)::numeric(4,2), -- Score entre 2 et 10
      (random() * 0.5 + 0.5)::numeric(3,2) -- Confiance entre 0.5 et 1.0
    ),
    (
      user_uuid,
      platform,
      'wednesday',
      (floor(random() * 4) + 13)::int, -- Entre 13h et 17h
      (random() * 8 + 2)::numeric(4,2),
      (random() * 0.5 + 0.5)::numeric(3,2)
    ),
    (
      user_uuid,
      platform,
      'friday',
      (floor(random() * 4) + 17)::int, -- Entre 17h et 21h
      (random() * 8 + 2)::numeric(4,2),
      (random() * 0.5 + 0.5)::numeric(3,2)
    );
  END LOOP;
  
  -- Générer des recommandations IA
  INSERT INTO ai_recommendations (
    user_id,
    recommendation_text,
    category,
    priority,
    is_applied
  ) VALUES 
  (
    user_uuid,
    'Augmentez votre fréquence de publication sur Instagram à 4-5 fois par semaine pour maximiser votre portée.',
    'frequency',
    1,
    false
  ),
  (
    user_uuid,
    'Publiez plus de contenu vidéo sur Facebook, vos vidéos génèrent 45% plus d''engagement que les images.',
    'content_type',
    2,
    false
  ),
  (
    user_uuid,
    'Concentrez vos publications LinkedIn entre 10h et 14h les jours de semaine pour un meilleur engagement professionnel.',
    'timing',
    3,
    false
  ),
  (
    user_uuid,
    'Utilisez plus de hashtags liés à votre secteur comme #MarketingDigital et #Innovation pour augmenter votre découvrabilité.',
    'hashtags',
    4,
    false
  ),
  (
    user_uuid,
    'Essayez d''interagir avec vos abonnés dans les 30 minutes suivant leur commentaire pour stimuler l''engagement.',
    'engagement',
    5,
    false
  );
  
  RETURN 'Données d''exemple générées avec succès: ' || post_count || ' posts et analytiques associées.';
END;
$$ LANGUAGE plpgsql; 