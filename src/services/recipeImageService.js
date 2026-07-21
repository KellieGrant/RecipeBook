import { fallbackRecipeImage } from '../data/recipes'

const imageEndpoint = import.meta.env.VITE_RECIPE_IMAGE_ENDPOINT
const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

function searchTerms(title, category) {
  return `${title.trim()} ${category || ''} plated dish food photography`.trim()
}

function stableNumber(value) {
  let hash = 0
  for (const character of value) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0
  return Math.abs(hash)
}

async function resolveFromAiEndpoint(title, category) {
  const response = await fetch(imageEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, style: 'natural food photography' }),
  })
  if (!response.ok) throw new Error('The AI image service could not create an image.')
  const data = await response.json()
  if (!data.image_url) throw new Error('The AI image service returned no image.')
  return { url: data.image_url, source: 'ai' }
}

async function resolveFromUnsplash(title, category) {
  const query = new URLSearchParams({ query: searchTerms(title, category), per_page: '1', orientation: 'landscape', content_filter: 'high' })
  const response = await fetch(`https://api.unsplash.com/search/photos?${query}`, { headers: { Authorization: `Client-ID ${unsplashAccessKey}` } })
  if (!response.ok) throw new Error('Image search is temporarily unavailable.')
  const data = await response.json()
  const photo = data.results?.[0]
  if (!photo) throw new Error('No matching food photo was found.')
  return { url: `${photo.urls.regular}&auto=format&fit=crop&w=1400&q=85`, source: 'unsplash', attribution: { photographer: photo.user.name, link: photo.links.html } }
}

export async function findRecipeImage(title, category) {
  if (!title?.trim()) throw new Error('Add a recipe name before finding an image.')
  if (imageEndpoint) return resolveFromAiEndpoint(title, category)
  if (unsplashAccessKey) return resolveFromUnsplash(title, category)

  const query = encodeURIComponent(`${title.trim()},${category || 'food'},dish`)
  return { url: `https://loremflickr.com/1200/800/${query}?lock=${stableNumber(title)}`, source: 'automatic-search' }
}

export async function imageForRecipe(recipe) {
  if (recipe.image?.trim()) return { url: recipe.image.trim(), source: 'manual' }
  try { return await findRecipeImage(recipe.title, recipe.category) }
  catch { return { url: fallbackRecipeImage, source: 'fallback' } }
}
