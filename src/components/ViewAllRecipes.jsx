import React from 'react';
import { Link } from 'react-router-dom';

const ViewAllRecipes = () => {
   return (
      <>
         <section className='m-auto max-w-lg my-10 px-6'>
            <Link
               to='/recipes'
               className='block bg-light-accent text-black text-center py-4 px-6 rounded-xl hover:bg-[#6aa16e]'
            >
               View All Recipes
            </Link>
         </section>
      </>
   );
};

export default ViewAllRecipes;
