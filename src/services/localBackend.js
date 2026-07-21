import { defaultSettings, starterRecipes } from '../data/recipes'
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

export const localBackend = {
  getSession() {
    return readLocal(SESSION_KEY, null)
  },

  async signIn({ email, name }) {
    const normalizedEmail = email.trim().toLowerCase()
    const user = {
      id: userIdFromEmail(normalizedEmail),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
    }
    writeLocal(SESSION_KEY, user)
    return user
  },

  async signOut() {
    localStorage.removeItem(SESSION_KEY)
  },

  loadUserData(user) {
    const existing = readLocal(userDataKey(user.id), null)
    if (existing) return { ...existing, recipes: existing.recipes.map((recipe) => ({ ...recipe, user_id: user.id })), settings: { ...defaultSettings, ...existing.settings, name: existing.settings?.name || user.name } }

    const migrated = legacyData()
    migrated.recipes = migrated.recipes.map((recipe) => ({ ...recipe, user_id: user.id }))
    migrated.settings.name = migrated.settings.name || user.name
    writeLocal(userDataKey(user.id), migrated)
    return migrated
  },

  saveUserData(userId, data) {
    writeLocal(userDataKey(userId), data)
  },
}
