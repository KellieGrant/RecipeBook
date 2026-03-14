import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

const HomeCards = () => {
   return (
      <section className='py-10 md:py-14 bg-light-bg dark:bg-dark-bg'>
         <div className='container-xl lg:container m-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-0'>
               <Card>
                  <h2 className='text-2xl font-heading font-bold text-dark-surface dark:text-dark-text'>
                     For the foodies
                  </h2>
                  <p className='mt-3 mb-6 text-light-text dark:text-dark-muted'>
                     Browse the menu and find the perfect dish to make
                  </p>
                  <Link
                     to='/recipes'
                     className='inline-flex items-center justify-center rounded-full bg-light-accent text-black dark:text-dark-bg px-6 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#6aa16e] transition-transform transition-shadow duration-150'
                  >
                     Browse Recipes
                  </Link>
               </Card>
               <Card bg='bg-light-surface'>
                  <h2 className='text-2xl font-heading font-bold text-dark-surface dark:text-dark-text'>
                     For the chefs
                  </h2>
                  <p className='mt-3 mb-6 text-light-text dark:text-dark-muted'>
                     Add your recipe and help others cook something amazing
                  </p>
                  <Link
                     to='/add-recipe'
                     className='inline-flex items-center justify-center rounded-full bg-light-accent text-black dark:text-dark-bg px-6 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#6aa16e] transition-transform transition-shadow duration-150'
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
