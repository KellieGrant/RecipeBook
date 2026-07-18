import { useMemo, useState } from 'react'
import './App.css'

const recipes = [
  { id: 1, title: 'Creamy Garlic Chicken Pasta', category: 'Dinner', time: '35 min', serves: 4, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1400&q=85', ingredients: ['2 chicken breasts', '8 oz pasta (fettuccine or penne)', '3 cloves garlic, minced', '1 tbsp olive oil', '1 cup heavy cream', '1/2 cup grated parmesan', '2 cups baby spinach', 'Salt and pepper to taste'], steps: ['Cook pasta according to package instructions. Reserve 1/2 cup of pasta water, then drain.', 'Season chicken with salt and pepper. Heat olive oil in a pan over medium heat and cook for 6–7 minutes per side. Rest, then slice.', 'In the same pan, add garlic and cook for 30 seconds until fragrant.', 'Add heavy cream and bring to a simmer. Stir in parmesan until melted and smooth.', 'Add spinach and pasta, tossing until glossy. Top with sliced chicken and serve warm.'] },
  { id: 2, title: 'Beef Tacos', category: 'Dinner', time: '25 min', serves: 4, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 lb ground beef', '8 corn tortillas', '1 tbsp taco seasoning', '1 avocado, diced', '1/2 cup pico de gallo', 'Fresh cilantro and lime'], steps: ['Brown the beef in a large skillet and drain any excess fat.', 'Stir in taco seasoning with a splash of water and simmer for 5 minutes.', 'Warm the tortillas, fill with beef, and finish with avocado, pico, cilantro, and lime.'] },
  { id: 3, title: 'Honey Garlic Salmon', category: 'Dinner', time: '30 min', serves: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=85', ingredients: ['2 salmon fillets', '2 tbsp honey', '2 cloves garlic, minced', '1 tbsp soy sauce', '1 tsp sesame oil', 'Steamed greens, to serve'], steps: ['Whisk honey, garlic, soy sauce, and sesame oil together.', 'Sear salmon skin-side down until crisp, then turn.', 'Pour over the glaze and cook until sticky and the salmon flakes easily.'] },
  { id: 4, title: 'Classic Chili', category: 'Dinner', time: '1 hr', serves: 6, image: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 lb ground beef', '1 onion, diced', '1 can kidney beans', '1 can crushed tomatoes', '2 tbsp chili powder', '1 tsp ground cumin'], steps: ['Brown the beef with the onion in a heavy pot.', 'Add beans, tomatoes, and spices, then stir well.', 'Simmer gently for 40 minutes. Taste, season, and serve with your favorite toppings.'] },
  { id: 5, title: 'Blueberry Pancakes', category: 'Breakfast', time: '20 min', serves: 3, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 1/2 cups flour', '2 tsp baking powder', '1 cup milk', '1 egg', '1 cup blueberries', 'Maple syrup, to serve'], steps: ['Whisk the dry ingredients in a bowl.', 'Add milk and egg, stirring just until combined, then fold in blueberries.', 'Cook spoonfuls on a buttered skillet until golden on both sides.'] },
]

const categories = [['Dinner', 18, '#313338'], ['Lunch', 8, '#bba57e'], ['Breakfast', 6, '#8796b8'], ['Sides', 5, '#4c9bc6'], ['Desserts', 7, '#6d91b7'], ['Snacks', 4, '#e89b21']]

function Icon({ children, className = '' }) { return <span className={`icon ${className}`} aria-hidden="true">{children}</span> }

function App() {
  const [selectedId, setSelectedId] = useState(1)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [favorites, setFavorites] = useState(new Set([1]))
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')
  const visibleRecipes = useMemo(() => recipes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()) && (activeCategory === 'All' || r.category === activeCategory)), [query, activeCategory])
  const selected = recipes.find((recipe) => recipe.id === selectedId) || recipes[0]
  function toggleFavorite(id, event) { event?.stopPropagation(); setFavorites((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next }) }
  function chooseCategory(category) { setActiveCategory(category); setMobileMenu(false) }
  function notify(message) { setToast(message); window.setTimeout(() => setToast(''), 2200) }

  return (
    <main className="app-shell">
      {toast && <div className="toast" role="status">{toast}</div>}
      <aside className={`sidebar ${mobileMenu ? 'is-open' : ''}`}>
        <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="brand"><span className="brand-mark">▤</span> RecipeBook</div>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeCategory === 'All' ? 'active' : ''} onClick={() => chooseCategory('All')}><Icon>▦</Icon> All Recipes</button>
          <button onClick={() => notify('Favorites view is ready for your recipes.')}><Icon>♡</Icon> Favorites</button>
          <button onClick={() => notify('Choose a category below to filter recipes.')}><Icon>□</Icon> Categories</button>
        </nav>
        <div className="category-heading"><span>Categories</span><button aria-label="Add category" onClick={() => notify('Add category clicked')}>＋</button></div>
        <div className="category-list">{categories.map(([name, count, color]) => <button key={name} className={activeCategory === name ? 'active' : ''} onClick={() => chooseCategory(name)}><span className="category-name"><i style={{ background: color }} />{name}</span><span>{count}</span></button>)}</div>
        <div className="sidebar-footer"><button onClick={() => notify('Settings clicked')}><Icon>⚙</Icon> Settings</button><div className="profile"><span className="avatar">K</span><strong>Kellie</strong><span>⌄</span></div></div>
      </aside>

      <section className="recipe-browser">
        <header className="mobile-header"><button aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}>☰</button><strong>RecipeBook</strong><button aria-label="Add recipe" onClick={() => notify('Add recipe clicked')}>＋</button></header>
        <div className="browser-tools"><label className="search"><Icon>⌕</Icon><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes..." /><button aria-label="Filter recipes">☷</button></label><button className="add-recipe" onClick={() => notify('Add recipe clicked')}><span>＋</span> Add Recipe</button></div>
        <div className="recipe-list">
          {visibleRecipes.length ? visibleRecipes.map((recipe) => <article key={recipe.id} className={`recipe-card ${selectedId === recipe.id ? 'selected' : ''}`} onClick={() => setSelectedId(recipe.id)} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && setSelectedId(recipe.id)}><img src={recipe.image} alt="" /><div className="card-copy"><h2>{recipe.title}</h2><p><span className="desktop-only">{recipe.category} · </span>{recipe.time}</p></div><button className={`heart ${favorites.has(recipe.id) ? 'filled' : ''}`} onClick={(e) => toggleFavorite(recipe.id, e)} aria-label={`${favorites.has(recipe.id) ? 'Remove' : 'Add'} ${recipe.title} ${favorites.has(recipe.id) ? 'from' : 'to'} favorites`}>{favorites.has(recipe.id) ? '♥' : '♡'}</button></article>) : <div className="empty-state">No recipes found.<button onClick={() => { setQuery(''); setActiveCategory('All') }}>Clear filters</button></div>}
        </div>
        <footer className="recipe-count">{visibleRecipes.length} sample recipes</footer>
        <nav className="mobile-tabs" aria-label="Mobile navigation"><button className="active" onClick={() => chooseCategory('All')}><Icon>▦</Icon>All Recipes</button><button onClick={() => setMobileMenu(true)}><Icon>□</Icon>Categories</button><button onClick={() => notify('Favorites clicked')}><Icon>♡</Icon>Favorites</button><button onClick={() => notify('Settings clicked')}><Icon>⚙</Icon>Settings</button></nav>
      </section>

      <article className="recipe-detail">
        <div className="detail-actions"><button aria-label="Edit recipe" onClick={() => notify('Edit recipe clicked')}>✎</button><button aria-label="Favorite recipe" onClick={(e) => toggleFavorite(selected.id, e)}>{favorites.has(selected.id) ? '★' : '☆'}</button><button aria-label="More actions" onClick={() => notify('More actions clicked')}>•••</button></div>
        <div className="hero-image-wrap"><img src={selected.image} alt={`${selected.title}, ready to serve`} /><button className="hero-heart" onClick={(e) => toggleFavorite(selected.id, e)} aria-label="Toggle favorite">{favorites.has(selected.id) ? '♥' : '♡'}</button></div>
        <h1>{selected.title}</h1><p className="recipe-meta">{selected.category}<span>•</span>{selected.time}<span>•</span>Serves {selected.serves}</p><hr />
        <section className="recipe-section"><h2>Ingredients</h2><ul>{selected.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="recipe-section instructions"><h2>Instructions</h2><ol>{selected.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
      </article>
    </main>
  )
}
export default App
