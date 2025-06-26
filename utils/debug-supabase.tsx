import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

const DebugSupabase = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        setLoading(true);
        
        // Test 1: Version de Supabase
        const { data: versionData, error: versionError } = await supabase.rpc('version');
        
        // Test 2: Essayer de récupérer les données de la table posts
        const { data: postsData, error: postsError } = await supabase.from('posts').select('*').limit(5);

        if (versionError) {
          throw new Error(`Erreur lors de la vérification de la version: ${versionError.message}`);
        }

        setTestResult({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          version: versionData,
          posts: {
            data: postsData,
            error: postsError ? postsError.message : null
          }
        });
      } catch (err: any) {
        console.error('Erreur de test Supabase:', err);
        setError(err.message || 'Une erreur inconnue est survenue');
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 max-w-3xl mx-auto my-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Vérification de la connexion Supabase</h2>
      
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg">
          <p className="font-medium">Erreur de connexion:</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">URL Supabase:</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 break-all">{testResult?.supabaseUrl}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Version PostgreSQL:</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{testResult?.version || 'Non disponible'}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200">Test de la table 'posts':</h3>
            {testResult?.posts.error ? (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                Erreur: {testResult.posts.error}
                {testResult.posts.error.includes("relation") && (
                  <p className="mt-2">
                    La table 'posts' n'existe pas. Assurez-vous d'exécuter le script SQL dans l'éditeur SQL de Supabase.
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-1">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  {testResult?.posts.data && testResult.posts.data.length > 0
                    ? `Succès! ${testResult.posts.data.length} publication(s) trouvée(s).`
                    : 'Connecté, mais aucune publication trouvée dans la table.'}
                </p>
                
                {testResult?.posts.data && testResult.posts.data.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg overflow-auto max-h-60">
                    <pre className="text-xs text-gray-700 dark:text-gray-300">
                      {JSON.stringify(testResult.posts.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugSupabase; 