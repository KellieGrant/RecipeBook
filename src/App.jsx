import React from 'react';
import {
   Route,
   createBrowserRouter,
   createRoutesFromElements,
   RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import RecipePage, { recipeLoader } from './pages/RecipePage';
import RecipeErrorPage from './pages/RecipeErrorPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import { useAuth } from './contexts/AuthContext';

const AppContent = () => {
   const { getAuthHeaders } = useAuth();

   const addRecipe = async newRecipe => {
      const res = await fetch('/api/recipes', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
         },
         body: JSON.stringify(newRecipe),
      });
      if (!res.ok) throw new Error('Failed to add recipe');
   };

   const deleteRecipe = async id => {
      const res = await fetch(`/api/recipes/${id}`, {
         method: 'DELETE',
         headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete recipe');
   };

   const updateRecipe = async recipe => {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
         },
         body: JSON.stringify(recipe),
      });
      if (!res.ok) throw new Error('Failed to update recipe');
   };

   const router = createBrowserRouter(
      createRoutesFromElements(
         <Route path='/' element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route element={<ProtectedLayout />}>
               <Route path='recipes' element={<RecipesPage />} />
               <Route
                  path='recipes/:id'
                  element={<RecipePage deleteRecipe={deleteRecipe} />}
                  loader={recipeLoader}
                  errorElement={<RecipeErrorPage />}
               />
               <Route path='add-recipe' element={<AddRecipePage addRecipeSubmit={addRecipe} />} />
               <Route
                  path='edit-recipe/:id'
                  element={<EditRecipePage updateRecipeSubmit={updateRecipe} />}
                  loader={recipeLoader}
                  errorElement={<RecipeErrorPage />}
               />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
         </Route>,
      ),
   );
   return <RouterProvider router={router} />;
};

const App = () => <AppContent />;

export default App;
