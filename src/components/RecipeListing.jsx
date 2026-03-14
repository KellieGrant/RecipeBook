import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const RecipeListing = ({ recipe }) => {
   const [showFullDescription, setShowFullDescription] = useState(false);

   let description = recipe.description;

   if (!showFullDescription) {
      description = description.substring(0, 110) + ' ...';
   }

   return (
      <>
         <div className='bg-white/70 dark:bg-dark-surface rounded-2xl shadow-md relative border border-light-border/40 dark:border-dark-muted/70 backdrop-blur-sm overflow-hidden'>
            <div className='p-5 flex flex-col h-full'>
               <div className='mb-4'>
                  <div className='inline-flex px-3 py-1 rounded-full bg-light-accent/15 text-xs font-semibold uppercase tracking-wide text-light-text dark:text-dark-muted my-1'>
                     {recipe.type}
                  </div>
                  <h3 className='mt-2 text-lg font-heading font-bold text-dark-surface dark:text-dark-text line-clamp-2'>
                     {recipe.title}
                  </h3>
               </div>

               <div className='mb-4 text-sm text-light-text dark:text-dark-muted flex-1'>
                  {description}
               </div>
               <button
                  onClick={() =>
                     setShowFullDescription(prevState => !prevState)
                  }
                  className='self-start text-xs font-semibold text-light-accent dark:text-dark-accent mb-4 hover:underline'
               >
                  {showFullDescription ? 'Less' : 'more'}
               </button>

               <div className='flex items-center justify-between mt-auto'>
                  <span className='inline-flex items-center rounded-full bg-light-bg dark:bg-dark-bg/40 px-3 py-1 text-xs font-medium text-light-text dark:text-dark-muted'>
                     {recipe.time}
                  </span>

                  <Link
                     to={`/recipes/${recipe.id}`}
                     className='h-[36px] inline-flex items-center justify-center rounded-full bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-black dark:text-dark-bg px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-shadow'
                  >
                     Read More
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
};

export default RecipeListing;
