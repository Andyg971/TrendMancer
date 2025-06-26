#!/bin/bash

# Vérifier si les variables d'environnement sont définies
if [ -z "$SUPABASE_PROJECT_ID" ] || [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ Erreur: SUPABASE_PROJECT_ID et SUPABASE_ACCESS_TOKEN doivent être définis"
    exit 1
fi

echo "🚀 Configuration de la base de données..."

# Créer les tables
curl -X POST "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/sql" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "query": "
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

    -- Table des plans d'abonnement
    CREATE TABLE IF NOT EXISTS subscription_plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        monthly_price INTEGER NOT NULL,
        annual_price INTEGER NOT NULL,
        features JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table des abonnements utilisateur
    CREATE TABLE IF NOT EXISTS subscriptions (
        id VARCHAR(255) PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        plan_id VARCHAR(50) REFERENCES subscription_plans(id),
        status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
        current_period_start TIMESTAMPTZ NOT NULL,
        current_period_end TIMESTAMPTZ NOT NULL,
        cancel_at_period_end BOOLEAN DEFAULT false,
        billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('monthly', 'annual')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Table de l'historique des paiements
    CREATE TABLE IF NOT EXISTS payment_history (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id),
        subscription_id VARCHAR(255) REFERENCES subscriptions(id),
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'EUR',
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50),
        payment_id VARCHAR(255),
        invoice_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
    CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON payment_history(subscription_id);

    -- Trigger pour la mise à jour automatique de updated_at
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Appliquer les triggers
    DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
    CREATE TRIGGER update_subscription_plans_updated_at
        BEFORE UPDATE ON subscription_plans
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
    CREATE TRIGGER update_subscriptions_updated_at
        BEFORE UPDATE ON subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    -- Insérer les plans d'abonnement par défaut
    INSERT INTO subscription_plans (id, name, description, monthly_price, annual_price, features)
    VALUES
    (
        'starter',
        'Starter',
        'Parfait pour les créateurs de contenu débutants',
        2900,
        27840,
        '{
            \"trends\": {\"included\": true, \"limit\": 100},
            \"content\": {\"included\": true, \"limit\": 50},
            \"projects\": {\"included\": true, \"limit\": 3},
            \"analytics\": {\"included\": true, \"basic\": true}
        }'::jsonb
    ),
    (
        'pro',
        'Professionnel',
        'Pour les créateurs de contenu sérieux',
        9900,
        95040,
        '{
            \"trends\": {\"included\": true, \"limit\": null},
            \"content\": {\"included\": true, \"limit\": null},
            \"projects\": {\"included\": true, \"limit\": null},
            \"analytics\": {\"included\": true, \"advanced\": true},
            \"ai_assistant\": {\"included\": true}
        }'::jsonb
    ),
    (
        'enterprise',
        'Entreprise',
        'Solution complète pour les équipes',
        29900,
        287040,
        '{
            \"trends\": {\"included\": true, \"limit\": null, \"custom\": true},
            \"content\": {\"included\": true, \"limit\": null, \"custom\": true},
            \"projects\": {\"included\": true, \"limit\": null, \"team\": true},
            \"analytics\": {\"included\": true, \"enterprise\": true},
            \"support\": {\"included\": true, \"dedicated\": true}
        }'::jsonb
    )
    ON CONFLICT (id) DO UPDATE
    SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        monthly_price = EXCLUDED.monthly_price,
        annual_price = EXCLUDED.annual_price,
        features = EXCLUDED.features;
  "
}
EOF

# Vérifier le résultat
echo "✅ Configuration terminée !" 