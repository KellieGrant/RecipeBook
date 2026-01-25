import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeListings from '../components/RecipeListings';

const RecipesPage = () => {
   const [query, setQuery] = useState('');

   return (
      <section>
         <SearchBar query={query} onQueryChange={setQuery} />
         <RecipeListings query={query} />
      </section>
   );
};

export default RecipesPage;
