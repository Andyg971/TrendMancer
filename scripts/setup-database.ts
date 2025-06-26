import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Création du client Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Utilisation de la clé service pour les opérations admin
);

async function setupDatabase() {
  try {
    console.log('🚀 Début de la configuration de la base de données...');

    // Lecture du fichier SQL
    const sqlPath = path.join(__dirname, 'create_subscriptions_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Exécution du script SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sqlContent
    });

    if (error) throw error;

    console.log('✅ Tables créées avec succès !');

    // Vérification des tables
    const { data: plans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('id, name, monthly_price');

    if (plansError) throw plansError;

    console.log('📊 Plans d\'abonnement créés :', plans?.length || 0);
    console.log(plans);

  } catch (error) {
    console.error('❌ Erreur lors de la configuration :', error);
    process.exit(1);
  }
}

// Exécution du script
setupDatabase(); 