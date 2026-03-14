import React, { useState } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuthHeaders } from '../utils/auth';
import { apiUrl } from '../config';

const RecipePage = ({ deleteRecipe }) => {
   const navigate = useNavigate();
   const { id } = useParams();
   const recipe = useLoaderData();

   const ingredientLines =
      recipe?.creator?.ingredients
         ?.split('\n')
         .filter(item => item.trim() !== '') || [];

   const instructionSteps =
      recipe?.instructions
         ?.split('\n')
         .filter(step => step.trim() !== '') || [];

   const [checkedIngredients, setCheckedIngredients] = useState(
      () => ingredientLines.map(() => false),
   );

   const [checkedSteps, setCheckedSteps] = useState(
      () => instructionSteps.map(() => false),
   );

   const toggleIngredient = index => {
      setCheckedIngredients(prev =>
         prev.map((val, i) => (i === index ? !val : val)),
      );
   };

   const toggleStep = index => {
      setCheckedSteps(prev => prev.map((val, i) => (i === index ? !val : val)));
   };

   const onDeleteClick = async recipeId => {
      const confirmDelete = window.confirm(
         'Are you sure you want to delete this recipe',
      );

      if (!confirmDelete) return;

      try {
         await deleteRecipe(recipeId);

         toast.success('Recipe Deleted Successfully');

         navigate('/recipes');
      } catch (err) {
         console.error('Failed to delete recipe:', err);
         toast.error('Failed to delete recipe');
      }
   };

   const imageUrl = recipe.imageUrl || recipe.imgUrl;

   return (
      <>
         <section>
            <div className='bg-light-accent dark:bg-dark-accent w-full py-6 px-6'>
               <Link
                  to='/recipes'
                  className='text-black dark:text-dark-bg hover:font-bold flex items-center'
               >
                  <FaArrowLeft className='mr-2' /> Back to Recipes
               </Link>
            </div>
         </section>

         {imageUrl && (
            <section className='w-full h-48 md:h-64 overflow-hidden'>
               <img
                  src={imageUrl}
                  alt={recipe.title}
                  className='w-full h-full object-cover'
               />
            </section>
         )}

         <section className='bg-light-bg dark:bg-dark-bg'>
            <div className='container m-auto py-10 px-6'>
               <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
                  <main>
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md text-center md:text-left border border-transparent dark:border-dark-muted'>
                        <div className='text-gray-500 dark:text-dark-muted mb-4'>
                           {recipe.type}
                        </div>
                        <h1 className='text-3xl font-bold mb-4'>
                           {recipe.title}
                        </h1>

                        <h3 className='text-light-accent dark:text-dark-accent text-lg font-bold mb-2'>
                           Time
                        </h3>

                        <p className='mb-4'>{recipe.time}</p>
                     </div>

                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md mt-6 border border-transparent dark:border-dark-muted'>
                        <h3 className='text-light-accent dark:text-dark-accent text-xl font-bold mb-6'>
                           Ingredients
                        </h3>

                        <ul className='space-y-2 my-2'>
                           {ingredientLines.map((item, index) => (
                              <li
                                 key={index}
                                 className='flex items-start gap-2 text-left'
                              >
                                 <input
                                    type='checkbox'
                                    className='mt-1 h-4 w-4 rounded border-gray-300 text-light-accent focus:ring-light-accent dark:border-dark-muted dark:bg-dark-bg dark:focus:ring-dark-accent'
                                    checked={checkedIngredients[index] || false}
                                    onChange={() => toggleIngredient(index)}
                                 />
                                 <span
                                    className={
                                       checkedIngredients[index]
                                          ? 'line-through text-gray-400 dark:text-dark-muted'
                                          : ''
                                    }
                                 >
                                    {item}
                                 </span>
                              </li>
                           ))}
                        </ul>

                        <h3 className='text-light-accent dark:text-dark-accent text-lg font-bold mb-6'>
                           Recipe Instructions
                        </h3>

                        <ol className='space-y-3 mb-10'>
                           {instructionSteps.map((step, index) => (
                              <li
                                 key={index}
                                 className='flex items-start gap-3 text-left'
                              >
                                 <input
                                    type='checkbox'
                                    className='mt-1 h-4 w-4 rounded border-gray-300 text-light-accent focus:ring-light-accent dark:border-dark-muted dark:bg-dark-bg dark:focus:ring-dark-accent'
                                    checked={checkedSteps[index] || false}
                                    onChange={() => toggleStep(index)}
                                 />
                                 <div>
                                    <span className='mr-2 font-semibold'>
                                       {index + 1}.
                                    </span>
                                    <span
                                       className={
                                          checkedSteps[index]
                                             ? 'line-through text-gray-400 dark:text-dark-muted'
                                             : ''
                                       }
                                    >
                                       {step}
                                    </span>
                                 </div>
                              </li>
                           ))}
                        </ol>
                     </div>
                  </main>

                  {/* <!-- Sidebar --> */}
                  <aside>
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md border border-transparent dark:border-dark-muted'>
                        <h3 className='text-light-accent dark:text-dark-accent text-m font-bold mb-1'>
                           Creator
                        </h3>

                        <p className='text-l mb-6'>{recipe.creator.name}</p>
                     </div>

                     {/* <!-- Manage --> */}
                     <div className='bg-light-secondary dark:bg-dark-surface p-6 rounded-lg shadow-md mt-6 border border-transparent dark:border-dark-muted'>
                        <h3 className='text-xl font-bold mb-6'>
                           Manage Recipe
                        </h3>
                        <Link
                           to={`/edit-recipe/${recipe.id}`}
                           className='bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-white dark:text-dark-bg text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block'
                        >
                           Edit Recipe
                        </Link>
                        <button
                           onClick={() => onDeleteClick(recipe.id)}
                           className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block dark:bg-red-600 dark:hover:bg-red-700'
                        >
                           Delete Recipe
                        </button>
                     </div>
                  </aside>
               </div>
            </div>
         </section>
      </>
   );
};

const recipeLoader = async ({ params }) => {
   try {
      const res = await fetch(apiUrl(`/api/recipes/${params.id}`), {
         headers: getAuthHeaders(),
      });
      if (!res.ok) {
         throw new Error('Recipe not found');
      }
      const data = await res.json();
      return data;
   } catch (err) {
      console.error('Failed to fetch recipe:', err);
      throw err;
   }
};

export { RecipePage as default, recipeLoader };
