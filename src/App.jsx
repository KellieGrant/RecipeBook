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

const router = createBrowserRouter(
   createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
         <Route index element={<HomePage />} />
         <Route path='/recipes' element={<RecipesPage />} />
         <Route
            path='/recipes/:id'
            element={<RecipePage />}
            loader={recipeLoader}
         />
         <Route path='/add-recipe' element={<AddRecipePage />} />
         <Route path='*' element={<NotFoundPage />} />
      </Route>,
   ),
);

const App = () => {
   return <RouterProvider router={router} />;
};

export default App;
