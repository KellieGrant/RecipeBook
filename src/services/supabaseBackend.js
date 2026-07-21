import { defaultSettings, starterRecipes } from '../data/recipes'
import { createClient } from '@supabase/supabase-js'
import { readLocal, writeLocal } from '../utils/storage'

const SESSION_KEY = 'recipebook.auth.session'
const userDataKey = (userId) => `recipebook.user.${userId}`

function userIdFromEmail(email) {
  let hash = 0
  for (const character of email.toLowerCase()) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0
  return `local_${Math.abs(hash)}`
}

function legacyData() {
  return {
    recipes: readLocal('recipebook.recipes', starterRecipes),
    favorites: readLocal('recipebook.favorites', [1]),
    categories: readLocal('recipebook.categories', []),
    settings: { ...defaultSettings, ...readLocal('recipebook.settings', {}) },
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}) : null

function normalizeRecipeFromDb(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    time: recipe.time,
    serves: recipe.serves,
    image: recipe.image,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
    user_id: recipe.user_id,
    created_at: recipe.created_at,
    updated_at: recipe.updated_at,
  }
}

function normalizeRecipes(recipes, userId) {
  return (recipes || []).map((recipe) => ({
    ...recipe,
    user_id: recipe.user_id || userId,
    ingredients: recipe.ingredients || [],
    steps: recipe.steps || [],
  }))
}

async function fetchSupabaseRecipes(userId) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase recipe fetch error:', error)
    return []
  }

  return (data || []).map(normalizeRecipeFromDb)
}

async function upsertSupabaseRecipe(recipe, userId) {
  if (!supabase) return null

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
    created_at: recipe.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('recipes')
    .upsert(payload, { onConflict: 'id' })

  if (error) {
    console.error('Supabase recipe upsert error:', error)
    return null
  }

  return data?.[0] ? normalizeRecipeFromDb(data[0]) : payload
}

export const supabaseBackend = {
  getSession() {
    return readLocal(SESSION_KEY, null)
  },

  async signIn({ email, name, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    if (!supabase) {
      const user = {
        id: userIdFromEmail(normalizedEmail),
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split('@')[0],
      }
      writeLocal(SESSION_KEY, user)
      return user
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
    if (error) throw error

    const authUser = data.user ?? data.session?.user
    if (!authUser) {
      throw new Error('Could not load authenticated user after sign in.')
    }

    const user = {
      id: authUser.id,
      email: authUser.email,
      name: name?.trim() || normalizedEmail.split('@')[0],
    }

    writeLocal(SESSION_KEY, user)
    return user
  },

  async signUp({ email, name, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    if (!supabase) {
      const user = {
        id: userIdFromEmail(normalizedEmail),
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split('@')[0],
      }
      writeLocal(SESSION_KEY, user)
      return user
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: name?.trim() || '',
        },
      },
    })

    if (error) throw error

    const authUser = data.user ?? data.session?.user
    if (!authUser) {
      throw new Error('Could not load authenticated user after sign up.')
    }

    const user = {
      id: authUser.id,
      email: authUser.email,
      name: name?.trim() || normalizedEmail.split('@')[0],
    }

    writeLocal(SESSION_KEY, user)
    return user
  },

  async signOut() {
    if (supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(SESSION_KEY)
  },

  async loadUserData(user) {
    const existing = readLocal(userDataKey(user.id), null)
    const recipes = await fetchSupabaseRecipes(user.id)

    if (existing) {
      const merged = {
        ...existing,
        recipes: recipes.length ? recipes : normalizeRecipes(existing.recipes, user.id),
        settings: { ...defaultSettings, ...existing.settings, name: existing.settings?.name || user.name },
      }
      writeLocal(userDataKey(user.id), merged)
      return merged
    }

    const migrated = legacyData()
    migrated.recipes = recipes.length ? recipes : normalizeRecipes(migrated.recipes, user.id)
    migrated.settings.name = migrated.settings.name || user.name
    writeLocal(userDataKey(user.id), migrated)
    return migrated
  },

  async saveUserData(userId, data) {
    writeLocal(userDataKey(userId), data)

    if (!supabase) return

    const payload = {
      id: userId,
      full_name: data.settings?.name || 'RecipeBook user',
    }

    await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

    for (const recipe of data.recipes) {
      await upsertSupabaseRecipe(recipe, userId)
    }
  },
}
