-- Schéma SQL pour les abonnements et plans dans TrendMancer
-- À exécuter dans l'éditeur SQL de Supabase

-- Table pour les plans d'abonnement disponibles
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC(10,2) NOT NULL,
  annual_price NUMERIC(10,2) NOT NULL,
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les abonnements des utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'unpaid', 'incomplete')) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  payment_id TEXT,
  invoice_id TEXT,
  is_annual BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table pour l'historique des transactions
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')) NOT NULL,
  payment_method TEXT,
  payment_id TEXT,
  invoice_id TEXT,
  receipt_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_timestamp
BEFORE UPDATE ON subscription_plans
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

CREATE TRIGGER update_user_subscriptions_timestamp
BEFORE UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION trigger_update_timestamp();

-- Fonction pour insérer les plans d'abonnement par défaut
CREATE OR REPLACE FUNCTION insert_default_subscription_plans()
RETURNS VOID AS $$
BEGIN
  -- Vérifier si les plans existent déjà
  IF NOT EXISTS (SELECT 1 FROM subscription_plans LIMIT 1) THEN
    -- Plan gratuit
    INSERT INTO subscription_plans (name, description, monthly_price, annual_price, features, limits, is_active)
    VALUES (
      'Gratuit',
      'Parfait pour les débutants et les petits créateurs de contenu.',
      0.00,
      0.00,
      jsonb_build_object(
        'social_scheduling', true,
        'analytics_basic', true,
        'calendar_view', true,
        'team_members', false,
        'ai_assistant', false,
        'advanced_analytics', false,
        'image_generator', false,
        'bulk_scheduling', false,
        'priority_support', false
      ),
      jsonb_build_object(
        'monthly_posts', 20,
        'platforms', 2,
        'team_size', 1,
        'media_storage_mb', 100,
        'ai_requests', 5
      ),
      true
    );

    -- Plan Standard
    INSERT INTO subscription_plans (name, description, monthly_price, annual_price, features, limits, is_active)
    VALUES (
      'Standard',
      'Idéal pour les professionnels et les petites entreprises.',
      19.99,
      199.99,
      jsonb_build_object(
        'social_scheduling', true,
        'analytics_basic', true,
        'calendar_view', true,
        'team_members', true,
        'ai_assistant', true,
        'advanced_analytics', false,
        'image_generator', false,
        'bulk_scheduling', true,
        'priority_support', false
      ),
      jsonb_build_object(
        'monthly_posts', 100,
        'platforms', 5,
        'team_size', 3,
        'media_storage_mb', 500,
        'ai_requests', 50
      ),
      true
    );

    -- Plan Premium
    INSERT INTO subscription_plans (name, description, monthly_price, annual_price, features, limits, is_active)
    VALUES (
      'Premium',
      'Solution complète pour les agences et les marques établies.',
      49.99,
      499.99,
      jsonb_build_object(
        'social_scheduling', true,
        'analytics_basic', true,
        'calendar_view', true,
        'team_members', true,
        'ai_assistant', true,
        'advanced_analytics', true,
        'image_generator', true,
        'bulk_scheduling', true,
        'priority_support', true
      ),
      jsonb_build_object(
        'monthly_posts', 500,
        'platforms', 10,
        'team_size', 10,
        'media_storage_mb', 2000,
        'ai_requests', 500
      ),
      true
    );

    -- Plan Entreprise
    INSERT INTO subscription_plans (name, description, monthly_price, annual_price, features, limits, is_active)
    VALUES (
      'Entreprise',
      'Solutions personnalisées pour les grandes organisations.',
      99.99,
      999.99,
      jsonb_build_object(
        'social_scheduling', true,
        'analytics_basic', true,
        'calendar_view', true,
        'team_members', true,
        'ai_assistant', true,
        'advanced_analytics', true,
        'image_generator', true,
        'bulk_scheduling', true,
        'priority_support', true,
        'dedicated_manager', true,
        'api_access', true,
        'custom_training', true
      ),
      jsonb_build_object(
        'monthly_posts', 9999,
        'platforms', 99,
        'team_size', 25,
        'media_storage_mb', 10000,
        'ai_requests', 9999
      ),
      true
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Exécuter la fonction pour insérer les plans par défaut
SELECT insert_default_subscription_plans();

-- Activer Row Level Security (RLS)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
-- Plans d'abonnement visibles par tous les utilisateurs authentifiés
CREATE POLICY "Plans are viewable by all authenticated users"
  ON subscription_plans
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Un utilisateur ne peut voir que son propre abonnement
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Un utilisateur ne peut voir que son propre historique de paiement
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Seuls les administrateurs peuvent gérer les plans d'abonnement
CREATE POLICY "Only admins can manage subscription plans"
  ON subscription_plans
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND auth.users.email = 'admin@example.com'
    )
  );

-- Fonction pour obtenir le plan d'abonnement actuel d'un utilisateur
CREATE OR REPLACE FUNCTION current_user_subscription()
RETURNS TABLE (
  user_id UUID,
  plan_id UUID,
  plan_name TEXT,
  plan_features JSONB,
  plan_limits JSONB,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  is_annual BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    us.plan_id,
    sp.name as plan_name,
    sp.features as plan_features,
    sp.limits as plan_limits,
    us.status,
    us.current_period_end,
    us.is_annual
  FROM 
    user_subscriptions us
  JOIN 
    subscription_plans sp ON us.plan_id = sp.id
  WHERE 
    us.user_id = auth.uid() AND 
    us.status IN ('active', 'trialing');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 