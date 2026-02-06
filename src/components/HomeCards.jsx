import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

const HomeCards = () => {
   return (
      <section className='py-4'>
         <div className='container-xl lg:container m-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
               <Card>
                  <h2 className='text-2xl font-bold'>For the Foodies</h2>
                  <p className='mt-2 mb-4'>
                     Browse the menu and find the perfect dish to make
                  </p>
                  <Link
                     to='/recipes'
                     className='inline-block bg-light-accent dark:bg-dark-accent text-black dark:text-dark-bg rounded-lg px-4 py-2 hover:bg-[#6aa16e] dark:hover:opacity-90 shadow-md'
                  >
                     Browse Recipes
                  </Link>
               </Card>
               <Card bg='bg-light-surface'>
                  <h2 className='text-2xl font-bold'>For the Chefs</h2>
                  <p className='mt-2 mb-4'>
                     Add your recipe and help others cook something amazing
                  </p>
                  <Link
                     to='/add-recipe'
                     className='inline-block bg-light-accent dark:bg-dark-accent text-black dark:text-dark-bg rounded-lg px-4 py-2 hover:bg-[#6aa16e] dark:hover:opacity-90 shadow-md'
                  >
                     Add Recipe
                  </Link>
               </Card>
            </div>
         </div>
      </section>
   );
};

export default HomeCards;
