import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Hook utilitaire pour les requêtes Supabase
export async function supabaseQuery<T>(
  query: Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await query
  
  if (error) {
    console.error('Erreur Supabase:', error)
    throw error
  }
  
  if (!data) {
    throw new Error('Aucune donnée trouvée')
  }
  
  return data
}

// Hooks utilitaires pour les opérations courantes
export const useSupabaseQuery = async <T>(
  query: Promise<{ data: T | null; error: Error | null }>
) => {
  try {
    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error('Erreur Supabase:', error)
    throw error
  }
}

// Types utilitaires
export type Tables = Database['public']['Tables']
export type TableRow<T extends keyof Tables> = Tables[T]['Row']
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'] 