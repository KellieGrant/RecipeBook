import React from 'react';
import { Link } from 'react-router-dom';

const ViewAllRecipes = () => {
   return (
      <>
         <section className='m-auto max-w-lg my-12 px-6'>
            <Link
               to='/recipes'
               className='block rounded-full bg-light-accent dark:bg-dark-accent text-black dark:text-dark-bg font-semibold text-center py-4 px-6 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#6aa16e] dark:hover:opacity-90 transition-transform transition-shadow duration-150'
            >
               View All Recipes
            </Link>
         </section>
      </>
   );
};

export default ViewAllRecipes;
