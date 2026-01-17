import React from 'react';
import {
   Route,
   createBrowserRouter,
   createRoutesFromElements,
   RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import NotFoundPage from './pages/NotFoundPage';
import RecipePage, { recipeLoader } from './pages/RecipePage';
import AddRecipePage from './pages/AddRecipePage';

const App = () => {
   // Add New Recipe
   const addRecipe = async newRecipe => {
      const res = await fetch('/api/recipes', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newRecipe),
      });
      return;
   };

   // Delete Recipe
   const deleteRecipe = async id => {
      console.log('delete', id);
   };

   const router = createBrowserRouter(
      createRoutesFromElements(
         <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='/recipes' element={<RecipesPage />} />
            <Route
               path='/recipes/:id'
               element={<RecipePage deleteRecipe={deleteRecipe} />}
               loader={recipeLoader}
            />
            <Route
               path='/add-recipe'
               element={<AddRecipePage addRecipeSubmit={addRecipe} />}
            />
            <Route path='*' element={<NotFoundPage />} />
         </Route>,
      ),
   );
   return <RouterProvider router={router} />;
};

export default App;
