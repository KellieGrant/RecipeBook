import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeListing from './RecipeListing';
import Spinner from './Spinner';
import { useAuth } from '../contexts/AuthContext';
import { getAuthHeaders } from '../utils/auth';

const RecipeListings = ({ isHome = false, query = '', filters = {} }) => {
   const [recipes, setRecipes] = useState([]);
   const [loading, setLoading] = useState(true);
   const { isAuthenticated } = useAuth();

   useEffect(() => {
      const fetchRecipes = async () => {
         if (!isAuthenticated) {
            setLoading(false);
            return;
         }
         const apiUrl = isHome
            ? '/api/recipes?_limit=3'
            : '/api/recipes';
         try {
            const res = await fetch(apiUrl, { headers: getAuthHeaders() });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setRecipes(Array.isArray(data) ? data : []);
         } catch (error) {
            console.log('Error fetching data', error);
            setRecipes([]);
         } finally {
            setLoading(false);
         }
      };
      fetchRecipes();
   }, [isHome, isAuthenticated]);

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

   if (!isAuthenticated) {
      return (
         <section className='bg-light-bg px-4 py-10'>
            <div className='container-xl lg:container m-auto text-center'>
               <h2 className='text-3xl font-bold text-light-text mb-4'>
                  Your Recipes
               </h2>
               <p className='text-gray-600 dark:text-dark-muted mb-4'>
                  Log in to view and manage your recipes.
               </p>
               <Link
                  to='/login'
                  className='inline-block bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-white dark:text-dark-bg font-bold py-2 px-6 rounded-full'
               >
                  Log In
               </Link>
            </div>
         </section>
      );
   }

   return (
      <section className='bg-light-bg dark:bg-dark-bg px-4 py-10'>
         <div className='container-xl lg:container m-auto'>
            <h2 className='text-3xl font-bold text-light-text mb-6 text-center'>
               {isHome ? 'Recent Recipes' : 'My Recipes'}
            </h2>

            {loading ? (
               <Spinner loading={loading} />
            ) : (
               <>
                  {filteredRecipes.length === 0 ? (
                     <p className='text-center text-light-text dark:text-dark-muted'>
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
