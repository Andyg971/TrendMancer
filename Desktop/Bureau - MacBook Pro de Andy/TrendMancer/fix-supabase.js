// Script pour réparer les problèmes Supabase avec PostgreSQL direct
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Variables d\'environnement non trouvées dans .env.local');
  process.exit(1);
}

// Pour les besoins de ce script, nous allons demander de saisir les informations de connexion
// car elles ne sont généralement pas disponibles via l'API publique
console.log('\nPour exécuter ces commandes SQL, nous avons besoin des informations de connexion à votre base de données Supabase.');
console.log('Vous pouvez trouver ces informations dans les paramètres de votre projet Supabase sous "Project Settings" > "Database".\n');

// Dans un cas réel, l'utilisateur fournirait ces informations
// Pour ce script de démonstration, vous devrez mettre à jour ces valeurs manuellement
const DB_HOST = 'VOTRE_HOST.supabase.co'; // par exemple: db.abcdefghijklm.supabase.co
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres'; // ou le nom d'utilisateur que vous avez configuré
const DB_PASSWORD = 'VOTRE_MOT_DE_PASSE_POSTGRESQL'; // le mot de passe que vous avez configuré

// Créer un pool de connexions PostgreSQL
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// SQL à exécuter
const sqlQueries = [
  // 1. Création de la fonction trigger_set_timestamp
  `CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`,
  
  // 2. Création de la fonction update_updated_at_column
  `CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`,
  
  // 3. Activation de l'extension pg_trgm
  `CREATE EXTENSION IF NOT EXISTS pg_trgm;`,
  
  // 4. Activation de l'extension vector
  `CREATE EXTENSION IF NOT EXISTS vector;`
];

// Fonction asynchrone pour exécuter les requêtes SQL
async function fixSupabase() {
  const client = await pool.connect();
  
  try {
    for (let i = 0; i < sqlQueries.length; i++) {
      const query = sqlQueries[i];
      console.log(`Exécution de la requête ${i + 1}...`);
      await client.query(query);
      console.log(`Requête ${i + 1} exécutée avec succès!`);
    }
    
    console.log('\nToutes les requêtes ont été exécutées avec succès!');
    console.log('Les problèmes mentionnés devraient maintenant être résolus.');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des requêtes SQL:', error.message);
    console.error('Détails:', error);
  } finally {
    client.release();
    pool.end();
  }
}

console.log("\nIMPORTANT: Avant d'exécuter ce script, veuillez modifier les variables DB_HOST et DB_PASSWORD dans le code avec vos informations de connexion à PostgreSQL de Supabase.");
console.log("Une fois que vous avez mis à jour ces informations, vous pouvez exécuter le script avec 'node fix-supabase.js'");

// Le script est désactivé par défaut - décommentez la ligne suivante après avoir mis à jour les informations de connexion
// fixSupabase(); 