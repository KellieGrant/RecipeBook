export const starterRecipes = [
  { id: 1, title: 'Creamy Garlic Chicken Pasta', category: 'Dinner', time: '35 min', serves: 4, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1400&q=85', ingredients: ['2 chicken breasts', '8 oz pasta (fettuccine or penne)', '3 cloves garlic, minced', '1 tbsp olive oil', '1 cup heavy cream', '1/2 cup grated parmesan', '2 cups baby spinach', 'Salt and pepper to taste'], steps: ['Cook pasta according to package instructions. Reserve 1/2 cup of pasta water, then drain.', 'Season chicken with salt and pepper. Heat olive oil in a pan over medium heat and cook for 6–7 minutes per side. Rest, then slice.', 'In the same pan, add garlic and cook for 30 seconds until fragrant.', 'Add heavy cream and bring to a simmer. Stir in parmesan until melted and smooth.', 'Add spinach and pasta, tossing until glossy. Top with sliced chicken and serve warm.'] },
  { id: 2, title: 'Beef Tacos', category: 'Dinner', time: '25 min', serves: 4, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 lb ground beef', '8 corn tortillas', '1 tbsp taco seasoning', '1 avocado, diced', '1/2 cup pico de gallo', 'Fresh cilantro and lime'], steps: ['Brown the beef in a large skillet and drain any excess fat.', 'Stir in taco seasoning with a splash of water and simmer for 5 minutes.', 'Warm the tortillas, fill with beef, and finish with avocado, pico, cilantro, and lime.'] },
  { id: 3, title: 'Honey Garlic Salmon', category: 'Dinner', time: '30 min', serves: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=85', ingredients: ['2 salmon fillets', '2 tbsp honey', '2 cloves garlic, minced', '1 tbsp soy sauce', '1 tsp sesame oil', 'Steamed greens, to serve'], steps: ['Whisk honey, garlic, soy sauce, and sesame oil together.', 'Sear salmon skin-side down until crisp, then turn.', 'Pour over the glaze and cook until sticky and the salmon flakes easily.'] },
  { id: 4, title: 'Classic Chili', category: 'Dinner', time: '1 hr', serves: 6, image: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 lb ground beef', '1 onion, diced', '1 can kidney beans', '1 can crushed tomatoes', '2 tbsp chili powder', '1 tsp ground cumin'], steps: ['Brown the beef with the onion in a heavy pot.', 'Add beans, tomatoes, and spices, then stir well.', 'Simmer gently for 40 minutes. Taste, season, and serve with your favorite toppings.'] },
  { id: 5, title: 'Blueberry Pancakes', category: 'Breakfast', time: '20 min', serves: 3, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1400&q=85', ingredients: ['1 1/2 cups flour', '2 tsp baking powder', '1 cup milk', '1 egg', '1 cup blueberries', 'Maple syrup, to serve'], steps: ['Whisk the dry ingredients in a bowl.', 'Add milk and egg, stirring just until combined, then fold in blueberries.', 'Cook spoonfuls on a buttered skillet until golden on both sides.'] },
]

export const categoryColors = {
  Dinner: '#313338', Lunch: '#bba57e', Breakfast: '#8796b8',
  Sides: '#4c9bc6', Desserts: '#6d91b7', Snacks: '#e89b21',
}

export const defaultSettings = {
  compact: false,
  showImages: true,
  darkMode: false,
  name: 'Kellie',
}

export const fallbackRecipeImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85'
