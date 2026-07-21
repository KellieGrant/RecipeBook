import { fallbackRecipeImage } from '../data/recipes'

const imageEndpoint = import.meta.env.VITE_RECIPE_IMAGE_ENDPOINT
const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

function searchTerms(title, category) {
  return `${title.trim()} ${category || ''} plated dish food photography`.trim()
}

const curatedImages = [
  { terms: ['pasta', 'spaghetti', 'noodle', 'fettuccine', 'lasagna'], url: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['taco', 'burrito', 'quesadilla', 'mexican'], url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['salmon', 'fish', 'seafood'], url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['chili', 'stew', 'soup'], url: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['pancake', 'waffle', 'crepe', 'breakfast'], url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['pizza'], url: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['burger', 'hamburger', 'sandwich'], url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['salad', 'vegetable', 'vegan'], url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=85' },
  { terms: ['cake', 'dessert', 'cupcake'], url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=85' },
]

function curatedImageFor(title, category) {
  const description = `${title} ${category}`.toLowerCase()
  return curatedImages.find(({ terms }) => terms.some((term) => description.includes(term)))?.url || fallbackRecipeImage
}

function validateImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const timeout = window.setTimeout(() => reject(new Error('Image validation timed out.')), 8000)
    image.onload = () => { window.clearTimeout(timeout); resolve(url) }
    image.onerror = () => { window.clearTimeout(timeout); reject(new Error('The returned image URL could not be loaded.')) }
    image.src = url
  })
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

function relevanceScore(fileTitle, recipeTitle) {
  const words = recipeTitle.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 2)
  const candidate = fileTitle.toLowerCase()
  return words.reduce((score, word) => score + (candidate.includes(word) ? 1 : 0), 0)
}

async function resolveFromWikimedia(title, category) {
  const params = new URLSearchParams({
    origin: '*', action: 'query', format: 'json', formatversion: '2',
    generator: 'search', gsrsearch: `${title.trim()} ${category === 'Desserts' ? 'dessert' : 'dish'}`,
    gsrnamespace: '6', gsrlimit: '8', prop: 'imageinfo',
    iiprop: 'url|mime', iiurlwidth: '1400',
  })
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`)
  if (!response.ok) throw new Error('Title-based image search is unavailable.')
  const pages = (await response.json()).query?.pages || []
  const candidates = pages
    .map((page) => ({ page, info: page.imageinfo?.[0], score: relevanceScore(page.title, title) }))
    .filter(({ info, score }) => info?.thumburl && info.mime?.startsWith('image/') && score > 0)
    .sort((a, b) => b.score - a.score)

  for (const { page, info } of candidates) {
    try {
      await validateImage(info.thumburl)
      return { url: info.thumburl, source: 'wikimedia', attribution: { title: page.title, link: info.descriptionurl } }
    } catch { /* try the next relevant result */ }
  }
  throw new Error('No matching dish photo was found.')
}

export async function findRecipeImage(title, category) {
  if (!title?.trim()) throw new Error('Add a recipe name before finding an image.')
  try {
    const result = imageEndpoint
      ? await resolveFromAiEndpoint(title, category)
      : unsplashAccessKey
        ? await resolveFromUnsplash(title, category)
        : await resolveFromWikimedia(title, category)
    await validateImage(result.url)
    return result
  } catch {
    const safeUrl = curatedImageFor(title, category)
    await validateImage(safeUrl)
    return { url: safeUrl, source: 'curated-match' }
  }
}

export async function imageForRecipe(recipe) {
  if (recipe.image?.trim()) {
    try { await validateImage(recipe.image.trim()); return { url: recipe.image.trim(), source: 'manual' } }
    catch { return findRecipeImage(recipe.title, recipe.category) }
  }
  try { return await findRecipeImage(recipe.title, recipe.category) }
  catch { return { url: fallbackRecipeImage, source: 'fallback' } }
}
