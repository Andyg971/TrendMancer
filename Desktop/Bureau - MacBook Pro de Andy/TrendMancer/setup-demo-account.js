// Script pour configurer le compte de démonstration dans Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDemoAccount() {
  console.log('Configuration du compte de démonstration...');

  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'demo@trendmancer.com');

    if (existingUsers && existingUsers.length > 0) {
      console.log('Le compte de démonstration existe déjà.');
      return;
    }

    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@trendmancer.com',
      password: 'demo123456',
      email_confirm: true
    });

    if (authError) {
      console.error('Erreur lors de la création du compte:', authError.message);
      return;
    }

    console.log('Compte de démonstration créé avec succès!');
    console.log('Email: demo@trendmancer.com');
    console.log('Mot de passe: demo123456');

  } catch (error) {
    console.error('Une erreur est survenue:', error.message);
  }
}

setupDemoAccount();