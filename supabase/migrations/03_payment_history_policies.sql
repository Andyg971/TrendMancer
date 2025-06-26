-- Activer RLS pour la table payment_history
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture de l'historique des paiements
CREATE POLICY "Utilisateurs peuvent voir leur historique de paiements"
ON public.payment_history
FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour l'insertion des paiements (système uniquement)
CREATE POLICY "Système peut insérer des paiements"
ON public.payment_history
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'system'
  )
);

-- Politique pour les administrateurs
CREATE POLICY "Les administrateurs ont un accès complet à l'historique"
ON public.payment_history
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'admin'
  )
); 