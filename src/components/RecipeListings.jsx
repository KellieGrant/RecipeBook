import React from 'react';
import recipes from '../recipes.json';
import RecipeListing from './RecipeListing';

const RecipeListings = () => {
  const recentRecipies = recipes.slice(0, 3);

  return (
    <section className="bg-light-bg px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-light-text mb-6 text-center">
          Browse Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentRecipies.map((recipe) => (
            <RecipeListing key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeListings;
