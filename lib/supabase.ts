import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'A apărut o eroare',
    data: null
  }
}