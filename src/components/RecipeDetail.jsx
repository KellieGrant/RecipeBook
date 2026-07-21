import Icon from './Icon'
import { fallbackRecipeImage } from '../data/recipes'

export default function RecipeDetail({ recipe, favorite, isOpen, onFavorite, onEdit, onBack }) {
  if (!recipe) return <div className="page-empty"><Icon>⌕</Icon><h2>Select a recipe</h2><p>Choose one from the list to see the full recipe.</p></div>
  return <article className={`recipe-detail detail-page ${isOpen ? 'is-open' : ''}`}>
    <div className="detail-actions"><button className="mobile-back" onClick={onBack}>‹ Back</button><button aria-label="Edit recipe" onClick={onEdit}>✎</button><button aria-label="Favorite recipe" onClick={onFavorite}>{favorite ? '★' : '☆'}</button><button aria-label="More actions">•••</button></div>
    <div className="hero-image-wrap"><img src={recipe.image} alt={`${recipe.title}, ready to serve`} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackRecipeImage }} /><button className="hero-heart" onClick={onFavorite}>{favorite ? '♥' : '♡'}</button></div>
    <h1>{recipe.title}</h1><p className="recipe-meta">{recipe.category}<span>•</span>{recipe.time}<span>•</span>Serves {recipe.serves}</p><hr />
    <section className="recipe-section"><h2>Ingredients</h2><ul>{recipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="recipe-section instructions"><h2>Instructions</h2><ol>{recipe.steps.map((step) => <li key={step}>{step}</li>)}</ol></section>
  </article>
}
