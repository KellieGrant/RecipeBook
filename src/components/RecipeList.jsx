import Icon from './Icon'
import MobileTabs from './MobileTabs'
import { fallbackRecipeImage } from '../data/recipes'

export default function RecipeList({ page, recipes, selectedId, favorites, query, settings, mobileDetail, onQueryChange, onSelect, onFavorite, onAdd, onMenu, onNavigate }) {
  return <section className={`recipe-browser ${settings.compact ? 'compact' : ''} ${settings.showImages ? '' : 'hide-images'} ${mobileDetail ? 'mobile-hidden' : ''}`}>
    <header className="mobile-header"><button onClick={onMenu}>☰</button><strong>{page === 'favorites' ? 'Favorites' : 'RecipeBook'}</strong><button onClick={onAdd}>＋</button></header>
    <div className="browser-tools"><label className="search"><Icon>⌕</Icon><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search recipes..." /><button>☷</button></label><button className="add-recipe" onClick={onAdd}><span>＋</span> Add Recipe</button></div>
    <div className="recipe-list">{recipes.length ? recipes.map((recipe) => <article key={recipe.id} className={`recipe-card ${selectedId === recipe.id ? 'selected' : ''}`} onClick={() => onSelect(recipe.id)} tabIndex="0"><img src={recipe.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackRecipeImage }} /><div className="card-copy"><h2>{recipe.title}</h2><p><span className="desktop-only">{recipe.category} · </span>{recipe.time}</p></div><button className={`heart ${favorites.has(recipe.id) ? 'filled' : ''}`} onClick={(event) => onFavorite(recipe.id, event)}>{favorites.has(recipe.id) ? '♥' : '♡'}</button></article>) : <div className="empty-state"><span>{page === 'favorites' ? '♡' : '⌕'}</span><strong>{page === 'favorites' ? 'No favorites yet' : 'No recipes found'}</strong><p>{page === 'favorites' ? 'Tap a heart to save a recipe here.' : 'Try clearing your search or filters.'}</p></div>}</div>
    <footer className="recipe-count">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}</footer>
    <MobileTabs page={page} onNavigate={onNavigate} />
  </section>
}
