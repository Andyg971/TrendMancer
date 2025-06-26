-- Partie 4: Tables pour le calendrier intelligent
-- Ce script crée les tables pour la fonctionnalité de calendrier intelligent
-- À exécuter après schema_supabase_complet.sql, schema_supabase_analytics.sql et schema_supabase_assistant.sql

-- Table pour stocker les événements du calendrier
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT false,
  location TEXT,
  event_type TEXT NOT NULL,
  platform TEXT,
  post_id UUID,
  status TEXT DEFAULT 'scheduled',
  recurrence_rule TEXT,
  color TEXT,
  reminders JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les créneaux horaires optimaux pour la publication
CREATE TABLE IF NOT EXISTS optimal_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  hour INTEGER NOT NULL CHECK (hour BETWEEN 0 AND 23),
  engagement_score NUMERIC(5,2) NOT NULL,
  confidence_level NUMERIC(3,2) NOT NULL CHECK (confidence_level BETWEEN 0 AND 1),
  audience_segment TEXT,
  sample_size INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les recommandations de temps optimaux pour la publication
CREATE TABLE IF NOT EXISTS time_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_type TEXT,
  recommendation_text TEXT NOT NULL,
  time_slots JSONB NOT NULL,
  relevance_score NUMERIC(3,2) NOT NULL CHECK (relevance_score BETWEEN 0 AND 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les paramètres du calendrier personnalisés de l'utilisateur
CREATE TABLE IF NOT EXISTS calendar_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_view TEXT DEFAULT 'month',
  work_hours JSONB DEFAULT '{"start": 9, "end": 17}'::jsonb,
  work_days INTEGER[] DEFAULT '{1,2,3,4,5}'::integer[], -- 0=Sunday, 1=Monday, etc.
  default_reminder_time INTEGER DEFAULT 30, -- minutes
  timezone TEXT DEFAULT 'UTC',
  color_scheme JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les catégories d'événements personnalisées
CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les conflits d'horaire détectés
CREATE TABLE IF NOT EXISTS schedule_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id_1 UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  event_id_2 UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  resolution_status TEXT DEFAULT 'pending',
  system_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS et créer des déclencheurs pour les timestamps
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimal_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_conflicts ENABLE ROW LEVEL SECURITY;

-- Créer des déclencheurs pour updated_at
CREATE TRIGGER set_timestamp_calendar_events
BEFORE UPDATE ON calendar_events
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_time_recommendations
BEFORE UPDATE ON time_recommendations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_calendar_settings
BEFORE UPDATE ON calendar_settings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_event_categories
BEFORE UPDATE ON event_categories
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_schedule_conflicts
BEFORE UPDATE ON schedule_conflicts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Policies pour l'accès aux données
-- Calendar events
CREATE POLICY "Users can view their own calendar events"
  ON calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Optimal time slots
CREATE POLICY "Users can view their own optimal time slots"
  ON optimal_time_slots
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own optimal time slots"
  ON optimal_time_slots
  FOR ALL
  USING (auth.uid() = user_id);

-- Time recommendations
CREATE POLICY "Users can view their own time recommendations"
  ON time_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own time recommendations"
  ON time_recommendations
  FOR ALL
  USING (auth.uid() = user_id);

-- Calendar settings
CREATE POLICY "Users can view their own calendar settings"
  ON calendar_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own calendar settings"
  ON calendar_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Event categories
CREATE POLICY "Users can view their own event categories"
  ON event_categories
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own event categories"
  ON event_categories
  FOR ALL
  USING (auth.uid() = user_id);

-- Schedule conflicts
CREATE POLICY "Users can view their own schedule conflicts"
  ON schedule_conflicts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own schedule conflicts"
  ON schedule_conflicts
  FOR ALL
  USING (auth.uid() = user_id);

-- Fonction pour générer des données d'exemples pour le calendrier
CREATE OR REPLACE FUNCTION generate_calendar_sample_data(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  platform_array TEXT[] := ARRAY['instagram', 'facebook', 'twitter', 'linkedin'];
  event_type_array TEXT[] := ARRAY['post', 'story', 'meeting', 'task', 'reminder'];
  event_count INTEGER := 0;
  current_date DATE := CURRENT_DATE;
  random_hour INTEGER;
  random_minute INTEGER;
  random_platform TEXT;
  random_event_type TEXT;
  start_timestamp TIMESTAMP WITH TIME ZONE;
  end_timestamp TIMESTAMP WITH TIME ZONE;
  random_day INTEGER;
BEGIN
  -- Créer des paramètres de calendrier par défaut pour l'utilisateur
  INSERT INTO calendar_settings (
    user_id,
    default_view,
    work_hours,
    work_days,
    timezone
  ) VALUES (
    user_uuid,
    'month',
    jsonb_build_object('start', 9, 'end', 18),
    ARRAY[1, 2, 3, 4, 5],
    'UTC'
  );
  
  -- Créer des catégories d'événements
  INSERT INTO event_categories (user_id, name, color, icon) VALUES
    (user_uuid, 'Publication', '#4285F4', 'send'),
    (user_uuid, 'Réunion', '#DB4437', 'users'),
    (user_uuid, 'Tâche', '#F4B400', 'check-square'),
    (user_uuid, 'Rappel', '#0F9D58', 'bell'),
    (user_uuid, 'Personnel', '#AB47BC', 'heart');
  
  -- Créer des créneaux horaires optimaux
  FOR platform IN SELECT unnest(platform_array) LOOP
    FOR day IN 0..6 LOOP
      FOR hour IN 9..20 LOOP
        IF random() < 0.3 THEN -- Seulement certains créneaux sont optimaux
          INSERT INTO optimal_time_slots (
            user_id,
            platform,
            day_of_week,
            hour,
            engagement_score,
            confidence_level,
            sample_size
          ) VALUES (
            user_uuid,
            platform,
            day,
            hour,
            (random() * 9 + 1)::numeric(5,2),
            (random() * 0.5 + 0.5)::numeric(3,2),
            (random() * 1000 + 100)::integer
          );
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
  
  -- Créer des recommandations de temps de publication
  FOR platform IN SELECT unnest(platform_array) LOOP
    INSERT INTO time_recommendations (
      user_id,
      platform,
      content_type,
      recommendation_text,
      time_slots,
      relevance_score
    ) VALUES (
      user_uuid,
      platform,
      'post',
      'Basé sur l''engagement de votre audience, les meilleurs moments pour publier sur ' || platform || ' sont le mardi et le jeudi entre 12h et 14h.',
      jsonb_build_array(
        jsonb_build_object('day', 2, 'hour', 12, 'score', 8.7),
        jsonb_build_object('day', 2, 'hour', 13, 'score', 8.5),
        jsonb_build_object('day', 4, 'hour', 12, 'score', 8.9),
        jsonb_build_object('day', 4, 'hour', 13, 'score', 8.6)
      ),
      0.95
    );
  END LOOP;
  
  -- Créer des événements sur 30 jours (passés et futurs)
  FOR i IN -15..15 LOOP
    -- Générer 0 à 3 événements par jour
    FOR j IN 1..floor(random() * 4)::int LOOP
      random_hour := floor(random() * 10 + 9)::int; -- 9am to 7pm
      random_minute := floor(random() * 60)::int;
      random_platform := platform_array[floor(random() * 4 + 1)::int];
      random_event_type := event_type_array[floor(random() * 5 + 1)::int];
      
      start_timestamp := (current_date + i * INTERVAL '1 day' + random_hour * INTERVAL '1 hour' + random_minute * INTERVAL '1 minute')::timestamp with time zone;
      end_timestamp := start_timestamp + INTERVAL '1 hour';
      
      INSERT INTO calendar_events (
        user_id,
        title,
        description,
        start_time,
        end_time,
        all_day,
        location,
        event_type,
        platform,
        status,
        color
      ) VALUES (
        user_uuid,
        CASE 
          WHEN random_event_type = 'post' THEN 'Publication ' || random_platform
          WHEN random_event_type = 'story' THEN 'Story ' || random_platform
          WHEN random_event_type = 'meeting' THEN 'Réunion d''équipe'
          WHEN random_event_type = 'task' THEN 'Tâche: Analyse des performances'
          ELSE 'Rappel: Vérifier les commentaires'
        END,
        CASE 
          WHEN random_event_type IN ('post', 'story') THEN 'Contenu à publier sur ' || random_platform
          WHEN random_event_type = 'meeting' THEN 'Discussion sur la stratégie de contenu'
          WHEN random_event_type = 'task' THEN 'Analyser les performances des dernières publications'
          ELSE 'Vérifier et répondre aux commentaires récents'
        END,
        start_timestamp,
        end_timestamp,
        random() < 0.1, -- 10% chance d'être all_day
        CASE WHEN random_event_type = 'meeting' THEN 'Salle de conférence' ELSE NULL END,
        random_event_type,
        CASE WHEN random_event_type IN ('post', 'story') THEN random_platform ELSE NULL END,
        CASE 
          WHEN start_timestamp < NOW() THEN 
            CASE WHEN random() < 0.9 THEN 'completed' ELSE 'missed' END
          ELSE 'scheduled' 
        END,
        CASE 
          WHEN random_event_type = 'post' THEN '#4285F4'
          WHEN random_event_type = 'meeting' THEN '#DB4437'
          WHEN random_event_type = 'task' THEN '#F4B400'
          ELSE '#0F9D58'
        END
      );
      
      event_count := event_count + 1;
    END LOOP;
  END LOOP;
  
  -- Créer quelques conflits d'horaire
  FOR i IN 1..3 LOOP
    -- Sélectioner deux événements aléatoires qui se chevauchent
    random_day := floor(random() * 10)::int; -- Un jour dans les 10 prochains jours
    random_hour := floor(random() * 10 + 9)::int; -- 9am to 7pm
    
    WITH events AS (
      INSERT INTO calendar_events (
        user_id, 
        title, 
        description, 
        start_time, 
        end_time, 
        event_type, 
        platform, 
        status
      ) VALUES (
        user_uuid,
        'Événement conflit A' || i,
        'Premier événement en conflit',
        (current_date + random_day * INTERVAL '1 day' + random_hour * INTERVAL '1 hour')::timestamp with time zone,
        (current_date + random_day * INTERVAL '1 day' + (random_hour + 1) * INTERVAL '1 hour')::timestamp with time zone,
        'meeting',
        NULL,
        'scheduled'
      ) RETURNING id
    ),
    events2 AS (
      INSERT INTO calendar_events (
        user_id, 
        title, 
        description, 
        start_time, 
        end_time, 
        event_type, 
        platform, 
        status
      ) VALUES (
        user_uuid,
        'Événement conflit B' || i,
        'Second événement en conflit',
        (current_date + random_day * INTERVAL '1 day' + random_hour * INTERVAL '1 hour' + INTERVAL '30 minutes')::timestamp with time zone,
        (current_date + random_day * INTERVAL '1 day' + (random_hour + 1) * INTERVAL '1 hour' + INTERVAL '30 minutes')::timestamp with time zone,
        'post',
        platform_array[floor(random() * 4 + 1)::int],
        'scheduled'
      ) RETURNING id
    )
    INSERT INTO schedule_conflicts (
      user_id,
      event_id_1,
      event_id_2,
      conflict_type,
      resolution_status,
      system_recommendation
    )
    SELECT 
      user_uuid,
      e1.id,
      e2.id,
      'overlap',
      'pending',
      'Nous recommandons de reprogrammer la publication 30 minutes plus tôt ou plus tard pour éviter le conflit avec la réunion.'
    FROM events e1, events2 e2;
    
    event_count := event_count + 2;
  END LOOP;
  
  RETURN 'Données d''exemple pour le calendrier intelligent générées avec succès: ' || event_count || ' événements.';
END;
$$ LANGUAGE plpgsql; 