-- Activer RLS pour la table subscription_plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture des plans (accessible à tous les utilisateurs authentifiés)
CREATE POLICY "Tout le monde peut voir les plans d'abonnement"
ON public.subscription_plans
FOR SELECT
TO authenticated
USING (true);

-- Politique pour la modification des plans (uniquement administrateurs)
CREATE POLICY "Seuls les administrateurs peuvent modifier les plans"
ON public.subscription_plans
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'admin'
  )
); 