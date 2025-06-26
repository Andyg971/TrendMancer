import { createClient } from '@supabase/supabase-js'

// Vérification et nettoyage des URLs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Erreur: Variables d\'environnement Supabase manquantes.\n' +
    'Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
    'sont correctement définies dans votre fichier .env.local'
  );
}

// Validation de l'URL
try {
  new URL(supabaseUrl || '');
} catch (error) {
  console.error('Erreur: L\'URL Supabase n\'est pas valide:', supabaseUrl);
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
) 