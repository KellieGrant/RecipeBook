import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';

const RecipeListing = ({ recipe }) => {
   const [showFullDescription, setShowFullDescription] = useState(false);

   let description = recipe.description;

   if (!showFullDescription) {
      description = description.substring(0, 90) + ' ...';
   }

   return (
      <>
         <div className='bg-light-secondary rounded-xl shadow-md relative'>
            <div className='p-4'>
               <div className='mb-6'>
                  <div className='text-light-text my-2'>{recipe.type}</div>
                  <h3 className='text-xl font-bold'>{recipe.title}</h3>
               </div>

               <div className='mb-5'>{description}</div>
               <button
                  onClick={() =>
                     setShowFullDescription(prevState => !prevState)
                  }
                  className='text-light-text mb-5 hover:text-black'
               >
                  {showFullDescription ? 'Less' : 'more'}
               </button>

               <h3 className='text-light-accent mb-2'>{recipe.salary}/ Year</h3>

               <div className='border border-gray-100 mb-5'></div>

               <div className='flex flex-col lg:flex-row justify-between mb-4'>
                  <div className='text-orange-700 mb-3'>
                     <FaMapMarker className='inline text-lg mb-1 mr-1' />
                     {recipe.location}
                  </div>
                  <Link
                     to={`/recipe/${recipe.id}`}
                     className='h-[36px] bg-light-accent hover:bg-[#6aa16e] text-black px-4 py-2 rounded-lg text-center text-sm'
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
