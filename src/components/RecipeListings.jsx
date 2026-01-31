import React from 'react';
import { useState, useEffect } from 'react';
import RecipeListing from './RecipeListing';
import Spinner from './Spinner';

const RecipeListings = ({ isHome = false, query = '', filters = {} }) => {
   const [recipes, setRecipes] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRecipes = async () => {
         const apiUrl = isHome
            ? 'http://localhost:5000/recipes?_limit=3'
            : 'http://localhost:5000/recipes';
         try {
            const res = await fetch(apiUrl);
            const data = await res.json();
            console.log('Fetched recipes:', data);
            setRecipes(data);
         } catch (error) {
            console.log('Error fetching data', error);
         } finally {
            setLoading(false);
         }
      };
      fetchRecipes();
   }, [isHome]);

   const parseTimeToMinutes = timeValue => {
      if (!timeValue) return null;
      const s = String(timeValue).toLowerCase();

      const hourMatch = s.match(/(\d+)\s*(h|hr|hrs|hour|hours)\b/);
      const minuteMatch = s.match(/(\d+)\s*(m|min|mins|minute|minutes)\b/);

      if (!hourMatch && !minuteMatch) {
         const fallback = s.match(/(\d+)/);
         return fallback ? Number(fallback[1]) : null;
      }

      const hours = hourMatch ? Number(hourMatch[1]) : 0;
      const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
      return hours * 60 + minutes;
   };

   const buildAvailableKeywordSet = value => {
      const raw = String(value ?? '')
         .toLowerCase()
         .replace(/[\r\n]+/g, ',');

      const parts = raw
         .split(',')
         .map(s => s.trim())
         .filter(Boolean);

      const stop = new Set([
         'and',
         'or',
         'to',
         'taste',
         'optional',
         'fresh',
         'diced',
         'sliced',
         'minced',
         'shredded',
         'grated',
         'cooked',
         'drained',
      ]);

      const keywords = new Set();
      for (const p of parts) {
         p.replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .map(w => w.trim())
            .filter(Boolean)
            .filter(w => !stop.has(w))
            .filter(w => !/^\d+$/.test(w))
            .forEach(w => keywords.add(w));
      }
      return keywords;
   };

   const countMissingIngredientLines = (ingredientsText, availableKeywords) => {
      const text = String(ingredientsText ?? '');
      if (!text.trim()) return 0;

      const stop = new Set([
         'and',
         'or',
         'to',
         'taste',
         'optional',
         'fresh',
         'diced',
         'sliced',
         'minced',
         'shredded',
         'grated',
         'cooked',
         'drained',
         'with',
         'for',
         'serve',
      ]);

      const units = new Set([
         'tbsp',
         'tablespoon',
         'tablespoons',
         'tsp',
         'teaspoon',
         'teaspoons',
         'cup',
         'cups',
         'lb',
         'lbs',
         'pound',
         'pounds',
         'oz',
         'g',
         'kg',
         'ml',
         'l',
         'can',
         'cans',
         'clove',
         'cloves',
      ]);

      const pantry = new Set(['salt', 'pepper', 'water']);

      const lines = text
         .split('\n')
         .map(l => l.trim())
         .filter(Boolean);

      let missing = 0;
      for (const line of lines) {
         const lower = line.toLowerCase();
         if (lower.includes('optional')) continue;
         if (lower.includes('to serve')) continue;

         const words = lower
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .map(w => w.trim())
            .filter(Boolean)
            .filter(w => !stop.has(w))
            .filter(w => !units.has(w))
            .filter(w => !/^\d+$/.test(w));

         if (words.length === 0) continue;
         if (words.every(w => pantry.has(w))) continue;

         const hasAny = words.some(w => availableKeywords.has(w));
         if (!hasAny) missing += 1;
      }

      return missing;
   };

   const normalizedQuery = query.trim().toLowerCase();
   const queryWords = normalizedQuery.length
      ? normalizedQuery.split(/\s+/)
      : [];
   const maxTimeMinutesRaw = filters?.maxTimeMinutes ?? '';
   const maxTimeMinutes =
      maxTimeMinutesRaw === '' || maxTimeMinutesRaw === null
         ? null
         : Number(maxTimeMinutesRaw);
   const selectedMealTypes = new Set(filters?.mealTypes ?? []);
   const availableIngredients = String(
      filters?.availableIngredients ?? '',
   ).trim();
   const allowedMissingIngredients = Number(
      filters?.allowedMissingIngredients ?? 0,
   );

   const availableKeywords =
      availableIngredients.length > 0
         ? buildAvailableKeywordSet(availableIngredients)
         : null;

   const filteredRecipes = Array.isArray(recipes)
      ? recipes.filter(r => {
           const title = String(r?.title ?? '').toLowerCase();
           if (
              queryWords.length &&
              !queryWords.every(word => title.includes(word))
           )
              return false;

           if (selectedMealTypes.size > 0 && !selectedMealTypes.has(r?.type))
              return false;

           if (maxTimeMinutes !== null && !Number.isNaN(maxTimeMinutes)) {
              const recipeMins = parseTimeToMinutes(r?.time);
              if (recipeMins !== null && recipeMins > maxTimeMinutes)
                 return false;
           }

           if (availableKeywords) {
              const missing = countMissingIngredientLines(
                 r?.creator?.ingredients,
                 availableKeywords,
              );
              if (missing > allowedMissingIngredients) return false;
           }

           return true;
        })
      : [];

   return (
      <section className='bg-light-bg px-4 py-10'>
         <div className='container-xl lg:container m-auto'>
            <h2 className='text-3xl font-bold text-light-text mb-6 text-center'>
               {isHome ? 'Recent Recipes' : 'Browse Recipes'}
            </h2>

            {loading ? (
               <Spinner loading={loading} />
            ) : (
               <>
                  {filteredRecipes.length === 0 ? (
                     <p className='text-center text-light-text'>
                        No recipes found.
                     </p>
                  ) : (
                     <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {filteredRecipes.map(recipe => (
                           <RecipeListing key={recipe.id} recipe={recipe} />
                        ))}
                     </div>
                  )}
               </>
            )}
         </div>
      </section>
   );
};

export default RecipeListings;
