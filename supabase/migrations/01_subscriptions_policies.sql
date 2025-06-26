-- Activer RLS pour la table subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture des abonnements
CREATE POLICY "Utilisateurs peuvent voir leurs propres abonnements"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour l'insertion des abonnements (uniquement par l'utilisateur authentifié)
CREATE POLICY "Utilisateurs peuvent créer leurs propres abonnements"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique pour la mise à jour des abonnements
CREATE POLICY "Utilisateurs peuvent mettre à jour leurs propres abonnements"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politique pour la suppression des abonnements
CREATE POLICY "Utilisateurs peuvent supprimer leurs propres abonnements"
ON public.subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Autoriser l'accès complet pour les administrateurs
CREATE POLICY "Les administrateurs ont un accès complet"
ON public.subscriptions
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'admin'
  )
); 