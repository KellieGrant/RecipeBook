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
   const quantity = recipe.quantity;

   return (
      <>
         <section className='bg-light-bg dark:bg-dark-bg border-b border-light-border/40 dark:border-dark-muted/60'>
            <div className='container m-auto py-4 px-6 flex items-center justify-between gap-4'>
               <Link
                  to='/recipes'
                  className='inline-flex items-center text-sm font-semibold text-light-text dark:text-dark-muted hover:text-dark-surface dark:hover:text-dark-text transition-colors'
               >
                  <FaArrowLeft className='mr-2' /> Back to Recipes
               </Link>
               <span className='inline-flex items-center rounded-full bg-light-accent/20 dark:bg-dark-accent/20 px-3 py-1 text-xs font-medium text-light-accent dark:text-dark-accent'>
                  {recipe.type}
               </span>
            </div>
         </section>

         <section className='bg-light-bg dark:bg-dark-bg'>
            <div className='container m-auto py-8 md:py-12 px-6'>
               <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-8 items-start'>
                  <main>
                     <div className='bg-white/80 dark:bg-dark-surface rounded-2xl shadow-md border border-light-border/40 dark:border-dark-muted/70 overflow-hidden backdrop-blur-sm mb-6'>
                        {imageUrl && (
                           <div className='relative h-56 md:h-72 overflow-hidden'>
                              <img
                                 src={imageUrl}
                                 alt={recipe.title}
                                 className='w-full h-full object-cover'
                              />
                              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent' />
                              <div className='absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3'>
                                 <div>
                                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-white drop-shadow'>
                                       {recipe.title}
                                    </h1>
                                 </div>
                                 <div className='flex flex-wrap gap-2'>
                                    <span className='inline-flex items-center rounded-full bg-white/85 text-xs font-semibold text-dark-surface px-3 py-1'>
                                       {recipe.time}
                                    </span>
                                    {quantity ? (
                                       <span className='inline-flex items-center rounded-full bg-white/85 text-xs font-semibold text-dark-surface px-3 py-1'>
                                          {quantity}
                                       </span>
                                    ) : null}
                                 </div>
                              </div>
                           </div>
                        )}
                        {!imageUrl && (
                           <div className='px-6 pt-6'>
                              <h1 className='text-3xl md:text-4xl font-heading font-extrabold text-dark-surface dark:text-dark-text mb-2'>
                                 {recipe.title}
                              </h1>
                              <p className='text-sm text-light-text dark:text-dark-muted mb-4'>
                                 {recipe.type} • {recipe.time}
                                 {quantity ? ` • ${quantity}` : ''}
                              </p>
                           </div>
                        )}
                        <div className='px-6 pb-6 pt-4'>
                           <p className='text-sm text-light-text dark:text-dark-muted'>
                              Cook with confidence using the interactive checklist below. Tick off ingredients and steps as you go.
                           </p>
                        </div>
                     </div>

                     <div className='bg-white/80 dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-light-border/40 dark:border-dark-muted/70 backdrop-blur-sm'>
                        <h3 className='text-light-accent dark:text-dark-accent text-xl font-bold mb-6'>
                           Ingredients
                        </h3>

                        <ul className='space-y-3 my-2'>
                           {ingredientLines.map((item, index) => (
                              <li
                                 key={index}
                                 className='flex items-start gap-2 text-left'
                              >
                                 <input
                                    type='checkbox'
                                    className='mt-1 h-4 w-4 rounded border-light-accent accent-light-accent focus:ring-light-accent dark:border-dark-accent dark:accent-dark-accent dark:bg-dark-bg dark:focus:ring-dark-accent'
                                    checked={checkedIngredients[index] || false}
                                    onChange={() => toggleIngredient(index)}
                                 />
                                 <span
                                    className={`text-sm ${
                                       checkedIngredients[index]
                                          ? 'line-through text-gray-400 dark:text-dark-muted'
                                          : 'text-dark-surface dark:text-dark-text'
                                    }`}
                                 >
                                    {item}
                                 </span>
                              </li>
                           ))}
                        </ul>

                        <h3 className='text-light-accent dark:text-dark-accent text-lg font-bold mb-6'>
                           Recipe Instructions
                        </h3>

                        <ol className='space-y-3 mb-4'>
                           {instructionSteps.map((step, index) => (
                              <li
                                 key={index}
                                 className='flex items-start gap-3 text-left'
                              >
                                 <input
                                    type='checkbox'
                                    className='mt-1 h-4 w-4 rounded border-light-accent accent-light-accent focus:ring-light-accent dark:border-dark-accent dark:accent-dark-accent dark:bg-dark-bg dark:focus:ring-dark-accent'
                                    checked={checkedSteps[index] || false}
                                    onChange={() => toggleStep(index)}
                                 />
                                 <div>
                                    <span className='mr-2 font-semibold text-xs md:text-sm text-light-text dark:text-dark-muted'>
                                       {index + 1}.
                                    </span>
                                    <span
                                       className={`text-sm ${
                                          checkedSteps[index]
                                             ? 'line-through text-gray-400 dark:text-dark-muted'
                                             : 'text-dark-surface dark:text-dark-text'
                                       }`}
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
                  <aside className='space-y-6'>
                     <div className='bg-white/80 dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-light-border/40 dark:border-dark-muted/70 backdrop-blur-sm'>
                        <h3 className='text-light-accent dark:text-dark-accent text-m font-bold mb-1'>
                           Creator
                        </h3>

                        <p className='text-base text-dark-surface dark:text-dark-text mb-2'>
                           {recipe.creator.name}
                        </p>
                        <p className='text-xs text-light-text dark:text-dark-muted'>
                           Thanks to this creator for sharing their recipe.
                        </p>
                     </div>

                     {/* <!-- Manage --> */}
                     <div className='bg-white/80 dark:bg-dark-surface p-6 rounded-2xl shadow-md border border-light-border/40 dark:border-dark-muted/70 backdrop-blur-sm space-y-3'>
                        <h3 className='text-xl font-bold mb-6'>
                           Manage Recipe
                        </h3>
                        <Link
                           to={`/edit-recipe/${recipe.id}`}
                           className='bg-light-accent dark:bg-dark-accent hover:bg-[#6aa16e] dark:hover:opacity-90 text-black dark:text-dark-bg text-center font-semibold py-2.5 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-light-accent/70 dark:focus:ring-dark-accent/70 mt-2 block shadow-sm hover:shadow-md transition-shadow'
                        >
                           Edit Recipe
                        </Link>
                        <button
                           onClick={() => onDeleteClick(recipe.id)}
                           className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-red-400/70 mt-1 block dark:bg-red-600 dark:hover:bg-red-700 shadow-sm hover:shadow-md transition-shadow'
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
