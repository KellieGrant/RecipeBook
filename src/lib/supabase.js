import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export const isSupabaseConfigured = Boolean(supabase)

export async function signInWithEmail(email, password) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values first.') }
  }

  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email, password, name) {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values first.') }
  }

  const result = await supabase.auth.signUp({ email, password })

  if (result.data.user && name?.trim()) {
    await supabase.from('profiles').upsert({ id: result.data.user.id, full_name: name.trim() })
  }

  return result
}

export async function signOutFromSupabase() {
  if (!supabase) return { error: null }
  return supabase.auth.signOut()
}

export async function fetchRecipesForUser(userId) {
  if (!supabase || !userId) {
    return { data: [], error: null }
  }

  return supabase.from('recipes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
}

export async function saveRecipeToSupabase(recipe, userId) {
  if (!supabase || !userId) {
    return { data: null, error: null }
  }

  const payload = {
    id: recipe.id,
    user_id: userId,
    title: recipe.title,
    category: recipe.category || 'Dinner',
    time: recipe.time || '',
    serves: recipe.serves ?? null,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    image: recipe.image || null,
    updated_at: new Date().toISOString(),
  }

  return supabase.from('recipes').upsert(payload, { onConflict: 'id' })
}
