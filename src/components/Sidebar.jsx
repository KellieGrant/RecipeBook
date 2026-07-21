import Icon from './Icon'
import { categoryColors } from '../data/recipes'

export default function Sidebar({ page, isOpen, categories, recipes, activeCategory, user, profileName, onNavigate, onSelectCategory, onAddCategory }) {
  return <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
    <div className="brand"><span className="brand-mark">▤</span> RecipeBook</div>
    <nav className="main-nav">
      <button className={page === 'recipes' ? 'active' : ''} onClick={() => onNavigate('recipes')}><Icon>▦</Icon> All Recipes</button>
      <button className={page === 'favorites' ? 'active' : ''} onClick={() => onNavigate('favorites')}><Icon>♡</Icon> Favorites</button>
      <button className={page === 'categories' ? 'active' : ''} onClick={() => onNavigate('categories')}><Icon>□</Icon> Categories</button>
    </nav>
    <div className="category-heading"><span>Categories</span><button onClick={onAddCategory}>＋</button></div>
    <div className="category-list">{categories.map((name) => <button key={name} className={activeCategory === name && page === 'recipes' ? 'active' : ''} onClick={() => onSelectCategory(name)}><span className="category-name"><i style={{ background: categoryColors[name] || '#9b8bb2' }} />{name}</span><span>{recipes.filter((recipe) => recipe.category === name).length}</span></button>)}</div>
    <div className="sidebar-footer">
      <button className={page === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}><Icon>⚙</Icon> Settings</button>
      <button className="profile" onClick={() => onNavigate('settings')}><span className="avatar">{profileName.charAt(0).toUpperCase()}</span><span className="profile-copy"><strong>{profileName}</strong><small>{user.email}</small></span><span>⌄</span></button>
    </div>
  </aside>
}
