-- Fonction pour vérifier la structure des tables d'abonnement
CREATE OR REPLACE FUNCTION check_subscription_tables()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Vérifier l'existence des tables
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
        RAISE EXCEPTION 'Table subscription_plans non trouvée';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
        RAISE EXCEPTION 'Table subscriptions non trouvée';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_history') THEN
        RAISE EXCEPTION 'Table payment_history non trouvée';
    END IF;

    -- Vérifier les index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'subscriptions' AND indexname = 'idx_subscriptions_user_id') THEN
        RAISE EXCEPTION 'Index idx_subscriptions_user_id non trouvé';
    END IF;

    -- Vérifier les triggers
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
        RAISE EXCEPTION 'Trigger update_subscriptions_updated_at non trouvé';
    END IF;

    -- Vérifier les données des plans
    IF NOT EXISTS (SELECT 1 FROM subscription_plans WHERE id IN ('starter', 'pro', 'enterprise')) THEN
        RAISE EXCEPTION 'Plans d''abonnement par défaut non trouvés';
    END IF;

    -- Tout est OK, retourner le statut
    result = jsonb_build_object(
        'status', 'success',
        'message', 'Toutes les tables d''abonnement sont correctement configurées',
        'tables', (
            SELECT jsonb_agg(jsonb_build_object(
                'table_name', tablename,
                'row_count', (SELECT count(*) FROM public.subscription_plans)
            ))
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename IN ('subscription_plans', 'subscriptions', 'payment_history')
        )
    );

    RETURN result;
END;
$$; 