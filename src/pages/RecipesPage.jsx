import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeListings from '../components/RecipeListings';
import RecipeFiltersDrawer from '../components/RecipeFiltersDrawer';

const RecipesPage = () => {
   const [query, setQuery] = useState('');
   const [filtersOpen, setFiltersOpen] = useState(false);
   const [filters, setFilters] = useState({
      mealTypes: [],
      maxTimeMinutes: '',
      availableIngredients: '',
      allowedMissingIngredients: 0,
   });

   return (
      <section>
         <SearchBar
            query={query}
            onQueryChange={setQuery}
            onOpenFilters={() => setFiltersOpen(true)}
         />
         <RecipeFiltersDrawer
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            filters={filters}
            onChange={setFilters}
            onClear={() =>
               setFilters({
                  mealTypes: [],
                  maxTimeMinutes: '',
                  availableIngredients: '',
                  allowedMissingIngredients: 0,
               })
            }
         />
         <RecipeListings query={query} filters={filters} />
      </section>
   );
};

export default RecipesPage;
