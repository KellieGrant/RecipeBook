import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const RecipeErrorPage = () => {
   const error = useRouteError();

   return (
      <section className='text-center flex flex-col justify-center items-center min-h-[50vh] text-gray-900 dark:text-dark-text px-4'>
         <FaExclamationTriangle className='text-yellow-400 dark:text-yellow-500 text-6xl mb-4' />
         <h1 className='text-2xl font-bold mb-2'>Recipe not found</h1>
         <p className='text-gray-600 dark:text-dark-muted mb-6'>
            {error?.message || 'This recipe may have been removed or you don\'t have access to it.'}
         </p>
         <Link
            to='/recipes'
            className='text-white dark:text-dark-bg bg-light-accent dark:bg-dark-accent hover:opacity-90 rounded-md px-4 py-2'
         >
            Back to My Recipes
         </Link>
      </section>
   );
};

export default RecipeErrorPage;
