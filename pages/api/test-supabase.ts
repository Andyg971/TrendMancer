import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test de connexion simple
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .limit(1)

    if (error) {
      throw error
    }

    // Vérification des tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      throw tablesError
    }

    return res.status(200).json({
      message: 'Connexion Supabase réussie',
      tables: tables?.map(t => t.table_name),
      testData: data
    })

  } catch (error) {
    console.error('Erreur test Supabase:', error)
    return res.status(500).json({
      message: 'Erreur de connexion à Supabase',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 