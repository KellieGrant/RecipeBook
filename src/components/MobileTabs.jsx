import Icon from './Icon'

export default function MobileTabs({ page, onNavigate }) {
  const tabs = [['recipes', '▦', 'Recipes'], ['categories', '□', 'Categories'], ['favorites', '♡', 'Favorites'], ['settings', '⚙', 'Settings']]
  return <nav className="mobile-tabs">{tabs.map(([id, icon, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => onNavigate(id)}><Icon>{icon}</Icon>{label}</button>)}</nav>
}
