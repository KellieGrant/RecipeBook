import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import MobileTabs from './components/MobileTabs'
import CategoriesPage from './pages/CategoriesPage'
import RecipeFormPage from './pages/RecipeFormPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import { categoryColors, defaultSettings, starterRecipes } from './data/recipes'
import { backend } from './services/backend'

const initialSession = backend.getSession()

function App() {
  const [user, setUser] = useState(initialSession)
  const [recipes, setRecipes] = useState(starterRecipes)
  const [favorites, setFavorites] = useState(() => new Set([1]))
  const [customCategories, setCustomCategories] = useState([])
  const [settings, setSettings] = useState(defaultSettings)
  const [bootstrapping, setBootstrapping] = useState(Boolean(initialSession))
  const [page, setPage] = useState('recipes')
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [mobileDetail, setMobileDetail] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true

    async function hydrateUserData() {
      if (!user) {
        setBootstrapping(false)
        return
      }

      try {
        const data = await backend.loadUserData(user)
        if (!active) return
        setRecipes(data.recipes)
        setFavorites(new Set(data.favorites))
        setCustomCategories(data.categories)
        setSettings({ ...defaultSettings, ...data.settings, name: data.settings?.name || user.name })
      } finally {
        if (active) setBootstrapping(false)
      }
    }

    void hydrateUserData()

    return () => { active = false }
  }, [user])

  useEffect(() => {
    if (!user || bootstrapping) return
    void backend.saveUserData(user.id, { recipes, favorites: [...favorites], categories: customCategories, settings })
  }, [user, recipes, favorites, customCategories, settings, bootstrapping])

  useEffect(() => { document.documentElement.dataset.theme = settings.darkMode ? 'dark' : 'light' }, [settings.darkMode])

  const categories = [...new Set([...Object.keys(categoryColors), ...customCategories, ...recipes.map((recipe) => recipe.category)])]
  const visibleRecipes = useMemo(() => recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = activeCategory === 'All' || recipe.category === activeCategory
    const matchesPage = page !== 'favorites' || favorites.has(recipe.id)
    return matchesSearch && matchesCategory && matchesPage
  }), [recipes, query, activeCategory, page, favorites])
  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedId) || visibleRecipes[0]

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function navigate(nextPage) {
    setPage(nextPage)
    setMobileMenu(false)
    setMobileDetail(false)
    if (nextPage !== 'categories') setActiveCategory('All')
  }

  function selectCategory(name) {
    setActiveCategory(name)
    setPage('recipes')
    setMobileMenu(false)
  }

  function toggleFavorite(id, event) {
    event?.stopPropagation()
    setFavorites((current) => {
      const next = new Set(current)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openRecipe(id) {
    setSelectedId(id)
    setMobileDetail(true)
  }

  function openRecipeForm(recipe = null) {
    setEditing(recipe)
    setPage('form')
  }

  async function saveRecipe(recipe) {
    const now = new Date().toISOString()
    const savedRecipe = recipe.id
      ? { ...recipe, user_id: user.id, updated_at: now }
      : { ...recipe, id: Date.now(), user_id: user.id, created_at: now, updated_at: now }
    setRecipes((current) => recipe.id ? current.map((item) => item.id === recipe.id ? savedRecipe : item) : [savedRecipe, ...current])
    setSelectedId(savedRecipe.id)
    setEditing(null)
    setPage('recipes')
    setMobileDetail(true)

    try {
      await backend.saveUserData(user.id, { recipes: [savedRecipe, ...recipes.filter((item) => item.id !== savedRecipe.id)], favorites: [...favorites], categories: customCategories, settings })
      notify('Recipe saved to your account')
    } catch (error) {
      console.error('Save recipe error:', error)
      notify('Recipe saved locally, sync failed')
    }
  }

  function addCategory() {
    const name = window.prompt('New category name')
    if (name?.trim() && !categories.includes(name.trim())) setCustomCategories((current) => [...current, name.trim()])
  }

  function resetData() {
    if (!window.confirm('Reset all local recipes and preferences?')) return
    setRecipes(starterRecipes)
    setFavorites(new Set([1]))
    setCustomCategories([])
    setSettings(defaultSettings)
    notify('Local data reset')
  }

  async function login(credentials) {
    setBootstrapping(true)
    const signedInUser = credentials.mode === 'signup'
      ? await backend.signUp(credentials)
      : await backend.signIn(credentials)
    const data = await backend.loadUserData(signedInUser)
    setUser(signedInUser)
    setRecipes(data.recipes)
    setFavorites(new Set(data.favorites))
    setCustomCategories(data.categories)
    setSettings({ ...defaultSettings, ...data.settings, name: data.settings?.name || signedInUser.name })
    navigate('recipes')
  }

  async function signOut() {
    await backend.signOut()
    setUser(null)
    setRecipes(starterRecipes)
    setFavorites(new Set([1]))
    setCustomCategories([])
    setSettings(defaultSettings)
    setMobileMenu(false)
    setMobileDetail(false)
  }

  function renderPage() {
    if (page === 'form') return <RecipeFormPage recipe={editing} categories={categories} onSave={saveRecipe} onCancel={() => navigate('recipes')} />
    if (page === 'categories') return <CategoriesPage categories={categories} recipes={recipes} onAdd={addCategory} onSelect={selectCategory} />
    if (page === 'settings') return <SettingsPage settings={settings} user={user} onChange={setSettings} onReset={resetData} onSignOut={signOut} />
    return <>
      <RecipeList page={page} recipes={visibleRecipes} selectedId={selectedRecipe?.id} favorites={favorites} query={query} settings={settings} mobileDetail={mobileDetail} onQueryChange={setQuery} onSelect={openRecipe} onFavorite={toggleFavorite} onAdd={() => openRecipeForm()} onMenu={() => setMobileMenu((open) => !open)} />
      <RecipeDetail recipe={selectedRecipe} favorite={favorites.has(selectedRecipe?.id)} isOpen={mobileDetail} onFavorite={(event) => toggleFavorite(selectedRecipe.id, event)} onEdit={() => openRecipeForm(selectedRecipe)} onBack={() => setMobileDetail(false)} />
    </>
  }

  if (!user) return <LoginPage onLogin={login} />
  if (bootstrapping) {
    return <main className="app-shell"><div className="page-empty"><h2>Loading your account…</h2></div></main>
  }

  return <main className="app-shell">
    {toast && <div className="toast">{toast}</div>}
    <Sidebar page={page} isOpen={mobileMenu} categories={categories} recipes={recipes} activeCategory={activeCategory} user={user} profileName={settings.name} onNavigate={navigate} onSelectCategory={selectCategory} onAddCategory={addCategory} />
    {renderPage()}
    <MobileTabs page={page === 'form' ? 'recipes' : page} onNavigate={navigate} />
  </main>
}

export default App
