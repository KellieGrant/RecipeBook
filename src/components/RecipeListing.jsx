import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const RecipeListing = ({ recipe }) => {
   const [showFullDescription, setShowFullDescription] = useState(false);

   let description = recipe.description;

   if (!showFullDescription) {
      description = description.substring(0, 90) + ' ...';
   }

   return (
      <>
         <div className='bg-light-secondary dark:bg-dark-surface rounded-xl shadow-md relative border border-transparent dark:border-dark-muted'>
            <div className='p-4'>
               <div className='mb-6'>
                  <div className='text-light-text dark:text-dark-muted my-2'>{recipe.type}</div>
                  <h3 className='text-xl font-bold'>{recipe.title}</h3>
               </div>

               <div className='mb-5'>{description}</div>
               <button
                  onClick={() =>
                     setShowFullDescription(prevState => !prevState)
                  }
                  className='text-light-text dark:text-dark-muted mb-5 hover:text-black dark:hover:text-dark-text'
               >
                  {showFullDescription ? 'Less' : 'more'}
               </button>

               <h3 className='text-light-accent dark:text-dark-accent mb-2'>{recipe.time}</h3>

               <div className='border border-gray-100 mb-5'></div>

               <div className='flex flex-col lg:flex-row justify-between mb-4'>
                  <Link
                     to={`/recipes/${recipe.id}`}
                     className='h-[36px] bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-black dark:text-dark-bg px-4 py-2 rounded-lg text-center text-sm'
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
