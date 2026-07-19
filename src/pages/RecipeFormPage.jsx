import { useState } from 'react'
import { fallbackRecipeImage } from '../data/recipes'
import MobilePageHeader from '../components/MobilePageHeader'

export default function RecipeFormPage({ recipe, categories, onSave, onCancel }) {
  const [form, setForm] = useState(recipe || { title: '', category: categories[0] || 'Dinner', time: '30 min', serves: 4, image: '', ingredients: [], steps: [] })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, image: form.image || fallbackRecipeImage })
  }

  return <div className="main-span"><MobilePageHeader title={recipe ? 'Edit recipe' : 'Add recipe'} onBack={onCancel} /><section className="content-page form-page">
    <div className="page-title"><div><span className="eyebrow">Recipe editor</span><h1>{recipe ? 'Edit recipe' : 'Add a recipe'}</h1><p>Everything is saved on this device.</p></div></div>
    <form className="recipe-form" onSubmit={submit}>
      <label className="wide">Recipe name<input required value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Sunday roast chicken" /></label>
      <label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Cooking time<input value={form.time} onChange={(event) => update('time', event.target.value)} placeholder="35 min" /></label>
      <label>Serves<input type="number" min="1" value={form.serves} onChange={(event) => update('serves', Number(event.target.value))} /></label>
      <label className="wide">Image URL<input value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://…" /></label>
      <label className="wide">Ingredients <small>One per line</small><textarea rows="7" value={form.ingredients.join('\n')} onChange={(event) => update('ingredients', event.target.value.split('\n').filter(Boolean))} /></label>
      <label className="wide">Instructions <small>One step per line</small><textarea rows="7" value={form.steps.join('\n')} onChange={(event) => update('steps', event.target.value.split('\n').filter(Boolean))} /></label>
      <div className="form-actions wide"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button className="primary-button">Save recipe</button></div>
    </form>
  </section></div>
}
