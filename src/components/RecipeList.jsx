import Icon from './Icon'
import { fallbackRecipeImage } from '../data/recipes'

export default function RecipeList({ page, recipes, selectedId, favorites, query, settings, mobileDetail, selecting, selectedForDelete, onQueryChange, onSelect, onToggleSelection, onToggleSelecting, onDeleteSelected, onFavorite, onAdd, onMenu }) {
  function activateRecipe(event, id) {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return
    if (event.type === 'keydown') event.preventDefault()
    selecting ? onToggleSelection(id) : onSelect(id)
  }

  return <section className={`recipe-browser ${settings.compact ? 'compact' : ''} ${settings.showImages ? '' : 'hide-images'} ${mobileDetail ? 'mobile-hidden' : ''}`}>
    <header className="mobile-header"><button onClick={onMenu}>☰</button><strong>{page === 'favorites' ? 'Favorites' : 'RecipeBook'}</strong><button onClick={onAdd}>＋</button></header>
    <div className="browser-tools">
      <label className="search"><Icon>⌕</Icon><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search recipes..." /><button type="button" className={selecting ? 'active' : ''} aria-label={selecting ? 'Cancel recipe selection' : 'Select recipes'} title={selecting ? 'Cancel selection' : 'Select recipes'} onClick={onToggleSelecting}>{selecting ? '×' : '☑'}</button></label>
      {selecting ? <button className="delete-selected" disabled={!selectedForDelete.size} onClick={onDeleteSelected}>Delete {selectedForDelete.size || ''}</button> : <button className="add-recipe" onClick={onAdd}><span>＋</span> Add Recipe</button>}
    </div>
    <div className="recipe-list">{recipes.length ? recipes.map((recipe) => <article key={recipe.id} className={`recipe-card ${selectedId === recipe.id && !selecting ? 'selected' : ''} ${selectedForDelete.has(recipe.id) ? 'marked' : ''}`} onClick={(event) => activateRecipe(event, recipe.id)} onKeyDown={(event) => activateRecipe(event, recipe.id)} tabIndex="0">
      {selecting && <span className="selection-check" aria-hidden="true">{selectedForDelete.has(recipe.id) ? '✓' : ''}</span>}
      <img src={recipe.image} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackRecipeImage }} />
      <div className="card-copy"><h2>{recipe.title}</h2><p><span className="desktop-only">{recipe.category} · </span>{recipe.time}</p></div>
      {!selecting && <button className={`heart ${favorites.has(recipe.id) ? 'filled' : ''}`} aria-label={`${favorites.has(recipe.id) ? 'Remove' : 'Add'} ${recipe.title} ${favorites.has(recipe.id) ? 'from' : 'to'} favorites`} onClick={(event) => onFavorite(recipe.id, event)}>{favorites.has(recipe.id) ? '♥' : '♡'}</button>}
    </article>) : <div className="empty-state"><span>{page === 'favorites' ? '♡' : '⌕'}</span><strong>{page === 'favorites' ? 'No favorites yet' : 'No recipes found'}</strong><p>{page === 'favorites' ? 'Tap a heart to save a recipe here.' : 'Try clearing your search or filters.'}</p></div>}</div>
    <footer className="recipe-count">{recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}</footer>
  </section>
}
