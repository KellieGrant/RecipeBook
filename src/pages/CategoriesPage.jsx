import { categoryColors } from '../data/recipes'
import MobilePageHeader from '../components/MobilePageHeader'

export default function CategoriesPage({ categories, recipes, onAdd, onSelect, onBack }) {
  return <div className="main-span"><MobilePageHeader title="Categories" onBack={onBack} /><section className="content-page">
    <div className="page-title"><div><span className="eyebrow">Browse your collection</span><h1>Categories</h1><p>Keep every recipe easy to find.</p></div><button className="primary-button" onClick={onAdd}>＋ New category</button></div>
    <div className="category-grid">{categories.map((name) => {
      const count = recipes.filter((recipe) => recipe.category === name).length
      return <button key={name} onClick={() => onSelect(name)}><i style={{ background: categoryColors[name] || '#9b8bb2' }} /><span><strong>{name}</strong><small>{count} {count === 1 ? 'recipe' : 'recipes'}</small></span><b>→</b></button>
    })}</div>
  </section></div>
}
