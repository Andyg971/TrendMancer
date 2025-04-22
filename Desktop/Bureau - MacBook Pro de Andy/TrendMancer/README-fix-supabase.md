# Comment réparer les problèmes Supabase

Pour résoudre les problèmes concernant `public.update_updated_at_column`, `public.trigger_set_timestamp`, `public.pg_trgm` et `public.vector`, suivez ces étapes simples:

## Méthode 1: Via l'interface Supabase (recommandée)

1. Connectez-vous à votre projet Supabase à l'adresse: https://app.supabase.com
2. Cliquez sur "SQL Editor" dans le menu de gauche
3. Créez une nouvelle requête en cliquant sur le bouton "+ New Query"
4. Copiez-collez le code SQL suivant dans l'éditeur:

```sql
-- 1. Création de la fonction trigger_set_timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Création de la fonction update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Activation de l'extension pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 4. Activation de l'extension vector
CREATE EXTENSION IF NOT EXISTS vector;
```

5. Cliquez sur le bouton "Run" pour exécuter la requête
6. Vous devriez voir un message de succès pour chaque commande

## Méthode 2: Via le script Node.js

Si vous préférez utiliser un script Node.js:

1. Modifiez le fichier `fix-supabase.js` dans ce dossier en remplaçant les valeurs `DB_HOST` et `DB_PASSWORD` par vos informations de connexion.
2. Décommentez la dernière ligne `// fixSupabase();` en supprimant les `//`.
3. Exécutez le script avec la commande:
   ```
   node fix-supabase.js
   ```

## Vérification

Pour vérifier que les problèmes sont résolus:

1. Retournez dans l'interface Supabase
2. Allez dans la section "Database" > "Extensions" pour confirmer que `pg_trgm` et `vector` sont activés
3. Exécutez la requête SQL suivante pour vérifier les fonctions:

```sql
SELECT proname, pronamespace::regnamespace as schema 
FROM pg_proc 
WHERE proname IN ('trigger_set_timestamp', 'update_updated_at_column')
  AND pronamespace::regnamespace = 'public'::regnamespace;
```

Vous devriez voir les deux fonctions listées dans les résultats. 